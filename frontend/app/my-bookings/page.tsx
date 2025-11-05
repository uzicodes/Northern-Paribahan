'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

type Booking = { id: string; status: string; bus: { id: string; name: string; number: string }; seat: { seatNumber: string } };

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  async function load() {
    const res = await api.get('/bookings/me');
    setBookings(res.data);
  }

  useEffect(() => { load(); }, []);

  async function cancel(booking: Booking) {
    await api.post(`/buses/${booking.bus.id}/cancel`, { bookingId: booking.id });
    await load();
  }

  return (
    <section className="py-6">
      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
      <div className="grid gap-3">
        {bookings.map((b) => (
          <div key={b.id} className="border rounded p-4 bg-white flex items-center justify-between">
            <div>
              <div className="font-medium">{b.bus.name} • {b.bus.number}</div>
              <div className="text-sm text-gray-600">Seat: {b.seat.seatNumber} • Status: {b.status}</div>
            </div>
            {b.status !== 'CANCELED' && (
              <button onClick={() => cancel(b)} className="text-red-600 hover:text-red-700">Cancel</button>
            )}
          </div>
        ))}
        {bookings.length === 0 && <p className="text-gray-600">No bookings yet.</p>}
      </div>
    </section>
  );
}

