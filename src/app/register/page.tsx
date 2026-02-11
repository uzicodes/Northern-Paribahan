"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Satisfy } from 'next/font/google';
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const satisfy = Satisfy({
    weight: '400',
    subsets: ['latin'],
});

// Move regex outside the component to fix ReferenceError
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setError('');

        // 1. Validation check
        if (!emailPattern.test(email) || phoneNumber.length !== 11) {
            return;
        }

        setLoading(true);

        try {
            // 2. Call the Supabase registration API
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phoneNumber,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Account created successfully! Please login.');
                router.push('/login');
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch (err: any) {
            setError('A network error occurred. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center p-4 pt-8" style={{ backgroundColor: '#C9CBA3' }}>
            <div className="w-full max-w-5xl flex rounded-3xl shadow-2xl overflow-hidden bg-white h-auto">

                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full -ml-48 -mb-48"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-3 mb-8">
                            <img src="/logo.png" alt="Brand Logo" className="h-12 w-auto" />
                            <span className={satisfy.className} style={{ color: '#FCA311', fontSize: '28px' }}>Northern Paribahan</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">Join Us Today</h2>
                        <p className="text-blue-100 text-lg">Create your account and start your journey with us.</p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <FeatureItem title="Easy Booking" desc="Book tickets in just a few clicks" />
                        <FeatureItem title="Best Prices" desc="Affordable rates for all routes" />
                        <FeatureItem title="Safe Journey" desc="Your safety is our priority" />
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex items-center">
                    <div className="max-w-sm mx-auto w-full">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Create Account</h1>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                {submitted && !emailPattern.test(email) && (
                                    <p className="text-xs text-red-500 mt-1">Please use a valid email address.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm font-medium">+880</span>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                                        placeholder="17XXXXXXXXX"
                                        required
                                        className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                {submitted && phoneNumber.length !== 11 && (
                                    <p className="text-xs text-red-500 mt-1">Number must be exactly 11 digits.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min 6 characters"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
                            </button>

                            <p className="text-sm text-center text-gray-600">
                                Already have an account? <a href="/login" className="font-semibold text-indigo-600 hover:underline">Log In</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
                <h3 className="text-white font-semibold text-sm">{title}</h3>
                <p className="text-blue-200 text-xs">{desc}</p>
            </div>
        </div>
    );
}