import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import BusList from './pages/BusList.tsx';
import BookingPage from './pages/BookingPage.tsx';
import MyBookings from './pages/MyBookings.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import Navbar from './components/Navbar.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/buses" element={<BusList />} />
            <Route path="/booking/:busId" element={<BookingPage />} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="py-6 text-center text-sm text-gray-500">
          <Link className="hover:underline" to="/">Bus Ticket Booking</Link>
        </footer>
      </div>
    </AuthProvider>
  );
}

