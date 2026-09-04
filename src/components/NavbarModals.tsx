'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Github, Mail } from 'lucide-react';

interface MobileMenuProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (val: boolean) => void;
    isActive: (path: string) => boolean;
    role: string | null;
    isLoggedIn: boolean;
    onProfileClick: () => void;
    onLogoutClick: () => void;
    onContactClick: () => void;
    satisfyClassName: string;
}

export function MobileMenu({
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isActive,
    role,
    isLoggedIn,
    onProfileClick,
    onLogoutClick,
    onContactClick,
    satisfyClassName,
}: MobileMenuProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    if (!mounted) return null;

    const content = (
        <div
            className={`fixed inset-0 z-[999] md:hidden transition-all duration-300 ${
                isMobileMenuOpen ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'
            }`}
        >
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close mobile menu backdrop"
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md w-full h-full border-none cursor-default"
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Side Menu Content */}
            <div
                className={`fixed right-0 top-0 h-full w-[290px] sm:w-[320px] bg-[#172144] shadow-2xl border-l border-slate-700/50 flex flex-col transition-transform duration-300 transform ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Menu Header */}
                <div className="p-5 flex items-center justify-between border-b border-slate-700/50 bg-[#1e2a5a]/40">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                        <span className={`${satisfyClassName} text-[#FCA311] text-2xl`}>Northern Paribahan</span>
                    </Link>
                    <button
                        type="button"
                        aria-label="Close mobile menu"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-slate-300 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700/50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <Link
                        href="/timetable"
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive('/timetable')
                                ? 'bg-[#FCA311] text-[#172144] font-bold shadow-lg shadow-[#FCA311]/20'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className={`p-2 rounded-lg ${isActive('/timetable') ? 'bg-white/20' : 'bg-slate-800'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-base font-medium">Timetable</span>
                    </Link>

                    <Link
                        href="/buses"
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive('/buses')
                                ? 'bg-[#FCA311] text-[#172144] font-bold shadow-lg shadow-[#FCA311]/20'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className={`p-2 rounded-lg ${isActive('/buses') ? 'bg-white/20' : 'bg-slate-800'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-base font-medium">Buses</span>
                    </Link>

                    {role === 'ADMIN' && (
                        <Link
                            href="/admin"
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive('/admin')
                                    ? 'bg-[#FCA311] text-[#172144] font-bold shadow-lg shadow-[#FCA311]/20'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className={`p-2 rounded-lg ${isActive('/admin') ? 'bg-white/20' : 'bg-slate-800'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className="text-base font-medium">Admin Panel</span>
                        </Link>
                    )}

                    <div className="pt-4 border-t border-slate-700/50 my-2">
                        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Account</p>

                        {!isLoggedIn ? (
                            <>
                                <Link
                                    href="/login"
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                                        isActive('/login') ? 'bg-[#FCA311] text-[#172144] font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="p-2 rounded-lg bg-slate-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                    </div>
                                    <span className="text-base font-medium">Login</span>
                                </Link>
                                <Link
                                    href="/register"
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                                        isActive('/register') ? 'bg-[#FCA311] text-[#172144] font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="p-2 rounded-lg bg-slate-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <span className="text-base font-medium">Register</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onProfileClick();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                                        isLoggedIn || isActive('/profile')
                                            ? 'bg-[#FCA311] text-[#172144] font-bold shadow-lg shadow-[#FCA311]/20'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <div className="p-2 rounded-lg bg-slate-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-base font-medium">Profile</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onLogoutClick();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                                >
                                    <div className="p-2 rounded-lg bg-red-500/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                    </div>
                                    <span className="text-base font-medium">Logout</span>
                                </button>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                onContactClick();
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-200 mt-2"
                        >
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-base font-medium">Contact Help</span>
                        </button>
                    </div>
                </div>

                {/* Footer in menu */}
                <div className="p-5 bg-[#1e2a5a]/40 border-t border-slate-700/50">
                    <p className="text-slate-400 text-xs text-center font-medium">
                        &copy; 2026 Northern Paribahan
                    </p>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
}

export function ContactPopup({
    showContactPopup,
    setShowContactPopup,
}: {
    showContactPopup: boolean;
    setShowContactPopup: (val: boolean) => void;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !showContactPopup) return null;

    const content = (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close contact popup backdrop"
                onClick={() => setShowContactPopup(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm w-full h-full border-none cursor-default"
            />
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-auto transform transition-all scale-100 relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Contact Us</h3>
                    <button
                        type="button"
                        aria-label="Close contact popup"
                        onClick={() => setShowContactPopup(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Support Center
                        </p>
                        <p className="text-sm text-slate-600 mb-1">For any problem, please contact:</p>
                        <p className="text-slate-800 font-medium">support@northernparibahan.com</p>
                        <p className="text-slate-800 font-medium">+880 1700-000000</p>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Developer Contact</p>
                        <div className="space-y-2">
                            <a
                                href="https://github.com/uzicodes"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors group"
                            >
                                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                uzicodes
                            </a>
                            <a
                                href="mailto:utshozi11@gmail.com"
                                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors group"
                            >
                                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                utshozi11@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
}
