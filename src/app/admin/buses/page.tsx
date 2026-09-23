import React from "react";
import { prisma } from "@/lib/prisma";
import AdminBusesClient from "./AdminBusesClient";

export const dynamic = "force-dynamic";

export default async function AdminBusesPage() {
    const buses = await prisma.bus.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            depot: {
                select: {
                    name: true,
                    city: true,
                },
            },
            _count: {
                select: {
                    schedules: true,
                },
            },
        },
    });

    const formattedBuses = buses.map((bus) => ({
        ...bus,
        depot: {
            name: bus.depot.name,
            location: bus.depot.city,
            city: bus.depot.city,
        },
    }));

    return <AdminBusesClient initialBuses={formattedBuses} />;
}
