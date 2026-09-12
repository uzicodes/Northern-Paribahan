"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// Step 1: Define strict Passenger Details validation schema with exact regex
const passengerSchema = z.object({
    fullName: z
        .string()
        .min(1, "Full name is required")
        .max(50, "Full name must not exceed 50 characters")
        .regex(/^[A-Za-z\s]+$/, "Full name must contain only alphabets and spaces (no numbers or special characters)")
        .refine((val) => val.trim().length > 0, "Full name cannot be blank spaces only"),
    mobileNumber: z
        .string()
        .min(1, "Mobile number is required")
        .regex(/^0\d{10}$/, "Mobile number must be exactly 11 digits and start with '0' (numbers only)"),
    email: z
        .string()
        .min(1, "Email address is required")
        .regex(
            /^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Email must contain exactly one '@', a valid domain (.com), and no special characters other than '.' and '@'"
        ),
    gender: z.enum(["Male", "Female", "Other"]),
    paymentMethod: z.enum(["bkash", "nagad", "sslcommerz"]),
});

type PassengerFormData = z.infer<typeof passengerSchema>;

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

    // Form & submission state
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        setFocus,
        formState: { errors },
    } = useForm<PassengerFormData>({
        resolver: zodResolver(passengerSchema),
        defaultValues: {
            fullName: "",
            mobileNumber: "",
            email: "",
            gender: "Male",
            paymentMethod: "bkash",
        },
        mode: "onChange",
        reValidateMode: "onChange",
    });

    const currentGender = watch("gender");
    const currentPaymentMethod = watch("paymentMethod");
    const formValues = watch();

    // Warning dialog modal state
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    const holdStorageKey = `northern_seat_hold_${busId}_${scheduleId}_${seatsParam}`;
    const formDraftKey = `northern_checkout_draft_${busId}_${scheduleId}`;

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

    const clearCheckoutSession = useCallback(() => {
        if (typeof window !== "undefined") {
            try {
                sessionStorage.removeItem(holdStorageKey);
                sessionStorage.removeItem(formDraftKey);
                sessionStorage.removeItem(`selected_seats_${busId}_${scheduleId}`);
            } catch {
                // Ignore storage errors
            }
        }
    }, [holdStorageKey, formDraftKey, busId, scheduleId]);

    const handleConfirmLeave = useCallback(() => {
        clearCheckoutSession();
        setShowLeaveModal(false);
        router.push(`/booking/${busId}?scheduleId=${scheduleId}`);
    }, [busId, scheduleId, router, clearCheckoutSession]);

    // 10-minute seat hold countdown timer (persisted across reloads via target timestamp)
    const [secondsLeft, setSecondsLeft] = useState(600);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const HOLD_DURATION_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
        let targetExpiresAt: number;

        try {
            const stored = sessionStorage.getItem(holdStorageKey);
            if (stored) {
                const parsed = parseInt(stored, 10);
                if (!isNaN(parsed) && parsed > 0) {
                    targetExpiresAt = parsed;
                } else {
                    targetExpiresAt = Date.now() + HOLD_DURATION_MS;
                    sessionStorage.setItem(holdStorageKey, targetExpiresAt.toString());
                }
            } else {
                targetExpiresAt = Date.now() + HOLD_DURATION_MS;
                sessionStorage.setItem(holdStorageKey, targetExpiresAt.toString());
            }
        } catch {
            targetExpiresAt = Date.now() + HOLD_DURATION_MS;
        }

        const updateTimer = () => {
            const remaining = Math.max(0, Math.floor((targetExpiresAt - Date.now()) / 1000));
            setSecondsLeft(remaining);
            if (remaining <= 0) {
                setIsExpired(true);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [holdStorageKey]);

    // Restore form draft on mount if available
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const savedDraft = sessionStorage.getItem(formDraftKey);
            if (savedDraft) {
                const draft = JSON.parse(savedDraft);
                if (draft.fullName) setValue("fullName", draft.fullName, { shouldValidate: false });
                if (draft.mobileNumber) setValue("mobileNumber", draft.mobileNumber, { shouldValidate: false });
                if (draft.email) setValue("email", draft.email, { shouldValidate: false });
                if (draft.gender) setValue("gender", draft.gender, { shouldValidate: false });
                if (draft.paymentMethod) setValue("paymentMethod", draft.paymentMethod, { shouldValidate: false });
            }
        } catch {
            // Ignore parse errors
        }
    }, [formDraftKey, setValue]);

    // Save form draft on change
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            sessionStorage.setItem(formDraftKey, JSON.stringify(formValues));
        } catch {
            // Ignore storage errors
        }
    }, [formValues, formDraftKey]);

    const formatTimer = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const onValidSubmit = (data: PassengerFormData) => {
        if (secondsLeft <= 0 || isExpired) {
            toast.error("Your seat hold has expired. Please re-select your seats.");
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            clearCheckoutSession();
            toast.success("Booking Order Placed Successfully!", {
                description: `Payment gateway initialized for ৳${grandTotal.toLocaleString()} via ${data.paymentMethod.toUpperCase()}`,
            });
        }, 800);
    };

    const onInvalidSubmit = (fieldErrors: typeof errors) => {
        const errorKeys = Object.keys(fieldErrors) as (keyof PassengerFormData)[];
        if (errorKeys.length > 0) {
            const firstKey = errorKeys[0];
            const msg = fieldErrors[firstKey]?.message;
            toast.error("Passenger Form Incomplete", {
                description: msg || "Please fill in all required fields accurately according to the validation rules.",
            });
            setFocus(firstKey);
        }
    };

    // Strict input filter: Full Name (alphabets and spaces only, max 50 chars)
    const handleFullNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            ["Backspace", "Tab", "Enter", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key) ||
            e.ctrlKey ||
            e.metaKey
        ) {
            return;
        }
        // Disallow numbers, symbols, and special characters
        if (!/^[a-zA-Z\s]$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = e.target.value.replace(/[^A-Za-z\s]/g, "").slice(0, 50);
        setValue("fullName", sanitized, { shouldValidate: true, shouldDirty: true });
    };

    // Strict input filter: Mobile Number (numbers only, exactly 11 digits, must start with 0)
    const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            ["Backspace", "Tab", "Enter", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key) ||
            e.ctrlKey ||
            e.metaKey
        ) {
            return;
        }
        // Disallow alphabets, spaces, +, -, and symbols
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
            return;
        }
        // First digit must strictly be '0'
        const target = e.currentTarget;
        if ((target.selectionStart === 0 || target.value.length === 0) && e.key !== "0") {
            e.preventDefault();
        }
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let digits = e.target.value.replace(/\D/g, "");
        if (digits.length > 0 && !digits.startsWith("0")) {
            digits = "0" + digits.replace(/^[^0]+/, "");
        }
        digits = digits.slice(0, 11);
        setValue("mobileNumber", digits, { shouldValidate: true, shouldDirty: true });
    };

    // Strict input filter: Email (no spaces, no +, #, !, only valid email characters and max one @)
    const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            ["Backspace", "Tab", "Enter", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key) ||
            e.ctrlKey ||
            e.metaKey
        ) {
            return;
        }
        // Disallow spaces and symbols like +, #, !, $, %, &, *, etc.
        if (!/^[a-zA-Z0-9.@\-_]$/.test(e.key)) {
            e.preventDefault();
            return;
        }
        // Only allow a single '@'
        if (e.key === "@" && e.currentTarget.value.includes("@")) {
            e.preventDefault();
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9.@\-_]/g, "");
        const parts = val.split("@");
        if (parts.length > 2) {
            val = parts[0] + "@" + parts.slice(1).join("").replace(/@/g, "");
        }
        setValue("email", val, { shouldValidate: true, shouldDirty: true });
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
                <div className={`rounded-2xl p-4 sm:p-4.5 shadow-sm text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 border transition-colors ${
                    secondsLeft <= 0
                        ? "bg-rose-50 border-rose-300"
                        : "bg-gradient-to-r from-amber-500 via-[#FCA311] to-amber-600 border-amber-400/40"
                }`}>
                    <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                            secondsLeft <= 0
                                ? "bg-rose-100 border-rose-300 text-rose-600"
                                : "bg-white/30 backdrop-blur-md border-white/40 text-slate-950"
                        }`}>
                            {secondsLeft <= 0 ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className={`text-sm sm:text-base font-black tracking-tight ${secondsLeft <= 0 ? "text-rose-900" : "text-slate-950"}`}>
                                {secondsLeft <= 0 ? "Seat Hold Reservation Expired" : "Seats Temporarily Reserved For You"}
                            </h2>
                            <p className={`text-xs font-medium ${secondsLeft <= 0 ? "text-rose-700" : "text-slate-900/80"}`}>
                                {secondsLeft <= 0 ? (
                                    <>
                                        Your hold on seats <span className="font-bold underline">{selectedSeats.join(", ")}</span> has expired.{" "}
                                        <button
                                            type="button"
                                            onClick={handleConfirmLeave}
                                            className="font-bold underline hover:text-rose-950 cursor-pointer ml-1"
                                        >
                                            Click here to re-select seats
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Seats <span className="font-bold underline">{selectedSeats.join(", ")}</span> are held temporarily. Complete checkout before the timer expires.
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className={`px-4 py-2 rounded-xl flex items-center gap-2 shadow-inner border shrink-0 ${
                        secondsLeft <= 0
                            ? "bg-rose-600 text-white border-rose-700"
                            : "bg-slate-950 text-white border-white/10"
                    }`}>
                        <span className={`text-xs uppercase font-bold tracking-wider ${secondsLeft <= 0 ? "text-rose-200" : "text-amber-400"}`}>
                            {secondsLeft <= 0 ? "Status" : "Time Left"}
                        </span>
                        <span className="font-mono text-lg font-black tracking-wider text-white">
                            {secondsLeft <= 0 ? "EXPIRED" : formatTimer(secondsLeft)}
                        </span>
                    </div>
                </div>

                {/* 2. Core Layout (Grid: Left 65%, Right 35%) */}
                <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
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
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Passenger Full Name *
                                        </label>
                                        <span className="text-[11px] font-mono text-slate-400 font-semibold">
                                            {watch("fullName")?.length || 0}/50
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <User size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            {...register("fullName")}
                                            value={watch("fullName") || ""}
                                            maxLength={50}
                                            onKeyDown={handleFullNameKeyDown}
                                            onChange={handleFullNameChange}
                                            placeholder="e.g. MD. Tariqul Islam"
                                            className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all shadow-2xs ${
                                                errors.fullName 
                                                    ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-400 focus:border-red-500" 
                                                    : "border-slate-300 focus:ring-2 focus:ring-[#172144] focus:border-transparent"
                                            }`}
                                        />
                                    </div>
                                    {errors.fullName ? (
                                        <span className="text-red-500 text-xs mt-1.5 font-semibold flex items-center gap-1">
                                            <AlertTriangle size={13} className="shrink-0" />
                                            <span>{errors.fullName.message}</span>
                                        </span>
                                    ) : (
                                        <span className="text-[10.5px] text-slate-400 mt-1 block">
                                            Max 50 characters, alphabets and spaces only.
                                        </span>
                                    )}
                                </div>

                                {/* Mobile & Email Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Mobile Number */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                Mobile Number (BD) *
                                            </label>
                                            <span className="text-[11px] font-mono text-slate-400 font-semibold">
                                                {watch("mobileNumber")?.length || 0}/11 digits
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Phone size={16} />
                                            </div>
                                            <input
                                                type="tel"
                                                {...register("mobileNumber")}
                                                value={watch("mobileNumber") || ""}
                                                maxLength={11}
                                                onKeyDown={handleMobileKeyDown}
                                                onChange={handleMobileChange}
                                                placeholder="017XXXXXXXX"
                                                className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all shadow-2xs ${
                                                    errors.mobileNumber 
                                                        ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-400 focus:border-red-500" 
                                                        : "border-slate-300 focus:ring-2 focus:ring-[#172144] focus:border-transparent"
                                                }`}
                                            />
                                        </div>
                                        {errors.mobileNumber ? (
                                            <span className="text-red-500 text-xs mt-1.5 font-semibold flex items-center gap-1">
                                                <AlertTriangle size={13} className="shrink-0" />
                                                <span>{errors.mobileNumber.message}</span>
                                            </span>
                                        ) : (
                                            <span className="text-[10.5px] text-slate-400 mt-1 block">
                                                Must be 11 digits starting with 0 (e.g. 017XXXXXXXX).
                                            </span>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                Email Address *
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Mail size={16} />
                                            </div>
                                            <input
                                                type="email"
                                                {...register("email")}
                                                value={watch("email") || ""}
                                                onKeyDown={handleEmailKeyDown}
                                                onChange={handleEmailChange}
                                                placeholder="passenger@example.com"
                                                className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all shadow-2xs ${
                                                    errors.email 
                                                        ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-400 focus:border-red-500" 
                                                        : "border-slate-300 focus:ring-2 focus:ring-[#172144] focus:border-transparent"
                                                }`}
                                            />
                                        </div>
                                        {errors.email ? (
                                            <span className="text-red-500 text-xs mt-1.5 font-semibold flex items-center gap-1">
                                                <AlertTriangle size={13} className="shrink-0" />
                                                <span>{errors.email.message}</span>
                                            </span>
                                        ) : (
                                            <span className="text-[10.5px] text-slate-400 mt-1 block">
                                                Digital PDF e-ticket receipt copy
                                            </span>
                                        )}
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
                                                        currentGender === gen
                                                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                                            : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                                                    }
                                                `}
                                            >
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value={gen}
                                                    checked={currentGender === gen}
                                                    onChange={() => setValue("gender", gen, { shouldValidate: true })}
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
                                                currentPaymentMethod === "bkash"
                                                    ? "bg-[#D12053]/5 border-[#D12053] ring-1 ring-[#D12053]"
                                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={currentPaymentMethod === "bkash"}
                                                onChange={() => setValue("paymentMethod", "bkash", { shouldValidate: true })}
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
                                        {currentPaymentMethod === "bkash" && (
                                            <CheckCircle2 size={18} className="text-[#D12053]" />
                                        )}
                                    </label>

                                    {/* Nagad */}
                                    <label
                                        className={`
                                            flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all select-none
                                            ${
                                                currentPaymentMethod === "nagad"
                                                    ? "bg-[#F7931E]/5 border-[#F7931E] ring-1 ring-[#F7931E]"
                                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={currentPaymentMethod === "nagad"}
                                                onChange={() => setValue("paymentMethod", "nagad", { shouldValidate: true })}
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
                                        {currentPaymentMethod === "nagad" && (
                                            <CheckCircle2 size={18} className="text-[#F7931E]" />
                                        )}
                                    </label>

                                    {/* SSLCommerz (Cards & NetBanking) */}
                                    <label
                                        className={`
                                            flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all select-none
                                            ${
                                                currentPaymentMethod === "sslcommerz"
                                                    ? "bg-blue-600/5 border-blue-600 ring-1 ring-blue-600"
                                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={currentPaymentMethod === "sslcommerz"}
                                                onChange={() => setValue("paymentMethod", "sslcommerz", { shouldValidate: true })}
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
                                        {currentPaymentMethod === "sslcommerz" && (
                                            <CheckCircle2 size={18} className="text-blue-600" />
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || selectedSeats.length === 0 || secondsLeft <= 0}
                                className="w-full py-4 px-4 bg-[#172144] hover:bg-[#101730] text-white font-black text-sm rounded-xl shadow-md shadow-[#172144]/25 transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <span>Connecting Gateway...</span>
                                ) : secondsLeft <= 0 ? (
                                    <span>Hold Expired — Re-select Seats</span>
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