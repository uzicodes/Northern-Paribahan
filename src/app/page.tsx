"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeroDatePicker from '@/components/HeroDatePicker';
import {
    ShieldCheck, Ban, Clock, CalendarRange,
    MapPin, ArrowRight, Star, ChevronDown,
    Headphones, CheckCircle2, Zap,
    Navigation, Bus, PhoneCall, MessageSquare, Sparkles, Shield,
    HelpCircle, Users
} from 'lucide-react';

import { toast } from 'sonner';

type SearchState = {
    dateOfJourney: Date;
    fromValue: string;
    toValue: string;
    showFromDropdown: boolean;
    showToDropdown: boolean;
};

function searchReducer(state: SearchState, action: Partial<SearchState>): SearchState {
    return { ...state, ...action };
}

const LOCATIONS = [
    'Dinajpur',
    'Bogura',
    'Dhaka',
    'Sylhet',
    'Khulna',
    'Barisal',
    'Rajshahi',
    'Chittagong',
    "Cox's Bazar"
];

const POPULAR_ROUTES = [
    {
        from: 'Dhaka',
        to: 'Bogura',
        duration: '5h 30m',
        fare: 850,
        type: 'AC & Non-AC',
        departures: '18 Daily Departures',
    },
    {
        from: 'Dhaka',
        to: 'Rangpur',
        duration: '7h 00m',
        fare: 1100,
        type: 'AC Sleeper / Luxury',
        departures: '12 Daily Departures',
    },
    {
        from: 'Rajshahi',
        to: 'Dhaka',
        duration: '6h 00m',
        fare: 750,
        type: 'Express Coach',
        departures: '14 Daily Departures',
    },
    {
        from: 'Bogura',
        to: 'Dhaka',
        duration: '5h 30m',
        fare: 900,
        type: 'Multi-Axle Volvo',
        departures: '16 Daily Departures',
    },
    {
        from: 'Bogura',
        to: 'Rangpur',
        duration: '3h 30m',
        fare: 600,
        type: 'Intercity Express',
        departures: '10 Daily Departures',
    },
    {
        from: 'Dhaka',
        to: "Cox's Bazar",
        duration: '8h 30m',
        fare: 1400,
        type: 'Ultra Luxury Sleeper',
        departures: '8 Daily Departures',
    },
];

const WHY_CHOOSE_US = [
    {
        icon: Navigation,
        title: 'Live GPS Fleet Tracking',
        desc: 'Real-time vehicle tracking lets you and your family monitor bus location, speed, and exact estimated arrival.',
        tag: 'Live Tracking',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-100',
    },
    {
        icon: Zap,
        title: 'Interactive Seat Selection',
        desc: 'Choose your desired window, aisle, or sleeper seat directly from our real-time interactive seat grid with instant lock.',
        tag: 'Live Grid',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-100',
    },
    {
        icon: Shield,
        title: 'Certified & Sanitized Coaches',
        desc: 'Multi-axle Volvo & Scania buses sanitized prior to every journey, driven by background-checked highway captains.',
        tag: 'Safety First',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        borderColor: 'border-purple-100',
    },
    {
        icon: Headphones,
        title: '24/7 Dedicated Support',
        desc: 'Our customer care team is available around the clock to assist with booking changes, baggage, and route enquiries.',
        tag: 'Always Here',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-100',
    },
];

const BOOKING_STEPS = [
    {
        step: '01',
        title: 'Search Routes',
        desc: 'Pick your departure city, destination, and journey date to instantly view available bus schedules.',
        icon: MapPin,
    },
    {
        step: '02',
        title: 'Pick Your Seat',
        desc: 'Browse bus coach models, view seat layouts, and pick your favorite seats in real-time.',
        icon: Bus,
    },
    {
        step: '03',
        title: 'Instant Confirmation',
        desc: 'Pay securely via bKash, Nagad, or Cards and receive your digital e-ticket immediately via SMS & email.',
        icon: CheckCircle2,
    },
];

