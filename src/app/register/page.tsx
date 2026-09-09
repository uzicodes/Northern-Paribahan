"use client";

import React, { useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { satisfy } from '@/lib/fonts';
import { 
    Loader2, 
    Eye, 
    EyeOff, 
    AlertCircle, 
    User, 
    Mail, 
    Phone, 
    Lock, 
    Sparkles
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';

type RegisterState = {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    showPassword: boolean;
    loading: boolean;
    googleLoading: boolean;
    error: string;
};

const initialState: RegisterState = {
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    showPassword: false,
    loading: false,
    googleLoading: false,
    error: '',
};

function registerReducer(state: RegisterState, action: Partial<RegisterState>): RegisterState {
    return { ...state, ...action };
}

export default function RegisterPage() {
    const router = useRouter();
    const [state, dispatch] = useReducer(registerReducer, initialState);
    const { name, email, phoneNumber, password, showPassword, loading, googleLoading, error } = state;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ error: '' });

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email) || (email.match(/@/g) || []).length !== 1) {
            dispatch({ error: 'Please enter a valid email address with a single @.' });
            return;
        }

        if (phoneNumber.length !== 10) {
            dispatch({ error: 'Please enter a valid 10-digit Bangladeshi mobile number without leading 0.' });
            return;
        }

        if (password.length < 6) {
            dispatch({ error: 'Password must be at least 6 characters long.' });
            return;
        }

        dispatch({ loading: true });

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phoneNumber,
                    password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/login');
            } else {
                dispatch({ error: data.error || 'Registration failed. Please try again.' });
            }
        } catch (err: any) {
            dispatch({ error: 'A network error occurred. Please check your connection.' });
        } finally {
            dispatch({ loading: false });
        }
    };

    const handleGoogleSignUp = async () => {
        dispatch({ googleLoading: true, error: '' });

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${location.origin}/api/auth/callback`,
                },
            });

            if (error) {
                throw new Error(error.message);
            }
        } catch (err: any) {
            dispatch({ error: err.message, googleLoading: false });
        }
    };

    return (
        <div 
            className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6"
            style={{ backgroundColor: '#C9CBA3' }}
        >
            <div className="w-full max-w-md">
                {/* Single Form Card */}
                <div className="w-full bg-white rounded-3xl shadow-xl p-7 sm:p-9 border border-black/5">
                    {/* Brand Header */}
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-flex items-center justify-center gap-2.5 mb-2 group">
                            <Image 
                                src="/logo.png" 
                                alt="Northern Paribahan Logo" 
                                width={38} 
                                height={38} 
                                className="w-9 h-auto object-contain transition-transform group-hover:scale-105" 
                                priority
                            />
                            <span className={`${satisfy.className} text-[#172144] text-2xl sm:text-3xl font-bold`}>
                                Northern Paribahan
                            </span>
                        </Link>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create Account</h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Sign up today for instant intercity ticket bookings</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                            <span className="font-medium leading-relaxed">{error}</span>
                        </div>
                    )}

                    {/* Google Sign-Up */}
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={googleLoading}
                        className={`w-full bg-white border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm hover:bg-gray-50 hover:border-gray-400 hover:shadow-xs transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] ${googleLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {googleLoading ? (
                            <Loader2 className="animate-spin h-4 w-4 text-gray-500" />
                        ) : (
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        <span>{googleLoading ? 'Connecting with Google...' : 'Sign up with Google'}</span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4 sm:my-5">
                        <div className="flex-grow h-px bg-gray-200"></div>
                        <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Or register with email</span>
                        <div className="flex-grow h-px bg-gray-200"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        <div>
                            <label htmlFor="reg-name" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <User size={17} />
                                </span>
                                <input
                                    id="reg-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => dispatch({ name: e.target.value })}
                                    placeholder="e.g. Asif Ahmed"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#172144] focus:ring-2 focus:ring-[#172144]/15 outline-none transition-all duration-150"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={17} />
                                </span>
                                <input
                                    id="reg-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => dispatch({ email: e.target.value })}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#172144] focus:ring-2 focus:ring-[#172144]/15 outline-none transition-all duration-150"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="reg-phone" className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                                    Phone Number
                                </label>
                                <span className="text-[11px] text-gray-400 font-medium">
                                    {phoneNumber.length}/10 digits
                                </span>
                            </div>
                            <div className="relative flex rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-[#172144] focus-within:ring-2 focus-within:ring-[#172144]/15 transition-all overflow-hidden">
                                <div className="flex items-center px-3.5 bg-gray-100/70 border-r border-gray-200 text-gray-600 text-xs sm:text-sm font-semibold select-none shrink-0 gap-1">
                                    <Phone size={14} className="text-gray-400" />
                                    <span>+880</span>
                                </div>
                                <input
                                    id="reg-phone"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        dispatch({ phoneNumber: cleaned });
                                    }}
                                    placeholder="1XXXXXXXXX"
                                    required
                                    className="w-full px-3 py-2.5 sm:py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reg-password" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={17} />
                                </span>
                                <input
                                    id="reg-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => dispatch({ password: e.target.value })}
                                    placeholder="Minimum 6 characters"
                                    required
                                    className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#172144] focus:ring-2 focus:ring-[#172144]/15 outline-none transition-all duration-150"
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => dispatch({ showPassword: !showPassword })}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-2 bg-[#172144] hover:bg-[#101730] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:shadow-[#172144]/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>

                        <p className="text-center text-xs sm:text-sm text-gray-600 pt-2">
                            Already have an account?{' '}
                            <Link 
                                href="/login" 
                                className="font-bold text-[#172144] hover:text-[#FCA311] hover:underline transition-colors"
                            >
                                Log in here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}