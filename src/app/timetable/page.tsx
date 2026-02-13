"use client";

import React, { useState } from "react";
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
    Banknote,
    ChevronDown,
} from "lucide-react";

const routes = ["All Routes", "Dhaka → Bogura", "Bogura → Dhaka", "Dhaka → Rangpur", "Rangpur → Dhaka", "Rajshahi → Dhaka", "Bogura → Rangpur"];

const timetableData = [
    { id: 1, bus: "Shyamoli Express", code: "NR-101", from: "Dhaka", to: "Bogura", departure: "6:00 AM", arrival: "11:30 AM", duration: "5h 30m", type: "AC", fare: "৳ 850", seats: 12, period: "morning" },
    { id: 2, bus: "Northern Premium", code: "NR-201", from: "Dhaka", to: "Rangpur", departure: "7:00 AM", arrival: "2:00 PM", duration: "7h 00m", type: "AC", fare: "৳ 1,100", seats: 8, period: "morning" },
    { id: 3, bus: "Northern Classic", code: "NR-103", from: "Rajshahi", to: "Dhaka", departure: "8:00 AM", arrival: "2:00 PM", duration: "6h 00m", type: "Non-AC", fare: "৳ 750", seats: 20, period: "morning" },
    { id: 4, bus: "Shyamoli Deluxe", code: "NR-102", from: "Bogura", to: "Dhaka", departure: "9:00 AM", arrival: "2:30 PM", duration: "5h 30m", type: "AC", fare: "৳ 900", seats: 5, period: "morning" },
    { id: 5, bus: "Northern Local", code: "NR-301", from: "Bogura", to: "Rangpur", departure: "10:00 AM", arrival: "1:30 PM", duration: "3h 30m", type: "Non-AC", fare: "৳ 600", seats: 30, period: "morning" },
    { id: 6, bus: "Shyamoli Express", code: "NR-101", from: "Dhaka", to: "Bogura", departure: "2:00 PM", arrival: "7:30 PM", duration: "5h 30m", type: "AC", fare: "৳ 850", seats: 18, period: "afternoon" },
    { id: 7, bus: "Northern Premium", code: "NR-201", from: "Dhaka", to: "Rangpur", departure: "3:00 PM", arrival: "10:00 PM", duration: "7h 00m", type: "AC", fare: "৳ 1,100", seats: 14, period: "afternoon" },
    { id: 8, bus: "Northern Classic", code: "NR-103", from: "Rajshahi", to: "Dhaka", departure: "5:00 PM", arrival: "11:00 PM", duration: "6h 00m", type: "Non-AC", fare: "৳ 750", seats: 22, period: "evening" },
    { id: 9, bus: "Shyamoli Deluxe", code: "NR-102", from: "Bogura", to: "Dhaka", departure: "7:00 PM", arrival: "12:30 AM", duration: "5h 30m", type: "AC", fare: "৳ 900", seats: 10, period: "evening" },
    { id: 10, bus: "Shyamoli Night", code: "NR-302", from: "Dhaka", to: "Bogura", departure: "10:30 PM", arrival: "4:00 AM", duration: "5h 30m", type: "AC Sleeper", fare: "৳ 1,200", seats: 6, period: "night" },
    { id: 11, bus: "Northern Local", code: "NR-301", from: "Bogura", to: "Rangpur", departure: "11:00 PM", arrival: "2:30 AM", duration: "3h 30m", type: "Non-AC", fare: "৳ 600", seats: 25, period: "night" },
    { id: 12, bus: "Northern Express", code: "NR-202", from: "Rangpur", to: "Dhaka", departure: "9:00 PM", arrival: "4:00 AM", duration: "7h 00m", type: "AC", fare: "৳ 1,100", seats: 16, period: "night" },
];

const periodIcon: Record<string, React.ReactNode> = {
    morning: <Sunrise size={14} className="text-amber-500" />,
    afternoon: <Sun size={14} className="text-orange-500" />,
    evening: <Sunset size={14} className="text-indigo-500" />,
    night: <Moon size={14} className="text-slate-500" />,
};

const periodLabel: Record<string, string> = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
};

const typeColor: Record<string, string> = {
    AC: "bg-indigo-50 text-indigo-700",
    "Non-AC": "bg-gray-100 text-gray-600",
    "AC Sleeper": "bg-purple-50 text-purple-700",
};

