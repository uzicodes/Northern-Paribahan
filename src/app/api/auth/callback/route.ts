import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const from = searchParams.get('from')
    // Default to '/profile' if no 'next' param is found
    const next = searchParams.get('next') ?? '/profile'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth code exchange error:', error)
        }

        if (!error && data?.user?.email) {
            const forwardedHost = request.headers.get('x-forwarded-host')

            let redirectBase: string
            if (forwardedHost) {
                // Use http for localhost, https for production
                const protocol = forwardedHost.includes('localhost') ? 'http' : 'https'
                redirectBase = `${protocol}://${forwardedHost}`
            } else {
                redirectBase = origin
            }

            const userEmail = data.user.email.toLowerCase().trim()

            // Check if user is already registered in our system
            const existingUser = await prisma.user.findUnique({
                where: { email: userEmail },
            })

            // If user clicked Google Sign-Up from /register but already exists in the system:
            if (from === 'register' && existingUser) {
                await supabase.auth.signOut()
                return NextResponse.redirect(
                    `${redirectBase}/register?alreadyRegistered=true&email=${encodeURIComponent(userEmail)}`
                )
            }

            // If it's a new user, create their record in Prisma
            if (!existingUser) {
                try {
                    await prisma.user.create({
                        data: {
                            id: data.user.id,
                            email: userEmail,
                            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
                            phoneNumber: data.user.user_metadata?.phone || null,
                        },
                    })
                } catch (e) {
                    console.error('Failed to create new user in Prisma during Google signup:', e)
                }
            }

            return NextResponse.redirect(`${redirectBase}${next}`)
        }
    }

    // Error handling
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}