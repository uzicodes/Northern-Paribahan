import PDFDocument from "pdfkit";
import { TicketData } from "./types";
import { PDF_COLORS, PDF_FONTS, PDF_LAYOUT, PDF_CONTENT } from "./pdfTheme";

/**
 * Generates an official Northern Paribahan E-Ticket PDF as a Node.js Buffer
 * using pure PDFKit with decoupled theme and layout configurations.
 */
export async function generateTicketPdfBuffer(data: TicketData): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: PDF_LAYOUT.page.size,
        margin: PDF_LAYOUT.page.margin,
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

      const { startX, contentWidth } = PDF_LAYOUT;

      // -------------------------------------------------------------
      // 1. BRANDED HEADER SECTION
      // -------------------------------------------------------------
      const { header } = PDF_LAYOUT;

      // Header container background
      doc
        .roundedRect(startX, header.y, contentWidth, header.height, header.radius)
        .fill(PDF_COLORS.primary);

      // Brand Title & Tagline
      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.brand)
        .fillColor(PDF_COLORS.text.white)
        .text(PDF_CONTENT.brandName, startX + 16, header.y + 16);

      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.tagline)
        .fillColor(PDF_COLORS.accent)
        .text(PDF_CONTENT.tagline, startX + 16, header.y + 39);

      // PNR / Booking Reference Badge (Right Aligned)
      const badgeX = startX + contentWidth - header.badgeWidth - 14;
      const badgeY = header.y + 11;

      doc
        .roundedRect(badgeX, badgeY, header.badgeWidth, header.badgeHeight, header.badgeRadius)
        .fill(PDF_COLORS.headerBadge);

      doc
        .font(PDF_FONTS.regular)
        .fontSize(PDF_FONTS.sizes.pnrLabel)
        .fillColor(PDF_COLORS.text.subtle)
        .text(PDF_CONTENT.pnrLabel, badgeX, badgeY + 8, {
          width: header.badgeWidth,
          align: "center",
        });

      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.pnrValue)
        .fillColor(PDF_COLORS.text.white)
        .text(String(data.ticketId || "NP-00000").toUpperCase(), badgeX, badgeY + 22, {
          width: header.badgeWidth,
          align: "center",
        });

      // -------------------------------------------------------------
      // 2. ROUTE & SCHEDULE CARD
      // -------------------------------------------------------------
      const { route } = PDF_LAYOUT;

      doc
        .roundedRect(startX, route.y, contentWidth, route.height, route.radius)
        .fillAndStroke(PDF_COLORS.background.card, PDF_COLORS.border.default);

      // Origin & Destination Row
      doc
        .font(PDF_FONTS.regular)
        .fontSize(PDF_FONTS.sizes.policyHeading)
        .fillColor(PDF_COLORS.text.muted)
        .text(PDF_CONTENT.fromLabel, startX + 16, route.y + 14);

      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.station)
        .fillColor(PDF_COLORS.primary)
        .text(String(data.origin || "Origin"), startX + 16, route.y + 26);

      doc
        .font(PDF_FONTS.bold)
        .fontSize(14)
        .fillColor(PDF_COLORS.accent)
        .text(PDF_CONTENT.routeArrow, startX, route.y + 26, {
          width: contentWidth,
          align: "center",
        });

      doc
        .font(PDF_FONTS.regular)
        .fontSize(PDF_FONTS.sizes.policyHeading)
        .fillColor(PDF_COLORS.text.muted)
        .text(PDF_CONTENT.toLabel, startX + contentWidth - 190, route.y + 14, {
          width: 174,
          align: "right",
        });

      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.station)
        .fillColor(PDF_COLORS.primary)
        .text(String(data.destination || "Destination"), startX + contentWidth - 190, route.y + 26, {
          width: 174,
          align: "right",
        });

      // Divider inside route card
      const routeDividerY = route.y + route.dividerOffset;
      doc
        .moveTo(startX + 16, routeDividerY)
        .lineTo(startX + contentWidth - 16, routeDividerY)
        .strokeColor(PDF_COLORS.border.default)
        .lineWidth(1)
        .stroke();

      // 4-Column Grid: Departure, Arrival, Coach/Tier, Registration
      const gridY = route.y + route.gridOffset;
      const colWidth = (contentWidth - 32) / 4;

      // Col 1: Departure Time
      doc
        .font(PDF_FONTS.regular)
        .fontSize(PDF_FONTS.sizes.metaLabel)
        .fillColor(PDF_COLORS.text.muted)
        .text(PDF_CONTENT.gridLabels.departure, startX + 16, gridY);
      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.departureTime)
        .fillColor(PDF_COLORS.text.primary)
        .text(String(data.departureTime || "N/A"), startX + 16, gridY + 12, {
          width: colWidth - 8,
        });

      // Col 2: Arrival Time
      doc
        .font(PDF_FONTS.regular)
        .fontSize(PDF_FONTS.sizes.metaLabel)
        .fillColor(PDF_COLORS.text.muted)
        .text(PDF_CONTENT.gridLabels.arrival, startX + 16 + colWidth, gridY);
      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.departureTime)
        .fillColor(PDF_COLORS.text.primary)
        .text(String(data.arrivalTime || "N/A"), startX + 16 + colWidth, gridY + 12, {
          width: colWidth - 8,
        });

      // Col 3: Bus Coach & Tier
      doc
        .font(PDF_FONTS.regular)
        .fontSize(PDF_FONTS.sizes.metaLabel)
        .fillColor(PDF_COLORS.text.muted)
        .text(PDF_CONTENT.gridLabels.coachTier, startX + 16 + colWidth * 2, gridY);
      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.departureTime)
        .fillColor(PDF_COLORS.text.primary)
        .text(
          `${String(data.busModel || "Coach")} (${String(data.busTier || "Economy")})`,
          startX + 16 + colWidth * 2,
          gridY + 12,
          { width: colWidth - 8 }
        );

      // Col 4: Registration Number
      doc
        .font(PDF_FONTS.regular)
        .fontSize(PDF_FONTS.sizes.metaLabel)
        .fillColor(PDF_COLORS.text.muted)
        .text(PDF_CONTENT.gridLabels.registration, startX + 16 + colWidth * 3, gridY);
      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.departureTime)
        .fillColor(PDF_COLORS.text.primary)
        .text(String(data.busReg || "N/A"), startX + 16 + colWidth * 3, gridY + 12, {
          width: colWidth - 8,
        });

      // -------------------------------------------------------------
      // 3. PASSENGER DETAILS & SEAT ALLOCATION
      // -------------------------------------------------------------
      const { split, pills } = PDF_LAYOUT;
      const rightColX = startX + contentWidth - split.rightColWidth;

      // Left Column: Passenger Info Card
      doc
        .roundedRect(startX, split.y, split.leftColWidth, split.height, split.radius)
        .fillAndStroke(PDF_COLORS.background.white, PDF_COLORS.border.default);

      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.sectionHeading)
        .fillColor(PDF_COLORS.primary)
        .text(PDF_CONTENT.passengerHeading, startX + 14, split.y + 12);

      doc
        .moveTo(startX + 14, split.y + 28)
        .lineTo(startX + split.leftColWidth - 14, split.y + 28)
        .strokeColor(PDF_COLORS.border.divider)
        .lineWidth(1)
        .stroke();

      const passengerFields = [
        { label: PDF_CONTENT.passengerLabels.name, val: String(data.passengerName || "N/A") },
        { label: PDF_CONTENT.passengerLabels.email, val: String(data.passengerEmail || "N/A") },
        {
          label: PDF_CONTENT.passengerLabels.count,
          val: `${Array.isArray(data.seats) ? data.seats.length : 1} Passenger(s)`,
        },
      ];

      let currentFieldY = split.y + 36;
      for (const field of passengerFields) {
        doc
          .font(PDF_FONTS.regular)
          .fontSize(PDF_FONTS.sizes.passengerField)
          .fillColor(PDF_COLORS.text.muted)
          .text(field.label, startX + 14, currentFieldY);

        doc
          .font(PDF_FONTS.bold)
          .fontSize(PDF_FONTS.sizes.passengerField)
          .fillColor(PDF_COLORS.text.primary)
          .text(field.val, startX + 120, currentFieldY, {
            width: split.leftColWidth - 134,
          });

        currentFieldY += 22;
      }

      // Right Column: Reserved Seats Card
      doc
        .roundedRect(rightColX, split.y, split.rightColWidth, split.height, split.radius)
        .fillAndStroke(PDF_COLORS.background.white, PDF_COLORS.border.default);

      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.sectionHeading)
        .fillColor(PDF_COLORS.primary)
        .text(PDF_CONTENT.seatsHeading, rightColX + 14, split.y + 12);

      doc
        .moveTo(rightColX + 14, split.y + 28)
        .lineTo(rightColX + split.rightColWidth - 14, split.y + 28)
        .strokeColor(PDF_COLORS.border.divider)
        .lineWidth(1)
        .stroke();

      // Seat Badges
      const seatsList = Array.isArray(data.seats) ? data.seats : [];
      let pillX = rightColX + 14;
      let pillY = split.y + 38;

      for (const seat of seatsList) {
        if (pillX + pills.width > rightColX + split.rightColWidth - 14) {
          pillX = rightColX + 14;
          pillY += pills.height + pills.gapY;
        }

        doc
          .roundedRect(pillX, pillY, pills.width, pills.height, pills.radius)
          .fillAndStroke(PDF_COLORS.pill.bg, PDF_COLORS.pill.border);

        doc
          .font(PDF_FONTS.bold)
          .fontSize(PDF_FONTS.sizes.seatPill)
          .fillColor(PDF_COLORS.pill.text)
          .text(String(seat), pillX, pillY + 6, {
            width: pills.width,
            align: "center",
          });

        pillX += pills.width + pills.gapX;
      }

      // -------------------------------------------------------------
      // 4. FARE SUMMARY CARD
      // -------------------------------------------------------------
      const { fare } = PDF_LAYOUT;

      doc
        .roundedRect(startX, fare.y, contentWidth, fare.height, fare.radius)
        .fillAndStroke(PDF_COLORS.fare.bg, PDF_COLORS.fare.border);

      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.fareHeading)
        .fillColor(PDF_COLORS.fare.title)
        .text(PDF_CONTENT.fareHeading, startX + 16, fare.y + 12);

      doc
        .font(PDF_FONTS.regular)
        .fontSize(PDF_FONTS.sizes.fareStatus)
        .fillColor(PDF_COLORS.fare.text)
        .text(PDF_CONTENT.fareStatus, startX + 16, fare.y + 28);

      const formattedFare = `BDT Tk ${Number(data.totalFare || 0).toLocaleString()}`;
      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.fareAmount)
        .fillColor(PDF_COLORS.fare.text)
        .text(formattedFare, startX + contentWidth - 216, fare.y + 18, {
          width: 200,
          align: "right",
        });

      // -------------------------------------------------------------
      // 5. IMPORTANT TRAVEL POLICIES
      // -------------------------------------------------------------
      const { policies } = PDF_LAYOUT;

      doc
        .roundedRect(startX, policies.y, contentWidth, policies.height, policies.radius)
        .fillAndStroke(PDF_COLORS.background.card, PDF_COLORS.border.default);

      doc
        .font(PDF_FONTS.bold)
        .fontSize(PDF_FONTS.sizes.policyHeading)
        .fillColor(PDF_COLORS.text.dark)
        .text(PDF_CONTENT.policyHeading, startX + 14, policies.y + 12);

      let policyLineY = policies.y + 28;
      for (const policy of PDF_CONTENT.policies) {
        doc
          .font(PDF_FONTS.regular)
          .fontSize(PDF_FONTS.sizes.policyText)
          .fillColor(PDF_COLORS.text.muted)
          .text(policy, startX + 14, policyLineY, { width: contentWidth - 28 });
        policyLineY += policies.lineGap;
      }

      // -------------------------------------------------------------
      // 6. FOOTER
      // -------------------------------------------------------------
      const { footer } = PDF_LAYOUT;

      doc
        .moveTo(startX, footer.y)
        .lineTo(startX + contentWidth, footer.y)
        .strokeColor(PDF_COLORS.border.default)
        .lineWidth(1)
        .stroke();

      doc
        .font(PDF_FONTS.regular)
        .fontSize(PDF_FONTS.sizes.footerLine1)
        .fillColor(PDF_COLORS.text.muted)
        .text(PDF_CONTENT.footerLine1, startX, footer.y + 10, {
          width: contentWidth,
          align: "center",
        });

      doc
        .font(PDF_FONTS.regular)
        .fontSize(PDF_FONTS.sizes.footerLine2)
        .fillColor(PDF_COLORS.text.subtle)
        .text(
          `${PDF_CONTENT.footerLine2Prefix}${String(data.ticketId).toUpperCase()}`,
          startX,
          footer.y + 22,
          { width: contentWidth, align: "center" }
        );

      // Finalize the PDF stream
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
