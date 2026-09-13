'use client';

import React from 'react';
import { 
    Ticket, 
    Clock, 
    Calendar, 
    UserCircle, 
    User, 
    Mail, 
    Phone, 
    Bus, 
    Pencil, 
    ShieldCheck, 
    Sparkles, 
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { StatCard, ProfileField, BookingItem, BookingCard } from './ProfileSubcomponents';
import { TripsTab } from './TripsTab';
import { EditProfileTab } from './EditProfileTab';

export function ProfileOverviewTab({
    user,
    bookings,
    upcomingBookings,
    pastBookings,
    onEditClick,
    onViewTripsClick,
}: {
    user: any;
    bookings: BookingItem[];
    upcomingBookings: BookingItem[];
    pastBookings: BookingItem[];
    onEditClick: () => void;
    onViewTripsClick?: () => void;
}) {
    const nextUpcoming = upcomingBookings[0] || null;

    return (
        <div className="p-5 sm:p-7 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    icon={Ticket}
                    label="Total Bookings"
                    value={bookings.length}
                    badgeText={bookings.length > 0 ? "Lifetime journeys" : "No bookings yet"}
                    theme="navy"
                />
                <StatCard
                    icon={Clock}
                    label="Upcoming Trips"
                    value={upcomingBookings.length}
                    badgeText={upcomingBookings.length > 0 ? "Active reservations" : "No active trip"}
                    theme="emerald"
                />
                <StatCard
                    icon={Calendar}
                    label="Completed"
                    value={pastBookings.length}
                    badgeText="Past journeys"
                    theme="amber"
                />
            </div>

            {/* Next Scheduled Journey Spotlight (if exists) */}
            {nextUpcoming && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Next Upcoming Journey
                        </h4>
                        {onViewTripsClick && (
                            <button
                                type="button"
                                onClick={onViewTripsClick}
                                className="text-xs font-bold text-slate-700 hover:text-black flex items-center gap-1 cursor-pointer"
                            >
                                <span>View All Trips</span>
                                <ChevronRight size={14} className="text-[#FCA311]" />
                            </button>
                        )}
                    </div>
                    <BookingCard booking={nextUpcoming} isUpcoming={true} />
                </div>
            )}

            {/* Profile Details Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3.5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#172144] text-white flex items-center justify-center shadow-inner">
                            <User size={16} />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                Personal Information
                            </h3>
                            <p className="text-xs text-slate-500">
                                Verified passenger contact and account details
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onEditClick}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-black bg-white hover:bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                        <Pencil size={14} className="text-[#FCA311]" />
                        <span>Edit Details</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <ProfileField
                        icon={User}
                        label="Full Name"
                        value={user.name || 'Not set'}
                    />
                    <ProfileField
                        icon={Mail}
                        label="Email Address"
                        value={user.email}
                        badge="Verified"
                    />
                    <ProfileField
                        icon={Phone}
                        label="Mobile Number"
                        value={user.phoneNumber ? `+880 ${user.phoneNumber}` : 'Not registered'}
                        badge={user.phoneNumber ? "SMS Active" : undefined}
                    />
                    <ProfileField
                        icon={ShieldCheck}
                        label="Account Privileges"
                        value={user.role === 'ADMIN' ? 'System Administrator' : 'Standard Passenger'}
                        badge={user.role}
                    />
                </div>
            </div>

            {/* Travel Assistance / Counter Info Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <Bus size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">Need Help With A Booking?</h4>
                        <p className="text-xs text-slate-500">Call our central 24/7 passenger hotline at <strong>16222</strong> or visit any counter.</p>
                    </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
                    Northern Paribahan Services
                </span>
            </div>
        </div>
    );
}

export { TripsTab, EditProfileTab };
