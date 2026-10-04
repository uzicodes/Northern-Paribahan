import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { resolveServerSessionId } from '@/lib/session';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params;
    const body = await request.json().catch(() => ({}));
    const { seatNumber, sessionId: rawSessionId } = body;
    const sessionId = resolveServerSessionId(request, rawSessionId);

    if (!scheduleId || !seatNumber || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: seatNumber and sessionId are required.' },
        { status: 400 }
      );
    }

    // Delete the seat lock matching scheduleId, seatNumber, and sessionId
    const deleted = await prisma.seatLock.deleteMany({
      where: {
        scheduleId,
        seatNumber,
        sessionId,
      },
    });

    // Broadcast Pusher event if a lock was removed
    if (deleted.count > 0) {
      try {
        if (process.env.PUSHER_APP_ID && process.env.PUSHER_SECRET) {
          await pusherServer.trigger(`schedule-${scheduleId}`, 'seat:unlocked', {
            seatNumber,
          });
        }
      } catch (pusherErr) {
        console.error('[Pusher Error] Failed to broadcast seat:unlocked:', pusherErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error unlocking seat:', error);
    return NextResponse.json({ error: 'Internal server error while unlocking seat' }, { status: 500 });
  }
}
