import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 1. Grab the search parameters from the URL
  // 1. Grab the search parameters from the URL (supports origin/from and destination/to)
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const dateStr = searchParams.get('date'); // Expected format: 'YYYY-MM-DD'
  const origin = searchParams.get('origin') || searchParams.get('from');
  const destination = searchParams.get('destination') || searchParams.get('to');
  const dateStr = searchParams.get('date'); // Optional, expected format: 'YYYY-MM-DD'

  // 2. Validate the request
  if (!origin || !destination || !dateStr) {
  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'Missing required search parameters: origin, destination, or date.' },
      { error: 'Missing required search parameters: origin (or from) and destination (or to).' },
      { status: 400 }
    );
  }

  try {
    // 3. Create the 24-hour Date Window
    const searchDate = new Date(dateStr);
    searchDate.setHours(0, 0, 0, 0);
    // 3. Build where filter with case-insensitive matching
    const whereClause: any = {
      origin: { equals: origin, mode: 'insensitive' },
      destination: { equals: destination, mode: 'insensitive' },
    };

    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    if (dateStr) {
      const searchDate = new Date(dateStr);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      whereClause.departureTime = {
        gte: searchDate,
        lt: nextDay,
      };
    } else {
      // Default to start of today onwards if no specific date is provided
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      whereClause.departureTime = {
        gte: startOfToday,
      };
    }

    // 4. Query the Database with bus and route.fares
    const rawSchedules = await prisma.schedule.findMany({
      where: {
        origin: origin,
        destination: destination,
        departureTime: {
          gte: searchDate,
          lt: nextDay,
        },
      },
      where: whereClause,
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

    // 5. Compute dynamic fare and available seats for each schedule
    const schedules = rawSchedules.map((schedule) => {
      const applicableFare = schedule.route?.fares?.find(
        (f) => f.tier === schedule.bus.tier
      );
      const farePrice = applicableFare ? applicableFare.price : 0;
      const availableSeats = schedule.bus.capacity - (schedule._count?.tickets ?? 0);

      return {
        ...schedule,
        fare: farePrice,
        fareFormatted: farePrice > 0 ? `৳ ${farePrice.toLocaleString()}` : 'N/A',
        availableSeats,
      };
    });

    // 6. Return the enriched schedules
    return NextResponse.json({ schedules }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch schedules:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while fetching schedules.' },
      { status: 500 }
    );
  }
}