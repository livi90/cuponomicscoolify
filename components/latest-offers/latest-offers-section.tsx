"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Tag, Store, Star, ArrowRight } from "lucide-react"
import { EarlyAdopterBadge } from "@/components/ui/early-adopter-badge"
import Link from "next/link"
import Image from "next/image"

interface LatestOffer {
  id: string
  title: string
  description: string
  discount_value: number
  coupon_type: string
  created_at: string
  store: {
    name: string
    logo_url: string
    is_early_adopter?: boolean
  }
  ratings: Array<{
    rating: number
    worked: boolean
  }>
}

export function LatestOffersSection() {
  const [latestOffers, setLatestOffers] = useState<LatestOffer[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchLatestOffers() {
      try {
        const { data: offers } = await supabase
          .from("coupons")
          .select(`
            id,
            title,
            description,
            discount_value,
            coupon_type,
            created_at,
            store:stores(
              name,
              logo_url,
              is_early_adopter
            ),
            ratings(
              rating,
              worked
            )
          `)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(12)

        // Ordenar por Early Adopters primero, luego por fecha
        const sortedOffers = (offers || []).sort((a, b) => {
          const aStore = Array.isArray(a.store) ? a.store[0] : a.store
          const bStore = Array.isArray(b.store) ? b.store[0] : b.store
          const aIsEarlyAdopter = aStore?.is_early_adopter || false
          const bIsEarlyAdopter = bStore?.is_early_adopter || false
          
          if (aIsEarlyAdopter === bIsEarlyAdopter) {
            return 0
          }
          return aIsEarlyAdopter ? -1 : 1
        }).slice(0, 3)

        // Transformar los datos para que coincidan con la interfaz
        const transformedOffers = sortedOffers.map(offer => ({
          ...offer,
          store: Array.isArray(offer.store) ? offer.store[0] || { name: 'Tienda', logo_url: '' } : offer.store,
          ratings: Array.isArray(offer.ratings) ? offer.ratings : []
        }))
        setLatestOffers(transformedOffers)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching latest offers:", error)
        setLoading(false)
      }
    }

    fetchLatestOffers()
  }, [supabase])

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const created = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace unos minutos"
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
  }

  const getAverageRating = (ratings: Array<{ rating: number; worked: boolean }>) => {
    if (!ratings || ratings.length === 0) return 0
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0)
    return Math.round((sum / ratings.length) * 10) / 10
  }

  const getVerificationRate = (ratings: Array<{ rating: number; worked: boolean }>) => {
    if (!ratings || ratings.length === 0) return 0
    const worked = ratings.filter(rating => rating.worked).length
    return Math.round((worked / ratings.length) * 100)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (latestOffers.length === 0) {
    return (
      <div className="text-center py-12">
        <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay ofertas recientes</h3>
        <p className="text-gray-500">Vuelve pronto para ver las nuevas ofertas</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-700">Últimas Ofertas Agregadas</h2>
        </div>
        <Link href="/buscar-ofertas">
          <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
            Ver todas
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {latestOffers.map((offer) => {
          const avgRating = getAverageRating(offer.ratings)
          const verificationRate = getVerificationRate(offer.ratings)
          const timeAgo = formatTimeAgo(offer.created_at)

          return (
            <Card key={offer.id} className="hover:shadow-md transition-all duration-300 hover:scale-102 group">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                    {offer.store.logo_url ? (
                      <Image
                        src={offer.store.logo_url}
                        alt={offer.store.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    ) : (
                      <Store className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{offer.store.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {offer.title}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                      ${offer.discount_value} OFF
                    </Badge>
                    {offer.store.is_early_adopter && (
                      <EarlyAdopterBadge size="sm" />
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {offer.coupon_type === 'code' ? 'Código' : 'Oferta'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="font-medium">{avgRating}</span>
                    <span className="text-gray-500">({offer.ratings.length})</span>
                  </div>
                  {verificationRate > 0 && (
                    <div className="text-green-600 font-medium text-xs">
                      {verificationRate}% verificado
                    </div>
                  )}
                </div>

                <Link href={`/cupones/${offer.id}`} className="block">
                  <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs">
                    Ver Oferta
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 