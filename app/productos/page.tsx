import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Productos | Cuponomics",
  description: "Descubre los mejores productos de nuestros comerciantes",
}

export default async function ProductsPage() {
  const supabase = await createClient()

  // Obtener productos activos
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      store:stores(
        id,
        name,
        logo_url
      )
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  // Obtener categorías únicas
  const categories = products ? [...new Set(products.filter((p) => p.category).map((p) => p.category))] : []

  // Obtener productos destacados
  const featuredProducts = products?.filter((p) => p.is_featured) || []

  // Obtener productos nuevos
  const newProducts = products?.filter((p) => p.is_new) || []

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-b from-orange-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 font-genty">
              Descubre los mejores productos de nuestros comerciantes
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Productos de calidad seleccionados por nuestra comunidad de comerciantes
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Productos destacados */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Productos destacados</h2>
            <Link href="/productos?filter=featured">
              <Button variant="link" className="text-orange-500">
                Ver todos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 8).map((product) => (
                <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="relative aspect-square overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.is_new && <Badge className="bg-blue-500">Nuevo</Badge>}
                      {product.sale_price && product.price > product.sale_price && (
                        <Badge className="bg-red-500">
                          -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {product.store && (
                      <div className="mb-2">
                        <Link
                          href={`/tiendas/${product.store.id}`}
                          className="text-sm text-gray-500 hover:text-orange-500"
                        >
                          {product.store.name}
                        </Link>
                      </div>
                    )}

                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>

                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {product.description || "Sin descripción"}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      {product.sale_price ? (
                        <>
                          <span className="font-bold text-orange-600">{formatCurrency(product.sale_price)}</span>
                          <span className="text-sm text-gray-500 line-through">{formatCurrency(product.price)}</span>
                        </>
                      ) : (
                        <span className="font-bold">{formatCurrency(product.price)}</span>
                      )}
                    </div>

                    {product.category && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {product.stock_quantity > 0 ? (
                        product.stock_quantity < 10 ? (
                          <span className="text-amber-600">¡Quedan {product.stock_quantity}!</span>
                        ) : (
                          <span>En stock</span>
                        )
                      ) : (
                        <span className="text-red-500">Agotado</span>
                      )}
                    </div>

                    <Link
                      href={`/productos/${product.id}`}
                      className="text-sm font-medium text-orange-600 hover:text-orange-800"
                    >
                      Ver detalles
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                <p className="text-center text-gray-500">No hay productos destacados disponibles en este momento.</p>
              </div>
            )}
          </div>
        </section>

        {/* Productos nuevos */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Productos nuevos</h2>
            <Link href="/productos?filter=new">
              <Button variant="link" className="text-orange-500">
                Ver todos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.length > 0 ? (
              newProducts.slice(0, 8).map((product) => (
                <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="relative aspect-square overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.is_new && <Badge className="bg-blue-500">Nuevo</Badge>}
                      {product.sale_price && product.price > product.sale_price && (
                        <Badge className="bg-red-500">
                          -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {product.store && (
                      <div className="mb-2">
                        <Link
                          href={`/tiendas/${product.store.id}`}
                          className="text-sm text-gray-500 hover:text-orange-500"
                        >
                          {product.store.name}
                        </Link>
                      </div>
                    )}

                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>

                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {product.description || "Sin descripción"}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      {product.sale_price ? (
                        <>
                          <span className="font-bold text-orange-600">{formatCurrency(product.sale_price)}</span>
                          <span className="text-sm text-gray-500 line-through">{formatCurrency(product.price)}</span>
                        </>
                      ) : (
                        <span className="font-bold">{formatCurrency(product.price)}</span>
                      )}
                    </div>

                    {product.category && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {product.stock_quantity > 0 ? (
                        product.stock_quantity < 10 ? (
                          <span className="text-amber-600">¡Quedan {product.stock_quantity}!</span>
                        ) : (
                          <span>En stock</span>
                        )
                      ) : (
                        <span className="text-red-500">Agotado</span>
                      )}
                    </div>

                    <Link
                      href={`/productos/${product.id}`}
                      className="text-sm font-medium text-orange-600 hover:text-orange-800"
                    >
                      Ver detalles
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                <p className="text-center text-gray-500">No hay productos nuevos disponibles en este momento.</p>
              </div>
            )}
          </div>
        </section>

        {/* Categorías */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Explora por categorías</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link key={category} href={`/productos?category=${category}`}>
                  <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center h-full hover:shadow-md transition-shadow text-center">
                    <span className="font-medium">{category}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                <p className="text-center text-gray-500">No hay categorías disponibles en este momento.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
