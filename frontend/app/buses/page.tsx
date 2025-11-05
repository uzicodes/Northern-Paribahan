'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';

type Route = { id: string; origin: string; destination: string };
type Bus = { id: string; name: string; number: string; route: Route };

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);

  useEffect(() => {
    api.get('/buses').then((res) => setBuses(res.data));
  }, []);

  return (
    <section className="py-6">
      <h2 className="text-xl font-semibold mb-4">Available Buses</h2>
      <div className="grid gap-3">
        {buses.map((b) => (
          <Link key={b.id} href={`/booking/${b.id}`} className="border rounded p-4 bg-white hover:bg-gray-50">
            <div className="font-medium">{b.name} • {b.number}</div>
            <div className="text-sm text-gray-600">{b.route?.origin} → {b.route?.destination}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

