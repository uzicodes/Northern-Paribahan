"use client";

import React, { useState } from "react";
import {
    Ticket,
    Search,
    Filter,
    Download,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const bookingsData = [
    { id: "BK-7842", name: "Rahim Uddin", email: "rahim@email.com", route: "Dhaka → Bogura", bus: "Shyamoli NR-101", seat: "A4", date: "Feb 13, 2026", time: "10:30 PM", status: "Confirmed", amount: "৳ 850", payment: "bKash" },
    { id: "BK-7841", name: "Fatima Akter", email: "fatima@email.com", route: "Bogura → Dhaka", bus: "Shyamoli NR-102", seat: "B2", date: "Feb 13, 2026", time: "9:15 PM", status: "Confirmed", amount: "৳ 900", payment: "Nagad" },
    { id: "BK-7840", name: "Kamal Hossain", email: "kamal@email.com", route: "Dhaka → Rangpur", bus: "Northern NR-201", seat: "C1", date: "Feb 13, 2026", time: "8:00 PM", status: "Pending", amount: "৳ 1,100", payment: "Card" },
    { id: "BK-7839", name: "Nusrat Jahan", email: "nusrat@email.com", route: "Rajshahi → Dhaka", bus: "Northern NR-103", seat: "A1", date: "Feb 13, 2026", time: "6:45 PM", status: "Confirmed", amount: "৳ 750", payment: "bKash" },
    { id: "BK-7838", name: "Arif Rahman", email: "arif@email.com", route: "Dhaka → Bogura", bus: "Shyamoli NR-101", seat: "D3", date: "Feb 13, 2026", time: "5:30 PM", status: "Cancelled", amount: "৳ 850", payment: "Nagad" },
    { id: "BK-7837", name: "Sumaiya Islam", email: "sumaiya@email.com", route: "Bogura → Rangpur", bus: "Northern NR-301", seat: "B4", date: "Feb 12, 2026", time: "11:00 PM", status: "Confirmed", amount: "৳ 600", payment: "Cash" },
    { id: "BK-7836", name: "Tanvir Ahmed", email: "tanvir@email.com", route: "Dhaka → Bogura", bus: "Shyamoli NR-102", seat: "A2", date: "Feb 12, 2026", time: "10:00 PM", status: "Confirmed", amount: "৳ 850", payment: "bKash" },
    { id: "BK-7835", name: "Minhaz Kabir", email: "minhaz@email.com", route: "Rangpur → Dhaka", bus: "Northern NR-202", seat: "C3", date: "Feb 12, 2026", time: "9:00 PM", status: "Refunded", amount: "৳ 1,100", payment: "Card" },
];

const statusBadge: Record<string, string> = {
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
    Refunded: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function AdminBookingsPage() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const filtered = bookingsData.filter((b) => {
        const matchesSearch =
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.id.toLowerCase().includes(search.toLowerCase()) ||
            b.route.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === "All" || b.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">{bookingsData.length} total bookings</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm self-start">
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or route..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="pl-9 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                    >
                        <option>All</option>
                        <option>Confirmed</option>
                        <option>Pending</option>
                        <option>Cancelled</option>
                        <option>Refunded</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Passenger</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bus / Seat</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-semibold text-indigo-600">{b.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{b.name}</p>
                                        <p className="text-xs text-gray-400">{b.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{b.route}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-700">{b.bus}</p>
                                        <p className="text-xs text-gray-400">Seat {b.seat}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-700">{b.date}</p>
                                        <p className="text-xs text-gray-400">{b.time}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge[b.status] || ""}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{b.payment}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-900">{b.amount}</td>
                                    <td className="px-6 py-4">
                                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors">
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-400">No bookings found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filtered.map((b) => (
                        <div key={b.id} className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-mono font-semibold text-indigo-600 text-sm">{b.id}</span>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge[b.status] || ""}`}>
                                    {b.status}
                                </span>
                            </div>
                            <p className="font-medium text-gray-900">{b.name}</p>
                            <p className="text-sm text-gray-500">{b.route} — {b.bus} (Seat {b.seat})</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">{b.date}, {b.time}</span>
                                <span className="font-semibold text-gray-900">{b.amount}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing 1-{filtered.length} of {filtered.length}</span>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40" disabled>
                            <ChevronLeft size={16} />
                        </button>
                        <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm font-medium">1</button>
                        <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40" disabled>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
