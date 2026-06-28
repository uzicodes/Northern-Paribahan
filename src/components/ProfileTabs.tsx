'use client';
import React from 'react';
import { Ticket, Clock, Calendar, UserCircle, User, Mail, Phone, Bus, Pencil } from 'lucide-react';
import { StatCard, ProfileField, BookingItem } from './ProfileSubcomponents';
import { TripsTab } from './TripsTab';
import { EditProfileTab } from './EditProfileTab';

export function ProfileOverviewTab({ user, bookings, upcomingBookings, pastBookings, onEditClick }: {
    user: any;
    bookings: BookingItem[];
    upcomingBookings: BookingItem[];
    pastBookings: BookingItem[];
    onEditClick: () => void;
}) {
    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    icon={Ticket}
                    label="Total Bookings"
                    value={bookings.length}
                    colorClass="text-indigo-500"
                    bgClass="bg-indigo-50"
                />
                <StatCard
                    icon={Clock}
                    label="Upcoming"
                    value={upcomingBookings.length}
                    colorClass="text-emerald-500"
                    bgClass="bg-emerald-50"
                />
                <StatCard
                    icon={Calendar}
                    label="Completed"
                    value={pastBookings.length}
                    colorClass="text-amber-500"
                    bgClass="bg-amber-50"
                />
            </div>

            {/* Profile Details Card */}
            <div className="bg-slate-50 rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <UserCircle size={22} className="text-indigo-500" />
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ProfileField icon={User} label="Full Name" value={user.name || 'Not set'} />
                    <ProfileField icon={Mail} label="Email Address" value={user.email} />
                    <ProfileField icon={Phone} label="Phone Number" value={user.phoneNumber ? `+880 ${user.phoneNumber}` : 'Not set'} />
                    <ProfileField icon={Bus} label="Account Type" value={user.role} />
                </div>
                <button
                    type="button"
                    onClick={onEditClick}
                    className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                >
                    <Pencil size={16} />
                    Edit Profile
                </button>
            </div>
        </div>
    );
}

export { TripsTab, EditProfileTab };

