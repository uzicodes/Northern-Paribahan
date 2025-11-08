'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
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

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex items-center gap-4 text-sm">
      <Link 
        href="/buses" 
        className={isActive('/buses') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-gray-300'}
      >
        Buses
      </Link>
      {token && (
        <Link 
          href="/my-bookings" 
          className={isActive('/my-bookings') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-gray-300'}
        >
          My Bookings
        </Link>
      )}
      {role === 'ADMIN' && (
        <Link 
          href="/admin" 
          className={isActive('/admin') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-gray-300'}
        >
          Admin
        </Link>
      )}
      {!token ? (
        <>
          <Link 
            href="/login" 
            className={isActive('/login') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-gray-300'}
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className={isActive('/register') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-gray-300'}
          >
            Register
          </Link>
        </>
      ) : (
        <button onClick={logout} className="text-white hover:text-gray-300">Logout</button>
      )}
    </nav>
  );
}

