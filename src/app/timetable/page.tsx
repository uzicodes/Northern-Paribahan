"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import GlobalLoader from "@/components/GlobalLoader";
import { getCurrentBSTDate } from "@/lib/dateUtils";
import { 
    Clock, 
    ArrowRight, 
    ArrowLeftRight,
    Bus, 
    MapPin, 
    Calendar,
    Search,
    ChevronDown
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

    // Custom centered dropdown menu states
    const [openFromDropdown, setOpenFromDropdown] = useState(false);
    const [openToDropdown, setOpenToDropdown] = useState(false);
    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
                setOpenFromDropdown(false);
            }
            if (toRef.current && !toRef.current.contains(e.target as Node)) {
                setOpenToDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                <GlobalLoader />
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
                                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center justify-center gap-1.5 text-center">
                                    <MapPin size={13} className="text-emerald-600" />
                                    <span>FROM</span>
                                </label>
                                <select
                                    value={filterFrom}
                                    onChange={(e) => setFilterFrom(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 text-center outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer"
                                >
                                    <option value="" disabled>Select FROM</option>
                                    {LOCATIONS.map((loc) => (
                                        <option key={loc} value={loc} disabled={loc === filterTo}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5 flex items-center justify-center gap-1.5 text-center">
                                    <MapPin size={13} className="text-amber-600" />
                                    <span>TO</span>
                                </label>
                                <select
                                    value={filterTo}
                                    onChange={(e) => setFilterTo(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 text-center outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all cursor-pointer"
                                >
                                    <option value="" disabled>Select TO</option>
                                    {LOCATIONS.map((loc) => (
                                        <option key={loc} value={loc} disabled={loc === filterFrom}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-800 mb-1.5 flex items-center justify-center gap-1.5 text-center">
                                <Calendar size={13} className="text-indigo-600" />
                                <span>Date of Journey</span>
                            </label>
                            <input
                                type="date"
                                min={minDate}
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 text-center outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
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
                
                {/* Header Route Banner with Departure and Arrival Terminals */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-sm border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Departure Terminal Location */}
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                            <MapPin size={14} className="text-emerald-600" />
                            <span>FROM</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight">
                            {origin}
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                            Departure Terminal
                        </p>
                    </div>

                    {/* Middle: Route Indicator & Departing Date */}
                    <div className="flex flex-col items-center justify-center px-2 sm:px-6 order-last sm:order-none w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-150 px-3 py-0.5 rounded-full uppercase tracking-wider mb-2">
                            Direct Route Intercity 
                        </span>
                        
                        {/* Extended route arrow indicator */}
                        <div className="flex items-center gap-2 text-[#FCA311] my-1 w-full min-w-[200px] sm:min-w-[280px] md:min-w-[340px]">
                            <div className="flex-1 h-[2px] bg-gradient-to-r from-emerald-400 via-slate-300 to-[#FCA311]" />
                            <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-300/80 flex items-center justify-center shrink-0 shadow-2xs">
                                <ArrowRight size={16} className="text-[#FCA311]" />
                            </div>
                            <div className="flex-1 h-[2px] bg-gradient-to-r from-[#FCA311] via-slate-300 to-amber-400" />
                        </div>

                        <p className="text-slate-600 text-xs mt-1.5 font-medium whitespace-nowrap">
                            Departing on <strong className="text-indigo-950 font-bold">{new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</strong> (BST)
                        </p>
                    </div>

                    {/* Right: Arrival Terminal Location */}
                    <div className="flex-1 text-left sm:text-right">
                        <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                            <MapPin size={14} className="text-amber-600" />
                            <span>TO</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-amber-800 tracking-tight">
                            {destination}
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                            Arrival Terminal
                        </p>
                    </div>
                </div>

                {/* On-Page Search Filter Bar */}
                <form 
                    onSubmit={handleFilterSubmit}
                    className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-black/5 relative z-30"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
                        {/* From Select */}
                        <div className={`lg:col-span-3 relative ${openFromDropdown ? "z-50" : "z-20"}`} ref={fromRef}>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center justify-center gap-1.5 text-center">
                                <MapPin size={12} className="text-emerald-600" />
                                <span>FROM</span>
                            </label>
                            
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenFromDropdown((prev) => !prev);
                                    setOpenToDropdown(false);
                                }}
                                className={`w-full h-11 bg-slate-50 border rounded-xl px-3.5 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center relative ${
                                    openFromDropdown
                                        ? "border-emerald-600 ring-2 ring-emerald-500/20 text-slate-900 bg-white"
                                        : "border-slate-200 text-slate-800 hover:border-slate-300"
                                }`}
                            >
                                <span className="truncate text-center w-full px-4">
                                    {filterFrom || "Select FROM"}
                                </span>
                                <ChevronDown 
                                    size={16} 
                                    className={`absolute right-3.5 text-slate-400 transition-transform duration-200 ${
                                        openFromDropdown ? "rotate-180 text-emerald-600" : ""
                                    }`} 
                                />
                            </button>

                            {/* Dropdown Menu when opened - perfectly centered & solid overlay */}
                            {openFromDropdown && (
                                <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                                    {LOCATIONS.map((loc) => {
                                        const isSelected = loc === filterFrom;
                                        const isDisabled = loc === filterTo;
                                        return (
                                            <button
                                                type="button"
                                                key={loc}
                                                disabled={isDisabled}
                                                onClick={() => {
                                                    setFilterFrom(loc);
                                                    setOpenFromDropdown(false);
                                                }}
                                                className={`w-full py-2.5 px-3 text-sm font-semibold text-center transition-colors block cursor-pointer ${
                                                    isSelected
                                                        ? "bg-emerald-50 text-emerald-800 font-bold"
                                                        : isDisabled
                                                        ? "text-slate-300 cursor-not-allowed bg-slate-50/50"
                                                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                            >
                                                {loc}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Swap Button */}
                        <div className="lg:col-span-1 flex flex-col justify-end">
                            <span className="hidden lg:block text-[11px] font-bold uppercase tracking-wider text-transparent select-none mb-1.5" aria-hidden="true">
                                Swap
                            </span>
                            <button
                                type="button"
                                onClick={handleSwapLocations}
                                title="Swap FROM & TO"
                                aria-label="Swap FROM and TO"
                                className="w-full h-11 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-900 border border-amber-200/90 hover:border-amber-300 shadow-2xs flex items-center justify-center transition-all duration-150 active:scale-95 active:rotate-180 cursor-pointer"
                            >
                                <ArrowLeftRight size={17} className="stroke-[2.2]" />
                            </button>
                        </div>

                        {/* To Select */}
                        <div className={`lg:col-span-3 relative ${openToDropdown ? "z-50" : "z-20"}`} ref={toRef}>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-1.5 flex items-center justify-center gap-1.5 text-center">
                                <MapPin size={12} className="text-amber-600" />
                                <span>TO</span>
                            </label>
                            
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenToDropdown((prev) => !prev);
                                    setOpenFromDropdown(false);
                                }}
                                className={`w-full h-11 bg-slate-50 border rounded-xl px-3.5 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center relative ${
                                    openToDropdown
                                        ? "border-amber-600 ring-2 ring-amber-500/20 text-slate-900 bg-white"
                                        : "border-slate-200 text-slate-800 hover:border-slate-300"
                                }`}
                            >
                                <span className="truncate text-center w-full px-4">
                                    {filterTo || "Select TO"}
                                </span>
                                <ChevronDown 
                                    size={16} 
                                    className={`absolute right-3.5 text-slate-400 transition-transform duration-200 ${
                                        openToDropdown ? "rotate-180 text-amber-600" : ""
                                    }`} 
                                />
                            </button>

                            {/* Dropdown Menu when opened - perfectly centered & solid overlay */}
                            {openToDropdown && (
                                <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                                    {LOCATIONS.map((loc) => {
                                        const isSelected = loc === filterTo;
                                        const isDisabled = loc === filterFrom;
                                        return (
                                            <button
                                                type="button"
                                                key={loc}
                                                disabled={isDisabled}
                                                onClick={() => {
                                                    setFilterTo(loc);
                                                    setOpenToDropdown(false);
                                                }}
                                                className={`w-full py-2.5 px-3 text-sm font-semibold text-center transition-colors block cursor-pointer ${
                                                    isSelected
                                                        ? "bg-amber-50 text-amber-900 font-bold"
                                                        : isDisabled
                                                        ? "text-slate-300 cursor-not-allowed bg-slate-50/50"
                                                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                            >
                                                {loc}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Date Input */}
                        <div className="lg:col-span-3">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-800 mb-1.5 flex items-center justify-center gap-1.5 text-center">
                                <Calendar size={12} className="text-indigo-600" />
                                <span>Travel Date</span>
                            </label>
                            <input
                                type="date"
                                min={minDate}
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-sm font-semibold text-slate-800 text-center outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                            />
                        </div>

                        {/* Search / Update Button */}
                        <div className="lg:col-span-2 flex flex-col justify-end">
                            <span className="hidden lg:block text-[11px] font-bold uppercase tracking-wider text-transparent select-none mb-1.5" aria-hidden="true">
                                Action
                            </span>
                            <button
                                type="submit"
                                className="w-full h-11 px-4 bg-[#172144] hover:bg-[#101730] text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-[#172144]/20 hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
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
                            There are no remaining trips found from Departure Terminal (<span className="font-bold text-emerald-700">{origin}</span>) to Arrival Terminal (<span className="font-bold text-amber-700">{destination}</span>) on the selected date. Past or departing buses within the 30-minute operational window are filtered out.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 relative z-0">
                        {schedules.map((schedule) => {
                            const applicableFare = schedule.route?.fares?.find(
                                (f: any) => f.tier === schedule.bus?.tier
                            );
                            const farePrice = applicableFare?.price || schedule.fare || 0;
                            const busModelName = schedule.bus?.modelName || schedule.busName || "Volvo B9R";

                            // Tier badges with distinct color palettes
                            const tierBadgeColor = 
                                schedule.bus?.tier === 'PREMIUM' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                                schedule.bus?.tier === 'BUSINESS' ? 'bg-indigo-50 text-indigo-900 border-indigo-200' :
                                'bg-emerald-50 text-emerald-900 border-emerald-200';

                            return (
                                <div 
                                    key={schedule.id} 
                                    className="bg-white border border-black/10 rounded-2xl p-3.5 sm:py-4 sm:px-5 shadow-sm transition-all duration-200 hover:shadow-md"
                                >
                                    {/* Card Summary Row */}
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3.5 sm:gap-4 lg:gap-6">
                                        
                                        {/* Left Section: Bus & Coach Info (Bus Name in distinct royal indigo) */}
                                        <div className="flex-1 min-w-[200px]">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h2 className="text-base sm:text-lg font-black text-[#881337] tracking-tight">
                                                    {busModelName}
                                                </h2>
                                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide border ${tierBadgeColor}`}>
                                                    {schedule.bus?.tier || 'ECONOMY'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                                {/* Coach Registration in clean mono tag */}
                                                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10.5px]">
                                                    {schedule.bus?.registrationNumber || schedule.registrationNumber}
                                                </span>
                                                <span>•</span>
                                                {/* Seat count in distinct sky badge */}
                                                <span className="text-sky-800 font-bold bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded text-[10.5px]">
                                                    {schedule.bus?.capacity || 40} Total Seats
                                                </span>
                                            </p>
                                        </div>

                                        {/* Middle Section: Departure & Arrival Timing with Departure & Arrival Terminal Labels */}
                                        <div className="flex-initial sm:flex-1 lg:flex-[1.4] flex items-center justify-between sm:justify-center w-full lg:w-auto min-w-[310px] sm:min-w-[360px] md:min-w-[390px] gap-3 sm:gap-5 md:gap-6 bg-slate-50/90 py-2.5 px-3.5 sm:py-2.5 sm:px-5 rounded-xl border border-slate-200/70 shrink-0">
                                            {/* Departure Time & FROM Origin Location */}
                                            <div className="text-center min-w-[95px] sm:min-w-[110px] shrink-0">
                                                <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap">
                                                    {formatTime(schedule.departureTime)}
                                                </p>
                                                <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-md mt-1 shadow-2xs whitespace-nowrap">
                                                    {origin}
                                                </span>
                                            </div>
                                            
                                            {/* Visual Progress Connector */}
                                            <div className="flex flex-col items-center px-1 sm:px-2 flex-1 min-w-[44px] max-w-[80px] sm:max-w-[120px]">
                                                <div className="h-[2px] bg-slate-300 w-full relative flex items-center justify-between">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 -ml-0.5 border border-white shadow-2xs" />
                                                    <ArrowRight size={10} className="text-slate-400 absolute left-1/2 -translate-x-1/2" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 -mr-0.5 border border-white shadow-2xs" />
                                                </div>
                                            </div>

                                            {/* Arrival Time & TO Destination Location */}
                                            <div className="text-center min-w-[95px] sm:min-w-[110px] shrink-0">
                                                <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap">
                                                    {formatTime(schedule.arrivalTime)}
                                                </p>
                                                <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-50/90 border border-amber-200/80 px-2.5 py-0.5 rounded-md mt-1 shadow-2xs whitespace-nowrap">
                                                    {destination}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Section: Fare & Navigation Action */}
                                        <div className="flex-initial sm:flex-1 lg:flex-initial lg:min-w-[170px] flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-2.5 shrink-0">
                                            <div className="text-left lg:text-right">
                                                <span className="text-[11px] text-slate-400 font-medium block">Starting from</span>
                                                <p className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight leading-tight">
                                                    <span className="text-red-500 text-lg sm:text-xl mr-0.5">৳</span>
                                                    {farePrice.toLocaleString()}
                                                </p>
                                            </div>

                                            <Link
                                                href={`/booking/${schedule.bus?.id || schedule.busId}?scheduleId=${schedule.id}`}
                                                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm bg-[#172144] hover:bg-[#101730] text-white shadow-sm shadow-[#172144]/20 hover:shadow-md transition-all duration-150 active:scale-[0.99]"
                                            >
                                                <span>Select Seats</span>
                                                <ArrowRight size={14} />
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