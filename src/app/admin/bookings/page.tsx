import React from "react";
import Link from "next/link";
import {
    Ticket,
    Search,
    Filter,
    Eye,
    ChevronLeft,
    ChevronRight,
    X,
    User,
    Calendar,
    Clock,
    Bus,
    Armchair,
} from "lucide-react";
import { prisma } from "@/lib/db";

const bstDateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    month: "short",
    day: "numeric",
    year: "numeric",
});

const bstTimeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
});

const statusBadge: Record<string, string> = {
    CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

interface AdminBookingsPageProps {
    searchParams: Promise<{
        userId?: string;
        q?: string;
        status?: string;
    }>;
}

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
    const params = await searchParams;
    const userId = params.userId?.trim();
    const searchQuery = params.q?.trim() || "";
    const filterStatus = params.status?.trim() || "All";

    // 1. If userId is present, optionally retrieve target user details for the active filter banner
    let targetUser = null;
    if (userId) {
        targetUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true },
        });
    }

    // 2. Query bookings from Prisma with optional userId filter
    const whereClause: any = {};
    if (userId) {
        whereClause.userId = userId;
    }

    const bookings = await prisma.booking.findMany({
        where: whereClause,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                },
            },
            tickets: {
                select: {
                    seatNumber: true,
                },
                orderBy: {
                    seatNumber: "asc",
                },
            },
            schedule: {
                include: {
                    bus: {
                        select: {
                            modelName: true,
                            registrationNumber: true,
                            tier: true,
                        },
                    },
                    route: {
                        select: {
                            origin: true,
                            destination: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // 3. Apply search query and status filter
    const filtered = bookings.filter((b) => {
        const passengerName = b.user?.name || "Valued Passenger";
        const passengerEmail = b.user?.email || "";
        const bookingId = b.id;
        const txnId = b.transactionId || "";
        const origin = b.schedule?.origin || b.schedule?.route?.origin || "";
        const destination = b.schedule?.destination || b.schedule?.route?.destination || "";
        const routeStr = `${origin} -> ${destination} ${origin} → ${destination}`;

        const matchesSearch =
            searchQuery === "" ||
            passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            passengerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            routeStr.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            filterStatus === "All" ||
            b.status.toUpperCase() === filterStatus.toUpperCase();

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {userId ? (
                            <span>
                                Filtered bookings for user: <strong>{targetUser?.name || targetUser?.email || userId}</strong> ({bookings.length} total)
                            </span>
                        ) : (
                            <span>{bookings.length} total bookings across all routes</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Active Filter Banner (When userId query parameter is present) */}
            {userId && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-indigo-50/90 border border-indigo-200 rounded-xl text-indigo-900 shadow-2xs">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                            <Filter size={16} />
                        </div>
                        <div>
                            <p className="font-semibold text-indigo-950">
                                Showing bookings for user:{" "}
                                <span className="font-bold underline decoration-indigo-300">
                                    {targetUser ? `${targetUser.name || "User"} (${targetUser.email})` : userId}
                                </span>
                            </p>
                            <p className="text-xs text-indigo-600">
                                {filtered.length} {filtered.length === 1 ? "booking" : "bookings"} displayed
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/bookings"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-100/60 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors shadow-2xs cursor-pointer"
                    >
                        <X size={14} />
                        <span>Clear Filter</span>
                    </Link>
                </div>
            )}

            {/* Search & Filter Bar */}
            <form method="GET" className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
                {userId && <input type="hidden" name="userId" value={userId} />}
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        name="q"
                        defaultValue={searchQuery}
                        placeholder="Search by passenger, booking ID, or route..."
                        aria-label="Search bookings by name, ID, or route"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        name="status"
                        defaultValue={filterStatus}
                        aria-label="Filter bookings by status"
                        className="pl-9 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PENDING">Pending</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                    Filter
                </button>
            </form>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking Ref</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Passenger</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Coach / Seats</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Departure Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                <th className="px-6 py-3 text-right"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((b) => {
                                const origin = b.schedule?.origin || b.schedule?.route?.origin || "Origin";
                                const destination = b.schedule?.destination || b.schedule?.route?.destination || "Destination";

                                return (
                                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-indigo-600 text-xs">
                                                #{b.id.slice(-8).toUpperCase()}
                                            </span>
                                            {b.transactionId && (
                                                <span className="block font-mono text-[10px] text-gray-400 truncate max-w-[120px]" title={b.transactionId}>
                                                    {b.transactionId}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{b.user?.name || "Valued Passenger"}</p>
                                            <p className="text-xs text-gray-400">{b.user?.email || "—"}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900 font-medium">
                                                {origin} → {destination}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900 text-xs font-medium">
                                                {b.schedule?.bus?.modelName || b.schedule?.busName || "Coach"}
                                            </p>
                                            <div className="flex items-center gap-1 flex-wrap mt-0.5">
                                                {b.tickets.length > 0 ? (
                                                    b.tickets.map((t) => (
                                                        <span
                                                            key={t.seatNumber}
                                                            className="text-[10px] font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200"
                                                        >
                                                            {t.seatNumber}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400">Assigned at counter</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900 text-xs font-medium">
                                                {b.schedule?.departureTime
                                                    ? bstDateFormatter.format(new Date(b.schedule.departureTime))
                                                    : "—"}
                                            </p>
                                            <p className="text-[11px] text-gray-400">
                                                {b.schedule?.departureTime
                                                    ? bstTimeFormatter.format(new Date(b.schedule.departureTime))
                                                    : "—"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                    statusBadge[b.status.toUpperCase()] || "bg-gray-100 text-gray-700 border-gray-200"
                                                }`}
                                            >
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                                            ৳ {b.totalFare.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/verify-ticket?pnr=${encodeURIComponent(b.id)}`}
                                                aria-label={`Inspect ticket ${b.id}`}
                                                className="inline-flex items-center gap-1 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
                                                title="View Ticket Details"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                        No bookings found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filtered.map((b) => {
                        const origin = b.schedule?.origin || b.schedule?.route?.origin || "Origin";
                        const destination = b.schedule?.destination || b.schedule?.route?.destination || "Destination";

                        return (
                            <div key={b.id} className="p-4 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono font-bold text-indigo-600 text-xs">
                                        #{b.id.slice(-8).toUpperCase()}
                                    </span>
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                                            statusBadge[b.status.toUpperCase()] || "bg-gray-100 text-gray-700 border-gray-200"
                                        }`}
                                    >
                                        {b.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{b.user?.name || "Valued Passenger"}</p>
                                    <p className="text-xs text-gray-500">{b.user?.email || "—"}</p>
                                </div>
                                <div className="text-xs text-gray-600">
                                    <p className="font-medium">{origin} → {destination}</p>
                                    <p className="text-gray-400 text-[11px] mt-0.5">
                                        {b.schedule?.departureTime ? bstDateFormatter.format(new Date(b.schedule.departureTime)) : "—"} (
                                        Seats: {b.tickets.map((t) => t.seatNumber).join(", ") || "None"}
                                        )
                                    </p>
                                </div>
                                <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-50">
                                    <span className="font-bold text-gray-900 text-sm">৳ {b.totalFare.toLocaleString()}</span>
                                    <Link
                                        href={`/verify-ticket?pnr=${encodeURIComponent(b.id)}`}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                    >
                                        <Eye size={13} />
                                        <span>View Ticket</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="px-6 py-12 text-center text-gray-400">
                            No bookings found matching your criteria.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing 1-{filtered.length} of {filtered.length}</span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="Previous page"
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
                            disabled
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            type="button"
                            aria-label="Page 1"
                            className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm font-medium"
                        >
                            1
                        </button>
                        <button
                            type="button"
                            aria-label="Next page"
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
                            disabled
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
