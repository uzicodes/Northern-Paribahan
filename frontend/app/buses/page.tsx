"use client";
import React from 'react';

interface Bus {
  id: number;
  name: string;
  brand: string;
  features: string[];
  capacity: string;
  image: string;
  description: string;
}

export default function BusesPage() {
  const buses: Bus[] = [
    {
      id: 1,
      name: "Mercedes-Benz Tourismo",
      brand: "Mercedes-Benz",
      features: ["Air Conditioning", "Reclining Seats", "WiFi", "USB Charging"],
      capacity: "45-55 Passengers",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
      description: "Experience luxury travel with our premium Mercedes-Benz fleet, featuring state-of-the-art comfort and safety."
    },
    {
      id: 2,
      name: "Scania Touring",
      brand: "Scania",
      features: ["Premium Seats", "Entertainment System", "Climate Control", "Spacious Legroom"],
      capacity: "48-52 Passengers",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
      description: "Travel in style with Scania's renowned engineering excellence and passenger comfort."
    },
    {
      id: 3,
      name: "MAN Lion's Coach",
      brand: "MAN",
      features: ["Comfort Seats", "Air Suspension", "Reading Lights", "Luggage Space"],
      capacity: "50-55 Passengers",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
      description: "Reliable and efficient transportation with MAN's cutting-edge technology."
    },
    {
      id: 4,
      name: "Volvo 9700",
      brand: "Volvo",
      features: ["Premium Comfort", "Safety Systems", "WiFi", "Refreshments"],
      capacity: "45-50 Passengers",
      image: "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&q=80",
      description: "Journey with confidence in our Volvo buses, known for unmatched safety and comfort."
    },
    {
      id: 5,
      name: "Hino RK8",
      brand: "Hino",
      features: ["Comfortable Seating", "AC System", "Safety Features", "Fuel Efficient"],
      capacity: "40-45 Passengers",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
      description: "Dependable and economical travel with Hino's trusted performance."
    },
    {
      id: 6,
      name: "Ashok Leyland Viking",
      brand: "Ashok Leyland",
      features: ["Spacious Interior", "Air Conditioning", "Music System", "Storage Space"],
      capacity: "42-48 Passengers",
      image: "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&q=80",
      description: "Affordable comfort with Ashok Leyland's reliable and spacious buses."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
  <div className="py-8 px-4" style={{ backgroundColor: '#C5E6E6' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Our Premium Fleet</h1>
          <p className="text-xl text-red-600 text-center max-w-3xl mx-auto">
            Experience world-class comfort & safety with luxury buses
          </p>
        </div>
      </div>

      {/* Buses Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{ backgroundColor: '#ACE69C' }}
            >
              {/* Bus Image */}
              <div className="relative h-56 overflow-hidden bg-gray-200">
                <img
                  src={bus.image}
                  alt={bus.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {bus.brand}
                </div>
              </div>

              {/* Bus Details */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{bus.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{bus.description}</p>

                {/* Capacity */}
                <div className="flex items-center justify-center gap-2 mb-4 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="font-semibold text-sm">{bus.capacity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
  <div className="py-16 px-4 mt-12" style={{ backgroundColor: '#C5E6E6' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Our Buses?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Safety First</h3>
              <p className="text-gray-600 text-sm">Regular maintenance and safety checks</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">On-Time Service</h3>
              <p className="text-gray-600 text-sm">Punctual departures and arrivals</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Comfort Guaranteed</h3>
              <p className="text-gray-600 text-sm">Premium seats and amenities</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Best Prices</h3>
              <p className="text-gray-600 text-sm">Competitive rates with no hidden fees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}