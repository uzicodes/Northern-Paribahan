"use client";

import React, { useReducer } from 'react';
import { satisfy } from '@/lib/fonts';
import { 
    Loader2, 
    AlertCircle, 
    CheckCircle2, 
    Mail, 
    ArrowLeft, 
    KeyRound, 
    Sparkles
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';

type ForgotPasswordState = {
    email: string;
    loading: boolean;
    error: string;
    success: boolean;
};

const initialState: ForgotPasswordState = {
    email: '',
    loading: false,
    error: '',
    success: false,
};

function forgotPasswordReducer(state: ForgotPasswordState, action: Partial<ForgotPasswordState>): ForgotPasswordState {
    return { ...state, ...action };
}

export default function ForgotPasswordPage() {
    const [state, dispatch] = useReducer(forgotPasswordReducer, initialState);
    const { email, loading, error, success } = state;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ loading: true, error: '', success: false });

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${location.origin}/update-password`,
            });

            if (error) {
                throw new Error(error.message);
            }

            dispatch({ success: true });
        } catch (err: any) {
            dispatch({ error: err.message || 'Failed to send password reset email. Please try again.' });
        } finally {
            dispatch({ loading: false });
        }
    };

    return (
        <div 
            className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6" 
            style={{ backgroundColor: '#C9CBA3' }}
        >
            <div className="w-full max-w-md">
                {/* Back to Login Button */}
                <div className="mb-4 flex justify-start">
                    <Link 
                        href="/login" 
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white text-slate-800 hover:text-slate-950 border border-black/10 text-xs sm:text-sm font-semibold backdrop-blur-sm shadow-xs transition-all duration-200 group"
                    >
                        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                        <span>Back to Login</span>
                    </Link>
                </div>

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
                        <div className="flex justify-center mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                                <KeyRound size={12} className="text-[#FCA311]" />
                                <span>Account Security</span>
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Forgot Password?</h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Enter your email and we will send you a reset link</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                            <span className="font-medium leading-relaxed">{error}</span>
                        </div>
                    )}

                    {/* Success State */}
                    {success ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                                <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-base mb-1">Check Your Email</h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    We sent a reset link to <strong className="text-gray-900">{email}</strong>. Please check your inbox and spam folder.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => dispatch({ success: false, email: '' })}
                                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 font-semibold text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Try a different email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="fp-email" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={17} />
                                    </span>
                                    <input
                                        id="fp-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => dispatch({ email: e.target.value })}
                                        placeholder="name@example.com"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#172144] focus:ring-2 focus:ring-[#172144]/15 outline-none transition-all duration-150"
                                    />
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
                                        <span>Sending Reset Link...</span>
                                    </>
                                ) : (
                                    <span>Send Reset Link</span>
                                )}
                            </button>

                            <div className="pt-4 text-center">
                                <Link 
                                    href="/login" 
                                    className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-[#172144] transition-colors"
                                >
                                    Remember your password? <span className="text-[#172144] hover:underline font-bold">Sign in</span>
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}