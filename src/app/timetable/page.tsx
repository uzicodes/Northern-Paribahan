"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { getCurrentBSTDate } from "@/lib/dateUtils";
import { 
    Clock, 
    ArrowRight, 
    ArrowLeftRight,
    Bus, 
    MapPin, 
    Calendar,
    Search 
} from "lucide-react";

const LOCATIONS = [
    'Dhaka',
    'Bogura',
    'Rangpur',
    'Dinajpur',
    'Rajshahi',
    'Sylhet',
    'Khulna',
    'Barisal',
    'Chittagong',
    "Cox's Bazar"
];

export default function TimetablePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const origin = searchParams.get("from") || searchParams.get("origin");
    const destination = searchParams.get("to") || searchParams.get("destination");
    const date = searchParams.get("date");

    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Search filter bar state
    const [filterFrom, setFilterFrom] = useState(origin || "");
    const [filterTo, setFilterTo] = useState(destination || "");
    const [filterDate, setFilterDate] = useState(date || getCurrentBSTDate());

    // Synchronize filter fields when searchParams change
    useEffect(() => {
        if (origin) setFilterFrom(origin);
        if (destination) setFilterTo(destination);
        if (date) setFilterDate(date);
    }, [origin, destination, date]);

    useEffect(() => {
        if (!origin || !destination || !date) {
            setLoading(false);
            return;
        }

        const fetchSchedules = async () => {
            setLoading(true);
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

    // Format ISO date into 12-hour AM/PM time
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Swap From and To locations
    const handleSwapLocations = () => {
        const temp = filterFrom;
        setFilterFrom(filterTo);
        setFilterTo(temp);
    };

    // Handle Search Filter Form Submission
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!filterFrom || !filterTo) {
            toast.error("Please select both From and To locations.");
            return;
        }
        if (filterFrom.toLowerCase() === filterTo.toLowerCase()) {
            toast.error("Origin and Destination cannot be the same.");
            return;
        }
        if (!filterDate) {
            toast.error("Please select a travel date.");
            return;
        }

        const params = new URLSearchParams();
        params.set("from", filterFrom);
        params.set("to", filterTo);
        params.set("origin", filterFrom);
        params.set("destination", filterTo);
        params.set("date", filterDate);
        router.push(`/timetable?${params.toString()}`);
    };

    const minDate = getCurrentBSTDate();

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
                <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl border border-black/5">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
                        <Bus className="w-7 h-7 text-[#FCA311]" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Search Bus Schedules</h2>
                    <p className="text-gray-600 text-sm text-center mb-6">
                        Select an origin, destination, and travel date to find available buses.
                    </p>

                    {/* Integrated Search Filter */}
                    <form onSubmit={handleFilterSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                                    <MapPin size={13} className="text-[#172144]" />
                                    <span>From</span>
                                </label>
                                <select
                                    value={filterFrom}
                                    onChange={(e) => setFilterFrom(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#172144]/20 focus:border-[#172144]"
                                >
                                    <option value="" disabled>Select Departure</option>
                                    {LOCATIONS.map((loc) => (
                                        <option key={loc} value={loc} disabled={loc === filterTo}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                                    <MapPin size={13} className="text-[#FCA311]" />
                                    <span>To</span>
                                </label>
                                <select
                                    value={filterTo}
                                    onChange={(e) => setFilterTo(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#172144]/20 focus:border-[#172144]"
                                >
                                    <option value="" disabled>Select Destination</option>
                                    {LOCATIONS.map((loc) => (
                                        <option key={loc} value={loc} disabled={loc === filterFrom}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                                <Calendar size={13} className="text-[#172144]" />
                                <span>Date of Journey</span>
                            </label>
                            <input
                                type="date"
                                min={minDate}
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#172144]/20 focus:border-[#172144]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#172144] hover:bg-[#101730] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <Search size={16} />
                            <span>Search Available Buses</span>
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: "#C9CBA3" }}
        >
            <div className="max-w-5xl mx-auto space-y-5">
                
                {/* Header Route Banner with TO Location in place of Real-time badge */}
                <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-sm border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Origin Location */}
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                            <MapPin size={14} className="text-[#172144]" />
                            <span>From / Origin</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            {origin}
                        </h1>
                        <p className="text-slate-600 text-xs sm:text-sm mt-1">
                            Departing on <strong className="text-slate-900">{new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</strong> (BST)
                        </p>
                    </div>

                    {/* Middle: Route Indicator */}
                    <div className="hidden sm:flex flex-col items-center px-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Intercity</span>
                        <div className="flex items-center gap-1.5 text-[#FCA311]">
                            <div className="w-8 h-[2px] bg-slate-200" />
                            <ArrowRight size={18} className="text-[#FCA311]" />
                            <div className="w-8 h-[2px] bg-slate-200" />
                        </div>
                    </div>

                    {/* Right: Destination Location (placed in the former Real-time Live Seat Inventory spot) */}
                    <div className="flex-1 text-left sm:text-right">
                        <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                            <MapPin size={14} className="text-[#FCA311]" />
                            <span>To / Destination</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            {destination}
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                            Northern Paribahan Express
                        </p>
                    </div>
                </div>

                {/* On-Page Search Filter Bar */}
                <form 
                    onSubmit={handleFilterSubmit}
                    className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-sm border border-black/5"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
                        {/* From Select */}
                        <div className="lg:col-span-3">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                                <MapPin size={12} className="text-[#172144]" />
                                <span>From</span>
                            </label>
                            <select
                                value={filterFrom}
                                onChange={(e) => setFilterFrom(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#172144]/20 focus:border-[#172144] transition-all cursor-pointer"
                            >
                                <option value="" disabled>Select Departure</option>
                                {LOCATIONS.map((loc) => (
                                    <option key={loc} value={loc} disabled={loc === filterTo}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Swap Button */}
                        <div className="lg:col-span-1 flex items-end justify-center">
                            <button
                                type="button"
                                onClick={handleSwapLocations}
                                title="Swap Locations"
                                aria-label="Swap From and To locations"
                                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-all duration-150 active:rotate-180 mb-0.5"
                            >
                                <ArrowLeftRight size={16} />
                            </button>
                        </div>

                        {/* To Select */}
                        <div className="lg:col-span-3">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                                <MapPin size={12} className="text-[#FCA311]" />
                                <span>To</span>
                            </label>
                            <select
                                value={filterTo}
                                onChange={(e) => setFilterTo(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#172144]/20 focus:border-[#172144] transition-all cursor-pointer"
                            >
                                <option value="" disabled>Select Destination</option>
                                {LOCATIONS.map((loc) => (
                                    <option key={loc} value={loc} disabled={loc === filterFrom}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Input */}
                        <div className="lg:col-span-3">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                                <Calendar size={12} className="text-[#172144]" />
                                <span>Travel Date</span>
                            </label>
                            <input
                                type="date"
                                min={minDate}
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#172144]/20 focus:border-[#172144] transition-all cursor-pointer"
                            />
                        </div>

                        {/* Search / Update Button */}
                        <div className="lg:col-span-2 flex items-end">
                            <button
                                type="submit"
                                className="w-full py-2.5 px-4 bg-[#172144] hover:bg-[#101730] text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-[#172144]/20 hover:shadow-md flex items-center justify-center gap-2 mb-0.5"
                            >
                                <Search size={15} />
                                <span>Update</span>
                            </button>
                        </div>
                    </div>
                </form>

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
                                                {/* Removed "Reg: " prefix as requested */}
                                                <span className="font-semibold text-slate-700">{schedule.bus?.registrationNumber || schedule.registrationNumber}</span>
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
                                            
                                            {/* Visual Progress Connector without literal arrow character */}
                                            <div className="flex flex-col items-center px-2">
                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                                                    <Clock size={12} />
                                                    <span>Direct</span>
                                                </div>
                                                <div className="h-[2px] bg-slate-300 w-16 sm:w-24 relative flex items-center justify-between">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 -ml-0.5" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#172144] -mr-0.5" />
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