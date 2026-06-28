'use client';
import React from 'react';
import { Ticket, Clock, Calendar, UserCircle, User, Mail, Phone, Bus, Pencil, Check } from 'lucide-react';
import { StatCard, ProfileField, BookingCard, BookingItem } from './ProfileSubcomponents';

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

export function EditProfileTab({ user, editName, editPhone, saving, saveSuccess, onNameChange, onPhoneChange, onSave, onCancel }: {
    user: any;
    editName: string;
    editPhone: string;
    saving: boolean;
    saveSuccess: boolean;
    onNameChange: (val: string) => void;
    onPhoneChange: (val: string) => void;
    onSave: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="p-6 md:p-8 max-w-lg">
            <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                <Pencil size={20} className="text-indigo-500" />
                Update Your Information
            </h3>

            {saveSuccess && (
                <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2 animate-in">
                    <Check size={18} />
                    Profile updated successfully!
                </div>
            )}

            <div className="space-y-5">
                <div>
                    <label htmlFor="profile-name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input
                        id="profile-name"
                        type="text"
                        value={editName}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                </div>

                <div>
                    <label htmlFor="profile-email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input
                        id="profile-email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        readOnly
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
                </div>

                <div>
                    <label htmlFor="profile-phone" className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 text-sm font-medium">+880</span>
                        <input
                            id="profile-phone"
                            type="tel"
                            value={editPhone}
                            onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 11))}
                            placeholder="17XXXXXXXXX"
                            className="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
