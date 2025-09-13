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

export default function TecnologiaPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/comparar-precios?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const subcategories = [
    { 
      name: "Ordenadores", 
      image: "/Imagenes landing/imagens cada categoría/Tecnología/ordenadores.png",
      query: "laptop ordenador portatil pc"
    },
    { 
      name: "Smartphones", 
      image: "/Imagenes landing/imagens cada categoría/Tecnología/smartphones.png",
      query: "smartphone movil telefono iphone samsung"
    },
    { 
      name: "Auriculares", 
      image: "/Imagenes landing/imagens cada categoría/Tecnología/Auriculares.png",
      query: "auriculares headphones airpods"
    },
    { 
      name: "Cámaras", 
      image: "/Imagenes landing/imagens cada categoría/Tecnología/camaras.png",
      query: "camara fotografica canon nikon"
    },
  ]

  const popularProducts = [
    "iPhone 15 Pro",
    "MacBook Air M3",
    "Samsung Galaxy S24",
    "iPad Pro",
    "AirPods Pro",
    "Dell XPS 13",
    "Nintendo Switch",
    "PlayStation 5"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Hero con Búsqueda Integrada */}
      <div className="relative">
        <div className="relative h-80 lg:h-96 overflow-hidden">
          <Image
            src="/Imagenes landing/imagens cada categoría/Tecnología/Banner tecnología.png"
            alt="Tecnología Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
          
          {/* Contenido del Banner */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-genty">
                  Tecnología
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Encuentra los mejores precios en ordenadores, smartphones, gadgets y tecnología
                </p>
                
                {/* Buscador integrado en el banner - Mejor posicionamiento */}
                <div className="relative">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    <HybridSearchBar
                      placeholder="Buscar productos de tecnología... Ej: iPhone, MacBook, Samsung TV..."
                      onSearch={(query: string) => {
                        // Redirigir a la página de búsqueda híbrida
                        window.location.href = `/busqueda-hibrida?q=${encodeURIComponent(query)}`
                      }}
                      className="w-full"
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
                onClick={() => router.push(`/comparar-precios?q=${encodeURIComponent(sub.query)}`)}
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
                onClick={() => router.push(`/comparar-precios?q=${encodeURIComponent(product)}`)}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="truncate">{product}</span>
                </div>
              </Button>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-orange-100 mb-6 text-lg">
            Usa nuestro comparador de precios para encontrar cualquier producto de tecnología
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
      </div>
    </div>
  )
}
