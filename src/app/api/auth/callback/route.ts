import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // Default to '/profile' if no 'next' param is found
    const next = searchParams.get('next') ?? '/profile'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth code exchange error:', error)
        }

        if (!error) {
            // Sync user to Prisma database after successful OAuth
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    await prisma.user.upsert({
                        where: { id: user.id },
                        update: {
                            email: user.email!,
                            name: user.user_metadata?.name || user.user_metadata?.full_name || undefined,
                        },
                        create: {
                            id: user.id,
                            email: user.email!,
                            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || null,
                            phoneNumber: user.user_metadata?.phone_number || null,
                        },
                    })
                }
            } catch (syncError) {
                // Log but don't block the redirect — profile route will auto-upsert as fallback
                console.error('User sync error after OAuth:', syncError)
            }

            const forwardedHost = request.headers.get('x-forwarded-host')

            let redirectBase: string
            if (forwardedHost) {
                // Use http for localhost, https for production
                const protocol = forwardedHost.includes('localhost') ? 'http' : 'https'
                redirectBase = `${protocol}://${forwardedHost}`
            } else {
                redirectBase = origin
            }

            return NextResponse.redirect(`${redirectBase}${next}`)
        }
    }

    // Error handling
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}