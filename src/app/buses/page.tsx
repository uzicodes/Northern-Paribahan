'use client';

import React, { useState, useEffect } from 'react';
import { Bus, Users, Wifi, Wind, Shield } from 'lucide-react';

// Static bus data
type ShowcaseBus = {
    image: string;
    brand: string;
    tagline: string;
    features: string[];
    seats: number;
    color: string;
    accentBg: string;
    accentText: string;
};

const busShowcase: ShowcaseBus[] = [
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
        brand: 'MAN 24.460',
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

type MergedBus = ShowcaseBus & {
    id?: string;
    name: string;
    plateNumber: string;
    type: string;
    price: number;
    totalSeats: number;
    availableSeats: number;
};

export default function BusesPage(): React.JSX.Element {
    const [apiBuses, setApiBuses] = useState<ApiBus[]>([]);

    useEffect(() => {
        const fetchBuses = async (): Promise<void> => {
            try {
                const res = await fetch('/api/buses');
                if (res.ok) {
                    const data: ApiBus[] = await res.json();
                    setApiBuses(data);
                }
            } catch (error) {
                console.error('Failed to fetch buses:', error);
            }
        };

        fetchBuses();
    }, []);

    const cards: MergedBus[] = busShowcase.map((showcase, index) => {
        const matched = apiBuses[index];

        return {
            ...showcase,
            id: matched?.id,
            name: matched?.name || showcase.brand,
            plateNumber: matched?.plateNumber || 'N/A',
            type: matched?.type || showcase.features[0],
            price: matched?.price || 0,
            totalSeats: matched?.seats?.length || showcase.seats || 0,
            availableSeats:
                matched?.seats?.filter((s) => !s.isBooked).length || 0,
        };
    });

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#C9CBA3' }}>
            {/* Header */}
            <div className="text-center py-6 bg-[#172144] text-white">
                <h1 className="text-4xl font-bold">Our Bus Fleet</h1>
            </div>

            {/* Cards */}
            <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((bus, index) => (
                    <div key={index} className="bg-slate-800 rounded-2xl p-4 text-white">
                        <img src={bus.image} alt={bus.brand} className="h-40 mx-auto" />
                        <h3 className="text-lg font-bold text-center mt-2">{bus.brand}</h3>
                        <p className="text-sm text-center text-slate-400">{bus.tagline}</p>

                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {bus.features.map((f, i) => (
                                <span key={i} className="text-xs bg-green-100 text-red-600 px-2 py-1 rounded">
                                    {f}
                                </span>
                            ))}
                            <span className="text-xs bg-green-100 text-red-600 px-2 py-1 rounded flex items-center gap-1">
                                <Users size={12} />
                                {bus.totalSeats}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Responsive Bottom Info */}
            <div className="mt-12 text-center px-4">
                <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-4 sm:gap-6 bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Shield size={18} className="text-emerald-500" />
                        <span className="font-medium">Safe & Secure</span>
                    </div>

                    <div className="hidden sm:block w-px h-6 bg-slate-200"></div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Wind size={18} className="text-blue-500" />
                        <span className="font-medium">AC Available</span>
                    </div>

                    <div className="hidden sm:block w-px h-6 bg-slate-200"></div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Wifi size={18} className="text-purple-500" />
                        <span className="font-medium">WiFi On Board</span>
                    </div>

                </div>
            </div>
        </div>
    );
}