'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
    Bus,
    Users,
    Wind,
    Shield,
    MapPin,
} from 'lucide-react';

export type ShowcaseBus = {
    id?: string;
    brand: string;
    type: 'SLEEPER' | 'AC' | 'NON_AC';
    displayType: string;
    tagline: string;
    description: string;
    image: string;
    capacity: number;
    features: string[];
};

interface BusesClientProps {
    buses: ShowcaseBus[];
}

export default function BusesClient({ buses }: BusesClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    // Filter buses based on category
    const filteredBuses = useMemo(() => {
        if (selectedCategory === 'ALL') return buses;
        return buses.filter((bus) => bus.type === selectedCategory);
    }, [buses, selectedCategory]);

    const counts = useMemo(() => {
        return {
            ALL: buses.length,
            SLEEPER: buses.filter((b) => b.type === 'SLEEPER').length,
            AC: buses.filter((b) => b.type === 'AC').length,
            NON_AC: buses.filter((b) => b.type === 'NON_AC').length,
        };
    }, [buses]);

    return (
        <div style={{ backgroundColor: '#C9CBA3' }} className="min-h-screen pb-14">
            {/* 1. Hero Header Banner */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-7 pb-1">
                <div className="bg-[#172144] rounded-2xl py-3.5 px-5 sm:py-4 sm:px-8 text-white shadow-md border border-[#223062] flex flex-col items-center justify-center text-center gap-1">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Our Bus Fleet</h1>
                    <p className="text-indigo-100 text-xs sm:text-sm max-w-xl leading-relaxed mx-auto">
                        Discover Northern Paribahan's premium fleet of AC, Sleeper, and Express coaches.
                    </p>
                </div>
            </div>

            {/* 2. Key Network Highlights Banner */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                <div className="bg-[#EDF5F0] rounded-2xl p-3 sm:p-4 shadow-sm border border-white/60 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <div className="bg-[#172144]/10 p-2 rounded-xl text-[#172144]">
                            <Bus size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black text-gray-900 leading-tight">27 Coaches</p>
                            <p className="text-[11px] text-gray-500 font-medium">9 Bus Models</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <div className="bg-[#172144]/10 p-2 rounded-xl text-[#172144]">
                            <MapPin size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black text-gray-900 leading-tight">8 Major Hubs</p>
                            <p className="text-[11px] text-gray-500 font-medium">Across the  Country</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <div className="bg-[#172144]/10 p-2 rounded-xl text-[#172144]">
                            <Wind size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black text-gray-900 leading-tight">AC & Sleeper</p>
                            <p className="text-[11px] text-gray-500 font-medium">Climate Controlled</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <div className="bg-[#172144]/10 p-2 rounded-xl text-[#172144]">
                            <Shield size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black text-gray-900 leading-tight">GPS Tracked</p>
                            <p className="text-[11px] text-gray-500 font-medium">24/7 Safety Monitored</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Category Filter Controls */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                <div className="bg-[#EDF5F0] rounded-2xl p-3 sm:p-3.5 shadow-sm border border-white/60">
                    {/* Category Filter Pills - Equally Spaced */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full">
                        {[
                            { key: 'ALL', label: 'All Fleet', count: counts.ALL },
                            { key: 'SLEEPER', label: '🛏️ Sleeper', count: counts.SLEEPER },
                            { key: 'AC', label: '❄️ Executive AC', count: counts.AC },
                            { key: 'NON_AC', label: '🪟 Non-AC', count: counts.NON_AC },
                        ].map((cat) => {
                            const isSelected = selectedCategory === cat.key;
                            return (
                                <button
                                    key={cat.key}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat.key)}
                                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer select-none ${
                                        isSelected
                                            ? 'bg-[#172144] text-white shadow-sm scale-[1.01]'
                                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="truncate">{cat.label}</span>
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                                            isSelected ? 'bg-white/20 text-[#FCA311]' : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {cat.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 4. Fleet Grid Cards */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBuses.map((bus, index) => {
                    const isSleeper = bus.type === 'SLEEPER';
                    const isAC = bus.type === 'AC';

                    return (
                        <div
                            key={bus.brand}
                            className="bg-[#EDF5F0] rounded-3xl shadow-sm hover:shadow-lg border border-white/70 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                        >
                            {/* Top Card: Bus Image */}
                            <div className="p-4 pb-0 flex flex-col items-center">
                                {/* Bus Image Covering More Card Area */}
                                <div className="py-1 flex items-center justify-center w-full min-h-[150px]">
                                    <Image
                                        src={bus.image}
                                        alt={bus.brand}
                                        width={400}
                                        height={200}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        priority={index < 3}
                                        loading={index < 3 ? undefined : 'lazy'}
                                        className="h-36 sm:h-40 md:h-44 w-auto max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>

                            {/* Middle Card: Centered Features & Details */}
                            <div className="p-4 pt-2 flex-1 flex flex-col items-center justify-between text-center space-y-3">
                                <div className="w-full flex flex-col items-center text-center">
                                    <h3 className="font-extrabold text-base sm:text-lg text-[#172144] group-hover:text-[#470BB0] transition-colors leading-tight text-center">
                                        {bus.brand}
                                    </h3>

                                    {/* Badges Under Bus Name - Equally Spaced */}
                                    <div className="grid grid-cols-2 gap-2 w-full max-w-[260px] mx-auto mt-2 mb-1">
                                        <span
                                            className={`text-[10px] font-black tracking-wider uppercase py-1 px-2 rounded-full border shadow-xs text-center truncate ${
                                                isSleeper
                                                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                                                    : isAC
                                                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                            }`}
                                        >
                                            {bus.displayType}
                                        </span>

                                        <span className="bg-white text-gray-700 text-[10px] font-bold py-1 px-2 rounded-full border border-gray-200 flex items-center justify-center gap-1 shadow-xs truncate">
                                            <Users size={11} className="text-[#FCA311] shrink-0" />
                                            <span>{bus.capacity} Seats</span>
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-500 font-medium mt-0.5 text-center">{bus.tagline}</p>

                                    <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed text-center max-w-xs">
                                        {bus.description}
                                    </p>
                                </div>

                                {/* Features Tags - Equally Spaced */}
                                <div className="w-full grid grid-cols-3 gap-1.5 pt-2.5 border-t border-gray-200/60">
                                    {bus.features.map((feature) => (
                                        <span
                                            key={feature}
                                            className="bg-white/80 text-slate-700 text-[10px] font-bold py-1 px-1 rounded-md border border-gray-200/60 flex items-center justify-center text-center leading-tight truncate shadow-2xs"
                                            title={feature}
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredBuses.length === 0 && (
                <div className="max-w-md mx-auto px-4 py-12 text-center">
                    <div className="bg-[#EDF5F0] rounded-3xl p-8 border border-white/60 shadow-sm">
                        <Bus size={32} className="text-gray-400 mx-auto mb-3" />
                        <h4 className="text-base font-bold text-gray-800">No coaches found</h4>
                        <p className="text-xs text-gray-500 mt-1">Try selecting another fleet category filter.</p>
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('ALL')}
                            className="mt-4 px-4 py-1.5 bg-[#172144] text-white text-xs font-bold rounded-xl hover:bg-[#202e5e] transition-colors cursor-pointer"
                        >
                            View All Fleet
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

