export interface Bus {
    id: string;
    name: string;
    registrationNumber: string;
    type: string;
    capacity: number;
}

export interface Ticket {
    id: string;
    seatNumber: string;
    scheduleId: string;
    bookingId: string | null;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}