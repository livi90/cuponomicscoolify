"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        // Si no hay usuario, simplemente setear null sin error
        setUser(data?.user ?? null)
      } catch (error) {
        // No lanzar error, solo setear null
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
      if (session?.user) {
        try {
          const { data } = await supabase.auth.getUser()
          setUser(data?.user ?? null)
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
      // Redirigir si la sesión expira o hay error de autenticación
      if (["SIGNED_OUT", "USER_DELETED", "TOKEN_REFRESH_FAILED"].includes(event)) {
        router.replace("/login?sessionExpired=1")
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return { user, loading }
}
