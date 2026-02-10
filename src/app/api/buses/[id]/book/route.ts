import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { socket } from "@/lib/socket"; // Wait, socket is client side. Can I use server-side io?

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { seatId, userId } = await req.json();

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

        // Create Booking
        const booking = await prisma.booking.create({
            data: {
                userId,
                seatId,
                status: "CONFIRMED",
            },
        });

        // Update Seat status
        await prisma.seat.update({
            where: { id: seatId },
            data: { isBooked: true },
        });

        // Emit socket event if server instance available via global
        const io = (global as any).io;
        if (io) {
            io.emit("seat-booked", { seatId, busId: params.id });
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
