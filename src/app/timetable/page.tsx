"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
    Clock, 
    ArrowRight, 
    Bus, 
    MapPin, 
    ShieldCheck 
} from "lucide-react";

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
                    `/api/schedules?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(date)}`
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
            <div 
                className="flex justify-center items-center min-h-[calc(100vh-140px)]"
                style={{ backgroundColor: "#C9CBA3" }}
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#172144]"></div>
                    <p className="text-sm font-semibold text-slate-800">Searching active schedules...</p>
                </div>
            </div>
        );
    }

    // Missing Search Parameters State
    if (!origin || !destination || !date) {
        return (
            <div 
                className="min-h-[calc(100vh-140px)] py-12 px-4 flex items-center justify-center"
                style={{ backgroundColor: "#C9CBA3" }}
            >
                <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-black/5">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
                        <Bus className="w-7 h-7 text-[#FCA311]" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Search Bus Schedules</h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Select an origin, destination, and travel date from the home page to view available buses.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#172144] hover:bg-[#101730] text-white font-bold rounded-xl text-sm transition-all"
                    >
                        Go to Search
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: "#C9CBA3" }}
        >
            <div className="max-w-5xl mx-auto">
                {/* Header route badge banner */}
                <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-sm border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                            <MapPin size={14} className="text-[#172144]" />
                            <span>Intercity Route</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <span>{origin}</span>
                            <ArrowRight className="w-6 h-6 text-[#FCA311]" />
                            <span>{destination}</span>
                        </h1>
                        <p className="text-slate-600 text-sm mt-1">
                            Departing on <strong className="text-slate-900">{new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</strong> (BST)
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        <span>Real-time Live Seat Inventory</span>
                    </div>
                </div>

                {/* Schedules list */}
                {schedules.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-black/5 p-12 text-center shadow-lg">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Bus size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Buses Available</h3>
                        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                            There are no remaining trips found for this route on the selected date. Past or departing buses within the 30-minute operational window are filtered out.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-2.5 bg-[#172144] hover:bg-[#101730] text-white font-bold rounded-xl text-sm transition-all"
                        >
                            Try Another Date
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {schedules.map((schedule) => {
                            const applicableFare = schedule.route?.fares?.find(
                                (f: any) => f.tier === schedule.bus?.tier
                            );
                            const farePrice = applicableFare?.price || schedule.fare || 0;
                            const busModelName = schedule.bus?.modelName || schedule.busName || "Volvo B9R";

                            // Tier badges
                            const tierBadgeColor = 
                                schedule.bus?.tier === 'PREMIUM' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                                schedule.bus?.tier === 'BUSINESS' ? 'bg-indigo-50 text-indigo-900 border-indigo-200' :
                                'bg-emerald-50 text-emerald-900 border-emerald-200';

                            return (
                                <div 
                                    key={schedule.id} 
                                    className="bg-white border border-black/10 rounded-2xl p-5 sm:p-6 shadow-md transition-all duration-200"
                                >
                                    {/* Card Summary Row */}
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                        
                                        {/* Left Section: Bus & Coach Info */}
                                        <div className="flex-1 min-w-[220px]">
                                            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                                    {busModelName}
                                                </h2>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide border ${tierBadgeColor}`}>
                                                    {schedule.bus?.tier || 'EXPRESS'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                                <span>Reg: {schedule.bus?.registrationNumber || schedule.registrationNumber}</span>
                                                <span>•</span>
                                                <span className="text-slate-600 font-semibold">{schedule.bus?.capacity || 40} Total Seats</span>
                                            </p>
                                        </div>

                                        {/* Middle Section: Departure & Arrival Timing */}
                                        <div className="flex-1 flex items-center justify-between sm:justify-center w-full lg:w-auto gap-4 sm:gap-6 bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-100">
                                            <div className="text-center">
                                                <p className="text-lg sm:text-xl font-black text-gray-900">{formatTime(schedule.departureTime)}</p>
                                                <p className="text-xs text-slate-500 font-semibold mt-0.5">{origin}</p>
                                            </div>
                                            
                                            {/* Visual Progress Connector */}
                                            <div className="flex flex-col items-center px-2">
                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                                                    <Clock size={12} />
                                                    <span>Direct</span>
                                                </div>
                                                <div className="h-[2px] bg-slate-300 w-16 sm:w-24 relative">
                                                    <div className="absolute -top-1.5 right-0 w-3 h-3 text-slate-400">➔</div>
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-lg sm:text-xl font-black text-gray-900">{formatTime(schedule.arrivalTime)}</p>
                                                <p className="text-xs text-slate-500 font-semibold mt-0.5">{destination}</p>
                                            </div>
                                        </div>

                                        {/* Right Section: Fare & Navigation Action */}
                                        <div className="flex-1 flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4">
                                            <div className="text-left lg:text-right">
                                                <span className="text-xs text-slate-400 font-medium block">Starting from</span>
                                                <p className="text-2xl sm:text-3xl font-black text-[#172144]">
                                                    ৳{farePrice.toLocaleString()}
                                                </p>
                                            </div>

                                            <Link
                                                href={`/booking/${schedule.bus?.id || schedule.busId}?scheduleId=${schedule.id}`}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#172144] hover:bg-[#101730] text-white shadow-sm shadow-[#172144]/20 hover:shadow-md transition-all duration-150"
                                            >
                                                <span>Select Seats</span>
                                                <ArrowRight size={15} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}