'use client'

import React from 'react'
import { HybridSearchResult, ProcessedProduct } from '@/lib/services/hybrid-search'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, ShoppingCart, ExternalLink, Zap, Clock, Shield, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HybridSearchResultsProps {
  result: HybridSearchResult | null
  isLoading: boolean
  error: string | null
  className?: string
  onProductClick?: (product: ProcessedProduct) => void
  onViewMoreAlternatives?: () => void
  showCacheInfo?: boolean
  compact?: boolean
}

export function HybridSearchResults({
  result,
  isLoading,
  error,
  className = "",
  onProductClick,
  onViewMoreAlternatives,
  showCacheInfo = true,
  compact = false
}: HybridSearchResultsProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-6 animate-pulse", className)}>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Producto principal loading */}
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          {/* Alternativas loading */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("text-center py-8", className)}>
        <div className="text-red-500 mb-2">
          <Shield className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Error en la búsqueda</h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!result || !result.mainProduct) {
    return (
      <div className={cn("text-center py-8", className)}>
        <div className="text-gray-500">
          <Search className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No se encontraron resultados</h3>
          <p className="text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      </div>
    )
  }

  const { mainProduct, alternativeProducts, source, cacheHit, searchMetadata } = result

  return (
    <div className={cn("space-y-6", className)}>
      {/* Información de la búsqueda */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Resultados de búsqueda
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Search className="h-4 w-4" />
          <span>{result.mainProduct && result.alternativeProducts ? result.alternativeProducts.length + 1 : 0} productos encontrados</span>
        </div>
      </div>
      
      {result.searchMetadata?.query && (
        <p className="text-gray-600">
          Búsqueda: <span className="font-semibold text-gray-900">"{result.searchMetadata.query}"</span>
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Producto Principal */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Mejor Opción</h3>
          <MainProductCard 
            product={mainProduct} 
            onProductClick={onProductClick}
            compact={compact}
          />
        </div>

        {/* Productos Alternativos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Alternativas</h3>
            {alternativeProducts.length > 0 && onViewMoreAlternatives && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewMoreAlternatives}
                className="text-xs"
              >
                Ver más alternativas
              </Button>
            )}
          </div>
          
          {alternativeProducts.length > 0 ? (
            <div className="space-y-3">
              {alternativeProducts.map((product) => (
                <AlternativeProductCard
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                  compact={compact}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No hay alternativas disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Botón "Ver otras ofertas" */}
      {alternativeProducts.length > 0 && (
        <div className="text-center pt-6 border-t">
          <Button
            onClick={onViewMoreAlternatives}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Ver otras ofertas similares
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            Descubre más opciones de diferentes tiendas
          </p>
        </div>
      )}
    </div>
  )
}

// Componente para el producto principal
function MainProductCard({ 
  product, 
  onProductClick,
  compact = false 
}: { 
  product: ProcessedProduct
  onProductClick?: (product: ProcessedProduct) => void
  compact?: boolean
}) {
  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product)
    } else {
      // Abrir en nueva pestaña por defecto
      window.open(product.affiliateUrl, '_blank')
    }
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleClick}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight line-clamp-2 text-gray-900">
              {product.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant={product.source === 'nike' ? 'default' : 'secondary'}>
                {product.store}
              </Badge>
              {product.hasDiscount && (
                <Badge variant="destructive" className="text-xs">
                  -{product.discountPercentage}%
                </Badge>
              )}
            </div>
          </div>
          {product.source === 'nike' && (
            <div className="flex-shrink-0">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Zap className="h-3 w-3 mr-1" />
                Nike
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="aspect-[4/3] relative mb-4 overflow-hidden rounded-lg border border-gray-200">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder.jpg'
            }}
          />
          {product.hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
              -{product.discountPercentage}%
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Precios */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-blue-600">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>

          {/* Rating y reviews */}
          {product.rating && (
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating!) 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewCount} reseñas)
              </span>
            </div>
          )}

          {/* Características */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {product.hasFreeship && (
              <div className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4 text-green-600" />
                <span>Envío gratis</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>{product.availability === 'in_stock' ? 'En stock' : 'Stock limitado'}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          onClick={handleClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          size="lg"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver en {product.store}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Componente para productos alternativos
function AlternativeProductCard({ 
  product, 
  onProductClick,
  compact = false 
}: { 
  product: ProcessedProduct
  onProductClick?: (product: ProcessedProduct) => void
  compact?: boolean
}) {
  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product)
    } else {
      window.open(product.affiliateUrl, '_blank')
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Imagen */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 relative overflow-hidden rounded-lg">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder.jpg'
                }}
              />
              {product.hasDiscount && (
                <div className="absolute top-1 right-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-bold">
                  -{product.discountPercentage}%
                </div>
              )}
            </div>
          </div>

          {/* Información */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-tight line-clamp-2 mb-2">
              {product.title}
            </h4>
            
            <div className="space-y-2">
              {/* Precios */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-blue-600">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>

              {/* Tienda y rating */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {product.store}
                </Badge>
                {product.rating && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Características */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {product.hasFreeship && (
                  <span className="flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3" />
                    Gratis
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {product.availability === 'in_stock' ? 'Stock' : 'Limitado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