const TESTIMONIALS = [
    {
        name: 'Tanvir Hossain',
        route: 'Dhaka to Bogura',
        rating: 5,
        comment: 'The smoothest ride I have had on the northern highway. The Volvo coach departed on the dot, AC was perfect, and the seats were plush.',
        date: 'Travelled Feb 2026',
    },
    {
        name: 'Dr. Nusrat Jahan',
        route: 'Dhaka to Rangpur',
        rating: 5,
        comment: 'Booked the AC Sleeper with my family. Spotlessly clean bedding, quiet cabin, and courteous staff. The online seat booking was effortless!',
        date: 'Travelled Jan 2026',
    },
    {
        name: 'Mahmudur Rahman',
        route: 'Rajshahi to Dhaka',
        rating: 5,
        comment: 'Northern Paribahan is my trusted operator for business trips. Never delayed, smooth driving through the highway, and reliable booking.',
        date: 'Travelled Feb 2026',
    },
];

const FAQS = [
    {
        q: 'How do I receive my ticket after online booking?',
        a: 'Immediately after successful payment, your digital ticket (PDF) will be displayed on screen and sent to your registered email address and phone number via SMS. You can also view and download it anytime from your Profile page.',
    },
    {
        q: 'Can I cancel or reschedule my ticket online?',
        a: 'Yes! Tickets can be cancelled or rescheduled up to 6 hours before departure from your Profile dashboard or by reaching out to our 24/7 passenger helpline.',
    },
    {
        q: 'What luggage allowance is permitted per passenger?',
        a: 'Each ticket includes up to 20kg of standard luggage in the secure undercarriage luggage hold, plus one small personal handbag or laptop bag inside the passenger cabin.',
    },
    {
        q: 'How early should I arrive at the boarding terminal?',
        a: 'We strongly advise passengers to report to the boarding counter at least 20–30 minutes prior to the scheduled departure time for baggage tagging and verification.',
    },
    {
        q: 'Which payment methods can I use to book?',
        a: 'We accept all major mobile wallets (bKash, Nagad, Rocket, Upay) as well as Visa, Mastercard, and internet banking via SSL encrypted payment gateway.',
    },
];

