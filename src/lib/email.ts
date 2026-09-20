import { Resend } from "resend";
import { generateTicketPdfBuffer, TicketData } from "@/lib/ticketPdf";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTicketEmail(recipientEmail: string, ticketData: TicketData) {
  try {
    const pdfBuffer = await generateTicketPdfBuffer(ticketData);

    const { data, error } = await resend.emails.send({
      from: "Northern Paribahan <tickets@send.utshochowdhury.me>",
      to: recipientEmail,
      subject: `Booking Confirmed: ${ticketData.origin} to ${ticketData.destination} [${ticketData.ticketId.toUpperCase()}]`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1e3a8a; color: white; padding: 20px;">
            <h1 style="margin: 0; font-size: 20px;">Northern Paribahan</h1>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #93c5fd;">Booking Confirmation</p>
          </div>
          <div style="padding: 24px;">
            <p>Dear <strong>${ticketData.passengerName}</strong>,</p>
            <p>Your ticket reservation from <strong>${ticketData.origin}</strong> to <strong>${ticketData.destination}</strong> is confirmed!</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 6px; margin: 18px 0;">
              <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Booking Reference:</strong> ${ticketData.ticketId.toUpperCase()}</p>
              <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Departure:</strong> ${ticketData.departureTime}</p>
              <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Seats:</strong> ${ticketData.seats.join(", ")}</p>
              <p style="margin: 0; font-size: 14px;"><strong>Total Paid:</strong> BDT ${ticketData.totalFare}</p>
            </div>

            <p style="font-size: 14px; color: #475569;">
              Your official boarding ticket is attached to this email as a PDF.
            </p>
            <br />
            <p style="margin: 0; font-size: 13px; color: #64748b;">Safe Travels,<br/>Northern Paribahan Team</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Ticket-${ticketData.ticketId.toUpperCase()}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend API error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Failed to generate or send ticket email:", err);
    return { success: false, error: err?.message || String(err) };
  }
}