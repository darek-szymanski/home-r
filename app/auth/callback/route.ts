import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // Create response first so we can set cookies on it
    const redirectUrl = new URL(next, origin)
    const response = NextResponse.redirect(redirectUrl)
    
    // Create Supabase client with the response for cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      console.log('Session created for user:', data.user?.email)
      return response
    } else {
      console.error('Auth error:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error?.message || 'Authentication failed')}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}