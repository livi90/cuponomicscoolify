"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { Coupon } from "@/lib/types"
import Image from "next/image"

export default function CouponStatsPage() {
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [stats, setStats] = useState<{
    views: number
    clicks: number
    conversions: number
    ratingCount: number
    avgRating: number
  }>({
    views: 0,
    clicks: 0,
    conversions: 0,
    ratingCount: 0,
    avgRating: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const couponId = params.id as string
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchCouponData = async () => {
      try {
        // Obtener el cupón con los datos de la tienda
        const { data: couponData, error: couponError } = await supabase
          .from("coupons")
          .select(`
            *,
            store:store_id (
              id, 
              name,
              logo_url
            )
          `)
          .eq("id", couponId)
          .single()

        if (couponError) throw couponError
        setCoupon(couponData)

        // Obtener estadísticas del cupón
        const { data: statsData, error: statsError } = await supabase
          .from("coupon_stats")
          .select("*")
          .eq("coupon_id", couponId)
          .single()

        // Obtener calificaciones del cupón
        const { data: ratingsData, error: ratingsError } = await supabase
          .from("ratings")
          .select("*")
          .eq("coupon_id", couponId)

        if (ratingsError) console.error("Error al obtener calificaciones:", ratingsError)

        // Calcular promedio de calificaciones
        const ratingCount = ratingsData?.length || 0
        const avgRating =
          ratingCount > 0 ? ratingsData!.reduce((sum, rating) => sum + rating.rating, 0) / ratingCount : 0

        setStats({
          views: statsData?.views || 0,
          clicks: statsData?.clicks || 0,
          conversions: statsData?.conversions || 0,
          ratingCount,
          avgRating,
        })
      } catch (error: any) {
        console.error("Error al cargar datos:", error)
        setError(error.message || "Error al cargar las estadísticas del cupón")
      } finally {
        setLoading(false)
      }
    }

    fetchCouponData()
  }, [couponId, supabase])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error || !coupon) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Estadísticas del Cupón</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "No se pudo cargar la información del cupón"}</AlertDescription>
        </Alert>
        <Button className="mt-4 bg-orange-500 hover:bg-orange-600" onClick={() => router.push("/dashboard/coupons")}>
          Volver a cupones
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Estadísticas del Cupón</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/coupons")}>
          Volver a cupones
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {coupon.store?.logo_url ? (
                <Image
                  src={coupon.store.logo_url || "/placeholder.svg"}
                  alt={coupon.store?.name || ""}
                  width={48}
                  height={48}
                />
              ) : (
                <span className="font-medium text-gray-500">{coupon.store?.name?.charAt(0) || "?"}</span>
              )}
            </div>
            <div>
              <CardTitle className="text-xl">{coupon.title}</CardTitle>
              <p className="text-gray-500">{coupon.store?.name || "Tienda desconocida"}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Visualizaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.views}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.clicks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.views > 0 ? Math.round((stats.clicks / stats.views) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversiones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.conversions}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Valoraciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 mb-4">
              <p className="text-5xl font-bold">{stats.avgRating.toFixed(1)}</p>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={star <= Math.round(stats.avgRating) ? "currentColor" : "none"}
                    stroke={star > Math.round(stats.avgRating) ? "currentColor" : "none"}
                    className={`w-5 h-5 ${star <= Math.round(stats.avgRating) ? "text-orange-500" : "text-gray-300"}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {stats.ratingCount} {stats.ratingCount === 1 ? "valoración" : "valoraciones"}
              </p>
            </div>

            {stats.ratingCount === 0 ? (
              <p className="text-gray-500 text-center my-8">No hay valoraciones todavía</p>
            ) : (
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  // Simulamos distribución de valoraciones
                  const percentage = star === 5 ? 65 : star === 4 ? 20 : star === 3 ? 10 : star === 2 ? 3 : 2

                  return (
                    <div key={star} className="flex items-center gap-2">
                      <div className="w-8 text-right">{star} ★</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <div className="w-8 text-xs text-gray-500">{percentage}%</div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento en el tiempo</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Las estadísticas detalladas estarán disponibles próximamente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
