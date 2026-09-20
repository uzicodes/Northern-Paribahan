import { TicketData } from "./types";

/**
 * Generates the responsive HTML email template for confirmed bus ticket bookings.
 */
export function getTicketEmailHtml(ticket: TicketData): string {
  const formattedFare = `BDT Tk ${Number(ticket.totalFare || 0).toLocaleString()}`;
  const seatList = Array.isArray(ticket.seats) ? ticket.seats.join(", ") : "N/A";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #172144; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">Northern Paribahan</h1>
        <p style="color: #fca311; margin: 6px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase;">Official E-Ticket Confirmation</p>
      </div>
      
      <div style="padding: 24px 28px; color: #334155; line-height: 1.6;">
        <p style="font-size: 16px; margin-top: 0; color: #0f172a;">Dear <strong>${ticket.passengerName}</strong>,</p>
        <p>Thank you for choosing <strong>Northern Paribahan</strong>. Your highway coach reservation has been verified and confirmed.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Booking Reference:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #172144; text-align: right;">${ticket.ticketId.toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Route:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${ticket.origin} &rarr; ${ticket.destination}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Departure:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${ticket.departureTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Seats Reserved:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #2563eb; text-align: right;">${seatList}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Coach / Tier:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;">${ticket.busModel} (${ticket.busTier})</td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 10px 0 0 0; color: #166534; font-weight: 700;">Total Paid:</td>
              <td style="padding: 10px 0 0 0; font-weight: 800; color: #166534; font-size: 16px; text-align: right;">${formattedFare}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; margin-bottom: 0;">Your official digital boarding pass is attached to this email as a PDF. Please present it upon boarding.</p>
      </div>

      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">Have questions? Contact our 24/7 passenger helpline or visit your profile dashboard.</p>
        <p style="margin: 4px 0 0 0; font-weight: 600; color: #172144;">&copy; ${new Date().getFullYear()} Northern Paribahan Ltd. All rights reserved.</p>
      </div>
    </div>
  `;
}

