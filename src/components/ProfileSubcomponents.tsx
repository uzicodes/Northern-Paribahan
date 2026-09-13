'use client';

import React from 'react';
import { 
    ChevronRight, 
    Bus, 
    Calendar, 
    MapPin, 
    Clock, 
    CheckCircle2, 
    ShieldCheck, 
    Ticket 
} from 'lucide-react';

export interface BookingItem {
    id: string;
    status: string;
    createdAt: string;
    totalFare: number;
    seatNumbers: string[];
    busName: string;
    busType: string;
    registrationNumber: string;
    origin?: string;
    destination?: string;
    departureTime?: string | null;
    arrivalTime?: string | null;
    route: string;
}

export function SidebarButton({
    icon: Icon,
    label,
    active,
    onClick,
    count,
}: {
    icon: any;
    label: string;
    active: boolean;
    onClick: () => void;
    count?: number;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center w-full gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer text-left select-none ${
                active
                    ? 'bg-[#172144] text-white shadow-md shadow-[#172144]/25 border border-[#172144]'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/90 border border-transparent'
            }`}
        >
            <div className={`p-1.5 rounded-lg ${active ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Icon size={18} />
            </div>
            <span className="font-bold text-sm">{label}</span>
            {count !== undefined && count > 0 && (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    active ? 'bg-[#FCA311] text-slate-950' : 'bg-slate-200 text-slate-700'
                }`}>
                    {count}
                </span>
            )}
            {active && <ChevronRight size={16} className="ml-auto text-[#FCA311]" />}
        </button>
    );
}

export function StatCard({
    icon: Icon,
    label,
    value,
    badgeText,
    theme = 'navy',
}: {
    icon: any;
    label: string;
    value: string | number;
    badgeText?: string;
    theme?: 'navy' | 'emerald' | 'amber';
}) {
    const themeStyles = {
        navy: {
            bg: 'bg-slate-900/5',
            iconBg: 'bg-[#172144] text-white shadow-inner',
            border: 'border-slate-200/80',
            accent: 'text-slate-900',
        },
        emerald: {
            bg: 'bg-emerald-500/5',
            iconBg: 'bg-emerald-600 text-white shadow-inner',
            border: 'border-emerald-200/80',
            accent: 'text-emerald-700',
        },
        amber: {
            bg: 'bg-amber-500/5',
            iconBg: 'bg-[#FCA311] text-slate-950 shadow-inner',
            border: 'border-amber-200/80',
            accent: 'text-amber-800',
        },
    }[theme];

    return (
        <div className={`bg-white p-5 rounded-2xl border ${themeStyles.border} shadow-2xs hover:shadow-sm transition-all flex items-center justify-between gap-4`}>
            <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
                {badgeText && (
                    <span className="inline-block text-[10.5px] font-semibold text-slate-500">
                        {badgeText}
                    </span>
                )}
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${themeStyles.iconBg}`}>
                <Icon size={22} />
            </div>
        </div>
    );
}

export function ProfileField({
    icon: Icon,
    label,
    value,
    badge,
}: {
    icon: any;
    label: string;
    value: string;
    badge?: string;
}) {
    return (
        <div className="flex items-center gap-3.5 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-500/20 shrink-0">
                <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
                    {badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full shrink-0">
                            {badge}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export function BookingCard({
    booking,
    isUpcoming = false,
}: {
    booking: BookingItem;
    isUpcoming?: boolean;
}) {
    // Parse departure date
    const dateSource = booking.departureTime || booking.createdAt;
    const dateObj = new Date(dateSource);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    // Parse origin and destination from route if not provided
    let originText = booking.origin || '';
    let destinationText = booking.destination || '';
    if (!originText && booking.route) {
        const parts = booking.route.split('→').map((p) => p.trim());
        originText = parts[0] || 'Origin';
        destinationText = parts[1] || 'Destination';
    }

    const timeFormatted = booking.departureTime
        ? new Date(booking.departureTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
          })
        : null;

    const isConfirmed = booking.status.toUpperCase() === 'CONFIRMED';

    return (
        <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 shadow-2xs">
            {/* Left Accent Stripe */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-2 ${
                    isUpcoming
                        ? 'bg-gradient-to-b from-emerald-500 via-emerald-600 to-[#FCA311]'
                        : isConfirmed
                        ? 'bg-slate-400'
                        : 'bg-rose-400'
                }`}
            />

            <div className="p-5 sm:p-6 pl-6 sm:pl-7 space-y-4">
                {/* Top Info Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-indigo-950 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {booking.busName}
                        </span>
                        <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {booking.busType}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {booking.registrationNumber}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                            isUpcoming
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : isConfirmed
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                            {isUpcoming && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
                            {booking.status}
                        </span>
                    </div>
                </div>

                {/* Route Header with Custom Arrow */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight">
                                {originText}
                            </h4>
                            <div className="flex items-center gap-1 text-[#FCA311] px-1">
                                <div className="w-3 h-[2px] bg-slate-300" />
                                <ChevronRight size={18} className="text-[#FCA311]" />
                                <div className="w-3 h-[2px] bg-slate-300" />
                            </div>
                            <h4 className="text-xl sm:text-2xl font-black text-amber-800 tracking-tight">
                                {destinationText}
                            </h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-slate-400" />
                                <span>{formattedDate}</span>
                            </span>
                            {timeFormatted && (
                                <span className="flex items-center gap-1.5">
                                    <Clock size={13} className="text-slate-400" />
                                    <span>Departure: <strong className="text-slate-800">{timeFormatted}</strong></span>
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <MapPin size={13} className="text-slate-400" />
                                <span>Northern Counter</span>
                            </span>
                        </div>
                    </div>

                    {/* Fare and Seat Badges */}
                    <div className="sm:text-right flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider sm:mb-0.5">Total Paid</span>
                        <span className="text-xl sm:text-2xl font-black text-rose-600">
                            ৳{booking.totalFare.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Seats List Footer */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                            <Ticket size={14} className="text-slate-500" />
                            Reserved Seats:
                        </span>
                        {booking.seatNumbers.map((seat) => (
                            <span
                                key={seat}
                                className="px-2.5 py-0.5 bg-[#172144] text-white font-bold text-xs rounded-lg shadow-2xs"
                            >
                                {seat}
                            </span>
                        ))}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                        Ticket Ref: #{booking.id.slice(-8).toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    );
}
