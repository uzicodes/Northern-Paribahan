import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const { name, phoneNumber } = await request.json()

        // Update in Prisma database
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: name,
                phoneNumber: phoneNumber,
            }
        })

        // Also update Supabase Auth metadata for consistency
        await supabase.auth.updateUser({
            data: {
                name: name,
                phone_number: phoneNumber,
            }
        })

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
