import { createBrowserClient, type SupabaseClient } from "@supabase/ssr"

// Declare supabaseClient with a more specific type that allows for null
let supabaseClient: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      console.error(
        "Supabase client error: NEXT_PUBLIC_SUPABASE_URL is not defined. " +
          "This is required for the Supabase client to connect. " +
          "Please ensure it is set in your environment variables and accessible to the client-side.",
      )
      // Throw an error or return a dummy client to prevent further issues if preferred,
      // but logging clearly is a good first step.
      // For now, we'll let it proceed to createBrowserClient which will likely fail,
      // but the log above should make the root cause clear.
    }
    if (!supabaseAnonKey) {
      console.error(
        "Supabase client error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. " +
          "This is required for the Supabase client. " +
          "Please ensure it is set in your environment variables and accessible to the client-side.",
      )
    }

    // The '!' asserts that these are non-null. If they are null/undefined due to missing env vars,
    // createBrowserClient will receive undefined and fail, leading to "Failed to fetch".
    supabaseClient = createBrowserClient(supabaseUrl!, supabaseAnonKey!, {
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
      suppressGetSessionWarning: true,
    })
  }
  // We are sure supabaseClient is initialized here, or an error would have been thrown
  // or logged by the checks above, and createBrowserClient would fail if env vars are missing.
  return supabaseClient as SupabaseClient
}
