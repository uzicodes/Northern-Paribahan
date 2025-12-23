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
        href="/timetable" 
        className={isActive('/timetable') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-gray-300'}
      >
        Timetable
      </Link>

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
          <Link 
            href="/profile"
            className={isActive('/profile') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-gray-300'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
          <Link 
            href="/mail" 
            className={isActive('/mail') ? 'text-[#FCA311] hover:text-[#FCA311]' : 'text-white hover:text-gray-300'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </Link>
        </>
      ) : (
        <button onClick={logout} className="text-white hover:text-gray-300">Logout</button>
      )}
    </nav>
  );
}

