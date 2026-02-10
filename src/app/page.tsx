"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

interface Bus {
    id: string;
    name: string;
    plateNumber: string;
    type: string;
    price: number;
}

export default function Home() {
    const [buses, setBuses] = useState<Bus[]>([]);

    useEffect(() => {
        fetch('/api/buses')
            .then((res) => res.json())
            .then((data) => setBuses(data));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Buses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buses.map((bus) => (
                    <div key={bus.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="h-48 bg-gray-200 w-full relative">
                            {/* Replace with actual image logic later */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                Bus Image
                            </div>
                        </div>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-2">{bus.name}</h2>
                            <p className="text-gray-600 mb-1">Type: {bus.type}</p>
                            <p className="text-gray-600 mb-4">Price: ৳{bus.price}</p>
                            <Link href={`/booking/${bus.id}`} className="block w-full text-center bg-primary text-white py-2 rounded hover:bg-emerald-600 transition">
                                Book Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
