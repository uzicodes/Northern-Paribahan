'use client';

import React, { useReducer, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    ShieldCheck,
    ArrowLeft,
    Sparkles,
    Headphones
} from 'lucide-react';
import { toast } from 'sonner';

import { BookingItem, SidebarButton } from '@/components/ProfileSubcomponents';
import { ProfileOverviewTab, TripsTab, EditProfileTab } from '@/components/ProfileTabs';

// --- Types ---
interface UserProfile {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
}

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

    const {
        activeTab,
        user,
        bookings,
        loading,
        loggingOut,
        error,
        editName,
        editPhone,
        saving,
        saveSuccess,
    } = state;

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
        if (!editName.trim()) {
            toast.error('Passenger full name is required');
            return;
        }
        dispatch({ saving: true, saveSuccess: false });
        try {
            const res = await fetch('/api/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, phoneNumber: editPhone }),
            });
            if (!res.ok) throw new Error('Failed to update profile');
            const data = await res.json();
            dispatch({ user: data.user, saveSuccess: true });
            toast.success('Profile updated successfully!');
            setTimeout(() => {
                dispatch({ saveSuccess: false, activeTab: 'profile' });
            }, 1200);
        } catch (err: any) {
            dispatch({ error: err.message });
            toast.error(err.message || 'Failed to update profile');
        } finally {
            dispatch({ saving: false });
        }
    };

    const handleLogout = async () => {
        dispatch({ loggingOut: true });
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            toast.success('Logged out successfully');
            router.push('/login');
            router.refresh();
        } catch (err) {
            dispatch({ error: 'Failed to logout', loggingOut: false });
            toast.error('Failed to log out');
        }
    };

    // Filter bookings into upcoming and past
    const upcomingBookings = bookings.filter((b) => b.status.toUpperCase() === 'CONFIRMED');
    const pastBookings = bookings.filter((b) => b.status.toUpperCase() !== 'CONFIRMED');

    if (loading) {
        return <GlobalLoader />;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#C9CBA3' }}>
                <div className="bg-white p-8 rounded-3xl shadow-md border border-black/5 text-center max-w-sm w-full space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
                        <AlertCircle size={28} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900">Session Required</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Please sign in with your passenger credentials to view your profile and bookings.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push('/login')}
                        className="w-full bg-[#172144] hover:bg-[#101730] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-slate-700" style={{ backgroundColor: '#C9CBA3' }}>
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Top Action Bar */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-black bg-white/80 hover:bg-white border border-black/10 px-3.5 py-2 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-2">
                    </div>
                </div>

                {/* Branded User Hero Banner */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-black/5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full lg:w-auto min-w-0">
                        <div className="flex items-center sm:items-start gap-3.5 sm:gap-5 w-full sm:w-auto min-w-0">
                            {/* Avatar */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#172144] ring-4 ring-amber-400/40 border-2 border-[#FCA311] flex items-center justify-center text-white text-2xl sm:text-3xl font-black shrink-0 shadow-md">
                                {userInitial}
                            </div>

                            {/* User Name & Badges */}
                            <div className="space-y-1 min-w-0 flex-1">
                                <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight break-words leading-tight">
                                    {user.name || 'Northern Passenger'}
                                </h1>

                                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                    <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                                        {user.role}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                                        <ShieldCheck size={11} className="text-emerald-600" />
                                        Verified
                                    </span>
                                </div>

                                {/* Email and Phone for tablet / desktop (sm+) */}
                                <div className="hidden sm:flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
                                    <span className="flex items-center gap-1.5 min-w-0">
                                        <Mail size={13} className="text-slate-400 shrink-0" />
                                        <span className="break-all">{user.email}</span>
                                    </span>
                                    {user.phoneNumber && (
                                        <span className="flex items-center gap-1.5 shrink-0">
                                            <Phone size={13} className="text-slate-400 shrink-0" />
                                            <span>+880 {user.phoneNumber}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Email and Phone for mobile screens (< sm) - cleanly organized and NEVER cut off */}
                        <div className="flex sm:hidden flex-col gap-2 w-full pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/70 min-w-0">
                                <Mail size={14} className="text-slate-400 shrink-0" />
                                <span className="break-all font-semibold text-slate-800">{user.email}</span>
                            </div>
                            {user.phoneNumber && (
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/70">
                                    <Phone size={14} className="text-slate-400 shrink-0" />
                                    <span className="font-semibold text-slate-800">+880 {user.phoneNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons: Edit Details + Book New Journey */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 shrink-0">
                        <button
                            type="button"
                            onClick={() => {
                                dispatch({ activeTab: 'edit' });
                                const tabArea = document.getElementById('profile-tab-content');
                                if (tabArea) {
                                    tabArea.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-4 py-2.5 sm:py-3 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                                activeTab === 'edit'
                                    ? 'bg-[#172144] text-white border-[#172144] shadow-md shadow-[#172144]/20'
                                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-2xs'
                            }`}
                        >
                            <Pencil size={15} className="text-[#FCA311]" />
                            <span>Edit Details</span>
                        </button>

                        <Link
                            href="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#172144] hover:bg-[#101730] text-white font-bold text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-xl shadow-md shadow-[#172144]/25 transition-all active:scale-95 cursor-pointer"
                        >
                            <Ticket size={15} className="text-[#FCA311]" />
                            <span>Book New Journey</span>
                        </Link>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-5 py-3.5 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold shadow-2xs">
                        <AlertCircle size={18} className="text-rose-600 shrink-0" />
                        <span className="flex-1">{error}</span>
                        <button type="button" onClick={() => dispatch({ error: '' })} className="cursor-pointer text-rose-500 hover:text-rose-700">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Main Content Grid: Sidebar (4 cols) & Tab Content (8 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* ===== LEFT SIDEBAR (4 COLS) ===== */}
                    <div className="lg:col-span-4 xl:col-span-4 space-y-4">
                        {/* Navigation Card */}
                        <nav className="bg-white p-3 rounded-2xl shadow-sm border border-black/5 space-y-1.5">
                            <SidebarButton
                                icon={User}
                                label="Profile Overview"
                                active={activeTab === 'profile'}
                                onClick={() => dispatch({ activeTab: 'profile' })}
                            />
                            <SidebarButton
                                icon={Ticket}
                                label="My Bus Trips"
                                count={bookings.length}
                                active={activeTab === 'trips'}
                                onClick={() => dispatch({ activeTab: 'trips' })}
                            />
                            <SidebarButton
                                icon={Pencil}
                                label="Edit Profile"
                                active={activeTab === 'edit'}
                                onClick={() => dispatch({ activeTab: 'edit' })}
                            />

                            <div className="pt-2 mt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-rose-600 hover:bg-rose-50 font-bold text-xs sm:text-sm cursor-pointer"
                                >
                                    <LogOut size={17} />
                                    <span>{loggingOut ? 'Logging Out...' : 'Sign Out Account'}</span>
                                </button>
                            </div>
                        </nav>

                        {/* Customer Service Support Badge */}
                        <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-2xs space-y-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                                    <Headphones size={16} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                        Passenger Support
                                    </h4>
                                    <p className="text-[11px] text-slate-400">Available 24/7 nationwide</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Need to reschedule your ticket or find a boarding counter? Call Northern Central Dispatch at <strong className="text-slate-900">16222</strong>.
                            </p>
                        </div>
                    </div>

                    {/* ===== RIGHT TAB CONTENT AREA (8 COLS) ===== */}
                    <div id="profile-tab-content" className="lg:col-span-8 xl:col-span-8 scroll-mt-6">
                        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden min-h-[520px]">
                            {activeTab === 'profile' && (
                                <ProfileOverviewTab
                                    user={user}
                                    bookings={bookings}
                                    upcomingBookings={upcomingBookings}
                                    pastBookings={pastBookings}
                                    onEditClick={() => dispatch({ activeTab: 'edit' })}
                                    onViewTripsClick={() => dispatch({ activeTab: 'trips' })}
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
                                    onPhoneChange={(val) => dispatch({ editPhone: val })}
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
        </div>
    );
}