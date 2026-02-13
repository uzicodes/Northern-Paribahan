"use client";

import React, { useState } from "react";
import {
    Users,
    Search,
    Filter,
    Mail,
    Phone,
    Calendar,
    ShieldCheck,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const usersData = [
    { id: 1, name: "Rahim Uddin", email: "rahim@email.com", phone: "+880 1711-234567", joined: "Jan 15, 2026", bookings: 12, spent: "৳ 10,200", role: "User", status: "Active" },
    { id: 2, name: "Fatima Akter", email: "fatima@email.com", phone: "+880 1812-345678", joined: "Jan 20, 2026", bookings: 8, spent: "৳ 7,200", role: "User", status: "Active" },
    { id: 3, name: "Kamal Hossain", email: "kamal@email.com", phone: "+880 1913-456789", joined: "Jan 25, 2026", bookings: 5, spent: "৳ 5,500", role: "User", status: "Active" },
    { id: 4, name: "Nusrat Jahan", email: "nusrat@email.com", phone: "+880 1614-567890", joined: "Feb 01, 2026", bookings: 3, spent: "৳ 2,250", role: "User", status: "Active" },
    { id: 5, name: "Arif Rahman", email: "arif@email.com", phone: "+880 1515-678901", joined: "Feb 05, 2026", bookings: 6, spent: "৳ 5,100", role: "User", status: "Blocked" },
    { id: 6, name: "Sumaiya Islam", email: "sumaiya@email.com", phone: "+880 1716-789012", joined: "Feb 08, 2026", bookings: 2, spent: "৳ 1,200", role: "User", status: "Active" },
    { id: 7, name: "Tanvir Ahmed", email: "tanvir@email.com", phone: "+880 1817-890123", joined: "Feb 10, 2026", bookings: 4, spent: "৳ 3,400", role: "User", status: "Active" },
    { id: 8, name: "Admin User", email: "admin@northernparibahan.com", phone: "+880 1700-000000", joined: "Dec 01, 2025", bookings: 0, spent: "৳ 0", role: "Admin", status: "Active" },
];

const statusBadge: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Blocked: "bg-red-50 text-red-700 border-red-200",
};

const roleBadge: Record<string, string> = {
    User: "bg-gray-100 text-gray-600",
    Admin: "bg-indigo-50 text-indigo-700",
};

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("All");

    const filtered = usersData.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === "All" || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
                    <p className="text-sm text-gray-500 mt-1">{usersData.length} registered users</p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="pl-9 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                    >
                        <option>All</option>
                        <option>User</option>
                        <option>Admin</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bookings</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                                                {u.name.split(" ").map((n) => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{u.name}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <Phone size={13} className="text-gray-400" />
                                            <span className="text-sm">{u.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <Calendar size={13} className="text-gray-400" />
                                            <span className="text-sm">{u.joined}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 font-medium">{u.bookings}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">{u.spent}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[u.role] || ""}`}>
                                            {u.role === "Admin" && <ShieldCheck size={12} />}
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge[u.status] || ""}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filtered.map((u) => (
                        <div key={u.id} className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                        {u.name.split(" ").map((n) => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{u.name}</p>
                                        <p className="text-xs text-gray-400">{u.email}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge[u.status] || ""}`}>
                                    {u.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">{u.bookings} bookings — {u.spent}</span>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[u.role] || ""}`}>
                                    {u.role === "Admin" && <ShieldCheck size={12} />}
                                    {u.role}
                                </span>
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
