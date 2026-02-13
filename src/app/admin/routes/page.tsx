"use client";

import React, { useState } from "react";
import {
    MapPinned,
    Search,
    Plus,
    ArrowRight,
    Clock,
    Banknote,
    Bus,
} from "lucide-react";

const routesData = [
    { id: 1, from: "Dhaka", to: "Bogura", distance: "220 km", duration: "5h 30m", fare: "৳ 850", buses: 3, departures: 6, status: "Active" },
    { id: 2, from: "Bogura", to: "Dhaka", distance: "220 km", duration: "5h 30m", fare: "৳ 900", buses: 3, departures: 6, status: "Active" },
    { id: 3, from: "Dhaka", to: "Rangpur", distance: "310 km", duration: "7h 00m", fare: "৳ 1,100", buses: 2, departures: 4, status: "Active" },
    { id: 4, from: "Rangpur", to: "Dhaka", distance: "310 km", duration: "7h 00m", fare: "৳ 1,100", buses: 2, departures: 4, status: "Active" },
    { id: 5, from: "Rajshahi", to: "Dhaka", distance: "260 km", duration: "6h 00m", fare: "৳ 750", buses: 1, departures: 2, status: "Active" },
    { id: 6, from: "Bogura", to: "Rangpur", distance: "150 km", duration: "3h 30m", fare: "৳ 600", buses: 1, departures: 2, status: "Active" },
    { id: 7, from: "Dhaka", to: "Rajshahi", distance: "260 km", duration: "6h 00m", fare: "৳ 800", buses: 1, departures: 2, status: "Inactive" },
];

export default function AdminRoutesPage() {
    const [search, setSearch] = useState("");

    const filtered = routesData.filter(
        (r) =>
            r.from.toLowerCase().includes(search.toLowerCase()) ||
            r.to.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Routes</h1>
                    <p className="text-sm text-gray-500 mt-1">{routesData.length} routes configured</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm self-start">
                    <Plus size={16} />
                    Add Route
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="relative max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search routes by city name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Routes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((route) => (
                    <div key={route.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        {/* Route Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-indigo-50 p-2.5 rounded-xl">
                                <MapPinned size={22} className="text-indigo-600" />
                            </div>
                            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                <span>{route.from}</span>
                                <ArrowRight size={18} className="text-gray-400" />
                                <span>{route.to}</span>
                            </div>
                        </div>

                        {/* Route Details */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPinned size={14} className="text-gray-400 shrink-0" />
                                {route.distance}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock size={14} className="text-gray-400 shrink-0" />
                                {route.duration}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Banknote size={14} className="text-gray-400 shrink-0" />
                                {route.fare}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Bus size={14} className="text-gray-400 shrink-0" />
                                {route.buses} buses
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${route.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                                {route.status}
                            </span>
                            <span className="text-xs text-gray-400">{route.departures} departures/day</span>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">No routes found</div>
                )}
            </div>
        </div>
    );
}
