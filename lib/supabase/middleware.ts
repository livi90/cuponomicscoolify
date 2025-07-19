import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export function createClient(request: NextRequest) {
  // The 'response' object is created once here.
  // The 'set' and 'remove' cookie functions will modify it directly.
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update cookies in incoming request for immediate use
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // Update cookies in outgoing response for browser
          // No need to recreate 'response' here.
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // Update cookies in incoming request
          request.cookies.set({
            name,
            value: "", // To remove, set empty value
            ...options,
          })
          // Update cookies in outgoing response
          // No need to recreate 'response' here.
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: "pkce",
      },
    },
  )

  return { supabase, response }
}
