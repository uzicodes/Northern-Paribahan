import prisma from "@/lib/prisma";
import TimetableClient from "./TimetableClient";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic"; // Ensures fresh data for timetables

type ScheduleWithBusAndTickets = Prisma.ScheduleGetPayload<{
    include: {
        bus: {
            select: {
                type: true;
                capacity: true;
            };
        };
        tickets: {
            select: { id: true };
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

export default async function TimetablePage() {
    // 1. Fetch data directly from Prisma
    const rawSchedules: ScheduleWithBusAndTickets[] = await prisma.schedule.findMany({
        where: {
            departureTime: {
                gte: new Date(), // Only show future schedules
            },
        },
        include: {
            bus: {
                select: {
                    type: true,
                    capacity: true,
                },
            },
            tickets: {
                select: { id: true },
            },
        },
        orderBy: {
            departureTime: 'asc',
        },
    });

    // 2. Transform the database records into the format the UI needs
    const formattedSchedules: FormattedSchedule[] = rawSchedules.map((schedule: ScheduleWithBusAndTickets) => {
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

        // Calculate available seats
        const availableSeats = schedule.bus.capacity - schedule.tickets.length;

        // Format times (e.g., "6:00 AM")
        const timeFormatter = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

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
    const uniqueRoutes: string[] = Array.from(
        new Set(formattedSchedules.map((s: FormattedSchedule) => `${s.from} → ${s.to}`))
    );

    return <TimetableClient schedules={formattedSchedules} routes={uniqueRoutes} />;
}