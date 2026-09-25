import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// ─── Dashboard Queries ───────────────────────────────────────

export const getDashboardStats = unstable_cache(
    async () => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const [revenueAgg, todayBookings, activeBuses, totalUsers] = await Promise.all([
            prisma.booking.aggregate({ _sum: { totalFare: true }, where: { status: "CONFIRMED" } }),
            prisma.booking.count({ where: { createdAt: { gte: startOfToday } } }),
            prisma.bus.count(),
            prisma.user.count({ where: { role: "USER" } }),
        ]);

        return {
            totalRevenue: revenueAgg._sum.totalFare ?? 0,
            todayBookings,
            activeBuses,
            totalUsers,
        };
    },
    ["admin-dashboard-stats"],
    { revalidate: 30, tags: ["admin-dashboard"] }
);

export const getTodaySchedules = unstable_cache(
    async () => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        return prisma.schedule.findMany({
            where: { departureTime: { gte: startOfToday, lte: endOfToday } },
            include: {
                bus: { select: { capacity: true, tier: true, registrationNumber: true, modelName: true } },
                _count: { select: { tickets: true } },
            },
            orderBy: { departureTime: "asc" },
        });
    },
    ["admin-today-schedules"],
    { revalidate: 30, tags: ["admin-dashboard"] }
);

// ─── Buses Queries ───────────────────────────────────────────

export const getAllBuses = unstable_cache(
    async () => {
        const buses = await prisma.bus.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                depot: { select: { name: true, city: true } },
                _count: { select: { schedules: true } },
            },
        });

        return buses.map((bus) => ({
            ...bus,
            depot: { name: bus.depot.name, location: bus.depot.city, city: bus.depot.city },
        }));
    },
    ["admin-all-buses"],
    { revalidate: 30, tags: ["admin-buses"] }
);

// ─── Routes Queries ──────────────────────────────────────────

export const getAllRoutes = unstable_cache(
    async () => {
        const routes = await prisma.route.findMany({
            orderBy: { origin: "asc" },
            include: {
                fares: { select: { price: true } },
                _count: { select: { schedules: true } },
            },
        });

        return routes.map((r) => ({
            ...r,
            fares: r.fares.map((f) => ({ amount: f.price, price: f.price })),
        }));
    },
    ["admin-all-routes"],
    { revalidate: 30, tags: ["admin-routes"] }
);

// ─── Users Queries ───────────────────────────────────────────

export const getAllUsers = unstable_cache(
    async () => {
        return prisma.user.findMany({
            include: { _count: { select: { bookings: true } } },
            orderBy: { email: "asc" },
        });
    },
    ["admin-all-users"],
    { revalidate: 30, tags: ["admin-users"] }
);

// ─── Bookings Queries ────────────────────────────────────────

export const getAllBookings = unstable_cache(
    async (userId?: string) => {
        const whereClause: Record<string, unknown> = {};
        if (userId) whereClause.userId = userId;

        return prisma.booking.findMany({
            where: whereClause,
            include: {
                user: { select: { id: true, name: true, email: true, phoneNumber: true } },
                tickets: { select: { seatNumber: true }, orderBy: { seatNumber: "asc" } },
                schedule: {
                    include: {
                        bus: { select: { modelName: true, registrationNumber: true, tier: true } },
                        route: { select: { origin: true, destination: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    },
    ["admin-all-bookings"],
    { revalidate: 30, tags: ["admin-bookings"] }
);

export const getUserById = unstable_cache(
    async (userId: string) => {
        return prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true },
        });
    },
    ["admin-user-by-id"],
    { revalidate: 60, tags: ["admin-users"] }
);
