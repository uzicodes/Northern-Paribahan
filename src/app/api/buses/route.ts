import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const buses = await prisma.bus.findMany({
            include: {
                seats: true,
            },
        });
        return NextResponse.json(buses);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch buses" }, { status: 500 });
    }
}
