import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#111827",
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
  },
  ticketBadge: {
    fontSize: 10,
    color: "#6b7280",
    textTransform: "uppercase",
  },
  bookingId: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  tripBox: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  routeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  city: {
    fontSize: 18,
    fontWeight: "bold",
  },
  arrow: {
    fontSize: 16,
    color: "#9ca3af",
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: "column",
  },
  detailLabel: {
    fontSize: 9,
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 11,
    fontWeight: "bold",
  },
  seatsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    color: "#374151",
  },
  seatBadgeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  seatBadge: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  seatText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1d4ed8",
  },
  passengerSection: {
    marginBottom: 20,
  },
  passengerText: {
    fontSize: 11,
    marginBottom: 4,
  },
  totalPaid: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 6,
  },
  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
    textAlign: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#9ca3af",
  },
});

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

export function createTicketDocument(data: TicketData) {
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.companyName }, "Northern Paribahan"),
          React.createElement(Text, { style: styles.ticketBadge }, "E-Ticket & Boarding Pass")
        ),
        React.createElement(
          View,
          { style: { alignItems: "flex-end" } },
          React.createElement(Text, { style: styles.ticketBadge }, "Booking Reference"),
          React.createElement(Text, { style: styles.bookingId }, String(data.ticketId).toUpperCase())
        )
      ),

      // Trip Box
      React.createElement(
        View,
        { style: styles.tripBox },
        React.createElement(
          View,
          { style: styles.routeRow },
          React.createElement(Text, { style: styles.city }, String(data.origin)),
          React.createElement(Text, { style: styles.arrow }, "to"),
          React.createElement(Text, { style: styles.city }, String(data.destination))
        ),
        React.createElement(
          View,
          { style: styles.detailsGrid },
          React.createElement(
            View,
            { style: styles.detailItem },
            React.createElement(Text, { style: styles.detailLabel }, "Departure"),
            React.createElement(Text, { style: styles.detailValue }, String(data.departureTime))
          ),
          React.createElement(
            View,
            { style: styles.detailItem },
            React.createElement(Text, { style: styles.detailLabel }, "Arrival"),
            React.createElement(Text, { style: styles.detailValue }, String(data.arrivalTime))
          ),
          React.createElement(
            View,
            { style: styles.detailItem },
            React.createElement(Text, { style: styles.detailLabel }, "Bus / Tier"),
            React.createElement(Text, { style: styles.detailValue }, `${data.busModel} (${data.busTier})`)
          ),
          React.createElement(
            View,
            { style: styles.detailItem },
            React.createElement(Text, { style: styles.detailLabel }, "Coach No."),
            React.createElement(Text, { style: styles.detailValue }, String(data.busReg))
          )
        )
      ),

      // Seats Section
      React.createElement(
        View,
        { style: styles.seatsSection },
        React.createElement(Text, { style: styles.sectionTitle }, "Reserved Seats"),
        React.createElement(
          View,
          { style: styles.seatBadgeContainer },
          ...data.seats.map((seat) =>
            React.createElement(
              View,
              { key: seat, style: styles.seatBadge },
              React.createElement(Text, { style: styles.seatText }, String(seat))
            )
          )
        )
      ),

      // Passenger Details
      React.createElement(
        View,
        { style: styles.passengerSection },
        React.createElement(Text, { style: styles.sectionTitle }, "Passenger Details"),
        React.createElement(Text, { style: styles.passengerText }, `Name: ${data.passengerName}`),
        React.createElement(Text, { style: styles.passengerText }, `Email: ${data.passengerEmail}`),
        React.createElement(Text, { style: styles.totalPaid }, `Total Paid: BDT ${data.totalFare}`)
      ),

      // Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(
          Text,
          { style: styles.footerText },
          "Please arrive at the boarding counter at least 15 minutes prior to departure."
        )
      )
    )
  );
}