import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CouponCard } from "@/components/coupons/coupon-card"
import { ProductCard } from "@/components/products/product-card"
import { Store, MapPin, Mail, Phone, Globe, Calendar, Star, Tag, Package } from "lucide-react"
import { StorePageClient } from "./store-page-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TiendaPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Obtener información de la tienda
  const { data: store } = await supabase.from("stores").select("*").eq("id", params.id).eq("is_active", true).single()

  if (!store) {
    notFound()
  }

  // Obtener cupones de la tienda
  const { data: coupons } = await supabase
    .from("coupons")
    .select(`
      *,
      store:stores(*),
      stats:coupon_stats(*),
      ratings:ratings(*)
    `)
    .eq("store_id", store.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Obtener productos de la tienda
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      store:stores(*)
    `)
    .eq("store_id", store.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  // Calcular valoración media de la tienda
  const allRatings = coupons?.flatMap((coupon) => coupon.ratings || []) || []
  const avgStoreRating =
    allRatings.length > 0 ? allRatings.reduce((sum, rating) => sum + rating.rating, 0) / allRatings.length : 0

  // Separar productos por tipo
  const featuredProducts = products?.filter((p) => p.is_featured) || []
  const newProducts = products?.filter((p) => p.is_new) || []
  const saleProducts = products?.filter((p) => p.sale_price && p.sale_price < p.price) || []

  // Separar cupones por tipo
  const codeCoupons = coupons?.filter((c) => c.coupon_type === "code") || []
  const dealCoupons = coupons?.filter((c) => c.coupon_type === "deal") || []
  const shippingCoupons = coupons?.filter((c) => c.coupon_type === "shipping") || []

  return (
    <div className="min-h-screen">
      {/* Header de la tienda */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {store.logo_url ? (
                <Image
                  src={store.logo_url || "/placeholder.svg"}
                  alt={store.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Store className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {store.category && (
                  <Badge variant="outline" className="bg-gray-50">
                    {store.category}
                  </Badge>
                )}
                {avgStoreRating > 0 && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span>{avgStoreRating.toFixed(1)}</span>
                  </Badge>
                )}
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Tienda verificada
                </Badge>
              </div>
              <p className="text-gray-600 mb-4 max-w-3xl">{store.description}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600">
                {store.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{store.address}</span>
                  </div>
                )}
                {store.contact_email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${store.contact_email}`} className="hover:text-orange-500">
                      {store.contact_email}
                    </a>
                  </div>
                )}
                {store.contact_phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${store.contact_phone}`} className="hover:text-orange-500">
                      {store.contact_phone}
                    </a>
                  </div>
                )}
                {store.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a href={store.website} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
                      {store.website.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  </div>
                )}
                {store.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Miembro desde {new Date(store.created_at).toLocaleDateString("es-ES", { dateStyle: "long" })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Botones con tracking - Componente cliente */}
            <StorePageClient store={store} />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="mb-8">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Store className="h-4 w-4" />
              <span>Todo</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>Cupones ({coupons?.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>Productos ({products?.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="deals" className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>Ofertas ({saleProducts?.length || 0})</span>
            </TabsTrigger>
          </TabsList>

          {/* Pestaña Todo */}
          <TabsContent value="all">
            {/* Productos destacados */}
            {featuredProducts.length > 0 && (
              <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Productos destacados</h2>
                  <Link href={`/productos?store=${store.id}&featured=true`}>
                    <button className="text-orange-500 hover:text-orange-600 font-medium">Ver todos</button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {featuredProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} showStoreInfo={false} />
                  ))}
                </div>
              </section>
            )}

            {/* Cupones */}
            {coupons && coupons.length > 0 && (
              <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Cupones disponibles</h2>
                  <Link href={`/buscar-ofertas?store=${store.id}`}>
                    <button className="text-orange-500 hover:text-orange-600 font-medium">Ver todos</button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coupons.slice(0, 4).map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} showStoreInfo={false} />
                  ))}
                </div>
              </section>
            )}

            {/* Productos nuevos */}
            {newProducts.length > 0 && (
              <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Productos nuevos</h2>
                  <Link href={`/productos?store=${store.id}&new=true`}>
                    <button className="text-orange-500 hover:text-orange-600 font-medium">Ver todos</button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {newProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} showStoreInfo={false} />
                  ))}
                </div>
              </section>
            )}

            {/* Productos en oferta */}
            {saleProducts.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Productos en oferta</h2>
                  <Link href={`/productos?store=${store.id}&sale=true`}>
                    <button className="text-orange-500 hover:text-orange-600 font-medium">Ver todos</button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {saleProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} showStoreInfo={false} />
                  ))}
                </div>
              </section>
            )}

            {/* Mensaje si no hay contenido */}
            {!coupons?.length && !products?.length && (
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                <p className="text-center text-gray-500">Esta tienda aún no tiene cupones ni productos disponibles.</p>
              </div>
            )}
          </TabsContent>

          {/* Pestaña Cupones */}
          <TabsContent value="coupons">
            <div className="mb-8">
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Todos ({coupons?.length || 0})</TabsTrigger>
                  <TabsTrigger value="codes">Códigos ({codeCoupons.length})</TabsTrigger>
                  <TabsTrigger value="deals">Ofertas ({dealCoupons.length})</TabsTrigger>
                  <TabsTrigger value="shipping">Envío gratis ({shippingCoupons.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {coupons && coupons.length > 0 ? (
                      coupons.map((coupon) => <CouponCard key={coupon.id} coupon={coupon} showStoreInfo={false} />)
                    ) : (
                      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-gray-500">Esta tienda no tiene cupones disponibles.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="codes">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {codeCoupons.length > 0 ? (
                      codeCoupons.map((coupon) => <CouponCard key={coupon.id} coupon={coupon} showStoreInfo={false} />)
                    ) : (
                      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-gray-500">
                          Esta tienda no tiene códigos de descuento disponibles.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="deals">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dealCoupons.length > 0 ? (
                      dealCoupons.map((coupon) => <CouponCard key={coupon.id} coupon={coupon} showStoreInfo={false} />)
                    ) : (
                      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-gray-500">Esta tienda no tiene ofertas disponibles.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="shipping">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {shippingCoupons.length > 0 ? (
                      shippingCoupons.map((coupon) => (
                        <CouponCard key={coupon.id} coupon={coupon} showStoreInfo={false} />
                      ))
                    ) : (
                      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-gray-500">
                          Esta tienda no tiene cupones de envío gratis disponibles.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* Pestaña Productos */}
          <TabsContent value="products">
            <div className="mb-8">
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Todos ({products?.length || 0})</TabsTrigger>
                  <TabsTrigger value="featured">Destacados ({featuredProducts.length})</TabsTrigger>
                  <TabsTrigger value="new">Nuevos ({newProducts.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products && products.length > 0 ? (
                      products.map((product) => (
                        <ProductCard key={product.id} product={product} showStoreInfo={false} />
                      ))
                    ) : (
                      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-gray-500">Esta tienda no tiene productos disponibles.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="featured">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featuredProducts.length > 0 ? (
                      featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} showStoreInfo={false} />
                      ))
                    ) : (
                      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-gray-500">
                          Esta tienda no tiene productos destacados disponibles.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="new">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {newProducts.length > 0 ? (
                      newProducts.map((product) => (
                        <ProductCard key={product.id} product={product} showStoreInfo={false} />
                      ))
                    ) : (
                      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-gray-500">Esta tienda no tiene productos nuevos disponibles.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* Pestaña Ofertas */}
          <TabsContent value="deals">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {saleProducts.length > 0 ? (
                saleProducts.map((product) => <ProductCard key={product.id} product={product} showStoreInfo={false} />)
              ) : (
                <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                  <p className="text-center text-gray-500">Esta tienda no tiene productos en oferta disponibles.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
