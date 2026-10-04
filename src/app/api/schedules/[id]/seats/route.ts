import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params;

    // Prune stale expired locks on fetch
    await prisma.seatLock.deleteMany({
      where: {
        scheduleId,
        expiresAt: { lt: new Date() },
      },
    });

    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        tickets: {
          select: { seatNumber: true },
        },
        seatLocks: {
          where: {
            expiresAt: { gt: new Date() },
          },
          select: {
            seatNumber: true,
            sessionId: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    const bookedSeats = schedule.tickets.map((t) => t.seatNumber);
    const activeLocks = schedule.seatLocks.map((l) => ({
      seatNumber: l.seatNumber,
      sessionId: l.sessionId,
      expiresAt: l.expiresAt.toISOString(),
    }));

    return NextResponse.json(
      {
        scheduleId: schedule.id,
        bookedSeats,
        activeLocks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to retrieve schedule seats:', error);
    return NextResponse.json({ error: 'Failed to retrieve schedule seats' }, { status: 500 });
  }
}
