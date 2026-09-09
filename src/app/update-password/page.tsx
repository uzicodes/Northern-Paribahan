"use client";

import React, { useReducer } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { satisfy } from '@/lib/fonts';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, Lock, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

type UpdatePasswordState = {
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    loading: boolean;
    error: string;
    success: boolean;
};

function updatePasswordReducer(state: UpdatePasswordState, action: Partial<UpdatePasswordState>): UpdatePasswordState {
    return { ...state, ...action };
}

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [state, dispatch] = useReducer(updatePasswordReducer, {
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
        loading: false,
        error: '',
        success: false,
    });
    const { password, confirmPassword, showPassword, showConfirmPassword, loading, error, success } = state;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ error: '' });

        if (password.length < 6) {
            dispatch({ error: 'Password must be at least 6 characters long.' });
            return;
        }

        if (password !== confirmPassword) {
            dispatch({ error: 'Passwords do not match.' });
            return;
        }

        dispatch({ loading: true });

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({ password });

            if (error) {
                throw new Error(error.message);
            }

            dispatch({ success: true });
            setTimeout(() => {
                router.push('/profile');
            }, 2000);
        } catch (err: any) {
            dispatch({ error: err.message || 'Failed to update password. Please try again.' });
        } finally {
            dispatch({ loading: false });
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1326] relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-[#FCA311] selection:text-white">
            {/* Ambient Background Glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#470BB0]/25 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FCA311]/15 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#172144]/60 rounded-full blur-[160px] pointer-events-none" />

            <div className="w-full max-w-5xl relative z-10 flex flex-col items-center">
                {/* Back to Home Link */}
                <div className="w-full mb-6 flex justify-start">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-[#FCA311] transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span>Back to Home</span>
                    </Link>
                </div>

                {/* Main Card Container */}
                <div className="w-full bg-[#101730]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                    {/* Left Hero / Brand Showcase */}
                    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#172144] via-[#101833] to-[#0a0f22] p-12 flex-col justify-between relative border-r border-white/10 overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#FCA311]/10 rounded-full blur-[100px] pointer-events-none" />

                        {/* Top Branding */}
                        <div className="relative z-10">
                            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                                <div className="p-2 bg-white/5 border border-white/10 rounded-2xl group-hover:border-[#FCA311]/40 transition-all">
                                    <Image src="/logo.png" alt="Northern Paribahan Logo" width={44} height={44} className="h-10 w-auto object-contain" priority />
                                </div>
                                <div>
                                    <span className={`${satisfy.className} text-[#FCA311] text-3xl block leading-none`}>
                                        Northern Paribahan
                                    </span>
                                    <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold mt-1 block">
                                        Premium Intercity Fleet
                                    </span>
                                </div>
                            </Link>

                            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                                Secure Your Account
                            </h1>
                            <p className="mt-3 text-slate-300 text-sm leading-relaxed max-w-md">
                                Set a strong, unique password to ensure complete security across all your bookings and journey history.
                            </p>
                        </div>

                        {/* Middle Bus Highlight */}
                        <div className="relative z-10 my-8 py-4">
                            <div className="relative w-full h-44 flex items-center justify-center">
                                <Image
                                    src="/bus/scania.png"
                                    alt="Northern Paribahan Coach"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Bottom Feature List */}
                        <div className="relative z-10 space-y-3.5 border-t border-white/10 pt-6">
                            <FeatureItem
                                icon={<ShieldCheck className="w-5 h-5 text-[#FCA311]" />}
                                title="End-to-End Account Protection"
                                desc="Guarding your payment history & scheduled itineraries"
                            />
                            <FeatureItem
                                icon={<KeyRound className="w-5 h-5 text-[#FCA311]" />}
                                title="Password Requirements"
                                desc="At least 6 characters with a combination of letters & numbers"
                            />
                        </div>
                    </div>

                    {/* Right Form Side */}
                    <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                        <div className="max-w-md w-full mx-auto">
                            {/* Mobile Brand Header */}
                            <div className="lg:hidden text-center mb-8">
                                <Link href="/" className="inline-flex items-center gap-3">
                                    <Image src="/logo.png" alt="Logo" width={40} height={40} className="h-9 w-auto" />
                                    <span className={`${satisfy.className} text-[#FCA311] text-2xl`}>Northern Paribahan</span>
                                </Link>
                            </div>

                            <div className="flex items-center justify-center mb-6">
                                <div className="p-4 bg-gradient-to-tr from-[#172144] to-[#1f2d5c] border border-white/10 rounded-2xl shadow-inner text-[#FCA311]">
                                    <KeyRound className="w-8 h-8" />
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white tracking-tight">Create New Password</h2>
                                <p className="text-slate-400 text-sm mt-1.5">Enter and confirm your new account password below.</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {success ? (
                                <div className="text-center space-y-4 py-4 animate-in fade-in duration-300">
                                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                                        <h3 className="font-bold text-emerald-300 text-lg mb-1">Password Successfully Updated!</h3>
                                        <p className="text-sm text-slate-300">
                                            Your password has been changed securely. Taking you to your profile in a moment...
                                        </p>
                                    </div>
                                    <div className="flex justify-center pt-2">
                                        <Loader2 className="w-6 h-6 text-[#FCA311] animate-spin" />
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="up-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                id="up-password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => dispatch({ password: e.target.value })}
                                                placeholder="Minimum 6 characters"
                                                required
                                                className="w-full pl-10 pr-10 py-3 bg-[#0a0f22]/70 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311] transition-all"
                                            />
                                            <button
                                                type="button"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                onClick={() => dispatch({ showPassword: !showPassword })}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="up-confirm-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                id="up-confirm-password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => dispatch({ confirmPassword: e.target.value })}
                                                placeholder="Re-enter your new password"
                                                required
                                                className="w-full pl-10 pr-10 py-3 bg-[#0a0f22]/70 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311] transition-all"
                                            />
                                            <button
                                                type="button"
                                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                                onClick={() => dispatch({ showConfirmPassword: !showConfirmPassword })}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-slate-950 bg-[#FCA311] hover:bg-[#ffb028] active:scale-[0.99] transition-all duration-150 shadow-lg shadow-[#FCA311]/20 flex items-center justify-center gap-2 ${
                                            loading ? 'opacity-70 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                                                <span>Updating Password...</span>
                                            </>
                                        ) : (
                                            <span>Update Password</span>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* Return to login link */}
                            <div className="mt-8 text-center pt-6 border-t border-white/10">
                                <Link
                                    href="/login"
                                    className="text-xs font-semibold text-slate-400 hover:text-[#FCA311] transition-colors"
                                >
                                    Remember your password? Log in
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-white/5 border border-white/10 rounded-xl shrink-0 mt-0.5">
                {icon}
            </div>
            <div>
                <h4 className="text-sm font-semibold text-white leading-snug">{title}</h4>
                <p className="text-xs text-slate-400 leading-normal mt-0.5">{desc}</p>
            </div>
        </div>
    );
}
