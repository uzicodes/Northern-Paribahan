'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Download, Home, Compass, ShieldCheck } from 'lucide-react';
import PnrVerificationModal from '@/components/ticket/PnrVerificationModal';

interface SuccessActionsProps {
  bookingId?: string;
  tranId?: string;
}

export default function SuccessActions({ bookingId, tranId }: SuccessActionsProps) {
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const activeRef = bookingId || tranId || '';

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl mx-auto pt-2 print:hidden">
        {/* Direct PDF Download */}
        {activeRef ? (
          <a
            href={`/api/ticket/download?pnr=${encodeURIComponent(activeRef)}`}
            download={`Ticket-${activeRef.toUpperCase()}.pdf`}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#172144] hover:bg-[#202e5e] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Download size={16} className="text-[#FCA311]" />
            <span>Download E-Ticket</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#172144] hover:bg-[#202e5e] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Download size={16} className="text-[#FCA311]" />
            <span>Download E-Ticket</span>
          </button>
        )}

        {/* Check Verification Status */}
        <button
          type="button"
          onClick={() => setIsVerifyModalOpen(true)}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-50 hover:bg-emerald-100 active:scale-[0.98] text-emerald-800 font-bold text-sm rounded-xl border border-emerald-300 shadow-xs transition-all cursor-pointer"
        >
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Verify PNR</span>
        </button>

        {/* View Profile Trips */}
        <Link
          href="/profile"
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-bold text-sm rounded-xl border border-slate-200 shadow-xs transition-all"
        >
          <Compass size={16} className="text-[#172144]" />
          <span>My Trips</span>
        </Link>

        {/* Home */}
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-600 font-bold text-sm rounded-xl transition-all"
          title="Return to Home"
        >
          <Home size={16} />
          <span className="sm:hidden">Home</span>
        </Link>
      </div>

      {/* Interactive Verification Modal */}
      {isVerifyModalOpen && (
        <PnrVerificationModal
          isOpen={isVerifyModalOpen}
          onClose={() => setIsVerifyModalOpen(false)}
          initialPnr={activeRef}
        />
      )}
    </>
  );
}
