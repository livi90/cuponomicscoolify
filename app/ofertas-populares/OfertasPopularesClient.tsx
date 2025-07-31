"use client"

import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CouponCard } from "@/components/coupons/coupon-card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Star, Clock, Tag, Store, Flame, Zap, Trophy, Users, Eye, MousePointer } from "lucide-react"
import { useEffect, useState, useMemo, useRef } from "react"
import { useLocale } from "@/components/locale-provider"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { BannerAd } from "@/components/banners/BannerAd"
import { NewsletterForm } from "@/components/newsletter/newsletter-form"

// Crear una sola instancia de Supabase para todo el componente
const supabase = createClient()

export const dynamic = "force_dynamic"
export const revalidate = 0

interface OfertasPopularesClientProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function OfertasPopularesClient({ searchParams }: OfertasPopularesClientProps) {
  const [popularCoupons, setPopularCoupons] = useState<any[]>([])
  const [trendingCoupons, setTrendingCoupons] = useState<any[]>([])
  const [topRatedCoupons, setTopRatedCoupons] = useState<any[]>([])
  const [mostViewedCoupons, setMostViewedCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { locale, setLocale } = useLocale()
  const [sortOption, setSortOption] = useState<string>("trending")
  const mainListRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const offersPerPage = 20
  const { user } = useUser()
  const [favoriteCoupons, setFavoriteCoupons] = useState<any[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(false)
  const [showFreeAccessNotice, setShowFreeAccessNotice] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {

        // Obtener cupones populares (con más vistas/clicks)
        const { data: popularCouponsData } = await supabase
          .from("coupons")
          .select(`
            *,
            store:stores(*),
            stats:coupon_stats(*),
            ratings:ratings(*)
          `)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(50)

        // Ordenar cupones populares por vistas/clicks
        const sortedPopularCoupons = popularCouponsData
          ? [...popularCouponsData]
              .sort((a, b) => {
                const aStats = a.stats ? a.stats.views + a.stats.clicks : 0
                const bStats = b.stats ? b.stats.views + b.stats.clicks : 0
                return bStats - aStats
              })
              .slice(0, 20)
          : []

        // Obtener cupones trending (de la última semana con más actividad)
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        
        const { data: trendingCouponsData } = await supabase
          .from("coupons")
          .select(`
            *,
            store:stores(*),
            stats:coupon_stats(*),
            ratings:ratings(*)
          `)
          .eq("is_active", true)
          .gte("created_at", oneWeekAgo.toISOString())
          .order("created_at", { ascending: false })
          .limit(50)

        const sortedTrendingCoupons = trendingCouponsData
          ? [...trendingCouponsData]
              .sort((a, b) => {
                const aStats = a.stats ? a.stats.views + a.stats.clicks : 0
                const bStats = b.stats ? b.stats.views + b.stats.clicks : 0
                return bStats - aStats
              })
              .slice(0, 20)
          : []

        // Obtener cupones mejor valorados
        const { data: topRatedCouponsData } = await supabase
          .from("coupons")
          .select(`
            *,
            store:stores(*),
            stats:coupon_stats(*),
            ratings:ratings(*)
          `)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(50)

        const sortedTopRatedCoupons = topRatedCouponsData
          ? [...topRatedCouponsData]
              .filter(coupon => coupon.ratings && coupon.ratings.length > 0)
              .sort((a, b) => {
                const aAvgRating = a.ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0) / a.ratings.length
                const bAvgRating = b.ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0) / b.ratings.length
                return bAvgRating - aAvgRating
              })
              .slice(0, 20)
          : []

        // Obtener cupones más vistos
        const { data: mostViewedCouponsData } = await supabase
          .from("coupons")
          .select(`
            *,
            store:stores(*),
            stats:coupon_stats(*),
            ratings:ratings(*)
          `)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(50)

        const sortedMostViewedCoupons = mostViewedCouponsData
          ? [...mostViewedCouponsData]
              .sort((a, b) => {
                const aViews = a.stats ? a.stats.views || 0 : 0
                const bViews = b.stats ? b.stats.views || 0 : 0
                return bViews - aViews
              })
              .slice(0, 20)
          : []

        setPopularCoupons(sortedPopularCoupons)
        setTrendingCoupons(sortedTrendingCoupons)
        setTopRatedCoupons(sortedTopRatedCoupons)
        setMostViewedCoupons(sortedMostViewedCoupons)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!user) return
    setLoadingFavorites(true)
    
