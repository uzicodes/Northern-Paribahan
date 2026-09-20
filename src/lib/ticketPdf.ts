import PDFDocument from "pdfkit";

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


export async function generateTicketPdfBuffer(data: TicketData): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        info: {
          Title: `Ticket-${data.ticketId || "NP"}`,
          Author: "Northern Paribahan",
          Subject: "Official E-Ticket & Boarding Pass",
        },
      });

      const buffers: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err: Error | any) => reject(err));

      const startX = 40;
      const contentWidth = 515;


      // BRANDED HEADER 
      const headerY = 40;
      const headerHeight = 65;

      // Dark Navy Header Background
      doc
        .roundedRect(startX, headerY, contentWidth, headerHeight, 8)
        .fill("#172144");

      // Brand Name & Subtitle
      doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .fillColor("#FFFFFF")
        .text("NORTHERN PARIBAHAN", startX + 16, headerY + 16);

      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#FCA311")
        .text("OFFICIAL E-TICKET & BOARDING PASS", startX + 16, headerY + 39);

      // PNR / Booking Reference Badge 
      const badgeWidth = 140;
      const badgeHeight = 42;
      const badgeX = startX + contentWidth - badgeWidth - 14;
      const badgeY = headerY + 11;

      doc
        .roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 6)
        .fill("#223060");

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#94A3B8")
        .text("BOOKING REFERENCE", badgeX, badgeY + 8, {
          width: badgeWidth,
          align: "center",
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#FFFFFF")
        .text(String(data.ticketId || "NP-00000").toUpperCase(), badgeX, badgeY + 22, {
          width: badgeWidth,
          align: "center",
        });



      // ROUTE & SCHEDULE CARD
      const routeY = 120;
      const routeHeight = 135;

      // Card Background & Border
      doc
        .roundedRect(startX, routeY, contentWidth, routeHeight, 8)
        .fillAndStroke("#F8FAFC", "#E2E8F0");

      // Origin & Destination Row
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#64748B")
        .text("FROM (DEPARTURE TERMINAL)", startX + 16, routeY + 14);

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor("#172144")
        .text(String(data.origin || "Origin"), startX + 16, routeY + 26);

      // Arrow indicator in center
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor("#FCA311")
        .text("----->", startX, routeY + 26, {
          width: contentWidth,
          align: "center",
        });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#64748B")
        .text("TO (ARRIVAL TERMINAL)", startX + contentWidth - 190, routeY + 14, {
          width: 174,
          align: "right",
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor("#172144")
        .text(String(data.destination || "Destination"), startX + contentWidth - 190, routeY + 26, {
          width: 174,
          align: "right",
        });

      // Divider inside route card
      doc
        .moveTo(startX + 16, routeY + 54)
        .lineTo(startX + contentWidth - 16, routeY + 54)
        .strokeColor("#E2E8F0")
        .lineWidth(1)
        .stroke();

      // 4-Column Grid: Departure, Arrival, Coach/Tier, Registration
      const gridY = routeY + 66;
      const colWidth = (contentWidth - 32) / 4;

      // Col 1: Departure Time
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#64748B")
        .text("DEPARTURE TIME", startX + 16, gridY);
      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor("#0F172A")
        .text(String(data.departureTime || "N/A"), startX + 16, gridY + 12, {
          width: colWidth - 8,
        });

      // Col 2: Arrival Time
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#64748B")
        .text("ESTIMATED ARRIVAL", startX + 16 + colWidth, gridY);
      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor("#0F172A")
        .text(String(data.arrivalTime || "N/A"), startX + 16 + colWidth, gridY + 12, {
          width: colWidth - 8,
        });

      // Col 3: Bus Coach & Tier
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#64748B")
        .text("COACH & SERVICE TIER", startX + 16 + colWidth * 2, gridY);
      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor("#0F172A")
        .text(
          `${String(data.busModel || "Coach")} (${String(data.busTier || "Economy")})`,
          startX + 16 + colWidth * 2,
          gridY + 12,
          { width: colWidth - 8 }
        );

      // Col 4: Registration Number
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#64748B")
        .text("REGISTRATION NO.", startX + 16 + colWidth * 3, gridY);
      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor("#0F172A")
        .text(String(data.busReg || "N/A"), startX + 16 + colWidth * 3, gridY + 12, {
          width: colWidth - 8,
        });



      // PASSENGER DETAILS & SEAT ALLOCATION
      const splitY = 270;
      const splitHeight = 125;
      const leftColWidth = 305;
      const rightColWidth = 195;
      const rightColX = startX + contentWidth - rightColWidth;

      // Left Column Card: Passenger Info
      doc
        .roundedRect(startX, splitY, leftColWidth, splitHeight, 8)
        .fillAndStroke("#FFFFFF", "#E2E8F0");

      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor("#172144")
        .text("PASSENGER DETAILS", startX + 14, splitY + 12);

      doc
        .moveTo(startX + 14, splitY + 28)
        .lineTo(startX + leftColWidth - 14, splitY + 28)
        .strokeColor("#F1F5F9")
        .lineWidth(1)
        .stroke();

      const passengerFields = [
        { label: "Primary Passenger:", val: String(data.passengerName || "N/A") },
        { label: "Registered Email:", val: String(data.passengerEmail || "N/A") },
        {
          label: "Total Passengers:",
          val: `${Array.isArray(data.seats) ? data.seats.length : 1} Passenger(s)`,
        },
      ];

      let currentFieldY = splitY + 36;
      for (const field of passengerFields) {
        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor("#64748B")
          .text(field.label, startX + 14, currentFieldY);

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor("#0F172A")
          .text(field.val, startX + 120, currentFieldY, {
            width: leftColWidth - 134,
          });

        currentFieldY += 22;
      }

      // Right Column Card: Reserved Seats
      doc
        .roundedRect(rightColX, splitY, rightColWidth, splitHeight, 8)
        .fillAndStroke("#FFFFFF", "#E2E8F0");

      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor("#172144")
        .text("RESERVED SEAT(S)", rightColX + 14, splitY + 12);

      doc
        .moveTo(rightColX + 14, splitY + 28)
        .lineTo(rightColX + rightColWidth - 14, splitY + 28)
        .strokeColor("#F1F5F9")
        .lineWidth(1)
        .stroke();

      // Seat Badges/Pills
      const seatsList = Array.isArray(data.seats) ? data.seats : [];
      let pillX = rightColX + 14;
      let pillY = splitY + 38;
      const pillWidth = 46;
      const pillHeight = 22;

      for (const seat of seatsList) {
        if (pillX + pillWidth > rightColX + rightColWidth - 14) {
          pillX = rightColX + 14;
          pillY += pillHeight + 8;
        }

        doc
          .roundedRect(pillX, pillY, pillWidth, pillHeight, 4)
          .fillAndStroke("#EFF6FF", "#BFDBFE");

        doc
          .font("Helvetica-Bold")
          .fontSize(9.5)
          .fillColor("#1D4ED8")
          .text(String(seat), pillX, pillY + 6, {
            width: pillWidth,
            align: "center",
          });

        pillX += pillWidth + 8;
      }



      // FARE SUMMARY CARD
      const fareY = 410;
      const fareHeight = 52;

      doc
        .roundedRect(startX, fareY, contentWidth, fareHeight, 8)
        .fillAndStroke("#F0FDF4", "#BBF7D0");

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#166534")
        .text("TOTAL AMOUNT PAID", startX + 16, fareY + 12);

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#15803D")
        .text("Status: Verified & Confirmed (Includes Service Fees & VAT)", startX + 16, fareY + 28);

      const formattedFare = `BDT Tk ${Number(data.totalFare || 0).toLocaleString()}`;
      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor("#15803D")
        .text(formattedFare, startX + contentWidth - 216, fareY + 18, {
          width: 200,
          align: "right",
        });



      // IMPORTANT TRAVEL POLICIES
      const policyY = 478;
      const policyHeight = 100;

      doc
        .roundedRect(startX, policyY, contentWidth, policyHeight, 8)
        .fillAndStroke("#F8FAFC", "#E2E8F0");

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#334155")
        .text("IMPORTANT TRAVEL GUIDELINES & BOARDING POLICIES", startX + 14, policyY + 12);

      const policies = [
        "1. Reporting Time: Please arrive at the departure counter at least 15-20 minutes prior to departure.",
        "2. Ticket Verification: Present this printed copy or digital PDF pass along with a valid ID at boarding.",
        "3. Baggage Allowance: Maximum permitted luggage is 20kg per seat. Excess luggage may incur standard carrier fees.",
        "4. Helpline & Support: Contact Northern Paribahan 24/7 Helpline: 01700-000000 | support@northernparibahan.com",
      ];

      let policyLineY = policyY + 28;
      for (const policy of policies) {
        doc
          .font("Helvetica")
          .fontSize(7)
          .fillColor("#64748B")
          .text(policy, startX + 14, policyLineY, { width: contentWidth - 28 });
        policyLineY += 15;
      }



      // FOOTER
      const footerY = 750;

      doc
        .moveTo(startX, footerY)
        .lineTo(startX + contentWidth, footerY)
        .strokeColor("#E2E8F0")
        .lineWidth(1)
        .stroke();

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#64748B")
        .text(
          "Northern Paribahan Ltd. - Premium Highway Intercity Coach Service",
          startX,
          footerY + 10,
          { width: contentWidth, align: "center" }
        );

      doc
        .font("Helvetica")
        .fontSize(6.5)
        .fillColor("#94A3B8")
        .text(
          `Computer Generated Ticket Receipt | Issued For Booking Reference: ${String(
            data.ticketId
          ).toUpperCase()}`,
          startX,
          footerY + 22,
          { width: contentWidth, align: "center" }
        );

      // Finalize the PDF stream
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

