// Shared event names
export const SocketNamespaces = {
  Seats: '/seats',
} as const;

export const SeatEvents = {
  JoinBus: 'join-bus',
  SeatUpdate: 'seat-update',
} as const;

// Shared DTO types
export type SeatDTO = {
  id: string;
  seatNumber: string;
  isBooked: boolean;
};

export type BusDTO = {
  id: string;
  name: string;
  number: string;
  seats?: SeatDTO[];
};

export type BookingDTO = {
  id: string;
  busId: string;
  seatId: string;
  status: 'CONFIRMED' | 'CANCELED';
};

export type UserRole = 'USER' | 'ADMIN';

