'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { HybridSearchContainer } from '@/components/search/hybrid-search-container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, 
  Zap, 
  Target, 
  TrendingDown,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export default function BusquedaHibridaPage() {
  const searchParams = useSearchParams()
  const [initialQuery, setInitialQuery] = useState<string>('')
  
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setInitialQuery(query)
    }
  }, [searchParams])

  const handleProductClick = (product: any) => {
    console.log('Producto clickeado:', product)
    window.open(product.affiliateUrl, '_blank')
  }

  const handleViewMoreAlternatives = () => {
    console.log('Ver más alternativas')
  }

  const popularSearches = [
    "Nike Air Max 90",
    "iPhone 15 Pro", 
    "Samsung Galaxy S24",
    "PlayStation 5",
    "MacBook Air M3",
    "Nike Dunk Low"
  ]

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner con imagen y degradado de fondo - Altura baja */}
      <div className="relative overflow-hidden">
        {/* Fondo con degradado usando tu paleta de colores */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fd9239] via-[#e8812b] to-[#d3701d]"></div>
        
        <div className="container mx-auto px-4 py-6 relative z-20">
          {/* Imagen del banner - con zoom in */}
          <div className="flex items-center justify-center overflow-hidden">
            <img 
              src="/Imagenes landing/banner comparador de precios-Photoroom.png" 
              alt="Comparador de Precios - Encontrar Mejor Precio"
              className="w-full h-[190px] object-contain object-center"
            />
          </div>
        </div>

        {/* Barra de progreso decorativa */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div className="h-full bg-white/60 w-3/4 animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Barra de búsqueda separada del banner */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <HybridSearchContainer
              placeholder="¿Qué producto buscas? Ej: iPhone 15, Nike Air Max..."
              maxResults={20}
              minConfidence={25}
              onProductClick={handleProductClick}
              onViewMoreAlternatives={handleViewMoreAlternatives}
              compact={true}
              autoFocus={true}
              initialQuery={initialQuery}
            />
          </div>
        </div>

        {/* Búsquedas populares - Con contenedor y mejor separación */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Búsquedas Populares
              </h2>
              <p className="text-gray-500 text-sm">Productos que más buscan nuestros usuarios</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularSearches.map((term, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-10 text-xs border-[#dca579] hover:border-[#fd9239] hover:bg-[#ffcea0] hover:text-[#a94d00] transition-all duration-300"
                  onClick={() => {
                    window.location.href = `/busqueda-hibrida?q=${encodeURIComponent(term)}`
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Características principales - Con contenedor y mejor separación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 border-[#dca579] hover:border-[#fd9239] transition-all duration-300 bg-white">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#fd9239'}}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Resultados Precisos</h3>
            <p className="text-gray-600 text-sm">
              Encuentra exactamente lo que buscas con resultados optimizados
            </p>
          </Card>
          
          <Card className="text-center p-6 border-[#dca579] hover:border-[#fd9239] transition-all duration-300 bg-white">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#e8812b'}}>
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Mejores Precios</h3>
            <p className="text-gray-600 text-sm">
              Compara precios de múltiples tiendas para ahorrar más
            </p>
          </Card>
          
          <Card className="text-center p-6 border-[#dca579] hover:border-[#fd9239] transition-all duration-300 bg-white">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#d3701d'}}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Búsqueda Rápida</h3>
            <p className="text-gray-600 text-sm">
              Resultados instantáneos y siempre actualizados
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
