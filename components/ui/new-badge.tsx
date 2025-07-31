"use client"

import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

interface NewBadgeProps {
  createdAt: string
  className?: string
}

export function NewBadge({ createdAt, className = "" }: NewBadgeProps) {
  const isNew = () => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    return diffInHours <= 24 // Considerar "nuevo" si tiene menos de 24 horas
  }

  if (!isNew()) {
    return null
  }

  return (
    <Badge 
      className={`bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 animate-pulse ${className}`}
    >
      <Sparkles className="w-3 h-3 mr-1" />
      Nuevo
    </Badge>
  )
} 