import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminAnalyticsDashboard } from "@/components/analytics/admin-analytics-dashboard"
import { MerchantAnalyticsDashboard } from "@/components/analytics/merchant-analytics-dashboard"

export default async function AnalyticsPage() {
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
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  const userRole = profile?.role || "user"

  // Redirigir si no tiene permisos
  if (userRole !== "admin" && userRole !== "merchant") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          {userRole === "admin" ? "Vista completa de la plataforma" : "Métricas de tus tiendas y productos"}
        </p>
      </div>

      {userRole === "admin" ? <AdminAnalyticsDashboard /> : <MerchantAnalyticsDashboard userId={user.id} />}
    </div>
  )
}
