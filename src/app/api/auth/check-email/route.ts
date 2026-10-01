import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Checks whether an email address is already registered in the system.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required.' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    return NextResponse.json({
      exists: Boolean(user),
      email,
    });
  } catch (error) {
    console.error('[check-email API Error]:', error);
    return NextResponse.json({ error: 'Failed to verify email existence.' }, { status: 500 });
  }
}
