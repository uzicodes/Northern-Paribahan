"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const ADMIN_EMAIL = 'admin@northernparibahan.com';

export default function AdminLoginPage() {
    const router = useRouter();
    const [passcode, setPasscode] = useState<string>('');
    const [showPasscode, setShowPasscode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: ADMIN_EMAIL,
                password: passcode,
            });

            if (authError) {
                throw new Error('Invalid Passcode');
            }

            router.push('/admin');
        } catch {
            setError('Invalid Passcode');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#C9CBA3' }}>
            <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 px-8 py-8 text-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 shadow-lg">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
                            <p className="text-indigo-200 text-sm">Authorized personnel only</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 py-8">
                        {error && (
                            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Passcode Input */}
                            <div>
                                <label htmlFor="passcode" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Admin Passcode
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="passcode"
                                        type={showPasscode ? 'text' : 'password'}
                                        value={passcode}
                                        onChange={(e) => setPasscode(e.target.value)}
                                        placeholder="Enter Admin Passcode"
                                        required
                                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasscode(!showPasscode)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPasscode ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-xl font-semibold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${loading
                                        ? 'bg-indigo-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Access Dashboard'
                                )}
                            </button>

                            {/* Back Link */}
                            <div className="text-center pt-2">
                                <a
                                    href="/login"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
                                >
                                    ← Back to User Login
                                </a>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer text */}
                <p className="text-center text-xs text-gray-600 mt-6">
                    Protected by Northern Paribahan Security
                </p>
            </div>
        </div>
    );
}
