import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Bus Ticket Booking',
  description: 'Real-time bus booking',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">BusApp</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/buses" className="text-gray-600 hover:text-gray-900">Buses</Link>
              <Link href="/my-bookings" className="text-gray-600 hover:text-gray-900">My Bookings</Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
              <Link href="/register" className="text-gray-600 hover:text-gray-900">Register</Link>
            </nav>
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

