import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

// Declare supabaseClient with a more specific type that allows for null
let supabaseClient: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Check if we're in a build environment and provide fallback values
    if (!supabaseUrl || !supabaseAnonKey) {
      // During build time, use fallback values to prevent build failures
      if (typeof window === 'undefined') {
        console.warn(
          "Supabase environment variables not found during build. Using fallback values."
        )
        // Use fallback values for build time
        const fallbackUrl = supabaseUrl || "http://localhost:54321"
        const fallbackKey = supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
        
        supabaseClient = createBrowserClient(fallbackUrl, fallbackKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: "pkce",
          },
          global: {
            headers: {
              "X-Client-Info": "cuponomics-web",
            },
          },
        })
        return supabaseClient
      } else {
        // In browser environment, log error but don't break
        console.error(
          "Supabase client error: Environment variables are not properly configured. " +
          "Please check your environment configuration."
        )
        // Return a dummy client that won't break the app
        return createBrowserClient("http://localhost:54321", "dummy-key", {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
            flowType: "pkce",
          },
          global: {
            headers: {
              "X-Client-Info": "cuponomics-web",
            },
          },
        })
      }
    }

    // Normal case: environment variables are available
    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
      global: {
        headers: {
          "X-Client-Info": "cuponomics-web",
        },
      },
    })
  }
  
  return supabaseClient as SupabaseClient
}
