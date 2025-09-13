"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  TrendingDown,
  Zap,
  Target,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock,
  Shield,
  Star,
} from "lucide-react"
import { HybridSearchBar } from "@/components/search/hybrid-search-bar"

export default function ComparadorPreciosPage() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q")
  
  const [showSearch, setShowSearch] = useState(!!queryParam)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Hero Section con imagen del banner */}
      <div className="relative overflow-hidden">
        {/* Fondo con degradado usando tu paleta de colores */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fd9239] via-[#e8812b] to-[#d3701d]"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Imagen del banner */}
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/Imagenes landing/banner comparador de precios-Photoroom.png" 
              alt="Comparador de Precios - Encontrar Mejor Precio"
              className="max-w-full h-auto object-contain max-h-[200px]"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto text-white">
              Encuentra los mejores precios y ahorra en cada compra
            </p>
            
            {/* Barra de búsqueda destacada */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  const query = formData.get('search') as string
                  if (query?.trim()) {
                    window.location.href = `/busqueda-hibrida?q=${encodeURIComponent(query.trim())}`
                  }
                }} className="relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/70" />
                    <input
                      type="text"
                      name="search"
                      placeholder="¿Qué producto quieres comparar?"
                      className="w-full pl-12 pr-24 h-14 text-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder:text-white/70 focus:border-white/40 focus:ring-2 focus:ring-white/20 rounded-xl shadow-sm"
                      autoFocus
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Button
                        type="submit"
                        className="h-9 px-6 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg font-medium transition-colors"
                      >
                        Buscar
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Badges de características */}
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Resultados instantáneos
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Precios verificados
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Mejores ofertas
              </Badge>
            </div>
          </div>
        </div>

        {/* Barra de progreso decorativa */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div className="h-full bg-white/60 w-3/4 animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Estado inicial con diseño mejorado */}
        {!showSearch && (
          <div className="space-y-12">
            {/* Sección de características principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingDown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Precios Actualizados</h3>
                <p className="text-gray-600">Compara precios en tiempo real de múltiples tiendas</p>
              </Card>

              <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Análisis Inteligente</h3>
                <p className="text-gray-600">Encuentra las mejores ofertas y alternativas</p>
              </Card>

              <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ahorro Garantizado</h3>
                <p className="text-gray-600">Ahorra tiempo y dinero en cada búsqueda</p>
              </Card>
            </div>

            {/* Sección de ejemplos de búsquedas populares */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-genty">
                  Búsquedas Populares
                </h2>
                <p className="text-gray-600">Productos que más comparan nuestros usuarios</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { term: "iPhone 15", icon: "Smartphone" },
                  { term: "Nike Air Max", icon: "Zapatillas" },
                  { term: "Samsung TV", icon: "Televisión" },
                  { term: "PlayStation 5", icon: "Consola" },
                ].map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300"
                    onClick={() => {
                      window.location.href = `/busqueda-hibrida?q=${encodeURIComponent(item.term)}`
                    }}
                  >
                    <span className="text-xs text-gray-500 font-medium">{item.icon}</span>
                    <span className="text-sm font-medium">{item.term}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* CTA final */}
            <div className="text-center bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl p-8">
              <div className="max-w-2xl mx-auto">
                <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¿Listo para empezar a ahorrar?
                </h3>
                <p className="text-gray-600 mb-6">
                  Únete a miles de usuarios que ya están ahorrando con nuestro comparador
                </p>
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
                  onClick={() => {
                    document.querySelector('input[placeholder*="producto"]')?.focus()
                  }}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Buscar Productos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
