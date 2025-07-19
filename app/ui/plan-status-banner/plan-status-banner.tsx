import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types" // Ajusta si tu tipado vive en otro archivo

/**
 * Banner para avisar al merchant cuando está en el plan gratuito
 * y recordar el límite de productos.  Si el usuario no está logeado
 * o tiene un plan distinto, no se muestra nada.
 */
export default async function PlanStatusBanner() {
  "use server"

  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // Obtiene al usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Consulta el plan activo del usuario
  const { data: plan } = await supabase.from("subscriptions").select("plan_type").eq("user_id", user.id).single()

  if (plan?.plan_type !== "FREE") return null

  // Devuelve el aviso
  return (
    <Alert variant="warning" className="mb-4">
      <AlertTitle className="font-semibold">Estás en el plan gratuito</AlertTitle>
      <AlertDescription>
        Puedes crear hasta 20 productos. Actualiza tu suscripción para desbloquear funciones ilimitadas.
      </AlertDescription>
    </Alert>
  )
}
