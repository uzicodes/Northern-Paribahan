import { Resend } from "resend";
import { TicketData, SendEmailResult } from "./types";
import { getTicketEmailHtml } from "./templates";
import { generateTicketPdfBuffer } from "./ticketPdf";

export * from "./types";
export * from "./templates";
export { generateTicketPdfBuffer } from "./ticketPdf";

/**
 * Lazily instantiates the Resend client to prevent runtime errors
 * if environment variables are evaluated asynchronously.
 */
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "Missing RESEND_API_KEY environment variable. Please verify your .env / .env.local file."
    );
  }
  return new Resend(apiKey);
}

/**
 * Dispatches an official Northern Paribahan ticket confirmation email
 * with the generated PDFKit boarding pass attachment via Resend.
 */
export async function sendTicketEmail(
  recipientEmail: string,
  ticketData: TicketData
): Promise<SendEmailResult> {
  const dispatchStartTime = Date.now();
  console.log(`\n================== [EMAIL DISPATCH START] ==================`);
  console.log(`[Email Dispatch] Recipient: ${recipientEmail}`);
  console.log(`[Email Dispatch] Ticket ID: ${ticketData.ticketId}`);
  console.log(`[Email Dispatch] Route: ${ticketData.origin} -> ${ticketData.destination}`);
  console.log(`[Email Dispatch] Seats: ${ticketData.seats.join(", ")}`);
  console.log(`[Email Dispatch] Total Fare: ৳${ticketData.totalFare}`);

  try {
    // 1. Validate recipient email
    if (!recipientEmail || !recipientEmail.includes("@")) {
      const err = `Invalid recipient email address: "${recipientEmail}"`;
      console.error(`[Email Dispatch ERROR] ${err}`);
      return { success: false, error: err };
    }

    // 2. Generate PDF buffer using PDFKit
    console.log(`[Email Dispatch] Generating PDFKit boarding pass buffer...`);
    const pdfBuffer = await generateTicketPdfBuffer(ticketData);
    console.log(`[Email Dispatch] PDF buffer generated successfully (${pdfBuffer.length} bytes).`);

    // 3. Initialize Resend client
    const resend = getResendClient();

    // 4. Dispatch email via Resend
    const sender = "Northern Paribahan <tickets@send.utshochowdhury.me>";
    const subject = `Booking Confirmed: ${ticketData.origin} to ${ticketData.destination} [${ticketData.ticketId.toUpperCase()}]`;

    console.log(`[Email Dispatch] Sending email via Resend from: ${sender}`);
    const { data, error } = await resend.emails.send({
      from: sender,
      to: recipientEmail,
      subject: subject,
      html: getTicketEmailHtml(ticketData),
      attachments: [
        {
          filename: `Ticket-${ticketData.ticketId.toUpperCase()}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    const elapsed = Date.now() - dispatchStartTime;

    if (error) {
      console.error(`[Email Dispatch FAILED] Resend returned an error (${elapsed}ms):`, error);
      console.error(`[Email Dispatch FAILED] Error message: ${error.message}`);
      return { success: false, error: error.message };
    }

    console.log(`[Email Dispatch SUCCESS] Dispatched successfully in ${elapsed}ms! Email ID: ${data?.id}`);
    console.log(`================== [EMAIL DISPATCH END] ====================\n`);
    return { success: true, data };
  } catch (err: any) {
    const elapsed = Date.now() - dispatchStartTime;
    console.error(`[Email Dispatch EXCEPTION] Unexpected error after ${elapsed}ms:`, err);
    if (err?.stack) {
      console.error(`[Email Dispatch STACK TRACE]:\n`, err.stack);
    }
    console.log(`================== [EMAIL DISPATCH END (ERROR)] ============\n`);
    return { success: false, error: err?.message || String(err) };
  }
}
