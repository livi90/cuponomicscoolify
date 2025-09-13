'use client'

import React, { useState } from 'react'
import { useHybridSearch } from '@/hooks/use-hybrid-search'
import { HybridSearchResults } from './hybrid-search-results'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, X, Zap, Clock, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HybridSearchProps {
  className?: string
  placeholder?: string
  maxResults?: number
  minConfidence?: number
  onProductClick?: (product: any) => void
  onViewMoreAlternatives?: () => void
  compact?: boolean
  autoFocus?: boolean
}

export function HybridSearch({
  className = "",
  placeholder = "Buscar productos...",
  maxResults = 20,
  minConfidence = 25,
  onProductClick,
  onViewMoreAlternatives,
  compact = false,
  autoFocus = false
}: HybridSearchProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    await search(query.trim())
    setIsSearching(false)
  }

  const handleClear = () => {
    setQuery('')
    clearResults()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (!e.target.value.trim()) {
      clearResults()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e as any)
    } else if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Barra de búsqueda */}
      <div className="mb-8">
        <div className="relative">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="pl-10 pr-20 h-12 text-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                autoFocus={autoFocus}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {query && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-9 w-9 p-0 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={!query.trim() || isSearching}
                  className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSearching ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Buscando...</span>
                    </div>
                  ) : (
                    'Buscar'
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Información de la búsqueda */}
          {hasResults && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Badge variant={source === 'hybrid' ? 'default' : source === 'nike_database' ? 'secondary' : 'outline'}>
                    {source === 'hybrid' ? 'Híbrido' : source === 'nike_database' ? 'Base de Datos' : 'SERP API'}
                  </Badge>
                </div>
                {confidence > 0 && (
                  <div className="flex items-center gap-1">
                    <span>Relevancia: {confidence}%</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-blue-600">
                  <Zap className="h-4 w-4" />
                  <span>{searchTime}ms</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenedor de resultados separado */}
      <div className="min-h-[400px]">
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
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-500 mb-2">
              <Shield className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Error en la búsqueda</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {!hasResults && !isLoading && !error && query && !compact && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No se encontraron resultados</h3>
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
            </div>
          </div>
        )}

        {/* Sugerencias de búsqueda */}
        {!hasResults && !isLoading && !error && !query && !compact && (
          <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="text-gray-700">
              <Search className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-4">Búsqueda Híbrida Inteligente</h3>
              <p className="text-sm mb-6 max-w-2xl mx-auto">
                Busca productos y obtén las mejores ofertas combinando nuestra base de datos Nike con resultados de otras tiendas
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-blue-100">
                  <div className="text-blue-600 font-semibold mb-2">🏃‍♂️ Productos Nike</div>
                  <p className="text-xs text-gray-600">Desde nuestra base de datos con descuentos exclusivos</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-100">
                  <div className="text-green-600 font-semibold mb-2">🛍️ Otras Tiendas</div>
                  <p className="text-xs text-gray-600">Resultados de SERP API para más opciones</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-purple-100">
                  <div className="text-purple-600 font-semibold mb-2">⚡ Caché Inteligente</div>
                  <p className="text-xs text-gray-600">Búsquedas rápidas con localStorage</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
