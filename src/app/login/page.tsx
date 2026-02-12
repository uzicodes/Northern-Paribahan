"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Satisfy } from 'next/font/google';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const satisfy = Satisfy({
    weight: '400',
    subsets: ['latin'],
});

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [googleLoading, setGoogleLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to login. Please try again.');
            }

            router.refresh();
            router.push('/profile');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');

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
            setError(err.message);
            setGoogleLoading(false);
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
                            <img src="/logo.png" alt="Brand Logo" className="h-12 w-auto" />
                            <span className={satisfy.className} style={{ color: '#FCA311', fontSize: '28px' }}>Northern Paribahan</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4 text-balance">Travel With Comfort</h2>
                        <p className="text-blue-100 text-lg">Book your bus tickets easily and travel safely to your destination.</p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <Feature icon={<CheckCircle2 className="h-6 w-6 text-white" />} title="Easy Booking" desc="Book tickets in just a few clicks" />
                        <Feature icon={<CheckCircle2 className="h-6 w-6 text-white" />} title="Best Prices" desc="Affordable rates for all routes" />
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 flex items-center">
                    <div className="max-w-sm mx-auto w-full">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Welcome Back!</h1>
                        <p className="text-gray-600 mb-6 text-center">Please sign in to continue</p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-1">
                                <div className="flex-grow h-px bg-gray-300"></div>
                                <span className="text-sm text-gray-400 font-medium">OR</span>
                                <div className="flex-grow h-px bg-gray-300"></div>
                            </div>

                            {/* Google Sign-In Button */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                className={`w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-3 ${googleLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {googleLoading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                )}
                                {googleLoading ? 'Connecting...' : 'Sign in with Google'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper component for layout
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