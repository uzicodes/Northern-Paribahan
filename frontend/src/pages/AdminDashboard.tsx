import { useState } from 'react';
import { api } from '../services/api.ts';

export default function AdminDashboard() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [routeId, setRouteId] = useState('');

  async function createBus(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await api.post('/admin/buses', { name, number, routeId }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
    setName(''); setNumber(''); setRouteId('');
  }

  return (
    <section className="py-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
      <form onSubmit={createBus} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Bus Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Bus Number" value={number} onChange={(e) => setNumber(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Route ID" value={routeId} onChange={(e) => setRouteId(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Create Bus</button>
      </form>
    </section>
  );
}

