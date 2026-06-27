import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
    try {
        const supabase = await createClient()
        const [{ data: { user }, error: authError }, { name, phoneNumber }] = await Promise.all([
            supabase.auth.getUser(),
            request.json()
        ])

        if (authError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // Update in Prisma database and Supabase Auth concurrently
        const [updatedUser] = await Promise.all([
            prisma.user.update({
                where: { id: user.id },
                data: {
                    name: name,
                    phoneNumber: phoneNumber,
                }
            }),
            supabase.auth.updateUser({
                data: {
                    name: name,
                    phone_number: phoneNumber,
                }
            })
        ])

        return NextResponse.json({
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber,
                role: updatedUser.role,
            }
        })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
}
