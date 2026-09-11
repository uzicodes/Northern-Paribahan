"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
    Clock, 
    ArrowLeft, 
    ShieldCheck, 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    CreditCard, 
    CheckCircle2, 
    ChevronRight,
    Calendar,
    AlertTriangle,
    X
} from "lucide-react";
import { toast } from "sonner";
import GlobalLoader from "@/components/GlobalLoader";

function CheckoutContent() {
    const searchParams = useSearchParams();

    // Query parameters passed from the booking page
    const busId = searchParams.get("busId") || "bus-1";
    const scheduleId = searchParams.get("scheduleId") || "sch-1";
    const origin = searchParams.get("origin") || "Dhaka";
    const destination = searchParams.get("destination") || "Rajshahi";
    const busModel = searchParams.get("busModel") || "Volvo B9R";
    const tier = searchParams.get("tier") || "BUSINESS";
    const regNo = searchParams.get("regNo") || "DHK-METRO-04-5016";
    const departureTime = searchParams.get("time") || "08:00 AM";
    const arrivalTime = searchParams.get("arrival") || "02:00 PM";
    const travelDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const seatsParam = searchParams.get("seats") || "A1,A2";
    const fareParam = searchParams.get("fare") || "1020";

    const selectedSeats = seatsParam.split(",").filter(Boolean);
    const seatFare = parseInt(fareParam, 10) || 1020;
    const processingFee = 50;
    const baseTotal = selectedSeats.length * seatFare;
    const grandTotal = baseTotal + processingFee;

    const boardingPoint = `Northern Paribahan ${origin} Counter`;
    const droppingPoint = `Northern Paribahan ${destination} Counter`;

    const router = useRouter();

    // Form states
    const [fullName, setFullName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
    const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "sslcommerz">("bkash");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Warning dialog modal state
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    // Intercept browser back navigation and window unload
    useEffect(() => {
        window.history.pushState({ checkoutGuard: true }, "", window.location.href);

        const handlePopState = () => {
            setShowLeaveModal(true);
            window.history.pushState({ checkoutGuard: true }, "", window.location.href);
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
            return "";
        };

        window.addEventListener("popstate", handlePopState);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const handleConfirmLeave = useCallback(() => {
        setShowLeaveModal(false);
        router.push(`/booking/${busId}?scheduleId=${scheduleId}`);
    }, [busId, scheduleId, router]);

    // 10-minute temporary seat hold countdown timer
    const [secondsLeft, setSecondsLeft] = useState(600); // 10:00 minutes

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const interval = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [secondsLeft]);

    const formatTimer = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast.error("Please enter the passenger's full name.");
            return;
        }

        // Validate BD mobile phone numbers
        const cleanPhone = mobileNumber.replace(/[\s-]/g, "");
        if (!/^(\+?8801|01)[3-9]\d{8}$/.test(cleanPhone)) {
            toast.error("Please provide a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).");
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Booking Order Placed Successfully!", {
                description: `Payment gateway initialized for ৳${grandTotal.toLocaleString()} via ${paymentMethod.toUpperCase()}`,
            });
        }, 800);
    };

    const formattedDate = new Date(travelDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#C9CBA3" }}>
            <div className="max-w-6xl mx-auto space-y-5">
                
                {/* Back Button & Action */}
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setShowLeaveModal(true)}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-black bg-white/80 hover:bg-white border border-black/10 px-3.5 py-2 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        <span>Modify Seat Selection</span>
                    </button>
                </div>

                {/* 1. Top Banner (Seat Hold Timer) */}
                <div className="bg-gradient-to-r from-amber-500 via-[#FCA311] to-amber-600 rounded-2xl p-4 sm:p-4.5 shadow-sm text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 border border-amber-400/40">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-10 h-10 rounded-xl bg-white/30 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/40">
                            <Clock className="w-5 h-5 text-slate-950" />
                        </div>
                        <div>
                            <h2 className="text-sm sm:text-base font-black tracking-tight">
                                Seats Temporarily Reserved For You
                            </h2>
                            <p className="text-xs font-medium text-slate-900/80">
                                Seats <span className="font-bold underline">{selectedSeats.join(", ")}</span> are held temporarily. Complete checkout before the timer expires.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-950 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-inner border border-white/10 shrink-0">
                        <span className="text-xs uppercase font-bold tracking-wider text-amber-400">Time Left</span>
                        <span className="font-mono text-lg font-black tracking-wider text-white">
                            {formatTimer(secondsLeft)}
                        </span>
                    </div>
                </div>

                {/* 2. Core Layout (Grid: Left 65%, Right 35%) */}
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Forms & Details (8 Cols) */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-5">
                        
                        {/* Section 1: Boarding & Dropping Points */}
                        <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-black/5 space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                            Boarding & Dropping Points
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Official designated bus terminal counters
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                                {/* Boarding Point Card */}
                                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 shadow-2xs">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                                        <MapPin size={14} className="text-emerald-600" />
                                        <span>Boarding Counter</span>
                                    </div>
                                    <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                                        Northern Paribahan {origin} Counter
                                    </p>
                                    <span className="text-[11px] text-slate-500 mt-1 block font-medium">
                                        Reporting time: 15 mins prior to {departureTime}
                                    </span>
                                </div>

                                {/* Dropping Point Card */}
                                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 shadow-2xs">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1.5">
                                        <MapPin size={14} className="text-amber-600" />
                                        <span>Dropping Counter</span>
                                    </div>
                                    <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                                        Northern Paribahan {destination} Counter
                                    </p>
                                    <span className="text-[11px] text-slate-500 mt-1 block font-medium">
                                        Estimated arrival at {arrivalTime}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Passenger Information */}
                        <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-black/5 space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                            Primary Passenger Details
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Ticket confirmation SMS & invoice will be sent to these details
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Passenger Full Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <User size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="e.g. MD. Tariqul Islam"
                                            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#172144] focus:border-transparent transition-all shadow-2xs"
                                        />
                                    </div>
                                </div>

                                {/* Mobile & Email Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Mobile Number */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                            Mobile Number (BD) *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Phone size={16} />
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                value={mobileNumber}
                                                onChange={(e) => setMobileNumber(e.target.value)}
                                                placeholder="017XXXXXXXX"
                                                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#172144] focus:border-transparent transition-all shadow-2xs"
                                            />
                                        </div>
                                        <span className="text-[10.5px] text-slate-400 mt-1 block">
                                            via Contacting Passenger.
                                        </span>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                            Email Address (Optional)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Mail size={16} />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="passenger@example.com"
                                                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#172144] focus:border-transparent transition-all shadow-2xs"
                                            />
                                        </div>
                                        <span className="text-[10.5px] text-slate-400 mt-1 block">
                                            Digital PDF e-ticket receipt copy
                                        </span>
                                    </div>
                                </div>

                                {/* Gender Radio Group */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                        Passenger Gender *
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(["Male", "Female", "Other"] as const).map((gen) => (
                                            <label
                                                key={gen}
                                                className={`
                                                    flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-all select-none
                                                    ${
                                                        gender === gen
                                                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                                            : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                                                    }
                                                `}
                                            >
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value={gen}
                                                    checked={gender === gen}
                                                    onChange={() => setGender(gen)}
                                                    className="sr-only"
                                                />
                                                <span>{gen}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sticky Order Summary & Payment Gateway (4-5 Cols) */}
                    <div className="lg:col-span-5 xl:col-span-4 sticky top-4 space-y-4">
                        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-black/5 space-y-5">
                            
                            {/* Trip Details Card Header */}
                            <div className="border-b border-slate-100 pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                        {busModel}
                                    </span>
                                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                        {regNo}
                                    </span>
                                </div>

                                {/* Route Header with Custom Arrow */}
                                <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center justify-between">
                                    <span className="text-emerald-800">{origin}</span>
                                    <div className="flex items-center gap-1 px-2">
                                        <div className="w-4 h-[2px] bg-slate-300" />
                                        <ChevronRight size={16} className="text-[#FCA311]" />
                                        <div className="w-4 h-[2px] bg-slate-300" />
                                    </div>
                                    <span className="text-amber-800">{destination}</span>
                                </h4>

                                <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                                    <Calendar size={13} className="text-slate-400" />
                                    <span>{formattedDate} • Departure at <strong className="text-slate-800">{departureTime}</strong></span>
                                </p>
                            </div>

                            {/* Selected Seats Badges */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Selected Seats ({selectedSeats.length})
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSeats.map((seat) => (
                                        <span
                                            key={seat}
                                            className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-2xs"
                                        >
                                            Seat {seat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Fare Breakdown */}
                            <div className="border-t border-slate-100 pt-4 space-y-2.5">
                                <div className="flex justify-between text-xs sm:text-sm text-slate-600">
                                    <span>Base Fare ({selectedSeats.length} × ৳{seatFare.toLocaleString()})</span>
                                    <span className="font-semibold text-slate-900">৳{baseTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm text-slate-600">
                                    <span>Service & Platform Fee</span>
                                    <span className="font-semibold text-slate-900">৳{processingFee.toLocaleString()}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                                    <span className="font-black text-slate-900 text-base">Total Payable</span>
                                    <span className="text-2xl font-black text-rose-600">
                                        ৳{grandTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="border-t border-slate-100 pt-4">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                                    Select Payment Method
                                </label>
                                <div className="space-y-2">
                                    {/* bKash */}
                                    <label
                                        className={`
                                            flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all select-none
                                            ${
                                                paymentMethod === "bkash"
                                                    ? "bg-[#D12053]/5 border-[#D12053] ring-1 ring-[#D12053]"
                                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={paymentMethod === "bkash"}
                                                onChange={() => setPaymentMethod("bkash")}
                                                className="sr-only"
                                            />
                                            <div className="w-8 h-8 rounded-lg bg-[#D12053] text-white flex items-center justify-center font-bold text-xs">
                                                bK
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">bKash Payment</p>
                                                <p className="text-[10px] text-slate-500">Fast instant digital wallet</p>
                                            </div>
                                        </div>
                                        {paymentMethod === "bkash" && (
                                            <CheckCircle2 size={18} className="text-[#D12053]" />
                                        )}
                                    </label>

                                    {/* Nagad */}
                                    <label
                                        className={`
                                            flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all select-none
                                            ${
                                                paymentMethod === "nagad"
                                                    ? "bg-[#F7931E]/5 border-[#F7931E] ring-1 ring-[#F7931E]"
                                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={paymentMethod === "nagad"}
                                                onChange={() => setPaymentMethod("nagad")}
                                                className="sr-only"
                                            />
                                            <div className="w-8 h-8 rounded-lg bg-[#F7931E] text-white flex items-center justify-center font-bold text-xs">
                                                NG
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">Nagad Wallet</p>
                                                <p className="text-[10px] text-slate-500">Instant MFS transaction</p>
                                            </div>
                                        </div>
                                        {paymentMethod === "nagad" && (
                                            <CheckCircle2 size={18} className="text-[#F7931E]" />
                                        )}
                                    </label>

                                    {/* SSLCommerz (Cards & NetBanking) */}
                                    <label
                                        className={`
                                            flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all select-none
                                            ${
                                                paymentMethod === "sslcommerz"
                                                    ? "bg-blue-600/5 border-blue-600 ring-1 ring-blue-600"
                                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={paymentMethod === "sslcommerz"}
                                                onChange={() => setPaymentMethod("sslcommerz")}
                                                className="sr-only"
                                            />
                                            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                                                <CreditCard size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">Cards & Internet Banking</p>
                                                <p className="text-[10px] text-slate-500">Visa, Mastercard, DBBL Nexus</p>
                                            </div>
                                        </div>
                                        {paymentMethod === "sslcommerz" && (
                                            <CheckCircle2 size={18} className="text-blue-600" />
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || selectedSeats.length === 0}
                                className="w-full py-4 px-4 bg-[#172144] hover:bg-[#101730] text-white font-black text-sm rounded-xl shadow-md shadow-[#172144]/25 transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span>Connecting Gateway...</span>
                                ) : (
                                    <>
                                        <span>Confirm & Pay ৳{grandTotal.toLocaleString()}</span>
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>

                            <p className="text-[11px] text-center text-slate-400">
                                By confirming, you agree to Northern Paribahan's ticketing & baggage policies.
                            </p>
                        </div>
                    </div>

                </form>

            </div>

            {/* Warning Dialog Box: Released Seats Confirmation Modal */}
            {showLeaveModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="warning-modal-title"
                >
                    <div 
                        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative animate-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close icon */}
                        <button
                            type="button"
                            onClick={() => setShowLeaveModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Stay on checkout"
                        >
                            <X size={20} />
                        </button>

                        {/* Alert Icon Badge */}
                        <div className="w-14 h-14 rounded-2xl bg-amber-100/90 border border-amber-300 flex items-center justify-center text-amber-600 mb-4 shadow-xs">
                            <AlertTriangle size={30} className="stroke-[2.2]" />
                        </div>

                        {/* Title */}
                        <h3 id="warning-modal-title" className="text-xl font-black text-slate-900 tracking-tight">
                            Release Selected Seats?
                        </h3>

                        {/* Message Body */}
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            Your seats <span className="font-bold text-slate-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">{selectedSeats.join(", ")}</span> are currently held under your reservation.
                        </p>

                        <div className="mt-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-left flex items-start gap-2.5">
                            <span className="text-base leading-none mt-0.5">⚠️</span>
                            <p className="text-xs text-rose-700 font-semibold leading-relaxed">
                                Going back or modifying selection will immediately <span className="underline font-bold">release your seats</span>. They will become available for other passengers to book.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-2.5 w-full mt-6">
                            <button
                                type="button"
                                onClick={() => setShowLeaveModal(false)}
                                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer active:scale-[0.99]"
                            >
                                Stay on Checkout
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmLeave}
                                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/25 transition-all active:scale-[0.98] cursor-pointer"
                            >
                                Leave & Release Seats
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen py-16 flex items-center justify-center" style={{ backgroundColor: "#C9CBA3" }}>
                <GlobalLoader />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}