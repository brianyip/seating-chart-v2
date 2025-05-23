import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          // Delete cookies from the request object first
          cookiesToSet.forEach(({ name }) => {
            request.cookies.delete(name)
          })
          // Set cookies on the request object for the current path
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          // Propagate cookies to the outgoing response
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers }, // Pass through original request headers
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  await supabase.auth.getUser()

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
} 