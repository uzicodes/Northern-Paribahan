export type BusTier = 'PREMIUM' | 'BUSINESS' | 'ECONOMY';

export interface Bus {
    id: string;
    modelName: string;
    registrationNumber: string;
    tier: BusTier;
    capacity: number;
    depotId?: string;
    // Legacy aliases for backward compatibility
    name?: string;
    type?: string;
}

export interface Fare {
    id: string;
    price: number;
    tier: BusTier;
    origin: string;
    destination: string;
    routeId: string;
}

export interface Route {
    id: string;
    routeId?: string;
    origin: string;
    destination: string;
    estimatedHours: number | null;
    fares?: Fare[];
}

export interface Schedule {
    id: string;
    departureTime: string;
    arrivalTime: string;
    origin: string;
    destination: string;
    busName: string;
    registrationNumber: string;
    busId: string;
    routeId: string;
    bus?: Bus;
    route?: Route;
    fare?: number; // Dynamically computed from route.fares based on bus.tier
}

export interface Ticket {
    id: string;
    seatNumber: string;
    scheduleId: string;
    bookingId: string;
}

export interface Booking {
    id: string;
    userId: string;
    scheduleId: string;
    totalFare: number;
    status: string;
    transactionId: string | null;
    tickets: Ticket[];
    schedule?: Schedule;
    createdAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

/**
 * Represents a seat in the seat-selection grid.
 * In the new schema, seats are dynamically generated from bus.capacity
 * and their booked status is derived from Ticket records for a given schedule.
 */
export interface SeatDisplay {
    seatNumber: string;
    isBooked: boolean;
}