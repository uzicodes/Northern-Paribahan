"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function TimetablePage() {
    const searchParams = useSearchParams();
    const origin = searchParams.get("from") || searchParams.get("origin");
    const destination = searchParams.get("to") || searchParams.get("destination");
    const date = searchParams.get("date");

    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!origin || !destination || !date) {
            setLoading(false);
            return;
        }

        const fetchSchedules = async () => {
            try {
                const response = await fetch(
                    `/api/schedules?origin=${origin}&destination=${destination}&date=${date}`
                );
                const data = await response.json();
                
                if (data.schedules) {
                    setSchedules(data.schedules);
                }
            } catch (error) {
                console.error("Failed to fetch schedules", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [origin, destination, date]);

    // Helper function to format the ISO date into 12-hour AM/PM time
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Missing Search Parameters State
    if (!origin || !destination || !date) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center mt-10">
                <h2 className="text-2xl font-bold text-gray-800">Please complete your search</h2>
                <p className="text-gray-500 mt-2">Select an origin, destination, and date to view available buses.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {origin} to {destination}
                </h1>
                <p className="text-gray-600 mt-1">Showing available buses for {new Date(date).toDateString()}</p>
            </div>

            {schedules.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-lg text-gray-600">No buses available for this route on the selected date.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {schedules.map((schedule) => {
                        // Find the correct fare dynamically based on the Bus Tier!
                        const applicableFare = schedule.route.fares.find(
                            (f: any) => f.tier === schedule.bus.tier
                        );

                        return (
                            <div 
                                key={schedule.id} 
                                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                            >
                                {/* Left Section: Bus Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {schedule.bus.modelName}
                                        </h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                                            schedule.bus.tier === 'PREMIUM' ? 'bg-amber-100 text-amber-800' :
                                            schedule.bus.tier === 'BUSINESS' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {schedule.bus.tier}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">
                                        Registration: {schedule.bus.registrationNumber}
                                    </p>
                                </div>

                                {/* Middle Section: Timing */}
                                <div className="flex-1 flex items-center justify-between md:justify-center w-full md:w-auto gap-4">
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-gray-900">{formatTime(schedule.departureTime)}</p>
                                        <p className="text-sm text-gray-500">{origin}</p>
                                    </div>
                                    
                                    {/* Visual Arrow */}
                                    <div className="flex-1 flex items-center justify-center px-4">
                                        <div className="h-[2px] bg-gray-300 w-full relative">
                                            <div className="absolute -top-2 right-0 w-4 h-4 text-gray-400">
                                                ➔
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-xl font-bold text-gray-900">{formatTime(schedule.arrivalTime)}</p>
                                        <p className="text-sm text-gray-500">{destination}</p>
                                    </div>
                                </div>

                                {/* Right Section: Price and Booking Action */}
                                <div className="flex-1 flex flex-col items-end w-full md:w-auto mt-4 md:mt-0">
                                    <p className="text-3xl font-bold text-blue-600 mb-1">
                                        ৳{applicableFare?.price || "0"}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {schedule.bus.capacity} Seats Available
                                    </p>
                                    <Link 
                                        href={`/booking/${schedule.bus.id}?scheduleId=${schedule.id}`} 
                                        className="w-full md:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition duration-200"
                                    >
                                        Book Seat
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}