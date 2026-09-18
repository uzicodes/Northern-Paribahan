'use client';

import React from 'react';
import Link from 'next/link';
import { Printer, Home, Compass } from 'lucide-react';

const handlePrint = () => {
    if (typeof window !== 'undefined') {
        window.print();
    }
};

export default function SuccessActions() {

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg mx-auto pt-2 print:hidden">
            <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#172144] hover:bg-[#202e5e] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
                <Printer size={16} className="text-[#FCA311]" />
                <span>Download E-Ticket</span>
            </button>

            <Link
                href="/profile"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-bold text-sm rounded-xl border border-slate-200 shadow-xs transition-all"
            >
                <Compass size={16} className="text-[#172144]" />
                <span>View My Trips</span>
            </Link>

            <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-600 font-bold text-sm rounded-xl transition-all"
            >
                <Home size={16} />
                <span className="sm:hidden">Home</span>
            </Link>
        </div>
    );
}

