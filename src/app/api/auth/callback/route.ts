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