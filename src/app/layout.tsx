import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Satisfy } from 'next/font/google';
import NavbarClient from '@/components/Navbar';
import Footer from '@/components/Footer';

const satisfy = Satisfy({
    weight: '400',
    subsets: ['latin'],
});

export const metadata = {
    title: 'Northern Paribahan',
    description: 'Real-time bus booking',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="min-h-screen flex flex-col" style={{ backgroundColor: '#C9CBA3' }}>
                <header className="border-b" style={{ backgroundColor: '#172144' }}>
                    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between" style={{ color: '#F1F604' }}>
                        <Link href="/" className="font-semibold text-lg flex items-center gap-2">
                            <img src="/logo.png" alt="Northern Paribahan Logo" style={{ height: 32, width: 32, display: 'inline-block', verticalAlign: 'middle' }} />
                            <span className={satisfy.className} style={{ color: '#FCA311', fontSize: '24px' }}>Northern Paribahan</span>
                        </Link>
                        <div style={{ color: '#F1F604' }}><NavbarClient /></div>
                    </div>
                </header>
                <main className="flex-grow">{children}</main>
                <Footer />
            </body>
        </html>
    );
}

