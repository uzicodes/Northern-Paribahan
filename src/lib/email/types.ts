export interface TicketData {
  ticketId: string;
  passengerName: string;
  passengerEmail: string;
  busModel: string;
  busReg: string;
  busTier: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  totalFare: number;
}

export interface SendEmailResult {
  success: boolean;
  data?: any;
  error?: string;
}

