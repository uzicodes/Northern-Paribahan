import React from 'react';
import BusesClient, { ShowcaseBus } from './BusesClient';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const busShowcaseData: ShowcaseBus[] = [
    {
        brand: 'MAN 24.460',
        type: 'SLEEPER',
        displayType: 'Sleeper Class',
        tagline: 'Ultra-Luxury Long Haul Sleeper',
        description:
            'Flagship German-engineered sleeper coach featuring private double and single luxury berths.',
        image: '/bus/man.png',
        capacity: 40,
        features: ['Berth Beds', 'Climate AC', 'Air Suspension'],
    },
    {
        brand: 'Scania Legacy SR2',
        type: 'AC',
        displayType: 'Executive AC',
        tagline: 'Precision Swedish Grand Touring',
        description:
            'European luxury cruiser tailored for prime intercity corridors. Features ergonomic semi-sleeper cabins.',
        image: '/bus/scania.png',
        capacity: 46,
        features: ['Semi-Sleeper 2+2', 'Whisper Cabin', 'Air Suspension'],
    },
    {
        brand: 'Mercedes-Benz OM 906',
        type: 'AC',
        displayType: 'Executive AC',
        tagline: 'Iconic Star Luxury & Safety',
        description:
            'Renowned Mercedes-Benz comfort with ultra-soft leatherette upholstery and smooth electronic braking.',
        image: '/bus/mercedes.png',
        capacity: 41,
        features: ['Leatherette Seats', 'Smart Climate', 'Anti-Roll System'],
    },
    {
        brand: 'Volvo B9R',
        type: 'AC',
        displayType: 'Executive AC',
        tagline: 'Smooth Highway Glider',
        description:
            'Multi-axle Swedish luxury known for supreme highway stability, reclining seats with calf supports, expansive panoramic windows.',
        image: '/bus/volvo.png',
        capacity: 40,
        features: ['Multi-Axle Stability', 'Calf Rest Support', 'Panoramic Views'],
    },
    {
        brand: 'Hyundai Universe',
        type: 'AC',
        displayType: 'Executive AC',
        tagline: 'Modern Elegance & High Comfort',
        description:
            'Aero-styled Korean luxury coach with aerodynamic quietness, wide aisle spacing, high-density comfort cushioning.',
        image: '/bus/volvo.png',
        capacity: 40,
        features: ['Aerodynamic Design', 'Extra Cushioning', 'Wide Aisle'],
    },
    {
        brand: 'Hino RN8J',
        type: 'AC',
        displayType: 'Executive AC',
        tagline: 'Capital Fast Highway Express',
        description:
            'Reliable Japanese engineering designed for high-frequency. Spacious layout ensures generous passenger room.',
        image: '/bus/hino.png',
        capacity: 36,
        features: ['Extra Legroom 36S', 'Japanese Engine', 'Fast Transit'],
    },
    {
        brand: 'Ashok Leyland Eagle',
        type: 'NON_AC',
        displayType: 'Regional Express',
        tagline: 'Everyday Champion & Economical',
        description:
            'Robust and high-efficiency workhorse well-ventilated cabins, durable cushioned seating, and budget-friendly fares.',
        image: '/bus/ashok.png',
        capacity: 45,
        features: ['High Ventilation', 'Padded Seating', 'Direct Point-to-Point'],
    },
    {
        brand: 'Eicher Pro',
        type: 'NON_AC',
        displayType: 'Regional Express',
        tagline: 'Swift Intercity Connector',
        description:
            'Fast-turnaround regional coach with smooth air suspension for short express runs connecting the hubs faster.',
        image: '/bus/ashok.png',
        capacity: 45,
        features: ['Fast Commute', 'High Frequency', 'Air Suspension'],
    },
    {
        brand: 'Hino AK1J',
        type: 'NON_AC',
        displayType: 'Regional Express',
        tagline: 'Sturdy, Reliable & Dependable',
        description:
            'Heavy-duty non-AC fleet built for dependable all-weather highway endurance, maximum seating reliability, and punctuality.',
        image: '/bus/hino.png',
        capacity: 45,
        features: ['Heavy-Duty Chassis', 'Dependable Performance', ' Layout'],
    },
];

export default async function BusesPage() {
    try {
        const busesInDb = await prisma.bus.findMany({
            distinct: ['name'],
            select: {
                id: true,
                name: true,
                type: true,
                capacity: true,
            },
        });

        // Merge database IDs and dynamic attributes
        const mergedBuses = busShowcaseData.map((showcase) => {
            const matched = busesInDb.find((b) => b.name.toLowerCase() === showcase.brand.toLowerCase());
            return {
                ...showcase,
                id: matched?.id,
                capacity: matched?.capacity || showcase.capacity,
            };
        });

        return <BusesClient buses={mergedBuses} />;
    } catch (error) {
        console.error('Failed to fetch buses from database:', error);
        return <BusesClient buses={busShowcaseData} />;
    }
}