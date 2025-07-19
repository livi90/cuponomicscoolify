import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  try {
    console.log(`Middleware: Accessing ${request.nextUrl.pathname}`)
    const { supabase, response } = createClient(request)

    // Verify if user is authenticated using getUser() (secure)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // If not authenticated and trying to access protected routes
    if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If authenticated, verify roles for specific routes
    if (user) {
      // Get user role securely
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      const userRole = profile?.role || "user"
      console.log(`Middleware: User ID: ${user?.id}, Role: ${userRole} for path ${request.nextUrl.pathname}`)

      // Admin MANAGEMENT routes
      if (
        (request.nextUrl.pathname.startsWith("/dashboard/users") ||
          request.nextUrl.pathname.startsWith("/dashboard/store-applications") || // Application management (plural)
          request.nextUrl.pathname.startsWith("/dashboard/admin")) &&
        userRole !== "admin"
      ) {
        console.log(
          `Middleware: Redirecting ${userRole} from ${request.nextUrl.pathname} to /dashboard (admin management check)`,
        )
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // Allow 'user' to access store application form
      if (
        request.nextUrl.pathname.startsWith("/dashboard/store-application") && // Application form (singular)
        userRole !== "user" &&
        userRole !== "admin" // Admin can also view/test it
      ) {
        // If a 'merchant' tries to access, the page logic will handle it.
        // If it's another unexpected role, redirect.
        if (userRole !== "merchant") {
          console.log(
            `Middleware: Redirecting ${userRole} from ${request.nextUrl.pathname} to /dashboard (store application form check)`,
          )
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      }

      // Verify access to merchant routes
      if (
        (request.nextUrl.pathname.startsWith("/dashboard/stores") ||
          request.nextUrl.pathname.startsWith("/dashboard/coupons")) &&
        userRole !== "merchant" &&
        userRole !== "admin"
      ) {
        console.log(
          `Middleware: Redirecting ${userRole} from ${request.nextUrl.pathname} to /dashboard (merchant/admin check)`,
        )
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // Verify access to subscription routes (only for merchants)
      if (request.nextUrl.pathname.startsWith("/dashboard/subscription") && userRole !== "merchant") {
        return NextResponse.redirect(new URL("/dashboard?error=subscription-merchants-only", request.url))
      }
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of error, allow access
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
