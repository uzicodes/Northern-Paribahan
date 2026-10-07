import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { resolveServerSessionId } from '@/lib/session';
import { seatLockRateLimit } from '@/lib/ratelimit';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params;
    const body = await request.json().catch(() => ({}));
    const { seatNumber, sessionId: rawSessionId } = body;
    const sessionId = resolveServerSessionId(request, rawSessionId);

    // Rate limiting check via Upstash Redis (10 requests per 10 seconds)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp;
    const identifier = clientIp || sessionId || 'anonymous';

    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const { success, limit, remaining, reset } = await seatLockRateLimit.limit(identifier);
        if (!success) {
          return NextResponse.json(
            { error: 'Too many seat selection requests. Please wait a moment and try again.' },
            {
              status: 429,
              headers: {
                'Retry-After': Math.max(1, Math.ceil((reset - Date.now()) / 1000)).toString(),
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString(),
              },
            }
          );
        }
      } catch (rateLimitErr) {
        console.error('[RateLimit Error] Failed to verify rate limit:', rateLimitErr);
      }
    }

    if (!scheduleId || !seatNumber || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: seatNumber and sessionId are required.' },
        { status: 400 }
      );
    }

    // Verify schedule exists
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      select: { id: true },
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    // Atomic transaction: clean stale locks, check booked tickets, acquire/refresh lock
    const lock = await prisma.$transaction(async (tx) => {
      // 1. Clean up stale locks for this seat on this schedule
      await tx.seatLock.deleteMany({
        where: {
          scheduleId,
          seatNumber,
          expiresAt: { lt: new Date() },
        },
      });

      // 2. Check if seat is permanently booked
      const bookedTicket = await tx.ticket.findFirst({
        where: {
          scheduleId,
          seatNumber,
          booking: {
            status: { in: ['CONFIRMED', 'PENDING'] },
          },
        },
      });

      if (bookedTicket) {
        throw new Error('SEAT_ALREADY_BOOKED');
      }

      // 3. Check if an active lock exists
      const existingLock = await tx.seatLock.findUnique({
        where: {
          scheduleId_seatNumber: {
            scheduleId,
            seatNumber,
          },
        },
      });

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

      if (existingLock) {
        if (existingLock.expiresAt <= new Date()) {
          // Stale lock: take over
          return await tx.seatLock.update({
            where: { id: existingLock.id },
            data: {
              sessionId,
              expiresAt,
            },
          });
        }

        if (existingLock.sessionId !== sessionId) {
          throw new Error('SEAT_LOCKED_BY_OTHER');
        }

        // Same session: refresh lock duration
        return await tx.seatLock.update({
          where: { id: existingLock.id },
          data: {
            expiresAt,
          },
        });
      }

      // 4. Create new lock
      return await tx.seatLock.create({
        data: {
          scheduleId,
          seatNumber,
          sessionId,
          expiresAt,
        },
      });
    });

    // 5. Trigger Pusher broadcast
    try {
      if (process.env.PUSHER_APP_ID && process.env.PUSHER_SECRET) {
        await pusherServer.trigger(`schedule-${scheduleId}`, 'seat:locked', {
          seatNumber,
          sessionId,
          expiresAt: lock.expiresAt.toISOString(),
        });
      }
    } catch (pusherErr) {
      console.error('[Pusher Error] Failed to broadcast seat:locked:', pusherErr);
    }

    return NextResponse.json({ success: true, lock }, { status: 200 });
  } catch (error: any) {
    if (error?.message === 'SEAT_ALREADY_BOOKED') {
      return NextResponse.json({ error: 'Seat is already booked' }, { status: 409 });
    }
    if (error?.message === 'SEAT_LOCKED_BY_OTHER') {
      return NextResponse.json({ error: 'Seat is currently selected by another passenger' }, { status: 409 });
    }

    console.error('Error locking seat:', error);
    return NextResponse.json({ error: 'Internal server error while locking seat' }, { status: 500 });
  }
}
