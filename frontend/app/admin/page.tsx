'use client';
import { useState } from 'react';
import { api } from '../../lib/api';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [routeId, setRouteId] = useState('');
  const [routeOrigin, setRouteOrigin] = useState('');
  const [routeDestination, setRouteDestination] = useState('');
  const [routeDeparture, setRouteDeparture] = useState('');
  const [routeArrival, setRouteArrival] = useState('');
  const [busIdForSeats, setBusIdForSeats] = useState('');
  const [seatCount, setSeatCount] = useState(0);

  async function createBus(e: React.FormEvent) {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    await api.post('/admin/buses', { name, number, routeId }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
    setName(''); setNumber(''); setRouteId('');
  }

  async function createRoute(e: React.FormEvent) {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    await api.post('/admin/routes', {
      origin: routeOrigin,
      destination: routeDestination,
      departure: new Date(routeDeparture).toISOString(),
      arrival: new Date(routeArrival).toISOString(),
    }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
    setRouteOrigin(''); setRouteDestination(''); setRouteDeparture(''); setRouteArrival('');
  }

  async function addSeats(e: React.FormEvent) {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const seats = Array.from({ length: seatCount }, (_, i) => `S${(i + 1).toString().padStart(2, '0')}`);
    await api.post(`/admin/buses/${busIdForSeats}/seats`, { seats }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
    setBusIdForSeats(''); setSeatCount(0);
  }

  return (
    <section className="py-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
      <h3 className="font-medium mt-4 mb-2">Create Route</h3>
      <form onSubmit={createRoute} className="space-y-3 mb-6">
        <input className="w-full border rounded px-3 py-2" placeholder="Origin" value={routeOrigin} onChange={(e) => setRouteOrigin(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Destination" value={routeDestination} onChange={(e) => setRouteDestination(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="datetime-local" placeholder="Departure" value={routeDeparture} onChange={(e) => setRouteDeparture(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="datetime-local" placeholder="Arrival" value={routeArrival} onChange={(e) => setRouteArrival(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Create Route</button>
      </form>

      <h3 className="font-medium mt-4 mb-2">Create Bus</h3>
      <form onSubmit={createBus} className="space-y-3 mb-6">
        <input className="w-full border rounded px-3 py-2" placeholder="Bus Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Bus Number" value={number} onChange={(e) => setNumber(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Route ID" value={routeId} onChange={(e) => setRouteId(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Create Bus</button>
      </form>

      <h3 className="font-medium mt-4 mb-2">Add Seats to Bus</h3>
      <form onSubmit={addSeats} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Bus ID" value={busIdForSeats} onChange={(e) => setBusIdForSeats(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="number" placeholder="Seat Count" value={seatCount} onChange={(e) => setSeatCount(parseInt(e.target.value || '0', 10))} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Add Seats</button>
      </form>
    </section>
  );
}

