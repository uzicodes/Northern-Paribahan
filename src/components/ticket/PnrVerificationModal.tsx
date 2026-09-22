'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  X,
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
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { verifyTicketAction } from '@/actions/verifyTicket';
import { VerifiedTicket } from '@/types/ticket';

interface PnrVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPnr?: string;
}

export default function PnrVerificationModal({
  isOpen,
  onClose,
  initialPnr = '',
}: PnrVerificationModalProps) {
  const [pnrInput, setPnrInput] = useState(initialPnr);
  const [ticket, setTicket] = useState<VerifiedTicket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Sync initial PNR and perform automatic verification if provided
  useEffect(() => {
    if (isOpen && initialPnr) {
      setPnrInput(initialPnr);
      handleSearch(initialPnr);
    } else if (isOpen && !initialPnr && !ticket) {
      setPnrInput('');
      setError(null);
    }
  }, [isOpen, initialPnr]);

  const handleSearch = (searchRef?: string) => {
    const query = (searchRef ?? pnrInput).trim();
    if (!query) {
      setError('Please provide a Booking Reference / PNR or Transaction ID.');
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await verifyTicketAction(query);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dark Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#172144] text-white px-6 py-5 flex items-center justify-between border-b border-[#202e5e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCA311]/20 border border-[#FCA311]/30 flex items-center justify-center text-[#FCA311]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Verify Ticket Status</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#FCA311] text-[#172144]">
                  PNR Check
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Inspect authentic booking credentials and boarding pass validity
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Search Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-2"
          >
            <label htmlFor="pnr-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Booking Reference / PNR or Transaction ID
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  id="pnr-input"
                  type="text"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value)}
                  placeholder="e.g. cm3xyz123 or SSLC-TRANS-987"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#172144] focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-3 bg-[#172144] hover:bg-[#202e5e] active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                {isPending ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-[#FCA311]" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify</span>
                    <ArrowRight size={16} className="text-[#FCA311]" />
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-600">
              Found on your booking SMS, confirmation email, or digital payment receipt.
            </p>
          </form>

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-rose-900">Verification Lookup Failed</p>
                <p className="text-rose-700 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Verified Ticket Card */}
          {ticket && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs space-y-0">
              {/* Ticket Top Banner */}
              <div className="p-4 sm:p-5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Verified Booking Ref
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base sm:text-lg font-mono font-black text-slate-900">
                      #{ticket.ticketId.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ticket.ticketId)}
                      title="Copy Reference"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      {copiedId ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Status Pill */}
                <div>
                  {ticket.status === 'PAID' || ticket.status === 'CONFIRMED' ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <span>OFFICIALLY CONFIRMED</span>
                    </span>
                  ) : ticket.status === 'PENDING' ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                      <Clock size={15} className="text-amber-600" />
                      <span>PAYMENT PENDING</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                      <AlertTriangle size={15} className="text-rose-600" />
                      <span>CANCELLED / VOID</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Journey Breakdown */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Route Header */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg sm:text-xl font-black text-emerald-800 tracking-tight">
                        {ticket.origin}
                      </span>
                      <div className="flex items-center gap-1 text-[#FCA311] px-1">
                        <div className="w-3 h-[2px] bg-slate-300" />
                        <ArrowRight size={16} className="text-[#FCA311]" />
                        <div className="w-3 h-[2px] bg-slate-300" />
                      </div>
                      <span className="text-lg sm:text-xl font-black text-amber-800 tracking-tight">
                        {ticket.destination}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{ticket.departureDate}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-slate-400" />
                        <span>Departure: <strong className="text-slate-800">{ticket.departureTime}</strong></span>
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      Total Fare
                    </span>
                    <span className="text-xl font-black text-rose-600">
                      ৳{ticket.totalFare.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Grid of Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Passenger */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <User size={12} /> Passenger Details
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{ticket.passengerName}</p>
                    <p className="text-slate-500 truncate">{ticket.passengerEmail}</p>
                    {ticket.passengerPhone && (
                      <p className="text-slate-500">{ticket.passengerPhone}</p>
                    )}
                  </div>

                  {/* Bus Details */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Bus size={12} /> Coach Assignment
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{ticket.busModel}</p>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                        {ticket.busTier} CLASS
                      </span>
                      <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {ticket.busReg}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reserved Seats Bar */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Armchair size={14} className="text-slate-500" />
                      Reserved Seats ({ticket.seats.length}):
                    </span>
                    {ticket.seats.map((seat) => (
                      <span
                        key={seat}
                        className="px-2.5 py-0.5 bg-[#172144] text-white font-black text-xs rounded-lg shadow-2xs"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>

                  {ticket.transactionId && (
                    <span className="text-[11px] font-mono text-slate-500 truncate max-w-[200px]" title={ticket.transactionId}>
                      Txn: {ticket.transactionId}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                  <a
                    href={`/api/ticket/download?pnr=${encodeURIComponent(ticket.ticketId)}`}
                    download={`Ticket-${ticket.ticketId.toUpperCase()}.pdf`}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#172144] hover:bg-[#202e5e] active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Download size={16} className="text-[#FCA311]" />
                    <span>Download Official PDF E-Ticket</span>
                  </a>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
                  >
                    <Printer size={16} />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

