"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Check, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { trackingService } from "@/lib/services/tracking-service"
import { CouponPopup } from "@/components/ui/coupon-popup"
import { utmTracker } from "@/lib/services/utm-tracking"

interface CouponData {
  coupon_id: string
  coupon_code: string
  store_id: string
  store_name: string
  discount_type: string
  discount_value: string
  category?: string
  owner_id?: string
}

interface EnhancedCouponButtonProps {
  couponCode?: string
  originalUrl?: string // URL original sin UTM
  trackingLink?: string // Para compatibilidad hacia atrás
  couponData?: CouponData
  userId?: string
  onCouponUse?: () => void
  className?: string
  children: React.ReactNode
  variant?: "default" | "outline"
  showExternalIcon?: boolean
  additionalData?: Record<string, any> // Para compatibilidad hacia atrás
}

export function EnhancedCouponButton({
  couponCode,
  originalUrl,
  trackingLink, // Compatibilidad hacia atrás
  couponData,
  userId,
  onCouponUse,
  className,
  children,
  variant = "default",
  showExternalIcon = false,
  additionalData, // Compatibilidad hacia atrás
}: EnhancedCouponButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // Función para validar y limpiar URL
  const cleanUrl = (url: string): string => {
    try {
      // Si no tiene protocolo, agregar https://
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url
      }

      // Validar que sea una URL válida
      const urlObj = new URL(url)
      return urlObj.toString()
    } catch {
      // Si falla, devolver una URL por defecto
      console.error("Invalid URL:", url)
      return "https://example.com"
    }
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Determinar qué URL usar (nuevo flujo vs compatibilidad)
    const baseUrl = originalUrl || trackingLink

    if (!baseUrl) {
      toast.error("Error: No hay enlace de tienda disponible")
      return
    }

    setIsLoading(true)

    try {
      // Ejecutar callback si existe
      if (onCouponUse) {
        onCouponUse()
      }

      const cleanedOriginalUrl = cleanUrl(baseUrl)
      let finalUrl = cleanedOriginalUrl

      // NUEVO FLUJO: Generar UTM dinámicamente al hacer click
      if (originalUrl && couponData) {
        try {
          const trackingResult = await utmTracker.generateCouponLink(
            cleanedOriginalUrl,
            {
              coupon_id: couponData.coupon_id,
              coupon_code: couponData.coupon_code,
              store_id: couponData.store_id,
              store_name: couponData.store_name,
              discount_type: couponData.discount_type,
              discount_value: couponData.discount_value,
              category: couponData.category,
              owner_id: couponData.owner_id, // Clave para verificar excepciones
            },
            userId,
          )

          finalUrl = trackingResult.tracked_url
        } catch (error) {
          finalUrl = cleanedOriginalUrl
        }
      } else if (trackingLink) {
        finalUrl = cleanedOriginalUrl
      }

      // Registrar el click en Supabase
      const trackingData = couponData || additionalData
      if (trackingData) {
        const storeIdNum = Number(trackingData?.store_id)
        if (trackingData?.coupon_id && trackingData.coupon_id.toString().length > 0) {
          await trackingService.trackClick({
            coupon_id: trackingData.coupon_id,
            coupon_code: couponCode || trackingData.coupon_code || "",
            store_id: Number.isFinite(storeIdNum) ? storeIdNum : undefined,
            store_name: trackingData.store_name,
            category: trackingData.category,
            discount_type: trackingData.discount_type,
            discount_value:
              trackingData?.discount_value && Number.isFinite(Number(trackingData.discount_value))
                ? Number(trackingData.discount_value)
                : undefined,
            original_url: cleanedOriginalUrl,
            tracked_url: finalUrl,
            store_url: cleanedOriginalUrl,
            utm_source: "cuponomics",
            utm_medium: "coupon",
            utm_campaign: `coupon_${trackingData.coupon_id}`,
            utm_content: couponCode || trackingData.coupon_code || "",
            utm_term: trackingData.store_name || "",
          })
        }
      }

      // Copiar cupón al portapapeles si existe
      if (couponCode) {
        let copySuccess = false
        
        // Intentar copiar usando la API moderna
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(couponCode)
            copySuccess = true
            toast.success("¡Cupón copiado! Redirigiendo...", { duration: 1500 })
          } catch (error) {
            console.warn("Error al copiar con navigator.clipboard:", error)
          }
        }
        
        // Fallback: usar método antiguo si la API moderna falla
        if (!copySuccess) {
          try {
            const textArea = document.createElement("textarea")
            textArea.value = couponCode
            textArea.style.position = "fixed"
            textArea.style.left = "-999999px"
            textArea.style.top = "-999999px"
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            const successful = document.execCommand("copy")
            document.body.removeChild(textArea)
            
            if (successful) {
              copySuccess = true
              toast.success("¡Cupón copiado! Redirigiendo...", { duration: 1500 })
            } else {
              toast.error("No se pudo copiar el cupón automáticamente")
            }
          } catch (error) {
            console.error("Error al copiar con fallback:", error)
            toast.error("No se pudo copiar el cupón")
          }
        }
        
        // Esperar 1.5 segundos antes de redirigir
        setTimeout(() => {
          window.open(finalUrl, "_blank", "noopener,noreferrer")
          setIsLoading(false)
        }, 1500)
      } else {
        // Si no hay cupón, redirigir inmediatamente
        window.open(finalUrl, "_blank", "noopener,noreferrer")
        setIsLoading(false)
      }
    } catch (error) {
      toast.error("Error al procesar el cupón")
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isLoading}
        variant={variant}
        className={cn(
          "transition-all duration-200",
          success && "bg-green-500 hover:bg-green-600 text-white",
          className,
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span>Verificando...</span>
          </div>
        ) : success ? (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>¡Copiado!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>{children}</span>
            {showExternalIcon && <ExternalLink className="h-4 w-4" />}
          </div>
        )}
      </Button>

      <CouponPopup
        isOpen={showPopup}
        couponCode={couponCode || ""}
        onClose={() => setShowPopup(false)}
        duration={2000}
      />
    </>
  )
}
