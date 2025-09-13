"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Copy, CheckCircle, Store, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PopularCoupon {
  id: string
  title: string
  description: string
  code: string
  discount_value: number
  discount_type: string
  expiry_date: string
  store: {
    name: string
    logo_url: string
  }
  stats: {
    views: number
    clicks: number
    conversions: number
  }
}

export function PopularCouponsSection() {
  const [popularCoupons, setPopularCoupons] = useState<PopularCoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchPopularCoupons() {
      try {
        const { data: coupons } = await supabase
          .from("coupons")
          .select(`
            id,
            title,
            description,
            code,
            discount_value,
            discount_type,
            expiry_date,
            store:stores(
              name,
              logo_url
            ),
            coupon_stats(
              views,
              clicks,
              conversions
            )
          `)
          .eq("is_active", true)
          .eq("is_verified", true)
          .eq("coupon_type", "code")
          .not("code", "is", null)
          .order("created_at", { ascending: false })
          .limit(6)

        // Transformar los datos y calcular popularidad basada en clicks y conversiones
        const transformedCoupons = (coupons || []).map(coupon => {
          const stats = Array.isArray(coupon.coupon_stats) ? coupon.coupon_stats[0] : coupon.coupon_stats
          return {
            ...coupon,
            store: Array.isArray(coupon.store) ? coupon.store[0] || { name: 'Tienda', logo_url: '' } : coupon.store,
            stats: stats || { views: 0, clicks: 0, conversions: 0 }
          }
        })

        // Ordenar por popularidad (clicks + conversiones)
        const sortedCoupons = transformedCoupons.sort((a, b) => {
          const aPopularity = a.stats.clicks + a.stats.conversions
          const bPopularity = b.stats.clicks + b.stats.conversions
          return bPopularity - aPopularity
        })

        setPopularCoupons(sortedCoupons)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching popular coupons:", error)
        setLoading(false)
      }
    }

    fetchPopularCoupons()
  }, [supabase])

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
    }
  }

  const formatDiscount = (value: number, type: string) => {
    if (type === 'percentage') {
      return `${value}%`
    } else if (type === 'fixed') {
      return `€${value}`
    } else if (type === 'free_shipping') {
      return 'Envío gratis'
    }
    return `${value}%`
  }

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return "Expirado"
    if (diffDays === 0) return "Hoy"
    if (diffDays === 1) return "Mañana"
    if (diffDays <= 7) return `En ${diffDays} días`
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (popularCoupons.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay cupones disponibles</h3>
        <p className="text-gray-500">Vuelve pronto para ver los cupones más utilizados</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {popularCoupons.map((coupon) => (
        <Card key={coupon.id} className="border-2 border-dashed border-orange-200 hover:border-orange-400 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                  {coupon.store.logo_url ? (
                    <Image
                      src={coupon.store.logo_url}
                      alt={coupon.store.name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  ) : (
                    <Store className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{coupon.store.name}</h4>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 text-xs">Verificado</Badge>
            </div>

            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
              {coupon.title}
            </h3>

            {coupon.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {coupon.description}
              </p>
            )}

            <div className="bg-gray-100 rounded-lg p-3 mb-4 group-hover:bg-gray-200 transition-colors">
              <div className="flex items-center justify-between">
                <code className="font-mono text-sm font-bold text-gray-900">
                  {coupon.code}
                </code>
                <button
                  onClick={() => copyToClipboard(coupon.code)}
                  className="p-1 hover:bg-gray-300 rounded transition-colors"
                  title="Copiar código"
                >
                  {copiedCode === coupon.code ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-700 text-xs">
                  {formatDiscount(coupon.discount_value, coupon.discount_type)}
                </Badge>
              </div>
              <span className="text-green-600 font-semibold text-xs">
                Válido hasta {formatExpiryDate(coupon.expiry_date)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{coupon.stats.clicks} usos</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>{coupon.stats.conversions} conversiones</span>
              </div>
            </div>

            <Link href={`/cupones/${coupon.id}`} className="block">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm">
                Usar Cupón
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
