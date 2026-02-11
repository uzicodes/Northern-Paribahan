import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = createClient()
    const { email, password, name, phoneNumber } = await request.json()

    // Sign up user 
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
        // Log the FULL error for debugging
        console.error('--- SUPABASE SIGNUP ERROR ---')
        console.error('Message:', error.message)
        console.error('Status:', error.status)
        console.error('Name:', error.name)
        console.error('Cause:', error.cause)
        console.error('Full Error:', JSON.stringify(error, null, 2))
        console.error('--- END ERROR ---')
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Success! 
    return NextResponse.json({ message: 'Registration successful!' })
}