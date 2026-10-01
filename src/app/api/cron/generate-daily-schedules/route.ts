import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentBSTDate, getBSTDayBoundaries, ROLLING_WINDOW_DAYS } from '@/lib/dateUtils';
import { generateDailySchedulesForDate } from '@/lib/scheduleGenerator';

export const dynamic = 'force-dynamic';

async function handleGenerateDailySchedules(request: NextRequest) {
  // 1. Authenticate with CRON_SECRET Bearer token
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // In production or when CRON_SECRET is set, strictly enforce authorization
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized. Invalid or missing Bearer token.' },
      { status: 401 }
    );
  }

  try {
    // 2. Calculate targetDate exactly 31 days from today
    const targetDate = new Date(Date.now() + ROLLING_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const targetDateStr = getCurrentBSTDate(targetDate);

    // 3. Check if schedules already exist for this specific targetDate in BST
    const { startOfDayBST, endOfDayBST } = getBSTDayBoundaries(targetDateStr);
    const existingCount = await prisma.schedule.count({
      where: {
        departureTime: {
          gte: startOfDayBST,
          lte: endOfDayBST,
        },
      },
    });

    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Schedules for ${targetDateStr} already exist. No generation needed.`,
        targetDate: targetDateStr,
        schedulesCount: existingCount,
      });
    }

    // 4. Generate daily departures ONLY for that specific targetDate
    const createdCount = await generateDailySchedulesForDate(targetDateStr);

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${createdCount} rolling departures for ${targetDateStr}.`,
      targetDate: targetDateStr,
      schedulesCount: createdCount,
    });
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
