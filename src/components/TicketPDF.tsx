import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

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
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>Northern Paribahan</Text>
            <Text style={styles.ticketBadge}>E-Ticket & Boarding Pass</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.ticketBadge}>Booking Reference</Text>
            <Text style={styles.bookingId}>{data.ticketId.toUpperCase()}</Text>
          </View>
        </View>

        {/* Route & Schedule Card */}
        <View style={styles.tripBox}>
          <View style={styles.routeRow}>
            <Text style={styles.city}>{data.origin}</Text>
            <Text style={styles.arrow}>➔</Text>
            <Text style={styles.city}>{data.destination}</Text>
          </View>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Departure</Text>
              <Text style={styles.detailValue}>{data.departureTime}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Arrival</Text>
              <Text style={styles.detailValue}>{data.arrivalTime}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bus / Tier</Text>
              <Text style={styles.detailValue}>
                {data.busModel} ({data.busTier})
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Coach No.</Text>
              <Text style={styles.detailValue}>{data.busReg}</Text>
            </View>
          </View>
        </View>

        {/* Passenger & Seats Info */}
        <View style={styles.seatsSection}>
          <Text style={styles.sectionTitle}>Reserved Seats</Text>
          <View style={styles.seatBadgeContainer}>
            {data.seats.map((seat) => (
              <View key={seat} style={styles.seatBadge}>
                <Text style={styles.seatText}>{seat}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Passenger Details</Text>
          <Text style={{ fontSize: 11, marginBottom: 4 }}>
            Name: {data.passengerName}
          </Text>
          <Text style={{ fontSize: 11, marginBottom: 4 }}>
            Email: {data.passengerEmail}
          </Text>
          <Text style={{ fontSize: 11, fontWeight: "bold", marginTop: 6 }}>
            Total Paid: ৳{data.totalFare}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Please arrive at the boarding counter at least 15 minutes prior to
            departure.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export const TicketPDF: React.FC<{ data: TicketData }> = ({ data }) => createTicketDocument(data);