'use client';
import React from 'react';
import { ChevronRight, Bus, Calendar, MapPin } from 'lucide-react';

export interface BookingItem {
    id: string;
    status: string;
    createdAt: string;
    seatNumber: string;
    busName: string;
    busType: string;
    busPlate: string;
    price: number;
}

export function SidebarButton({ icon: Icon, label, active, onClick }: {
    icon: any; label: string; active: boolean; onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
            {active && <ChevronRight size={16} className="ml-auto" />}
        </button>
    );
}

export function StatCard({ icon: Icon, label, value, colorClass, bgClass }: {
    icon: any; label: string; value: string | number; colorClass: string; bgClass: string;
}) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-full ${bgClass}`}>
                <Icon className={colorClass} size={24} />
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            </div>
        </div>
    );
}

export function ProfileField({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100">
            <div className="p-2.5 rounded-full bg-indigo-50">
                <Icon size={18} className="text-indigo-500" />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-slate-700">{value}</p>
            </div>
        </div>
    );
}

export function BookingCard({ booking, isUpcoming = false }: { booking: BookingItem; isUpcoming?: boolean }) {
    const date = new Date(booking.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Status stripe */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isUpcoming ? 'bg-emerald-500' : 'bg-slate-300'}`} />

            <div className="p-5 pl-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Bus icon */}
                <div className={`p-3 rounded-xl ${isUpcoming ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                    <Bus size={24} className={isUpcoming ? 'text-emerald-600' : 'text-slate-400'} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800">{booking.busName}</h4>
                    <p className="text-sm text-slate-400">{booking.busType} • Plate: {booking.busPlate}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Calendar size={12} /> {formattedDate}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <MapPin size={12} /> Seat {booking.seatNumber}
                        </span>
                    </div>
                </div>

                {/* Price & Status */}
                <div className="flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-slate-800">৳{booking.price}</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${isUpcoming
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                        {booking.status}
                    </span>
                </div>
            </div>
        </div>
    );
}
