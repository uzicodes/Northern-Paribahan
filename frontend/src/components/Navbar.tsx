import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

export default function Navbar() {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  function logout() { setToken(null); navigate('/'); }
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">BusApp</Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/buses" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}>Buses</NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}>My Bookings</NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}>Admin</NavLink>
          {!token ? (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}>Register</NavLink>
            </>
          ) : (
            <button onClick={logout} className="text-gray-600 hover:text-gray-900">Logout</button>
          )}
        </nav>
      </div>
    </header>
  );
}

