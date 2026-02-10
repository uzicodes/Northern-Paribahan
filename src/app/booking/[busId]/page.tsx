import { prisma } from "@/lib/db";
import SeatLayout from "@/components/SeatLayout";

interface PageProps {
    params: {
        busId: string;
    };
}

// Server Component
export default async function BookingPage({ params }: PageProps) {
    const bus = await prisma.bus.findUnique({
        where: { id: params.busId },
        include: {
            seats: {
                orderBy: {
                    seatNumber: 'asc' // Sort logic needs refinement for A1, A2 vs A10 but simple string sort for now
                }
            },
        },
    });

    if (!bus) {
        return <div>Bus not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{bus.name}</h1>
            <p className="text-gray-600 mb-8">
                {bus.type} • {bus.plateNumber} • ৳{bus.price}/seat
            </p>

            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-6 text-center">Select Your Seats</h2>
                <SeatLayout busId={bus.id} initialSeats={bus.seats} />
            </div>
        </div>
    );
}
