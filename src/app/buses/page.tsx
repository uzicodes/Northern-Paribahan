import React from 'react';
import Image from 'next/image';
import { Bus, Users, Wifi, Wind, Shield } from 'lucide-react';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
        features: ['AC', 'Sleeper', 'Luxury'],
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
    {
        image: '/bus/volvo.png',
        brand: 'Hyundai Universe',
        tagline: 'Smooth & Luxurious',
        features: ['AC', 'Reclining Seats', 'Audio'],
        seats: 40,
        color: 'from-orange-500 to-pink-600',
        accentBg: 'bg-green-100',
        accentText: 'text-red-600',
    },
    {
        image: '/bus/ashok.png',
        brand: 'Eicher Pro',
        tagline: 'Intercity Regional',
        features: ['Non-AC', 'Economical', 'Fast'],
        seats: 45,
        color: 'from-orange-500 to-pink-600',
        accentBg: 'bg-green-100',
        accentText: 'text-red-600',
    },
    {
        image: '/bus/hino.png',
        brand: 'Hino AK1J',
        tagline: 'Sturdy & Dependable',
        features: ['Non-AC', 'Spacious', 'Reliable'],
        seats: 45,
        color: 'from-orange-500 to-pink-600',
        accentBg: 'bg-green-100',
        accentText: 'text-red-600',
    },
];

type ApiBus = {
    id: string;
    name: string;
    registrationNumber: string;
    type: string;
    capacity: number;
};

type MergedBus = ShowcaseBus & {
    id?: string;
    name: string;
    registrationNumber: string;
    type: string;
    price: number;
    capacity: number;
};

export default async function BusesPage() {
    let apiBuses: ApiBus[] = [];
    try {
        const buses = await prisma.bus.findMany({
            distinct: ['name'],
            orderBy: { name: 'asc' },
        });
        apiBuses = buses as unknown as ApiBus[];
    } catch (error) {
        console.error('Failed to fetch buses:', error);
    }

    const cards: MergedBus[] = busShowcase.map((showcase) => {
        const matched = apiBuses.find((b) => b.name.toLowerCase() === showcase.brand.toLowerCase());

        return {
            ...showcase,
            id: matched?.id,
            name: matched?.name || showcase.brand,
            registrationNumber: matched?.registrationNumber || 'N/A',
            type: matched?.type ? matched.type.replace('_', ' ') : showcase.features[0],
            price: 0,
            capacity: matched?.capacity || showcase.seats || 0,
        };
    });

    return (
        <div style={{ backgroundColor: '#C9CBA3' }} className="min-h-screen pb-16">
            {/* Hero Header Banner */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 md:pt-12 pb-2">
                <div className="bg-[#172144] rounded-2xl py-4 px-6 sm:py-5 sm:px-8 text-white shadow-lg border border-[#223062] flex flex-col items-center justify-center text-center gap-1.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Our Bus Fleet</h1>
                    <p className="text-indigo-100 text-xs sm:text-sm max-w-xl leading-relaxed mx-auto">
                        Discover Northern Paribahan's premium fleet of AC, Sleeper, and Express coaches.
                    </p>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((bus) => (
                    <div
                        key={bus.id || bus.brand}
                        className="group bg-slate-800/95 backdrop-blur-sm rounded-3xl p-5 text-white transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-950/30 border border-slate-700/50 cursor-pointer"
                    >
                        <div className="bg-slate-900/50 rounded-2xl p-4 mb-4 flex items-center justify-center">
                            <Image
                                src={bus.image}
                                alt={bus.brand}
                                width={300}
                                height={160}
                                className="h-36 w-auto mx-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300 object-contain"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-center mt-1">{bus.brand}</h3>
                        <p className="text-xs text-center text-slate-400 font-medium mb-3">{bus.tagline}</p>

                        <div className="flex flex-wrap justify-center gap-2 mt-3 pt-3 border-t border-slate-700/40">
                            {bus.features.map((f) => (
                                <span key={f} className="text-xs bg-slate-700/60 text-[#FCA311] px-3 py-1 rounded-full font-semibold border border-slate-600/30">
                                    {f}
                                </span>
                            ))}
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 border border-emerald-500/30">
                                <Users size={12} />
                                {bus.capacity} Seats
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}