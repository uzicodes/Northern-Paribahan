"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Check, X, ShieldAlert, Armchair, ChevronRight, Info } from "lucide-react";
import { SeatDisplay } from "@/types";

export type LayoutArchitecture = "PREMIUM_2_1" | "EXECUTIVE_2_2" | "STANDARD_2_2";

export interface SeatLayoutProps {
  busId?: string;
  scheduleId?: string;
  busModel?: string;
  tier?: string;
  fare?: number;
  bookedSeats?: string[];
  seats?: SeatDisplay[]; 
  onSeatSelect?: (seats: string[]) => void;
  onProceed?: (selectedSeats: string[], totalFare: number) => void;
  proceedUrl?: string;
}

interface LayoutConfig {
  architecture: LayoutArchitecture;
  label: string;
  badge: string;
  badgeColor: string;
  rowCount: number;
  leftCols: number;
  rightCols: number;
  totalSeats: number;
}

/**
 * seat layout architecture based on the bus model and tier.
 * 1. Premium 2+1 Layout (12 Rows, 36 Seats total) if model includes "Scania" or "MAN".
 * 2. Executive 2+2 Layout (9 Rows, 36 Seats total) if model includes "Mercedes".
 * 3. Standard 2+2 Layout (10 Rows, 40 Seats total) for all other models (Volvo, Hino, etc.).
 */
export function getLayoutConfig(busModel: string = "", tier?: string): LayoutConfig {
  const model = busModel.toLowerCase().trim();
  const normalizedTier = tier?.toUpperCase();

  // PREMIUM: MAN 24.460, Scania Legacy SR2, Mercedes-Benz OM 906
  if (
    normalizedTier === "PREMIUM" ||
    model.includes("man") ||
    model.includes("scania") ||
    model.includes("mercedes")
  ) {
    const isMercedes = model.includes("mercedes");
    return {
      architecture: isMercedes ? "EXECUTIVE_2_2" : "PREMIUM_2_1",
      label: isMercedes ? "Executive 2+2 Layout" : "Premium 2+1 Layout",
      badge: "Premium Class",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      rowCount: isMercedes ? 9 : 12,
      leftCols: 2,
      rightCols: isMercedes ? 2 : 1,
      totalSeats: 36,
    };
  }

  // BUSINESS: Volvo B9R, Hino RN8J, Hyundai Universe
  if (
    normalizedTier === "BUSINESS" ||
    model.includes("volvo") ||
    model.includes("rn8j") ||
    model.includes("hyundai")
  ) {
    return {
      architecture: "STANDARD_2_2",
      label: "Standard 2+2 Layout",
      badge: "Business Class",
      badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
      rowCount: 10,
      leftCols: 2,
      rightCols: 2,
      totalSeats: 40,
    };
  }

  // ECONOMY: Ashok Leyland Eagle, Eicher Pro, Hino AK1J
  return {
    architecture: "STANDARD_2_2",
    label: "Standard 2+2 Layout",
    badge: "Economy Class",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    rowCount: 10,
    leftCols: 2,
    rightCols: 2,
    totalSeats: 40,
  };
}

