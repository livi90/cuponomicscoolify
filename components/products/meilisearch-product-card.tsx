"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ExternalLink, Eye, Heart, ShoppingCart } from "lucide-react"
import { MeilisearchProduct } from "@/lib/meilisearch/client"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: MeilisearchProduct
  showDescription?: boolean
  variant?: "grid" | "list"
  className?: string
  onProductClick?: (product: MeilisearchProduct) => void
}

export function MeilisearchProductCard({
  product,
  showDescription = true,
  variant = "grid",
  className,
  onProductClick
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  
  // Calcular descuento si hay precio anterior
  const discount = product.product_price_old && product.search_price && 
    !isNaN(product.product_price_old) && !isNaN(product.search_price) &&
    product.product_price_old > product.search_price
    ? Math.round(((product.product_price_old - product.search_price) / product.product_price_old) * 100)
    : null
  
  // Formatear precio
  const formatPrice = (price: number | undefined | null) => {
    if (price === null || price === undefined || isNaN(price)) {
      return 'Precio no disponible'
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price)
  }
  
  // Renderizar estrellas de rating
  const renderRating = (rating?: number) => {
    if (!rating || isNaN(rating) || rating <= 0) return null
    
    const safeRating = Math.min(5, Math.max(0, rating)) // Asegurar que esté entre 0 y 5
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3 w-3",
              star <= safeRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({safeRating.toFixed(1)})</span>
      </div>
    )
  }
  
  // Manejar clic en el producto
  const handleProductClick = () => {
    onProductClick?.(product)
  }
  
  // Manejar clic en "Ver producto"
  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Abrir enlace del producto en nueva pestaña
    window.open(product.aw_deep_link, '_blank', 'noopener,noreferrer')
  }
  
  // Manejar toggle de like
  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }
  
  if (variant === "list") {
    return (
      <Card 
        className={cn(
          "hover:shadow-lg transition-all duration-300 cursor-pointer",
          className
        )}
        onClick={handleProductClick}
      >
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {/* Imagen del producto */}
            <div className="relative w-24 h-24 flex-shrink-0">
              {!imageError ? (
                <Image
                  src={product.merchant_image_url}
                  alt={product.product_name}
                  fill
                  className="object-cover rounded-md"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Sin imagen</span>
                </div>
              )}
              
              {/* Badge de descuento */}
              {discount && discount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                  -{discount}%
                </Badge>
              )}
            </div>
            
            {/* Información del producto */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                    {product.product_name}
                  </h3>
                  
                  {showDescription && product.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {product.description}
                    </p>
                  )}
                  
                  {product.merchant_category && (
                    <Badge variant="outline" className="text-xs mb-2">
                      {product.merchant_category}
                    </Badge>
                  )}
                  
                  {renderRating(product.rating)}
                </div>
                
                {/* Botón de like */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleLike}
                  className="ml-2"
                >
                  <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
                </Button>
              </div>
              
              {/* Precios y botón */}
              <div className="flex justify-between items-end mt-2">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-orange-600">
                      {formatPrice(product.search_price)}
                    </span>
                    {product.product_price_old && product.product_price_old > product.search_price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.product_price_old)}
                      </span>
                    )}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={handleViewProduct}
                  className="flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>Ver producto</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Variant grid (por defecto)
  return (
    <Card 
      className={cn(
        "hover:shadow-xl transition-all duration-300 cursor-pointer group",
        className
      )}
      onClick={handleProductClick}
    >
      <CardContent className="p-4">
        {/* Imagen del producto */}
        <div className="relative w-full h-48 mb-4">
          {!imageError ? (
            <Image
              src={product.merchant_image_url}
              alt={product.product_name}
              fill
              className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {discount && discount > 0 && (
              <Badge className="bg-red-500 text-white">
                -{discount}%
              </Badge>
            )}
          </div>
          
          {/* Botón de like */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleToggleLike}
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
          </Button>
        </div>
        
        {/* Información del producto */}
        <div className="space-y-2">
          {product.merchant_category && (
            <Badge variant="outline" className="text-xs">
              {product.merchant_category}
            </Badge>
          )}
          
          <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
            {product.product_name}
          </h3>
          
          {showDescription && product.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
          
          {renderRating(product.rating)}
          
          {/* Precios */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-orange-600">
                {formatPrice(product.search_price)}
              </span>
              {product.product_price_old && product.product_price_old > product.search_price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.product_price_old)}
                </span>
              )}
            </div>
          </div>
          
          {/* Botón de acción */}
          <Button
            className="w-full mt-4"
            onClick={handleViewProduct}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver producto
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
