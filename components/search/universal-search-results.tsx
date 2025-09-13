"use client"

import { useUniversalSearch } from "@/hooks/use-universal-search"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, ExternalLink, Tag, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

interface UniversalSearchResultsProps {
  query: string
  onProductClick?: (product: any) => void
  maxResults?: number
  minConfidence?: number
  className?: string
  showAnalysis?: boolean
  compact?: boolean
}

export function UniversalSearchResults({
  query,
  onProductClick,
  maxResults = 8,
  minConfidence = 25,
  className = "",
  showAnalysis = false,
  compact = false
}: UniversalSearchResultsProps) {
  const { 
    result, 
    search, 
    isLoading, 
    hasNikeResults, 
    nikeProducts, 
    confidence, 
    matchedKeywords 
  } = useUniversalSearch(query, {
    minConfidence,
    maxNikeResults: maxResults,
    autoSearch: false
  })

  useEffect(() => {
    if (query.trim()) {
      const timer = setTimeout(() => search(query), 300)
      return () => clearTimeout(timer)
    }
  }, [query, search])

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!hasNikeResults) {
    return null
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A'
    return `${price.toFixed(2)} €`
  }

  const calculateDiscount = (product: any) => {
    if (product.discount_percentage && product.discount_percentage > 0) {
      return product.discount_percentage
    }
    if (product.original_price && product.search_price && product.original_price > product.search_price) {
      return Math.round(((product.original_price - product.search_price) / product.original_price) * 100)
    }
    return 0
  }

  const displayProducts = nikeProducts.slice(0, maxResults)

  return (
    <div className={className}>
      {/* Header con información de búsqueda */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className={`font-bold text-gray-800 flex items-center gap-2 ${compact ? 'text-lg' : 'text-xl'}`}>
            <span className="text-xl">👟</span>
            Productos Nike
            <Badge className="bg-black text-white text-xs">
              Base de datos local
            </Badge>
          </h3>
          
          {confidence > 0 && (
            <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {confidence}% relevancia
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-600">
          {displayProducts.filter(p => calculateDiscount(p) > 0).length > 0 && (
            <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
              {displayProducts.filter(p => calculateDiscount(p) > 0).length} con descuento
            </Badge>
          )}
          <span>{displayProducts.length} productos</span>
        </div>
      </div>

      {/* Análisis de búsqueda (opcional) */}
      {showAnalysis && matchedKeywords.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Palabras detectadas:</strong> {matchedKeywords.join(', ')}
          </p>
        </div>
      )}

      {/* Grid de productos */}
      <div className={`grid gap-4 ${
        compact 
          ? 'grid-cols-2 lg:grid-cols-4' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`}>
        {displayProducts.map((product) => {
          const discount = calculateDiscount(product)
          const hasDiscount = discount > 0

          return (
            <Card 
              key={product.aw_product_id} 
              className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
                compact ? 'h-auto' : ''
              }`}
              onClick={() => onProductClick?.(product)}
            >
              <div className={`relative ${compact ? 'h-32' : 'h-48'}`}>
                <Image
                  src={product.merchant_image_url || product.aw_image_url || "/placeholder.svg"}
                  alt={product.product_name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder.svg'
                  }}
                />
                
                {hasDiscount && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                    -{discount}%
                  </Badge>
                )}
                
                {product.delivery_cost === 0 && (
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                    Envío gratis
                  </Badge>
                )}
              </div>
              
              <CardContent className={`p-3 ${compact ? 'space-y-1' : 'space-y-2'}`}>
                <h4 className={`font-semibold line-clamp-2 ${compact ? 'text-xs' : 'text-sm'}`}>
                  {product.product_name}
                </h4>
                
                {!compact && (
                  <p className="text-xs text-gray-600">
                    {product.merchant_name || 'Nike'} • {product.category_name}
                  </p>
                )}

                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">
                    {(4.0 + Math.random()).toFixed(1)}
                  </span>
                  {!compact && (
                    <span className="text-xs text-gray-500">
                      ({Math.floor(Math.random() * 500) + 100})
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`font-bold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                        {formatPrice(product.search_price)}
                      </span>
                      {hasDiscount && product.original_price && (
                        <span className="text-xs text-gray-500 line-through ml-1">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                    
                    {hasDiscount && (
                      <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        -{discount}%
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      className={`flex-1 bg-black hover:bg-gray-800 ${compact ? 'text-xs py-1' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(product.aw_deep_link || product.merchant_deep_link, '_blank')
                      }}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      {compact ? 'Ver' : 'Ver producto'}
                    </Button>
                    
                    {!compact && product.merchant_deep_link && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="px-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(product.merchant_deep_link, '_blank')
                        }}
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

      {/* Botón para ver más */}
      {nikeProducts.length > maxResults && (
        <div className="text-center mt-4">
          <Button variant="outline" className="text-black border-gray-200">
            Ver todos los {nikeProducts.length} productos Nike
          </Button>
        </div>
      )}
    </div>
  )
}
