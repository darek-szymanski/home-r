import { createClient } from '../../../lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')

    // Log the callback for debugging
    console.log('Auth callback received:', {
        code: code ? 'present' : 'missing',
        error,
        errorDescription,
        origin: requestUrl.origin
    })

    if (error) {
        console.error('OAuth error:', error, errorDescription)
        // Redirect to login with error
        return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`)
    }

    if (code) {
        const supabase = await createClient()
        try {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
            if (exchangeError) {
                console.error('Code exchange error:', exchangeError)
                return NextResponse.redirect(`${requestUrl.origin}/login?error=exchange_failed&error_description=${encodeURIComponent(exchangeError.message)}`)
            }
        } catch (err) {
            console.error('Unexpected error during code exchange:', err)
            return NextResponse.redirect(`${requestUrl.origin}/login?error=unexpected_error`)
        }
    }

    // URL to redirect to after sign up process completes
    return NextResponse.redirect(`${requestUrl.origin}/`)
}
