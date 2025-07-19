import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Crear Producto | Cuponomics",
  description: "Crea un nuevo producto para tu tienda en Cuponomics",
}

export default async function NewProductPage({ params }: { params: { storeId: string } }) {
  const supabase = createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    notFound()
  }

  // Verificar si la tienda existe y pertenece al usuario
  const { data: store } = await supabase
    .from("stores")
    .select("id, name")
    .eq("id", params.storeId)
    .eq("owner_id", session.user.id)
    .single()

  if (!store) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Crear nuevo producto</h1>
      <p className="text-gray-500 mb-6">Tienda: {store.name}</p>

      <ProductForm storeId={params.storeId} />
    </div>
  )
}
