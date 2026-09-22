export type BookingStatus = 'PAID' | 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'FAILED';

export interface VerifiedTicket {
  ticketId: string;
  transactionId?: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone?: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  busModel: string;
  busTier: string;
  busReg: string;
  seats: string[];
  totalFare: number;
  status: BookingStatus;
  createdAt: string;
}

export type VerifyTicketResponse =
  | {
      success: true;
      data: VerifiedTicket;
    }
  | {
      success: false;
      error: string;
    };

