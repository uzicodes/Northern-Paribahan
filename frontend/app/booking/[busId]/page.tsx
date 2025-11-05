'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { api } from '../../../lib/api';

type Seat = { id: string; seatNumber: string; isBooked: boolean };
type Bus = { id: string; name: string; number: string; seats: Seat[] };

export default function BookingPage() {
  const params = useParams<{ busId: string }>();
  const busId = params?.busId;
  const [bus, setBus] = useState<Bus | null>(null);

  useEffect(() => {
    if (!busId) return;
    api.get(`/buses/${busId}`).then((res) => setBus(res.data));
  }, [busId]);

  const socket: Socket | null = useMemo(() => {
    const s = io('/seats');
    return s;
  }, []);

  useEffect(() => {
    if (!socket || !busId) return;
    socket.emit('join-bus', busId);
    socket.on('seat-update', () => {
      api.get(`/buses/${busId}`).then((res) => setBus(res.data));
    });
    return () => { socket.disconnect(); };
  }, [socket, busId]);

  async function book(seat: Seat) {
    if (!busId) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    await api.post(`/buses/${busId}/book`, { seatId: seat.id }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  }

  if (!bus) return <p className="py-6">Loading...</p>;

  return (
    <section className="py-6 space-y-4">
      <h2 className="text-xl font-semibold">{bus.name} • {bus.number}</h2>
      <div className="grid grid-cols-4 gap-2">
        {bus.seats.map((s) => (
          <button key={s.id} disabled={s.isBooked} onClick={() => book(s)} className={`px-3 py-2 rounded border text-sm ${s.isBooked ? 'bg-gray-200 text-gray-400' : 'bg-green-50 hover:bg-green-100 border-green-300'}`}>{s.seatNumber}</button>
        ))}
      </div>
    </section>
  );
}

