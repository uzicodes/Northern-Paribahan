import React from "react";
import { prisma } from "@/lib/prisma";
import AdminRoutesClient from "./AdminRoutesClient";

export const dynamic = "force-dynamic";

export default async function AdminRoutesPage() {
    const routes = await prisma.route.findMany({
        orderBy: { origin: "asc" },
        include: {
            fares: {
                select: {
                    price: true,
                },
            },
            _count: {
                select: {
                    schedules: true,
                },
            },
        },
    });

    const formattedRoutes = routes.map((r) => ({
        ...r,
        fares: r.fares.map((f) => ({
            amount: f.price,
            price: f.price,
        })),
    }));

    return <AdminRoutesClient initialRoutes={formattedRoutes} />;
}
