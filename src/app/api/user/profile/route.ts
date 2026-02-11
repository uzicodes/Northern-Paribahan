import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        // Fetch user profile from Prisma (public.User table)
        const profile = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                bookings: {
                    include: {
                        seat: {
                            include: {
                                bus: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!profile) {
            // User exists in auth but not in public.User table yet
            // Return basic info from Supabase Auth metadata
            return NextResponse.json({
                user: {
                    id: user.id,
                    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                    email: user.email || '',
                    phoneNumber: user.user_metadata?.phone_number || '',
                    role: 'USER',
                },
                bookings: []
            })
        }

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
                seatNumber: booking.seat.seatNumber,
                busName: booking.seat.bus.name,
                busType: booking.seat.bus.type,
                busPlate: booking.seat.bus.plateNumber,
                price: booking.seat.bus.price,
            }))
        })
    } catch (error) {
        console.error('Profile fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }
}
