import { Resend } from "resend";
import { TicketData, SendEmailResult } from "./types";
import { getTicketEmailHtml } from "./templates";
import { generateTicketPdfBuffer } from "./ticketPdf";

export * from "./types";
export * from "./templates";
export { generateTicketPdfBuffer } from "./ticketPdf";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Dispatches an official Northern Paribahan ticket confirmation email
 * with the generated PDFKit boarding pass attachment via Resend.
 */
export async function sendTicketEmail(
  recipientEmail: string,
  ticketData: TicketData
): Promise<SendEmailResult> {
  try {
    // 1. Generate PDF buffer using PDFKit
    const pdfBuffer = await generateTicketPdfBuffer(ticketData);

    // 2. Dispatch email via Resend
    const { data, error } = await resend.emails.send({
      from: "Northern Paribahan <tickets@send.utshochowdhury.me>",
      to: recipientEmail,
      subject: `Booking Confirmed: ${ticketData.origin} to ${ticketData.destination} [${ticketData.ticketId.toUpperCase()}]`,
      html: getTicketEmailHtml(ticketData),
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

