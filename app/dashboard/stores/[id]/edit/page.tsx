import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import EditStoreForm from "./edit-store-form"
import type { Store } from "@/lib/types"

export default async function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Obtener el perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  // Verificar si el usuario es comerciante o administrador
  if (profile?.role !== "merchant" && profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Obtener la tienda
  const { data: store } = await supabase.from("stores").select("*").eq("id", resolvedParams.id).single()

  // Verificar si la tienda existe y pertenece al usuario (a menos que sea admin)
  if (!store || (profile.role !== "admin" && store.owner_id !== session.user.id)) {
    redirect("/dashboard/stores")
  }

  // Obtener categorías para el selector
  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Tienda</h1>
      <EditStoreForm store={store as Store} categories={categories || []} />
    </div>
  )
}
