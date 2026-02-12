"use client";

import React, { useState } from 'react';
import { Satisfy } from 'next/font/google';
import { Loader2, AlertCircle, CheckCircle2, Mail, ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

const satisfy = Satisfy({
    weight: '400',
    subsets: ['latin'],
});

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const supabase = createClient();

            //Use window.location.origin to automatically get http://localhost or https://your-site
            const redirectUrl = `${window.location.origin}/api/auth/callback?next=/auth/update-password`;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            });

            if (error) {
                throw new Error(error.message);
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
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
                        <h2 className="text-4xl font-bold text-white mb-4 text-balance">Reset Your Password</h2>
                        <p className="text-blue-100 text-lg">Don&apos;t worry, it happens to the best of us. We&apos;ll help you get back in.</p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <Feature icon={<CheckCircle2 className="h-6 w-6 text-white" />} title="Secure Reset" desc="Your reset link is unique and expires quickly" />
                        <Feature icon={<CheckCircle2 className="h-6 w-6 text-white" />} title="Quick Process" desc="Reset your password in under a minute" />
                    </div>
                </div>

                {/* Right Side - Forgot Password Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 flex items-center">
                    <div className="max-w-sm mx-auto w-full">
                        <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>

                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-indigo-50 rounded-full">
                                <Mail className="h-8 w-8 text-indigo-600" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Forgot Password?</h1>
                        <p className="text-gray-600 mb-6 text-center">Enter your email and we&apos;ll send you a link to reset your password.</p>

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
                                    <h3 className="font-semibold text-green-800 mb-1">Check Your Email</h3>
                                    <p className="text-sm text-green-700">
                                        We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Didn&apos;t receive the email?{' '}
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="font-semibold text-indigo-600 hover:underline"
                                    >
                                        Try again
                                    </button>
                                </p>
                            </div>
                        ) : (
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                                </button>

                                <p className="text-sm text-center text-gray-600">
                                    Remember your password? <Link href="/login" className="font-semibold text-indigo-600 hover:underline">Log In</Link>
                                </p>
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