'use client';

import React, { useState } from 'react';
import { Bus, Calendar, Clock, Ticket, ArrowRight, Sparkles } from 'lucide-react';
import { BookingCard, BookingItem } from './ProfileSubcomponents';

export function TripsTab({
    bookings,
    upcomingBookings,
    pastBookings,
    onBookClick,
}: {
    bookings: BookingItem[];
    upcomingBookings: BookingItem[];
    pastBookings: BookingItem[];
    onBookClick: () => void;
}) {
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

    const displayedBookings =
        filter === 'upcoming'
            ? upcomingBookings
            : filter === 'past'
            ? pastBookings
            : bookings;

    return (
        <div className="p-5 sm:p-7 space-y-6">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span>My Reserved Journeys</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-900 border border-amber-300">
                            {bookings.length} {bookings.length === 1 ? 'Trip' : 'Trips'}
                        </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Access all your digital boarding passes and journey invoices
                    </p>
                </div>

                {/* Filter Pills */}
                {bookings.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                filter === 'all'
                                    ? 'bg-[#172144] text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            All ({bookings.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('upcoming')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                filter === 'upcoming'
                                    ? 'bg-[#172144] text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Upcoming ({upcomingBookings.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('past')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                filter === 'past'
                                    ? 'bg-[#172144] text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Past ({pastBookings.length})
                        </button>
                    </div>
                )}
            </div>

            {/* Content List or Empty State */}
            {displayedBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-300/80">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center text-[#172144] mb-4 shadow-sm">
                        <Bus size={30} className="text-[#172144]" />
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        {filter === 'all'
                            ? 'No Bus Journeys Booked Yet'
                            : filter === 'upcoming'
                            ? 'No Upcoming Journeys Scheduled'
                            : 'No Past Journeys Found'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-6">
                        {filter === 'all'
                            ? 'Plan your next trip across Bangladesh with Northern Paribahan. Enjoy premium AC buses with real-time seat tracking.'
                            : 'Looking for a new travel adventure? Search our daily timetables and reserve your preferred seats in seconds.'}
                    </p>
                    <button
                        type="button"
                        onClick={onBookClick}
                        className="inline-flex items-center gap-2 bg-[#172144] hover:bg-[#101730] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-[#172144]/25 transition-all active:scale-95 cursor-pointer"
                    >
                        <span>Search Available Routes</span>
                        <ArrowRight size={16} className="text-[#FCA311]" />
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedBookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            isUpcoming={booking.status.toUpperCase() === 'CONFIRMED'}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
