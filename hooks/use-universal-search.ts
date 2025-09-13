import { useState, useCallback, useEffect } from 'react'

export interface UseUniversalSearchOptions {
  minConfidence?: number
  maxNikeResults?: number
  autoSearch?: boolean
  debounceMs?: number
}

export interface UniversalSearchResult {
  isLoading: boolean
  hasNikeResults: boolean
  nikeProducts: any[]
  confidence: number
  matchedKeywords: string[]
  searchKeywords: string[]
  error: string | null
}

export function useUniversalSearch(
  initialQuery: string = '',
  options: UseUniversalSearchOptions = {}
) {
  const {
    minConfidence = 25,
    maxNikeResults = 12,
    autoSearch = false,
    debounceMs = 300
  } = options

  const [query, setQuery] = useState(initialQuery)
  const [result, setResult] = useState<UniversalSearchResult>({
    isLoading: false,
    hasNikeResults: false,
    nikeProducts: [],
    confidence: 0,
    matchedKeywords: [],
    searchKeywords: [],
    error: null
  })

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  const search = useCallback(async (searchQuery: string = query) => {
    if (!searchQuery.trim()) {
      setResult(prev => ({
        ...prev,
        hasNikeResults: false,
        nikeProducts: [],
        confidence: 0,
        matchedKeywords: [],
        searchKeywords: [],
        error: null
      }))
      return
    }

    setResult(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(
        `/api/universal-search?q=${encodeURIComponent(searchQuery)}&minConfidence=${minConfidence}&maxResults=${maxNikeResults}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setResult({
          isLoading: false,
          hasNikeResults: data.result.hasNikeResults,
          nikeProducts: data.result.nikeProducts || [],
          confidence: data.result.confidence || 0,
          matchedKeywords: data.result.matchedKeywords || [],
          searchKeywords: data.result.searchKeywords || [],
          error: null
        })
      } else {
        throw new Error(data.error || 'Error en búsqueda universal')
      }
    } catch (error) {
      console.error('Error en useUniversalSearch:', error)
      setResult(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }))
    }
  }, [query, minConfidence, maxNikeResults])

  const analyzeQuery = useCallback(async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return null

    try {
      const response = await fetch(
        `/api/universal-search?action=analyze&q=${encodeURIComponent(searchQuery)}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.success ? data.analysis : null
    } catch (error) {
      console.error('Error analizando consulta:', error)
      return null
    }
  }, [query])

  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      search(searchQuery)
    }, debounceMs)

    setDebounceTimer(timer)
  }, [search, debounceMs, debounceTimer])

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery)
    
    if (autoSearch) {
      debouncedSearch(newQuery)
    }
  }, [autoSearch, debouncedSearch])

  // Auto-search en el primer render si autoSearch está habilitado
  useEffect(() => {
    if (autoSearch && initialQuery.trim()) {
      search(initialQuery)
    }
  }, [autoSearch, initialQuery, search])

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  return {
    query,
    updateQuery,
    search,
    analyzeQuery,
    result,
    // Helpers para fácil acceso
    isLoading: result.isLoading,
    hasNikeResults: result.hasNikeResults,
    nikeProducts: result.nikeProducts,
    confidence: result.confidence,
    matchedKeywords: result.matchedKeywords,
    error: result.error
  }
}

// Hook simplificado para solo análisis
export function useSearchAnalysis(query: string) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyze = useCallback(async (searchQuery: string = query) => {
    if (!searchQuery.trim()) {
      setAnalysis(null)
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch(
        `/api/universal-search?action=analyze&q=${encodeURIComponent(searchQuery)}`
      )
      
      const data = await response.json()
      setAnalysis(data.success ? data.analysis : null)
    } catch (error) {
      console.error('Error en análisis:', error)
      setAnalysis(null)
    } finally {
      setIsAnalyzing(false)
    }
  }, [query])

  useEffect(() => {
    if (query.trim()) {
      const timer = setTimeout(() => analyze(query), 300)
      return () => clearTimeout(timer)
    } else {
      setAnalysis(null)
    }
  }, [query, analyze])

  return { analysis, isAnalyzing, analyze }
}
