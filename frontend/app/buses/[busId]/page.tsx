"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';

interface Bus {
  id: number;
  name: string;
  brand: string;
  capacity: string;
  features: string[];
  description: string;
  price: number;
}

interface Seat {
  id: string;
  row: number;
  column: number;
  isAvailable: boolean;
  type: 'seat' | 'driver' | 'empty';
}

export default function BusDetailPage() {
  const params = useParams();
  const busId = params.busId as string;

  const buses: Bus[] = [
    {
      id: 1,
      name: "Mercedes-Benz Tourismo",
      brand: "Mercedes-Benz",
      capacity: "45 Seats",
      features: ["Air Conditioning", "Reclining Seats", "WiFi", "USB Charging"],
      description: "Experience luxury travel with our premium Mercedes-Benz fleet.",
      price: 1200
    },
    {
      id: 2,
      name: "Scania Touring",
      brand: "Scania",
      capacity: "48 Seats",
      features: ["Premium Seats", "Entertainment System", "Climate Control", "Spacious Legroom"],
      description: "Travel in style with Scania's renowned engineering excellence.",
      price: 1100
    },
    {
      id: 3,
      name: "MAN Lion's Coach",
      brand: "MAN",
      capacity: "50 Seats",
      features: ["Comfort Seats", "Air Suspension", "Reading Lights", "Luggage Space"],
      description: "Reliable and efficient transportation with MAN's cutting-edge technology.",
      price: 1000
    },
    {
      id: 4,
      name: "Volvo 9700",
      brand: "Volvo",
      capacity: "45 Seats",
      features: ["Premium Comfort", "Safety Systems", "WiFi", "Refreshments"],
      description: "Journey with confidence in our Volvo buses.",
      price: 1300
    },
    {
      id: 5,
      name: "Hino RK8",
      brand: "Hino",
      capacity: "40 Seats",
      features: ["Comfortable Seating", "AC System", "Safety Features", "Fuel Efficient"],
      description: "Dependable and economical travel with Hino's trusted performance.",
      price: 900
    },
    {
      id: 6,
      name: "Ashok Leyland Viking",
      brand: "Ashok Leyland",
      capacity: "42 Seats",
      features: ["Spacious Interior", "Air Conditioning", "Music System", "Storage Space"],
      description: "Affordable comfort with Ashok Leyland's reliable buses.",
      price: 850
    }
  ];

  const bus = buses.find(b => b.id === parseInt(busId));

  // Generate seat layout (skeletal arrangement)
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    
    // Driver seat (on the right side)
    seats.push({ id: 'driver', row: 0, column: 4, isAvailable: false, type: 'driver' });
    
    // Regular seats in 2-2 configuration (11 rows)
    for (let row = 1; row <= 11; row++) {
      // Left side - 2 seats
      seats.push({ 
        id: `A${row}`, 
        row, 
        column: 0, 
        isAvailable: true, 
        type: 'seat' 
      });
      seats.push({ 
        id: `B${row}`, 
        row, 
        column: 1, 
        isAvailable: true, 
        type: 'seat' 
      });
      
      // Aisle (empty space)
      seats.push({ id: `aisle-${row}`, row, column: 2, isAvailable: false, type: 'empty' });
      
      // Right side - 2 seats
      seats.push({ 
        id: `C${row}`, 
        row, 
        column: 3, 
        isAvailable: true, 
        type: 'seat' 
      });
      seats.push({ 
        id: `D${row}`, 
        row, 
        column: 4, 
        isAvailable: true, 
        type: 'seat' 
      });
    }
    
    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.type !== 'seat' || !seat.isAvailable) return;
    
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const getSeatsByRow = (row: number) => {
    return seats.filter(seat => seat.row === row);
  };

  const renderSeat = (seat: Seat) => {
    if (seat.type === 'driver') {
      return (
        <div key={seat.id} className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }

    if (seat.type === 'empty') {
      return <div key={seat.id} className="w-12 h-12"></div>;
    }

    const isSelected = selectedSeats.includes(seat.id);
    const seatColor = !seat.isAvailable 
      ? 'bg-gray-400 cursor-not-allowed' 
      : isSelected 
        ? 'bg-green-500 hover:bg-green-600' 
        : 'bg-blue-500 hover:bg-blue-600';

    return (
      <button
        key={seat.id}
        onClick={() => handleSeatClick(seat)}
        disabled={!seat.isAvailable}
        className={`w-12 h-12 ${seatColor} rounded-lg flex items-center justify-center text-white font-semibold text-xs transition-all duration-200 transform hover:scale-105 shadow-md`}
      >
        {seat.id}
      </button>
    );
  };

  if (!bus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Bus not found</h1>
          <a href="/buses" className="text-blue-600 hover:underline">Go back to buses</a>
        </div>
      </div>
    );
  }

  const totalPrice = selectedSeats.length * bus.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Bus Info Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{bus.name}</h1>
              <p className="text-gray-600">{bus.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Price per seat</div>
              <div className="text-2xl font-bold text-green-600">৳{bus.price}</div>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            {bus.features.map((feature, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Layout */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Select Your Seats</h2>
              
              {/* Legend */}
              <div className="flex gap-6 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                  <span className="text-sm text-gray-600">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-400 rounded-lg"></div>
                  <span className="text-sm text-gray-600">Booked</span>
                </div>
              </div>

              {/* Bus Layout */}
              <div className="bg-gray-100 rounded-2xl p-6 inline-block">
                <div className="space-y-3">
                  {/* Driver Row */}
                  <div className="flex gap-2 items-center justify-end mb-4">
                    <div className="text-xs text-gray-600 mr-2">Driver</div>
                    {renderSeat(seats[0])}
                  </div>

                  {/* Regular Rows */}
                  {Array.from({ length: 11 }, (_, i) => i + 1).map(row => (
                    <div key={row} className="flex gap-2 items-center">
                      {getSeatsByRow(row).map(seat => renderSeat(seat))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Seats:</span>
                  <span className="font-semibold">{selectedSeats.length}</span>
                </div>
                {selectedSeats.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(seatId => (
                      <span key={seatId} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                        {seatId}
                      </span>
                    ))}
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">৳{totalPrice}</span>
                  </div>
                </div>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                  selectedSeats.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transform hover:scale-105'
                }`}
              >
                Proceed to Book ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'})
              </button>

              <a
                href="/buses"
                className="block text-center mt-4 text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← Back to Buses
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
