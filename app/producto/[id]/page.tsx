"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Star,
  ExternalLink,
  Truck,
  Tag,
  Heart,
  Share2,
  ShoppingCart,
  Clock,
  Shield,
  Check,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ProductOffer {
  id: string
  store: string
  storeId: string
  storeLogo: string
  price: string
  originalPrice?: string
  rating: number
  reviewCount: number
  hasFreeship: boolean
  shippingCost?: string
  availability: "in_stock" | "limited" | "out_of_stock"
  productUrl: string
  affiliateUrl?: string
  couponCode?: string
  discount?: number
  deliveryTime?: string
  isSponsored?: boolean
}

interface ProductData {
  id: string
  title: string
  description: string
  category: string
  brand: string
  model: string
  images: string[]
  averageRating: number
  totalReviews: number
  features: string[]
  specifications: Record<string, string>
  offers: ProductOffer[]
}

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  
  const [product, setProduct] = useState<ProductData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showAllOffers, setShowAllOffers] = useState(false)
  const [sortBy, setSortBy] = useState<"price" | "rating" | "delivery">("price")

  useEffect(() => {
    fetchProductData()
  }, [productId])

  const fetchProductData = async () => {
    setIsLoading(true)
    try {
      // En producción, extraer el título del ID y buscar en SERPAPI
      const titleFromId = productId.split('-').slice(0, -1).join(' ').replace(/-/g, ' ')
      
      // Simular búsqueda en SERPAPI basada en el título
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generar datos dinámicos basados en el producto buscado
      const getProductData = (id: string): ProductData => {
        if (id.includes('ps5') || id.includes('playstation')) {
          return {
            id: productId,
            title: "PlayStation 5 Pro 2TB - Blanca Dual Sense",
            description: "La nueva generación de PlayStation con mayor potencia, almacenamiento expandido y la última tecnología en gaming.",
            category: "Videoconsolas",
            brand: "Sony",
            model: "PlayStation 5 Pro",
            images: [
              "/placeholder.jpg",
              "/placeholder.jpg",
              "/placeholder.jpg",
              "/placeholder.jpg"
            ],
            averageRating: 4.8,
            totalReviews: 2456,
            features: [
              "2TB de almacenamiento interno",
              "Tecnología ray tracing avanzada",
              "Resolución 4K nativa",
              "DualSense incluido",
              "Retrocompatibilidad con PS4"
            ],
            specifications: {
              "Almacenamiento": "2TB SSD",
              "Resolución": "4K / 8K",
              "CPU": "AMD Ryzen Zen 2",
              "GPU": "AMD RDNA 2",
              "RAM": "16GB GDDR6",
              "Conectividad": "Wi-Fi 6, Bluetooth 5.1"
            },
            offers: [
          {
            id: "1",
            store: "Amazon",
            storeId: "amazon",
            storeLogo: "/placeholder-logo.png",
            price: "799,99 €",
            originalPrice: "899,99 €",
            rating: 4.9,
            reviewCount: 1234,
            hasFreeship: true,
            availability: "in_stock",
            productUrl: "#",
            affiliateUrl: "#",
            couponCode: "GAMING15",
            discount: 11,
            deliveryTime: "Entrega mañana",
            isSponsored: true
          },
          {
            id: "2",
            store: "MediaMarkt",
            storeId: "mediamarkt",
            storeLogo: "/placeholder-logo.png",
            price: "849,00 €",
            rating: 4.7,
            reviewCount: 567,
            hasFreeship: false,
            shippingCost: "9,99 €",
            availability: "in_stock",
            productUrl: "#",
            deliveryTime: "2-3 días laborables"
          },
          {
            id: "3",
            store: "El Corte Inglés",
            storeId: "elcorteingles",
            storeLogo: "/placeholder-logo.png",
            price: "829,99 €",
            originalPrice: "899,99 €",
            rating: 4.8,
            reviewCount: 789,
            hasFreeship: true,
            availability: "limited",
            productUrl: "#",
            affiliateUrl: "#",
            discount: 8,
            deliveryTime: "3-5 días laborables"
          },
          {
            id: "4",
            store: "Fnac",
            storeId: "fnac",
            storeLogo: "/placeholder-logo.png",
            price: "879,00 €",
            rating: 4.6,
            reviewCount: 234,
            hasFreeship: true,
            availability: "in_stock",
            productUrl: "#",
            deliveryTime: "5-7 días laborables"
          }
        ]
          }
        } else if (id.includes('iphone')) {
          return {
            id: productId,
            title: "iPhone 15 Pro 128GB - Titanio Natural",
            description: "El iPhone más Pro hasta la fecha, con chip A17 Pro, cámaras avanzadas y diseño en titanio.",
            category: "Smartphones",
            brand: "Apple",
            model: "iPhone 15 Pro",
            images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
            averageRating: 4.9,
            totalReviews: 3247,
            features: [
              "Chip A17 Pro con GPU de 6 núcleos",
              "Cámara principal de 48MP",
              "Pantalla Super Retina XDR de 6.1\"",
              "Titanio de grado aeroespacial",
              "iOS 17"
            ],
            specifications: {
              "Pantalla": "6.1\" Super Retina XDR",
              "Chip": "A17 Pro",
              "Almacenamiento": "128GB",
              "Cámara": "48MP + 12MP + 12MP",
              "Batería": "Hasta 23h de video"
            },
            offers: [
              {
                id: "1",
                store: "Apple Store",
                storeId: "apple",
                storeLogo: "/placeholder-logo.png",
                price: "1.199,00 €",
                rating: 4.9,
                reviewCount: 1534,
                hasFreeship: true,
                availability: "in_stock",
                productUrl: "#",
                deliveryTime: "1-2 días laborables"
              },
              {
                id: "2",
                store: "Amazon",
                storeId: "amazon",
                storeLogo: "/placeholder-logo.png",
                price: "1.149,99 €",
                originalPrice: "1.199,00 €",
                rating: 4.8,
                reviewCount: 892,
                hasFreeship: true,
                availability: "in_stock",
                productUrl: "#",
                affiliateUrl: "#",
                discount: 4,
                deliveryTime: "Entrega mañana"
              }
            ]
          }
        } else {
          // Producto genérico basado en el título
          return {
            id: productId,
            title: titleFromId || "Producto no encontrado",
            description: "Descripción del producto buscado.",
            category: "General",
            brand: "Marca",
            model: "Modelo",
            images: ["/placeholder.jpg"],
            averageRating: 4.5,
            totalReviews: 150,
            features: ["Característica 1", "Característica 2"],
            specifications: {
              "Especificación": "Valor"
            },
            offers: [
              {
                id: "1",
                store: "Tienda Online",
                storeId: "generic",
                storeLogo: "/placeholder-logo.png",
                price: "99,99 €",
                rating: 4.5,
                reviewCount: 150,
                hasFreeship: false,
                availability: "in_stock",
                productUrl: "#",
                deliveryTime: "3-5 días laborables"
              }
            ]
          }
        }
      }
      
      setProduct(getProductData(productId.toLowerCase()))
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sortedOffers = product?.offers ? [...product.offers].sort((a, b) => {
    switch (sortBy) {
      case "price":
        const priceA = parseFloat(a.price.replace(/[€.,]/g, ""))
        const priceB = parseFloat(b.price.replace(/[€.,]/g, ""))
        return priceA - priceB
      case "rating":
        return b.rating - a.rating
      case "delivery":
        // Ordenar por tiempo de entrega (simplificado)
        const deliveryOrder = { "Entrega mañana": 1, "2-3 días": 2, "3-5 días": 3, "5-7 días": 4 }
        return (deliveryOrder[a.deliveryTime?.split(" ")[0] + " " + a.deliveryTime?.split(" ")[1] as keyof typeof deliveryOrder] || 5) - 
               (deliveryOrder[b.deliveryTime?.split(" ")[0] + " " + b.deliveryTime?.split(" ")[1] as keyof typeof deliveryOrder] || 5)
      default:
        return 0
    }
  }) : []

  const bestPrice = product?.offers ? Math.min(...product.offers.map(offer => 
    parseFloat(offer.price.replace(/[€.,]/g, ""))
  )) : 0

  const displayedOffers = showAllOffers ? sortedOffers : sortedOffers.slice(0, 3)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="w-full h-96 rounded-lg" />
              <div className="flex gap-2">
                {[1,2,3,4].map(i => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-orange-600">Inicio</Link>
          <span>/</span>
          <Link href={`/categorias/${product.category.toLowerCase()}`} className="hover:text-orange-600">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>

        {/* Botón volver */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-lg border-2 flex-shrink-0 ${
                    selectedImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= product.averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.averageRating}</span>
                  <span className="text-gray-500">({product.totalReviews} reseñas)</span>
                </div>
                <Badge variant="outline">{product.brand}</Badge>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Mejor precio */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Mejor precio encontrado</p>
                    <p className="text-2xl font-bold text-green-800">
                      {bestPrice.toFixed(2)} €
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-700">Ahorro hasta</p>
                    <p className="text-lg font-bold text-green-800">
                      {Math.max(...product.offers.map(o => parseFloat(o.originalPrice?.replace(/[€.,]/g, "") || o.price.replace(/[€.,]/g, "")))) - bestPrice}€
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Características principales */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Características principales</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Comparación de precios */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Comparar precios ({product.offers.length} tiendas)
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="price">Precio</option>
                <option value="rating">Valoración</option>
                <option value="delivery">Entrega</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {displayedOffers.map((offer, index) => (
              <Card key={offer.id} className={`transition-all duration-200 hover:shadow-md ${
                parseFloat(offer.price.replace(/[€.,]/g, "")) === bestPrice ? 'border-green-400 bg-green-50' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={offer.storeLogo}
                          alt={offer.store}
                          className="w-12 h-12 object-contain"
                        />
                        {offer.isSponsored && (
                          <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1">
                            Patrocinado
                          </Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{offer.store}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{offer.rating}</span>
                            <span className="text-gray-500">({offer.reviewCount})</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            offer.availability === 'in_stock' ? 'bg-green-100 text-green-700' :
                            offer.availability === 'limited' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {offer.availability === 'in_stock' && 'En stock'}
                            {offer.availability === 'limited' && 'Stock limitado'}
                            {offer.availability === 'out_of_stock' && 'Sin stock'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {offer.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">
                            {offer.originalPrice}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-gray-900">
                          {offer.price}
                        </span>
                        {parseFloat(offer.price.replace(/[€.,]/g, "")) === bestPrice && (
                          <Badge className="bg-green-500 text-white">
                            Mejor precio
                          </Badge>
                        )}
                      </div>
                      {offer.discount && (
                        <Badge variant="destructive" className="mb-2">
                          -{offer.discount}%
                        </Badge>
                      )}
                    </div>

                    <div className="text-center">
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-1 text-sm">
                          {offer.hasFreeship ? (
                            <>
                              <Truck className="w-4 h-4 text-green-500" />
                              <span className="text-green-600">Envío gratis</span>
                            </>
                          ) : (
                            <>
                              <Truck className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {offer.shippingCost || "Consultar envío"}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{offer.deliveryTime}</span>
                        </div>
                        {offer.couponCode && (
                          <div className="flex items-center gap-1 text-sm">
                            <Tag className="w-4 h-4 text-orange-500" />
                            <span className="text-orange-600 font-medium">{offer.couponCode}</span>
                          </div>
                        )}
                      </div>
                      <Button 
                        className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                        onClick={() => window.open(offer.affiliateUrl || offer.productUrl, "_blank")}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Ver oferta
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {product.offers.length > 3 && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAllOffers(!showAllOffers)}
                className="flex items-center gap-2"
              >
                {showAllOffers ? (
                  <>
                    Ver menos ofertas
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Ver todas las ofertas ({product.offers.length - 3} más)
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Especificaciones técnicas */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Especificaciones técnicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">{key}:</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
