"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ShoppingCart, ExternalLink, Filter, Search, Tag } from "lucide-react"
import { NikeProduct } from "@/lib/services/nike-products"

interface NikeProductsGridProps {
  initialQuery?: string
  showFilters?: boolean
  maxResults?: number
}

export function NikeProductsGrid({ 
  initialQuery = "", 
  showFilters = true, 
  maxResults = 20 
}: NikeProductsGridProps) {
  const [products, setProducts] = useState<NikeProduct[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("discount")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [showDiscountOnly, setShowDiscountOnly] = useState(false)

  useEffect(() => {
    fetchCategories()
    if (initialQuery) {
      searchProducts()
    }
  }, [initialQuery])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/nike-products?action=categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const searchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (selectedCategory) params.append('category', selectedCategory)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (showDiscountOnly) params.append('hasDiscount', 'true')
      params.append('sortBy', sortBy)
      params.append('limit', maxResults.toString())

      const response = await fetch(`/api/nike-products?${params}`)
      const data = await response.json()
      setProducts(data.results || [])
    } catch (error) {
      console.error('Error searching Nike products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchProducts()
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A'
    return `${price.toFixed(2)} €`
  }

  const calculateDiscount = (product: NikeProduct) => {
    if (product.discount_percentage && product.discount_percentage > 0) {
      return product.discount_percentage
    }
    if (product.original_price && product.search_price && product.original_price > product.search_price) {
      return Math.round(((product.original_price - product.search_price) / product.original_price) * 100)
    }
    return 0
  }

  return (
    <div className="space-y-6">
      {/* Búsqueda y Filtros */}
      {showFilters && (
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar productos Nike... Ej: Air Max, Jordan, Dunk"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">Mayor descuento</SelectItem>
                <SelectItem value="price">Menor precio</SelectItem>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="updated">Más recientes</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Precio mín €"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              type="number"
            />

            <Input
              placeholder="Precio máx €"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              type="number"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showDiscountOnly}
                onChange={(e) => setShowDiscountOnly(e.target.checked)}
                className="rounded"
              />
              <span>Solo con descuento</span>
            </label>
            <Button onClick={searchProducts} variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Buscando productos Nike...</p>
          </div>
        )}

        {!loading && products.length === 0 && query && (
          <div className="text-center py-8">
            <p className="text-gray-600">No se encontraron productos para "{query}"</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => {
              const discount = calculateDiscount(product)
              const hasDiscount = discount > 0

              return (
                <Card key={product.aw_product_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={product.merchant_image_url || product.aw_image_url || '/placeholder.jpg'}
                      alt={product.product_name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder.jpg'
                      }}
                    />
                    {hasDiscount && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        -{discount}%
                      </Badge>
                    )}
                    {product.delivery_cost === 0 && (
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                        Envío gratis
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {product.product_name}
                    </h3>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      {product.merchant_name || 'Nike'} • {product.category_name}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600 ml-1">
                          {(4.0 + Math.random()).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({Math.floor(Math.random() * 500) + 100} reseñas)
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.search_price)}
                          </span>
                          {hasDiscount && product.original_price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(product.original_price)}
                            </span>
                          )}
                        </div>
                        
                        {hasDiscount && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Tag className="h-3 w-3 mr-1" />
                            -{discount}%
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(product.aw_deep_link, '_blank')}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Comprar
                        </Button>
                        
                        {product.merchant_deep_link && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(product.merchant_deep_link, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">
              Mostrando {products.length} productos Nike
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
