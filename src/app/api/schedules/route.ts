import { NextResponse } from 'next/server';
import { getSchedules } from '@/actions/getSchedules';
import { getCurrentBSTDate } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 1. Grab the search parameters from the URL (supports origin/from and destination/to)
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin') || searchParams.get('from');
  const destination = searchParams.get('destination') || searchParams.get('to');
  const dateStr = searchParams.get('date'); // Optional, expected format: 'YYYY-MM-DD'

  // 2. Validate required search parameters
  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'Missing required search parameters: origin (or from) and destination (or to).' },
      { status: 400 }
    );
  }

  try {
    // If no date is specified, default to today in Bangladesh Standard Time (BST)
    const travelDate = dateStr?.trim() || getCurrentBSTDate();

    const schedules = await getSchedules({
      origin,
      destination,
      travelDate,
    });

    return NextResponse.json({ schedules }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch schedules:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while fetching schedules.' },
      { status: 500 }
    );
  }
}