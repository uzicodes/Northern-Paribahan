import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';
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

    // Upsert Prisma User record on login (handles users who existed in
    // Supabase Auth before the database was reset/wiped)
    if (data.user) {
        try {
            await prisma.user.upsert({
                where: { id: data.user.id },
                update: {
                    email: data.user.email!,
                },
                create: {
                    id: data.user.id,
                    email: data.user.email!,
                    name: data.user.user_metadata?.name || email.split('@')[0] || null,
                    phoneNumber: data.user.user_metadata?.phone_number || null,
                },
            });
        } catch (syncError) {
            // Log but don't fail the login — profile route will auto-upsert as fallback
            console.error('User DB sync error after login:', syncError);
        }
    }

    return NextResponse.json({ message: "Login successful", user: data.user });
}