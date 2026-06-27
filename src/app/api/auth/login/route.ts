import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const [supabase, body] = await Promise.all([createClient(), request.json()]);
    const { email, password } = body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", user: data.user });
}