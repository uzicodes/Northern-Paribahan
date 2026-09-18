import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

const profileInclude = {
    _count: {
        select: {
            bookings: {
                where: { status: 'CONFIRMED' }
            }
        }
    },
    bookings: {
        include: {
            tickets: true,
            schedule: {
                include: {
                    bus: {
                        select: { tier: true, modelName: true },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc' as const,
        },
    },
} satisfies Prisma.UserInclude;

type UserWithBookings = Prisma.UserGetPayload<{
    include: typeof profileInclude;
}>;

type BookingWithDetails = UserWithBookings['bookings'][number];
type TicketWithDetails = BookingWithDetails['tickets'][number];

export async function GET() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        // Pure read: look up existing user profile and bookings
        let profile: UserWithBookings | null = await prisma.user.findUnique({
            where: { id: user.id },
            include: profileInclude,
        });

        // Return 404 if profile is missing so client knows to sync via POST
        if (!profile) {
            return NextResponse.json({ error: 'PROFILE_NOT_FOUND' }, { status: 404 });
        }

        // Return the shape the frontend expects: { user, bookings }
        return NextResponse.json({
            user: {
                id: profile.id,
                name: profile.name || user.user_metadata?.name || 'User',
                email: profile.email,
                phoneNumber: profile.phoneNumber || user.user_metadata?.phone_number || '',
                role: profile.role,
                confirmedBookingsCount: profile._count?.bookings || 0,
            },
            bookings: profile.bookings.map((booking: BookingWithDetails) => ({
                id: booking.id,
                status: booking.status,
                createdAt: booking.createdAt,
                totalFare: booking.totalFare,
                seatNumbers: booking.tickets.map((t: TicketWithDetails) => t.seatNumber),
                busName: booking.schedule?.busName || booking.schedule?.bus?.modelName || 'Unknown Bus',
                busType: booking.schedule?.bus?.tier || 'Standard',
                registrationNumber: booking.schedule?.registrationNumber || 'N/A',
                origin: booking.schedule?.origin || '',
                destination: booking.schedule?.destination || '',
                departureTime: booking.schedule?.departureTime || null,
                arrivalTime: booking.schedule?.arrivalTime || null,
                route: booking.schedule
                    ? `${booking.schedule.origin} → ${booking.schedule.destination}`
                    : '',
            })),
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const profile = await prisma.user.upsert({
            where: { id: user.id },
            update: {}, // No updates, just ensure it exists
            create: {
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || null,
                phoneNumber: user.user_metadata?.phone_number || null,
            },
            include: profileInclude,
        });
        
        return NextResponse.json({ success: true, profile });
    } catch (error) {
        console.error('Profile sync error:', error);
        return NextResponse.json({ error: 'Failed to sync profile' }, { status: 500 });
    }
}

