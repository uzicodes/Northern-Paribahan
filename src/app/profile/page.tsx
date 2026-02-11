'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Bus,
    Calendar,
    Clock,
    User,
    LogOut,
    Pencil,
    Phone,
    Mail,
    Check,
    X,
    Loader2,
    MapPin,
    Ticket,
    ChevronRight,
    AlertCircle,
    UserCircle
} from 'lucide-react';

// --- Types ---
interface UserProfile {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
}

interface BookingItem {
    id: string;
    status: string;
    createdAt: string;
    seatNumber: string;
    busName: string;
    busType: string;
    busPlate: string;
    price: number;
}

// --- Tab Type ---
type ActiveTab = 'profile' | 'trips' | 'edit';

export default function ProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [user, setUser] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const [error, setError] = useState('');

    // Edit form state
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/user/profile');
            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch profile');
            }
            const data = await res.json();
            setUser(data.user);
            setBookings(data.bookings || []);
            setEditName(data.user.name || '');
            setEditPhone(data.user.phoneNumber || '');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!editName.trim()) return;
        setSaving(true);
        setSaveSuccess(false);
        try {
            const res = await fetch('/api/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, phoneNumber: editPhone }),
            });
            if (!res.ok) throw new Error('Failed to update');
            const data = await res.json();
            setUser(data.user);
            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
                setActiveTab('profile');
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (err) {
            setError('Failed to logout');
            setLoggingOut(false);
        }
    };

    // Separate bookings into upcoming and past
    const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED');
    const pastBookings = bookings.filter(b => b.status !== 'CONFIRMED');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#C9CBA3' }}>
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-slate-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#C9CBA3' }}>
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-slate-700 font-semibold">Could not load profile.</p>
                    <button onClick={() => router.push('/login')} className="mt-4 text-indigo-600 font-medium hover:underline">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="min-h-screen font-sans text-slate-600 flex justify-center p-4 md:p-8" style={{ backgroundColor: '#C9CBA3' }}>
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ===== LEFT SIDEBAR ===== */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
                            {userInitial}
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{user.name || 'User'}</h2>
                        <p className="text-sm text-slate-400 mb-1">{user.email}</p>
                        {user.phoneNumber && (
                            <p className="text-sm text-slate-400">+880 {user.phoneNumber}</p>
                        )}
                        <span className="inline-block mt-3 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                            {user.role}
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-2">
                        <SidebarButton
                            icon={User}
                            label="My Profile"
                            active={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        />
                        <SidebarButton
                            icon={Ticket}
                            label="My Trips"
                            active={activeTab === 'trips'}
                            onClick={() => setActiveTab('trips')}
                        />
                        <SidebarButton
                            icon={Pencil}
                            label="Edit Profile"
                            active={activeTab === 'edit'}
                            onClick={() => setActiveTab('edit')}
                        />
                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50"
                            >
                                {loggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
                                <span className="font-medium">{loggingOut ? 'Logging out...' : 'Log Out'}</span>
                            </button>
                        </div>
                    </nav>
                </div>

                {/* ===== RIGHT CONTENT AREA ===== */}
                <div className="lg:col-span-9 space-y-6">

                    {/* Error Banner */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl flex items-center gap-3">
                            <AlertCircle size={20} />
                            <span className="text-sm font-medium">{error}</span>
                            <button onClick={() => setError('')} className="ml-auto"><X size={18} /></button>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                {activeTab === 'profile' && `Welcome, ${user.name?.split(' ')[0] || 'User'}! 👋`}
                                {activeTab === 'trips' && 'My Trips 🚌'}
                                {activeTab === 'edit' && 'Edit Profile ✏️'}
                            </h1>
                            <p className="text-slate-500">
                                {activeTab === 'profile' && 'Here is your account overview.'}
                                {activeTab === 'trips' && 'View your upcoming and past journeys.'}
                                {activeTab === 'edit' && 'Update your personal information.'}
                            </p>
                        </div>
                    </div>

                    {/* ===== TAB CONTENT ===== */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">

                        {/* --- MY PROFILE TAB --- */}
                        {activeTab === 'profile' && (
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
                                        onClick={() => setActiveTab('edit')}
                                        className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                                    >
                                        <Pencil size={16} />
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- MY TRIPS TAB --- */}
                        {activeTab === 'trips' && (
                            <div className="p-6 md:p-8 space-y-8">
                                {bookings.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                        <Bus size={56} className="mb-4 opacity-20" />
                                        <p className="text-lg font-semibold text-slate-500">No trips yet</p>
                                        <p className="text-sm">Your bookings will appear here once you book a trip.</p>
                                        <button
                                            onClick={() => router.push('/')}
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
                        )}

                        {/* --- EDIT PROFILE TAB --- */}
                        {activeTab === 'edit' && (
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
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 text-sm font-medium">+880</span>
                                            <input
                                                type="tel"
                                                value={editPhone}
                                                onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                                                placeholder="17XXXXXXXXX"
                                                className="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                                        >
                                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditName(user.name || '');
                                                setEditPhone(user.phoneNumber || '');
                                                setActiveTab('profile');
                                            }}
                                            className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-Components ---

function SidebarButton({ icon: Icon, label, active, onClick }: {
    icon: any; label: string; active: boolean; onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
            {active && <ChevronRight size={16} className="ml-auto" />}
        </button>
    );
}

function StatCard({ icon: Icon, label, value, colorClass, bgClass }: {
    icon: any; label: string; value: string | number; colorClass: string; bgClass: string;
}) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-full ${bgClass}`}>
                <Icon className={colorClass} size={24} />
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            </div>
        </div>
    );
}

function ProfileField({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100">
            <div className="p-2.5 rounded-full bg-indigo-50">
                <Icon size={18} className="text-indigo-500" />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-slate-700">{value}</p>
            </div>
        </div>
    );
}

function BookingCard({ booking, isUpcoming = false }: { booking: BookingItem; isUpcoming?: boolean }) {
    const date = new Date(booking.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Status stripe */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isUpcoming ? 'bg-emerald-500' : 'bg-slate-300'}`} />

            <div className="p-5 pl-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Bus icon */}
                <div className={`p-3 rounded-xl ${isUpcoming ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                    <Bus size={24} className={isUpcoming ? 'text-emerald-600' : 'text-slate-400'} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800">{booking.busName}</h4>
                    <p className="text-sm text-slate-400">{booking.busType} • Plate: {booking.busPlate}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Calendar size={12} /> {formattedDate}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <MapPin size={12} /> Seat {booking.seatNumber}
                        </span>
                    </div>
                </div>

                {/* Price & Status */}
                <div className="flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-slate-800">৳{booking.price}</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${isUpcoming
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                        {booking.status}
                    </span>
                </div>
            </div>
        </div>
    );
}