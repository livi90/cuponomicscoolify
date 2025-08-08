"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Store, ArrowRight, Star } from "lucide-react"
import { EarlyAdopterBadge } from "@/components/ui/early-adopter-badge"
import { createClient } from "@/lib/supabase/client"

interface EarlyAdopterStore {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  card_image_url: string | null
  category: string | null
  website: string | null
  created_at: string
  is_early_adopter: boolean
}

export function EarlyAdoptersSection() {
  const [stores, setStores] = useState<EarlyAdopterStore[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchEarlyAdopters = async () => {
      try {
        const { data, error } = await supabase
          .from("stores")
          .select("*")
          .eq("is_early_adopter", true)
          .eq("is_active", true)
          .order("created_at", { ascending: true })
          .limit(6)

        if (error) {
          console.error("Error fetching early adopters:", error)
          return
        }

        setStores(data || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEarlyAdopters()
  }, [supabase])

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-amber-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-amber-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-amber-200 rounded mb-4"></div>
                  <div className="h-4 bg-amber-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-amber-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (stores.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Nuestros Pioneros
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Las primeras marcas que confiaron en nosotros y ayudaron a construir esta comunidad. 
            Descubre las tiendas que fueron parte fundamental de nuestro crecimiento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stores.map((store) => (
            <Card key={store.id} className="group hover:shadow-xl transition-all duration-300 border-amber-200 hover:border-amber-300">
              <CardContent className="p-6">
                <div className="relative mb-4">
                  {store.card_image_url || store.logo_url ? (
                    <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                      <Image
                        src={store.card_image_url || store.logo_url || ""}
                        alt={store.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-32 w-full rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <Store className="h-12 w-12 text-amber-600" />
                    </div>
                  )}
                  
                  {/* Badge de Early Adopter */}
                  <div className="absolute top-2 right-2">
                    <EarlyAdopterBadge size="sm" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                      {store.name}
                    </h3>
                    {store.category && (
                      <Badge variant="secondary" className="mt-1">
                        {store.category}
                      </Badge>
                    )}
                  </div>

                  {store.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {store.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      <span>Pionero desde {new Date(store.created_at).getFullYear()}</span>
                    </div>
                    
                    {store.website && (
                      <Link href={store.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                          Visitar
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/tiendas">
            <Button 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3"
            >
              Ver Todas las Tiendas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
