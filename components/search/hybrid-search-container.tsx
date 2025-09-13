'use client'

import React, { useEffect } from 'react'
import { useHybridSearch } from '@/hooks/use-hybrid-search'
import { HybridSearchBar } from './hybrid-search-bar'
import { HybridSearchResults } from './hybrid-search-results'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Zap, Clock, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HybridSearchContainerProps {
  className?: string
  placeholder?: string
  maxResults?: number
  minConfidence?: number
  onProductClick?: (product: any) => void
  onViewMoreAlternatives?: () => void
  compact?: boolean
  autoFocus?: boolean
  initialQuery?: string // Added initialQuery prop
}

export function HybridSearchContainer({
  className = "",
  placeholder = "Buscar productos...",
  maxResults = 20,
  minConfidence = 25,
  onProductClick,
  onViewMoreAlternatives,
  compact = false,
  autoFocus = false,
  initialQuery // Destructure initialQuery
}: HybridSearchContainerProps) {
  const {
    result,
    isLoading,
    error,
    search,
    clearResults,
    hasResults,
    searchTime,
    confidence,
    source
  } = useHybridSearch({
    maxResults,
    minConfidence,
    autoSearch: false
  })

  const handleSearch = async (query: string) => {
    await search(query)
  }

  const handleClear = () => {
    clearResults()
  }

  // Búsqueda automática cuando se recibe una query inicial
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      search(initialQuery.trim())
    }
  }, [initialQuery, search])

  return (
    <div className={cn("w-full", className)}>
      {/* SECCIÓN 1: Barra de búsqueda */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 mb-10">
        <HybridSearchBar
          placeholder={placeholder}
          onSearch={handleSearch}
          onClear={handleClear}
          autoFocus={autoFocus}
          disabled={isLoading}
          isLoading={isLoading}
        />

        {/* Información de la búsqueda */}
        {hasResults && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Badge variant={source === 'hybrid' ? 'default' : source === 'nike_database' ? 'secondary' : 'outline'}>
                  {source === 'hybrid' ? 'Híbrido' : source === 'nike_database' ? 'Base de Datos' : 'SERP API'}
                </Badge>
              </div>
              {confidence > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Relevancia: {confidence}%</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Zap className="h-4 w-4" />
                <span>{searchTime}ms</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: Contenedor de resultados completamente separado */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg min-h-[600px]">
        {/* Resultados de búsqueda */}
        {hasResults && (
          <HybridSearchResults
            result={result}
            isLoading={isLoading}
            error={error}
            onProductClick={onProductClick}
            onViewMoreAlternatives={onViewMoreAlternatives}
            compact={compact}
          />
        )}

        {/* Estado de error */}
        {error && !hasResults && (
          <div className="text-center py-20 bg-red-50 rounded-lg m-8">
            <div className="text-red-500 mb-4">
              <Shield className="h-20 w-20 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-3">Error en la búsqueda</h3>
              <p className="text-base text-gray-600">{error}</p>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {!hasResults && !isLoading && !error && !compact && (
          <div className="text-center py-20 bg-gray-50 rounded-lg m-8">
            <div className="text-gray-500">
              <Search className="h-20 w-20 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-3">No se encontraron resultados</h3>
              <p className="text-base">Intenta con otros términos de búsqueda</p>
            </div>
          </div>
        )}

        {/* Sugerencias de búsqueda */}
        {!hasResults && !isLoading && !error && !compact && (
          <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg m-8">
            <div className="text-gray-700">
              <Search className="h-20 w-20 mx-auto mb-6 text-blue-600" />
              <h3 className="text-2xl font-semibold mb-6">Búsqueda Híbrida Inteligente</h3>
              <p className="text-lg mb-10 max-w-3xl mx-auto">
                Busca productos y obtén las mejores ofertas combinando nuestra base de datos Nike con resultados de otras tiendas
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center p-8 bg-white rounded-xl shadow-md border border-blue-100">
                  <div className="text-blue-600 font-semibold mb-4 text-xl">🏃‍♂️ Productos Nike</div>
                  <p className="text-base text-gray-600">Desde nuestra base de datos con descuentos exclusivos</p>
                </div>
                <div className="text-center p-8 bg-white rounded-xl shadow-md border border-green-100">
                  <div className="text-green-600 font-semibold mb-4 text-xl">🛍️ Otras Tiendas</div>
                  <p className="text-base text-gray-600">Resultados de SERP API para más opciones</p>
                </div>
                <div className="text-center p-8 bg-white rounded-xl shadow-md border border-purple-100">
                  <div className="text-purple-600 font-semibold mb-4 text-xl">⚡ Búsqueda Rápida</div>
                  <p className="text-base text-gray-600">Resultados instantáneos y actualizados</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
