import prisma from "@/lib/prisma";
import TimetableClient from "./TimetableClient";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic"; // Ensures fresh data for timetables

type ScheduleWithBusAndCount = Prisma.ScheduleGetPayload<{
    include: {
        bus: {
            select: {
                type: true;
                capacity: true;
            };
        };
        _count: {
            select: {
                tickets: true;
            };
        };
    };
}>;

type FormattedSchedule = {
    id: string;
    bus: string;
    code: string;
    from: string;
    to: string;
    departure: string;
    arrival: string;
    duration: string;
    type: string;
    fare: string;
    rawFare: number;
    seats: number;
    period: string;
    rawDeparture: string;
};

interface PageProps {
    searchParams: Promise<{
        date?: string;
        origin?: string;
        destination?: string;
        from?: string;
        to?: string;
    }>;
}

// Instantiate formatter once outside request loop
const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
});

export default async function TimetablePage(props: PageProps) {
    const searchParams = await props.searchParams;
    const dateParam = searchParams.date;
    const originParam = searchParams.origin || searchParams.from;
    const destinationParam = searchParams.destination || searchParams.to;

    // Construct Prisma where filter
    const whereClause: Prisma.ScheduleWhereInput = {};

    let resolvedDateParam = dateParam;

    if (dateParam) {
        // Full-day bounding box in local date
        // e.g. "2026-09-10" -> startOfDay: 2026-09-10T00:00:00.000, endOfDay: 2026-09-10T23:59:59.999
        const parts = dateParam.split('-').map(Number);
        if (parts.length === 3 && !parts.some(isNaN)) {
            const [year, month, day] = parts;
            const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
            const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
            whereClause.departureTime = {
                gte: startOfDay,
                lte: endOfDay,
            };
        } else {
            whereClause.departureTime = {
                gte: new Date(),
            };
        }
    } else {
        // High-performance default: Default to today's schedule (00:00 - 23:59)
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        whereClause.departureTime = {
            gte: startOfToday,
            lte: endOfToday,
        };
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        resolvedDateParam = `${year}-${month}-${day}`;
    }

    if (originParam) {
        whereClause.origin = {
            equals: originParam,
            mode: 'insensitive',
        };
    }

    if (destinationParam) {
        whereClause.destination = {
            equals: destinationParam,
            mode: 'insensitive',
        };
    }

    // 1. Fetch schedules and routes concurrently in parallel via Promise.all
    const [rawSchedules, allRoutes] = await Promise.all([
        prisma.schedule.findMany({
            where: whereClause,
            include: {
                bus: {
                    select: {
                        type: true,
                        capacity: true,
                    },
                },
                _count: {
                    select: {
                        tickets: true,
                    },
                },
            },
            orderBy: {
                departureTime: 'asc',
            },
        }),
        prisma.route.findMany({
            select: {
                origin: true,
                destination: true,
            },
            orderBy: [
                { origin: 'asc' },
                { destination: 'asc' },
            ],
        }),
    ]);

    // 2. Transform the database records into the format the UI needs
    const formattedSchedules: FormattedSchedule[] = rawSchedules.map((schedule: ScheduleWithBusAndCount) => {
        const depDate = new Date(schedule.departureTime);
        const arrDate = new Date(schedule.arrivalTime);
        
        // Calculate duration
        const diffMs = arrDate.getTime() - depDate.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        // Determine period (Morning, Afternoon, Evening, Night)
        const hour = depDate.getHours();
        let period = "night";
        if (hour >= 6 && hour < 12) period = "morning";
        else if (hour >= 12 && hour < 17) period = "afternoon";
        else if (hour >= 17 && hour < 20) period = "evening";

        // Calculate available seats using SQL count
        const availableSeats = schedule.bus.capacity - (schedule._count?.tickets ?? 0);

        return {
            id: schedule.id,
            bus: schedule.busName,
            code: schedule.registrationNumber,
            from: schedule.origin,
            to: schedule.destination,
            departure: timeFormatter.format(depDate),
            arrival: timeFormatter.format(arrDate),
            duration: `${diffHrs}h ${diffMins}m`,
            type: schedule.bus.type.replace('_', ' '), // e.g., NON_AC -> NON AC
            fare: `৳ ${schedule.fare.toLocaleString()}`,
            rawFare: schedule.fare,
            seats: availableSeats,
            period: period,
            rawDeparture: schedule.departureTime.toISOString(),
        };
    });

    // 3. Extract unique routes for the dropdown
    const uniqueRoutesSet = new Set<string>();
    for (const r of allRoutes) {
        uniqueRoutesSet.add(`${r.origin} → ${r.destination}`);
    }
    for (const s of formattedSchedules) {
        uniqueRoutesSet.add(`${s.from} → ${s.to}`);
    }
    const uniqueRoutes: string[] = Array.from(uniqueRoutesSet);

    const initialRoute = originParam && destinationParam ? `${originParam} → ${destinationParam}` : undefined;

    return (
        <TimetableClient
            schedules={formattedSchedules}
            routes={uniqueRoutes}
            initialRoute={initialRoute}
            initialDate={resolvedDateParam}
        />
    );
}