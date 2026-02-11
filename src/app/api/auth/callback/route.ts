import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/profile'

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Check if Render sent to real domain header
            const forwardedHost = request.headers.get('x-forwarded-host') // e.g., northern-paribahan.onrender.com

            if (forwardedHost) {
                // Force use the real public domain
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                // Fallback for Localhost development (no forwarded host)
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // Error handling
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}