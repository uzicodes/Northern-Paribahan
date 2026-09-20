import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { createTicketDocument, TicketData } from "@/components/TicketPDF";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTicketEmail(recipientEmail: string, ticketData: TicketData) {
  try {
    // 1. Generate PDF buffer directly from the Document tree
    const pdfBuffer = await renderToBuffer(createTicketDocument(ticketData));

    // 2. Dispatch the email via Resend
    const response = await resend.emails.send({
      from: "Northern Paribahan <tickets@send.utshochowdhury.me>",
      to: recipientEmail,
      subject: `Booking Confirmed: ${ticketData.origin} to ${ticketData.destination} [${ticketData.ticketId.toUpperCase()}]`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #2563eb;">Your Booking is Confirmed!</h2>
          <p>Dear ${ticketData.passengerName},</p>
          <p>Thank you for choosing Northern Paribahan. Your booking from <strong>${ticketData.origin}</strong> to <strong>${ticketData.destination}</strong> is complete.</p>
          <p><strong>Seats:</strong> ${ticketData.seats.join(", ")}</p>
          <p><strong>Departure:</strong> ${ticketData.departureTime}</p>
          <p>We have attached your official E-Ticket PDF to this email. Please keep it ready at boarding.</p>
          <br/>
          <p>Safe Travels,<br/>Northern Paribahan Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `Ticket-${ticketData.ticketId.toUpperCase()}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return { success: true, data: response };
  } catch (error) {
    console.error("Failed to generate or send ticket email:", error);
    return { success: false, error };
  }
}