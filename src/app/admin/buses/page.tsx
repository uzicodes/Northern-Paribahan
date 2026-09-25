import React from "react";
import { getAllBuses } from "@/lib/admin-queries";
import AdminBusesClient from "./AdminBusesClient";

export const revalidate = 30;

export default async function AdminBusesPage() {
    const formattedBuses = await getAllBuses();
    return <AdminBusesClient initialBuses={formattedBuses} />;
}
