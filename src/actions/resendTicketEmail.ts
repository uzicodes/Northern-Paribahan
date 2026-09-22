'use server';

import { prisma } from '@/lib/db';
import { sendTicketEmail, TicketData } from '@/lib/email';

const bstDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Dhaka',
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

export async function resendTicketEmailAction(
  pnrOrTxnId: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const trimmed = pnrOrTxnId?.trim();
    if (!trimmed) {
      return { success: false, error: 'Booking Reference or Transaction ID is required.' };
    }

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: trimmed },
          { id: trimmed.toLowerCase() },
          { transactionId: trimmed },
        ],
      },
      include: {
        user: true,
        tickets: {
          orderBy: { seatNumber: 'asc' },
        },
        schedule: {
          include: { bus: true, route: true },
        },
      },
    });

    if (!booking) {
      return { success: false, error: `No booking found for "${trimmed}".` };
    }

    if (!booking.user?.email) {
      return { success: false, error: 'No passenger email associated with this booking.' };
    }

    const ticketData: TicketData = {
      ticketId: booking.id,
      passengerName: booking.user.name || 'Valued Passenger',
      passengerEmail: booking.user.email,
      busModel: booking.schedule.bus?.modelName || booking.schedule.busName || 'Scania Touring HD',
      busReg: booking.schedule.registrationNumber || booking.schedule.bus?.registrationNumber || 'NP-COACH',
      busTier: booking.schedule.bus?.tier || 'PREMIUM',
      origin: booking.schedule.origin || booking.schedule.route.origin,
      destination: booking.schedule.destination || booking.schedule.route.destination,
      departureTime: bstDateTimeFormatter.format(new Date(booking.schedule.departureTime)),
      arrivalTime: bstDateTimeFormatter.format(new Date(booking.schedule.arrivalTime)),
      seats: booking.tickets.map((t) => t.seatNumber),
      totalFare: booking.totalFare,
    };

    const result = await sendTicketEmail(booking.user.email, ticketData);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to dispatch email via Resend.' };
    }

    return {
      success: true,
      message: `E-Ticket boarding pass has been dispatched to ${booking.user.email}!`,
    };
  } catch (error: any) {
    console.error('[resendTicketEmailAction ERROR]:', error);
    return { success: false, error: error?.message || 'Failed to resend confirmation email.' };
  }
}

