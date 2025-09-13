"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingBag, ArrowRight, Truck, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface FeaturedProduct {
  id: string
  title: string
  price: string
  originalPrice?: string
  rating: number
  reviewCount: number
  store: string
  storeId?: string
  imageUrl: string
  productUrl: string
  affiliateUrl?: string
  hasFreeship: boolean
  hasDiscount: boolean
  discountPercentage?: number
  couponCode?: string
  availability: "in_stock" | "limited" | "out_of_stock"
}

export function FeaturedOffersSection() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        // Búsquedas populares para obtener productos destacados
        const popularSearches = [
          "smartphone",
          "laptop gaming",
          "auriculares bluetooth",
          "smartwatch"
        ]

        // Obtener productos de diferentes categorías
        const allProducts: FeaturedProduct[] = []
        const usedIds = new Set<string>()
        
        for (const search of popularSearches) {
          try {
            const response = await fetch(`/api/search-products?q=${encodeURIComponent(search)}`)
            if (response.ok) {
              const data = await response.json()
              if (data.results && data.results.length > 0) {
                // Tomar solo el primer producto de cada búsqueda para variedad
                const product = data.results[0]
                // Generar ID único si ya existe
                let uniqueId = product.id
                let counter = 1
                while (usedIds.has(uniqueId)) {
                  uniqueId = `${product.id}-${counter}`
                  counter++
                }
                usedIds.add(uniqueId)
                
                allProducts.push({
                  ...product,
                  id: uniqueId
                })
              }
            }
          } catch (error) {
            console.error(`Error fetching products for "${search}":`, error)
          }
        }

        // Si no hay suficientes productos, agregar algunos productos de ejemplo
        if (allProducts.length < 4) {
          const fallbackProducts: FeaturedProduct[] = [
            {
              id: "fallback-1",
              title: "iPhone 15 Pro",
              price: "€999",
              originalPrice: "€1,299",
              rating: 4.8,
              reviewCount: 234,
              store: "Apple",
              storeId: "apple",
              imageUrl: "/placeholder.jpg",
              productUrl: "#",
              hasFreeship: true,
              hasDiscount: true,
              discountPercentage: 23,
              couponCode: "SAVE15NOW",
              availability: "in_stock"
            },
            {
              id: "fallback-2",
              title: "Nike Air Max 90",
              price: "€89",
              originalPrice: "€119",
              rating: 4.6,
              reviewCount: 189,
              store: "Nike",
              storeId: "nike",
              imageUrl: "/placeholder.jpg",
              productUrl: "#",
              hasFreeship: true,
              hasDiscount: true,
              discountPercentage: 25,
              couponCode: "FREESHIP",
              availability: "in_stock"
            },
            {
              id: "fallback-3",
              title: "Samsung Smart TV 55\"",
              price: "€499",
              originalPrice: "€799",
              rating: 4.7,
              reviewCount: 156,
              store: "Samsung",
              storeId: "samsung",
              imageUrl: "/placeholder.jpg",
              productUrl: "#",
              hasFreeship: true,
              hasDiscount: true,
              discountPercentage: 38,
              couponCode: "AUTUMN20",
              availability: "in_stock"
            },
            {
              id: "fallback-4",
              title: "PlayStation 5 Pro 2TB",
              price: "€799",
              originalPrice: "€899",
              rating: 4.8,
              reviewCount: 98,
              store: "Sony",
              storeId: "sony",
              imageUrl: "/placeholder.jpg",
              productUrl: "#",
              hasFreeship: true,
              hasDiscount: true,
              discountPercentage: 11,
              couponCode: "GAMING10",
              availability: "in_stock"
            }
          ]
          
          // Agregar productos de fallback si no hay suficientes productos reales
          const needed = 4 - allProducts.length
          const fallbackToAdd = fallbackProducts.slice(0, needed)
          
          // Asegurar que los IDs de fallback también sean únicos
          fallbackToAdd.forEach((product, index) => {
            let uniqueId = product.id
            let counter = 1
            while (usedIds.has(uniqueId)) {
              uniqueId = `${product.id}-${counter}`
              counter++
            }
            usedIds.add(uniqueId)
            allProducts.push({
              ...product,
              id: uniqueId
            })
          })
        }

        // Limitar a 4 productos
        setFeaturedProducts(allProducts.slice(0, 4))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching featured products:", error)
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="relative">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="absolute top-2 left-2 w-12 h-6 bg-gray-300 rounded"></div>
            </div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
              <div className="flex justify-between mb-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay ofertas destacadas</h3>
        <p className="text-gray-500">Vuelve pronto para ver las mejores ofertas</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
          <div className="relative">
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
            />
            {product.hasDiscount && product.discountPercentage && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                -{product.discountPercentage}%
              </Badge>
            )}
            {product.hasFreeship && (
              <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                <Truck className="w-3 h-3 mr-1" />
                Envío gratis
              </Badge>
            )}
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{product.store}</p>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{product.rating}</span>
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              </div>
              <div className="text-xs text-gray-500">
                {product.availability === 'in_stock' ? 'En stock' : 
                 product.availability === 'limited' ? 'Pocas unidades' : 'Agotado'}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-lg font-bold text-orange-600">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {product.couponCode && (
              <div className="bg-gray-100 rounded-lg p-2 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Código:</span>
                    <code className="font-mono text-xs font-bold text-gray-900">
                      {product.couponCode}
                    </code>
                  </div>
                </div>
              </div>
            )}

            <Link href={product.affiliateUrl || product.productUrl} className="block">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Ver Oferta
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
