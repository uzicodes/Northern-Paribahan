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
import { prisma } from "@/lib/db";

const roleBadge: Record<string, string> = {
    USER: "bg-gray-100 text-gray-600",
    ADMIN: "bg-indigo-50 text-indigo-700",
};

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; role?: string }>;
}) {
    const params = await searchParams;
    const searchQuery = params.q || "";
    const filterRole = params.role || "All";

    /* ── Fetch real users from database ── */
    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: { bookings: true },
            },
        },
        orderBy: { email: "asc" },
    });

    /* ── Client-side-style filtering done on server ── */
    const filtered = users.filter((u) => {
        const displayName = u.name || "Unknown";
        const matchesSearch =
            searchQuery === "" ||
            displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole =
            filterRole === "All" || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
                    <p className="text-sm text-gray-500 mt-1">{users.length} registered users</p>
                </div>
            </div>

            {/* Search & Filter */}
            <form className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        name="q"
                        placeholder="Search by name or email..."
                        defaultValue={searchQuery}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        name="role"
                        defaultValue={filterRole}
                        className="pl-9 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                    >
                        <option value="All">All</option>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                    Search
                </button>
            </form>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bookings</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((u) => {
                                const displayName = u.name || "Unknown";
                                const initials = displayName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("");

                                return (
                                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{displayName}</p>
                                                    <p className="text-xs text-gray-400">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <Phone size={13} className="text-gray-400" />
                                                <span className="text-sm">{u.phoneNumber || "—"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">{u._count.bookings}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[u.role] || ""}`}>
                                                {u.role === "ADMIN" && <ShieldCheck size={12} />}
                                                {u.role === "ADMIN" ? "Admin" : "User"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filtered.map((u) => {
                        const displayName = u.name || "Unknown";
                        const initials = displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("");

                        return (
                            <div key={u.id} className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                            {initials}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{displayName}</p>
                                            <p className="text-xs text-gray-400">{u.email}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[u.role] || ""}`}>
                                        {u.role === "ADMIN" && <ShieldCheck size={12} />}
                                        {u.role === "ADMIN" ? "Admin" : "User"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{u._count.bookings} bookings</span>
                                    <span className="text-gray-500">{u.phoneNumber || "—"}</span>
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="px-6 py-12 text-center text-gray-400">No users found.</div>
                    )}
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
