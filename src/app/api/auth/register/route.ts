import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const [supabase, body] = await Promise.all([createClient(), request.json()])
    const { email, password, name, phoneNumber } = body

    const normalizedEmail = email?.toLowerCase().trim()
    if (!normalizedEmail) {
        return NextResponse.json({ error: 'Email address is required.' }, { status: 400 })
    }

    // 1. Check if user already exists in our database
    const existingDbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    })

    if (existingDbUser) {
        return NextResponse.json(
            {
                alreadyRegistered: true,
                error: 'This email has already been registered on our system. Please log in.',
            },
            { status: 409 }
        )
    }

    // 2. Sign up user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
            data: {
                name: name,
                phone_number: phoneNumber,
            },
        },
    })

    if (error) {
        const errorMsg = error.message?.toLowerCase() || ''
        if (errorMsg.includes('already') || errorMsg.includes('registered') || error.status === 422) {
            return NextResponse.json(
                {
                    alreadyRegistered: true,
                    error: 'This email has already been registered on our system. Please log in.',
                },
                { status: 409 }
            )
        }

        console.error('--- SUPABASE SIGNUP ERROR ---', error)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // 3. Supabase identity check (Supabase returns empty identities array if email already registered)
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return NextResponse.json(
            {
                alreadyRegistered: true,
                error: 'This email has already been registered on our system. Please log in.',
            },
            { status: 409 }
        )
    }

    // 4. Create the corresponding Prisma User record
    if (data.user) {
        try {
            await prisma.user.upsert({
                where: { id: data.user.id },
                update: {},
                create: {
                    id: data.user.id,
                    email: normalizedEmail,
                    name: name || null,
                    phoneNumber: phoneNumber || null,
                },
            })
        } catch (syncError) {
            console.error('User DB sync error after registration:', syncError)
        }
    }

    return NextResponse.json({ message: 'Registration successful!' })
}