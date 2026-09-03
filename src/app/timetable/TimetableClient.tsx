"use client";

import React, { useState, useMemo } from "react";
import {
    Clock,
    MapPin,
    Bus,
    ArrowRight,
    Filter,
    Sun,
    Moon,
    Sunrise,
    Sunset,
    ChevronDown,
    ArrowUpDown,
    SlidersHorizontal,
    RotateCcw,
} from "lucide-react";

export type ScheduleData = {
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
    rawDeparture?: string | Date;
};

const periodIcon: Record<string, React.ReactNode> = {
    morning: <Sunrise size={16} className="text-amber-500" />,
    afternoon: <Sun size={16} className="text-orange-500" />,
    evening: <Sunset size={16} className="text-indigo-500" />,
    night: <Moon size={16} className="text-slate-500" />,
};

const typeColor: Record<string, string> = {
    AC: "bg-indigo-50 text-indigo-700 border-indigo-100",
    "NON AC": "bg-gray-100 text-gray-700 border-gray-200",
    SLEEPER: "bg-purple-50 text-purple-700 border-purple-100",
};

interface TimetableClientProps {
    schedules: ScheduleData[];
    routes: string[];
}

export default function TimetableClient({ schedules, routes }: TimetableClientProps) {
    const [selectedRoute, setSelectedRoute] = useState<string>("All Routes");
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
        <div style={{ backgroundColor: "#f8f9fa" }} className="min-h-screen pb-16">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-[#172144] via-[#1e2d5a] to-[#2a3d6e] text-white pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                            <Clock size={28} className="text-[#FCA311]" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Live Timetable</h1>
                    </div>
                    <p className="text-indigo-100 text-lg max-w-2xl leading-relaxed">
                        View real-time departure and arrival schedules for Northern Paribahan.
                    </p>
                </div>
            </div>

            {/* Filter Card */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl shadow-indigo-900/5 border border-gray-100 p-5 sm:p-7 space-y-6">
                    
                    {/* Top Row: Dropdown Filters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                        {/* 1. Route Filter */}
                        <div>
                            <label htmlFor="route-filter" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <MapPin size={14} className="text-indigo-500" />
                                Select Route
                            </label>
                            <div className="relative">
                                <select
                                    id="route-filter"
                                    value={selectedRoute}
                                    onChange={(e) => setSelectedRoute(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <option value="All Routes">🌍 All Routes</option>
                                    {routes.map((r) => (
                                        <option key={r} value={r}>
                                            {r}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* 2. Bus Type Filter */}
                        <div>
                            <label htmlFor="type-filter" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Bus size={14} className="text-indigo-500" />
                                Bus Type
                            </label>
                            <div className="relative">
                                <select
                                    id="type-filter"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <option value="All Types">🚍 All Types</option>
                                    <option value="AC">❄️ AC</option>
                                    <option value="NON AC">🪟 NON AC</option>
                                    <option value="SLEEPER">🛏️ SLEEPER</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* 3. Sort By Dropdown */}
                        <div>
                            <label htmlFor="sort-filter" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <ArrowUpDown size={14} className="text-indigo-500" />
                                Sort By
                            </label>
                            <div className="relative">
                                <select
                                    id="sort-filter"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <option value="earliest">⏰ Earliest Departure</option>
                                    <option value="fare_asc">💰 Lowest Fare</option>
                                    <option value="seats_desc">💺 Most Seats Available</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Time of Day Filter & Quick Actions */}
                    <div className="pt-4 border-t border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <div id="time-period-label" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <SlidersHorizontal size={14} className="text-indigo-500" />
                                Time of Day
                            </div>
                            <div role="group" aria-labelledby="time-period-label" className="flex flex-wrap sm:flex-nowrap gap-2">
                                {[
                                    { key: "all", label: "All Day", icon: <Filter size={15} /> },
                                    { key: "morning", label: "Morning (06:00-12:00)", icon: <Sunrise size={15} className="text-amber-500" /> },
                                    { key: "afternoon", label: "Afternoon (12:00-17:00)", icon: <Sun size={15} className="text-orange-500" /> },
                                    { key: "evening", label: "Evening (17:00-20:00)", icon: <Sunset size={15} className="text-indigo-500" /> },
                                    { key: "night", label: "Night (20:00+)", icon: <Moon size={15} className="text-slate-500" /> },
                                ].map((p) => {
                                    const isActive = selectedPeriod === p.key;
                                    return (
                                        <button
                                            type="button"
                                            key={p.key}
                                            onClick={() => setSelectedPeriod(p.key)}
                                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                                                isActive
                                                    ? "bg-[#172144] text-white shadow-md shadow-indigo-950/20 scale-[1.02]"
                                                    : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50/50"
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
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="self-start lg:self-end flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                            >
                                <RotateCcw size={14} />
                                Reset Filters
                            </button>
                        )}
                    </div>

                </div>
            </div>

            {/* Timetable List Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-semibold">
                        Showing <span className="font-bold text-gray-900">{filteredSchedules.length}</span> of {schedules.length} schedules
                    </p>
                </div>

                {filteredSchedules.map((trip) => (
                    <div
                        key={trip.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden group"
                    >
                        <div className="p-5 sm:p-7">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                                
                                {/* Bus Info */}
                                <div className="flex items-center gap-4 lg:w-56 shrink-0">
                                    <div className="bg-indigo-50 p-3 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                                        <Bus size={24} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">{trip.bus}</h3>
                                        <p className="text-xs text-gray-400 font-mono mt-0.5 bg-gray-50 inline-block px-2 py-0.5 rounded">
                                            {trip.code}
                                        </p>
                                    </div>
                                </div>

                                {/* Route & Time */}
                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-gray-50/50 p-4 sm:p-0 sm:bg-transparent rounded-xl">
                                    {/* Departure */}
                                    <div className="text-center sm:text-left min-w-[120px]">
                                        <p className="text-2xl font-black text-gray-900 tracking-tight">{trip.departure}</p>
                                        <p className="text-sm font-medium text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                                            <MapPin size={14} className="text-indigo-400" />
                                            {trip.from}
                                        </p>
                                    </div>

                                    {/* Arrow & Duration */}
                                    <div className="flex items-center gap-3 justify-center flex-1">
                                        <div className="h-[2px] bg-gray-100 flex-1 hidden sm:block"></div>
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-xs font-bold text-gray-600">
                                            {periodIcon[trip.period]}
                                            {trip.duration}
                                        </div>
                                        <div className="h-[2px] bg-gray-100 flex-1 hidden sm:block"></div>
                                        <ArrowRight size={20} className="text-gray-300 sm:hidden" />
                                    </div>

                                    {/* Arrival */}
                                    <div className="text-center sm:text-right min-w-[120px]">
                                        <p className="text-2xl font-black text-gray-900 tracking-tight">{trip.arrival}</p>
                                        <p className="text-sm font-medium text-gray-500 flex items-center justify-center sm:justify-end gap-1.5 mt-1">
                                            <MapPin size={14} className="text-[#FCA311]" />
                                            {trip.to}
                                        </p>
                                    </div>
                                </div>

                                {/* Price, Type & Available Seats */}
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 lg:w-44 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-8">
                                    <div className="text-right">
                                        <p className="text-2xl font-black" style={{ color: "#FCA311" }}>{trip.fare}</p>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Per Seat</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black tracking-wide border ${typeColor[trip.type] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                            {trip.type}
                                        </span>
                                        <span className={`text-xs font-black px-2.5 py-1 rounded-md ${
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
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Bus size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No schedules found</h3>
                        <p className="text-gray-500 font-medium">We couldn't find any buses matching your current filter selection.</p>
                        <button 
                            onClick={handleResetFilters}
                            className="mt-6 px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors inline-flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}