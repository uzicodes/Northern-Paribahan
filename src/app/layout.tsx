import './globals.css';
import 'lenis/dist/lenis.css';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import localFont from 'next/font/local';
import SessionManager from '@/components/SessionManager';
import SmoothScroll from '@/components/SmoothScroll';
import PublicShell from '@/components/PublicShell';

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
            <body className={`min-h-screen flex flex-col ${satoshi.className} bg-[#C9CBA3]`}>
                <SmoothScroll>
                    <SessionManager />
                    <Toaster richColors position="bottom-right" />
                    <PublicShell>{children}</PublicShell>
                </SmoothScroll>
            </body>
        </html>
    );
}
