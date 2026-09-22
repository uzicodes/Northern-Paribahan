import { Suspense } from "react";
import GlobalLoader from "@/components/GlobalLoader";
import TimetableClient from "./TimetableClient";
import { getSchedules } from "@/actions/getSchedules";
import { getCurrentBSTDate } from "@/lib/dateUtils";

export const dynamic = "force-dynamic";

export default async function TimetablePage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const origin = (typeof resolvedParams.from === "string" ? resolvedParams.from : undefined) 
        || (typeof resolvedParams.origin === "string" ? resolvedParams.origin : undefined);
    const destination = (typeof resolvedParams.to === "string" ? resolvedParams.to : undefined) 
        || (typeof resolvedParams.destination === "string" ? resolvedParams.destination : undefined);
    const date = typeof resolvedParams.date === "string" ? resolvedParams.date : undefined;

    let initialSchedules: any[] = [];
    
    if (origin && destination && date) {
        try {
            initialSchedules = await getSchedules({
                origin,
                destination,
                travelDate: date || getCurrentBSTDate()
            });
        } catch (error) {
            console.error("Failed to fetch schedules directly on server", error);
        }
    }

    return (
        <Suspense fallback={
            <div 
                className="flex justify-center items-center min-h-[calc(100vh-140px)]"
                style={{ backgroundColor: "#C9CBA3" }}
            >
                <GlobalLoader />
            </div>
        }>
            <TimetableClient 
                initialOrigin={origin || ""}
                initialDestination={destination || ""}
                initialDate={date || ""}
                initialSchedules={initialSchedules}
            />
        </Suspense>
    );
}