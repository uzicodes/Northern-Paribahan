import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { api } from '../services/api.ts';
import SeatMap from '../components/SeatMap.tsx';

type Seat = { id: string; seatNumber: string; isBooked: boolean };
type Bus = { id: string; name: string; number: string; seats: Seat[] };

export default function BookingPage() {
  const { busId } = useParams();
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
    return () => {
      socket.disconnect();
    };
  }, [socket, busId]);

  async function handleSelect(seat: Seat) {
    if (!busId) return;
    const token = localStorage.getItem('token');
    await api.post(`/buses/${busId}/book`, { seatId: seat.id }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  }

  if (!bus) return <p className="py-6">Loading...</p>;

  return (
    <section className="py-6 space-y-4">
      <h2 className="text-xl font-semibold">{bus.name} • {bus.number}</h2>
      <SeatMap seats={bus.seats} onSelect={handleSelect} />
    </section>
  );
}

