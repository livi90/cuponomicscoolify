import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AllStoresClient } from "./all-stores-client"

export default async function AllStoresPage() {
  const supabase = await createClient()

  // Verificar si el usuario está autenticado y es admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect("/login")
  }

  // Verificar si el usuario es admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Obtener todas las tiendas primero sin la información del propietario
  const { data: stores, error } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching stores:", error)
    console.error("Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error al cargar tiendas</h2>
          <p className="text-muted-foreground mb-4">No se pudieron cargar las tiendas</p>
          <div className="bg-red-50 p-4 rounded-lg text-left max-w-md mx-auto">
            <p className="text-sm text-red-700">
              <strong>Error:</strong> {error.message}
            </p>
            {error.details && (
              <p className="text-sm text-red-600 mt-1">
                <strong>Detalles:</strong> {error.details}
              </p>
            )}
            {error.hint && (
              <p className="text-sm text-red-600 mt-1">
                <strong>Sugerencia:</strong> {error.hint}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Todas las Tiendas</h1>
          <p className="text-muted-foreground">
            Gestiona todas las tiendas registradas en la plataforma
          </p>
        </div>
      </div>



      <AllStoresClient stores={stores || []} />
    </div>
  )
}
