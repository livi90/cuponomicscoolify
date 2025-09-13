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

export default function ViajesExperienciasPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/comparar-precios?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const popularProducts = [
    "Vuelos baratos",
    "Hoteles 5 estrellas",
    "Paquetes vacaciones",
    "Cruceros",
    "Excursiones",
    "Alquiler coches",
    "Seguros viaje",
    "Actividades turísticas"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con banner */}
      <div className="relative h-64">
        <img
          src="/Imagenes landing/imagens cada categoría/6 Viajes & Experiencias/banner.png"
          alt="Viajes & Experiencias"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Viajes & Experiencias</h1>
            <p className="text-lg lg:text-xl opacity-90 max-w-2xl">
              Descubre las mejores ofertas en viajes, hoteles, actividades y experiencias únicas
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Barra de búsqueda */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <HybridSearchBar 
              placeholder="Buscar vuelos, hoteles, actividades..."
              onSearch={(query) => router.push(`/comparar-precios?q=${encodeURIComponent(query)}`)}
            />
          </div>
        </div>



        {/* Productos populares */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Búsquedas populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularProducts.map((product, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left justify-start hover:bg-blue-50 hover:border-blue-300"
                onClick={() => router.push(`/comparar-precios?q=${encodeURIComponent(product)}`)}
              >
                <div>
                  <div className="font-medium">{product}</div>
                </div>
              </Button>
            ))}
          </div>
        </section>

        {/* CTA para comparar precios */}
        <section className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Listo para tu próxima aventura?</h2>
          <p className="text-gray-600 mb-6">
            Compara precios de vuelos, hoteles y actividades en tiempo real
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push('/comparar-precios')}
          >
            <Search className="w-5 h-5 mr-2" />
            Comparar Precios
          </Button>
        </section>
      </div>
    </div>
  )
}
