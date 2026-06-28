'use client';

import React, { useReducer, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import GlobalLoader from '@/components/GlobalLoader';
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

import { BookingItem, SidebarButton } from '@/components/ProfileSubcomponents';
import { ProfileOverviewTab, TripsTab, EditProfileTab } from '@/components/ProfileTabs';

// --- Tab Type ---
type ActiveTab = 'profile' | 'trips' | 'edit';

type ProfileState = {
    activeTab: ActiveTab;
    user: UserProfile | null;
    bookings: BookingItem[];
    loading: boolean;
    loggingOut: boolean;
    error: string;
    editName: string;
    editPhone: string;
    saving: boolean;
    saveSuccess: boolean;
};

function profileReducer(state: ProfileState, action: Partial<ProfileState>): ProfileState {
    return { ...state, ...action };
}

export default function ProfilePage() {
    const router = useRouter();
    const [state, dispatch] = useReducer(profileReducer, {
        activeTab: 'profile',
        user: null,
        bookings: [],
        loading: true,
        loggingOut: false,
        error: '',
        editName: '',
        editPhone: '',
        saving: false,
        saveSuccess: false,
    });
    const { activeTab, user, bookings, loading, loggingOut, error, editName, editPhone, saving, saveSuccess } = state;

    const fetchProfile = useCallback(async () => {
        try {
            dispatch({ loading: true });
            const res = await fetch('/api/user/profile');
            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch profile');
            }
            const data = await res.json();
            dispatch({
                user: data.user,
                bookings: data.bookings || [],
                editName: data.user.name || '',
                editPhone: data.user.phoneNumber || '',
            });
        } catch (err: any) {
            dispatch({ error: err.message });
        } finally {
            dispatch({ loading: false });
        }
    }, [router]);

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSaveProfile = async () => {
        if (!editName.trim()) return;
        dispatch({ saving: true, saveSuccess: false });
        try {
            const res = await fetch('/api/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, phoneNumber: editPhone }),
            });
            if (!res.ok) throw new Error('Failed to update');
            const data = await res.json();
            dispatch({ user: data.user, saveSuccess: true });
            setTimeout(() => {
                dispatch({ saveSuccess: false, activeTab: 'profile' });
            }, 1500);
        } catch (err: any) {
            dispatch({ error: err.message });
        } finally {
            dispatch({ saving: false });
        }
    };

    const handleLogout = async () => {
        dispatch({ loggingOut: true });
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (err) {
            dispatch({ error: 'Failed to logout', loggingOut: false });
        }
    };

    // Separate bookings into upcoming and past
    const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED');
    const pastBookings = bookings.filter(b => b.status !== 'CONFIRMED');

    if (loading) {
        return <GlobalLoader />;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#C9CBA3' }}>
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-slate-700 font-semibold">Could not load profile.</p>
                    <button type="button" onClick={() => router.push('/login')} className="mt-4 text-indigo-600 font-medium hover:underline">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="min-h-screen text-slate-600 flex justify-center p-4 md:p-8" style={{ backgroundColor: '#C9CBA3' }}>
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
                            onClick={() => dispatch({ activeTab: 'profile' })}
                        />
                        <SidebarButton
                            icon={Ticket}
                            label="My Trips"
                            active={activeTab === 'trips'}
                            onClick={() => dispatch({ activeTab: 'trips' })}
                        />
                        <SidebarButton
                            icon={Pencil}
                            label="Edit Profile"
                            active={activeTab === 'edit'}
                            onClick={() => dispatch({ activeTab: 'edit' })}
                        />
                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Log Out</span>
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
                            <button type="button" onClick={() => dispatch({ error: '' })} className="ml-auto"><X size={18} /></button>
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

                        {activeTab === 'profile' && (
                            <ProfileOverviewTab
                                user={user}
                                bookings={bookings}
                                upcomingBookings={upcomingBookings}
                                pastBookings={pastBookings}
                                onEditClick={() => dispatch({ activeTab: 'edit' })}
                            />
                        )}

                        {activeTab === 'trips' && (
                            <TripsTab
                                bookings={bookings}
                                upcomingBookings={upcomingBookings}
                                pastBookings={pastBookings}
                                onBookClick={() => router.push('/')}
                            />
                        )}

                        {activeTab === 'edit' && (
                            <EditProfileTab
                                user={user}
                                editName={editName}
                                editPhone={editPhone}
                                saving={saving}
                                saveSuccess={saveSuccess}
                                onNameChange={(val) => dispatch({ editName: val })}
                                onPhoneChange={(val) => dispatch({ editPhone: val.replace(/\D/g, '').slice(0, 11) })}
                                onSave={handleSaveProfile}
                                onCancel={() => {
                                    dispatch({
                                        editName: user.name || '',
                                        editPhone: user.phoneNumber || '',
                                        activeTab: 'profile',
                                    });
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
