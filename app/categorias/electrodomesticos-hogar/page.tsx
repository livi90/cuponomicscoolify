"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, TrendingUp, Star, Zap, Shield, Clock, Users, Award, Tag } from "lucide-react"
import { HybridSearchBar } from "@/components/search/hybrid-search-bar"

export default function ElectrodomesticosHogarPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showProducts, setShowProducts] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowProducts(true)
    }
  }

  const handleSubcategoryClick = (query: string) => {
    setSearchQuery(query)
    setShowProducts(true)
  }

  const subcategories = [
    { 
      name: "Electrodomésticos", 
      image: "/Imagenes landing/imagens cada categoría/electrodomesticoshogar/electrodomesticos.png",
      query: "nevera lavadora lavavajillas bosch samsung lg"
    },
    { 
      name: "TV y Audio", 
      image: "/Imagenes landing/imagens cada categoría/electrodomesticoshogar/tvyaudio.png",
      query: "television tv smart tv samsung lg sony"
    },
    { 
      name: "Cocina", 
      image: "/Imagenes landing/imagens cada categoría/electrodomesticoshogar/cocina.png",
      query: "microondas horno cafetera freidora"
    },
    { 
      name: "Hogar", 
      image: "/Imagenes landing/imagens cada categoría/electrodomesticoshogar/hogar.png",
      query: "decoracion muebles hogar aspiradora"
    },
  ]

  const popularProducts = [
    "Samsung Smart TV",
    "Bosch lavadora",
    "Dyson aspiradora",
    "Nespresso cafetera",
    "LG nevera",
    "Xiaomi robot aspirador",
    "Philips freidora aire",
    "Teka vitrocerámica"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Hero con Búsqueda Integrada */}
      <div className="relative">
        <div className="relative h-80 lg:h-96 overflow-hidden">
          <Image
            src="/Imagenes landing/imagens cada categoría/electrodomesticoshogar/electrodomesticosbanner.png"
            alt="Electrodomésticos Hogar Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
          
          {/* Contenido del Banner */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 font-genty">
                  Electrodomésticos & Hogar
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Los mejores precios en electrodomésticos, TV, decoración y todo para tu hogar
                </p>
                
                {/* Buscador integrado en el banner - Aparece al hover */}
                <div className="relative group">
                  <div className="flex items-center bg-transparent group-hover:bg-white/20 backdrop-blur-sm rounded-full shadow-xl border border-white/30 group-hover:border-white/50 overflow-hidden transition-all duration-300 opacity-70 group-hover:opacity-100">
                                         <HybridSearchBar
                       placeholder="Buscar electrodomésticos o artículos para el hogar... Ej: Samsung TV, Bosch lavadora..."
                       onSearch={(query: string) => {
                         // Redirigir a la página de búsqueda híbrida
                         window.location.href = `/busqueda-hibrida?q=${encodeURIComponent(query)}`
                       }}
                       className="flex-1 border-0 text-lg py-6 px-4 focus:ring-0 focus:outline-none bg-transparent text-white placeholder:text-white/70 group-hover:placeholder:text-white/90 transition-colors duration-300"
                     />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

        {/* Subcategorías */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorías Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {subcategories.map((sub) => (
              <Card 
                key={sub.name} 
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white hover:bg-orange-50"
                onClick={() => handleSubcategoryClick(sub.query)}
              >
                <CardContent className="p-6 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden group-hover:scale-110 transition-transform">
                    <Image
                      src={sub.image}
                      alt={sub.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{sub.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Productos populares */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Más Buscados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularProducts.map((product) => (
              <Button
                key={product}
                variant="outline"
                className="p-4 h-auto text-left hover:bg-orange-50 hover:border-orange-300 border-gray-200"
                onClick={() => handleSubcategoryClick(product)}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="truncate">{product}</span>
                </div>
              </Button>
            ))}
          </div>
        </section>

        {/* Resultados de productos de Meilisearch */}
        {showProducts && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Productos Encontrados</h2>
              <Button
                variant="outline"
                onClick={() => setShowProducts(false)}
              >
                Ocultar resultados
              </Button>
            </div>
            {/* The MeilisearchProductSearch component was removed, so this section will be empty or need to be re-added if it's intended to be re-introduced. */}
            {/* For now, I'm keeping the structure but noting the missing component. */}
          </section>
        )}

        {/* Call to action */}
        {!showProducts && (
          <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Renueva tu hogar al mejor precio</h2>
            <p className="text-orange-100 mb-6 text-lg">
              Compara precios en las mejores tiendas de electrodomésticos y hogar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/comparar-precios">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                  <Search className="w-5 h-5 mr-2" />
                  Comparador de Precios
                </Button>
              </Link>
              <Link href="/buscar-ofertas">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Tag className="w-5 h-5 mr-2" />
                  Ver Cupones
                </Button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
