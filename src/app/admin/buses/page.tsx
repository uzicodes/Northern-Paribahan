"use client";

import React, { useState } from "react";
import {
    Bus,
    Search,
    Plus,
    MoreVertical,
    MapPin,
    Clock,
    Users,
    Fuel,
} from "lucide-react";

const busesData = [
    { id: "NR-101", name: "Shyamoli Express", type: "AC", capacity: 40, route: "Dhaka → Bogura", driver: "Habibur Rahman", status: "Active", departures: "6:00 AM, 10:30 PM", fuel: "Diesel" },
    { id: "NR-102", name: "Shyamoli Deluxe", type: "AC", capacity: 36, route: "Bogura → Dhaka", driver: "Mizanur Rahman", status: "Active", departures: "7:00 AM, 9:15 PM", fuel: "Diesel" },
    { id: "NR-103", name: "Northern Classic", type: "Non-AC", capacity: 44, route: "Rajshahi → Dhaka", driver: "Abdur Rahim", status: "Active", departures: "8:00 AM, 6:45 PM", fuel: "CNG" },
    { id: "NR-201", name: "Northern Premium", type: "AC", capacity: 36, route: "Dhaka → Rangpur", driver: "Karim Mia", status: "Active", departures: "9:00 AM, 8:00 PM", fuel: "Diesel" },
    { id: "NR-202", name: "Northern Express", type: "AC", capacity: 40, route: "Rangpur → Dhaka", driver: "Salim Ahmed", status: "Maintenance", departures: "10:00 AM, 9:00 PM", fuel: "Diesel" },
    { id: "NR-301", name: "Northern Local", type: "Non-AC", capacity: 50, route: "Bogura → Rangpur", driver: "Jalal Uddin", status: "Active", departures: "6:30 AM, 11:00 PM", fuel: "CNG" },
    { id: "NR-302", name: "Shyamoli Night", type: "AC Sleeper", capacity: 28, route: "Dhaka → Bogura", driver: "Rafiq Islam", status: "Inactive", departures: "11:30 PM", fuel: "Diesel" },
];

const statusColor: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Maintenance: "bg-amber-50 text-amber-700 border-amber-200",
    Inactive: "bg-gray-100 text-gray-500 border-gray-200",
};

const typeColor: Record<string, string> = {
    AC: "bg-indigo-50 text-indigo-700",
    "Non-AC": "bg-gray-100 text-gray-600",
    "AC Sleeper": "bg-purple-50 text-purple-700",
};

export default function AdminBusesPage() {
    const [search, setSearch] = useState("");

    const filtered = busesData.filter(
        (b) =>
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.id.toLowerCase().includes(search.toLowerCase()) ||
            b.route.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Buses</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your fleet of {busesData.length} buses</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm self-start">
                    <Plus size={16} />
                    Add Bus
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="relative max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or route..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Bus Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((bus) => (
                    <div key={bus.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-50 p-2.5 rounded-xl">
                                    <Bus size={22} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{bus.name}</h3>
                                    <p className="text-xs text-gray-400 font-mono">{bus.id}</p>
                                </div>
                            </div>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                                <MoreVertical size={16} />
                            </button>
                        </div>

                        <div className="space-y-2.5 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin size={14} className="text-gray-400 shrink-0" />
                                {bus.route}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock size={14} className="text-gray-400 shrink-0" />
                                {bus.departures}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users size={14} className="text-gray-400 shrink-0" />
                                {bus.capacity} seats — Driver: {bus.driver}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Fuel size={14} className="text-gray-400 shrink-0" />
                                {bus.fuel}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor[bus.status] || ""}`}>
                                {bus.status}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${typeColor[bus.type] || ""}`}>
                                {bus.type}
                            </span>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">No buses found</div>
                )}
            </div>
        </div>
    );
}
