'use client';
import React from 'react';
import { Bus } from 'lucide-react';
import { BookingCard, BookingItem } from './ProfileSubcomponents';

export function TripsTab({ bookings, upcomingBookings, pastBookings, onBookClick }: {
    bookings: BookingItem[];
    upcomingBookings: BookingItem[];
    pastBookings: BookingItem[];
    onBookClick: () => void;
}) {
    return (
        <div className="p-6 md:p-8 space-y-8">
            {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Bus size={56} className="mb-4 opacity-20" />
                    <p className="text-lg font-semibold text-slate-500">No trips yet</p>
                    <p className="text-sm">Your bookings will appear here once you book a trip.</p>
                    <button
                        type="button"
                        onClick={onBookClick}
                        className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Book a Trip
                    </button>
                </div>
            ) : (
                <>
                    {/* Upcoming */}
                    {upcomingBookings.length > 0 && (
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                Upcoming Trips
                            </h3>
                            <div className="space-y-4">
                                {upcomingBookings.map(booking => (
                                    <BookingCard key={booking.id} booking={booking} isUpcoming />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past */}
                    {pastBookings.length > 0 && (
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-4">Past Trips</h3>
                            <div className="space-y-4">
                                {pastBookings.map(booking => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
