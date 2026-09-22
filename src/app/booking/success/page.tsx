import React, { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import GlobalLoader from '@/components/GlobalLoader';
import {
    CheckCircle2,
    AlertTriangle,
    Bus,
    Calendar,
    Clock,
    User,
    CreditCard,
    ArrowRight,
    MapPin,
    ShieldCheck,
    Armchair,
    FileText,
} from 'lucide-react';
import SuccessActions from './SuccessActions';

interface PageProps {
    searchParams: Promise<{
        tran_id?: string;
    }>;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});

const formatDate = (dateInput: Date | string) => {
    try {
        const d = new Date(dateInput);
        return dateFormatter.format(d);
    } catch {
        return String(dateInput);
    }
};

const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
});

const formatTime = (dateInput: Date | string) => {
    try {
        const d = new Date(dateInput);
        return timeFormatter.format(d);
    } catch {
        return String(dateInput);
    }
};

// Asynchronous component responsible for Prisma queries & Ticket layout
async function TicketData({ tran_id }: { tran_id?: string }) {
    // 1. Fallback: No transaction ID provided
    if (!tran_id) {
        return (
            <div className="py-16 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-57px)]">
                <div className="bg-white max-w-md w-full p-8 sm:p-10 rounded-3xl shadow-lg border border-white/70 text-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Invalid Tracking Link
                        </h1>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            No transaction reference was found in your link. If you recently completed a payment, please verify your booking confirmation email or check your profile.
                        </p>
                    </div>
                    <div className="pt-2">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 bg-[#172144] hover:bg-[#202e5e] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Query booking details from Prisma
    const booking = await prisma.booking.findFirst({
        where: {
            OR: [
                { transactionId: tran_id },
                { id: tran_id },
            ],
        },
        include: {
            user: true,
            tickets: {
                orderBy: {
                    seatNumber: 'asc',
                },
            },
            schedule: {
                include: {
                    bus: true,
                    route: true,
                },
            },
        },
    });

    // 3. Fallback: Booking record not found for transaction ID
    if (!booking) {
        return (
            <div className="py-16 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-57px)]">
                <div className="bg-white max-w-md w-full p-8 sm:p-10 rounded-3xl shadow-lg border border-white/70 text-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                        <FileText className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Booking Not Found
                        </h1>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            We couldn&apos;t find an active reservation associated with transaction ID:
                        </p>
                        <p className="font-mono text-xs font-bold text-slate-800 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200 inline-block break-all">
                            {tran_id}
                        </p>
                    </div>
                    <p className="text-xs text-slate-400">
                        If your payment was deducted, please contact Northern Paribahan 24/7 helpline with your transaction ID.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 bg-[#172144] hover:bg-[#202e5e] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isConfirmed = booking.status === 'CONFIRMED' || (booking.status as string) === 'PAID';
    const passengerName = booking.user?.name || 'Passenger';
    const passengerPhone = booking.user?.phoneNumber;
    const seatList = booking.tickets.map((t) => t.seatNumber);
    const busModel = booking.schedule?.bus?.modelName || booking.schedule?.busName || 'Luxury Coach';
    const regNumber = booking.schedule?.bus?.registrationNumber || booking.schedule?.registrationNumber;
    const tier = booking.schedule?.bus?.tier || 'BUSINESS';
    const origin = booking.schedule?.origin || 'Origin';
    const destination = booking.schedule?.destination || 'Destination';
    const departureTime = booking.schedule?.departureTime;
    const arrivalTime = booking.schedule?.arrivalTime;

    return (
        <div className="py-6 sm:py-8 px-4 sm:px-6">
            <div className="max-w-xl mx-auto space-y-4">

                {/* 1. Header Confirmation Banner */}
                <div className="text-center space-y-2 print:hidden">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 border-2 border-white shadow-xs text-emerald-600 animate-in zoom-in-75 duration-300">
                        <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-[#172144] tracking-tight">
                            Payment Successful
                        </h1>
                        <p className="text-xs sm:text-sm font-semibold text-emerald-900 mt-0.5">
                            Your seats are confirmed!
                        </p>
                    </div>
                </div>

                {/* Warning banner if status is still pending verification */}
                {!isConfirmed && (
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-left space-y-0.5">
                            <p className="text-xs font-bold text-amber-900">
                                Payment Verification in Progress
                            </p>
                            <p className="text-[11px] text-amber-700">
                                Your payment is being verified, please check your email shortly.
                            </p>
                        </div>
                    </div>
                )}

                {/* 2. Authentic Tear-off Ticket Card */}
                <div className="relative bg-white rounded-2xl shadow-lg border border-white/70 overflow-hidden print:shadow-none print:border-slate-300">
                    
                    {/* Ticket Header Brand Bar */}
                    <div className="bg-[#172144] text-white px-5 py-3 sm:py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#FCA311] text-[#172144] flex items-center justify-center font-black shrink-0">
                                <Bus size={17} />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base font-black tracking-wide leading-tight text-white">
                                    NORTHERN PARIBAHAN
                                </h2>
                                <p className="text-[9px] text-[#FCA311] font-bold tracking-wider uppercase">
                                    Official Boarding Pass
                                </p>
                            </div>
                        </div>

                        <span className={`text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-full border ${
                            isConfirmed
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                        }`}>
                            {isConfirmed ? 'Confirmed' : 'Pending'}
                        </span>
                    </div>

                    {/* Top Section: Passenger Name, Reference Info, Total Paid */}
                    <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#FAFCFB] space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            {/* Passenger Info */}
                            <div className="space-y-0.5 flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <User size={12} className="text-[#172144]" />
                                    <span>Passenger Name</span>
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-slate-900 break-words leading-snug">
                                    {passengerName}
                                </p>
                                {passengerPhone && (
                                    <p className="text-[11px] text-slate-600 font-medium">
                                        Phone: <span className="font-mono font-semibold">{passengerPhone}</span>
                                    </p>
                                )}
                            </div>

                            {/* Total Fare Paid */}
                            <div className="sm:text-right shrink-0 bg-white sm:bg-transparent p-2.5 sm:p-0 rounded-lg border sm:border-0 border-slate-100">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Total Fare Paid
                                </p>
                                <p className="text-xl sm:text-2xl font-black text-rose-600">
                                    ৳ {booking.totalFare.toLocaleString()}
                                </p>
                                <p className="text-[10px] text-emerald-700 font-bold flex sm:justify-end items-center gap-1">
                                    <ShieldCheck size={12} className="text-emerald-600" />
                                    <span>100% Guaranteed Seat</span>
                                </p>
                            </div>
                        </div>

                        {/* Reference badges bar */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
                            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">PNR:</span>
                                <span className="font-mono font-black text-slate-900 text-xs">#{booking.id.toUpperCase()}</span>
                            </div>
                            {(booking.transactionId || tran_id) && (
                                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Txn ID:</span>
                                    <span className="font-mono font-bold text-slate-800 text-xs break-all">{booking.transactionId || tran_id}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Section: Route, Date, Time & Bus Model */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                        {/* Origin -> Destination Route Showcase */}
                        <div className="bg-[#EDF5F0] rounded-xl p-3.5 sm:p-4 border border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                                <p className="text-[9px] font-bold text-red-600 uppercase tracking-wider">Departure</p>
                                <p className="text-base sm:text-lg font-black text-slate-900">{origin}</p>
                                <p className="text-[11px] text-slate-500 font-medium">Northern Counter</p>
                            </div>

                            <div className="flex flex-col items-center justify-center px-1 w-full sm:w-auto">
                                <div className="flex items-center gap-1.5 text-[#172144] font-extrabold text-xs">
                                    <div className="h-0.5 w-8 sm:w-12 bg-[#172144]/30"></div>
                                    <ArrowRight size={15} className="text-[#FCA311]" />
                                    <div className="h-0.5 w-8 sm:w-12 bg-[#172144]/30"></div>
                                </div>
                                <span className="text-[9px] font-bold text-slate-600 mt-0.5">Direct Express</span>
                            </div>

                            <div className="sm:text-right">
                                <p className="text-[9px] font-bold text-green-600 uppercase tracking-wider">Destination</p>
                                <p className="text-base sm:text-lg font-black text-slate-900">{destination}</p>
                                <p className="text-[11px] text-slate-500 font-medium">Terminal Drop</p>
                            </div>
                        </div>

                        {/* Trip Timing Grid: 3 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
                            <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg border border-slate-200/80 space-y-0.5">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <Calendar size={11} className="text-[#FCA311]" />
                                    <span>Travel Date</span>
                                </p>
                                <p className="text-xs sm:text-sm font-black text-slate-900">
                                    {departureTime ? formatDate(departureTime) : 'Today'}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg border border-slate-200/80 space-y-0.5">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <Clock size={11} className="text-[#FCA311]" />
                                    <span>Departure</span>
                                </p>
                                <p className="text-xs sm:text-sm font-black text-slate-900">
                                    {departureTime ? formatTime(departureTime) : '08:00 AM'}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg border border-slate-200/80 space-y-0.5">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <Clock size={11} className="text-slate-400" />
                                    <span>Est. Arrival</span>
                                </p>
                                <p className="text-xs sm:text-sm font-black text-slate-900">
                                    {arrivalTime ? formatTime(arrivalTime) : '02:00 PM'}
                                </p>
                            </div>
                        </div>

                        {/* Dedicated Full-Width Coach & Bus Details Banner */}
                        <div className="bg-slate-50 p-3 sm:p-3.5 rounded-lg border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[#172144] flex items-center justify-center shrink-0 shadow-2xs">
                                    <Bus size={17} className="text-[#FCA311]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Coach Assignment & Model</p>
                                    <p className="text-xs sm:text-sm font-black text-slate-900 break-words leading-snug">
                                        {busModel}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto shrink-0">
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[11px] border border-amber-300">
                                    {tier} CLASS
                                </span>
                                {regNumber && (
                                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                                        {regNumber}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tear-off Ticket Dashed Divider with Notches */}
                    <div className="relative w-full py-0.5">
                        <div className="border-b-2 border-dashed border-slate-300 mx-4 sm:mx-5"></div>
                        {/* Left Cutout Circle */}
                        <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#C9CBA3] shadow-inner"></div>
                        {/* Right Cutout Circle */}
                        <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#C9CBA3] shadow-inner"></div>
                    </div>

                    {/* Bottom Section: Highlight Exact Seat Numbers */}
                    <div className="p-4 sm:p-5 bg-[#FAFCFB] flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-center sm:text-left space-y-0.5">
                            <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                                <Armchair size={13} className="text-[#172144]" />
                                <span>Confirmed Seat Numbers</span>
                            </p>
                            <p className="text-[10px] text-slate-500">
                                Reserved exclusively under booking ref <span className="font-mono font-bold text-slate-700">{booking.id.slice(0, 8).toUpperCase()}</span>
                            </p>
                        </div>

                        {/* Highlighted Seat Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                            {seatList.length > 0 ? (
                                seatList.map((seat) => (
                                    <div
                                        key={seat}
                                        className="px-3 py-1.5 bg-[#172144] text-[#FCA311] rounded-xl font-black text-base sm:text-lg shadow-sm tracking-tight min-w-[46px] text-center border border-[#233163]"
                                    >
                                        {seat}
                                    </div>
                                ))
                            ) : (
                                <span className="text-xs font-bold text-slate-600">
                                    Seats Assigned at Counter
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Ticket Footer Security Badge */}
                    <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-center">
                        <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
                            <ShieldCheck size={12} className="text-emerald-700" />
                            <span>Present this digital pass or SMS confirmation when boarding the coach.</span>
                        </p>
                    </div>

                </div>

                {/* 3. Action Buttons */}
                <SuccessActions bookingId={booking.id} tranId={booking.transactionId || undefined} />

            </div>
        </div>
    );
}

// Main server component wrapper with Suspense & GlobalLoader
export default async function BookingSuccessPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const tran_id = searchParams.tran_id?.trim();

    return (
        <div className="min-h-screen bg-[#C9CBA3]">
            <Suspense fallback={<GlobalLoader />}>
                <TicketData tran_id={tran_id} />
            </Suspense>
        </div>
    );
}
