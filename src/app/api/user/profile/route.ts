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
        // Pure read: look up existing user profile and bookings
        let profile = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
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
                        createdAt: 'desc',
                    },
                },
            },
        });

        // Safe lazy fallback: only creates the Prisma record if the user exists in Supabase Auth but not in Prisma DB
        if (!profile) {
            profile = await prisma.user.create({
                data: {
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
                                        select: { tier: true, modelName: true },
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
        }

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
                busName: booking.schedule?.busName || booking.schedule?.bus?.modelName || 'Unknown Bus',
                busType: booking.schedule?.bus?.tier || 'Standard',
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
