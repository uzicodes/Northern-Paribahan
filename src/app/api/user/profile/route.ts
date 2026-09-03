import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        // Auto-upsert: if user exists in Supabase Auth but not in Prisma (e.g. after DB reset),
        // create the Prisma record on the fly so the profile page works seamlessly.
        const profile = await prisma.user.upsert({
            where: { id: user.id },
            update: {}, // Don't overwrite existing data on every profile fetch
            create: {
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || null,
                phoneNumber: user.user_metadata?.phone_number || null,
            },
            include: {
                bookings: {
                    include: {
                        tickets: true,
                        schedule: {
                            include: {
                                bus: {
                                    select: { type: true },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        // Return the shape the frontend expects: { user, bookings }
        return NextResponse.json({
            user: {
                id: profile.id,
                name: profile.name || user.user_metadata?.name || 'User',
                email: profile.email,
                phoneNumber: profile.phoneNumber || user.user_metadata?.phone_number || '',
                role: profile.role,
            },
            bookings: profile.bookings.map(booking => ({
                id: booking.id,
                status: booking.status,
                createdAt: booking.createdAt,
                totalFare: booking.totalFare,
                seatNumbers: booking.tickets.map(t => t.seatNumber),
                busName: booking.schedule?.busName || 'Unknown Bus',
                busType: booking.schedule?.bus?.type || 'Standard',
                registrationNumber: booking.schedule?.registrationNumber || 'N/A',
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
