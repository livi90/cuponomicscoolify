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
import { NewsletterForm } from "@/components/newsletter/newsletter-form"

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
        {/* Hero Section con Banner de Imagen */}
        <header className="relative overflow-hidden shadow-lg min-h-[400px]">
          <div className="absolute inset-0">
            <Image
              src="/Imagenes landing/imagens cada categoría/banner productos en oferta.png"
              alt="Productos en Oferta Banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
          </div>
          
          {/* Elementos decorativos animados */}
          <div className="absolute -top-8 left-1/4 w-20 h-20 bg-gradient-to-tr from-orange-400 to-red-400 rounded-full blur-2xl opacity-30 animate-bounce-slow z-0" />
          <div className="absolute top-6 right-1/4 w-14 h-14 bg-gradient-to-tr from-red-400 to-orange-400 rounded-full blur-2xl opacity-20 animate-bounce-slower z-0" />
          <div className="absolute left-8 bottom-0 w-10 h-10 bg-gradient-to-tr from-orange-300 to-red-300 rounded-full blur-xl opacity-20 animate-bounce-slowest z-0" />
          {/* Iconos decorativos */}
          <div className="absolute left-8 top-8 text-[2.5rem] font-black text-orange-200 drop-shadow-2xl opacity-50 select-none animate-wiggle">💸</div>
          <div className="absolute right-8 bottom-8 text-[2rem] font-black text-red-200 drop-shadow-2xl opacity-40 select-none animate-wiggle-reverse">💲</div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl md:text-5xl font-black text-yellow-300 animate-pulse drop-shadow-2xl">💸</span>
                <h1 className="text-2xl md:text-4xl font-extrabold font-genty mb-1 md:mb-0 text-white drop-shadow-lg animate-fade-in-up">
                  Productos de <span className="text-yellow-300 animate-pulse">OUTLET</span>
                </h1>
                <span className="text-4xl md:text-5xl font-black text-yellow-300 animate-pulse drop-shadow-2xl">💲</span>
              </div>
              <p className="text-white/90 text-base font-semibold drop-shadow-md animate-fade-in-up delay-100">
              Descubre productos con descuentos increíbles y ofertas especiales de <span className="text-emerald-100 font-bold">tiendas outlet</span>
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 animate-fade-in-up delay-200">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <span className="text-xl font-black text-white drop-shadow-lg">💰</span>
                  <span className="text-white text-sm font-semibold">Hasta 70% OFF</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <span className="text-xl font-black text-white drop-shadow-lg">⚡</span>
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
                <span className="text-4xl font-black text-orange-600 drop-shadow-lg">💸</span>
                <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
                  PRODUCTOS DE OUTLET
                </h2>
                <span className="text-4xl font-black text-orange-600 drop-shadow-lg">💲</span>
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
            <div className="flex h-60 items-center justify-center rounded-md border border-dashed bg-gradient-to-br from-orange-50 to-red-50">
              <div className="text-center p-6">
                <h3 className="text-2xl font-bold mb-2 text-orange-700">Próximamente</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Estamos trabajando para traerte los mejores productos en oferta. Vuelve pronto para descubrir increíbles
                  descuentos y novedades.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">¿Buscas más ofertas?</h2>
              <p className="text-gray-600 text-lg mb-8">
                Descubre miles de cupones y descuentos de tus tiendas favoritas
              </p>
              <Link href="/buscar-ofertas">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <TrendingUp className="w-6 h-6 mr-3" />
                  Buscar Todas las Ofertas
                        </Button>
                      </Link>
              </div>
            </section>
        </main>

        {/* Newsletter Section */}
        <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="container mx-auto px-4">
            <NewsletterForm 
              source="productos-en-oferta"
              title="¡No te pierdas ninguna oferta de outlet!"
              description="Suscríbete a nuestro boletín y recibe las mejores ofertas de outlet directamente en tu correo."
              className="text-orange-800"
            />
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
