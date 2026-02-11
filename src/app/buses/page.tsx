'use client';

import React, { useState, useEffect } from 'react';
import { Bus, Users, Wifi, Wind, Shield, Loader2 } from 'lucide-react';

// Static bus data
const busShowcase = [
    {
        image: '/bus/volvo.png',
        brand: 'Volvo B9R',
        tagline: 'Premium Comfort',
        features: ['AC', 'WiFi', 'Multi-Axle'],
        seats: 40,
        color: 'from-orange-500 to-pink-600',
        accentBg: 'bg-green-100',
        accentText: 'text-red-600',
    },
    {
        image: '/bus/mercedes.png',
        brand: 'Mercedes-Benz OM 906',
        tagline: 'Luxury Travel',
        features: ['AC', 'WiFi', 'USB Charging'],
        seats: 41,
        color: 'from-orange-500 to-pink-600',
        accentBg: 'bg-green-100',
        accentText: 'text-red-600',
    },
    {
        image: '/bus/scania.png',
        brand: 'Scania Legacy SR2',
        tagline: 'Built for the Road',
        features: ['AC', 'Suspension', 'GPS'],
        seats: 46,
        color: 'from-orange-500 to-pink-600',
        accentBg: 'bg-green-100',
        accentText: 'text-red-600',
    },
    {
        image: '/bus/hino.png',
        brand: 'Hino RN8J',
        tagline: 'Reliable & Efficient',
        features: ['AC', 'Spacious', 'Safe'],
        seats: 36,
        color: 'from-orange-500 to-pink-600',
        accentBg: 'bg-green-100',
        accentText: 'text-red-600',
    },
    {
        image: '/bus/man.png',
        brand: 'MAN 24.460 ',
        tagline: 'Power & Precision',
        features: ['AC', 'Sleeper', 'Double-Decker'],
        seats: 40,
        color: 'from-orange-500 to-pink-600',
        accentBg: 'bg-green-100',
        accentText: 'text-red-600',
    },
    {
        image: '/bus/ashok.png',
        brand: 'Ashok Leyland Eagle',
        tagline: 'Everyday Champion',
        features: ['Non-AC', 'Budget', 'Express'],
        seats: 45,
        color: 'from-orange-500 to-pink-600',
        accentBg: 'bg-green-100',
        accentText: 'text-red-600',
    },
];

interface ApiBus {
    id: string;
    name: string;
    plateNumber: string;
    type: string;
    price: number;
    seats: { id: string; seatNumber: string; isBooked: boolean }[];
}

export default function BusesPage() {
    const [apiBuses, setApiBuses] = useState<ApiBus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const res = await fetch('/api/buses');
                if (res.ok) {
                    const data = await res.json();
                    setApiBuses(data);
                }
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchBuses();
    }, []);

    // Merge API data with showcase data if available
    const cards = busShowcase.map((showcase, index) => {
        const matched = apiBuses[index];
        return {
            ...showcase,
            id: matched?.id,
            name: matched?.name || showcase.brand,
            plateNumber: matched?.plateNumber || 'N/A',
            type: matched?.type || showcase.features[0],
            price: matched?.price || 0,
            totalSeats: matched?.seats?.length || showcase.seats || 0,
            availableSeats: matched?.seats?.filter(s => !s.isBooked).length || 0,
        };
    });

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#C9CBA3' }}>
            {/* Hero Header */}
            <div className="relative overflow-hidden" style={{ backgroundColor: '#172144' }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                </div>
                <div className="relative max-w-6xl mx-auto px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium text-indigo-300 mb-6 backdrop-blur-sm border border-white/10">
                        <Bus size={16} />
                        Our Fleet
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Explore Our <span style={{ color: '#FCA311' }}>Bus Fleet</span>
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2md mx-auto">
                        Collection of modern, well-maintained buses for a comfortable journey across Bangladesh.
                    </p>
                </div>
            </div>

            {/* Bus Cards Grid */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                        <p className="text-slate-600 font-medium">Loading buses...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((bus, index) => (
                            <div
                                key={index}
                                className="group bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Image Container */}
                                <div className={`relative h-52 bg-gradient-to-br ${bus.color} overflow-hidden`}>
                                    {/* Decorative circles */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
                                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>

                                    {/* Bus Image */}
                                    <img
                                        src={bus.image}
                                        alt={bus.brand}
                                        className="absolute inset-0 w-full h-full object-contain p-4 drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />




                                </div>

                                {/* Content */}
                                <div className="p-4 text-center">
                                    {/* Brand & Tagline */}
                                    <div className="mb-2">
                                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                                            {bus.brand}
                                        </h3>
                                        <p className="text-sm text-slate-400">{bus.tagline}</p>
                                    </div>

                                    {/* Features & Capacity */}
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {bus.features.map((feature, i) => (
                                            <span
                                                key={i}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${bus.accentBg} ${bus.accentText}`}
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                        {bus.totalSeats > 0 && (
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${bus.accentBg} ${bus.accentText}`}>
                                                <Users size={12} />
                                                {bus.totalSeats} Seats
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Info */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-4 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Shield size={18} className="text-emerald-500" />
                            <span className="font-medium">Safe & Secure</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200"></div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Wind size={18} className="text-blue-500" />
                            <span className="font-medium">AC Available</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200"></div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Wifi size={18} className="text-purple-500" />
                            <span className="font-medium">WiFi On Board</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
