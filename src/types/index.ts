export interface Bus {
    id: string;
    name: string;
    plateNumber: string;
    type: string;
    price: number;
    seats: Seat[];
}

export interface Seat {
    id: string;
    seatNumber: string;
    isBooked: boolean;
    busId: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}
