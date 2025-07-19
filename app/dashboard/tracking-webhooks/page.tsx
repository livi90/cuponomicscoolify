import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WebhooksManager } from "@/components/tracking/webhooks-manager"

export default async function TrackingWebhooksPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || (profile.role !== "merchant" && profile.role !== "admin")) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configuración de Webhooks</h1>
        <p className="text-gray-600 mt-2">
          Configura webhooks automáticos para verificar conversiones sin necesidad de scripts manuales
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        }
      >
        <WebhooksManager userId={user.id} userRole={profile.role} />
      </Suspense>
    </div>
  )
} 