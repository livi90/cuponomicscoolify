import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SubscriptionOverview } from "@/components/subscription/subscription-overview"

export const metadata = {
  title: "Mi Suscripción | Cuponomics",
  description: "Gestiona tu suscripción de comerciante",
}

export default async function SubscriptionPage() {
  const supabase = await createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Verificar el rol del usuario
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  // Si no es comerciante, redirigir al dashboard
  if (profile?.role !== "merchant") {
    redirect("/dashboard?error=subscription-merchants-only")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mi Suscripción</h1>
      <SubscriptionOverview />
    </div>
  )
}