export default function TimetablePage() {
    const [selectedRoute, setSelectedRoute] = useState("All Routes");
    const [selectedPeriod, setSelectedPeriod] = useState("all");

    const filtered = timetableData.filter((t) => {
        const routeStr = `${t.from} → ${t.to}`;
        const matchesRoute = selectedRoute === "All Routes" || routeStr === selectedRoute;
        const matchesPeriod = selectedPeriod === "all" || t.period === selectedPeriod;
        return matchesRoute && matchesPeriod;
    });

    return (
        <div style={{ backgroundColor: "#C9CBA3" }} className="min-h-screen">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-[#172144] via-[#1e2d5a] to-[#2a3d6e] text-white">
                <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                            <Clock size={24} className="text-[#FCA311]" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold">Bus Timetable</h1>
                    </div>
                    <p className="text-gray-300 text-lg max-w-xl">
                        View all departure and arrival schedules for Northern Paribahan buses across our routes.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-6xl mx-auto px-4 -mt-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                    {/* Route Filter */}
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Route</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={selectedRoute}
                                onChange={(e) => setSelectedRoute(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                            >
                                {routes.map((r) => (
                                    <option key={r}>{r}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Time Period Filter */}
                    <div className="sm:w-72">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Time of Day</label>
                        <div className="flex gap-1.5">
                            {[
                                { key: "all", label: "All", icon: <Filter size={14} /> },
                                { key: "morning", label: "AM", icon: <Sunrise size={14} /> },
                                { key: "afternoon", label: "PM", icon: <Sun size={14} /> },
                                { key: "evening", label: "Eve", icon: <Sunset size={14} /> },
                                { key: "night", label: "Night", icon: <Moon size={14} /> },
                            ].map((p) => (
                                <button
                                    key={p.key}
                                    onClick={() => setSelectedPeriod(p.key)}
                                    className={`flex-1 flex items-center justify-center gap-1 py-3 rounded-xl text-xs font-semibold transition-all ${selectedPeriod === p.key
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    {p.icon}
                                    <span className="hidden sm:inline">{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Timetable */}
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
                {/* Results count */}
                <p className="text-sm text-gray-600 font-medium">{filtered.length} schedules found</p>

                {/* Schedule Cards */}
                {filtered.map((trip) => (
                    <div
                        key={trip.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
                    >
                        <div className="p-5 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                {/* Bus Info */}
                                <div className="flex items-center gap-3 sm:w-48 shrink-0">
                                    <div className="bg-indigo-50 p-2.5 rounded-xl">
                                        <Bus size={22} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{trip.bus}</h3>
                                        <p className="text-xs text-gray-400 font-mono">{trip.code}</p>
                                    </div>
                                </div>

                                {/* Route & Time */}
                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Departure */}
                                    <div className="text-center sm:text-left">
                                        <p className="text-2xl font-bold text-gray-900">{trip.departure}</p>
                                        <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                                            <MapPin size={12} />
                                            {trip.from}
                                        </p>
                                    </div>

                                    {/* Arrow & Duration */}
                                    <div className="flex items-center gap-2 justify-center flex-1">
                                        <div className="h-px bg-gray-200 flex-1 hidden sm:block"></div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-xs font-semibold text-gray-500">
                                            {periodIcon[trip.period]}
                                            {trip.duration}
                                        </div>
                                        <div className="h-px bg-gray-200 flex-1 hidden sm:block"></div>
                                        <ArrowRight size={16} className="text-gray-300 sm:hidden" />
                                    </div>

                                    {/* Arrival */}
                                    <div className="text-center sm:text-right">
                                        <p className="text-2xl font-bold text-gray-900">{trip.arrival}</p>
                                        <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-end gap-1">
                                            <MapPin size={12} />
                                            {trip.to}
                                        </p>
                                    </div>
                                </div>

                                {/* Price & Seats */}
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:w-36 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-6">
                                    <div className="text-right">
                                        <p className="text-xl font-bold" style={{ color: "#FCA311" }}>{trip.fare}</p>
                                        <p className="text-xs text-gray-400">per seat</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${typeColor[trip.type] || ""}`}>
                                            {trip.type}
                                        </span>
                                        <span className={`text-xs font-semibold ${trip.seats <= 5 ? "text-red-500" : trip.seats <= 10 ? "text-amber-500" : "text-emerald-600"}`}>
                                            {trip.seats} seats
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <Bus size={48} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No schedules found for this route and time.</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters.</p>
                    </div>
                )}

                {/* Legend */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Schedule Legend</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <Sunrise size={14} className="text-amber-500" />
                            Morning (6 AM – 12 PM)
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Sun size={14} className="text-orange-500" />
                            Afternoon (12 PM – 5 PM)
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Sunset size={14} className="text-indigo-500" />
                            Evening (5 PM – 8 PM)
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Moon size={14} className="text-slate-500" />
                            Night (8 PM – 6 AM)
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                            10+ seats
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                            6-10 seats
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                            ≤ 5 seats
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