export default function SeatLayout({
  busId,
  scheduleId,
  busModel = "Volvo B9R",
  tier,
  fare = 0,
  bookedSeats: propBookedSeats,
  seats: legacySeats,
  onSeatSelect,
  onProceed,
  proceedUrl,
}: SeatLayoutProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Parse dynamic grid layout architecture from bus model and tier
  const config = useMemo(() => getLayoutConfig(busModel, tier), [busModel, tier]);

  // Combine propBookedSeats with any legacy seat objects or fallback mocks
  const bookedSet = useMemo(() => {
    const set = new Set<string>();
    if (propBookedSeats !== undefined) {
      propBookedSeats.forEach((s) => set.add(s.toUpperCase()));
    } else if (legacySeats && legacySeats.length > 0) {
      legacySeats.filter((s) => s.isBooked).forEach((s) => set.add(s.seatNumber.toUpperCase()));
    } else {
      // Default mock booked seats as requested in specifications
      set.add("A1");
      set.add("A2");
      set.add("C3");
    }
    return set;
  }, [propBookedSeats, legacySeats]);

  const storageKey = busId && scheduleId ? `selected_seats_${busId}_${scheduleId}` : null;
  const isInitialMount = useRef(true);

  // Restore saved seats from sessionStorage on mount (survives page reloads)
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;

    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out any seats that are now booked or invalid, capped at 4
          const validSeats = parsed.filter(
            (seat): seat is string => typeof seat === "string" && !bookedSet.has(seat.toUpperCase())
          ).slice(0, 4);

          if (validSeats.length > 0) {
            setSelectedSeats(validSeats);
            onSeatSelect?.(validSeats);
          } else {
            sessionStorage.removeItem(storageKey);
          }
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [storageKey, bookedSet, onSeatSelect]);

  // Persist selected seats to sessionStorage when selection changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!storageKey || typeof window === "undefined") return;

    try {
      if (selectedSeats.length > 0) {
        sessionStorage.setItem(storageKey, JSON.stringify(selectedSeats));
      } else {
        sessionStorage.removeItem(storageKey);
      }
    } catch {
      // Ignore storage errors
    }
  }, [selectedSeats, storageKey]);

  // Generate grid rows based on architecture
  const rows = useMemo(() => {
    const rowList = [];
    for (let r = 0; r < config.rowCount; r++) {
      const rowLetter = String.fromCharCode(65 + r); // A, B, C...

      // Left Column Seats
      const left = [];
      for (let c = 1; c <= config.leftCols; c++) {
        left.push(`${rowLetter}${c}`);
      }

      // Right Column Seats
      const right = [];
      for (let c = 1; c <= config.rightCols; c++) {
        right.push(`${rowLetter}${config.leftCols + c}`);
      }

      rowList.push({ rowLetter, left, right });
    }
    return rowList;
  }, [config]);

  // Handle seat selection with 4-seat limit enforcement
  const handleSeatClick = (seatNumber: string) => {
    if (bookedSet.has(seatNumber.toUpperCase())) {
      toast.error(`Seat ${seatNumber} is already booked`, {
        description: "Please select an available seat.",
      });
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      const updated = selectedSeats.filter((s) => s !== seatNumber);
      setSelectedSeats(updated);
      onSeatSelect?.(updated);
    } else {
      if (selectedSeats.length >= 4) {
        toast.error("Maximum 4 seats allowed per booking", {
          description: "Passengers may reserve up to 4 seats per transaction.",
          icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
        });
        return;
      }
      const updated = [...selectedSeats, seatNumber];
      setSelectedSeats(updated);
      onSeatSelect?.(updated);
    }
  };

  const totalFare = selectedSeats.length * fare;

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat to proceed.");
      return;
    }

    if (onProceed) {
      onProceed(selectedSeats, totalFare);
    } else if (proceedUrl) {
      const url = new URL(proceedUrl, window.location.origin);
      url.searchParams.set("seats", selectedSeats.join(","));
      window.location.href = url.toString();
    } else {
      toast.success(`Reserved seats: ${selectedSeats.join(", ")}`, {
        description: `Total fare: ৳ ${totalFare.toLocaleString()}`,
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 lg:p-8">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Select Your Seats
          </h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs sm:text-sm text-slate-500 font-medium">Coach Model:</span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm">{busModel}</span>
            {/* Total Seats Badge */}
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border bg-sky-50 text-sky-800 border-sky-200">
              {config.totalSeats} Seats
            </span>
            {/* Class Tier Badge */}
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${config.badgeColor}`}>
              {config.badge}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-6 rounded-t-lg rounded-b-md bg-white border-2 border-slate-300 relative shadow-2xs flex flex-col items-center">
              <div className="w-3.5 h-1.5 bg-slate-200 rounded-t-sm mt-0.5 border-b border-slate-300" />
              <div className="flex-1 w-full" />
            </div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-6 rounded-t-lg rounded-b-md bg-blue-600 border-2 border-blue-700 relative shadow-2xs flex flex-col items-center">
              <div className="w-3.5 h-1.5 bg-blue-500 rounded-t-sm mt-0.5 border-b border-blue-700" />
              <div className="flex-1 w-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <span className="text-blue-700 font-semibold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-6 rounded-t-lg rounded-b-md bg-slate-200 border border-slate-300 relative shadow-inner flex flex-col items-center opacity-75">
              <div className="w-3.5 h-1.5 bg-slate-300 rounded-t-sm mt-0.5 border-b border-slate-300" />
              <div className="flex-1 w-full flex items-center justify-center">
                <div className="w-2.5 h-[1.5px] bg-slate-400 rotate-45" />
              </div>
            </div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      {/* Main Bus Container & Interactive Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-6">
        
        {/* The Bus Body Visual Container */}
        <div className="lg:col-span-7 xl:col-span-8 flex justify-center">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-50 border-2 border-slate-300 rounded-[2.5rem] p-4 sm:p-6 shadow-inner relative">
            
            {/* Front of Bus Cabin: Windshield & Driver Cab */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b-2 border-dashed border-slate-300 text-slate-400">
              {/* Entry Door indicator */}
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md">
                <span>Entry</span>
                <span className="text-emerald-500">↑</span>
              </div>

              {/* Front Windshield bar */}
              <div className="h-1.5 w-16 bg-slate-300 rounded-full opacity-60" />

              {/* Steering Wheel / Driver */}
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-slate-500 drop-shadow-2xs"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20" />
                </svg>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 mt-0.5">Driver</span>
              </div>
            </div>

            {/* Seat Grid Rows with Aisle */}
            <div className="space-y-3 sm:space-y-3.5">
              {rows.map(({ rowLetter, left, right }) => (
                <div key={rowLetter} className="flex items-center justify-between gap-2 sm:gap-4">
                  {/* Left Column Seats */}
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    {left.map((seatNum) => {
                      const isBooked = bookedSet.has(seatNum);
                      const isSelected = selectedSeats.includes(seatNum);

                      return (
                        <button
                          key={seatNum}
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSeatClick(seatNum)}
                          aria-label={`Seat ${seatNum} ${isBooked ? "Booked" : isSelected ? "Selected" : "Available"}`}
                          className={`
                            w-11 h-13 sm:w-12 sm:h-14 rounded-t-xl rounded-b-lg font-bold flex flex-col items-center justify-between p-1 transition-all duration-150 relative select-none group
                            ${
                              isBooked
                                ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-75 shadow-inner"
                                : isSelected
                                ? "bg-blue-600 text-white border-2 border-blue-700 shadow-lg shadow-blue-600/35 scale-105 ring-2 ring-blue-300"
                                : "bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/40 shadow-sm active:scale-95"
                            }
                          `}
                        >
                          {/* Seat Headrest */}
                          <div
                            className={`w-7 sm:w-8 h-2.5 sm:h-3 rounded-t-md rounded-b-xs transition-colors shrink-0 ${
                              isBooked
                                ? "bg-slate-300 border-b border-slate-400/50"
                                : isSelected
                                ? "bg-blue-500/90 border-b border-blue-700"
                                : "bg-slate-100 group-hover:bg-blue-100/70 border-b border-slate-200 group-hover:border-blue-200"
                            }`}
                          />

                          {/* Seat Cushion Body with Number & Indicator */}
                          <div className="flex-1 w-full flex items-center justify-center relative px-0.5">
                            {/* Armrest Side Indents */}
                            <div
                              className={`absolute left-0 top-1 bottom-1 w-[2px] rounded-r-full ${
                                isBooked ? "bg-slate-300" : isSelected ? "bg-blue-400" : "bg-slate-200"
                              }`}
                            />
                            <div
                              className={`absolute right-0 top-1 bottom-1 w-[2px] rounded-l-full ${
                                isBooked ? "bg-slate-300" : isSelected ? "bg-blue-400" : "bg-slate-200"
                              }`}
                            />

                            <span className="text-[11px] sm:text-xs font-black tracking-tight leading-none">
                              {seatNum}
                            </span>
                            {isSelected && (
                              <Check className="w-3 h-3 absolute top-0.5 right-0.5 text-white drop-shadow-xs" />
                            )}
                          </div>

                          {/* Lower Seat Lip / Cushion edge */}
                          <div
                            className={`w-full h-1 rounded-b-md ${
                              isBooked
                                ? "bg-slate-300/80"
                                : isSelected
                                ? "bg-blue-700/80"
                                : "bg-slate-200/80 group-hover:bg-blue-200/60"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle Corridor with Row Indicator */}
                  <div className="flex-1 flex items-center justify-center py-1">
                    <span className="w-5 h-5 rounded-full bg-slate-200/80 text-slate-500 text-[10px] font-bold font-mono flex items-center justify-center select-none shadow-2xs">
                      {rowLetter}
                    </span>
                  </div>

                  {/* Right Column Seats */}
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    {right.map((seatNum) => {
                      const isBooked = bookedSet.has(seatNum);
                      const isSelected = selectedSeats.includes(seatNum);

                      return (
                        <button
                          key={seatNum}
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSeatClick(seatNum)}
                          aria-label={`Seat ${seatNum} ${isBooked ? "Booked" : isSelected ? "Selected" : "Available"}`}
                          className={`
                            w-11 h-13 sm:w-12 sm:h-14 rounded-t-xl rounded-b-lg font-bold flex flex-col items-center justify-between p-1 transition-all duration-150 relative select-none group
                            ${
                              isBooked
                                ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-75 shadow-inner"
                                : isSelected
                                ? "bg-blue-600 text-white border-2 border-blue-700 shadow-lg shadow-blue-600/35 scale-105 ring-2 ring-blue-300"
                                : "bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/40 shadow-sm active:scale-95"
                            }
                          `}
                        >
                          {/* Seat Headrest */}
                          <div
                            className={`w-7 sm:w-8 h-2.5 sm:h-3 rounded-t-md rounded-b-xs transition-colors shrink-0 ${
                              isBooked
                                ? "bg-slate-300 border-b border-slate-400/50"
                                : isSelected
                                ? "bg-blue-500/90 border-b border-blue-700"
                                : "bg-slate-100 group-hover:bg-blue-100/70 border-b border-slate-200 group-hover:border-blue-200"
                            }`}
                          />

                          {/* Seat Cushion Body with Number & Indicator */}
                          <div className="flex-1 w-full flex items-center justify-center relative px-0.5">
                            {/* Armrest Side Indents */}
                            <div
                              className={`absolute left-0 top-1 bottom-1 w-[2px] rounded-r-full ${
                                isBooked ? "bg-slate-300" : isSelected ? "bg-blue-400" : "bg-slate-200"
                              }`}
                            />
                            <div
                              className={`absolute right-0 top-1 bottom-1 w-[2px] rounded-l-full ${
                                isBooked ? "bg-slate-300" : isSelected ? "bg-blue-400" : "bg-slate-200"
                              }`}
                            />

                            <span className="text-[11px] sm:text-xs font-black tracking-tight leading-none">
                              {seatNum}
                            </span>
                            {isSelected && (
                              <Check className="w-3 h-3 absolute top-0.5 right-0.5 text-white drop-shadow-xs" />
                            )}
                          </div>

                          {/* Lower Seat Lip / Cushion edge */}
                          <div
                            className={`w-full h-1 rounded-b-md ${
                              isBooked
                                ? "bg-slate-300/80"
                                : isSelected
                                ? "bg-blue-700/80"
                                : "bg-slate-200/80 group-hover:bg-blue-200/60"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Rear of the Bus visual indicator */}
            <div className="mt-6 pt-3 border-t-2 border-dashed border-slate-300 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Rear of Coach
              </span>
            </div>
          </div>
        </div>

        {/* Live Booking Summary Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Armchair className="w-5 h-5 text-blue-600" />
                <span>Booking Summary</span>
              </h4>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {selectedSeats.length}/4 max
              </span>
            </div>

            {/* Selected Seats Chips */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
                Selected Seats
              </p>
              {selectedSeats.length === 0 ? (
                <div className="p-3.5 bg-white border border-dashed border-slate-200 rounded-xl text-center">
                  <p className="text-xs text-slate-400">
                    Click any available seat on the layout to select (up to 4 seats).
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="inline-flex items-center justify-between px-2 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-xs font-bold shadow-2xs min-w-0"
                    >
                      <span className="truncate">{seat}</span>
                      <button
                        type="button"
                        onClick={() => handleSeatClick(seat)}
                        className="hover:text-rose-600 transition-colors ml-1 shrink-0 p-0.5"
                        aria-label={`Remove seat ${seat}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-slate-200 pt-4 space-y-2.5">
              <div className="flex justify-between text-xs sm:text-sm text-slate-600">
                <span>Fare per Seat</span>
                <span className="font-bold text-rose-600">৳ {fare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-slate-600">
                <span>Selected Seats</span>
                <span className="font-semibold text-slate-900">× {selectedSeats.length}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm sm:text-base">Total Fare</span>
                <span className="text-xl sm:text-2xl font-black text-rose-600">
                  ৳ {totalFare.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Notice info */}
            <div className="flex items-start gap-2 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-800 leading-relaxed">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Tickets are confirmed instantly with zero platform reservation surcharge.</span>
            </div>

            {/* Action Confirmation Button */}
            <button
              type="button"
              disabled={selectedSeats.length === 0}
              onClick={handleConfirm}
              className={`
                w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-md transition-all duration-150 flex items-center justify-center gap-2
                ${
                  selectedSeats.length === 0
                    ? "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none"
                    : "bg-[#172144] hover:bg-[#101730] active:scale-[0.99] shadow-blue-900/20"
                }
              `}
            >
              <span>
                {selectedSeats.length === 0
                  ? "Select Seats to Proceed"
                  : `Confirm & Proceed (৳ ${totalFare.toLocaleString()})`}
              </span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
