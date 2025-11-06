'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type JwtPayload = { role?: string };

function decodeRole(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(typeof atob !== 'undefined' ? atob(payload) : Buffer.from(payload, 'base64').toString());
    return (json as JwtPayload).role || null;
  } catch {
    return null;
  }
}

export default function NavbarClient() {
  const [token, setToken] = useState<string | null>(null);
  const role = useMemo(() => decodeRole(token), [token]);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    const onStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  return (
    <nav className="flex items-center gap-4 text-sm">
  <Link href="/buses" className="text-black hover:text-gray-900">Buses</Link>
      {token && <Link href="/my-bookings" className="text-gray-600 hover:text-gray-900">My Bookings</Link>}
      {role === 'ADMIN' && <Link href="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>}
      {!token ? (
        <>
          <Link href="/login" className="text-black hover:text-gray-900">Login</Link>
          <Link href="/register" className="text-black hover:text-gray-900">Register</Link>
        </>
      ) : (
        <button onClick={logout} className="text-gray-600 hover:text-gray-900">Logout</button>
      )}
    </nav>
  );
}

