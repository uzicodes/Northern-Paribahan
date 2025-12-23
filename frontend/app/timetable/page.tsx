"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Bus, Armchair, MapPin, ArrowLeftRight } from "lucide-react";

// --- Types ---
interface BusRoute {
  id: number;
  busName: string;
  type: "AC" | "Non-AC";
  capacity: string;
  departureTime: string;
  duration: string;
  origin: string;
  destination: string;
  price: number;
  direction: "outbound" | "inbound"; // New field to categorize trips
}

// --- expanded Data (Outbound & Return) ---
const scheduleData: BusRoute[] = [
  // --- OUTBOUND (From Dinajpur) ---
  { id: 1, busName: "Mercedes-Benz Turismo", type: "AC", capacity: "45-55", departureTime: "08:00 AM", duration: "8h", origin: "Dinajpur", destination: "Dhaka", price: 1200, direction: "outbound" },
  { id: 2, busName: "Scania Touring", type: "AC", capacity: "48-52", departureTime: "10:00 AM", duration: "7h", origin: "Dinajpur", destination: "Khulna", price: 1100, direction: "outbound" },
  { id: 3, busName: "MAN Lion's Coach", type: "AC", capacity: "50-55", departureTime: "12:00 PM", duration: "9h", origin: "Dinajpur", destination: "Chittagong", price: 1500, direction: "outbound" },
  { id: 4, busName: "Volvo 9700", type: "AC", capacity: "45-50", departureTime: "02:00 PM", duration: "6h", origin: "Dinajpur", destination: "Sylhet", price: 1300, direction: "outbound" },
  { id: 5, busName: "Hino RK8", type: "Non-AC", capacity: "40-45", departureTime: "04:00 PM", duration: "4h", origin: "Dinajpur", destination: "Rajshahi", price: 600, direction: "outbound" },
  { id: 6, busName: "Ashok Leyland Viking", type: "Non-AC", capacity: "42-48", departureTime: "06:00 PM", duration: "3h", origin: "Dinajpur", destination: "Bogura", price: 400, direction: "outbound" },
  { id: 7, busName: "Mercedes-Benz Turismo", type: "AC", capacity: "45-55", departureTime: "08:00 PM", duration: "8h", origin: "Dinajpur", destination: "Barisal", price: 1250, direction: "outbound" },
  { id: 8, busName: "Scania Touring", type: "AC", capacity: "48-52", departureTime: "10:00 PM", duration: "10h", origin: "Dinajpur", destination: "Cox's Bazar", price: 1800, direction: "outbound" },

  // --- INBOUND (Return to Dinajpur) ---
  { id: 9, busName: "Mercedes-Benz Turismo", type: "AC", capacity: "45-55", departureTime: "08:00 AM", duration: "8h", origin: "Dhaka", destination: "Dinajpur", price: 1200, direction: "inbound" },
  { id: 10, busName: "Scania Touring", type: "AC", capacity: "48-52", departureTime: "10:00 AM", duration: "7h", origin: "Khulna", destination: "Dinajpur", price: 1100, direction: "inbound" },
  { id: 11, busName: "MAN Lion's Coach", type: "AC", capacity: "50-55", departureTime: "12:00 PM", duration: "9h", origin: "Chittagong", destination: "Dinajpur", price: 1500, direction: "inbound" },
  { id: 12, busName: "Volvo 9700", type: "AC", capacity: "45-50", departureTime: "02:00 PM", duration: "6h", origin: "Sylhet", destination: "Dinajpur", price: 1300, direction: "inbound" },
  { id: 13, busName: "Hino RK8", type: "Non-AC", capacity: "40-45", departureTime: "04:00 PM", duration: "4h", origin: "Rajshahi", destination: "Dinajpur", price: 600, direction: "inbound" },
  { id: 14, busName: "Ashok Leyland Viking", type: "Non-AC", capacity: "42-48", departureTime: "06:00 PM", duration: "3h", origin: "Bogura", destination: "Dinajpur", price: 400, direction: "inbound" },
  { id: 15, busName: "Mercedes-Benz Turismo", type: "AC", capacity: "45-55", departureTime: "08:00 PM", duration: "8h", origin: "Barisal", destination: "Dinajpur", price: 1250, direction: "inbound" },
  { id: 16, busName: "Scania Touring", type: "AC", capacity: "48-52", departureTime: "10:00 PM", duration: "10h", origin: "Cox's Bazar", destination: "Dinajpur", price: 1800, direction: "inbound" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BusSchedulePage() {
  const [activeDay, setActiveDay] = useState("Mon");
  const [direction, setDirection] = useState<"outbound" | "inbound">("outbound");

  // Filter data based on selected direction
  const filteredData = scheduleData.filter((item) => item.direction === direction);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 font-sans" style={{ backgroundColor: '#BBE092' }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header Area */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Bus Schedule</h2>
          <p className="text-sm text-slate-500">Find the perfect time for your journey.</p>
        </div>

        {/* Controls Container (Stacked on mobile, Row on Desktop) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sticky top-0 py-2 z-10" style={{ backgroundColor: '#BBE092' }}>
          
          {/* Direction Toggle (The new feature) */}
          <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex items-center">
             <button
                onClick={() => setDirection("outbound")}
                className={`flex-1 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                   direction === "outbound" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                }`}
             >
                <MapPin className="w-4 h-3" /> From Dinajpur
             </button>
             <button
                onClick={() => setDirection("inbound")}
                className={`flex-1 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                   direction === "inbound" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                }`}
             >
                <ArrowLeftRight className="w-4 h-4" /> To Dinajpur
             </button>
          </div>

          {/* Day Selector */}
          <div className="flex bg-white p-1 rounded-lg shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  activeDay === day ? "text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {activeDay === day && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-emerald-600 rounded-md shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{day}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dense List */}
        <div className="space-y-3">
            <AnimatePresence mode="wait">
            {filteredData.map((route, index) => (
              <motion.div
                key={`${direction}-${activeDay}-${route.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  
                  {/* Time Block */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 min-w-[100px]">
                    <div className="text-xl font-bold text-slate-800 tracking-tight">
                      {route.departureTime}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{route.duration} trip</span>
                    </div>
                  </div>

                  {/* Route & Bus Info */}
                  <div className="flex-1">
                    {/* Route Line - Dynamic Colors based on direction */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-bold ${direction === 'outbound' ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {route.origin}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                      <span className={`font-bold ${direction === 'inbound' ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {route.destination}
                      </span>
                    </div>
                    
                    {/* Bus Details */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 font-medium border border-slate-100">
                          <Bus className="w-3 h-3" /> {route.busName}
                       </span>
                       <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md border ${route.type === 'AC' ? 'bg-cyan-50 border-cyan-100 text-cyan-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                          {route.type}
                       </span>
                       <span className="text-slate-400 flex items-center gap-1">
                          <Armchair className="w-3 h-3" /> {route.capacity}
                       </span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 border-slate-50 pt-3 sm:pt-0 mt-2 sm:mt-0">
                     <div className="text-right">
                        <span className="block text-lg font-bold text-emerald-600">৳{route.price}</span>
                     </div>
                     <button className="px-5 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wide rounded-lg transition-colors shadow-sm">
                        Select
                     </button>
                  </div>

                </div>
              </motion.div>
            ))}
            </AnimatePresence>
            
            {filteredData.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                    No buses available for this selection.
                </div>
            )}
        </div>

      </div>
    </div>
  );
}