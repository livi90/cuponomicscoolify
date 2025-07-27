import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Tag, Clock, Star, ShoppingBag, Zap, TrendingUp, Flame, Gift } from "lucide-react"
import { t } from "@/lib/i18n"
import Head from "next/head"
import { OutletProducts } from "@/components/outlet/OutletProducts"
import Script from "next/script"

function getLocale() {
  if (typeof window !== "undefined" && window.navigator) {
    return window.navigator.language.split("-")[0] || "es"
  }
  return "es"
}

export const metadata: Metadata = {
  title: "Productos de Outlet y Ofertas | Cuponomics",
  description: "Descubre productos de outlet con descuentos increíbles y las mejores ofertas especiales",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProductosEnOfertaPage() {
  const locale = getLocale()
  const seoKeywords = [
    t(locale, "seo.cuponomics"),
    t(locale, "seo.blackfriday"),
    t(locale, "seo.cybermonday"),
    t(locale, "seo.hotsale"),
    t(locale, "seo.primeday"),
    t(locale, "seo.buenfin"),
    t(locale, "seo.singlesday"),
    t(locale, "seo.navidad") || t(locale, "seo.christmas") || t(locale, "seo.noel") || t(locale, "seo.natal"),
    t(locale, "seo.rebajas") || t(locale, "seo.sales") || t(locale, "seo.soldes") || t(locale, "seo.rabatte") || t(locale, "seo.saldos"),
    t(locale, "seo.ofertas") || t(locale, "seo.deals") || t(locale, "seo.offres") || t(locale, "seo.angebote"),
    t(locale, "seo.cupones") || t(locale, "seo.coupons") || t(locale, "seo.cupons") || t(locale, "seo.gutscheine")
  ].filter(Boolean).join(", ")

  const supabase = await createClient()

  // Verificar si la tabla featured_products existe
  const { data: tableExists } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_name", "featured_products")
    .eq("table_schema", "public")
    .single()

  // Obtener cupones activos para mostrar como alternativa
  const { data: coupons } = await supabase
    .from("coupons")
    .select(`
      *,
      store:stores(
        id,
        name,
        logo_url
      ),
      ratings (
        id,
        rating,
        worked
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6)

  // Calcular valoración media para cada cupón
  const couponsWithRatings =
    coupons?.map((coupon) => {
      const ratings = coupon.ratings || []
      const totalRatings = ratings.length
      const sumRatings = ratings.reduce((sum: number, rating: { rating: number }) => sum + rating.rating, 0)
      const avgRating = totalRatings > 0 ? sumRatings / totalRatings : 0
      const verifications = ratings.filter((r: { worked: boolean }) => r.worked).length

      return {
        ...coupon,
        avg_rating: avgRating,
        ratings_count: totalRatings,
        verifications,
      }
    }) || []

  return (
    <>
      <Head>
        <title>{t(locale, "offers.title")}</title>
        <meta name="description" content={t(locale, "offers.description")} />
        <meta name="keywords" content={seoKeywords} />
        <meta property="og:title" content={t(locale, "offers.title")} />
        <meta property="og:description" content={t(locale, "offers.description")} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale} />
        <meta name="twitter:title" content={t(locale, "offers.title")} />
        <meta name="twitter:description" content={t(locale, "offers.description")} />
      </Head>
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <header className="relative bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 py-8 md:py-12 overflow-hidden shadow-lg min-h-[180px]">
          {/* Elementos decorativos animados */}
          <div className="absolute -top-8 left-1/4 w-20 h-20 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-full blur-2xl opacity-30 animate-bounce-slow z-0" />
          <div className="absolute top-6 right-1/4 w-14 h-14 bg-gradient-to-tr from-teal-400 to-cyan-400 rounded-full blur-2xl opacity-20 animate-bounce-slower z-0" />
          <div className="absolute left-8 bottom-0 w-10 h-10 bg-gradient-to-tr from-emerald-300 to-teal-300 rounded-full blur-xl opacity-20 animate-bounce-slowest z-0" />
          {/* Iconos decorativos */}
          <div className="absolute left-8 top-8 text-[2.5rem] font-black text-emerald-200 drop-shadow-2xl opacity-50 select-none animate-wiggle">🛍️</div>
          <div className="absolute right-8 bottom-8 text-[2rem] font-black text-teal-200 drop-shadow-2xl opacity-40 select-none animate-wiggle-reverse">💰</div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingBag className="h-8 w-8 text-yellow-300 animate-pulse" />
                <h1 className="text-2xl md:text-4xl font-extrabold font-genty mb-1 md:mb-0 text-white drop-shadow-lg animate-fade-in-up">
                  Productos de <span className="text-yellow-300 animate-pulse">OUTLET</span>
                </h1>
                <Zap className="h-8 w-8 text-yellow-300 animate-pulse" />
              </div>
              <p className="text-white/90 text-base font-semibold drop-shadow-md animate-fade-in-up delay-100">
              Descubre productos con descuentos increíbles y ofertas especiales de <span className="text-emerald-100 font-bold">tiendas outlet</span>
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 animate-fade-in-up delay-200">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <Flame className="h-4 w-4 text-white" />
                  <span className="text-white text-sm font-semibold">Hasta 70% OFF</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4 text-white" />
                  <span className="text-white text-sm font-semibold">Ofertas Limitadas</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 space-y-12">
          {/* Sección de Productos de Outlet */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingBag className="h-8 w-8 text-emerald-600" />
                <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  🛍️ PRODUCTOS DE OUTLET
                </h2>
              </div>
              <p className="text-gray-600 text-lg font-semibold max-w-3xl mx-auto">
                Descubre productos con descuentos increíbles de tiendas outlet. 
                Encuentra ofertas especiales en productos seleccionados con hasta 70% de descuento.
              </p>
            </div>
            <OutletProducts />
          </section>

          {/* Sección de Productos en Oferta (Próximamente) */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Productos en Oferta</h2>
              <p className="text-gray-600 text-lg">Próximamente más productos con ofertas especiales</p>
            </div>
            <div className="flex h-60 items-center justify-center rounded-md border border-dashed bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="text-center p-6">
                <h3 className="text-2xl font-bold mb-2 text-emerald-700">Próximamente</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Estamos trabajando para traerte los mejores productos en oferta. Vuelve pronto para descubrir increíbles
                  descuentos y novedades.
                </p>
              </div>
            </div>
          </section>

          {couponsWithRatings.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Mientras tanto, descubre nuestros cupones</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {couponsWithRatings.map((coupon) => (
                  <Card key={coupon.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 pb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Image
                            src={
                              coupon.store?.logo_url ||
                              `/placeholder.svg?height=30&width=30&text=${coupon.store?.name?.charAt(0) || "C"}`
                            }
                            alt={coupon.store?.name || "Tienda"}
                            width={30}
                            height={30}
                            className="rounded"
                          />
                          <span className="font-medium">{coupon.store?.name || "Tienda"}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${
                            coupon.coupon_type === "code"
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : coupon.coupon_type === "shipping"
                                ? "bg-green-50 text-green-600 border-green-200"
                                : "bg-orange-50 text-orange-600 border-orange-200"
                          }`}
                        >
                          {coupon.coupon_type === "code"
                            ? "Código"
                            : coupon.coupon_type === "shipping"
                              ? "Envío gratis"
                              : "Oferta"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardTitle className="text-base mb-2">{coupon.title}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                        <Clock className="h-4 w-4" />
                        <span>
                          {coupon.expiry_date
                            ? `Expira: ${new Date(coupon.expiry_date).toLocaleDateString(locale)}`
                            : "Sin caducidad"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-orange-500" />
                          <span>{coupon.avg_rating.toFixed(1)}/5</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between pt-3">
                      {coupon.code ? (
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-emerald-500" />
                          <code className="bg-white px-2 py-1 rounded border">{coupon.code}</code>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <Link href={`/calificar-cupones?id=${coupon.id}`}>
                        <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                          Ver oferta
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Newsletter Section */}
        <section className="py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">¡No te pierdas ninguna oferta de outlet!</h2>
              <p className="text-gray-600 mb-6">
                Suscríbete a nuestro boletín y recibe las mejores ofertas de outlet directamente en tu correo.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-grow px-4 py-3 rounded-l-full sm:rounded-r-none border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full sm:rounded-l-none">
                  Suscribirse
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Script de Counter.dev */}
      <Script
        src="https://cdn.counter.dev/script.js"
        data-id="893c3e96-521c-4597-b612-f002b799687e"
        data-utcoffset="2"
        strategy="afterInteractive"
      />
    </>
  )
}
