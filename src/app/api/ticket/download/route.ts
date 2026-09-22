import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateTicketPdfBuffer, TicketData } from '@/lib/email';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pnr = searchParams.get('pnr')?.trim();

    if (!pnr) {
      return NextResponse.json(
        { error: 'Ticket Reference / PNR or Transaction ID is required.' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: pnr },
          { id: pnr.toLowerCase() },
          { transactionId: pnr },
        ],
      },
      include: {
        user: true,
        tickets: {
          orderBy: {
            seatNumber: 'asc',
          },
        },
        schedule: {
          include: {
            bus: true,
            route: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: `No booking found for reference "${pnr}".` },
        { status: 404 }
      );
    }

    // Only allow ticket download for confirmed or pending bookings
    if (booking.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'This booking has been cancelled and its E-Ticket is void.' },
        { status: 400 }
      );
    }

    const depDate = new Date(booking.schedule.departureTime);
    const arrDate = new Date(booking.schedule.arrivalTime);

    const ticketData: TicketData = {
      ticketId: booking.id,
      passengerName: booking.user.name || 'Valued Passenger',
      passengerEmail: booking.user.email,
      busModel: booking.schedule.bus?.modelName || booking.schedule.busName || 'Scania Touring HD',
      busReg: booking.schedule.registrationNumber || booking.schedule.bus?.registrationNumber || 'NP-COACH',
      busTier: booking.schedule.bus?.tier || 'PREMIUM',
      origin: booking.schedule.origin || booking.schedule.route.origin,
      destination: booking.schedule.destination || booking.schedule.route.destination,
      departureTime: bstDateTimeFormatter.format(depDate),
      arrivalTime: bstDateTimeFormatter.format(arrDate),
      seats: booking.tickets.map((t) => t.seatNumber),
      totalFare: booking.totalFare,
    };

    const pdfBuffer = await generateTicketPdfBuffer(ticketData);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Ticket-${booking.id.toUpperCase()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('Error generating ticket PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate ticket PDF. Please try again.' },
      { status: 500 }
    );
  }
}
