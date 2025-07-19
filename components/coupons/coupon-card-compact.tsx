"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import type { Coupon } from "@/lib/types"
import { EnhancedCouponButton } from "@/components/tracking/enhanced-coupon-button"
import { useUTMTracking } from "@/hooks/use-utm-tracking"
import { useUser } from "@/hooks/use-user"

interface CouponCardCompactProps {
  coupon: Coupon
}

export function CouponCardCompact({ coupon }: CouponCardCompactProps) {
  const { user } = useUser()
  const { generateCouponLink } = useUTMTracking()
  const [isHovered, setIsHovered] = useState(false)

  // Generar el enlace con tracking
  const trackingLink = coupon.store?.website
    ? generateCouponLink(
        coupon.store.website,
        {
          coupon_id: coupon.id,
          coupon_code: coupon.code || `coupon-${coupon.id}`,
          store_id: coupon.store_id,
          store_name: coupon.store?.name || "Unknown Store",
          discount_type: coupon.discount_type || "unknown",
          discount_value: coupon.discount_value?.toString() || "0",
          category: coupon.category || undefined,
        },
        user?.id,
      )
    : null

  // Formatear el valor del descuento
  const formattedDiscount =
    coupon.discount_type === "percentage" ? `${coupon.discount_value || 0}%` : `$${coupon.discount_value || 0}`

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
        isHovered ? "shadow-lg scale-102" : "shadow-md"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo con degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200" />

      {/* Contenido de la tarjeta */}
      <div className="relative h-40 flex flex-col">
        {/* Sección superior - Logo */}
        <div className="flex-1 flex items-center justify-center p-4 bg-white/60">
          {coupon.store?.logo_url ? (
            <div className="w-20 h-12 flex items-center justify-center">
              <Image
                src={coupon.store.logo_url || "/placeholder.svg"}
                alt={coupon.store.name || "Store"}
                width={80}
                height={48}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-20 h-12 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {(coupon.store?.name || "ST").substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Sección inferior - Información */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-3 flex justify-between items-center">
          <div className="flex-1 min-w-0">
            {/* Nombre de la tienda */}
            <h4 className="text-white text-sm font-bold truncate">{coupon.store?.name || "Tienda"}</h4>

            {/* Descuento */}
            <p className="text-white/90 text-xs font-medium">{formattedDiscount} OFF</p>
          </div>

          {/* Botón de acción */}
          <div className="ml-2">
            {trackingLink && coupon.code ? (
              <EnhancedCouponButton
                couponCode={coupon.code}
                trackingLink={trackingLink}
                additionalData={{
                  coupon_id: coupon.id,
                  store_id: coupon.store_id,
                  store_name: coupon.store?.name || "Unknown Store",
                  discount_type: coupon.discount_type || "unknown",
                  discount_value: coupon.discount_value?.toString() || "0",
                }}
                showExternalIcon={false}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1 rounded text-xs transition-all duration-200"
              >
                USAR
              </EnhancedCouponButton>
            ) : (
              <Link href={`/cupones/${coupon.id}`}>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1 rounded text-xs transition-all duration-200">
                  VER
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
