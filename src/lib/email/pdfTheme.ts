export const PDF_COLORS = {
  primary: "#172144",
  accent: "#FCA311",
  headerBadge: "#223060",
  text: {
    primary: "#0F172A",
    muted: "#64748B",
    subtle: "#94A3B8",
    dark: "#334155",
    white: "#FFFFFF",
  },
  border: {
    default: "#E2E8F0",
    divider: "#F1F5F9",
  },
  background: {
    card: "#F8FAFC",
    white: "#FFFFFF",
  },
  pill: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    text: "#1D4ED8",
  },
  fare: {
    bg: "#F0FDF4",
    border: "#BBF7D0",
    title: "#166534",
    text: "#15803D",
  },
} as const;

export const PDF_FONTS = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
  sizes: {
    brand: 18,
    station: 15,
    fareAmount: 15,
    pnrValue: 11,
    fareHeading: 10,
    departureTime: 9.5,
    sectionHeading: 9.5,
    seatPill: 9.5,
    passengerField: 8.5,
    tagline: 8.5,
    metaLabel: 7.5,
    pnrLabel: 7.5,
    fareStatus: 7.5,
    policyHeading: 8,
    policyText: 7,
    footerLine1: 7.5,
    footerLine2: 6.5,
  },
} as const;

export const PDF_LAYOUT = {
  page: {
    size: "A4" as const,
    margin: 40,
  },
  startX: 40,
  contentWidth: 515,
  header: {
    y: 40,
    height: 65,
    radius: 8,
    badgeWidth: 140,
    badgeHeight: 42,
    badgeRadius: 6,
  },
  route: {
    y: 120,
    height: 135,
    radius: 8,
    dividerOffset: 54,
    gridOffset: 66,
  },
  split: {
    y: 270,
    height: 125,
    radius: 8,
    leftColWidth: 305,
    rightColWidth: 195,
  },
  pills: {
    width: 46,
    height: 22,
    radius: 4,
    gapX: 8,
    gapY: 8,
  },
  fare: {
    y: 410,
    height: 52,
    radius: 8,
  },
  policies: {
    y: 478,
    height: 100,
    radius: 8,
    lineGap: 15,
  },
  footer: {
    y: 750,
  },
} as const;

export const PDF_CONTENT = {
  brandName: "NORTHERN PARIBAHAN",
  tagline: "OFFICIAL E-TICKET & BOARDING PASS",
  pnrLabel: "BOOKING REFERENCE",
  fromLabel: "FROM (DEPARTURE TERMINAL)",
  toLabel: "TO (ARRIVAL TERMINAL)",
  routeArrow: "----->",
  gridLabels: {
    departure: "DEPARTURE TIME",
    arrival: "ESTIMATED ARRIVAL",
    coachTier: "COACH & SERVICE TIER",
    registration: "REGISTRATION NO.",
  },
  passengerHeading: "PASSENGER DETAILS",
  passengerLabels: {
    name: "Primary Passenger:",
    email: "Registered Email:",
    count: "Total Passengers:",
  },
  seatsHeading: "RESERVED SEAT(S)",
  fareHeading: "TOTAL AMOUNT PAID",
  fareStatus: "Status: Verified & Confirmed (Includes Service Fees & VAT)",
  policyHeading: "IMPORTANT TRAVEL GUIDELINES & BOARDING POLICIES",
  policies: [
    "1. Reporting Time: Please arrive at the departure counter at least 15-20 minutes prior to departure.",
    "2. Ticket Verification: Present this printed copy or digital PDF pass along with a valid ID at boarding.",
    "3. Baggage Allowance: Maximum permitted luggage is 20kg per seat. Excess luggage may incur standard carrier fees.",
    "4. Helpline & Support: Contact Northern Paribahan 24/7 Helpline: 01700-000000 | support@northernparibahan.com",
  ],
  footerLine1: "Northern Paribahan Ltd. - Premium Highway Intercity Coach Service",
  footerLine2Prefix: "Computer Generated Ticket Receipt | Issued For Booking Reference: ",
} as const;

