import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import type { UserRole } from "@/lib/types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect("/login")
  }

  // Obtener el perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Si no hay perfil, crear uno
  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      role: "user" as UserRole,
    })
  }

  const userRole = profile?.role || "user"

  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r bg-background p-4 hidden md:block">
        <DashboardNav userRole={userRole} />
      </div>
      <div className="flex-1">
        <div className="container mx-auto py-6 px-4">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  )
}
