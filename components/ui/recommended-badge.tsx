import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

interface RecommendedBadgeProps {
  className?: string
}

export function RecommendedBadge({ className }: RecommendedBadgeProps) {
  return (
    <Badge 
      variant="default" 
      className={`bg-green-500 hover:bg-green-600 text-white text-xs ${className || ''}`}
    >
      <CheckCircle className="w-3 h-3 mr-1" />
      Recomendado
    </Badge>
  )
}
