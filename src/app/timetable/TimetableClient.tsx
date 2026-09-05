'use client';

import React, { useState, useMemo } from 'react';
import {
    Clock,
    MapPin,
    ArrowRight,
    Bus,
    Filter,
    RotateCcw,
    Sunrise,
    Sun,
    Sunset,
    Moon,
    ChevronDown,
    ArrowUpDown,
    SlidersHorizontal,
} from 'lucide-react';

interface ScheduleData {
    id: string;
    bus: string;
    code: string;
    from: string;
    to: string;
    departure: string;
    arrival: string;
    duration: string;
    type: string;
    fare: string;
    rawFare?: number;
    seats: number;
    period: string;
    rawDeparture?: string;
}

const periodIcon: Record<string, React.ReactNode> = {
    morning: <Sunrise size={14} className="text-amber-500" />,
    afternoon: <Sun size={14} className="text-orange-500" />,
    evening: <Sunset size={14} className="text-indigo-500" />,
    night: <Moon size={14} className="text-slate-500" />,
};

const typeColor: Record<string, string> = {
    AC: "bg-indigo-50 text-indigo-700 border-indigo-100",
    "NON AC": "bg-gray-100 text-gray-700 border-gray-200",
    SLEEPER: "bg-purple-50 text-purple-700 border-purple-100",
};

interface TimetableClientProps {
    schedules: ScheduleData[];
    routes: string[];
    initialRoute?: string;
    initialDate?: string;
}

