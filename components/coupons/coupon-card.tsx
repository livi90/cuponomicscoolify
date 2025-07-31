"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import type { Coupon } from "@/lib/types"
import { EnhancedCouponButton } from "@/components/tracking/enhanced-coupon-button"
import { useUser } from "@/hooks/use-user"
import { Star, Zap, Flame, Clock, Heart, Store } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { NewBadge } from "@/components/ui/new-badge"

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
      className={`relative overflow-hidden transition-all duration-300 cursor-pointer group rounded-2xl border-0 shadow-lg ${isHovered ? "scale-105 ring-2 ring-orange-300/40" : ""} min-h-[12rem] h-56 bg-gradient-to-br from-white via-orange-50 to-yellow-50`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* BADGES DESTACADOS */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
        <NewBadge createdAt={coupon.created_at} />
        {isExpiringSoon && (
          <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow animate-pulse">
            <Clock className="w-4 h-4 mr-1" /> ¡Última oportunidad!
          </span>
        )}
        {isTopDiscount && (
          <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
            <Zap className="w-4 h-4 mr-1" /> Top descuento
          </span>
        )}
        {isTopRated && (
          <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
            <Star className="w-4 h-4 mr-1" /> Mejor calificado
          </span>
        )}
        {isPopular && (
          <span className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
            <Flame className="w-4 h-4 mr-1" /> Popular
          </span>
        )}
      </div>
      {user && (
        <button
          className={`absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-orange-100 border border-orange-200 transition-colors shadow ${favLoading ? 'opacity-50 pointer-events-none' : ''}`}
          title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          onClick={handleFavorite}
          aria-label="Guardar en favoritos"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-orange-500 text-orange-500' : 'text-gray-400'}`} />
        </button>
      )}
      {/* Fondo decorativo dinámico */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Círculos y detalles decorativos */}
        <div className="absolute top-2 left-6 w-16 h-16 bg-gradient-to-tr from-yellow-200 via-pink-200 to-orange-100 rounded-full opacity-40 blur-xl animate-bounce-slow" />
        <div className="absolute bottom-4 right-8 w-10 h-10 bg-gradient-to-br from-blue-200 via-pink-100 to-orange-100 rounded-full opacity-30 blur-lg animate-bounce-slower" />
        <div className="absolute top-1/2 left-1/2 w-24 h-2 bg-gradient-to-r from-orange-200 via-pink-200 to-blue-200 rounded-full opacity-20 rotate-12" />
        <div className="absolute bottom-2 left-1/3 w-3 h-3 bg-pink-200 rounded-full opacity-30 animate-pulse" />
      </div>
      {/* Fondo con imagen de tarjeta de regalo o degradado */}
      <div className="absolute inset-0 z-10">
        {backgroundImage ? (
          <div className="w-full h-full relative">
            <Image
              src={backgroundImage || "/placeholder.svg"}
              alt={coupon.store?.name || "Store"}
              fill
              className="object-cover opacity-80 blur-[2px] scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-orange-50/80 to-yellow-50/80 rounded-2xl" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white via-orange-50 to-yellow-50 rounded-2xl" />
        )}
      </div>
      {/* Contenido de la tarjeta */}
      <div className="relative h-56 flex flex-col justify-between p-4 z-10">
        {/* Sección superior - Logo y tipo */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow border border-orange-100">
            {coupon.store?.logo_url ? (
              <Image
                src={coupon.store.logo_url || "/placeholder.svg"}
                alt={coupon.store.name || "Store"}
                width={56}
                height={56}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <Store className="h-8 w-8 text-orange-300" />
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-orange-700 text-lg font-extrabold truncate drop-shadow-sm">{coupon.store?.name || "Tienda"}</h3>
            <span className="inline-block mt-1 text-xs font-semibold text-orange-500 bg-orange-100 rounded-full px-2 py-0.5 w-fit shadow">
              {coupon.coupon_type === "code" ? "CUPÓN" : coupon.coupon_type === "deal" ? "OFERTA" : "ENVÍO GRATIS"}
            </span>
          </div>
            </div>
        {/* Descuento y título */}
        <div className="mb-2">
          <span className="text-3xl font-black text-orange-600 drop-shadow-sm">
            {coupon.discount_type === "percentage"
              ? `${coupon.discount_value || 0}%`
              : `$${coupon.discount_value || 0}`}
          </span>
          <span className="ml-2 text-base font-bold text-gray-700">
            {coupon.coupon_type === "code" ? "de descuento" : coupon.coupon_type === "deal" ? "de oferta" : "envío gratis"}
          </span>
          {coupon.title && coupon.title !== coupon.store?.name && (
            <p className="text-gray-600 text-xs mt-1 line-clamp-2">{coupon.title}</p>
          )}
        </div>
        {/* Categoría y expiración */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          {coupon.coupon_category && (
            <span className="bg-orange-50 text-orange-600 rounded-full px-2 py-0.5 font-semibold">{coupon.coupon_category}</span>
          )}
          {expiry && (
            <span className="ml-2">{expiry > now ? `Expira en ${daysToExpire} días` : 'Expirado'}</span>
            )}
          </div>
          {/* Botón de acción */}
        <div className="flex justify-end">
          <div onClick={e => e.stopPropagation()}>
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
                  owner_id: coupon.store?.owner_id,
                }}
                userId={user?.id}
                showExternalIcon={true}
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold px-6 py-2 rounded-full text-base shadow-lg flex items-center gap-2 transition-all duration-200"
                onCouponUse={() => {}}
              >
                <Flame className="w-5 h-5 text-white animate-pulse" /> Usar cupón
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
                  owner_id: coupon.store?.owner_id,
                }}
                userId={user?.id}
                showExternalIcon={true}
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold px-6 py-2 rounded-full text-base shadow-lg flex items-center gap-2 transition-all duration-200"
              >
                <Flame className="w-5 h-5 text-white animate-pulse" /> Ver oferta
              </EnhancedCouponButton>
            ) : (
              <Link href={`/cupones/${coupon.id}`} onClick={e => e.stopPropagation()}>
                <button className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold px-6 py-2 rounded-full text-base shadow-lg flex items-center gap-2 transition-all duration-200">
                  <Flame className="w-5 h-5 text-white animate-pulse" /> Ver cupón
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Overlay hover */}
      <div className={`absolute inset-0 bg-black/5 transition-opacity duration-300 pointer-events-none rounded-2xl ${isHovered ? "opacity-100" : "opacity-0"}`} />
    </Card>
  )
}
