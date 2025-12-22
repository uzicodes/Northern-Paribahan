'use client';

import React, { useState } from 'react';
import { 
  Bus, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  User, 
  Settings, 
  LogOut, 
  QrCode, 
  Leaf, 
  Trophy,
  ChevronRight
} from 'lucide-react';

// --- Types ---
interface Ticket {
  id: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seat: string;
  price: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  busOperator: string;
  type: string; 
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  points: number;
  totalTrips: number;
  carbonSaved: number; // in kg
}

// --- Mock Data ---
const currentUser: UserProfile = {
  name: "Alex Sterling",
  email: "alex.sterling@example.com",
  phone: "+1 (555) 012-3456",
  tier: "Gold",
  points: 2450,
  totalTrips: 34,
  carbonSaved: 120
};

const tickets: Ticket[] = [
  {
    id: "TIC-9928",
    origin: "New York, NY",
    destination: "Boston, MA",
    date: "Oct 24, 2023",
    departureTime: "08:30 AM",
    arrivalTime: "12:45 PM",
    seat: "2A",
    price: "$45.00",
    status: "upcoming",
    busOperator: "Greyhound Elite",
    type: "AC Sleeper"
  },
  {
    id: "TIC-8812",
    origin: "Washington DC",
    destination: "New York, NY",
    date: "Sep 15, 2023",
    departureTime: "04:00 PM",
    arrivalTime: "08:30 PM",
    seat: "4C",
    price: "$38.00",
    status: "completed",
    busOperator: "MegaBus",
    type: "Semi-Sleeper"
  }
];

// --- Sub-Components ---

const NavItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <button className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}>
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string | number, colorClass: string }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
      <Icon className={colorClass} size={24} />
    </div>
    <div>
      <p className="text-sm text-slate-400 font-medium">{label}</p>
      <h3 className="text-xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const TicketCard = ({ ticket }: { ticket: Ticket }) => (
  <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
    {/* Status Indicator Strip */}
    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${ticket.status === 'upcoming' ? 'bg-indigo-500' : 'bg-slate-300'}`} />
    
    <div className="p-5 flex flex-col md:flex-row gap-6 items-center">
      {/* Date & Time Block */}
      <div className="flex flex-col items-center justify-center min-w-[80px] text-center">
        <span className="text-2xl font-bold text-slate-800">{ticket.departureTime.split(' ')[0]}</span>
        <span className="text-xs font-bold text-slate-400 uppercase">{ticket.departureTime.split(' ')[1]}</span>
        <div className="h-px w-8 bg-slate-200 my-2"></div>
        <span className="text-sm font-medium text-slate-500">{ticket.date.split(',')[0]}</span>
      </div>

      {/* Route Visual */}
      <div className="flex-1 w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-lg text-slate-800">{ticket.origin}</span>
          <div className="flex-1 mx-4 flex items-center justify-center relative">
             <div className="h-[2px] w-full bg-slate-100 absolute"></div>
             <Bus className="text-indigo-500 relative bg-white px-1" size={20} />
          </div>
          <span className="font-bold text-lg text-slate-800 text-right">{ticket.destination}</span>
        </div>
        
        <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
          <span>{ticket.busOperator}</span>
          <span>{ticket.type}</span>
        </div>
        
        <div className="mt-4 flex gap-3">
          <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold border border-slate-100">
            Seat {ticket.seat}
          </span>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${ticket.status === 'upcoming' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
            {ticket.status === 'upcoming' ? 'Scheduled' : 'Completed'}
          </span>
        </div>
      </div>

      {/* Ticket Tear-off Visual / QR */}
      <div className="hidden md:block w-px h-24 border-l-2 border-dashed border-slate-200 mx-2 relative">
        <div className="absolute -top-6 -left-2 w-4 h-4 bg-slate-50 rounded-full"></div>
        <div className="absolute -bottom-6 -left-2 w-4 h-4 bg-slate-50 rounded-full"></div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 min-w-[100px]">
        <QrCode className="text-slate-800 opacity-80" size={48} />
        <span className="text-lg font-bold text-indigo-600">{ticket.price}</span>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

export default function BusProfilePage() {
  const [activeTab, setActiveTab] = useState<'trips' | 'wallet'>('trips');

  return (
    <div className="min-h-screen bg-[#BDD9A9] font-sans text-slate-600 flex justify-center p-4 md:p-8">
      
      {/* Main Container */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar (Navigation) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
              {currentUser.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{currentUser.name}</h2>
            <p className="text-sm text-slate-400 mb-4">{currentUser.email}</p>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {currentUser.tier} Member
            </span>
          </div>

          <nav className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-2">
            <NavItem icon={User} label="My Profile" />
            <NavItem icon={Bus} label="My Trips" active />
            <NavItem icon={CreditCard} label="Wallet & Cards" />
            <NavItem icon={Settings} label="Settings" />
            <div className="pt-4 mt-4 border-t border-slate-100">
              <NavItem icon={LogOut} label="Log Out" />
            </div>
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Header & Stats Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Welcome back, Alex! 👋</h1>
              <p className="text-slate-400">Here is your travel summary.</p>
            </div>
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
              Book New Trip
            </button>
          </div>

          {/* Bento Grid Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              icon={Trophy} 
              label="Reward Points" 
              value={currentUser.points} 
              colorClass="text-amber-500 bg-amber-500"
            />
            <StatCard 
              icon={MapPin} 
              label="Total Trips" 
              value={currentUser.totalTrips} 
              colorClass="text-indigo-500 bg-indigo-500"
            />
            <StatCard 
              icon={Leaf} 
              label="Carbon Saved" 
              value={`${currentUser.carbonSaved} kg`} 
              colorClass="text-emerald-500 bg-emerald-500"
            />
          </div>

          {/* Content Tabs */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
            <div className="border-b border-slate-100 p-2 flex gap-2">
              <button 
                onClick={() => setActiveTab('trips')}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'trips' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Upcoming & Past Trips
              </button>
              <button 
                onClick={() => setActiveTab('wallet')}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'wallet' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Payment Methods
              </button>
            </div>

            <div className="p-6 space-y-6 bg-slate-50/50 h-full">
              {activeTab === 'trips' ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="font-bold text-slate-800 text-lg">Upcoming Journey</h3>
                     <span className="text-xs font-bold text-indigo-500 uppercase cursor-pointer hover:underline">View All</span>
                  </div>
                  {/* Filter upcoming tickets */}
                  {tickets.filter(t => t.status === 'upcoming').map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}

                  <div className="flex items-center justify-between mt-8 mb-2">
                     <h3 className="font-bold text-slate-800 text-lg">Recent History</h3>
                  </div>
                   {/* Filter past tickets */}
                  {tickets.filter(t => t.status !== 'upcoming').map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </>
              ) : (
                 <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <CreditCard size={48} className="mb-4 opacity-20" />
                    <p>Wallet settings would go here.</p>
                 </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}