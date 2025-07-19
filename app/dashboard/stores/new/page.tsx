import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import NewStoreFormWithTracking from "./new-store-form-with-tracking"

export default async function NewStorePage() {
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

  // Verificar si el usuario es comerciante o administrador
  if (profile?.role !== "merchant" && profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Obtener categorías para el selector
  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Crear Nueva Tienda</h1>
        <p className="text-gray-600">
          Registra tu tienda y obtén tu script de tracking personalizado para comenzar a generar más ventas.
        </p>
      </div>
      <NewStoreFormWithTracking categories={categories || []} userId={user.id} />
    </div>
  )
}
