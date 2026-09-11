import { prisma } from "@/lib/db";
import Link from "next/link";
import SeatLayout from "@/components/SeatLayout";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PageProps {
    params: Promise<{
        busId: string;
    }>;
    searchParams: Promise<{
        scheduleId?: string;
    }>;
}

const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
};

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

export default async function BookingPage(props: PageProps) {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
    const { busId } = params;
    const { scheduleId } = searchParams;

    if (!scheduleId) {
        return (
            <div className="min-h-screen bg-[#C9CBA3] py-12 px-4 flex items-center justify-center">
                <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">No Schedule Selected</h1>
                    <p className="text-gray-500 mb-6">Please return to the timetable and select a specific trip.</p>
                    <Link
                        href="/timetable"
                        className="inline-flex items-center justify-center px-6 py-2.5 bg-[#172144] hover:bg-[#101730] text-white font-bold rounded-xl text-sm transition-all"
                    >
                        Back to Schedules
                    </Link>
                </div>
            </div>
        );
    }

    const [bus, schedule] = await Promise.all([
        prisma.bus.findUnique({ where: { id: busId } }),
        prisma.schedule.findUnique({
            where: { id: scheduleId },
            include: {
                tickets: true,
                route: { include: { fares: true } },
            },
        }),
    ]);

    if (!bus || !schedule) {
        return (
            <div className="min-h-screen bg-[#C9CBA3] flex justify-center items-center">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-red-100">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Trip Not Found</h1>
                    <p className="text-gray-500 mb-6">The requested coach or schedule could not be found.</p>
                    <Link
                        href="/timetable"
                        className="inline-flex items-center justify-center px-6 py-2.5 bg-[#172144] hover:bg-[#101730] text-white font-bold rounded-xl text-sm transition-all"
                    >
                        Back to Schedules
                    </Link>
                </div>
            </div>
        );
    }

    const applicableFare = schedule.route?.fares?.find((f) => f.tier === bus.tier);
    const farePrice = applicableFare?.price || 0;

    const bookedSeatNumbers = new Set(schedule.tickets.map((t) => t.seatNumber));

    const travelDateISO = new Date(schedule.departureTime).toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-[#C9CBA3] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Trip Route & Overview Banner */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-sm border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link
                                href={`/timetable?from=${encodeURIComponent(schedule.origin)}&to=${encodeURIComponent(schedule.destination)}&date=${encodeURIComponent(travelDateISO)}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg shadow-2xs transition-all active:scale-95"
                            >
                                <ArrowLeft size={14} className="text-slate-500" />
                                <span>Change Schedule</span>
                            </Link>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 sm:gap-3.5 flex-wrap">
                            <span className="text-emerald-800">{schedule.origin}</span>
                            
                            {/* Modern Transit Route Arrow Indicator */}
                            <div className="flex items-center gap-1.5 px-0.5">
                                <div className="w-6 sm:w-10 h-[2.5px] bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full" />
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 shadow-sm flex items-center justify-center shrink-0">
                                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FCA311]" />
                                </div>
                                <div className="w-6 sm:w-10 h-[2.5px] bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                            </div>

                            <span className="text-amber-800">{schedule.destination}</span>
                        </h1>

                        <p className="text-slate-600 text-sm mt-1">
                            {formatDate(schedule.departureTime)} • Departure at <strong className="text-slate-900">{formatTime(schedule.departureTime)}</strong> (Estimated Arrival: {formatTime(schedule.arrivalTime)})
                        </p>
                    </div>

                    {/* Coach & Fare Overview Ticket Stub with Scalloped / Serrated Real Ticket Edges */}
                    <div className="relative flex items-stretch shadow-md rounded-lg overflow-visible">
                        {/* Left Serrated / Scalloped Ticket Edge */}
                        <div 
                            className="w-3 shrink-0 rounded-l-md"
                            style={{
                                background: `
                                    radial-gradient(circle at 0px 8px, transparent 4px, #f8fafc 4.5px),
                                    radial-gradient(circle at 0px 20px, transparent 4px, #f8fafc 4.5px),
                                    radial-gradient(circle at 0px 32px, transparent 4px, #f8fafc 4.5px),
                                    radial-gradient(circle at 0px 44px, transparent 4px, #f8fafc 4.5px),
                                    radial-gradient(circle at 0px 56px, transparent 4px, #f8fafc 4.5px)
                                `,
                                backgroundSize: '100% 100%',
                                borderTop: '1px solid #cbd5e1',
                                borderBottom: '1px solid #cbd5e1',
                            }}
                        />

                        {/* Main Ticket Body */}
                        <div className="flex items-center gap-4 bg-slate-50 py-3.5 px-4 border-t border-b border-slate-300">
                            {/* Fare per Seat */}
                            <div className="text-right">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                                    Fare per seat
                                </span>
                                <p className="text-2xl font-black text-rose-600 leading-tight">
                                    ৳{farePrice.toLocaleString()}
                                </p>
                            </div>

                            {/* Scissor Perforated Tear Line */}
                            <div className="h-10 border-l-2 border-dashed border-slate-300 relative mx-0.5" />

                            {/* Coach Info */}
                            <div>
                                <p className="text-xs font-black text-slate-800 tracking-tight">{bus.modelName}</p>
                                <p className="text-[11px] font-mono font-medium text-slate-500 mt-0.5">
                                    Coach: {bus.registrationNumber}
                                </p>
                            </div>
                        </div>

                        {/* Right Serrated / Scalloped Ticket Edge */}
                        <div 
                            className="w-3 shrink-0 rounded-r-md"
                            style={{
                                background: `
                                    radial-gradient(circle at 12px 8px, transparent 4px, #f8fafc 4.5px),
                                    radial-gradient(circle at 12px 20px, transparent 4px, #f8fafc 4.5px),
                                    radial-gradient(circle at 12px 32px, transparent 4px, #f8fafc 4.5px),
                                    radial-gradient(circle at 12px 44px, transparent 4px, #f8fafc 4.5px),
                                    radial-gradient(circle at 12px 56px, transparent 4px, #f8fafc 4.5px)
                                `,
                                backgroundSize: '100% 100%',
                                borderTop: '1px solid #cbd5e1',
                                borderBottom: '1px solid #cbd5e1',
                            }}
                        />
                    </div>
                </div>

                {/* Dedicated Seat Selection UI */}
                <SeatLayout 
                    busId={bus.id} 
                    scheduleId={scheduleId} 
                    busModel={bus.modelName}
                    tier={bus.tier}
                    fare={farePrice}
                    bookedSeats={Array.from(bookedSeatNumbers)}
                />
            </div>
        </div>
    );
}