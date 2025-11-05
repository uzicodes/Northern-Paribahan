import { useEffect, useState } from 'react';
import { api } from '../services/api.ts';

type Booking = { id: string; status: string; bus: { name: string; number: string }; seat: { seatNumber: string } };

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.get('/bookings/me').then((res) => setBookings(res.data));
  }, []);

  return (
    <section className="py-6">
      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
      <div className="grid gap-3">
        {bookings.map((b) => (
          <div key={b.id} className="border rounded p-4 bg-white">
            <div className="font-medium">{b.bus.name} • {b.bus.number}</div>
            <div className="text-sm text-gray-600">Seat: {b.seat.seatNumber} • Status: {b.status}</div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-gray-600">No bookings yet.</p>}
      </div>
    </section>
  );
}

