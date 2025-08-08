import { Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface EarlyAdopterBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function EarlyAdopterBadge({ className = "", size = "md" }: EarlyAdopterBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5", 
    lg: "h-4 w-4"
  }

  return (
    <Badge 
      variant="default" 
      className={`bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 ${sizeClasses[size]} ${className}`}
    >
      <Crown className={`${iconSizes[size]} mr-1`} />
      Early Adopter
    </Badge>
  )
}
