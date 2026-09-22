'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Printer,
  Bus,
  Calendar,
  MapPin,
  User,
  Copy,
  Check,
  ShieldCheck,
  Armchair,
  ArrowRight,
  RefreshCw,
  Ticket,
  ChevronLeft,
} from 'lucide-react';
import { verifyTicketAction } from '@/actions/verifyTicket';
import { VerifiedTicket } from '@/types/ticket';

interface VerifyTicketClientProps {
  initialTicket: VerifiedTicket | null;
  initialQuery?: string;
  initialError?: string | null;
}

export default function VerifyTicketClient({
  initialTicket,
  initialQuery = '',
  initialError = null,
}: VerifyTicketClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [ticket, setTicket] = useState<VerifiedTicket | null>(initialTicket);
  const [error, setError] = useState<string | null>(initialError);
  const [copiedId, setCopiedId] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Please provide a Booking Reference / PNR or Transaction ID.');
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await verifyTicketAction(trimmed);
      if (res.success) {
        setTicket(res.data);
        setError(null);
      } else {
        setTicket(null);
        setError(res.error);
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#C9CBA3] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-2xs transition-all"
          >
            <ChevronLeft size={14} />
            <span>Back to Home</span>
          </Link>
          <span className="text-xs font-semibold text-slate-700">
            Northern Paribahan Online Verification Portal
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-[#172144] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#202e5e] relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FCA311]/20 border border-[#FCA311]/30 flex items-center justify-center text-[#FCA311] shadow-inner">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Verify Ticket Status</span>
                  <span className="text-[11px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#FCA311] text-[#172144]">
                    Official PNR
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Authenticate your coach reservation, verify passenger details, and download your official E-Ticket PDF.
                </p>
              </div>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearch} className="pt-2">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter Booking Reference / PNR or Transaction ID..."
                    className="w-full pl-10 pr-4 py-3.5 bg-white text-slate-900 placeholder:text-slate-400 font-semibold text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:border-transparent shadow-inner transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-3.5 bg-[#FCA311] hover:bg-[#e5940f] active:scale-[0.98] text-slate-950 font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                  {isPending ? (
                    <>
                      <RefreshCw size={16} className="animate-spin text-[#172144]" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <span>Inspect Ticket</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-l-4 border-rose-600 shadow-md flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-1 text-sm">
              <h3 className="font-black text-slate-900">Verification Failed</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Verified Ticket Card */}
        {ticket && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Top Verification Status Bar */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Booking Reference / PNR
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl sm:text-2xl font-mono font-black text-[#FCA311]">
                    #{ticket.ticketId.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ticket.ticketId)}
                    title="Copy Reference"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    {copiedId ? (
                      <Check size={16} className="text-emerald-400" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                {ticket.status === 'PAID' || ticket.status === 'CONFIRMED' ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>VERIFIED & CONFIRMED</span>
                  </span>
                ) : ticket.status === 'PENDING' ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Clock size={16} className="text-amber-400" />
                    <span>PAYMENT PENDING</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    <AlertTriangle size={16} className="text-rose-400" />
                    <span>CANCELLED / VOID</span>
                  </span>
                )}
              </div>
            </div>

            {/* Journey Header */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl font-black text-emerald-800 tracking-tight">
                      {ticket.origin}
                    </span>
                    <div className="flex items-center gap-1 text-[#FCA311] px-1">
                      <div className="w-4 h-[2px] bg-slate-300" />
                      <ArrowRight size={18} className="text-[#FCA311]" />
                      <div className="w-4 h-[2px] bg-slate-300" />
                    </div>
                    <span className="text-2xl font-black text-amber-800 tracking-tight">
                      {ticket.destination}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{ticket.departureDate}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-400" />
                      <span>Departure: <strong className="text-slate-900">{ticket.departureTime}</strong></span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" />
                      <span>Northern Intercity Terminal</span>
                    </span>
                  </div>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                    Total Amount Paid
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-rose-600">
                    ৳{ticket.totalFare.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Passenger */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <User size={13} /> Passenger Information
                  </span>
                  <p className="font-black text-slate-900 text-sm">{ticket.passengerName}</p>
                  <p className="text-slate-600 truncate">{ticket.passengerEmail}</p>
                  {ticket.passengerPhone && (
                    <p className="text-slate-600">{ticket.passengerPhone}</p>
                  )}
                </div>

                {/* Coach Assignment */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Bus size={13} /> Coach Details
                  </span>
                  <p className="font-black text-slate-900 text-sm">{ticket.busModel}</p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                      {ticket.busTier} CLASS
                    </span>
                    <span className="font-mono text-slate-600 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
                      {ticket.busReg}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seat Numbers */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Armchair size={15} className="text-slate-500" />
                    Allocated Seats ({ticket.seats.length}):
                  </span>
                  {ticket.seats.map((seat) => (
                    <span
                      key={seat}
                      className="px-3 py-1 bg-[#172144] text-white font-black text-xs rounded-lg shadow-xs"
                    >
                      {seat}
                    </span>
                  ))}
                </div>

                {ticket.transactionId && (
                  <span className="text-xs font-mono text-slate-500">
                    Txn ID: {ticket.transactionId}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 print:hidden">
                <a
                  href={`/api/ticket/download?pnr=${encodeURIComponent(ticket.ticketId)}`}
                  download={`Ticket-${ticket.ticketId.toUpperCase()}.pdf`}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#172144] hover:bg-[#202e5e] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Download size={16} className="text-[#FCA311]" />
                  <span>Download Official PDF E-Ticket</span>
                </a>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-700 font-bold text-sm rounded-xl border border-slate-300 shadow-2xs transition-all cursor-pointer"
                >
                  <Printer size={16} />
                  <span>Print Ticket</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

