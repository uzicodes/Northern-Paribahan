import { Suspense } from "react";
import GlobalLoader from "@/components/GlobalLoader";
import TimetableClient from "./TimetableClient";
import { getSchedules } from "@/actions/getSchedules";
import { getCurrentBSTDate } from "@/lib/dateUtils";

export const dynamic = "force-dynamic";

export default async function TimetablePage({
    searchParams
}: {
    searchParams: { [key: string]: string | undefined }
}) {
    const origin = searchParams.from || searchParams.origin;
    const destination = searchParams.to || searchParams.destination;
    const date = searchParams.date;

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