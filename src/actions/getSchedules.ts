"use server";

import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

// ==========================================
// 1. Types & Interfaces
// ==========================================

export interface GetSchedulesParams {
  origin: string;
  destination: string;
  travelDate: string; // Expected format: "YYYY-MM-DD"
}

export type ScheduleWithDetails = Prisma.ScheduleGetPayload<{
  include: {
    bus: {
      select: {
        id: true;
        modelName: true;
        registrationNumber: true;
        tier: true;
        capacity: true;
      };
    };
    route: {
      include: {
        fares: true;
      };
    };
    _count: {
      select: {
        tickets: true;
      };
    };
  };
}>;

export interface EnrichedSchedule extends ScheduleWithDetails {
  fare: number;
  fareFormatted: string;
  availableSeats: number;
}

// ==========================================
// 2. Constants & Timezone Helper Utilities
// ==========================================

export const BST_TIMEZONE = 'Asia/Dhaka';
export const OPERATIONAL_BUFFER_MINUTES = 30;

/**
 * Returns the current calendar date in Bangladesh Standard Time (BST, UTC+6)
 * formatted strictly as "YYYY-MM-DD".
 */
export function getCurrentBSTDate(now: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: BST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(now);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

/**
 * Returns the UTC Date objects representing the exact start (00:00:00.000)
 * and end (23:59:59.999) of a calendar day in Bangladesh Standard Time (+06:00).
 */
export function getBSTDayBoundaries(dateStr: string): {
  startOfDayBST: Date;
  endOfDayBST: Date;
} {
  const startOfDayBST = new Date(`${dateStr}T00:00:00.000+06:00`);
  const endOfDayBST = new Date(`${dateStr}T23:59:59.999+06:00`);

  return { startOfDayBST, endOfDayBST };
}

// ==========================================
// 3. Server Action / Query Function
// ==========================================

/**
 * Fetches time-gated, timezone-safe schedules for Northern Paribahan.
 *
 * Operational Rules:
 * 1. Operational Buffer: 30-minute ticket visibility cutoff prior to departure.
 * 2. Same-Day Searches: Only returns schedules departing >= (Current Time + 30m).
 * 3. Future-Date Searches: Returns all schedules between 00:00:00 and 23:59:59.999 BST.
 * 4. Historical Dates: Returns [] immediately without throwing an error.
 * 5. Timezone Integrity: Uses Bangladesh Standard Time (UTC+6 / Asia/Dhaka) for all calculations.
 */
export async function getSchedules({
  origin,
  destination,
  travelDate,
}: GetSchedulesParams): Promise<EnrichedSchedule[]> {
  // Input validation
  if (!origin?.trim() || !destination?.trim() || !travelDate?.trim()) {
    return [];
  }

  // Validate YYYY-MM-DD format
  const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
  if (!DATE_REGEX.test(travelDate.trim())) {
    return [];
  }

  const cleanTravelDate = travelDate.trim();
  const { startOfDayBST, endOfDayBST } = getBSTDayBoundaries(cleanTravelDate);

  if (isNaN(startOfDayBST.getTime()) || isNaN(endOfDayBST.getTime())) {
    return [];
  }

  const now = new Date();
  const todayInBST = getCurrentBSTDate(now);

  // Rule 4: Historical Dates
  // If the requested travel date is before today in Bangladesh Standard Time,
  // return an empty array immediately.
  if (cleanTravelDate < todayInBST) {
    return [];
  }

  // Rule 1: Operational Buffer (30 minutes prior to departure)
  const operationalCutoff = new Date(now.getTime() + OPERATIONAL_BUFFER_MINUTES * 60 * 1000);

  // Rule 2 & 3: Dynamic lower-bound threshold
  // - Same-day: departureTime >= (Current Time + 30m)
  // - Future-date: departureTime >= 00:00:00.000 BST
  const lowerBound = cleanTravelDate === todayInBST ? operationalCutoff : startOfDayBST;

  // If the same-day cutoff is already past the end of the day, no buses remain today
  if (lowerBound > endOfDayBST) {
    return [];
  }

  try {
    // Database query with relational data
    const rawSchedules = await prisma.schedule.findMany({
      where: {
        origin: { equals: origin.trim(), mode: 'insensitive' },
        destination: { equals: destination.trim(), mode: 'insensitive' },
        departureTime: {
          gte: lowerBound,
          lte: endOfDayBST,
        },
      },
      include: {
        bus: {
          select: {
            id: true,
            modelName: true,
            registrationNumber: true,
            tier: true,
            capacity: true,
          },
        },
        route: {
          include: {
            fares: true,
          },
        },
        _count: {
          select: {
            tickets: true,
          },
        },
      },
      orderBy: {
        departureTime: 'asc',
      },
    });

    // Compute dynamic pricing and available seat capacity
    const schedules: EnrichedSchedule[] = rawSchedules.map((schedule) => {
      const applicableFare = schedule.route?.fares?.find(
        (f) => f.tier === schedule.bus.tier
      );
      const fare = applicableFare ? applicableFare.price : 0;
      const bookedTickets = schedule._count?.tickets ?? 0;
      const availableSeats = Math.max(0, schedule.bus.capacity - bookedTickets);

      return {
        ...schedule,
        fare,
        fareFormatted: fare > 0 ? `৳ ${fare.toLocaleString()}` : 'N/A',
        availableSeats,
      };
    });

    return schedules;
  } catch (error) {
    console.error('Error fetching time-gated schedules:', error);
    throw error;
  }
}

