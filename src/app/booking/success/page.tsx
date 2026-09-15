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

const formatDate = (dateInput: Date | string) => {
    try {
        const d = new Date(dateInput);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(d);
    } catch {
        return String(dateInput);
    }
};

const formatTime = (dateInput: Date | string) => {
    try {
        const d = new Date(dateInput);
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(d);
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
        <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* 1. Header Confirmation Banner */}
                <div className="text-center space-y-3 print:hidden">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 border-4 border-white shadow-md text-emerald-600 animate-in zoom-in-75 duration-300">
                        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-[#172144] tracking-tight">
                            Payment Successful
                        </h1>
                        <p className="text-sm sm:text-base font-semibold text-emerald-900 mt-1">
                            Your seats are confirmed!
                        </p>
                    </div>
                </div>

                {/* Warning banner if status is still pending verification */}
                {!isConfirmed && (
                    <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs animate-in fade-in duration-200">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-left space-y-0.5">
                            <p className="text-sm font-bold text-amber-900">
                                Payment Verification in Progress
                            </p>
                            <p className="text-xs sm:text-sm text-amber-700">
                                Your payment is being verified, please check your email shortly.
                            </p>
                        </div>
                    </div>
                )}

                {/* 2. Authentic Tear-off Ticket Card */}
                <div className="relative bg-white rounded-3xl shadow-xl border border-white/70 overflow-hidden print:shadow-none print:border-slate-300">
                    
                    {/* Ticket Header Brand Bar */}
                    <div className="bg-[#172144] text-white px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#FCA311] text-[#172144] flex items-center justify-center font-black">
                                <Bus size={20} />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-black tracking-wide leading-tight text-white">
                                    NORTHERN PARIBAHAN
                                </h2>
                                <p className="text-[10px] text-[#FCA311] font-bold tracking-wider uppercase">
                                    Official Boarding Pass
                                </p>
                            </div>
                        </div>

                        <span className={`text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full border ${
                            isConfirmed
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                        }`}>
                            {isConfirmed ? 'Confirmed' : 'Pending'}
                        </span>
                    </div>

                    {/* Top Section: Passenger Name, Transaction ID, Total Paid */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 bg-[#FAFCFB]">
                        <div>
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                Passenger Name
                            </p>
                            <p className="text-base font-extrabold text-slate-900 mt-1 truncate">
                                {passengerName}
                            </p>
                            {passengerPhone && (
                                <p className="text-xs text-slate-500 font-medium">{passengerPhone}</p>
                            )}
                        </div>

                        <div>
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                Transaction ID
                            </p>
                            <p className="font-mono text-xs font-bold text-slate-800 bg-slate-100 py-1 px-2.5 rounded-lg border border-slate-200 mt-1 inline-block truncate max-w-full">
                                {booking.transactionId || tran_id}
                            </p>
                        </div>

                        <div className="sm:text-right">
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                Total Fare Paid
                            </p>
                            <p className="text-xl font-black text-rose-600 mt-0.5">
                                ৳ {booking.totalFare.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-semibold flex sm:justify-end items-center gap-1 mt-0.5">
                                <ShieldCheck size={12} />
                                <span>100% Guaranteed Seat</span>
                            </p>
                        </div>
                    </div>

                    {/* Middle Section: Route, Date, Time & Bus Model */}
                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Origin -> Destination Route Showcase */}
                        <div className="bg-[#EDF5F0] rounded-2xl p-5 border border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Departure</p>
                                <p className="text-lg sm:text-xl font-black text-slate-900">{origin}</p>
                                <p className="text-xs text-slate-500 font-medium">Northern Counter</p>
                            </div>

                            <div className="flex flex-col items-center justify-center px-2 w-full sm:w-auto">
                                <div className="flex items-center gap-2 text-[#172144] font-extrabold text-xs">
                                    <div className="h-0.5 w-10 sm:w-16 bg-[#172144]/30"></div>
                                    <ArrowRight size={18} className="text-[#FCA311]" />
                                    <div className="h-0.5 w-10 sm:w-16 bg-[#172144]/30"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 mt-1">Direct Express</span>
                            </div>

                            <div className="sm:text-right">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Destination</p>
                                <p className="text-lg sm:text-xl font-black text-slate-900">{destination}</p>
                                <p className="text-xs text-slate-500 font-medium">Terminal Drop</p>
                            </div>
                        </div>

                        {/* Trip Timing & Bus Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                                    <Calendar size={11} className="text-[#FCA311]" />
                                    <span>Date</span>
                                </p>
                                <p className="text-xs sm:text-sm font-black text-slate-900">
                                    {departureTime ? formatDate(departureTime) : 'Today'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                                    <Clock size={11} className="text-[#FCA311]" />
                                    <span>Departure</span>
                                </p>
                                <p className="text-xs sm:text-sm font-black text-slate-900">
                                    {departureTime ? formatTime(departureTime) : '08:00 AM'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                                    <Clock size={11} className="text-slate-400" />
                                    <span>Arrival (Est.)</span>
                                </p>
                                <p className="text-xs sm:text-sm font-black text-slate-900">
                                    {arrivalTime ? formatTime(arrivalTime) : '02:00 PM'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                                    <Bus size={11} className="text-[#FCA311]" />
                                    <span>Coach</span>
                                </p>
                                <p className="text-xs sm:text-sm font-black text-slate-900 truncate" title={busModel}>
                                    {busModel}
                                </p>
                                {regNumber && (
                                    <p className="text-[10px] text-slate-500 font-mono">{regNumber}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tear-off Ticket Dashed Divider with Notches */}
                    <div className="relative w-full py-1">
                        <div className="border-b-2 border-dashed border-slate-300 mx-4 sm:mx-6"></div>
                        {/* Left Cutout Circle */}
                        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#C9CBA3] shadow-inner"></div>
                        {/* Right Cutout Circle */}
                        <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#C9CBA3] shadow-inner"></div>
                    </div>

                    {/* Bottom Section: Highlight Exact Seat Numbers */}
                    <div className="p-6 sm:p-8 bg-[#FAFCFB] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left space-y-1">
                            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                                <Armchair size={14} className="text-[#172144]" />
                                <span>Confirmed Seat Numbers</span>
                            </p>
                            <p className="text-[11px] text-slate-500">
                                Reserved exclusively under booking ref <span className="font-mono font-bold text-slate-700">{booking.id.slice(0, 8).toUpperCase()}</span>
                            </p>
                        </div>

                        {/* Large Highlighted Seat Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {seatList.length > 0 ? (
                                seatList.map((seat) => (
                                    <div
                                        key={seat}
                                        className="px-4 py-2 bg-[#172144] text-[#FCA311] rounded-2xl font-black text-lg sm:text-xl shadow-md tracking-tight min-w-[54px] text-center border border-[#233163]"
                                    >
                                        {seat}
                                    </div>
                                ))
                            ) : (
                                <span className="text-sm font-bold text-slate-600">
                                    Seats Assigned at Counter
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Ticket Footer Security Badge */}
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
                        <p className="text-[11px] text-slate-600 flex items-center justify-center gap-1.5">
                            <ShieldCheck size={13} className="text-emerald-700" />
                            <span>Present this digital pass or SMS confirmation when boarding the coach.</span>
                        </p>
                    </div>

                </div>

                {/* 3. Action Buttons */}
                <SuccessActions />

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
