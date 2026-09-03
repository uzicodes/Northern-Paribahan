import { prisma } from "@/lib/db";
import SeatLayout from "@/components/SeatLayout";
import { SeatDisplay } from "@/types";

interface PageProps {
    params: Promise<{
        busId: string;
    }>;
    searchParams: Promise<{
        scheduleId?: string;
    }>;
}

/**
 * Generate seat labels (A1, A2, A3, A4, B1, B2, ...) for a given capacity.
 * 4 seats per row, rows labeled A-Z.
 */
function generateSeatNumbers(capacity: number): string[] {
    const seats: string[] = [];
    const seatsPerRow = 4;
    for (let i = 0; i < capacity; i++) {
        const row = String.fromCharCode(65 + Math.floor(i / seatsPerRow)); // A, B, C, ...
        const col = (i % seatsPerRow) + 1;
        seats.push(`${row}${col}`);
    }
    return seats;
}

// Server Component
export default async function BookingPage(props: PageProps) {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
    const { busId } = params;
    const { scheduleId } = searchParams;

    if (!scheduleId) {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-2">No Schedule Selected</h1>
                <p className="text-gray-600">Please select a schedule from the timetable to book seats.</p>
            </div>
        );
    }

    // Fetch bus and the schedule with its existing tickets
    const [bus, schedule] = await Promise.all([
        prisma.bus.findUnique({
            where: { id: busId },
        }),
        prisma.schedule.findUnique({
            where: { id: scheduleId },
            include: {
                tickets: true,
            },
        }),
    ]);

    if (!bus) {
        return <div className="max-w-4xl mx-auto py-12 text-center text-red-600 font-bold">Bus not found</div>;
    }

    if (!schedule) {
        return <div className="max-w-4xl mx-auto py-12 text-center text-red-600 font-bold">Schedule not found</div>;
    }

    // Generate all seat numbers for this bus based on capacity
    const allSeatNumbers = generateSeatNumbers(bus.capacity);

    // Determine which seats are already booked for this schedule
    const bookedSeatNumbers = new Set(schedule.tickets.map((t) => t.seatNumber));

    const seats: SeatDisplay[] = allSeatNumbers.map((seatNumber) => ({
        seatNumber,
        isBooked: bookedSeatNumbers.has(seatNumber),
    }));

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{bus.name}</h1>
            <p className="text-gray-600 mb-2">
                {bus.type} • {bus.registrationNumber} • ৳{schedule.fare}/seat
            </p>
            {schedule.origin && schedule.destination && (
                <p className="text-gray-500 mb-8">
                    {schedule.origin} → {schedule.destination}
                </p>
            )}

            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-6 text-center">Select Your Seats</h2>
                <SeatLayout busId={bus.id} scheduleId={scheduleId} seats={seats} />
            </div>
        </div>
    );
}
