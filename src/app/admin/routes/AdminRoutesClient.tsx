"use client";

import React, { useState, useMemo } from "react";
import type { Route } from "@prisma/client";
import {
    MapPinned,
    MapPin,
    Search,
    ArrowRight,
    Clock,
    Banknote,
    Bus,
    ChevronDown,
} from "lucide-react";

export type RouteWithDetails = Route & {
    fares: { amount?: number; price?: number }[];
    _count: { schedules: number };
};

export interface AdminRoutesClientProps {
    initialRoutes: RouteWithDetails[];
}

function formatDuration(hours: number | null | undefined): string {
    if (hours == null || isNaN(hours)) return "N/A";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h 00m`;
    return `${h}h ${m < 10 ? `0${m}` : m}m`;
}

function formatMinFare(fares: { amount?: number; price?: number }[]): string {
    if (!fares || fares.length === 0) return "N/A";
    const prices = fares
        .map((f) => f.amount ?? f.price)
        .filter((p): p is number => typeof p === "number" && !isNaN(p));
    if (prices.length === 0) return "N/A";
    const minFare = Math.min(...prices);
    return `Starts at ৳${minFare.toLocaleString()}`;
}

export default function AdminRoutesClient({ initialRoutes }: AdminRoutesClientProps) {
    const [search, setSearch] = useState("");
    const [openOrigins, setOpenOrigins] = useState<Record<string, boolean>>({});

    const filtered = useMemo(() => {
        const query = search.toLowerCase().trim();
        if (!query) return initialRoutes;
        return initialRoutes.filter(
            (r) =>
                r.origin.toLowerCase().includes(query) ||
                r.destination.toLowerCase().includes(query) ||
                r.routeId.toLowerCase().includes(query)
        );
    }, [initialRoutes, search]);

    const groupedRoutes = useMemo(() => {
        return filtered.reduce<Record<string, RouteWithDetails[]>>((acc, route) => {
            const origin = route.origin || "Other";
            if (!acc[origin]) {
                acc[origin] = [];
            }
            acc[origin].push(route);
            return acc;
        }, {});
    }, [filtered]);

    const originKeys = Object.keys(groupedRoutes);
    const isSearching = search.trim().length > 0;

    const isOriginOpen = (origin: string) => {
        if (isSearching) {
            return openOrigins[origin] ?? true;
        }
        return !!openOrigins[origin];
    };

    const toggleOrigin = (origin: string) => {
        setOpenOrigins((prev) => ({
            ...prev,
            [origin]: !isOriginOpen(origin),
        }));
    };

    const allOpen = originKeys.length > 0 && originKeys.every((key) => isOriginOpen(key));

    const toggleAll = () => {
        const nextTarget = !allOpen;
        const nextState: Record<string, boolean> = {};
        originKeys.forEach((key) => {
            nextState[key] = nextTarget;
        });
        setOpenOrigins(nextState);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Routes</h1>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {initialRoutes.length} Configured
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage all transit corridors across {originKeys.length} origin hubs
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="relative max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search routes by origin, destination, or ID..."
                        aria-label="Search routes by origin, destination, or ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Origin Flex Boxes Accordion */}
            <div className="space-y-4">
                {originKeys.map((origin) => {
                    const routes = groupedRoutes[origin];
                    const open = isOriginOpen(origin);

                    return (
                        <div
                            key={origin}
                            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border transition-all duration-200 overflow-hidden ${
                                open
                                    ? "border-emerald-300/80 dark:border-emerald-700/80 shadow-md"
                                    : "border-gray-100 dark:border-gray-700/80 hover:border-emerald-200 dark:hover:border-emerald-800/60"
                            }`}
                        >
                            {/* Origin Clickable Flex Box Header */}
                            <button
                                type="button"
                                onClick={() => toggleOrigin(origin)}
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
                                        <MapPinned size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                            From {origin}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                            {open ? "Click to collapse routes" : "Click to view connected destinations"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                                        {routes.length} {routes.length === 1 ? "Route" : "Routes"}
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

                            {/* Collapsible Routes Grid */}
                            {open && (
                                <div className="px-4 pb-5 sm:px-5 border-t border-gray-100 dark:border-gray-700/60 pt-4 bg-gray-50/40 dark:bg-gray-850/40">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {routes.map((route) => {
                                            const isActive = route._count.schedules > 0;
                                            const statusLabel = isActive ? "Active" : "Inactive";
                                            const statusBadgeClass = isActive
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";

                                            return (
                                                <div
                                                    key={route.id}
                                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/90 dark:border-gray-700 p-4 sm:p-5 hover:shadow-md hover:border-emerald-300/70 dark:hover:border-emerald-700/70 transition-all"
                                                >
                                                    {/* Route Header */}
                                                    <div className="flex items-center gap-3 mb-5">
                                                        <div className="bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                                                            <MapPinned size={22} />
                                                        </div>
                                                        <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                                                            <span>{route.origin}</span>
                                                            <ArrowRight size={18} className="text-gray-400 dark:text-gray-500" />
                                                            <span>{route.destination}</span>
                                                        </div>
                                                    </div>

                                                    {/* Route Details */}
                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        {/* Distance */}
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                            <MapPin size={15} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                                                            <span>{route.distanceKm} km</span>
                                                        </div>
                                                        {/* Duration */}
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                            <Clock size={15} className="text-amber-500 dark:text-amber-400 shrink-0" />
                                                            <span>{formatDuration(route.estimatedHours)}</span>
                                                        </div>
                                                        {/* Fare */}
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                            <Banknote size={15} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                                                            <span>{formatMinFare(route.fares)}</span>
                                                        </div>
                                                        {/* Schedules */}
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                            <Bus size={15} className="text-blue-500 dark:text-blue-400 shrink-0" />
                                                            <span>{route._count.schedules} {route._count.schedules === 1 ? "schedule" : "schedules"}</span>
                                                        </div>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass}`}>
                                                            {statusLabel}
                                                        </span>
                                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                                                            {route.routeId}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                    No routes found
                </div>
            )}
        </div>
    );
}
