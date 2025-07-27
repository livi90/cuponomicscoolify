"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingBag, Star, Zap, Clock, TrendingUp } from "lucide-react"

interface OutletProduct {
  id: string
  name: string
  description: string
  original_price: number
  outlet_price: number
  discount_percentage: number
  image_url: string
  store_id: string
  store_name: string
  store_logo_url: string
  rating?: number
  review_count?: number
  is_featured: boolean
  created_at: string
}

export function OutletProducts() {
  const [products, setProducts] = useState<OutletProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState<number | null>(null)

  useEffect(() => {
    fetchOutletProducts()
  }, [])

  const fetchOutletProducts = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("outlet_products")
        .select(`
          *,
          store:stores(name, logo_url)
        `)
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("discount_percentage", { ascending: false })
        .limit(15)

      if (error) throw error

      const formattedProducts = data?.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        original_price: product.original_price,
        outlet_price: product.outlet_price,
        discount_percentage: product.discount_percentage,
        image_url: product.image_url,
        store_id: product.store_id,
        store_name: product.store?.name || "Tienda",
        store_logo_url: product.store?.logo_url || "",
        rating: product.rating,
        review_count: product.review_count,
        is_featured: product.is_featured,
        created_at: product.created_at
      })) || []

      setProducts(formattedProducts)
    } catch (error) {
      console.error("Error fetching outlet products:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, products.length - 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, products.length - 3)) % Math.max(1, products.length - 3))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="relative">
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 h-96 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay productos de outlet disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Botones de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-emerald-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6 text-emerald-700" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-emerald-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6 text-emerald-700" />
      </button>

      {/* Contenedor de productos */}
      <div className="flex gap-6 overflow-hidden transition-transform duration-500 ease-out">
        {products.slice(currentIndex, currentIndex + 4).map((product, index) => (
          <Card
            key={product.id}
            className={`flex-shrink-0 w-80 h-96 relative overflow-hidden transition-all duration-300 cursor-pointer group ${
              isHovered === index ? "scale-105 ring-2 ring-emerald-300/40" : ""
            } bg-gradient-to-br from-white via-emerald-50 to-teal-50 border-0 shadow-lg hover:shadow-xl`}
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(null)}
          >
            {/* Badge de descuento */}
            <div className="absolute top-3 left-3 z-20">
              <span className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                <Zap className="w-4 h-4" />
                -{product.discount_percentage}%
              </span>
            </div>

            {/* Badge de destacado */}
            {product.is_featured && (
              <div className="absolute top-3 right-3 z-20">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                  ⭐ Destacado
                </span>
              </div>
            )}

            {/* Badge de tiempo limitado */}
            <div className="absolute top-12 left-3 z-20">
              <span className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                <Clock className="w-3 h-3" />
                ¡Oferta Limitada!
              </span>
            </div>

            {/* Imagen del producto */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Contenido */}
            <div className="p-4 flex flex-col h-48">
              {/* Logo de la tienda */}
              <div className="flex items-center gap-2 mb-2">
                {product.store_logo_url ? (
                  <Image
                    src={product.store_logo_url}
                    alt={product.store_name}
                    width={24}
                    height={24}
                    className="rounded-full object-contain"
                  />
                ) : (
                  <div className="w-6 h-6 bg-emerald-200 rounded-full" />
                )}
                <span className="text-xs font-semibold text-emerald-700">{product.store_name}</span>
              </div>

              {/* Nombre del producto */}
              <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                {product.name}
              </h3>

              {/* Precios */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-black text-emerald-600">
                  {formatPrice(product.outlet_price)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
                <span className="text-xs text-emerald-600 font-bold">
                  ¡Ahorras {formatPrice(product.original_price - product.outlet_price)}!
                </span>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.review_count || 0})
                  </span>
                </div>
              )}

              {/* Botón de acción */}
              <div className="mt-auto">
                <Link href={`/productos/${product.id}`}>
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    ¡Comprar Ahora!
                  </Button>
                </Link>
              </div>
            </div>

            {/* Overlay hover */}
            <div className={`absolute inset-0 bg-emerald-500/5 transition-opacity duration-300 pointer-events-none ${
              isHovered === index ? "opacity-100" : "opacity-0"
            }`} />
          </Card>
        ))}
      </div>

      {/* Indicadores */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(Math.ceil(products.length / 4))].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === Math.floor(currentIndex / 4) 
                ? "bg-emerald-600 scale-125" 
                : "bg-gray-300 hover:bg-emerald-400"
            }`}
          />
        ))}
      </div>
    </div>
  )
} 