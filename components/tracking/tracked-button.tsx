"use client"

import type React from "react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { useUTMTracking } from "@/hooks/use-utm-tracking"
import type { TrackingLink } from "@/lib/services/utm-tracking"
import { cn } from "@/lib/utils"
import { ExternalLink, Loader2 } from "lucide-react"

interface TrackedButtonProps {
  trackingLink: TrackingLink
  children: ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  additionalData?: any
  onClick?: () => void
  showExternalIcon?: boolean
  disabled?: boolean
}

export function TrackedButton({
  trackingLink,
  children,
  variant = "default",
  size = "default",
  className,
  additionalData,
  onClick,
  showExternalIcon = false,
  disabled = false,
}: TrackedButtonProps) {
  const { handleTrackedClick, isTracking } = useUTMTracking()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (disabled || isTracking) return

    // Ejecutar callback personalizado si existe
    onClick?.()

    // Manejar el tracking y redirección
    await handleTrackedClick(trackingLink, additionalData)
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || isTracking}
      className={cn("transition-all", className)}
    >
      {isTracking ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirigiendo...
        </>
      ) : (
        <>
          {children}
          {showExternalIcon && <ExternalLink className="ml-2 h-4 w-4" />}
        </>
      )}
    </Button>
  )
}
