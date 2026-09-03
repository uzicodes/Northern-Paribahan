'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Menu } from 'lucide-react';
import { MobileMenu, ContactPopup } from './NavbarModals';
import { toast } from 'sonner';
import { satisfy } from '@/lib/fonts';
import { createClient } from '@/utils/supabase/client';

type JwtPayload = { role?: string };

function decodeRole(token: string | null): string | null {
    if (!token) return null;
    try {
        const payload = token.split('.')[1];
        const json = JSON.parse(typeof atob !== 'undefined' ? atob(payload) : Buffer.from(payload, 'base64').toString());
        return (json as JwtPayload).role || null;
    } catch {
        return null;
    }
}

export default function NavbarClient() {
    const pathname = usePathname();
    const router = useRouter();
    const [authState, setAuthState] = useState<{ isLoggedIn: boolean; token: string | null }>(() => {
        if (typeof document !== 'undefined') {
            const hasAuthCookie = document.cookie.split(';').some((c) => c.trim().startsWith('sb-'));
            return { isLoggedIn: hasAuthCookie, token: null };
        }
        return { isLoggedIn: false, token: null };
    });
    const { isLoggedIn, token } = authState;
    const [showContactPopup, setShowContactPopup] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const role = useMemo(() => decodeRole(token), [token]);

    useEffect(() => {
        const supabase = createClient();

        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuthState({
                isLoggedIn: !!session?.user,
                token: session?.access_token ?? null,
            });
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthState({
                isLoggedIn: !!session?.user,
                token: session?.access_token ?? null,
            });
        });

        return () => subscription.unsubscribe();
    }, []);

    async function logout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        await fetch('/api/auth/logout', { method: 'POST' });
        setAuthState({ isLoggedIn: false, token: null });
        router.push('/');
        router.refresh();
    }

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="relative flex items-center gap-4 text-sm">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
                <Link
                    href="/timetable"
                    className={isActive('/timetable') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-[#FCA311]'}
                >
                    Timetable
                </Link>

                <Link
                    href="/buses"
                    className={isActive('/buses') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-[#FCA311]'}
                >
                    Buses
                </Link>

                {role === 'ADMIN' && (
                    <Link
                        href="/admin"
                        className={isActive('/admin') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-[#FCA311]'}
                    >
                        Admin
                    </Link>
                )}
                {!isLoggedIn && (
                    <>
                        <Link
                            href="/login"
                            className={isActive('/login') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-[#FCA311]'}
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className={isActive('/register') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-[#FCA311]'}
                        >
                            Register
                        </Link>
                    </>
                )}
                <button
                    type="button"
                    aria-label="User Profile"
                    onClick={() => {
                        if (isLoggedIn) {
                            router.push('/profile');
                        } else {
                            toast.error('Please Login First');
                        }
                    }}
                    className={(isLoggedIn || isActive('/profile')) ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-[#FCA311]'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </button>
                {!isLoggedIn ? (
                    <button
                        type="button"
                        aria-label="Contact Us"
                        onClick={() => setShowContactPopup(true)}
                        className="text-white hover:text-[#FCA311]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </button>
                ) : (
                    <button type="button" onClick={logout} className="text-white hover:text-[#FCA311]">Logout</button>
                )}
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="md:hidden flex items-center">
                <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-white hover:text-[#FCA311] p-2 transition-all duration-300 transform hover:scale-110"
                    aria-label="Toggle Menu"
                >
                    {isMobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <Menu className="h-7 w-7" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Pop-up Overlay */}
            <MobileMenu
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                isActive={isActive}
                role={role}
                isLoggedIn={isLoggedIn}
                onProfileClick={() => router.push('/profile')}
                onLogoutClick={logout}
                onContactClick={() => setShowContactPopup(true)}
                satisfyClassName={satisfy.className}
            />

            {/* Contact Popup */}
            <ContactPopup
                showContactPopup={showContactPopup}
                setShowContactPopup={setShowContactPopup}
            />
        </nav>
    );
}
