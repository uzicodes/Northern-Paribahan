import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { socket } from "@/lib/socket"; // Wait, socket is client side. Can I use server-side io?
import { sendTicketEmail } from "@/utils/sendTicketEmail";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const [{ id }, { seatId, userId }] = await Promise.all([params, req.json()]);

        // Check availability
        const seat = await prisma.seat.findUnique({
            where: { id: seatId },
        });

        if (!seat) {
            return NextResponse.json(
                { error: "Seat not found" },
                { status: 404 }
            );
        }

        if (seat.isBooked) {
            return NextResponse.json(
                { error: "Seat already booked" },
                { status: 400 }
            );
        }

        // Create Booking and Update Seat status concurrently
        const [booking] = await Promise.all([
            prisma.booking.create({
                data: {
                    userId,
                    seatId,
                    status: "CONFIRMED",
                },
            }),
            prisma.seat.update({
                where: { id: seatId },
                data: { isBooked: true },
            }),
        ]);

        // Emit socket event if server instance available via global
        const io = (global as any).io;
        if (io) {
            io.emit("seat-booked", { seatId, busId: id });
        }

        // Send ticket email asynchronously without blocking the response
        sendTicketEmail(
            "passenger@example.com",
            "Valued Passenger",
            Buffer.from(`Northern Paribahan E-Ticket\nBooking ID: ${booking.id}\nSeat: ${seat.seatNumber}`)
        ).catch((err) => console.error("Error sending ticket email:", err));

        return NextResponse.json(booking);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