export default function TimetableClient({ schedules, routes, initialRoute, initialDate }: TimetableClientProps) {
    const [selectedRoute, setSelectedRoute] = useState<string>(
        initialRoute && routes.includes(initialRoute) ? initialRoute : "All Routes"
    );
    const [selectedType, setSelectedType] = useState<string>("All Types");
    const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("earliest");

    // Filter and sort schedules with memoization for performance
    const filteredSchedules = useMemo(() => {
        const filtered = schedules.filter((t) => {
            const routeStr = `${t.from} → ${t.to}`;
            const matchesRoute = selectedRoute === "All Routes" || routeStr === selectedRoute;
            const matchesType =
                selectedType === "All Types" ||
                t.type.toUpperCase() === selectedType.toUpperCase();
            const matchesPeriod = selectedPeriod === "all" || t.period === selectedPeriod;
            return matchesRoute && matchesType && matchesPeriod;
        });

        return filtered.sort((a, b) => {
            if (sortBy === "fare_asc") {
                const fareA = a.rawFare ?? (Number(a.fare.replace(/[^0-9.]/g, "")) || 0);
                const fareB = b.rawFare ?? (Number(b.fare.replace(/[^0-9.]/g, "")) || 0);
                return fareA - fareB;
            }
            if (sortBy === "seats_desc") {
                return b.seats - a.seats;
            }
            // Default: Earliest departure time
            const timeA = a.rawDeparture ? new Date(a.rawDeparture).getTime() : 0;
            const timeB = b.rawDeparture ? new Date(b.rawDeparture).getTime() : 0;
            return timeA - timeB;
        });
    }, [schedules, selectedRoute, selectedType, selectedPeriod, sortBy]);

    const isFiltered =
        selectedRoute !== "All Routes" ||
        selectedType !== "All Types" ||
        selectedPeriod !== "all" ||
        sortBy !== "earliest";

    const handleResetFilters = () => {
        setSelectedRoute("All Routes");
        setSelectedType("All Types");
        setSelectedPeriod("all");
        setSortBy("earliest");
    };

    return (
        <div style={{ backgroundColor: "#C9CBA3" }} className="min-h-screen pb-10">
            {/* Hero Header Banner */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-7 pb-1">
                <div className="bg-[#172144] rounded-2xl py-3 px-5 sm:py-3.5 sm:px-6 text-white shadow-md border border-[#223062] flex flex-col items-center justify-center text-center gap-1">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Live Timetable</h1>
                    <p className="text-indigo-100 text-xs sm:text-sm max-w-xl leading-relaxed mx-auto">
                        View real-time departure and arrival schedules for Northern Paribahan.
                    </p>

                    {initialDate && (() => {
                        const parts = initialDate.split('-');
                        const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : initialDate;
                        return (
                            <div className="mt-0.5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold border border-[#FCA311] text-[#FCA311] bg-[#FCA311]/10">
                                    📅 Journey Date: {formattedDate}
                                </span>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Filter Card */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 relative z-10">
                <div className="bg-[#EDF5F0] rounded-2xl shadow-md border border-white/60 p-4 sm:p-5 space-y-4">
                    
                    {/* Top Row: Dropdown Filters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                        {/* 1. Route Filter */}
                        <div>
                            <label htmlFor="route-filter" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <MapPin size={12} className="text-indigo-500" />
                                Select Route
                            </label>
                            <div className="relative">
                                <select
                                    id="route-filter"
                                    value={selectedRoute}
                                    onChange={(e) => setSelectedRoute(e.target.value)}
                                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white hover:bg-gray-50/80 transition-colors cursor-pointer shadow-sm"
                                >
                                    <option value="All Routes">🌍 All Routes</option>
                                    {routes.map((r) => (
                                        <option key={r} value={r}>
                                            {r}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* 2. Bus Type Filter */}
                        <div>
                            <label htmlFor="type-filter" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Bus size={12} className="text-indigo-500" />
                                Bus Type
                            </label>
                            <div className="relative">
                                <select
                                    id="type-filter"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white hover:bg-gray-50/80 transition-colors cursor-pointer shadow-sm"
                                >
                                    <option value="All Types">🚍 All Types</option>
                                    <option value="AC">❄️ AC</option>
                                    <option value="NON AC">🪟 NON AC</option>
                                    <option value="SLEEPER">🛏️ SLEEPER</option>
                                </select>
                                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* 3. Sort By Dropdown */}
                        <div>
                            <label htmlFor="sort-filter" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <ArrowUpDown size={12} className="text-indigo-500" />
                                Sort By
                            </label>
                            <div className="relative">
                                <select
                                    id="sort-filter"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white hover:bg-gray-50/80 transition-colors cursor-pointer shadow-sm"
                                >
                                    <option value="earliest">⏰ Earliest Departure</option>
                                    <option value="fare_asc">💰 Lowest Fare</option>
                                    <option value="seats_desc">💺 Most Seats Available</option>
                                </select>
                                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Time of Day Filter & Quick Actions */}
                    <div className="pt-3 border-t border-gray-200/60 flex flex-col md:flex-row items-center justify-between gap-3">
                        <div className="w-full flex flex-col items-center justify-center text-center">
                            <div id="time-period-label" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-center gap-1">
                                <SlidersHorizontal size={12} className="text-indigo-500" />
                                Time of Day
                            </div>
                            <div role="group" aria-labelledby="time-period-label" className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                                {[
                                    { key: "all", label: "All Day", icon: <Filter size={13} /> },
                                    { key: "morning", label: "Morning (6:00 AM - 12:00 PM)", icon: <Sunrise size={13} className="text-amber-500" /> },
                                    { key: "afternoon", label: "Afternoon (12:00 PM - 5:00 PM)", icon: <Sun size={13} className="text-orange-500" /> },
                                    { key: "evening", label: "Evening (5:00 PM - 8:00 PM)", icon: <Sunset size={13} className="text-indigo-500" /> },
                                    { key: "night", label: "Night (8:00 PM+)", icon: <Moon size={13} className="text-slate-500" /> },
                                ].map((p) => {
                                    const isActive = selectedPeriod === p.key;
                                    return (
                                        <button
                                            type="button"
                                            key={p.key}
                                            onClick={() => setSelectedPeriod(p.key)}
                                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                                                isActive
                                                    ? "bg-[#172144] text-white shadow-sm"
                                                    : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-gray-50"
                                            }`}
                                        >
                                            {p.icon}
                                            <span>{p.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reset Filters Button */}
                        {isFiltered && (
                            <div className="flex justify-center w-full md:w-auto shrink-0">
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100 shadow-sm whitespace-nowrap"
                                >
                                    <RotateCcw size={12} />
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Timetable List Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
                <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-gray-700 font-semibold">
                        Showing <span className="font-bold text-gray-900">{filteredSchedules.length}</span> of {schedules.length} schedules
                    </p>
                </div>

                {filteredSchedules.map((trip) => (
                    <div
                        key={trip.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100/80 hover:shadow-md hover:border-indigo-100 transition-all duration-150 overflow-hidden group"
                    >
                        <div className="p-3.5 sm:p-4 lg:p-4.5">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-3.5 lg:gap-5">
                                
                                {/* Bus Info */}
                                <div className="lg:w-44 shrink-0">
                                    <h3 className="font-extrabold text-base sm:text-[17px] leading-snug truncate" style={{ color: "#470BB0" }}>{trip.bus}</h3>
                                    <p className="text-[9px] sm:text-[10px] text-gray-500 font-mono mt-0.5 bg-gray-50/80 inline-block px-1.5 py-0.5 rounded border border-gray-200/60 leading-none">
                                        {trip.code}
                                    </p>
                                </div>

                                {/* Route & Time */}
                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-gray-50/40 p-2.5 sm:p-0 sm:bg-transparent rounded-xl">
                                    {/* Departure */}
                                    <div className="text-center sm:text-left min-w-[105px]">
                                        <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{trip.departure}</p>
                                        <p className="text-xs font-medium text-gray-500 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                                            <MapPin size={12} className="text-indigo-400" />
                                            {trip.from}
                                        </p>
                                    </div>

                                    {/* Arrow & Duration */}
                                    <div className="flex items-center gap-2 justify-center flex-1">
                                        <div className="h-[1px] bg-gray-200 flex-1 hidden sm:block"></div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200/80 shadow-xs text-[11px] font-bold text-gray-600">
                                            {periodIcon[trip.period]}
                                            {trip.duration}
                                        </div>
                                        <div className="h-[1px] bg-gray-200 flex-1 hidden sm:block"></div>
                                        <ArrowRight size={16} className="text-gray-300 sm:hidden" />
                                    </div>

                                    {/* Arrival */}
                                    <div className="text-center sm:text-right min-w-[105px]">
                                        <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{trip.arrival}</p>
                                        <p className="text-xs font-medium text-gray-500 flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                                            <MapPin size={12} className="text-[#FCA311]" />
                                            {trip.to}
                                        </p>
                                    </div>
                                </div>

                                {/* Price, Type & Available Seats */}
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 lg:w-36 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-4">
                                    <div className="text-right">
                                        <p className="text-xl sm:text-2xl font-black leading-tight" style={{ color: "#B00B21" }}>{trip.fare}</p>
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Per Seat</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide border ${typeColor[trip.type] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                            {trip.type}
                                        </span>
                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                            trip.seats === 0
                                                ? "bg-red-50 text-red-600 border border-red-100"
                                                : trip.seats <= 5
                                                ? "bg-orange-50 text-orange-600 border border-orange-100"
                                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                        }`}>
                                            {trip.seats > 0 ? `${trip.seats} Left` : "Full"}
                                        </span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {filteredSchedules.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                        <div className="bg-gray-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bus size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-0.5">No schedules found</h3>
                        <p className="text-xs text-gray-500 font-medium">We couldn't find any buses matching your current filter selection.</p>
                        <button 
                            onClick={handleResetFilters}
                            className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-colors inline-flex items-center gap-1.5"
                        >
                            <RotateCcw size={14} />
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}