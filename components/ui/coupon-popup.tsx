"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CouponPopupProps {
  isOpen: boolean
  couponCode: string
  onClose: () => void
  /** Time the popup stays visible (ms) – default 2 s */
  duration?: number
}

/**
 * Popup that appears after copiar cupón.
 * Fades/zooms in, shows a success icon, and disappears after `duration`.
 */
export function CouponPopup({ isOpen, couponCode, onClose, duration = 2000 }: CouponPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // wait for animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Popup */}
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full transform transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
      >
        <div className="text-center">
          {/* Success icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">¡Código copiado!</h3>

          {/* Coupon code */}
          <div className="bg-gray-100 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center gap-2">
              <Copy className="w-4 h-4 text-gray-600" />
              <span className="font-mono text-lg font-bold text-gray-900">{couponCode}</span>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-gray-600 text-sm">
            El código está en tu portapapeles. <br />
            <span className="font-semibold">Pégalo en el checkout de la tienda</span>
          </p>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-green-500 h-1 rounded-full transition-[width] duration-[2000ms] ease-linear"
              style={{ width: isVisible ? "0%" : "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