    const fetchFavorites = async () => {
      const { data: favs } = await supabase
        .from("favorites")
        .select("coupon_id, coupon:coupons(*, store:stores(*), stats:coupon_stats(*), ratings:ratings(*))")
        .eq("user_id", user.id)
      setFavoriteCoupons(favs?.map((f: any) => f.coupon) || [])
      setLoadingFavorites(false)
    }
    fetchFavorites()
  }, [user])

  // Lógica de ordenamiento combinada
  const getCurrentCoupons = useMemo(() => {
    switch (sortOption) {
      case "trending":
        return trendingCoupons
      case "popular":
        return popularCoupons
      case "top-rated":
        return topRatedCoupons
      case "most-viewed":
        return mostViewedCoupons
      default:
        return popularCoupons
    }
  }, [sortOption, trendingCoupons, popularCoupons, topRatedCoupons, mostViewedCoupons])

  const totalPages = Math.ceil(getCurrentCoupons.length / offersPerPage)
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * offersPerPage
    return getCurrentCoupons.slice(start, start + offersPerPage)
  }, [getCurrentCoupons, currentPage])

  // Scroll suave al cambiar de tab o filtro
  useEffect(() => {
    if (mainListRef.current) {
      mainListRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [sortOption])

  // Resetear página al cambiar filtros u orden
  useEffect(() => {
    setCurrentPage(1)
  }, [sortOption])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
          <p className="mt-4 text-gray-600">Cargando ofertas populares...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 py-8 md:py-12 overflow-hidden shadow-lg min-h-[180px]">
        {/* Elementos decorativos animados */}
        <div className="absolute -top-8 left-1/4 w-20 h-20 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-bounce-slow z-0" />
        <div className="absolute top-6 right-1/4 w-14 h-14 bg-gradient-to-tr from-pink-400 to-red-400 rounded-full blur-2xl opacity-20 animate-bounce-slower z-0" />
        <div className="absolute left-8 bottom-0 w-10 h-10 bg-gradient-to-tr from-purple-300 to-pink-300 rounded-full blur-xl opacity-20 animate-bounce-slowest z-0" />
        {/* Iconos decorativos */}
        <div className="absolute left-8 top-8 text-[2.5rem] font-black text-purple-200 drop-shadow-2xl opacity-50 select-none animate-wiggle">🔥</div>
        <div className="absolute right-8 bottom-8 text-[2rem] font-black text-pink-200 drop-shadow-2xl opacity-40 select-none animate-wiggle-reverse">⭐</div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
                          <div className="flex items-center justify-center gap-3 mb-4">
                <Flame className="h-8 w-8 text-yellow-300 animate-pulse" />
                <h1 className="text-2xl md:text-4xl font-extrabold font-genty mb-1 md:mb-0 text-white drop-shadow-lg animate-fade-in-up">
                  Ofertas <span className="text-yellow-300 animate-pulse">POPULARES</span>
                </h1>
                <Trophy className="h-8 w-8 text-yellow-300 animate-pulse" />
              </div>
            <p className="text-white/90 text-base font-semibold drop-shadow-md animate-fade-in-up delay-100">
              Los cupones más utilizados y mejor valorados por nuestra <span className="text-purple-100 font-bold">comunidad</span>
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 animate-fade-in-up delay-200">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Users className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-semibold">+10,000 usuarios</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Eye className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-semibold">+50,000 vistas</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <BannerAd position="top" />

      <main className="container mx-auto px-4 py-12">
        {/* Aviso de acceso libre a las ofertas (cerrable) */}
        {showFreeAccessNotice && (
          <section className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 mb-8 text-center relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-emerald-600 hover:text-emerald-800 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:shadow-md transition-all"
              aria-label="Cerrar aviso"
              onClick={() => setShowFreeAccessNotice(false)}
            >
              ×
            </button>
            <span className="text-emerald-800 font-bold text-lg">
              🎉 ¡No necesitas estar registrado para usar las ofertas de Cuponomics! Puedes aprovechar todos los descuentos sin crear cuenta.
            </span>
          </section>
        )}

        {/* Estadísticas rápidas */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white text-center shadow-lg">
              <div className="text-2xl font-bold">{popularCoupons.length}</div>
              <div className="text-sm opacity-90">Ofertas Populares</div>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-4 text-white text-center shadow-lg">
              <div className="text-2xl font-bold">{trendingCoupons.length}</div>
              <div className="text-sm opacity-90">Trending Ahora</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white text-center shadow-lg">
              <div className="text-2xl font-bold">{topRatedCoupons.length}</div>
              <div className="text-sm opacity-90">Mejor Valorados</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-4 text-white text-center shadow-lg">
              <div className="text-2xl font-bold">{mostViewedCoupons.length}</div>
              <div className="text-sm opacity-90">Más Vistos</div>
            </div>
          </div>
        </section>

        {user && (
          <section className="mb-12">
            <h3 className="text-xl font-bold mb-4">Mis favoritos</h3>
            {loadingFavorites ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : favoriteCoupons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favoriteCoupons.map((coupon: any) => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No tienes ofertas guardadas.</div>
            )}
          </section>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 rounded-2xl shadow-lg p-6 max-h-[80vh] overflow-y-auto border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-3 bg-gradient-to-r from-slate-700 to-gray-700 bg-clip-text text-transparent">
                    <TrendingUp className="h-6 w-6 text-slate-600" />
                    Categorías
                  </h3>
                </div>
                <div className="grid gap-6">
                  <div>
                    <h4 className="font-bold mb-3 text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></span>
                      Tipo de Popularidad
                    </h4>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "trending", label: "Trending Ahora", icon: Flame, color: "from-purple-400 to-pink-500" },
                        { id: "popular", label: "Más Populares", icon: TrendingUp, color: "from-pink-400 to-red-500" },
                        { id: "top-rated", label: "Mejor Valorados", icon: Star, color: "from-red-400 to-orange-500" },
                        { id: "most-viewed", label: "Más Vistos", icon: Eye, color: "from-orange-400 to-yellow-500" },
                      ].map((option) => {
                        const IconComponent = option.icon
                        return (
                          <button
                            key={option.id}
                            onClick={() => setSortOption(option.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
                              sortOption === option.id 
                                ? `bg-gradient-to-r ${option.color} text-white shadow-lg` 
                                : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md"
                            }`}
                          >
                            <IconComponent className="h-5 w-5" />
                            <span className="font-semibold">{option.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                </div>
                
                {/* Referencia muy sutil a productos de outlet al final */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🛍️</span>
                      <h4 className="font-medium text-emerald-700 text-xs">¿Buscas outlet?</h4>
                    </div>
                    <p className="text-xs text-emerald-600 mb-2">
                      Productos con descuentos increíbles
                    </p>
                    <Link href="/productos-en-oferta">
                      <Button size="sm" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-xs py-1 h-6">
                        Ver Outlet
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Offers List */}
          <div className="lg:w-3/4">
            <div ref={mainListRef} />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
              <h2 className="text-2xl font-bold">Ofertas Populares</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Mostrando {paginatedCoupons.length} de {getCurrentCoupons.length} ofertas
                </span>
              </div>
            </div>

            <Tabs defaultValue="trending" className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <TabsList className="bg-gradient-to-r from-slate-100 to-gray-100 rounded-full p-1 flex gap-2 shadow-lg mb-4 border border-slate-200">
                  <TabsTrigger value="trending" className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105">
                    <Flame className="h-4 w-4" />
                    <span>Trending</span>
                  </TabsTrigger>
                  <TabsTrigger value="popular" className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105">
                    <TrendingUp className="h-4 w-4" />
                    <span>Populares</span>
                  </TabsTrigger>
                  <TabsTrigger value="top-rated" className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105">
                    <Star className="h-4 w-4" />
                    <span>Mejor Valorados</span>
                  </TabsTrigger>
                  <TabsTrigger value="most-viewed" className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105">
                    <Eye className="h-4 w-4" />
                    <span>Más Vistos</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="trending">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 transition-opacity duration-500 animate-fade-in">
                  {trendingCoupons.length > 0 ? (
                    trendingCoupons.map((coupon: any) => <CouponCard key={coupon.id} coupon={coupon} />)
                  ) : (
                    <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                      <p className="text-center text-gray-500">
                        No hay ofertas trending disponibles en este momento.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="popular">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 transition-opacity duration-500 animate-fade-in">
                  {popularCoupons.length > 0 ? (
                    popularCoupons.map((coupon: any) => <CouponCard key={coupon.id} coupon={coupon} />)
                  ) : (
                    <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                      <p className="text-center text-gray-500">
                        No hay ofertas populares disponibles en este momento.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="top-rated">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 transition-opacity duration-500 animate-fade-in">
                  {topRatedCoupons.length > 0 ? (
                    topRatedCoupons.map((coupon: any) => <CouponCard key={coupon.id} coupon={coupon} />)
                  ) : (
                    <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                      <p className="text-center text-gray-500">
                        No hay ofertas mejor valoradas disponibles en este momento.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="most-viewed">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 transition-opacity duration-500 animate-fade-in">
                  {mostViewedCoupons.length > 0 ? (
                    mostViewedCoupons.map((coupon: any) => <CouponCard key={coupon.id} coupon={coupon} />)
                  ) : (
                    <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                      <p className="text-center text-gray-500">
                        No hay ofertas más vistas disponibles en este momento.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Anterior
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className={currentPage === i + 1 ? "bg-purple-500 text-white" : ""}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    Siguiente
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Newsletter Section */}
      <section className="py-12 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <NewsletterForm 
            source="ofertas-populares"
            title="¡No te pierdas ninguna oferta popular!"
            description="Suscríbete a nuestro boletín y recibe las ofertas más trending directamente en tu correo."
            className="text-purple-800"
          />
        </div>
      </section>
    </div>
  )
} 