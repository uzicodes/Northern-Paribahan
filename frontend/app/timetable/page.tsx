"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Bus, Armchair, MapPin, Search, AlertCircle, Hash, Calendar } from "lucide-react";
import HeroDatePicker from "../../components/HeroDatePicker";

// --- Constants ---
const CITIES = [
  "Dinajpur",
  "Dhaka",
  "Bogura",
  "Sylhet",
  "Khulna",
  "Barisal",
  "Rajshahi",
  "Chittagong",
  "Cox's Bazar",
];

const INVALID_ROUTES = [
  { from: "Khulna", to: "Barisal" },
  { from: "Barisal", to: "Khulna" },
  { from: "Chittagong", to: "Cox's Bazar" },
  { from: "Cox's Bazar", to: "Chittagong" },
];

// --- FLEET DATA (Grouped by Model for Rotation Logic) ---
const FLEET_MODELS = [
  { 
    name: "Mercedes-Benz Turismo", 
    type: "AC", 
    capacity: "45-55", 
    basePrice: 1200,
    units: ["NP-101", "NP-102", "NP-103"] 
  },
  { 
    name: "Scania Touring", 
    type: "AC", 
    capacity: "48-52", 
    basePrice: 1100,
    units: ["NP-201", "NP-202", "NP-203"] 
  },
  { 
    name: "MAN Lion's Coach", 
    type: "AC", 
    capacity: "50-55", 
    basePrice: 1500,
    units: ["NP-301", "NP-302", "NP-303"] 
  },
  { 
    name: "Volvo 9700", 
    type: "AC", 
    capacity: "45-50", 
    basePrice: 1300,
    units: ["NP-401", "NP-402", "NP-403"] 
  },
  { 
    name: "Hino RK8", 
    type: "Non-AC", 
    capacity: "40-45", 
    basePrice: 600,
    units: ["NP-501", "NP-502", "NP-503"] 
  },
  { 
    name: "Ashok Leyland Viking", 
    type: "Non-AC", 
    capacity: "42-48", 
    basePrice: 400,
    units: ["NP-601", "NP-602", "NP-603"] 
  },
];

// --- Types ---
interface BusRoute {
  id: string;
  busNumber: string;
  busName: string;
  type: "AC" | "Non-AC";
  capacity: string;
  departureTime: string;
  duration: string;
  origin: string;
  destination: string;
  price: number;
}

