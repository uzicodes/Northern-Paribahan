<div align="center">

# Northern Paribahan

### Intercity bus ticketing and fleet operations for Bangladesh's transport network


[Features](#-system-architecture--key-features) •
[Architecture](#-database-schema--data-model) •
[Getting Started](#-local-development-setup) •
[Environment Variables](#-environment-variables-reference) •
[Deployment](#-cron--production-deployment-workflow)

</div>

---
<div align="center">

##  Overview

</div>


**Northern Paribahan** is an end-to-end bus reservation and fleet management system serving major regional transit corridors in Bangladesh, including **Dhaka, Bogura, Dinajpur, Rajshahi**, and more.

The platform has two halves:

- **Passenger Portal**: fleet showcase, route exploration, interactive seat selection, SSLCommerz payment, and automated PDF ticket generation.
- **Admin Command Center**: real-time departure metrics, depot-based fleet allocation, dynamic route grouping, counter ticket printing, and revenue tracking.

---
<div align="center">

##  System Architecture & Key Features

</div>

### 🔹Passenger Portal

| Capability | Description |
|---|---|
| **Route Exploration** | Search by origin, destination, and travel date across all active corridors. |
| **Seat Layout Selection** | Interactive seat map with live availability for each schedule. |
| **Multi-Tier Coach Filtering** | Filter by `AC`, `NON_AC`, and `SLEEPER` classes. |
| **Secure Checkout** | SSLCommerz-hosted payment with success, fail, and cancel callbacks. |
| **Instant PDF Ticket** | Digital boarding pass generated with `@react-pdf/renderer` and available for download right after payment. |
| **Light / Dark Mode** | Unified Tailwind CSS theming across every page. |

### 🔹Admin Management Console

- **Buses Dashboard**
  - Real-time fleet metrics grouped by **Regional Depot**.
  - Tracks physical coach registration numbers, seating capacity, and tier class (`AC`, `NON_AC`, `SLEEPER`).
  - Shows active schedule utilization per coach.
- **Routes Dashboard**
  - Dynamically grouped by **Departure Origin** city.
  - Displays distance (km), formatted journey duration (e.g. `5h 30m`), lowest starting fare (`Starts at ৳...`), and an operational status derived from live schedules.
- **Bookings & Counter Ticket Printing**
  - Authenticated route at `/api/admin/bookings/[id]/ticket` lets depot administrators view and print boarding passes directly on counter terminals.
- **Revenue Tracking**
  - Aggregated booking and payment metrics for operational reporting.

### 🔹 Automated Scheduling Engine: 31-Day Rolling Booking Window

Schedules are not generated on demand. Instead the system keeps a **rolling 31-day window** of bookable departures, which avoids database bloat and heavy on-demand queries.

**How it works**

1. **Frontend boundary.** All date pickers enforce the window globally:
   ```ts
   minDate: today
   maxDate: today + 31 days
   ```
2. **Daily cron.** An external scheduler calls the secured endpoint `GET /api/cron/generate-daily-schedules` every day at midnight (`Asia/Dhaka`, BST).
3. **Authentication.** The endpoint requires `Authorization: Bearer ${CRON_SECRET}`; anything else returns `401 Unauthorized`.
4. **Idempotent append.** Each run generates only **day 31's** schedules (today + 31 days). Before inserting, it checks for existing schedules for that route, bus, and departure time, so re-running the job, or retries after a failure, never creates duplicates.
5. **Expiry.** Past schedules naturally fall outside the booking window and are no longer exposed in the UI.

```text
        Day 0 (Today)                                   Day 31
            │◄─────────────  Bookable Window  ───────────►│
 ───────────┼──────────────────────────────────────────────┼──────────►
            │                                              │
   Past schedules                                 Cron appends this day
   leave the window                               (idempotent insert)
```

### 🔹 Performance & Navigation Optimization

- **Parallel data fetching** via `Promise.all` across Server Components, avoiding blocking request waterfalls.
- **Streaming SSR with Suspense** for progressive rendering of data-heavy dashboards.
- **Reusable skeleton architecture** (`AdminPageSkeleton`) wired into App Router `loading.tsx` boundaries for instant client-side transitions.
- **Server Actions** for mutations, with a mix of React Server Components and Client Components.
- **Strict TypeScript** with zero `any` types.

---
<div align="center">

##  Tech Stack

</div>

<div align="center">

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14+ (App Router, Server Actions, RSC, Streaming SSR) |
| **Language** | TypeScript (strict mode, no `any`) |
| **Database** | PostgreSQL (Supabase / Neon) |
| **ORM** | Prisma |
| **Styling** | Tailwind CSS (light and dark mode) |
| **Payments** | SSLCommerz |
| **PDF Generation** | `@react-pdf/renderer` |
| **Hosting** | Render Web Service |
| **Scheduler** | cron-job.org (external daily trigger) |

</div>


<div align="center">

##  Database Schema & Data Model

</div>

### 🔹Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ BOOKING : places
    SCHEDULE ||--o{ BOOKING : "is booked via"
    BOOKING ||--|{ TICKET : contains
    ROUTE ||--o{ SCHEDULE : "runs as"
    BUS ||--o{ SCHEDULE : "operates"
    DEPOT ||--o{ BUS : "houses"
    ROUTE ||--|{ FARE : "priced by"

    USER {
        string id PK
        string name
        string email UK
        string phone
        enum role "PASSENGER | ADMIN"
    }

    BOOKING {
        string id PK
        string userId FK
        string scheduleId FK
        enum status
        decimal totalAmount
        string transactionId
    }

    TICKET {
        string id PK
        string bookingId FK
        string seatNumber
        string passengerName
    }

    SCHEDULE {
        string id PK
        string routeId FK
        string busId FK
        date date
        datetime departureTime
        datetime arrivalTime
    }

    BUS {
        string id PK
        string registrationNo UK
        int capacity
        enum tier "AC | NON_AC | SLEEPER"
        string depotId FK
    }

    ROUTE {
        string id PK
        string origin
        string destination
        int distanceKm
        int durationMinutes
    }

    FARE {
        string id PK
        string routeId FK
        enum tier "AC | NON_AC | SLEEPER"
        decimal amount
    }

    DEPOT {
        string id PK
        string name
        string city
    }
```

> The diagram renders automatically on GitHub and GitLab. `PK` = primary key, `FK` = foreign key, `UK` = unique key.

### 🔹Model Summary

| Model | Purpose | Key Fields / Relations |
|---|---|---|
| **User** | Passenger or admin account. | `id`, `name`, `email`, `phone`, `role` (`PASSENGER` / `ADMIN`); has many `Booking`. |
| **Booking** | A purchase covering one or more seats on a schedule. | `id`, `userId`, `scheduleId`, `status`, `totalAmount`, `transactionId`; has many `Ticket`. |
| **Ticket** | An individual seat boarding pass. | `id`, `bookingId`, `seatNumber`, `passengerName`; rendered to PDF. |
| **Schedule** | A single dated departure of a bus on a route. | `id`, `routeId`, `busId`, `departureTime`, `arrivalTime`, `date`; unique on route, bus, and departure time (enables idempotent cron inserts). |
| **Bus** | A physical coach in the fleet. | `id`, `registrationNo`, `capacity`, `tier` (`AC` / `NON_AC` / `SLEEPER`), `depotId`. |
| **Route** | An origin-to-destination corridor. | `id`, `origin`, `destination`, `distanceKm`, `durationMinutes`; has many `Fare` and `Schedule`. |
| **Fare** | Pricing for a route per coach tier. | `id`, `routeId`, `tier`, `amount` (BDT ৳). |
| **Depot** | A regional operations hub that owns buses. | `id`, `name`, `city`; has many `Bus`. |

> Field names above are indicative; see [`prisma/schema.prisma`](./prisma/schema.prisma) for the source of truth.

---
<div align="center">

##  Directory Structure

</div>

```text
northern-paribahan/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   │   ├── (public)/                      # Passenger-facing pages
│   │   │   ├── page.tsx                   # Landing / fleet showcase
│   │   │   ├── search/
│   │   │   ├── booking/
│   │   │   └── ticket/
│   │   ├── admin/                         # Admin Command Center
│   │   │   ├── buses/
│   │   │   ├── routes/
│   │   │   ├── bookings/
│   │   │   └── loading.tsx                # AdminPageSkeleton boundary
│   │   └── api/
│   │       ├── cron/
│   │       │   └── generate-daily-schedules/
│   │       ├── admin/
│   │       │   └── bookings/[id]/ticket/
│   │       └── payment/
│   │           └── sslcommerz/
│   ├── components/
│   │   ├── admin/                         # Admin widgets, AdminPageSkeleton
│   │   └── ui/                            # Reusable UI primitives
│   └── lib/
│       └── prisma.ts                      # Prisma client singleton
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---
<div align="center">

##  Environment Variables Reference

</div>

Create a `.env` file in the project root (use `.env.example` as a template).

| Variable | Required | Description | Example |
|---|:---:|---|---|
| `DATABASE_URL` | ✅ | Pooled PostgreSQL connection string used by the app at runtime. | `postgresql://user:pass@host:6543/db?pgbouncer=true` |
| `DIRECT_URL` | ✅ | Direct (non-pooled) connection string used by Prisma migrations. | `postgresql://user:pass@host:5432/db` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Base URL used to build SSLCommerz callback URLs. Switch between local and production. | `http://localhost:3000` / `https://your-app.onrender.com` |
| `CRON_SECRET` | ✅ | Shared secret that authorizes calls to the cron endpoint. Use a long random string. | `a9f3...c21e` |
| `SSLCOMMERZ_STORE_ID` | ✅ | SSLCommerz store identifier. | `your_store_id` |
| `SSLCOMMERZ_STORE_PASS` | ✅ | SSLCommerz store password. | `your_store_password` |
| `SSLCOMMERZ_IS_LIVE` | ✅ | `true` for production, `false` for sandbox. | `false` |

> ⚠️ Never commit `.env` to version control. Generate `CRON_SECRET` with `openssl rand -hex 32`.

---
<div align="center">

##  Local Development Setup

</div>

### 🔹Prerequisites

- Node.js **18.17+** (20 LTS recommended)
- npm, pnpm, or yarn
- A PostgreSQL database (Supabase, Neon, or local)
- An SSLCommerz sandbox account

### 🔹Steps

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/northern-paribahan.git
cd northern-paribahan
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Fill in the values described in the [Environment Variables Reference](#-environment-variables-reference). For local development set:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
SSLCOMMERZ_IS_LIVE=false
```

**4. Run database migrations**

```bash
npx prisma migrate dev
```

**5. Seed the database**

```bash
npx prisma db seed
```

**6. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 🔹Testing the Cron Endpoint Locally

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/cron/generate-daily-schedules
```

Run it twice to confirm idempotency: the second call should insert zero new schedules.

### 🔹Useful Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Run the production server. |
| `npm run lint` | Lint the codebase. |
| `npx prisma studio` | Browse and edit data in the Prisma GUI. |

---
<div align="center">

##  Cron & Production Deployment Workflow

</div>

### 1. Deploy to Render

1. Push the repository to GitHub.
2. In the [Render dashboard](https://dashboard.render.com), create a **New → Web Service** and connect the repository.
3. Configure the service:

   | Setting | Value |
   |---|---|
   | **Runtime** | Node |
   | **Build Command** | `npm install && npx prisma generate && npx prisma migrate deploy && npm run build` |
   | **Start Command** | `npm run start` |

4. Add all variables from the [reference table](#-environment-variables-reference) under **Environment**, with production values:
   - `NEXT_PUBLIC_APP_URL=https://<your-service>.onrender.com`
   - `SSLCOMMERZ_IS_LIVE=true` (once live credentials are approved)
5. Register your production callback URLs in the SSLCommerz merchant panel.

### 2. Configure the Daily Cron Trigger (cron-job.org)

Render's web services do not run scheduled jobs on their own, so an external runner calls the secured endpoint.

1. Create a job at [cron-job.org](https://cron-job.org).
2. Set the following:

   | Field | Value |
   |---|---|
   | **URL** | `https://<your-service>.onrender.com/api/cron/generate-daily-schedules` |
   | **Method** | `GET` |
   | **Schedule** | `0 0 * * *` (daily at midnight) |
   | **Timezone** | `Asia/Dhaka` (BST, UTC+6) |
   | **Header** | `Authorization: Bearer <CRON_SECRET>` |

3. Enable failure notifications and run a manual test.

**Expected responses**

| Status | Meaning |
|---|---|
| `200 OK` | Day-31 schedules generated, or already present (idempotent no-op). |
| `401 Unauthorized` | Missing or invalid `Authorization` header. |
| `500` | Server error; check Render logs and retry (safe to retry). |

> 💡 If your plan spins down idle instances, the first request may be slow. Set a generous request timeout in cron-job.org (30 s or more).

---
<div align="center">

##  Contributing

</div>

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m "feat: add amazing feature"`.
4. Push and open a Pull Request.

Please keep TypeScript strict (no `any`) and run `npm run lint` before submitting.

---
<div align="center">

##  License

</div>

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">

##  Author

</div>

**[ UTSHO HEAVEN CHOWDHURY ]**

- GitHub: [@uzicodes](https://github.com/uzicodes)
- Email: utsho8chowdhury@gmail.com

<div align="center">

##  Acknowledgments

</div>

- [Next.js](https://nextjs.org/) and [Vercel](https://vercel.com/) for the App Router architecture
- [Prisma](https://www.prisma.io/) for type-safe database access
- [SSLCommerz](https://www.sslcommerz.com/) for payment gateway infrastructure
- [`@react-pdf/renderer`](https://react-pdf.org/) for digital ticket generation
- [Supabase](https://supabase.com/) / [Neon](https://neon.tech/) for managed PostgreSQL
- [Render](https://render.com/) and [cron-job.org](https://cron-job.org/) for hosting and scheduling

<div align="center">

**Built with ❤️ for Bangladesh's Intercity Transportation**

</div>
