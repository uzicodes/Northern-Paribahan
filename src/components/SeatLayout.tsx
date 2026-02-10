"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

interface Seat {
    id: string;
    seatNumber: string;
    isBooked: boolean;
}

interface SeatLayoutProps {
    busId: string;
    initialSeats: Seat[];
}

export default function SeatLayout({ busId, initialSeats }: SeatLayoutProps) {
    const [seats, setSeats] = useState<Seat[]>(initialSeats);
    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

    useEffect(() => {
        // Connect to socket
        if (!socket.connected) {
            socket.connect();
        }

        // Listen for seat updates
        socket.on("seat-booked", (data: { seatId: string; busId: string }) => {
            if (data.busId === busId) {
                setSeats((prev) =>
                    prev.map((seat) =>
                        seat.id === data.seatId ? { ...seat, isBooked: true } : seat
                    )
                );
                // Deselect if the selected seat was just booked by someone else
                if (selectedSeat === data.seatId) {
                    setSelectedSeat(null);
                    alert("This seat was just booked by someone else!");
                }
            }
        });

        return () => {
            socket.off("seat-booked");
        };
    }, [busId, selectedSeat]);

    const handleSeatClick = (seat: Seat) => {
        if (seat.isBooked) return;
        if (selectedSeat === seat.id) {
            setSelectedSeat(null);
        } else {
            setSelectedSeat(seat.id);
        }
    };

    const handleBooking = async () => {
        if (!selectedSeat) return;

        try {
            const res = await fetch(`/api/buses/${busId}/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    seatId: selectedSeat,
                    userId: "dummy-user-id", // Replace with real user ID from auth
                }),
            });

            if (res.ok) {
                alert("Booking successful!");
                setSelectedSeat(null);
                // Optimistic update or wait for socket? Socket will update it effectively.
            } else {
                const data = await res.json();
                alert(data.error || "Booking failed");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-4 gap-4 mb-8">
                {seats.map((seat) => (
                    <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.isBooked}
                        className={`
              w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-colors
              ${seat.isBooked
                                ? "bg-red-500 text-white cursor-not-allowed"
                                : selectedSeat === seat.id
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

            <button
                onClick={handleBooking}
                disabled={!selectedSeat}
                className="px-6 py-2 bg-primary text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition"
            >
                Confirm Booking
            </button>
        </div>
    );
}
