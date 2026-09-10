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

function generateSeatNumbers(capacity: number): string[] {
    const seats: string[] = [];
    const seatsPerRow = 4;
    for (let i = 0; i < capacity; i++) {
        const row = String.fromCharCode(65 + Math.floor(i / seatsPerRow));
        const col = (i % seatsPerRow) + 1;
        seats.push(`${row}${col}`);
    }
    return seats;
}

const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
};

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(date);
};

export default async function BookingPage(props: PageProps) {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
    const { busId } = params;
    const { scheduleId } = searchParams;

    if (!scheduleId) {
        return (
            <div className="min-h-screen bg-[#C9CBA3] py-12 px-4 flex items-center justify-center">
                <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">No Schedule Selected</h1>
                    <p className="text-gray-500">Please return to the timetable and select a specific trip.</p>
                </div>
            </div>
        );
    }

    const [bus, schedule] = await Promise.all([
        prisma.bus.findUnique({ where: { id: busId } }),
        prisma.schedule.findUnique({
            where: { id: scheduleId },
            include: {
                tickets: true,
                route: { include: { fares: true } },
            },
        }),
    ]);

    if (!bus || !schedule) {
        return (
            <div className="min-h-screen bg-[#C9CBA3] flex justify-center items-center">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-red-100">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Trip Not Found</h1>
                </div>
            </div>
        );
    }

    const applicableFare = schedule.route?.fares?.find((f) => f.tier === bus.tier);
    const farePrice = applicableFare?.price || 0;

    const allSeatNumbers = generateSeatNumbers(bus.capacity);
    const bookedSeatNumbers = new Set(schedule.tickets.map((t) => t.seatNumber));
    const seats: SeatDisplay[] = allSeatNumbers.map((seatNumber) => ({
        seatNumber,
        isBooked: bookedSeatNumbers.has(seatNumber),
    }));

    const tierConfig = {
        PREMIUM: "bg-amber-100 text-amber-800",
        BUSINESS: "bg-blue-100 text-blue-800",
        ECONOMY: "bg-green-100 text-green-800",
    }[bus.tier] || "bg-gray-100 text-gray-800";

    return (
        <div className="min-h-screen bg-[#C9CBA3] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: Seat Selection Area (Bus Canvas) */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                        <SeatLayout 
                            busId={bus.id} 
                            scheduleId={scheduleId} 
                            busModel={bus.modelName}
                            fare={farePrice}
                            bookedSeats={Array.from(bookedSeatNumbers)}
                        />
                    </div>

                    {/* RIGHT COLUMN: Sticky Trip Details Sidebar */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
                            
                            {/* Blue Header */}
                            <div className="bg-blue-600 p-6 text-white text-center">
                                <h3 className="text-lg font-medium text-blue-100">{formatDate(schedule.departureTime)}</h3>
                                <div className="flex items-center justify-center gap-3 mt-2 text-2xl font-bold">
                                    <span>{schedule.origin}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                    <span>{schedule.destination}</span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Timing Info: Departure & Arrival Side-by-Side */}
                                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-5">
                                    <div>
                                        <p className="text-sm text-gray-500">Departure</p>
                                        <p className="text-lg font-bold text-gray-900">{formatTime(schedule.departureTime)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Arrival</p>
                                        <p className="text-lg font-bold text-gray-900">{formatTime(schedule.arrivalTime)}</p>
                                    </div>
                                </div>

                                {/* Fare Display */}
                                <div className="flex justify-between items-center border-b border-gray-100 pb-5">
                                    <span className="text-gray-500 text-sm">Fare per Seat</span>
                                    <span className="text-2xl font-bold text-blue-600">৳{farePrice}</span>
                                </div>

                                {/* Bus Info */}
                                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Bus Model</span>
                                        <span className="font-semibold text-gray-900">{bus.modelName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Class</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${tierConfig}`}>
                                            {bus.tier}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Coach No.</span>
                                        <span className="font-semibold text-gray-900">{bus.registrationNumber}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}