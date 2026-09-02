import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const [supabase, body] = await Promise.all([createClient(), request.json()])
    const { email, password, name, phoneNumber } = body

    // Sign up user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: name,
                phone_number: phoneNumber,
            },
        },
    })

    if (error) {
        console.error('--- SUPABASE SIGNUP ERROR ---')
        console.error('Message:', error.message)
        console.error('Status:', error.status)
        console.error('Name:', error.name)
        console.error('Cause:', error.cause)
        console.error('Full Error:', JSON.stringify(error, null, 2))
        console.error('--- END ERROR ---')
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create the corresponding Prisma User record
    if (data.user) {
        try {
            await prisma.user.upsert({
                where: { id: data.user.id },
                update: {},
                create: {
                    id: data.user.id,
                    email: email,
                    name: name || null,
                    phoneNumber: phoneNumber || null,
                },
            })
        } catch (syncError) {
            // Log but don't fail the registration — profile route will auto-upsert as fallback
            console.error('User DB sync error after registration:', syncError)
        }
    }

    return NextResponse.json({ message: 'Registration successful!' })
}