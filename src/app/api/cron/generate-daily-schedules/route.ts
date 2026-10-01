import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentBSTDate, getBSTDayBoundaries, ROLLING_WINDOW_DAYS } from '@/lib/dateUtils';
import { generateDailySchedulesForDate } from '@/lib/scheduleGenerator';

export const dynamic = 'force-dynamic';

async function handleGenerateDailySchedules(request: NextRequest) {
  // 1. Strict Authentication Check: Must match Bearer ${process.env.CRON_SECRET} or secret query param
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const querySecret = request.nextUrl.searchParams.get('secret') || request.nextUrl.searchParams.get('key');

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7).trim()
    : querySecret?.trim();

  if (!cronSecret || token !== cronSecret) {
    return NextResponse.json(
      { error: 'Unauthorized. Invalid or missing Bearer token.' },
      { status: 401 }
    );
  }

  try {
    // 2. Calculate targetDate exactly 31 days from today in Bangladesh Standard Time (BST)
    const targetDate = new Date(Date.now() + ROLLING_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const targetDateStr = getCurrentBSTDate(targetDate);

    // 3. CRITICAL: Query database to see if schedules for this targetDate already exist
    const { startOfDayBST, endOfDayBST } = getBSTDayBoundaries(targetDateStr);
    const existingCount = await prisma.schedule.count({
      where: {
        departureTime: {
          gte: startOfDayBST,
          lte: endOfDayBST,
        },
      },
    });

    // 4. Idempotent check: If count > 0, return early 200 OK without generating duplicates
    if (existingCount > 0) {
      return NextResponse.json(
        {
          success: true,
          message: `Schedules already exist for this date (${targetDateStr}).`,
          targetDate: targetDateStr,
          schedulesCount: existingCount,
        },
        { status: 200 }
      );
    }

    // 5. If none exist, run the generation logic for active buses and routes for this targetDate ONLY
    const createdCount = await generateDailySchedulesForDate(targetDateStr);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully generated ${createdCount} departures for ${targetDateStr}.`,
        targetDate: targetDateStr,
        schedulesCount: createdCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[cron/generate-daily-schedules ERROR]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to generate daily schedules.',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleGenerateDailySchedules(request);
}

export async function POST(request: NextRequest) {
  return handleGenerateDailySchedules(request);
}

