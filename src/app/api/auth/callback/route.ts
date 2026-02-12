import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // Default to '/profile' if no 'next' param is found
    const next = searchParams.get('next') ?? '/profile'

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host') // e.g. northern-paribahan.onrender.com
            const isLocal = origin.includes('localhost')

            if (isLocal) {
                // FORCE HTTP for Localhost (This fixes your error!)
                return NextResponse.redirect(`http://localhost:3000${next}`)
            } else if (forwardedHost) {
                // FORCE HTTPS for Render/Live
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                // Fallback
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // Error handling
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}