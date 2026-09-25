"use client";

import React, { useState, useMemo } from "react";
import type { Bus } from "@prisma/client";
import {
    Search,
    Clock,
    Users,
    Building,
    ChevronDown,
} from "lucide-react";

export type BusWithDetails = Bus & {
    depot: {
        name: string;
        location?: string;
        city?: string;
    };
    _count: {
        schedules: number;
    };
};

export interface AdminBusesClientProps {
    initialBuses: BusWithDetails[];
}

const tierColorMap: Record<string, string> = {
    PREMIUM: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    BUSINESS: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    ECONOMY: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    AC: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    NON_AC: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    "Non-AC": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    SLEEPER: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    "AC Sleeper": "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800",
};

export default function AdminBusesClient({ initialBuses }: AdminBusesClientProps) {
    const [search, setSearch] = useState("");
    const [openDepots, setOpenDepots] = useState<Record<string, boolean>>({});

    const filtered = useMemo(() => {
        const query = search.toLowerCase().trim();
        if (!query) return initialBuses;
        return initialBuses.filter(
            (b) =>
                b.modelName.toLowerCase().includes(query) ||
                b.registrationNumber.toLowerCase().includes(query) ||
                b.depot?.name.toLowerCase().includes(query)
        );
    }, [initialBuses, search]);

    const groupedBuses = useMemo(() => {
        return filtered.reduce<Record<string, BusWithDetails[]>>((acc, bus) => {
            const depotName = bus.depot?.name || "Unassigned";
            if (!acc[depotName]) {
                acc[depotName] = [];
            }
            acc[depotName].push(bus);
            return acc;
        }, {});
    }, [filtered]);

    const depotKeys = Object.keys(groupedBuses);
    const isSearching = search.trim().length > 0;

    // A depot is open if explicitly toggled on, or if actively searching matching results
    const isDepotOpen = (depotName: string) => {
        if (isSearching) {
            return openDepots[depotName] ?? true;
        }
        return !!openDepots[depotName];
    };

    const toggleDepot = (depotName: string) => {
        setOpenDepots((prev) => ({
            ...prev,
            [depotName]: !isDepotOpen(depotName),
        }));
    };

    const allOpen = depotKeys.length > 0 && depotKeys.every((key) => isDepotOpen(key));

    const toggleAll = () => {
        const nextTarget = !allOpen;
        const nextState: Record<string, boolean> = {};
        depotKeys.forEach((key) => {
            nextState[key] = nextTarget;
        });
        setOpenDepots(nextState);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Buses</h1>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Active Fleet
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your fleet of {initialBuses.length} buses across {Object.keys(groupedBuses).length} depots
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="relative max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by model, registration, or depot..."
                        aria-label="Search buses by model, registration, or depot"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Depot Flex Boxes Accordion */}
            <div className="space-y-4">
                {depotKeys.map((depotName) => {
                    const buses = groupedBuses[depotName];
                    const open = isDepotOpen(depotName);
                    const depotCity = buses[0]?.depot?.city || buses[0]?.depot?.location;

                    return (
                        <div
                            key={depotName}
                            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border transition-all duration-200 overflow-hidden ${
                                open
                                    ? "border-emerald-300/80 dark:border-emerald-700/80 shadow-md"
                                    : "border-gray-100 dark:border-gray-700/80 hover:border-emerald-200 dark:hover:border-emerald-800/60"
                            }`}
                        >
                            {/* Depot Clickable Flex Box Header */}
                            <button
                                type="button"
                                onClick={() => toggleDepot(depotName)}
                                className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors duration-150 hover:bg-gray-50/70 dark:hover:bg-gray-750/50"
                                aria-expanded={open}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div
                                        className={`p-3 rounded-xl transition-colors ${
                                            open
                                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                                                : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                                        }`}
                                    >
                                        <Building size={22} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                                {depotName}
                                            </h2>
                                            {depotCity && (
                                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60 font-medium">
                                                    {depotCity}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                            {open ? "Click to collapse fleet" : "Click to view assigned fleet"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                                        {buses.length} {buses.length === 1 ? "Bus" : "Buses"}
                                    </span>
                                    <div
                                        className={`p-1.5 rounded-lg text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                                            open ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                                        }`}
                                    >
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                            </button>

                            {/* Collapsible Bus Cards Grid */}
                            {open && (
                                <div className="px-4 pb-5 sm:px-5 border-t border-gray-100 dark:border-gray-700/60 pt-4 bg-gray-50/40 dark:bg-gray-850/40">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                                        {buses.map((bus) => (
                                            <div
                                                key={bus.id}
                                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/90 dark:border-gray-700 p-3 sm:p-3.5 hover:shadow-md hover:border-emerald-300/70 dark:hover:border-emerald-700/70 transition-all flex flex-col justify-between"
                                            >
                                                <div>
                                                    {/* Name and Tier badge close together */}
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                                                            {bus.modelName}
                                                        </h3>
                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${
                                                                tierColorMap[bus.tier] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                                            }`}
                                                        >
                                                            {bus.tier}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-2.5">
                                                        {bus.registrationNumber}
                                                    </p>
                                                </div>

                                                {/* Seats and Schedules close together */}
                                                <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-700/70 text-xs">
                                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                                        <Users size={13} className="text-blue-500 dark:text-blue-400 shrink-0" />
                                                        <span>{bus.capacity} Seats</span>
                                                    </div>
                                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                                        <Clock size={13} className="text-amber-500 dark:text-amber-400 shrink-0" />
                                                        <span>{bus._count.schedules} Schedules</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                    No buses found
                </div>
            )}
        </div>
    );
}
