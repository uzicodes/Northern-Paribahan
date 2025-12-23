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
  const [showContactPopup, setShowContactPopup] = useState(false);
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
          <button 
            onClick={() => setShowContactPopup(true)}
            className="text-white hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          
          {/* Contact Popup */}
          {showContactPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowContactPopup(false)}>
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Contact Us</h3>
                  <button onClick={() => setShowContactPopup(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Support Center
                    </p>
                    <p className="text-sm text-slate-600 mb-1">For any problem, please contact:</p>
                    <p className="text-slate-800 font-medium">support@northernparibahan.com</p>
                    <p className="text-slate-800 font-medium">+880 1700-000000</p>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Developer Contact</p>
                    <a href="mailto:utshozi11@gmail.com" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors group">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      utshozi11@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <button onClick={logout} className="text-white hover:text-gray-300">Logout</button>
      )}
    </nav>
  );
}

