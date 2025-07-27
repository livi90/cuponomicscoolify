import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, Store, Tag, Package, Calendar } from "lucide-react"

// Crear una sola instancia de Supabase para todo el componente
const supabase = createClient()

// Crear una sola instancia de Supabase para todo el componente

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: product } = await supabase.from("products").select("name, description").eq("id", params.id).single()

  if (!product) {
    return {
      title: "Producto no encontrado | Cuponomics",
      description: "El producto que buscas no existe o ha sido eliminado.",
    }
  }

  return {
    title: `${product.name} | Cuponomics`,
    description: product.description || "Detalles del producto en Cuponomics",
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Obtener el producto
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      store:stores(
        id,
        name,
        logo_url,
        description
      )
    `)
    .eq("id", params.id)
    .single()

  if (!product) {
    notFound()
  }

  // Obtener productos relacionados (misma categoría)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select(`
      *,
      store:stores(
        id,
        name
      )
    `)
    .eq("category", product.category)
    .eq("status", "active")
    .neq("id", product.id)
    .limit(4)

  // Calcular descuento si hay precio de oferta
  const discountPercentage =
    product.sale_price && product.price > product.sale_price
      ? Math.round(((product.price - product.sale_price) / product.price) * 100)
      : null

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link href="/productos" className="text-gray-600 hover:text-orange-500 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a productos</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Imagen del producto */}
          <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
            {product.image_url ? (
              <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new && <Badge className="bg-blue-500 px-3 py-1 text-base">Nuevo</Badge>}
              {discountPercentage && <Badge className="bg-red-500 px-3 py-1 text-base">-{discountPercentage}%</Badge>}
            </div>
          </div>

          {/* Información del producto */}
          <div>
            <div className="mb-6">
              {product.store && (
                <Link
                  href={`/tiendas/${product.store.id}`}
                  className="flex items-center gap-2 mb-2 text-gray-600 hover:text-orange-500"
                >
                  {product.store.logo_url ? (
                    <Image
                      src={product.store.logo_url || "/placeholder.svg"}
                      alt={product.store.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <Store className="h-5 w-5" />
                  )}
                  <span>{product.store.name}</span>
                </Link>
              )}

              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              {product.category && (
                <Badge variant="outline" className="mb-4">
                  {product.category}
                </Badge>
              )}

              <div className="flex items-center gap-3 mb-4">
                {product.sale_price ? (
                  <>
                    <span className="text-3xl font-bold text-orange-600">{formatCurrency(product.sale_price)}</span>
                    <span className="text-xl text-gray-500 line-through">{formatCurrency(product.price)}</span>
                    {discountPercentage && (
                      <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                        Ahorras {formatCurrency(product.price - product.sale_price)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
                )}
              </div>

              <div className="mb-6 text-sm text-gray-500">
                {product.stock_quantity > 0 ? (
                  product.stock_quantity < 10 ? (
                    <span className="text-amber-600 font-medium">¡Solo quedan {product.stock_quantity} unidades!</span>
                  ) : (
                    <span className="text-green-600 font-medium">En stock</span>
                  )
                ) : (
                  <span className="text-red-500 font-medium">Agotado</span>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Etiquetas</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Disponibilidad</h2>
              <div className="flex flex-col gap-2 text-sm">
                {product.start_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      Disponible desde:{" "}
                      {new Date(product.start_date).toLocaleDateString("es-ES", { dateStyle: "long" })}
                    </span>
                  </div>
                )}
                {product.end_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      Disponible hasta: {new Date(product.end_date).toLocaleDateString("es-ES", { dateStyle: "long" })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="bg-orange-500 hover:bg-orange-600 flex-1" disabled={product.stock_quantity <= 0}>
                Contactar al vendedor
              </Button>
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                Ver tienda
              </Button>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/productos/${relatedProduct.id}`}>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-square overflow-hidden">
                      {relatedProduct.image_url ? (
                        <Image
                          src={relatedProduct.image_url || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <Package className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1">{relatedProduct.name}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        {relatedProduct.sale_price ? (
                          <>
                            <span className="font-bold text-orange-600">
                              {formatCurrency(relatedProduct.sale_price)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatCurrency(relatedProduct.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold">{formatCurrency(relatedProduct.price)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
