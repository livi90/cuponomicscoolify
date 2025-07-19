import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SubscriptionPlans } from "@/components/subscription/subscription-plans"

export const metadata = {
  title: "Planes de Suscripción | Cuponomics",
  description: "Elige el plan que mejor se adapte a tus necesidades",
}

export default async function SubscriptionPlansPage() {
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

  // Obtener planes disponibles
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true })

  // Obtener la suscripción actual del usuario
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("plan_id")
    .eq("user_id", session.user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Planes de Suscripción</h1>
      <p className="text-gray-500 mb-8">
        Elige el plan que mejor se adapte a tus necesidades. Todos los planes incluyen acceso a la plataforma y soporte.
      </p>
      <SubscriptionPlans plans={plans || []} currentPlanId={subscription?.plan_id} />
    </div>
  )
}
