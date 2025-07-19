import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Tag, Clock, Star } from "lucide-react"
import { t } from "@/lib/i18n"
import Head from "next/head"

function getLocale() {
  if (typeof window !== "undefined" && window.navigator) {
    return window.navigator.language.split("-")[0] || "es"
  }
  return "es"
}

export const metadata: Metadata = {
  title: "Productos en Oferta | Cuponomics",
  description: "Descubre los mejores productos en oferta y lanzamientos de nuevos productos",
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

  // Si la tabla no existe, mostrar mensaje informativo
  if (!tableExists) {
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
        <div className="container py-8 space-y-10">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">{t(locale, "offers.title")}</h1>
            <p className="text-xl text-gray-600">{t(locale, "offers.description")}</p>
            <div className="pt-4 flex flex-wrap gap-2 justify-center">
              {seoKeywords.split(", ").map((kw) => (
                <span key={kw} className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold border border-orange-200">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <div className="flex h-60 items-center justify-center rounded-md border border-dashed">
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold mb-2">Próximamente</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Estamos trabajando para traerte los mejores productos en oferta. Vuelve pronto para descubrir increíbles
                descuentos y novedades.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

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
      <div className="container py-8 space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">{t(locale, "offers.title")}</h1>
          <p className="text-xl text-gray-600">{t(locale, "offers.description")}</p>
          <div className="pt-4 flex flex-wrap gap-2 justify-center">
            {seoKeywords.split(", ").map((kw) => (
              <span key={kw} className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold border border-orange-200">
                {kw}
              </span>
            ))}
          </div>
        </div>
        <div className="flex h-60 items-center justify-center rounded-md border border-dashed">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-2">Próximamente</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Estamos trabajando para traerte los mejores productos en oferta. Vuelve pronto para descubrir increíbles
              descuentos y novedades.
            </p>
          </div>
        </div>

        {couponsWithRatings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Mientras tanto, descubre nuestros cupones</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {couponsWithRatings.map((coupon) => (
                <Card key={coupon.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-3">
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
                  <CardFooter className="bg-gray-50 flex justify-between pt-3">
                    {coupon.code ? (
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-orange-500" />
                        <code className="bg-white px-2 py-1 rounded border">{coupon.code}</code>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <Link href={`/calificar-cupones?id=${coupon.id}`}>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Ver oferta
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
