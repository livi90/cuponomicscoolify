"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import type { Coupon } from "@/lib/types"
import { EnhancedCouponButton } from "@/components/tracking/enhanced-coupon-button"
import { useUser } from "@/hooks/use-user"
import { Star, Zap, Flame, Clock, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CouponCardProps {
  coupon: Coupon
  showStoreInfo?: boolean
}

export function CouponCard({ coupon, showStoreInfo = true }: CouponCardProps) {
  const { user } = useUser()
  const [isHovered, setIsHovered] = useState(false)

  // BADGES DESTACADOS
  const now = new Date()
  const expiry = coupon.expiry_date ? new Date(coupon.expiry_date) : null
  const daysToExpire = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
  const isExpiringSoon = daysToExpire !== null && daysToExpire >= 0 && daysToExpire <= 3
  const isTopDiscount = coupon.discount_type === "percentage" && coupon.discount_value && coupon.discount_value >= 50
  const avgRating = coupon.ratings && coupon.ratings.length > 0 ? coupon.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / coupon.ratings.length : 0
  const isTopRated = avgRating >= 4.5
  const isPopular = coupon.stats && ((coupon.stats.views || 0) + (coupon.stats.clicks || 0)) > 100 // Ajusta el umbral según tu base de datos

  // Determinar qué URL usar: coupon_url específica o website de la tienda
  const originalUrl = coupon.coupon_url || coupon.store?.website

  // Formatear el valor del descuento
  const formattedDiscount =
    coupon.discount_type === "percentage"
      ? `${coupon.discount_value || 0}% DESCUENTO`
      : `$${coupon.discount_value || 0} DESCUENTO`

  // Determinar qué imagen usar como fondo
  const backgroundImage = coupon.store?.card_image_url || coupon.store?.logo_url || null

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevenir navegación si se hace clic en el botón
    if ((e.target as HTMLElement).closest("button")) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  // FAVORITOS
  const [isFavorite, setIsFavorite] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    let mounted = true
    const checkFavorite = async () => {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("coupon_id", coupon.id)
        .single()
      if (mounted) setIsFavorite(!!data)
    }
    checkFavorite()
    return () => { mounted = false }
  }, [user, coupon.id, supabase])

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) return
    setFavLoading(true)
    if (isFavorite) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("coupon_id", coupon.id)
      setIsFavorite(false)
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, coupon_id: coupon.id })
      setIsFavorite(true)
    }
    setFavLoading(false)
  }

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 cursor-pointer group ${
        isHovered ? "shadow-xl scale-105" : "shadow-lg"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* BADGES DESTACADOS */}
      <div className="absolute top-2 left-2 flex flex-col gap-2 z-20">
        {isExpiringSoon && (
          <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
            <Clock className="w-3 h-3 mr-1" /> ¡Última oportunidad!
          </span>
        )}
        {isTopDiscount && (
          <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
            <Zap className="w-3 h-3 mr-1" /> Top descuento
          </span>
        )}
        {isTopRated && (
          <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
            <Star className="w-3 h-3 mr-1" /> Mejor calificado
          </span>
        )}
        {isPopular && (
          <span className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
            <Flame className="w-3 h-3 mr-1" /> Popular
          </span>
        )}
      </div>
      {user && (
        <button
          className={`absolute top-2 right-2 z-20 p-1 rounded-full bg-white/80 hover:bg-orange-100 border border-orange-200 transition-colors ${favLoading ? 'opacity-50 pointer-events-none' : ''}`}
          title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          onClick={handleFavorite}
          aria-label="Guardar en favoritos"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-orange-500 text-orange-500' : 'text-gray-400'}`} />
        </button>
      )}
      {/* Fondo con imagen de tarjeta de regalo o degradado */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <div className="w-full h-full relative">
            <Image
              src={backgroundImage || "/placeholder.svg"}
              alt={coupon.store?.name || "Store"}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay para mejorar legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300" />
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="relative h-64 flex flex-col">
        {/* Sección superior - Logo */}
        <div className="flex-1 flex items-center justify-center p-6">
          {coupon.store?.logo_url && !backgroundImage && (
            <div className="w-40 h-24 flex items-center justify-center bg-white/90 rounded-lg p-3 shadow-lg">
              <Image
                src={coupon.store.logo_url || "/placeholder.svg"}
                alt={coupon.store.name || "Store"}
                width={160}
                height={96}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Sección inferior - Información */}
        <div
          className={`p-4 flex justify-between items-end ${!backgroundImage ? "bg-gradient-to-r from-gray-600 to-gray-700" : "bg-black/40 backdrop-blur-sm"}`}
        >
          <div className="flex-1">
            {/* Nombre de la tienda */}
            <h3 className="text-white text-xl font-bold mb-1">{coupon.store?.name || "Tienda"}</h3>

            {/* Descripción del descuento */}
            <p className="text-white/90 text-sm font-medium leading-tight">
              {formattedDiscount}
              {/* Mostrar categoría del cupón si existe, si no, mostrar 'No aplicable' */}
              <span className="block text-xs opacity-80 mt-1">
                {coupon.coupon_category ? `Categoría: ${coupon.coupon_category}` : 'Sin categoría'}
              </span>
            </p>

            {/* Título del cupón si es diferente */}
            {coupon.title && coupon.title !== coupon.store?.name && (
              <p className="text-white/80 text-xs mt-1 line-clamp-2">{coupon.title}</p>
            )}
          </div>

          {/* Botón de acción */}
          <div className="ml-4" onClick={(e) => e.stopPropagation()}>
            {originalUrl && coupon.code ? (
              <EnhancedCouponButton
                couponCode={coupon.code}
                originalUrl={originalUrl}
                couponData={{
                  coupon_id: coupon.id,
                  coupon_code: coupon.code,
                  store_id: coupon.store_id,
                  store_name: coupon.store?.name || "Unknown Store",
                  discount_type: coupon.discount_type || "unknown",
                  discount_value: coupon.discount_value?.toString() || "0",
                  category: coupon.coupon_category || undefined,
                  owner_id: coupon.store?.owner_id, // Pasar owner_id para verificar excepciones
                }}
                userId={user?.id}
                showExternalIcon={false}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                onCouponUse={() => {
                  console.log("Coupon used:", coupon.id)
                }}
              >
                USAR CUPÓN
              </EnhancedCouponButton>
            ) : originalUrl ? (
              <EnhancedCouponButton
                originalUrl={originalUrl}
                couponData={{
                  coupon_id: coupon.id,
                  coupon_code: coupon.code || `offer-${coupon.id}`,
                  store_id: coupon.store_id,
                  store_name: coupon.store?.name || "Unknown Store",
                  discount_type: coupon.discount_type || "unknown",
                  discount_value: coupon.discount_value?.toString() || "0",
                  category: coupon.coupon_category || undefined,
                  owner_id: coupon.store?.owner_id, // Pasar owner_id para verificar excepciones
                }}
                userId={user?.id}
                showExternalIcon={false}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                VER OFERTA
              </EnhancedCouponButton>
            ) : (
              <Link href={`/cupones/${coupon.id}`} onClick={(e) => e.stopPropagation()}>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl">
                  VER CUPÓN
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay de hover */}
      <div
        className={`absolute inset-0 bg-black/5 transition-opacity duration-300 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </Card>
  )
}
