export interface Bus {
    id: string;
    name: string;
    registrationNumber: string;
    type: string;
    capacity: number;
}

export interface Route {
    id: string;
    origin: string;
    destination: string;
    estimatedHours: number | null;
}

export interface Schedule {
    id: string;
    departureTime: string;
    arrivalTime: string;
    fare: number;
    origin: string;
    destination: string;
    busName: string;
    registrationNumber: string;
    busId: string;
    routeId: string;
    bus?: Bus;
    route?: Route;
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