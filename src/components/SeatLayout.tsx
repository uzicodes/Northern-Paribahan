"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { toast } from "sonner";

import { SeatDisplay } from "@/types";

interface SeatLayoutProps {
    busId: string;
    scheduleId: string;
    seats: SeatDisplay[];
}

export default function SeatLayout({ busId, scheduleId, seats: initialSeats }: SeatLayoutProps) {
    const [seats, setSeats] = useState<SeatDisplay[]>(initialSeats);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    useEffect(() => {
        // Connect to socket
        if (!socket.connected) {
            socket.connect();
        }

        // Listen for seat updates (ticket created for this schedule)
        socket.on("seat-booked", (data: { seatNumber: string; scheduleId: string }) => {
            if (data.scheduleId === scheduleId) {
                setSeats((prev) =>
                    prev.map((seat) =>
                        seat.seatNumber === data.seatNumber ? { ...seat, isBooked: true } : seat
                    )
                );
                // Deselect if the selected seat was just booked by someone else
                if (selectedSeats.includes(data.seatNumber)) {
                    setSelectedSeats((prev) => prev.filter((s) => s !== data.seatNumber));
                    toast.error("A seat you selected was just booked by someone else!");
                }
            }
        });

        return () => {
            socket.off("seat-booked");
        };
    }, [busId, scheduleId, selectedSeats]);

    const handleSeatClick = (seat: SeatDisplay) => {
        if (seat.isBooked) return;
        if (selectedSeats.includes(seat.seatNumber)) {
            setSelectedSeats((prev) => prev.filter((s) => s !== seat.seatNumber));
        } else {
            setSelectedSeats((prev) => [...prev, seat.seatNumber]);
        }
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) return;

        try {
            const res = await fetch(`/api/buses/${busId}/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scheduleId,
                    seatNumbers: selectedSeats,
                    userId: "dummy-user-id", // Replace with real user ID from auth
                }),
            });

            if (res.ok) {
                toast.success("Booking successful!");
                setSelectedSeats([]);
                // Optimistic update: mark booked seats
                setSeats((prev) =>
                    prev.map((seat) =>
                        selectedSeats.includes(seat.seatNumber) ? { ...seat, isBooked: true } : seat
                    )
                );
            } else {
                const data = await res.json();
                toast.error(data.error || "Booking failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-4 gap-4 mb-8">
                {seats.map((seat) => (
                    <button
                        type="button"
                        key={seat.seatNumber}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.isBooked}
                        className={`
              w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-colors
              ${seat.isBooked
                                ? "bg-red-500 text-white cursor-not-allowed"
                                : selectedSeats.includes(seat.seatNumber)
                                    ? "bg-green-500 text-white"
                                    : "bg-white border-2 border-gray-300 hover:border-green-500 text-gray-700"
                            }
            `}
                    >
                        {seat.seatNumber}
                    </button>
                ))}
            </div>

            <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border-2 border-gray-300"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500"></div>
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <span>Booked</span>
                </div>
            </div>

            {selectedSeats.length > 0 && (
                <p className="text-sm text-gray-600 mb-4">
                    Selected: {selectedSeats.join(", ")} ({selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""})
                </p>
            )}

            <button
                type="button"
                onClick={handleBooking}
                disabled={selectedSeats.length === 0}
                className="px-6 py-2 bg-primary text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition"
            >
                Confirm Booking
            </button>
        </div>
    );
}
