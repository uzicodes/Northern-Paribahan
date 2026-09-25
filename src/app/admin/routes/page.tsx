import React from "react";
import { getAllRoutes } from "@/lib/admin-queries";
import AdminRoutesClient from "./AdminRoutesClient";

export const revalidate = 30;

export default async function AdminRoutesPage() {
    const formattedRoutes = await getAllRoutes();
    return <AdminRoutesClient initialRoutes={formattedRoutes} />;
}
