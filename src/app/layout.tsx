import './globals.css';
import 'lenis/dist/lenis.css';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import Link from 'next/link';
import { satisfy } from '@/lib/fonts';
import localFont from 'next/font/local';
import Image from 'next/image';
import NavbarClient from '@/components/Navbar';
import SessionManager from '@/components/SessionManager';
import PageLoader from '@/components/PageLoader';
import SmoothScroll from '@/components/SmoothScroll';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });

const satoshi = localFont({
    src: [
        { path: '../../public/fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
        { path: '../../public/fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' }
    ]
});

export const metadata = {
    title: 'Northern Paribahan',
    description: 'Real-time bus booking',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className={`min-h-screen flex flex-col ${satoshi.className}`} style={{ backgroundColor: '#C9CBA3' }}>
                <SmoothScroll>
                    <SessionManager />
                    <Toaster richColors position="bottom-right" />
                    <header className="sticky top-0 z-40 border-b border-[#223062] shadow-sm" style={{ backgroundColor: '#172144' }}>
                        <div className="max-w-6xl mx-auto px-4 h-[57px] flex items-center justify-between" style={{ color: '#F1F604' }}>
                            <Link href="/" className="font-semibold text-lg flex items-center gap-2">
                                <Image src="/logo.png" alt="Northern Paribahan Logo" width={32} height={32} style={{ display: 'inline-block', verticalAlign: 'middle' }} priority />
                                <span className={satisfy.className} style={{ color: '#FCA311', fontSize: '24px' }}>Northern Paribahan</span>
                            </Link>
                            <div style={{ color: '#F1F604' }}><NavbarClient /></div>
                        </div>
                    </header>
                    <main className="flex-grow">
                        <PageLoader>{children}</PageLoader>
                    </main>
                    <Footer />
                </SmoothScroll>
            </body>
        </html>
    );
}

