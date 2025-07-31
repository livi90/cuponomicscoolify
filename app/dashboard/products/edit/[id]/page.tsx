import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Editar Producto | Cuponomics",
  description: "Edita un producto de tu tienda en Cuponomics",
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    notFound()
  }

  // Obtener el producto y verificar que pertenece al usuario
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      store:stores(
        id,
        name,
        owner_id
      )
    `)
    .eq("id", resolvedParams.id)
    .single()

  if (!product || product.store.owner_id !== session.user.id) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Editar producto</h1>
      <p className="text-gray-500 mb-6">Tienda: {product.store.name}</p>

      <ProductForm storeId={product.store_id} product={product} isEditing={true} />
    </div>
  )
}
