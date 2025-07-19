"use client"

import type React from "react"

import type { ReactNode } from "react"
import { useUTMTracking } from "@/hooks/use-utm-tracking"
import type { TrackingLink } from "@/lib/services/utm-tracking"
import { cn } from "@/lib/utils"

interface TrackedLinkProps {
  trackingLink: TrackingLink
  children: ReactNode
  className?: string
  additionalData?: any
  onClick?: () => void
}

export function TrackedLink({ trackingLink, children, className, additionalData, onClick }: TrackedLinkProps) {
  const { handleTrackedClick, isTracking } = useUTMTracking()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    // Ejecutar callback personalizado si existe
    onClick?.()

    // Manejar el tracking y redirección
    await handleTrackedClick(trackingLink, additionalData)
  }

  return (
    <a
      href={trackingLink.tracked_url}
      onClick={handleClick}
      className={cn("cursor-pointer transition-opacity", isTracking && "opacity-75 pointer-events-none", className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}
