"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Calendar, Zap, Gift, Clock } from "lucide-react"
import Link from "next/link"

interface SpecialEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  backgroundColor: string
  textColor: string
  ctaText: string
  ctaLink: string
  icon: string
  isActive: boolean
}

export function SpecialEventBanner() {
  const [currentEvent, setCurrentEvent] = useState<SpecialEvent | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simular eventos especiales (en producción esto vendría de una API)
    const specialEvents: SpecialEvent[] = [
      {
        id: "black-friday-2024",
        title: "🔥 Black Friday 2024",
        description: "Los mejores descuentos del año están aquí. ¡Hasta 80% OFF en miles de productos!",
        startDate: "2024-11-29",
        endDate: "2024-12-02",
        backgroundColor: "bg-gradient-to-r from-red-600 to-purple-600",
        textColor: "text-white",
        ctaText: "Ver Ofertas Black Friday",
        ctaLink: "/buscar-ofertas?event=black-friday",
        icon: "🔥",
        isActive: true
      },
      {
        id: "cyber-monday-2024",
        title: "⚡ Cyber Monday",
        description: "Descuentos exclusivos en tecnología y electrónicos. ¡No te lo pierdas!",
        startDate: "2024-12-02",
        endDate: "2024-12-03",
        backgroundColor: "bg-gradient-to-r from-blue-600 to-cyan-600",
        textColor: "text-white",
        ctaText: "Ofertas Cyber Monday",
        ctaLink: "/buscar-ofertas?event=cyber-monday",
        icon: "⚡",
        isActive: true
      },
      {
        id: "christmas-2024",
        title: "🎄 Navidad 2024",
        description: "Encuentra los mejores regalos con descuentos increíbles para esta Navidad",
        startDate: "2024-12-15",
        endDate: "2024-12-25",
        backgroundColor: "bg-gradient-to-r from-green-600 to-red-600",
        textColor: "text-white",
        ctaText: "Regalos de Navidad",
        ctaLink: "/buscar-ofertas?event=christmas",
        icon: "🎄",
        isActive: true
      }
    ]

    // Verificar si hay algún evento activo
    const now = new Date()
    const activeEvent = specialEvents.find(event => {
      if (!event.isActive) return false
      
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
      
      return now >= startDate && now <= endDate
    })

    setCurrentEvent(activeEvent || null)
  }, [])

  if (!currentEvent || !isVisible) {
    return null
  }

  const getDaysRemaining = () => {
    const now = new Date()
    const endDate = new Date(currentEvent.endDate)
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()

  return (
    <div className={`${currentEvent.backgroundColor} ${currentEvent.textColor} relative overflow-hidden`}>
      {/* Elementos decorativos animados */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-4 text-2xl animate-bounce opacity-20">
          {currentEvent.icon}
        </div>
        <div className="absolute top-8 right-8 text-xl animate-pulse opacity-30">
          {currentEvent.icon}
        </div>
        <div className="absolute bottom-4 left-1/4 text-lg animate-bounce-slow opacity-25">
          {currentEvent.icon}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="text-2xl">{currentEvent.icon}</span>
              <h2 className="text-xl md:text-2xl font-bold">{currentEvent.title}</h2>
              {daysRemaining > 0 && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Clock className="w-3 h-3 mr-1" />
                  {daysRemaining} día{daysRemaining !== 1 ? 's' : ''} restante{daysRemaining !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-sm md:text-base opacity-90 max-w-2xl">
              {currentEvent.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href={currentEvent.ctaLink}>
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-lg"
              >
                <Gift className="w-4 h-4 mr-2" />
                {currentEvent.ctaText}
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de progreso del tiempo restante */}
      {daysRemaining > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-white/60 transition-all duration-1000 ease-out"
            style={{ 
              width: `${Math.max(0, Math.min(100, (daysRemaining / 7) * 100))}%` 
            }}
          />
        </div>
      )}
    </div>
  )
} 