"use server";

import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { 
  getCurrentBSTDate, 
  getBSTDayBoundaries, 
  OPERATIONAL_BUFFER_MINUTES 
} from '@/lib/dateUtils';

// ==========================================
// 1. TypeScript Types (Stripped at compile time)
// ==========================================

export type { GetSchedulesParams, ScheduleWithDetails, EnrichedSchedule };

interface GetSchedulesParams {
  origin: string;
  destination: string;
  travelDate: string; // Expected format: "YYYY-MM-DD"
}

type ScheduleWithDetails = Prisma.ScheduleGetPayload<{
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

interface EnrichedSchedule extends ScheduleWithDetails {
  fare: number;
  fareFormatted: string;
  availableSeats: number;
}

// ==========================================
// 2. Server Action (Async Function Export Only)
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

  // Validate YYYY-MM-DD pattern
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

  // Rule 4: Historical Dates -> Return empty array immediately
  if (cleanTravelDate < todayInBST) {
    return [];
  }

  // Rule 1: Operational Buffer (30 minutes prior to departure)
  const operationalCutoff = new Date(now.getTime() + OPERATIONAL_BUFFER_MINUTES * 60 * 1000);

  // Rule 2 & 3: Dynamic lower-bound threshold
  // - Same-day: departureTime >= (Current Time + 30m)
  // - Future-date: departureTime >= 00:00:00.000 BST
  const lowerBound = cleanTravelDate === todayInBST ? operationalCutoff : startOfDayBST;

  // If cutoff has passed the end of the day (e.g. late night search), no trips remain
  if (lowerBound > endOfDayBST) {
    return [];
  }

  try {
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

    // Compute dynamic pricing and available seats
    return rawSchedules.map((schedule) => {
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
  } catch (error) {
    console.error('Error fetching time-gated schedules:', error);
    throw error;
  }
}
