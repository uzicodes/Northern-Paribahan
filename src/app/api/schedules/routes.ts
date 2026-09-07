import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Note: If you have a shared Prisma client file (e.g., in a lib or db folder), 
// import it here instead to avoid too many connections.
const prisma = new PrismaClient(); 

export async function GET(request: Request) {
  // 1. Grab the search parameters from the URL
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const dateStr = searchParams.get('date'); // Expected format: 'YYYY-MM-DD'

  // 2. Validate the request
  if (!origin || !destination || !dateStr) {
    return NextResponse.json(
      { error: 'Missing required search parameters: origin, destination, or date.' },
      { status: 400 }
    );
  }

  try {
    // 3. Create the 24-hour Date Window
    // If a user searches for '2026-09-10', we want all buses from 00:00:00 to 23:59:59 on that day.
    const searchDate = new Date(dateStr);
    searchDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // 4. Query the Database
    const schedules = await prisma.schedule.findMany({
      where: {
        origin: origin,
        destination: destination,
        departureTime: {
          gte: searchDate, // Greater than or equal to 00:00 today
          lt: nextDay,     // Strictly less than 00:00 tomorrow
        },
      },
      // Automatically pull in the Master Route data, which includes the Fares!
      include: {
        route: {
          include: {
            fares: true,
          }
        },
      },
      orderBy: {
        departureTime: 'asc', // Sort earliest buses first
      }
    });

    // 5. Return the exact schedules
    return NextResponse.json({ schedules }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch schedules:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while fetching schedules.' },
      { status: 500 }
    );
  }
}