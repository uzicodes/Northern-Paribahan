import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
    const supabase = createClient()
    const { email, password, name } = await request.json()

    // 1. Create the user in Supabase Auth (This handles the password)
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // 2. Sync to your Prisma table (We don't send the password here anymore)
    if (data.user) {
        try {
            await prisma.user.create({
                data: {
                    id: data.user.id, // Links to Supabase Auth UUID
                    email: email,
                    name: name,
                    role: 'PASSENGER',
                    // password is now omitted because it's optional in schema
                }
            })
        } catch (dbError) {
            console.error("Prisma Sync Error:", dbError)
            // Optional: Delete the Supabase auth user if Prisma sync fails
        }
    }

    return NextResponse.json({ message: 'Registration successful!' })
}