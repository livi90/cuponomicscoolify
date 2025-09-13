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

export default function RopaAccesoriosDeportePage() {
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
      name: "Ropa", 
      image: "/Imagenes landing/imagens cada categoría/ropaaccesoriosdeporte/ropa.png",
      query: "ropa camiseta pantalon vestido zara hm"
    },
    { 
      name: "Accesorios", 
      image: "/Imagenes landing/imagens cada categoría/ropaaccesoriosdeporte/accesorios.png",
      query: "reloj bolso gafas collar pulsera"
    },
    { 
      name: "Deporte", 
      image: "/Imagenes landing/imagens cada categoría/ropaaccesoriosdeporte/deporte.png",
      query: "deporte fitness gym nike adidas"
    },
    { 
      name: "Calzado", 
      image: "/Imagenes landing/imagens cada categoría/ropaaccesoriosdeporte/calzado.png",
      query: "zapatos zapatillas botas nike adidas"
    },
  ]

  const popularProducts = [
    "Nike Air Max",
    "Adidas Ultraboost",
    "Zara abrigo",
    "Levi's jeans",
    "Ray-Ban gafas",
    "Apple Watch",
    "Mochila Eastpak",
    "Sudadera Nike"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Hero con Búsqueda Integrada */}
      <div className="relative">
        <div className="relative h-80 lg:h-96 overflow-hidden">
          <Image
            src="/Imagenes landing/imagens cada categoría/ropaaccesoriosdeporte/bannerropaaccesoriosdeporte.png"
            alt="Ropa Accesorios Deporte Banner"
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
                  Moda & Deporte
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Encuentra las mejores ofertas en moda, accesorios y equipamiento deportivo
                </p>
                
                {/* Buscador integrado en el banner - Aparece al hover */}
                <div className="relative group">
                  <div className="flex items-center bg-transparent group-hover:bg-white/20 backdrop-blur-sm rounded-full shadow-xl border border-white/30 group-hover:border-white/50 overflow-hidden transition-all duration-300 opacity-70 group-hover:opacity-100">
                                         <HybridSearchBar
                       placeholder="Buscar ropa, accesorios o deporte... Ej: Nike, Zara, Adidas..."
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
          <h2 className="text-3xl font-bold mb-4">Encuentra tu estilo perfecto</h2>
          <p className="text-orange-100 mb-6 text-lg">
            Compara precios en las mejores tiendas de moda y deporte
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
