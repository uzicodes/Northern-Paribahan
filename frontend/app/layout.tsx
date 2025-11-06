import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import NavbarClient from '../components/NavbarClient';

export const metadata = {
  title: 'Northern Paribahan',
  description: 'Real-time bus booking',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">Northern Paribahan</Link>
            <NavbarClient />
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-4">{children}</main>
        <footer className="py-6 text-center text-sm text-gray-500">
          <Link className="hover:underline" href="/">Bus Ticket Booking</Link>
        </footer>
      </body>
    </html>
  );
}

