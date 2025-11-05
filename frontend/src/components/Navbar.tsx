import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">BusApp</Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/buses" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}>Buses</NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}>Admin</NavLink>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}>Login</NavLink>
        </nav>
      </div>
    </header>
  );
}