function TimetableContent() {
  const searchParams = useSearchParams();
  const [origin, setOrigin] = useState(searchParams.get('from') || "Dinajpur");
  const [destination, setDestination] = useState(searchParams.get('to') || "Dhaka");
  // Default to today's date
  const [date, setDate] = useState<Date>(() => {
    const dateParam = searchParams.get('date');
    return dateParam ? new Date(dateParam) : new Date();
  });
  const [schedule, setSchedule] = useState<BusRoute[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setError(null);
    setLoading(true);
    setSchedule([]);

    if (origin === destination) {
      setError("Origin and Destination cannot be the same.");
      setLoading(false);
      return;
    }

    const isRestricted = INVALID_ROUTES.some(
      (route) => route.from === origin && route.to === destination
    );

    if (isRestricted) {
      setError(`Travel between ${origin} and ${destination} is currently unavailable (Too close/Restricted).`);
      setLoading(false);
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      const generatedSchedule = generateDailySchedule(origin, destination, date.toISOString().split('T')[0]);
      setSchedule(generatedSchedule);
      setLoading(false);
    }, 500);
  };

  const generateDailySchedule = (from: string, to: string, selectedDate: string): BusRoute[] => {
    // Convert Date to a numeric "Day Index"
    const dateObj = new Date(selectedDate);
    const dayIndex = Math.floor(dateObj.getTime() / (1000 * 60 * 60 * 24));

    const baseDuration = Math.floor(Math.random() * (12 - 4) + 4); // Simulated duration

    const timeSlots = [
      "08:00 AM", "09:00 AM", "11:00 AM", "01:00 PM", 
      "03:00 PM", "05:00 PM", "07:00 PM", "09:00 PM", "11:00 PM"
    ];

    return timeSlots.map((time, slotIndex) => {
      // Bus Model based on Time Slot 
      const modelIndex = slotIndex % FLEET_MODELS.length;
      const model = FLEET_MODELS[modelIndex];

      // BUS ROTATION LOGIC:
      const unitIndex = (dayIndex + slotIndex) % model.units.length;
      const assignedBusNumber = model.units[unitIndex];

      const finalPrice = model.type === 'AC' ? model.basePrice + 400 : model.basePrice;

      return {
        id: `${from}-${to}-${selectedDate}-${slotIndex}`,
        busNumber: assignedBusNumber,
        busName: model.name,
        type: model.type as "AC" | "Non-AC",
        capacity: model.capacity,
        departureTime: time,
        duration: `${baseDuration}h`,
        origin: from,
        destination: to,
        price: finalPrice,
      };
    });
  };

  useEffect(() => {
    handleSearch();
  }, []); // Initial load

  return (
    <div className="min-h-screen bg-[#BBE092] py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Find Your Bus</h2>
          <p className="text-slate-800 font-medium">Search routes across all major districts.</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative z-10">
            
            {/* Origin */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                <select 
                  value={origin} 
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none hover:bg-slate-100"
                >
                  {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>

            <div className="hidden md:flex md:col-span-1 justify-center pb-3">
              <ArrowRight className="w-5 h-5 text-slate-300" />
            </div>

            {/* Destination */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                <select 
                   value={destination} 
                   onChange={(e) => setDestination(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none hover:bg-slate-100"
                >
                  {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>

            {/* Date Picker */}
            <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date</label>
                <HeroDatePicker selectedDate={date} onDateChange={setDate}>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            readOnly
                            value={date.toLocaleDateString('en-GB')}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-slate-100 cursor-pointer"
                        />
                    </div>
                </HeroDatePicker>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <button 
                onClick={handleSearch}
                className="w-full h-[50px] flex items-center justify-center bg-slate-900 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-md active:scale-95"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
             <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-sm animate-pulse font-medium">Checking availability...</p>
             </div>
        )}

        {/* List */}
        {!loading && !error && (
            <div className="space-y-3">
                <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-sm font-bold text-slate-800 opacity-70">Available Buses ({schedule.length})</span>
                    <span className="text-sm font-bold text-slate-900">
                        {origin} <span className="opacity-50">→</span> <span className="text-red-700">{destination}</span>
                    </span>
                </div>

                <AnimatePresence mode="popLayout">
                {schedule.map((route, index) => (
                <motion.div
                    key={route.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 relative overflow-hidden"
                >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    
                    {/* Time */}
                    <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 min-w-[100px]">
                        <div className="text-xl font-bold text-slate-800 tracking-tight">
                        {route.departureTime}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{route.duration} trip</span>
                        </div>
                    </div>

                    {/* Bus Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-slate-700">{route.origin}</span>
                            <ArrowRight className="w-4 h-4 text-slate-300" />
                            <span className="text-lg font-bold text-red-600">{route.destination}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* BUS NUMBER BADGE (Changes based on Date) */}
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 text-white font-mono font-medium shadow-sm">
                            <Hash className="w-3 h-3 text-slate-400" /> {route.busNumber}
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
                            <Bus className="w-3 h-3" /> {route.busName}
                        </span>
                        
                        <span className={`inline-flex items-center px-2 py-1 rounded-md border ${route.type === 'AC' ? 'bg-cyan-50 border-cyan-100 text-cyan-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                            {route.type}
                        </span>
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 border-slate-50 pt-3 sm:pt-0 mt-2 sm:mt-0">
                        <div className="text-right">
                            <span className="block text-xl font-extrabold text-emerald-600">৳{route.price}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Per Seat</span>
                        </div>
                        <button className="px-6 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-md hover:shadow-emerald-200">
                            Book
                        </button>
                    </div>
                    </div>
                </motion.div>
                ))}
                </AnimatePresence>
            </div>
        )}
      </div>
    </div>
  );
}

export default function BusSchedulePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TimetableContent />
    </Suspense>
  );
}