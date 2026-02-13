"use client";

import React from "react";
import {
    Banknote,
    Ticket,
    Bus,
    Users,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
} from "lucide-react";

const stats = [
    {
        label: "Total Revenue",
        value: "৳ 45,230",
        change: "+12.5%",
        trend: "up" as const,
        icon: Banknote,
        color: "bg-emerald-500",
        lightColor: "bg-emerald-50",
        textColor: "text-emerald-600",
    },
    {
        label: "Today's Bookings",
        value: "142",
        change: "+8.2%",
        trend: "up" as const,
        icon: Ticket,
        color: "bg-indigo-500",
        lightColor: "bg-indigo-50",
        textColor: "text-indigo-600",
    },
    {
        label: "Active Buses",
        value: "24 / 28",
        change: "85.7%",
        trend: "up" as const,
        icon: Bus,
        color: "bg-amber-500",
        lightColor: "bg-amber-50",
        textColor: "text-amber-600",
    },
    {
        label: "Total Users",
        value: "1,204",
        change: "+3.1%",
        trend: "up" as const,
        icon: Users,
        color: "bg-purple-500",
        lightColor: "bg-purple-50",
        textColor: "text-purple-600",
    },
];

const recentBookings = [
    {
        id: "BK-7842",
        name: "Rahim Uddin",
        route: "Dhaka → Bogura",
        date: "Feb 13, 2026 — 10:30 PM",
        status: "Confirmed",
        amount: "৳ 850",
    },
    {
        id: "BK-7841",
        name: "Fatima Akter",
        route: "Bogura → Dhaka",
        date: "Feb 13, 2026 — 9:15 PM",
        status: "Confirmed",
        amount: "৳ 900",
    },
    {
        id: "BK-7840",
        name: "Kamal Hossain",
        route: "Dhaka → Rangpur",
        date: "Feb 13, 2026 — 8:00 PM",
        status: "Pending",
        amount: "৳ 1,100",
    },
    {
        id: "BK-7839",
        name: "Nusrat Jahan",
        route: "Rajshahi → Dhaka",
        date: "Feb 13, 2026 — 6:45 PM",
        status: "Confirmed",
        amount: "৳ 750",
    },
    {
        id: "BK-7838",
        name: "Arif Rahman",
        route: "Dhaka → Bogura",
        date: "Feb 13, 2026 — 5:30 PM",
        status: "Cancelled",
        amount: "৳ 850",
    },
];

const statusBadge: Record<string, string> = {
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminDashboardPage() {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Welcome back, <span style={{ color: "#FCA311" }}>Admin</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{today}</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm self-start sm:self-auto">
                    <ArrowUpRight size={16} />
                    View Reports
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.lightColor} p-2.5 rounded-xl`}>
                                    <Icon size={22} className={stat.textColor} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
                                    {stat.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                        <p className="text-sm text-gray-500">Latest ticket purchases</p>
                    </div>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                        View All →
                    </button>
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Passenger</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date / Time</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-semibold text-indigo-600">{booking.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{booking.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{booking.route}</td>
                                    <td className="px-6 py-4 text-gray-500">{booking.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge[booking.status] || ""}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-900">{booking.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden divide-y divide-gray-100">
                    {recentBookings.map((booking) => (
                        <div key={booking.id} className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-mono font-semibold text-indigo-600 text-sm">{booking.id}</span>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge[booking.status] || ""}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <p className="font-medium text-gray-900">{booking.name}</p>
                            <p className="text-sm text-gray-500">{booking.route}</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">{booking.date}</span>
                                <span className="font-semibold text-gray-900">{booking.amount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
