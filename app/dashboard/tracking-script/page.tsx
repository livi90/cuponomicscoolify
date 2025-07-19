import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import TrackingScriptManager from "@/components/tracking/tracking-script-manager"

export default async function TrackingScriptPage() {
  const supabase = await createClient()

  // Verificar autenticación
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect("/login")
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "merchant") {
    redirect("/dashboard")
  }

  // Obtener tiendas del merchant
  const { data: stores } = await supabase.from("stores").select("*").eq("owner_id", user.id).eq("is_active", true)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Script de Tracking</h1>
        <p className="text-gray-600 mt-2">
          Gestiona e instala el script de tracking en tus tiendas para monitorear las conversiones.
        </p>
      </div>

      <TrackingScriptManager stores={stores || []} />
    </div>
  )
}
