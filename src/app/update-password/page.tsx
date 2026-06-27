"use client";

import React, { useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { Satisfy } from 'next/font/google';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

const satisfy = Satisfy({
    weight: '400',
    subsets: ['latin'],
});

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
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#C9CBA3' }}>
            <div className="w-full max-w-5xl flex rounded-3xl shadow-2xl overflow-hidden bg-white h-auto">

                {/* Left Side - Branding (Hidden on mobile) */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full -ml-48 -mb-48"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-3 mb-8">
                            <Image src="/logo.png" alt="Brand Logo" width={48} height={48} className="h-12 w-auto" />
                            <span className={satisfy.className} style={{ color: '#FCA311', fontSize: '28px' }}>Northern Paribahan</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4 text-balance">Set New Password</h2>
                        <p className="text-blue-100 text-lg">Choose a strong password to keep your account secure.</p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <Feature icon={<CheckCircle2 className="h-6 w-6 text-white" />} title="Strong Security" desc="Use a mix of letters, numbers & symbols" />
                        <Feature icon={<CheckCircle2 className="h-6 w-6 text-white" />} title="Stay Protected" desc="Never share your password with anyone" />
                    </div>
                </div>

                {/* Right Side - Update Password Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 flex items-center">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-indigo-50 rounded-full">
                                <Lock className="h-8 w-8 text-indigo-600" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Update Password</h1>
                        <p className="text-gray-600 mb-6 text-center">Enter your new password below.</p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        {success ? (
                            <div className="text-center space-y-4">
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-1">Password Updated!</h3>
                                    <p className="text-sm text-green-700">
                                        Your password has been successfully updated. Redirecting you to your profile...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="up-password" className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            id="up-password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => dispatch({ password: e.target.value })}
                                            placeholder="Min 6 characters"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            onClick={() => dispatch({ showPassword: !showPassword })}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="up-confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            id="up-confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => dispatch({ confirmPassword: e.target.value })}
                                            placeholder="Re-enter your password"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                            onClick={() => dispatch({ showConfirmPassword: !showConfirmPassword })}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="bg-white/20 p-2 rounded-lg">{icon}</div>
            <div>
                <h3 className="text-white font-semibold">{title}</h3>
                <p className="text-blue-200 text-sm">{desc}</p>
            </div>
        </div>
    );
}
