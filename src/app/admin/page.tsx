import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
    Banknote,
    Ticket,
    Bus,
    Users,
    Clock,
    ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [revenueAgg, todayBookings, activeBuses, totalUsers, todaySchedules] = await Promise.all([
        prisma.booking.aggregate({
            _sum: { totalFare: true },
            where: { status: "CONFIRMED" },
        }),
        prisma.booking.count({
            where: { createdAt: { gte: startOfToday } },
        }),
        prisma.bus.count(),
        prisma.user.count({
            where: { role: "USER" },
        }),
        prisma.schedule.findMany({
            where: {
                departureTime: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
            include: {
                bus: {
                    select: {
                        capacity: true,
                        tier: true,
                        registrationNumber: true,
                        modelName: true,
                    },
                },
                _count: {
                    select: { tickets: true },
                },
            },
            orderBy: { departureTime: "asc" },
        }),
    ]);

    const totalRevenue = revenueAgg._sum.totalFare ?? 0;

    const stats = [
        {
            label: "Total Revenue",
            value: `৳ ${totalRevenue.toLocaleString()}`,
            icon: Banknote,
            lightColor: "bg-emerald-50 dark:bg-emerald-950/40",
            textColor: "text-emerald-600 dark:text-emerald-400",
        },
        {
            label: "Today's Bookings",
            value: todayBookings.toLocaleString(),
            icon: Ticket,
            lightColor: "bg-indigo-50 dark:bg-indigo-950/40",
            textColor: "text-indigo-600 dark:text-indigo-400",
        },
        {
            label: "Active Buses",
            value: `${activeBuses}`,
            icon: Bus,
            lightColor: "bg-amber-50 dark:bg-amber-950/40",
            textColor: "text-amber-600 dark:text-amber-400",
        },
        {
            label: "Total Users",
            value: totalUsers.toLocaleString(),
            icon: Users,
            lightColor: "bg-purple-50 dark:bg-purple-950/40",
            textColor: "text-purple-600 dark:text-purple-400",
        },
    ];

    const todayFormatted = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getScheduleStatus = (departureDate: Date) => {
        const depTime = new Date(departureDate).getTime();
        const currentTime = now.getTime();
        const diffMs = depTime - currentTime;

        // Past departure
        if (diffMs < 0) {
            return {
                label: "Departed",
                className: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
                isBoarding: false,
            };
        }

        // Within 30 minutes
        if (diffMs <= 30 * 60 * 1000) {
            return {
                label: "Boarding",
                className: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
                isBoarding: true,
            };
        }

        // Future (> 30 minutes)
        return {
            label: "Upcoming",
            className: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
            isBoarding: false,
        };
    };

    const tierBadgeStyle: Record<string, string> = {
        PREMIUM: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
        BUSINESS: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
        ECONOMY: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, <span style={{ color: "#FCA311" }}>Admin</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{todayFormatted}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.lightColor} p-2.5 rounded-xl`}>
                                    <Icon size={22} className={stat.textColor} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Today's Departure Operations Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Today&apos;s Departure Operations</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Live schedule status and coach occupancy for today</p>
                    </div>
                    <Link
                        href="/admin/bookings"
                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                    >
                        <span>View All Bookings</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {todaySchedules.length === 0 ? (
                    <div className="p-8 text-center">
                        <Clock size={32} className="mx-auto text-gray-400 dark:text-gray-500 mb-2 opacity-60" />
                        <p className="text-gray-600 dark:text-gray-400 font-medium">No departures scheduled for today.</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Schedules departing between 12:00 AM and 11:59 PM will appear here.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700/60">
                                        <th className="px-6 py-3.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Departure</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Route</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Coach Info</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Occupancy</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                                    {todaySchedules.map((schedule) => {
                                        const capacity = schedule.bus?.capacity || 40;
                                        const booked = schedule._count.tickets;
                                        const occupancy = Math.min(100, Math.round((booked / capacity) * 100));
                                        const status = getScheduleStatus(schedule.departureTime);
                                        const tier = schedule.bus?.tier || "ECONOMY";

                                        return (
                                            <tr key={schedule.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                                {/* Departure */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-semibold text-gray-900 dark:text-white">
                                                        {formatTime(schedule.departureTime)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                                        <Clock size={12} />
                                                        <span>Est. Arr: {formatTime(schedule.arrivalTime)}</span>
                                                    </div>
                                                </td>

                                                {/* Route */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-white">
                                                        <span>{schedule.origin}</span>
                                                        <span className="text-gray-400 dark:text-gray-500">→</span>
                                                        <span>{schedule.destination}</span>
                                                    </div>
                                                </td>

                                                {/* Coach Info */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                            <span>{schedule.bus?.modelName || schedule.busName}</span>
                                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold border ${tierBadgeStyle[tier] || ""}`}>
                                                                {tier}
                                                            </span>
                                                        </div>
                                                        <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                                            {schedule.bus?.registrationNumber || schedule.registrationNumber}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Occupancy */}
                                                <td className="px-6 py-4">
                                                    <div className="w-full max-w-[200px] space-y-1.5">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                {booked} / {capacity} seats
                                                            </span>
                                                            <span className={`font-semibold ${occupancy >= 90 ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"}`}>
                                                                {occupancy}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-300 ${
                                                                    occupancy >= 90 ? "bg-emerald-500" : "bg-indigo-600"
                                                                }`}
                                                                style={{ width: `${occupancy}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.className}`}>
                                                        {status.isBoarding && (
                                                            <span className="relative flex h-2 w-2 mr-1.5">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                            </span>
                                                        )}
                                                        {status.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-700/60">
                            {todaySchedules.map((schedule) => {
                                const capacity = schedule.bus?.capacity || 40;
                                const booked = schedule._count.tickets;
                                const occupancy = Math.min(100, Math.round((booked / capacity) * 100));
                                const status = getScheduleStatus(schedule.departureTime);
                                const tier = schedule.bus?.tier || "ECONOMY";

                                return (
                                    <div key={schedule.id} className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-base text-gray-900 dark:text-white">
                                                {formatTime(schedule.departureTime)}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.className}`}>
                                                {status.isBoarding && (
                                                    <span className="relative flex h-2 w-2 mr-1.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                    </span>
                                                )}
                                                {status.label}
                                            </span>
                                        </div>

                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                                                <span>{schedule.origin}</span>
                                                <span className="text-gray-400">→</span>
                                                <span>{schedule.destination}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {schedule.bus?.modelName || schedule.busName} • {schedule.bus?.registrationNumber || schedule.registrationNumber}
                                                <span className={`ml-2 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold border ${tierBadgeStyle[tier] || ""}`}>
                                                    {tier}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    Occupancy ({booked} / {capacity})
                                                </span>
                                                <span className={`font-semibold ${occupancy >= 90 ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"}`}>
                                                    {occupancy}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${occupancy >= 90 ? "bg-emerald-500" : "bg-indigo-600"}`}
                                                    style={{ width: `${occupancy}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
