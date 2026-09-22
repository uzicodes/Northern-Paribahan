'use server';

import { prisma } from '@/lib/db';
import { VerifiedTicket, VerifyTicketResponse, BookingStatus } from '@/types/ticket';

const bstDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Dhaka',
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const bstTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Dhaka',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

/**
 * Normalizes Prisma's BookingStatus enum to the frontend BookingStatus contract.
 */
function normalizeBookingStatus(status: string): BookingStatus {
  switch (status.toUpperCase()) {
    case 'CONFIRMED':
    case 'PAID':
      return 'PAID';
    case 'PENDING':
      return 'PENDING';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return 'FAILED';
  }
}

/**
 * Server action to verify a booking and retrieve its full journey and passenger details
 * using either the Booking ID (PNR) or Payment Transaction ID.
 */
export async function verifyTicketAction(rawPnr: string): Promise<VerifyTicketResponse> {
  try {
    if (!rawPnr || typeof rawPnr !== 'string') {
      return {
        success: false,
        error: 'Please enter a valid Booking Reference (PNR) or Transaction ID.',
      };
    }

    const trimmedRef = rawPnr.trim();

    if (!trimmedRef) {
      return {
        success: false,
        error: 'Booking reference or Transaction ID cannot be empty.',
      };
    }

    // Query booking by either Booking ID or Payment Transaction ID
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: trimmedRef },
          { id: trimmedRef.toLowerCase() },
          { transactionId: trimmedRef },
        ],
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        tickets: {
          select: {
            seatNumber: true,
          },
          orderBy: {
            seatNumber: 'asc',
          },
        },
        schedule: {
          include: {
            bus: {
              select: {
                modelName: true,
                registrationNumber: true,
                tier: true,
              },
            },
            route: {
              select: {
                origin: true,
                destination: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return {
        success: false,
        error: `No ticket found for reference "${trimmedRef}". Please verify the PNR or Transaction ID and try again.`,
      };
    }

    const depDate = new Date(booking.schedule.departureTime);
    const arrDate = new Date(booking.schedule.arrivalTime);
    const createdDate = new Date(booking.createdAt);

    const verifiedTicket: VerifiedTicket = {
      ticketId: booking.id,
      transactionId: booking.transactionId || undefined,
      passengerName: booking.user.name || 'Valued Passenger',
      passengerEmail: booking.user.email,
      passengerPhone: booking.user.phoneNumber || undefined,
      origin: booking.schedule.origin || booking.schedule.route.origin,
      destination: booking.schedule.destination || booking.schedule.route.destination,
      departureDate: bstDateFormatter.format(depDate),
      departureTime: bstTimeFormatter.format(depDate),
      arrivalTime: bstTimeFormatter.format(arrDate),
      busModel: booking.schedule.bus?.modelName || booking.schedule.busName || 'Scania Touring HD',
      busTier: booking.schedule.bus?.tier || 'PREMIUM',
      busReg: booking.schedule.registrationNumber || booking.schedule.bus?.registrationNumber || 'NP-COACH',
      seats: booking.tickets.map((t) => t.seatNumber),
      totalFare: booking.totalFare,
      status: normalizeBookingStatus(booking.status),
      createdAt: bstDateFormatter.format(createdDate),
    };

    return {
      success: true,
      data: verifiedTicket,
    };
  } catch (error: any) {
    console.error('Error in verifyTicketAction:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while verifying the ticket. Please try again later.',
    };
  }
}

