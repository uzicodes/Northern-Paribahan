import { NextResponse } from "next/server";
import { sendTicketEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get("to");

  if (!to) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Please provide a recipient email address: /api/test-email?to=your-email@example.com" 
      },
      { status: 400 }
    );
  }

  const sampleTicketData = {
    ticketId: "NP-BK-98421",
    passengerName: "Tariqul Islam",
    passengerEmail: to,
    busModel: "Scania K360 Multi-Axle",
    busReg: "DHK-METRO-11-2041",
    busTier: "BUSINESS",
    origin: "Dhaka",
    destination: "Dinajpur",
    departureTime: "08:00 AM, Sun, Sep 20",
    arrivalTime: "02:00 PM, Sun, Sep 20",
    seats: ["A1", "A2"],
    totalFare: 1700,
  };

  const result = await sendTicketEmail(to, sampleTicketData);

  if (!result.success) {
    return NextResponse.json(
      { 
        success: false, 
        error: result.error 
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Ticket PDF generated and email dispatched successfully to ${to}!`,
    resendData: result.data,
  });
}