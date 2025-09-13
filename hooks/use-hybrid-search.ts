'use client'

import { useState, useCallback, useEffect } from 'react'
import { HybridSearchResult, SearchOptions } from '@/lib/services/hybrid-search'

interface UseHybridSearchOptions {
  initialQuery?: string
  maxResults?: number
  minConfidence?: number
  autoSearch?: boolean
  debounceMs?: number
}

interface UseHybridSearchReturn {
  // Estado
  result: HybridSearchResult | null
  isLoading: boolean
  error: string | null
  
  // Funciones
  search: (query: string) => Promise<void>
  clearResults: () => void
  
  // Metadatos
  hasResults: boolean
  searchTime: number
  confidence: number
  source: string
  
  // Productos
  mainProduct: HybridSearchResult['mainProduct']
  alternativeProducts: HybridSearchResult['alternativeProducts']
  totalResults: number
}

export function useHybridSearch(options: UseHybridSearchOptions = {}): UseHybridSearchReturn {
  const {
    initialQuery = '',
    maxResults = 20,
    minConfidence = 25,
    autoSearch = false,
    debounceMs = 500
  } = options

  // Estados principales
  const [result, setResult] = useState<HybridSearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  // Debounce para la búsqueda automática
  useEffect(() => {
    if (!autoSearch || !debouncedQuery.trim()) return

    const timer = setTimeout(() => {
      if (debouncedQuery.trim()) {
        search(debouncedQuery)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [debouncedQuery, autoSearch, debounceMs])

  // Función de búsqueda principal
  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResult(null)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/hybrid-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query.trim(),
          maxResults,
          minConfidence
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setResult(data.data)
        console.log(`🔍 Búsqueda híbrida exitosa:`, {
          query: data.data.searchMetadata.query,
          source: data.data.source,
          totalResults: data.data.totalResults,
          cacheHit: data.data.cacheHit,
          searchTime: data.data.searchMetadata.searchTime
        })
      } else {
        throw new Error(data.message || 'Error en la búsqueda')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en la búsqueda'
      setError(errorMessage)
      console.error('Error en búsqueda híbrida:', err)
    } finally {
      setIsLoading(false)
    }
  }, [maxResults, minConfidence])

  // Función para limpiar resultados
  const clearResults = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])


  // Función para actualizar query con debounce
  const updateQuery = useCallback((query: string) => {
    setDebouncedQuery(query)
  }, [])

  // Valores computados
  const hasResults = result !== null && result.totalResults > 0
  const searchTime = result?.searchMetadata.searchTime || 0
  const confidence = result?.searchMetadata.confidence || 0
  const source = result?.source || 'none'
  const mainProduct = result?.mainProduct || null
  const alternativeProducts = result?.alternativeProducts || []
  const totalResults = result?.totalResults || 0

  return {
    // Estado
    result,
    isLoading,
    error,
    
    // Funciones
    search,
    clearResults,
    
    // Metadatos
    hasResults,
    searchTime,
    confidence,
    source,
    
    // Productos
    mainProduct,
    alternativeProducts,
    totalResults
  }
}

// Hook especializado para búsquedas con debounce automático
export function useHybridSearchWithDebounce(
  query: string,
  options: Omit<UseHybridSearchOptions, 'initialQuery' | 'autoSearch'> = {}
): UseHybridSearchReturn {
  const {
    maxResults = 20,
    minConfidence = 25,
    debounceMs = 500
  } = options

  const [debouncedQuery, setDebouncedQuery] = useState(query)

  // Debounce automático
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs])

  const searchHook = useHybridSearch({
    initialQuery: debouncedQuery,
    maxResults,
    minConfidence,
    autoSearch: true,
    debounceMs: 0 // No usar debounce adicional aquí
  })

  // Realizar búsqueda cuando cambie la query debounced
  useEffect(() => {
    if (debouncedQuery.trim() && debouncedQuery !== searchHook.result?.searchMetadata.query) {
      searchHook.search(debouncedQuery)
    }
  }, [debouncedQuery])

  return searchHook
}
