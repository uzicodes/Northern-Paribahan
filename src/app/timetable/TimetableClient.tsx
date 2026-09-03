"use client";

import React, { useState } from "react";
import {
    Clock, MapPin, Bus, ArrowRight, Filter,
    Sun, Moon, Sunrise, Sunset, ChevronDown
} from "lucide-react";

type ScheduleData = {
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
    seats: number;
    period: string;
};

const periodIcon: Record<string, React.ReactNode> = {
    morning: <Sunrise size={16} className="text-amber-500" />,
    afternoon: <Sun size={16} className="text-orange-500" />,
    evening: <Sunset size={16} className="text-indigo-500" />,
    night: <Moon size={16} className="text-slate-500" />,
};

const typeColor: Record<string, string> = {
    AC: "bg-indigo-50 text-indigo-700 border-indigo-100",
    "NON AC": "bg-gray-100 text-gray-600 border-gray-200",
    SLEEPER: "bg-purple-50 text-purple-700 border-purple-100",
};

interface TimetableClientProps {
    schedules: ScheduleData[];
    routes: string[];
}

export default function TimetableClient({ schedules, routes }: TimetableClientProps) {
    const [selectedRoute, setSelectedRoute] = useState("All Routes");
    const [selectedPeriod, setSelectedPeriod] = useState("all");

    const filtered = schedules.filter((t) => {
        const routeStr = `${t.from} → ${t.to}`;
        const matchesRoute = selectedRoute === "All Routes" || routeStr === selectedRoute;
        const matchesPeriod = selectedPeriod === "all" || t.period === selectedPeriod;
        return matchesRoute && matchesPeriod;
    });

    return (
        <div style={{ backgroundColor: "#f8f9fa" }} className="min-h-screen pb-12">
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

            {/* Filters */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl shadow-indigo-900/5 border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-5">
                    
                    {/* Route Filter */}
                    <div className="flex-1">
                        <label htmlFor="route-filter" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                            Select Route
                        </label>
                        <div className="relative">
                            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                            <select
                                id="route-filter"
                                value={selectedRoute}
                                onChange={(e) => setSelectedRoute(e.target.value)}
                                className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <option value="All Routes">🌍 All Routes</option>
                                {routes.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Time Period Filter */}
                    <div className="sm:w-auto">
                        <div id="time-period-label" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                            Time of Day
                        </div>
                        <div role="group" aria-labelledby="time-period-label" className="flex flex-wrap sm:flex-nowrap gap-2">
                            {[
                                { key: "all", label: "All", icon: <Filter size={16} /> },
                                { key: "morning", label: "AM", icon: <Sunrise size={16} /> },
                                { key: "afternoon", label: "PM", icon: <Sun size={16} /> },
                                { key: "evening", label: "Eve", icon: <Sunset size={16} /> },
                                { key: "night", label: "Night", icon: <Moon size={16} /> },
                            ].map((p) => (
                                <button
                                    type="button"
                                    key={p.key}
                                    onClick={() => setSelectedPeriod(p.key)}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                        selectedPeriod === p.key
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]"
                                            : "bg-white border border-gray-200 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50/50"
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

            {/* Timetable List */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-semibold">{filtered.length} schedules available</p>
                </div>

                {filtered.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden group">
                        <div className="p-5 sm:p-7">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                                
                                {/* Bus Info */}
                                <div className="flex items-center gap-4 lg:w-56 shrink-0">
                                    <div className="bg-indigo-50 p-3 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                                        <Bus size={24} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">{trip.bus}</h3>
                                        <p className="text-xs text-gray-400 font-mono mt-0.5 bg-gray-50 inline-block px-2 py-0.5 rounded">{trip.code}</p>
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

                                {/* Price & Seats */}
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 lg:w-40 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-8">
                                    <div className="text-right">
                                        <p className="text-2xl font-black" style={{ color: "#FCA311" }}>{trip.fare}</p>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Per Seat</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black tracking-wide border ${typeColor[trip.type] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                            {trip.type}
                                        </span>
                                        <span className={`text-xs font-black px-2.5 py-1 rounded-md ${
                                            trip.seats === 0 ? "bg-red-50 text-red-600 border border-red-100" :
                                            trip.seats <= 5 ? "bg-orange-50 text-orange-600 border border-orange-100" : 
                                            "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                        }`}>
                                            {trip.seats > 0 ? `${trip.seats} Left` : "Full"}
                                        </span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Bus size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No schedules found</h3>
                        <p className="text-gray-500 font-medium">We couldn't find any buses matching your current filters.</p>
                        <button 
                            onClick={() => { setSelectedRoute("All Routes"); setSelectedPeriod("all"); }}
                            className="mt-6 px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}