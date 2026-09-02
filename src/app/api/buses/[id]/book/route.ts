import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const body = await request.json();
        const { userId, scheduleId, seatNumbers } = body;
        // Normalise seatNumbers if single string or array
        const normalizedSeatNumbers = Array.isArray(seatNumbers)
            ? seatNumbers
            : typeof seatNumbers === 'string'
            ? [seatNumbers]
            : [];

        if (!userId || !scheduleId || normalizedSeatNumbers.length === 0) {
            return NextResponse.json(
                { error: 'Missing required booking fields' },
                { status: 400 }
            );
        }

        // Fetch schedule to get the fare
        const schedule = await prisma.schedule.findUnique({
            where: { id: scheduleId },
        });

        if (!schedule) {
            return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
        }

        const totalFare = schedule.fare * normalizedSeatNumbers.length;

        // Use a transaction to ensure booking and tickets are created atomically
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create the Booking record
            const booking = await tx.booking.create({
                data: {
                    userId,
                    scheduleId,
                    totalFare,
                    status: 'PENDING',
                },
            });

            // 2. Create the Tickets (Supabase unique constraint [scheduleId, seatNumber] will block double bookings)
            const tickets = await Promise.all(
                normalizedSeatNumbers.map((seatNumber: string) =>
                    tx.ticket.create({
                        data: {
                            seatNumber,
                            scheduleId,
                            bookingId: booking.id,
                        },
                    })
                )
            );

            return { booking, tickets };
        });

        return NextResponse.json(
            { message: 'Booking initialized successfully', result },
            { status: 201 }
        );
    } catch (error: any) {
        // Handle unique constraint violation (Seat already booked for this schedule)
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'One or more selected seats are already booked for this trip.' },
                { status: 400 }
            );
        }
        console.error('Booking error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
