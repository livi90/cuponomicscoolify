"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MeilisearchProductCard } from "./meilisearch-product-card"
import { MeilisearchPagination, usePagination } from "../pagination/meilisearch-pagination"
import { MeilisearchProduct, SearchResponse } from "@/lib/meilisearch/client"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

interface ProductSearchProps {
  initialQuery?: string
  initialCategory?: string
  className?: string
  onProductSelect?: (product: MeilisearchProduct) => void
}

interface Filters {
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}

export function MeilisearchProductSearch({
  initialQuery = "",
  initialCategory,
  className,
  onProductSelect
}: ProductSearchProps) {
  // Estados principales
  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<Filters>({
    category: initialCategory
  })
  const [products, setProducts] = useState<MeilisearchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null)
  
  // Estados de UI
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [categories, setCategories] = useState<string[]>([])
  
  // Paginación
  const { offset, limit, nextPage, previousPage, resetPagination, isFirstPage } = usePagination(20)
  
  // Debounce para la búsqueda
  const debouncedQuery = useDebounce(query, 500)
  
  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategories()
  }, [])
  
  // Realizar búsqueda cuando cambien los parámetros
  useEffect(() => {
    searchProducts()
  }, [debouncedQuery, filters, offset])
  
  // Resetear paginación cuando cambien query o filtros
  useEffect(() => {
    resetPagination()
  }, [debouncedQuery, filters.category, filters.minPrice, filters.maxPrice, filters.sortBy])
  
  const loadCategories = async () => {
    try {
      const response = await fetch('/api/meilisearch-categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }
  
  const searchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const searchParams = new URLSearchParams({
        q: debouncedQuery,
        limit: limit.toString(),
        offset: offset.toString(),
      })
      
      // Agregar filtros
      if (filters.category) {
        searchParams.append('category', filters.category)
      }
      if (filters.minPrice !== undefined) {
        searchParams.append('minPrice', filters.minPrice.toString())
      }
      if (filters.maxPrice !== undefined) {
        searchParams.append('maxPrice', filters.maxPrice.toString())
      }
      if (filters.sortBy) {
        searchParams.append('sortBy', filters.sortBy)
      }
      
      const response = await fetch(`/api/meilisearch-products?${searchParams}`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data.hits)
        setSearchResponse(data.data)
      } else {
        setError(data.error || 'Error al buscar productos')
        setProducts([])
      }
    } catch (error) {
      setError('Error de conexión al buscar productos')
      setProducts([])
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, filters, offset, limit])
  
  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  const clearFilters = () => {
    setFilters({})
  }
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // La búsqueda se realiza automáticamente por el debounce
  }
  
  // Verificar si hay más páginas disponibles
  const hasNextPage = searchResponse ? 
    (searchResponse.estimatedTotalHits || 0) > offset + limit : 
    false
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Barra de búsqueda */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filtros</span>
                {Object.keys(filters).some(key => filters[key as keyof Filters]) && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.keys(filters).filter(key => filters[key as keyof Filters]).length}
                  </Badge>
                )}
              </Button>
            </div>
            
            {/* Filtros */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                {/* Categoría */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría</label>
                  <Select
                    value={filters.category || ""}
                    onValueChange={(value) => handleFilterChange('category', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas las categorías</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Precio mínimo */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Precio mínimo</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ""}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
                
                {/* Precio máximo */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Precio máximo</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
                
                {/* Ordenar por */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                  <Select
                    value={filters.sortBy || ""}
                    onValueChange={(value) => handleFilterChange('sortBy', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Relevancia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Relevancia</SelectItem>
                      <SelectItem value="search_price:asc">Precio: menor a mayor</SelectItem>
                      <SelectItem value="search_price:desc">Precio: mayor a menor</SelectItem>
                      <SelectItem value="rating:desc">Mejor valorados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Botón limpiar filtros */}
                <div className="md:col-span-4 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    disabled={!Object.keys(filters).some(key => filters[key as keyof Filters])}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      
      {/* Resultados */}
      <div className="space-y-4">
        {/* Header de resultados */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">
              {loading ? "Buscando..." : `${searchResponse?.estimatedTotalHits || 0} productos encontrados`}
            </h2>
            {searchResponse && (
              <Badge variant="outline">
                {searchResponse.processingTimeMs}ms
              </Badge>
            )}
          </div>
          
          {/* Toggle de vista */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        )}
        
        {/* Productos */}
        {!loading && products.length > 0 && (
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "space-y-4"
          )}>
            {products.map((product) => (
              <MeilisearchProductCard
                key={product.id}
                product={product}
                variant={viewMode}
                onProductClick={onProductSelect}
              />
            ))}
          </div>
        )}
        
        {/* Sin resultados */}
        {!loading && products.length === 0 && !error && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No se encontraron productos con los criterios de búsqueda.</p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Paginación */}
        {!loading && products.length > 0 && (
          <MeilisearchPagination
            currentOffset={offset}
            limit={limit}
            hasNextPage={hasNextPage}
            onPreviousPage={previousPage}
            onNextPage={nextPage}
            disabled={loading}
          />
        )}
      </div>
    </div>
  )
}


