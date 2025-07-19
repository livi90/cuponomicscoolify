"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RatingList } from "@/components/ratings/rating-list"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, Store, Calendar, Tag, Clock, Star, ExternalLink, Check, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { EnhancedCouponButton } from "@/components/tracking/enhanced-coupon-button"

export default function CouponDetailPageClient({ couponId }: { couponId: string }) {
  const [coupon, setCoupon] = useState<any>(null)
  const [relatedCoupons, setRelatedCoupons] = useState<any[]>([])
  const [avgRating, setAvgRating] = useState<number>(0)
  const [workingPercentage, setWorkingPercentage] = useState<number>(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      // Obtener el cupón con información relacionada
      const { data: couponData, error } = await supabase
        .from("coupons")
        .select(`
          *,
          store:stores(*),
          stats:coupon_stats(*),
          ratings:ratings(
            *,
            user:profiles(*),
            votes:rating_votes(*),
            comments:rating_comments(*)
          )
        `)
        .eq("id", couponId)
        .single()

      if (error) {
        console.error("Error fetching coupon:", error)
        notFound()
        return
      }

      if (!couponData) {
        notFound()
        return
      }

      setCoupon(couponData)

      // Calcular valoración media
      const calculatedAvgRating =
        couponData.ratings && couponData.ratings.length > 0
          ? couponData.ratings.reduce((sum, rating) => sum + rating.rating, 0) / couponData.ratings.length
          : 0

      setAvgRating(calculatedAvgRating)

      // Calcular porcentaje de funcionamiento
      const calculatedWorkingPercentage =
        couponData.ratings && couponData.ratings.length > 0
          ? (couponData.ratings.filter((r) => r.worked).length / couponData.ratings.length) * 100
          : 0

      setWorkingPercentage(calculatedWorkingPercentage)

      // Obtener cupones relacionados (misma tienda)
      const { data: relatedCouponsData } = await supabase
        .from("coupons")
        .select(`
          *,
          store:stores(*),
          stats:coupon_stats(*),
          ratings:ratings(*)
        `)
        .eq("store_id", couponData.store_id)
        .eq("is_active", true)
        .neq("id", couponData.id)
        .limit(3)

      setRelatedCoupons(relatedCouponsData || [])

      // Incrementar contador de vistas
      if (couponData.stats) {
        await supabase
          .from("coupon_stats")
          .update({ views: (couponData.stats.views || 0) + 1 })
          .eq("coupon_id", couponData.id)
      } else {
        await supabase.from("coupon_stats").insert({ coupon_id: couponData.id, views: 1 })
      }
    }

    fetchData()
  }, [couponId, supabase])

  if (!coupon) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link href="/buscar-ofertas" className="text-gray-600 hover:text-orange-500 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a cupones</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Información principal del cupón */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{coupon.title}</h1>
                    {coupon.discount_type && coupon.discount_value && (
                      <Badge className="bg-orange-500 text-base px-3 py-1">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}% descuento`
                          : coupon.discount_type === "fixed"
                            ? `${formatCurrency(coupon.discount_value)} descuento`
                            : coupon.discount_type === "free_shipping"
                              ? "Envío gratis"
                              : coupon.discount_type === "bogo"
                                ? "Compra uno, lleva otro"
                                : "Oferta especial"}
                      </Badge>
                    )}
                  </div>

                  {avgRating > 0 && (
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-md">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{avgRating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({coupon.ratings?.length || 0} valoraciones)</span>
                    </div>
                  )}
                </div>

                {coupon.store && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {coupon.store.logo_url ? (
                        <Image
                          src={coupon.store.logo_url || "/placeholder.svg"}
                          alt={coupon.store.name}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <Store className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/tiendas/${coupon.store.id}`}
                        className="font-medium text-gray-900 hover:text-orange-500"
                      >
                        {coupon.store.name}
                      </Link>
                      {coupon.store.category && <div className="text-sm text-gray-500">{coupon.store.category}</div>}
                    </div>
                  </div>
                )}

                <p className="text-gray-700 mb-6 whitespace-pre-line">{coupon.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg">Detalles del cupón</h2>
                    <div className="space-y-2">
                      {coupon.code && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Código: {coupon.code}</span>
                        </div>
                      )}
                      {coupon.expiry_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>
                            Expira: {new Date(coupon.expiry_date).toLocaleDateString("es-ES", { dateStyle: "long" })}
                          </span>
                        </div>
                      )}
                      {coupon.created_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>
                            Añadido: {new Date(coupon.created_at).toLocaleDateString("es-ES", { dateStyle: "long" })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg">Estadísticas</h2>
                    <div className="space-y-2">
                      {coupon.stats && (
                        <>
                          <div className="flex items-center gap-2">
                            <span>Vistas: {coupon.stats.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Clicks: {coupon.stats.clicks || 0}</span>
                          </div>
                        </>
                      )}
                      {workingPercentage > 0 && (
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${
                              workingPercentage >= 70
                                ? "text-green-600"
                                : workingPercentage >= 40
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            Funciona: {Math.round(workingPercentage)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {coupon.terms_conditions && (
                  <div className="mb-6">
                    <h2 className="font-semibold text-lg mb-2">Términos y condiciones</h2>
                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md whitespace-pre-line">
                      {coupon.terms_conditions}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  {coupon.code ? (
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="border border-gray-300 bg-gray-50 rounded-md p-3 text-center font-mono text-lg">
                        {coupon.code}
                      </div>
                      <EnhancedCouponButton
                        couponCode={coupon.code}
                        trackingLink={coupon.store?.website}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-md hover:shadow-lg"
                        showExternalIcon
                        additionalData={{
                          source: "coupon-detail-page",
                          coupon_title: coupon.title,
                          page_location: "coupon-detail",
                          coupon_id: coupon.id,
                          store_id: coupon.store_id,
                        }}
                        onCouponUse={() => {
                          // Incrementar contador de clicks
                          if (coupon.stats) {
                            fetch(`/api/coupons/${coupon.id}/click`, { method: "POST" })
                          }
                        }}
                      >
                        🎯 Usar cupón ahora
                      </EnhancedCouponButton>
                    </div>
                  ) : (
                    <EnhancedCouponButton
                      trackingLink={coupon.store?.website}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                      showExternalIcon
                      additionalData={{
                        source: "coupon-detail-page-no-code",
                        coupon_title: coupon.title,
                        page_location: "coupon-detail",
                        coupon_id: coupon.id,
                        store_id: coupon.store_id,
                      }}
                    >
                      Ver oferta
                    </EnhancedCouponButton>
                  )}

                  {coupon.store?.website && (
                    <Link
                      href={coupon.store.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        // Incrementar contador de clicks
                        if (coupon.stats) {
                          fetch(`/api/coupons/${coupon.id}/click`, { method: "POST" })
                        }
                      }}
                    >
                      <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ir a la tienda
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <Tabs defaultValue="ratings">
                <TabsList className="mb-6">
                  <TabsTrigger value="ratings">Valoraciones</TabsTrigger>
                  <TabsTrigger value="related">Cupones relacionados</TabsTrigger>
                </TabsList>

                <TabsContent value="ratings">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">Valoraciones de usuarios</h2>
                    <RatingList ratings={coupon.ratings || []} />
                  </div>
                </TabsContent>

                <TabsContent value="related">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">Otros cupones de {coupon.store?.name}</h2>
                    {relatedCoupons && relatedCoupons.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedCoupons.map((relatedCoupon) => (
                          <Card key={relatedCoupon.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <h3 className="font-semibold text-lg mb-2">{relatedCoupon.title}</h3>
                              {relatedCoupon.discount_type && relatedCoupon.discount_value && (
                                <Badge className="bg-orange-500 mb-4">
                                  {relatedCoupon.discount_type === "percentage"
                                    ? `${relatedCoupon.discount_value}% descuento`
                                    : relatedCoupon.discount_type === "fixed"
                                      ? `${formatCurrency(relatedCoupon.discount_value)} descuento`
                                      : relatedCoupon.discount_type === "free_shipping"
                                        ? "Envío gratis"
                                        : relatedCoupon.discount_type === "bogo"
                                          ? "Compra uno, lleva otro"
                                          : "Oferta especial"}
                                </Badge>
                              )}
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{relatedCoupon.description}</p>
                              <Link href={`/cupones/${relatedCoupon.id}`}>
                                <Button className="w-full bg-orange-500 hover:bg-orange-600">Ver cupón</Button>
                              </Link>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-gray-500">
                          No hay más cupones disponibles de esta tienda en este momento.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Información de la tienda */}
            {coupon.store && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-lg mb-4">Sobre la tienda</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {coupon.store.logo_url ? (
                        <Image
                          src={coupon.store.logo_url || "/placeholder.svg"}
                          alt={coupon.store.name}
                          width={48}
                          height={48}
                        />
                      ) : (
                        <Store className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/tiendas/${coupon.store.id}`}
                        className="font-medium text-gray-900 hover:text-orange-500"
                      >
                        {coupon.store.name}
                      </Link>
                      {coupon.store.category && <div className="text-sm text-gray-500">{coupon.store.category}</div>}
                    </div>
                  </div>

                  {coupon.store.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{coupon.store.description}</p>
                  )}

                  <Link href={`/tiendas/${coupon.store.id}`}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">Ver tienda</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Cómo usar el cupón */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Cómo usar este cupón</h2>
                <ol className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="bg-orange-100 text-orange-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Copia el código del cupón haciendo clic en el botón "Copiar código".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-orange-100 text-orange-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Visita la tienda haciendo clic en "Ir a la tienda".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-orange-100 text-orange-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Añade los productos que deseas comprar a tu carrito.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-orange-100 text-orange-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>
                      Pega el código en el campo de "Código promocional" o "Cupón" durante el proceso de pago.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-orange-100 text-orange-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      5
                    </span>
                    <span>¡Disfruta de tu descuento!</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Información de verificación */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Información de verificación</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {coupon.is_verified ? (
                      <>
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-green-600 font-medium">Cupón verificado</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <span className="text-yellow-600 font-medium">Cupón no verificado</span>
                      </>
                    )}
                  </div>
                  {workingPercentage > 0 ? (
                    <div
                      className={`flex items-center gap-2 ${
                        workingPercentage >= 70
                          ? "text-green-600"
                          : workingPercentage >= 40
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      <span className="font-medium">Funciona para el {Math.round(workingPercentage)}% de usuarios</span>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      Aún no hay suficientes valoraciones para determinar si este cupón funciona.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