export default function Page() {
    const router = useRouter();
    const [state, dispatch] = React.useReducer(searchReducer, {
        dateOfJourney: new Date(),
        fromValue: '',
        toValue: '',
        showFromDropdown: false,
        showToDropdown: false,
    });
    const { dateOfJourney, fromValue, toValue, showFromDropdown, showToDropdown } = state;
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleQuickRouteSelect = (from: string, to: string) => {
        dispatch({ fromValue: from, toValue: to });
        const params = new URLSearchParams();
        params.set('from', from);
        params.set('to', to);
        params.set('date', dateOfJourney.toISOString());
        router.push(`/timetable?${params.toString()}`);
    };

    const filteredFromLocations = LOCATIONS.filter(location =>
        location.toLowerCase().includes(fromValue.toLowerCase()) && location !== toValue
    );

    const filteredToLocations = LOCATIONS.filter(location =>
        location.toLowerCase().includes(toValue.toLowerCase()) && location !== fromValue
    );

    return (
        <section className="w-full flex flex-col items-center justify-end min-h-[340px] relative">
            {/* Lowest layer image */}
            <Image
                src="/1.jpg"
                alt="Hero Layer"
                fill
                sizes="100vw"
                priority
                className="absolute inset-0 z-0 w-full h-full object-cover opacity-80"
                style={{ pointerEvents: 'none', maxHeight: '340px' }}
            />
            <div
                className="absolute inset-0 z-10"
                style={{
                    background: ' center/cover no-repeat',
                    opacity: 0.7,
                    maxHeight: '340px'
                }}
            />

            <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-start px-4 pt-44 sm:pt-52 md:pt-60">
                <div className="w-full flex justify-center items-center -mb-8 mt-16">
                    <div
                        className="rounded-3xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center w-full max-w-3xl gap-2 sm:gap-0"
                        style={{ position: 'relative', backgroundColor: '#EDF5F0' }}
                    >
                        {/* From input */}
                        <div className="flex items-center flex-1 border-b sm:border-b-0 sm:border-r border-gray-200 pr-4 py-2 sm:py-0 relative">
                            <Image width={20} height={20} src="https://img.icons8.com/ios-filled/50/get-on-bus.png" alt="get-on-bus" className="mr-2" unoptimized />
                            <input
                                type="text"
                                placeholder="From"
                                aria-label="Departure location (From)"
                                value={fromValue}
                                onChange={(e) => dispatch({ fromValue: e.target.value })}
                                onFocus={() => dispatch({ showFromDropdown: true })}
                                onBlur={() => setTimeout(() => dispatch({ showFromDropdown: false }), 200)}
                                className="border-2 border-[#c44d4d] outline-none text-base w-full bg-transparent rounded-lg px-3 py-2"
                                style={{ fontSize: 18 }}
                            />
                            {showFromDropdown && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                                    {filteredFromLocations.map((location) => (
                                        <button
                                            type="button"
                                            key={location}
                                            onMouseDown={() => {
                                                dispatch({ fromValue: location, showFromDropdown: false });
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-green-100 cursor-pointer text-base border-none bg-transparent block"
                                            style={{ fontSize: 16 }}
                                        >
                                            {location}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* To input */}
                        <div className="flex items-center flex-1 border-b sm:border-b-0 sm:border-r border-gray-200 pr-4 sm:pl-4 py-2 sm:py-0 relative">
                            <Image width={20} height={20} src="https://img.icons8.com/ios-filled/50/get-off-bus.png" alt="get-off-bus" className="mr-2" unoptimized />
                            <input
                                type="text"
                                placeholder="To"
                                aria-label="Destination location (To)"
                                value={toValue}
                                onChange={(e) => dispatch({ toValue: e.target.value })}
                                onFocus={() => dispatch({ showToDropdown: true })}
                                onBlur={() => setTimeout(() => dispatch({ showToDropdown: false }), 200)}
                                className="border-2 border-[#c44d4d] outline-none text-base w-full bg-transparent rounded-lg px-3 py-2"
                                style={{ fontSize: 18 }}
                            />
                            {showToDropdown && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                                    {filteredToLocations.map((location) => (
                                        <button
                                            type="button"
                                            key={location}
                                            onMouseDown={() => {
                                                dispatch({ toValue: location, showToDropdown: false });
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-green-100 cursor-pointer text-base border-none bg-transparent block"
                                            style={{ fontSize: 16 }}
                                        >
                                            {location}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Date of Journey */}
                        <div className="flex items-center border-b sm:border-b-0 sm:border-r border-gray-200 pr-4 sm:pl-4 py-2 sm:py-0">
                            <div className="text-xs text-gray-500 mr-2">Date of Journey</div>
                            <div className="font-semibold text-base">
                                {dateOfJourney.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="ml-2">
                                <HeroDatePicker selectedDate={dateOfJourney} onDateChange={(date) => dispatch({ dateOfJourney: date })} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center mt-20 mb-12">
                    <button
                        type="button"
                        onClick={() => {
                            if (fromValue && toValue) {
                                const params = new URLSearchParams();
                                params.set('from', fromValue);
                                params.set('to', toValue);
                                params.set('date', dateOfJourney.toISOString());
                                router.push(`/timetable?${params.toString()}`);
                            } else {
                                toast.error('Please select both From and To locations');
                            }
                        }}
                        className="bg-[#c44d4d] text-white font-semibold text-lg rounded-3xl px-6 py-3 shadow flex items-center gap-3"
                        style={{ fontSize: 22 }}
                    >
                        <Image width={28} height={28} src="https://img.icons8.com/sf-black/64/search.png" alt="search" className="mr-2" unoptimized /> Search Buses
                    </button>
                </div>
            </div>

            {/* Promo & What's New Section */}
            <div className="w-full flex flex-col items-center px-2 sm:px-0">


                {/* Promo Cards */}
                <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
                    {/* Card 1 */}
                    <div className="p-6 flex flex-col justify-between min-h-[110px] shadow-md relative rounded-2xl group transition-transform transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg cursor-pointer" style={{ backgroundColor: '#B4EDD0' }}>
                        <div className="font-bold text-lg mt-2 mb-1">Save up to Tk 500 on bkash payments</div>
                        <div className="text-sm text-gray-700 mb-2">Valid till 31 Dec</div>
                        <div className="flex items-center mt-auto">
                            <span className="bg-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-sm shadow transition-transform duration-200 group-hover:scale-105">
                                <Image width={20} height={20} src="https://img.icons8.com/color-glass/48/discount--v1.png" alt="discount" className="inline-block" unoptimized />BK500
                            </span>
                        </div>
                        <div className="absolute bottom-2 left-4 text-[8px] italic text-gray-700">*conditions apply</div>
                        <Image width={80} height={80} src="/bkash.png" alt="bKash logo" className="absolute bottom-0 right-4 w-20 h-20 object-contain transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                    {/* Card 2 */}
                    <div className="p-6 flex flex-col justify-between min-h-[110px] shadow-md relative rounded-2xl group transition-transform transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg cursor-pointer" style={{ backgroundColor: '#B4EDD0' }}>
                        <div className="font-bold text-lg mt-2 mb-1">Get upto 10% off on Return tickets</div>
                        <div className="text-sm text-gray-700 mb-2">Valid till 30 Nov</div>
                        <div className="flex items-center mt-auto">
                            <span className="bg-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-sm shadow transition-transform duration-200 group-hover:scale-105">
                                <Image width={20} height={20} src="https://img.icons8.com/color-glass/48/discount--v1.png" alt="discount" className="inline-block" unoptimized />RETURN10
                            </span>
                        </div>
                        <div className="absolute bottom-2 left-4 text-[8px] italic text-gray-700">*conditions apply</div>
                        <Image width={80} height={80} src="/return.jpg" alt="return" className="absolute bottom-0 right-4 w-20 h-20 object-contain transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                    {/* Card 3 */}
                    <div className="p-6 flex flex-col justify-between min-h-[110px] shadow-md relative rounded-2xl group transition-transform transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg cursor-pointer" style={{ backgroundColor: '#B4EDD0' }}>
                        <div className="font-bold text-lg mt-2 mb-1">Save up to Tk 300 on selected hotels in Cox's Bazar</div>
                        <div className="text-sm text-gray-700 mb-2">Valid till 30 Nov</div>
                        <div className="flex items-center mt-auto">
                            <span className="bg-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-sm shadow transition-transform duration-200 group-hover:scale-105">
                                <Image width={20} height={20} src="https://img.icons8.com/color-glass/48/discount--v1.png" alt="discount" className="inline-block" unoptimized />HOTEL300
                            </span>
                        </div>
                        <div className="absolute bottom-2 left-4 text-[8px] italic text-gray-700">*conditions apply</div>
                        <Image width={112} height={112} src="/hotels.jpg" alt="hotels" className="absolute bottom-0 right-4 w-28 h-28 object-contain transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                    {/* Card 4 */}
                    <div className="p-6 flex flex-col justify-between min-h-[110px] shadow-md relative rounded-2xl group transition-transform transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg cursor-pointer" style={{ backgroundColor: '#B4EDD0' }}>
                        <div className="font-bold text-lg mt-2 mb-1">Save upto Tk 500 with BRAC Bank Cards</div>
                        <div className="text-sm text-gray-700 mb-2">Valid till 15 Dec</div>
                        <div className="flex items-center mt-auto">
                            <span className="bg-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-sm shadow transition-transform duration-200 group-hover:scale-105">
                                <Image width={20} height={20} src="https://img.icons8.com/color-glass/48/discount--v1.png" alt="discount" className="inline-block" unoptimized />BB500
                            </span>
                        </div>
                        <div className="absolute bottom-2 left-4 text-[8px] italic text-gray-700">*conditions apply</div>
                        <Image width={80} height={80} src="/brac_bank.png" alt="brac bank logo" className="absolute bottom-0 right-4 w-20 h-20 object-contain transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                </div>

                {/* What's New Section */}
                <div className="w-full max-w-7xl mt-8">
                    <h2 className="text-2xl font-bold mb-4">What's new</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Card 1 */}
                        <div className="rounded-2xl bg-[#2B2D42] p-6 flex flex-col justify-between min-h-[90px] shadow-md text-white relative overflow-hidden group">
                            <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform duration-300" />
                            <div className="relative z-10">
                                <div className="mb-2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div className="font-bold text-base mb-1">Maximum savings on Cashless payments.</div>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="rounded-2xl bg-[#8B1E3F] p-6 flex flex-col justify-between min-h-[90px] shadow-md text-white relative overflow-hidden group">
                            <Ban className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform duration-300" />
                            <div className="relative z-10">
                                <div className="mb-2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <Ban className="w-6 h-6" />
                                </div>
                                <div className="font-bold text-base mb-1">Free Cancellation</div>
                                <div className="text-sm mb-2 opacity-90">Get 100% refund on cancellation</div>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="rounded-2xl bg-[#F8E7E7] p-6 flex flex-col justify-between min-h-[90px] shadow-md text-black relative overflow-hidden group">
                            <Clock className="absolute -right-4 -bottom-4 w-24 h-24 text-black/5 group-hover:scale-110 transition-transform duration-300" />
                            <div className="relative z-10">
                                <div className="mb-2 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center backdrop-blur-sm">
                                    <Clock className="w-6 h-6 text-[#2B2D42]" />
                                </div>
                                <div className="font-bold text-base mb-1 text-[#2B2D42]">Introducing Bus timetable</div>
                                <div className="text-sm mb-2 text-gray-600">Get local bus timings between cities in your state</div>
                            </div>
                        </div>
                        {/* Card 4 */}
                        <div className="rounded-2xl bg-[#F1F6FB] p-6 flex flex-col justify-between min-h-[90px] shadow-md text-[#2B2D42] relative overflow-hidden group">
                            <CalendarRange className="absolute -right-4 -bottom-4 w-24 h-24 text-black/5 group-hover:scale-110 transition-transform duration-300" />
                            <div className="relative z-10">
                                <div className="mb-2 w-10 h-10 rounded-full bg-white/60 flex items-center justify-center backdrop-blur-sm shadow-sm">
                                    <CalendarRange className="w-6 h-6 text-[#2B2D42]" />
                                </div>
                                <div className="font-bold text-base mb-1">Flexible Ticketing</div>
                                <div className="text-sm mb-2 text-gray-600">Get amazing benefits on Date Change & Cancellation</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1. Popular Bus Routes Section */}
                <div className="w-full max-w-7xl mt-14">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#c44d4d] bg-red-100/60 px-3 py-1 rounded-full inline-block mb-2">
                                Top Destinations
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Popular Bus Routes</h2>
                            <p className="text-slate-600 text-sm mt-1">Guaranteed daily departures on our premier highway corridors</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.push('/timetable')}
                            className="text-sm font-semibold text-slate-800 hover:text-[#c44d4d] flex items-center gap-1 transition-colors self-start sm:self-auto"
                        >
                            View All Schedules <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {POPULAR_ROUTES.map((route, idx) => (
                            <div
                                key={idx}
                                className="bg-gradient-to-br from-[#172144] to-[#212c58] rounded-2xl p-5 shadow-lg border border-[#2c3a72] hover:border-[#FCA311]/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group text-white"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FCA311]/15 text-[#FCA311] border border-[#FCA311]/30">
                                            {route.type}
                                        </span>
                                        <span className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                                            <Clock size={13} className="text-[#FCA311]" /> {route.duration}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg font-bold text-white">{route.from}</span>
                                        <ArrowRight size={16} className="text-[#FCA311] group-hover:translate-x-1 transition-transform" />
                                        <span className="text-lg font-bold text-white">{route.to}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-4">{route.departures}</p>
                                </div>

                                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-2">
                                    <div>
                                        <span className="text-[11px] text-slate-400 uppercase font-medium">Starts from</span>
                                        <p className="text-2xl font-black text-[#FCA311]">৳{route.fare}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickRouteSelect(route.from, route.to)}
                                        className="bg-[#c44d4d] hover:bg-[#a93b3b] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5"
                                    >
                                        Book Seat <ArrowRight size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Why Choose Northern Paribahan */}
                <div className="w-full max-w-7xl mt-14">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full inline-block mb-2">
                            The Northern Standard
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why Travel With Northern Paribahan?</h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-2">
                            Engineered for uncompromising safety, absolute punctuality, and passenger convenience at every step.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {WHY_CHOOSE_US.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className={`w-12 h-12 rounded-2xl ${item.bgColor} ${item.textColor} flex items-center justify-center mb-5`}>
                                            <IconComponent size={24} />
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.bgColor} ${item.textColor} inline-block mb-2`}>
                                            {item.tag}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Easy 3-Step Booking Guide */}
                <div className="w-full max-w-7xl mt-14 bg-gradient-to-br from-[#172144] to-[#1E2952] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#FCA311] bg-white/10 px-3 py-1 rounded-full inline-block mb-2">
                                Simple & Frictionless
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold">How to Book Your Ticket in 3 Steps</h2>
                            <p className="text-slate-300 text-sm sm:text-base mt-2">
                                Your next highway journey is just a few clicks away.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {BOOKING_STEPS.map((step, idx) => {
                                const StepIcon = step.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 relative flex flex-col justify-between"
                                    >
                                        <span className="text-4xl font-black text-white/20 absolute top-4 right-6 select-none font-mono">
                                            {step.step}
                                        </span>
                                        <div>
                                            <div className="w-12 h-12 rounded-xl bg-[#FCA311] text-[#172144] flex items-center justify-center mb-5 font-bold shadow-lg">
                                                <StepIcon size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                                            <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 4. Passenger Testimonials */}
                <div className="w-full max-w-7xl mt-14">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
                            Verified Travelers
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What Our Passengers Say</h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-2">
                            Trusted by thousands of intercity commuters and travelers every day.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((review, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-1 mb-3 text-amber-400">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} size={16} fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-700 italic leading-relaxed mb-6">
                                        &ldquo;{review.comment}&rdquo;
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                                        <p className="text-xs text-slate-500">{review.route}</p>
                                    </div>
                                    <span className="text-[11px] text-slate-400">{review.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Frequently Asked Questions (FAQ) Accordion */}
                <div className="w-full max-w-4xl mt-14">
                    <div className="text-center mb-8">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-700 bg-slate-200 px-3 py-1 rounded-full inline-block mb-2">
                            Got Questions?
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
                        <p className="text-slate-600 text-sm mt-1">Everything you need to know about booking, cancellation, and boarding.</p>
                    </div>

                    <div className="space-y-3">
                        {FAQS.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-[#c44d4d] transition-colors"
                                    >
                                        <span className="text-base">{faq.q}</span>
                                        <ChevronDown
                                            size={20}
                                            className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#c44d4d]' : ''}`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 6. Support & Contact Help Banner */}
                <div className="w-full max-w-7xl mt-14 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#c44d4d] flex items-center justify-center shrink-0">
                            <Headphones size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Need Assistance With Your Booking?</h3>
                            <p className="text-sm text-slate-600 mt-1">Our customer experience agents are available 24/7 across all districts.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href="tel:+8801700000000"
                            className="bg-[#172144] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#c44d4d] transition-all flex items-center gap-2 shadow"
                        >
                            <PhoneCall size={16} /> Hotline: 16423
                        </a>
                        <button
                            type="button"
                            onClick={() => router.push('/timetable')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                        >
                            Browse All Buses <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Extra spacing under last row */}
            <div className="pb-16"></div>
        </section>
    );
}

