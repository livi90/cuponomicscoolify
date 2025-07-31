"use client"

import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CouponCard } from "@/components/coupons/coupon-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Star, Clock, Tag, Store, TrendingUp, Filter, Globe } from "lucide-react"
import { useEffect, useState, useMemo, useRef } from "react"
import { useLocale } from "@/components/locale-provider"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Select } from "@/components/ui/select"
import { useUser } from "@/hooks/use-user"
import { BannerAd } from "@/components/banners/BannerAd"
import { NewsletterForm } from "@/components/newsletter/newsletter-form"
import { ViewToggle } from "@/components/view-toggle/view-toggle"
import { SmartBreadcrumbs } from "@/components/breadcrumbs/smart-breadcrumbs"
import { BackToTop } from "@/components/ui/back-to-top"

// Crear una sola instancia de Supabase para todo el componente
const supabase = createClient()

// Crear una sola instancia de Supabase para todo el componente

// Mapeo de idioma/región a país
const LOCALE_TO_COUNTRY: Record<string, string> = {
  "es-MX": "MX",
  "es-ES": "ES",
  "es-AR": "AR",
  "es-CO": "CO",
  "es-CL": "CL",
  "es-PE": "PE",
  "es-UY": "UY",
  "es-VE": "VE",
  "es-EC": "EC",
  "es-BO": "BO",
  "es-PY": "PY",
  "es-CR": "CR",
  "es-PA": "PA",
  "en-US": "US",
  "pt-BR": "BR",
  // Otros mapeos si lo deseas
}
// Mapeo de país a idioma preferido
const COUNTRY_TO_LOCALE: Record<string, string> = {
  "AR": "es",
  "BO": "es",
  "BR": "pt",
  "CL": "es",
  "CO": "es",
  "CR": "es",
  "EC": "es",
  "ES": "es",
  "MX": "es",
  "PA": "es",
  "PE": "es",
  "PY": "es",
  "UY": "es",
  "US": "en",
  "VE": "es",
  "OTRO": "es",
  "no_restriction": "es",
}
const COUNTRY_OPTIONS = [
  { value: "", label: "Todos los países" },
  { value: "no_restriction", label: "No afecta envíos o ventas (global, digital, etc.)" },
  { value: "AR", label: "Argentina" },
  { value: "BO", label: "Bolivia" },
  { value: "BR", label: "Brasil" },
  { value: "CL", label: "Chile" },
  { value: "CO", label: "Colombia" },
  { value: "CR", label: "Costa Rica" },
  { value: "EC", label: "Ecuador" },
  { value: "ES", label: "España" },
  { value: "MX", label: "México" },
  { value: "PA", label: "Panamá" },
  { value: "PE", label: "Perú" },
  { value: "PY", label: "Paraguay" },
  { value: "UY", label: "Uruguay" },
  { value: "US", label: "Estados Unidos" },
  { value: "VE", label: "Venezuela" },
  { value: "OTRO", label: "Otro país" },
]

export const dynamic = "force_dynamic"
export const revalidate = 0

interface BuscarOfertasClientProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

// Componente separado para el filtro de país
function CountryFilter({ selectedCountry, setSelectedCountry }: { selectedCountry: string, setSelectedCountry: (c: string) => void }) {
  const selectRef = useRef<HTMLSelectElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // Memoizar la lista de países
  const countryOptions = useMemo(() => COUNTRY_OPTIONS, [])
  // Bandera o nombre corto
  const selectedLabel = countryOptions.find(opt => opt.value === selectedCountry)?.label || ""

  // Sincronizar con la URL
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value)
    // Actualizar query param
    const params = new URLSearchParams(searchParams?.toString() || "")
    if (e.target.value) {
      params.set("country", e.target.value)
    } else {
      params.delete("country")
    }
    router.replace(pathname + (params.toString() ? `?${params.toString()}` : ""))
  }

  // Teclado: abrir select con enter/space, cerrar con escape
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      setOpen(true)
      setTimeout(() => selectRef.current?.focus(), 0)
    }
  }
  const handleSelectBlur = () => setOpen(false)

  return (
    <div className="relative flex items-center justify-end">
      <button
        type="button"
        ref={buttonRef}
        className={`p-2 rounded-full hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 flex items-center gap-1 ${selectedCountry ? "bg-orange-50 border border-orange-200" : ""}`}
        aria-label="Filtrar por país"
        tabIndex={0}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleButtonKeyDown}
      >
        <Globe className="w-5 h-5 text-orange-400" />
        {selectedCountry && <span className="text-xs text-orange-700 font-semibold">{selectedLabel}</span>}
      </button>
      {/* Menú animado */}
      <div
        className={`absolute right-0 mt-2 z-20 transition-all duration-200 ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="bg-white border border-orange-200 rounded shadow-lg p-2 min-w-[160px] animate-fade-in">
          <div className="text-xs text-gray-500 mb-2 px-1">Filtrar por país</div>
          <select
            id="country"
            ref={selectRef}
            value={selectedCountry}
            onChange={handleChange}
            onBlur={handleSelectBlur}
            className="w-full border border-orange-200 rounded px-2 py-1 text-sm bg-white focus:border-orange-400 focus:ring-0"
            title="Filtrar por país"
          >
            {countryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default function BuscarOfertasClient({ searchParams }: BuscarOfertasClientProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [popularStores, setPopularStores] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])
  const [popularCoupons, setPopularCoupons] = useState<any[]>([])
  const [newCoupons, setNewCoupons] = useState<any[]>([])
  const [outletProducts, setOutletProducts] = useState<any[]>([])
  const [searchedStores, setSearchedStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [autoCountry, setAutoCountry] = useState("")
  const { locale, setLocale } = useLocale()
  const [sortOption, setSortOption] = useState<string>("recent")
  const mainListRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const offersPerPage = 20
  const totalPages = Math.ceil(coupons.length / offersPerPage)
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * offersPerPage
    return coupons.slice(start, start + offersPerPage)
  }, [coupons, currentPage])
  const { user } = useUser()
  const [favoriteCoupons, setFavoriteCoupons] = useState<any[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.search ?? "")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [showFreeAccessNotice, setShowFreeAccessNotice] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Detectar país por idioma del navegador al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const locale = navigator.language || navigator.languages[0] || ""
      const detected = LOCALE_TO_COUNTRY[locale] || ""
      setAutoCountry(detected)
      if (!selectedCountry && detected) {
        setSelectedCountry(detected)
      }
    }
    // Solo en el primer render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {

        // Obtener categorías de la tabla categories (usada por tiendas)
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("name")
          .order("name", { ascending: true })

        // Obtener categorías distintas de los cupones (coupon_category)
        const { data: couponCategoriesData } = await supabase
          .from("coupons")
          .select("coupon_category")
          .eq("is_active", true)

        // Unir y limpiar categorías únicas
        const allCategoriesSet = new Set<string>()
        if (categoriesData) {
          categoriesData.forEach((cat: any) => {
            if (cat.name) allCategoriesSet.add(cat.name)
          })
        }
        if (couponCategoriesData) {
          couponCategoriesData.forEach((cat: any) => {
            if (cat.coupon_category) allCategoriesSet.add(cat.coupon_category)
          })
        }
        const allCategories = Array.from(allCategoriesSet).sort((a, b) => a.localeCompare(b, 'es'))

        // Obtener tiendas populares (con más cupones)
        const { data: popularStoresData } = await supabase
          .from("stores")
          .select("*, coupons:coupons(count)")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(8)

        // Ordenar tiendas por número de cupones
        const sortedStores = popularStoresData
          ? [...popularStoresData].sort((a: any, b: any) => {
              const aCount = a.coupons ? a.coupons.length : 0
              const bCount = b.coupons ? b.coupons.length : 0
              return bCount - aCount
            })
          : []

        // Obtener cupones
        let couponsQuery = supabase
          .from("coupons")
          .select(`
            *,
            store:stores(*),
            stats:coupon_stats(*),
            ratings:ratings(*)
          `)
          .eq("is_active", true)

        // Filtrar por término de búsqueda si se especifica
        if (searchParams.search) {
          const searchQuery = searchParams.search as string
          couponsQuery = couponsQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        }

        // Filtrar por categoría si se especifica
        if (searchParams.category) {
          const storeIds = await supabase
            .from("stores")
            .select("id")
            .eq("category", searchParams.category)
            .then(({ data }: { data: any }) => data?.map((store: any) => store.id) || [])

          if (storeIds.length > 0) {
            couponsQuery = couponsQuery.in("store_id", storeIds)
          } else {
            // Si no hay tiendas en esta categoría, devolver array vacío
            couponsQuery = couponsQuery.eq("id", "no-results")
          }
        }

        // Filtrar por tienda si se especifica
        if (searchParams.store) {
          couponsQuery = couponsQuery.eq("store_id", searchParams.store)
        }

        // Filtrar por tipo de cupón si se especifica
        if (searchParams.type) {
          couponsQuery = couponsQuery.eq("coupon_type", searchParams.type)
        }

        // Filtrar por descuento mínimo si se especifica
        if (searchParams.minDiscount) {
          const minDiscount = Number.parseInt(searchParams.minDiscount as string, 10)
          if (!isNaN(minDiscount)) {
            couponsQuery = couponsQuery.gte("discount_value", minDiscount)
          }
        }

        const { data: couponsData } = await couponsQuery.order("created_at", { ascending: false })
        let filteredCoupons = couponsData || []
        // Filtrar por país (frontend, ya que store.country viene en store)
        if (selectedCountry) {
          filteredCoupons = filteredCoupons.filter((coupon: any) => {
            const storeCountry = coupon.store?.country || ""
            if (selectedCountry === "no_restriction") {
              return storeCountry === "no_restriction"
            }
            return storeCountry === selectedCountry || storeCountry === "no_restriction"
          })
        }

        // FILTRO: Ocultar cupones expirados por fecha
        const now = new Date()
        filteredCoupons = filteredCoupons.filter((coupon: any) => {
          if (!coupon.expiry_date) return true // Sin fecha de expiración, mostrar
          return new Date(coupon.expiry_date) >= now // Solo mostrar si no ha expirado
        })

        // Filtrar por calificación mínima si se especifica (post-procesamiento)
        if (searchParams.minRating) {
          const minRating = Number.parseInt(searchParams.minRating as string, 10)
          if (!isNaN(minRating)) {
            filteredCoupons = filteredCoupons.filter((coupon: any) => {
              if (!coupon.ratings || coupon.ratings.length === 0) return false
              const avgRating =
                coupon.ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0) / coupon.ratings.length
              return avgRating >= minRating
            })
          }
        }

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
          .limit(20)

        // Ordenar cupones populares por vistas/clicks
        const sortedPopularCoupons = popularCouponsData
          ? [...popularCouponsData]
              .sort((a, b) => {
                const aStats = a.stats ? a.stats.views + a.stats.clicks : 0
                const bStats = b.stats ? b.stats.views + b.stats.clicks : 0
                return bStats - aStats
              })
              .slice(0, 8)
          : []

        // Obtener cupones nuevos
        const { data: newCouponsData } = await supabase
          .from("coupons")
          .select(`
            *,
            store:stores(*),
            stats:coupon_stats(*),
            ratings:ratings(*)
          `)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(8)

        // Obtener tiendas si hay búsqueda
        let searchedStores: any[] = []
        if (searchParams.search) {
          const searchQuery = searchParams.search as string
          const { data: storesData } = await supabase
            .from("stores")
            .select("*, coupons:coupons(count)")
            .eq("is_active", true)
            .ilike("name", `%${searchQuery}%`)
            .order("created_at", { ascending: false })
            .limit(10)
          
          searchedStores = storesData?.map((store: any) => ({
            ...store,
            coupons_count: store.coupons ? store.coupons.length : 0
          })) || []
        }

        // Obtener productos de outlet si hay búsqueda
        let outletProducts: any[] = []
        if (searchParams.search) {
          const searchQuery = searchParams.search as string
          const { data: outletData } = await supabase
            .from("outlet_products")
            .select(`
              *,
              store:stores(name, logo_url)
            `)
            .eq("is_active", true)
            .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
            .order("is_featured", { ascending: false })
            .order("discount_percentage", { ascending: false })
            .limit(10)
          
          outletProducts = outletData?.map((product: any) => ({
            ...product,
            store_name: product.store?.name || "Tienda",
            store_logo_url: product.store?.logo_url || ""
          })) || []
        }

        setCategories(allCategories)
        setPopularStores(sortedStores)
        setCoupons(filteredCoupons)
        setPopularCoupons(sortedPopularCoupons)
        setNewCoupons(newCouponsData || [])
        setOutletProducts(outletProducts)
        setSearchedStores(searchedStores)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

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

  // Cambiar idioma automáticamente al cambiar el país
  useEffect(() => {
    if (selectedCountry && COUNTRY_TO_LOCALE[selectedCountry] && setLocale) {
      setLocale(COUNTRY_TO_LOCALE[selectedCountry])
    }
  }, [selectedCountry, setLocale])

  // Lógica de ordenamiento combinada
  const sortedCoupons = useMemo(() => {
    let arr = [...coupons]
    switch (sortOption) {
      case "recent":
        arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "popular":
        arr.sort((a, b) => {
          const aStats = a.stats ? (a.stats.views || 0) + (a.stats.clicks || 0) : 0
          const bStats = b.stats ? (b.stats.views || 0) + (b.stats.clicks || 0) : 0
          return bStats - aStats
        })
        break
      case "discount":
        arr.sort((a, b) => (b.discount_value || 0) - (a.discount_value || 0))
        break
      case "rating":
        arr.sort((a, b) => {
          const aRating = a.ratings && a.ratings.length > 0 ? a.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / a.ratings.length : 0
          const bRating = b.ratings && b.ratings.length > 0 ? b.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / b.ratings.length : 0
          return bRating - aRating
        })
        break
      case "expiring":
        arr.sort((a, b) => {
          const aDate = a.expiry_date ? new Date(a.expiry_date).getTime() : Infinity
          const bDate = b.expiry_date ? new Date(b.expiry_date).getTime() : Infinity
          return aDate - bDate
        })
        break
      case "combo_popular_week":
        arr = arr.filter(c => {
          const created = new Date(c.created_at)
          const now = new Date()
          const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
          return diff <= 7
        })
        arr.sort((a, b) => {
          const aStats = a.stats ? (a.stats.views || 0) + (a.stats.clicks || 0) : 0
          const bStats = b.stats ? (b.stats.views || 0) + (b.stats.clicks || 0) : 0
          return bStats - aStats
        })
        break
      case "combo_new_popular":
        arr = arr.filter(c => {
          const created = new Date(c.created_at)
          const now = new Date()
          const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
          return diff <= 14
        })
        arr.sort((a, b) => {
          const aStats = a.stats ? (a.stats.views || 0) + (a.stats.clicks || 0) : 0
          const bStats = b.stats ? (b.stats.views || 0) + (b.stats.clicks || 0) : 0
          return bStats - aStats
        })
        break
      case "combo_discount_rating":
        arr.sort((a, b) => {
          const aScore = (a.discount_value || 0) * ((a.ratings && a.ratings.length > 0 ? a.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / a.ratings.length : 1))
          const bScore = (b.discount_value || 0) * ((b.ratings && b.ratings.length > 0 ? b.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / b.ratings.length : 1))
          return bScore - aScore
        })
        break
      default:
        break
    }
    return arr
  }, [coupons, sortOption])

  // Scroll suave al cambiar de tab o filtro
  useEffect(() => {
    if (mainListRef.current) {
      mainListRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [sortOption, searchParams])

  // Resetear página al cambiar filtros u orden
  useEffect(() => {
    setCurrentPage(1)
  }, [sortOption, searchParams])

  // Buscar sugerencias al escribir
  useEffect(() => {
    if (!searchInput || searchInput.length < 2) {
      setSuggestions([])
      return
    }
    let active = true
    
    const fetchSuggestions = async () => {
      // Buscar tiendas
      const { data: stores } = await supabase
        .from("stores")
        .select("id, name")
        .ilike("name", `%${searchInput}%`)
        .limit(5)
      // Buscar categorías
      const { data: categories } = await supabase
        .from("categories")
        .select("id, name")
        .ilike("name", `%${searchInput}%`)
        .limit(5)
      // Buscar cupones
      const { data: coupons } = await supabase
        .from("coupons")
        .select("id, title")
        .ilike("title", `%${searchInput}%`)
        .limit(5)
      // Buscar productos de outlet
      const { data: outletProducts } = await supabase
        .from("outlet_products")
        .select("id, name")
        .ilike("name", `%${searchInput}%`)
        .eq("is_active", true)
        .limit(5)
      if (active) {
        setSuggestions([
          ...(stores?.map((s: any) => ({ type: "store", id: s.id, label: s.name })) || []),
          ...(categories?.map((c: any) => ({ type: "category", id: c.id, label: c.name })) || []),
          ...(coupons?.map((c: any) => ({ type: "coupon", id: c.id, label: c.title })) || []),
          ...(outletProducts?.map((p: any) => ({ type: "outlet_product", id: p.id, label: p.name })) || []),
        ])
      }
    }
    fetchSuggestions()
    return () => { active = false }
  }, [searchInput])

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
          <p className="mt-4 text-gray-600">Cargando ofertas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="relative bg-gradient-to-br from-orange-400 via-orange-200 to-white py-8 md:py-12 overflow-hidden shadow-lg min-h-[180px]">
        {/* Elementos decorativos animados (más pequeños) */}
        <div className="absolute -top-8 left-1/4 w-20 h-20 bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-full blur-2xl opacity-30 animate-bounce-slow z-0" />
        <div className="absolute top-6 right-1/4 w-14 h-14 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-20 animate-bounce-slower z-0" />
        <div className="absolute left-8 bottom-0 w-10 h-10 bg-gradient-to-tr from-orange-300 to-yellow-200 rounded-full blur-xl opacity-20 animate-bounce-slowest z-0" />
        {/* Signos de porcentaje 3D (más pequeños) */}
        <div className="absolute left-8 top-8 text-[2.5rem] font-black text-orange-200 drop-shadow-2xl opacity-50 select-none animate-wiggle">%</div>
        <div className="absolute right-8 bottom-8 text-[2rem] font-black text-yellow-300 drop-shadow-2xl opacity-40 select-none animate-wiggle-reverse">%</div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl md:text-4xl font-extrabold font-genty mb-1 md:mb-0 text-white drop-shadow-lg animate-fade-in-up">
                  Encuentra las mejores ofertas <span className="text-yellow-300 animate-pulse">verificadas</span>
                </h1>
                <p className="text-white/90 text-base font-semibold drop-shadow-md animate-fade-in-up delay-100">
                  Miles de cupones y descuentos para tus <span className="text-orange-100 font-bold">tiendas favoritas</span>
                </p>
              </div>
              <CountryFilter selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
            </div>
            {autoCountry && !searchParams.country && (
              <div className="mb-2 text-orange-900 font-bold text-center md:text-left animate-fade-in-up delay-200 drop-shadow">
                <span className="inline-flex items-center gap-2 bg-white/80 rounded-full px-4 py-1 shadow border border-orange-200">
                  <span className="text-orange-600 font-extrabold">{COUNTRY_OPTIONS.find(opt => opt.value === autoCountry)?.label || autoCountry}</span>
                  <span className="text-xs text-gray-600">Ofertas para tu país/región</span>
                </span>
              </div>
            )}
            <div className="relative max-w-2xl mx-auto animate-fade-in-up delay-300">
              <form action="/buscar-ofertas" method="GET" className="flex h-12 shadow-lg rounded-full overflow-hidden border-2 border-orange-200 bg-white/90" autoComplete="off" onSubmit={() => setShowSuggestions(false)}>
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 h-5 w-5" />
                  <Input
                    name="search"
                    type="text"
                    placeholder="Buscar tiendas, productos outlet, cupones, categorías..."
                    value={searchInput}
                    onChange={e => { setSearchInput(e.target.value); setShowSuggestions(true) }}
                    onFocus={() => setShowSuggestions(true)}
                    className="pl-12 h-12 rounded-l-full border-0 focus:ring-2 focus:ring-orange-400 text-base bg-transparent"
                    autoComplete="off"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div ref={suggestionsRef} className="absolute left-0 right-0 top-12 bg-white border border-gray-200 rounded-b shadow-lg z-30 max-h-60 overflow-y-auto animate-fade-in">
                      {suggestions.map((s, i) => (
                        <button
                          key={s.type + s.id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-orange-50 text-base border-b last:border-b-0 border-gray-100"
                          onClick={() => {
                            setSearchInput(s.label)
                            setShowSuggestions(false)
                            if (s.type === "store") {
                              window.location.href = `/buscar-ofertas?store=${s.id}`
                            } else if (s.type === "category") {
                              window.location.href = `/buscar-ofertas?category=${s.id}`
                            } else if (s.type === "coupon") {
                              window.location.href = `/cupones/${s.id}`
                            } else if (s.type === "outlet_product") {
                              window.location.href = `/productos/${s.id}`
                            }
                          }}
                        >
                          <span className="font-medium text-orange-600 mr-2">
                            {s.type === "store" ? "Tienda" : 
                             s.type === "category" ? "Categoría" : 
                             s.type === "outlet_product" ? "Producto Outlet" : 
                             "Cupón"}:
                          </span>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded-r-full px-6 h-12 text-base font-bold shadow-none">
                  Buscar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <BannerAd position="top" />

      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <SmartBreadcrumbs />
        
        {/* Aviso de acceso libre a las ofertas (cerrable) */}
        {showFreeAccessNotice && (
          <section className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center relative shadow-md">
            <button
              className="absolute top-2 right-2 text-yellow-600 hover:text-yellow-800 text-lg font-bold bg-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:shadow-md transition-all"
              aria-label="Cerrar aviso"
              onClick={() => setShowFreeAccessNotice(false)}
            >
              ×
            </button>
            <span className="text-yellow-800 font-semibold text-base">
              🎉 ¡No necesitas estar registrado para usar las ofertas de Cuponomics! Puedes aprovechar todos los descuentos sin crear cuenta.
            </span>
          </section>
        )}

        {/* Tiendas Populares - Movido a una sección principal */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Tiendas Populares</h2>
            <Link href="/ofertas-populares">
              <Button size="sm" variant="outline" className="text-gray-600 border-gray-200 hover:bg-gray-50">
                <TrendingUp className="h-4 w-4 mr-1" />
                Ver Ofertas Populares
              </Button>
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto border border-gray-200">
            <div className="flex gap-6 sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 sm:gap-4">
              {popularStores.length > 0 ? (
                popularStores.map((store: any) => (
                  <Link href={`/tiendas/${store.id}`} key={store.id} className="flex flex-col items-center group text-center min-w-[120px] max-w-[140px] mx-auto transition-all duration-300 hover:scale-110">
                    {/* Marco cuadrado con sombra para el logo */}
                    <div className="w-16 h-16 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:border-gray-300 transition-all duration-300">
                      {store.logo_url ? (
                        <Image
                          src={store.logo_url || "/placeholder.svg?height=60&width=60"}
                          alt={store.name}
                          width={48}
                          height={48}
                          className="object-contain p-1"
                        />
                      ) : (
                        <Store className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <span className="text-xs font-bold truncate max-w-full text-gray-700 group-hover:text-gray-900 transition-colors">{store.name}</span>
                  </Link>
                ))
              ) : (
                <div className="col-span-full flex h-20 items-center justify-center rounded-md border border-dashed border-gray-200">
                  <p className="text-center text-gray-500">No hay tiendas populares disponibles.</p>
                </div>
              )}
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

        {/* Tiendas encontradas en búsqueda */}
        {searchedStores.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🏪</span>
                Tiendas encontradas
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchedStores.map((store: any) => (
                <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative h-48 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
                    {store.logo_url ? (
                      <Image
                        src={store.logo_url}
                        alt={store.name}
                        width={120}
                        height={120}
                        className="object-contain max-w-full max-h-full"
                      />
                    ) : (
                      <Store className="h-16 w-16 text-orange-400" />
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-orange-600 text-white">
                        {store.coupons_count} cupones
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2">{store.name}</h3>
                    {store.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{store.description}</p>
                    )}
                    <div className="flex gap-2">
                      <Link href={`/tiendas/${store.id}`} className="flex-1">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm">
                          Ver Tienda
                        </Button>
                      </Link>
                      <Link href={`/buscar-ofertas?store=${store.id}`} className="flex-1">
                        <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 text-sm">
                          Ver Cupones
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Productos de Outlet encontrados en búsqueda */}
        {outletProducts.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🛍️</span>
                Productos de Outlet encontrados
              </h2>
              <Link href="/productos-en-oferta">
                <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                  Ver todos los productos outlet
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outletProducts.map((product: any) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative h-48">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-emerald-600 text-white">
                        -{product.discount_percentage}%
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {product.store_logo_url ? (
                        <Image
                          src={product.store_logo_url}
                          alt={product.store_name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-emerald-200 rounded-full" />
                      )}
                      <span className="text-xs text-gray-600">{product.store_name}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-emerald-600">
                        ${product.outlet_price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${product.original_price}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {product.product_url ? (
                        <a href={product.product_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                            ¡Comprar Ahora!
                          </Button>
                        </a>
                      ) : (
                        <Link href={`/productos/${product.id}`} className="flex-1">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                            Ver Detalles
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 rounded-2xl shadow-lg p-6 max-h-[80vh] overflow-y-auto border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-3 bg-gradient-to-r from-slate-700 to-gray-700 bg-clip-text text-transparent">
                    <Filter className="h-6 w-6 text-slate-600" />
                    Filtros
                  </h3>
                  <Link href="/buscar-ofertas">
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
                      Limpiar
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-6">

                  <div>
                    <h4 className="font-bold mb-3 text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></span>
                      Categorías
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {categories && categories.length > 0 ? (
                          categories.map((category: any, index: number) => {
                            const colors = [
                              'from-orange-400 to-red-500',
                              'from-red-400 to-pink-500',
                              'from-pink-400 to-rose-500'
                            ]
                            const colorClass = colors[index % colors.length]
                            return (
                              <Link
                                key={category}
                                href={`/buscar-ofertas?category=${encodeURIComponent(category)}`}
                                className={`flex items-center px-3 py-2 rounded-full text-xs font-bold border transition-all duration-200 hover:scale-105 ${
                                  searchParams.category === category 
                                    ? `bg-gradient-to-r ${colorClass} text-white border-transparent shadow-lg` 
                                    : `bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md`
                                }`}
                              >
                                {category}
                              </Link>
                            )
                          })
                      ) : (
                        <p className="text-xs text-slate-500">No hay categorías disponibles.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></span>
                      Descuento
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["10", "25", "50", "70"].map((discount, index) => {
                        const colors = [
                          'from-emerald-400 to-teal-500',
                          'from-teal-400 to-cyan-500',
                          'from-cyan-400 to-blue-500',
                          'from-blue-400 to-indigo-500'
                        ]
                        const colorClass = colors[index]
                        return (
                          <Link
                            key={discount}
                            href={`/buscar-ofertas?minDiscount=${discount}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.store ? `&store=${searchParams.store}` : ""}${searchParams.type ? `&type=${searchParams.type}` : ""}`}
                            className={`flex items-center px-3 py-2 rounded-full text-xs font-bold border transition-all duration-200 hover:scale-105 ${
                              searchParams.minDiscount === discount 
                                ? `bg-gradient-to-r ${colorClass} text-white border-transparent shadow-lg` 
                                : `bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md`
                            }`}
                          >
                            {discount}% o más
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                      Calificación
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[4, 3, 2, 1].map((rating, index) => {
                        const colors = [
                          'from-yellow-400 to-orange-500',
                          'from-orange-400 to-red-500',
                          'from-red-400 to-pink-500',
                          'from-pink-400 to-rose-500'
                        ]
                        const colorClass = colors[index]
                        return (
                          <Link
                            key={rating}
                            href={`/buscar-ofertas?minRating=${rating}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.store ? `&store=${searchParams.store}` : ""}${searchParams.type ? `&type=${searchParams.type}` : ""}`}
                            className={`flex items-center px-3 py-2 rounded-full text-xs font-bold border transition-all duration-200 hover:scale-105 ${
                              searchParams.minRating === rating.toString() 
                                ? `bg-gradient-to-r ${colorClass} text-white border-transparent shadow-lg` 
                                : `bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md`
                            }`}
                          >
                            {rating}+ <Star className="h-3 w-3 ml-1" />
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></span>
                      Tipo
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "code", label: "Código de descuento" },
                        { id: "deal", label: "Oferta" },
                        { id: "shipping", label: "Envío gratis" },
                      ].map((type, index) => {
                        const colors = [
                          'from-orange-400 to-red-500',
                          'from-red-400 to-pink-500',
                          'from-pink-400 to-rose-500'
                        ]
                        const colorClass = colors[index]
                        return (
                          <Link
                            key={type.id}
                            href={`/buscar-ofertas?type=${type.id}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.store ? `&store=${searchParams.store}` : ""}${searchParams.minDiscount ? `&minDiscount=${searchParams.minDiscount}` : ""}${searchParams.minRating ? `&minRating=${searchParams.minRating}` : ""}`}
                            className={`flex items-center px-3 py-2 rounded-full text-xs font-bold border transition-all duration-200 hover:scale-105 ${
                              searchParams.type === type.id 
                                ? `bg-gradient-to-r ${colorClass} text-white border-transparent shadow-lg` 
                                : `bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md`
                            }`}
                          >
                            {type.label}
                          </Link>
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
                
                {/* Filtros activos */}
                {(searchParams.category ||
                  searchParams.store ||
                  searchParams.type ||
                  searchParams.minDiscount ||
                  searchParams.minRating) && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3">Filtros activos</h4>
                    <div className="flex flex-wrap gap-2">
                      {searchParams.category && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <span>Categoría: {searchParams.category}</span>
                          <Link
                            href={`/buscar-ofertas${
                              searchParams.store ? `?store=${searchParams.store}` : ""
                            }${searchParams.type ? `${searchParams.store ? "&" : "?"}type=${searchParams.type}` : ""}${
                              searchParams.minDiscount
                                ? `${searchParams.store || searchParams.type ? "&" : "?"}minDiscount=${searchParams.minDiscount}`
                                : ""
                            }${searchParams.minRating ? `${searchParams.store || searchParams.type || searchParams.minDiscount ? "&" : "?"}minRating=${searchParams.minRating}` : ""}`}
                            className="ml-1 hover:text-orange-500"
                          >
                            ×
                          </Link>
                        </Badge>
                      )}
                      {searchParams.store && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <span>
                            Tienda:{" "}
                            {popularStores.find((store) => store.id === searchParams.store)?.name || searchParams.store}
                          </span>
                          <Link
                            href={`/buscar-ofertas${
                              searchParams.category ? `?category=${searchParams.category}` : ""
                            }${searchParams.type ? `${searchParams.category ? "&" : "?"}type=${searchParams.type}` : ""}${
                              searchParams.minDiscount
                                ? `${searchParams.category || searchParams.type ? "&" : "?"}minDiscount=${searchParams.minDiscount}`
                                : ""
                            }${searchParams.minRating ? `${searchParams.category || searchParams.type || searchParams.minDiscount ? "&" : "?"}minRating=${searchParams.minRating}` : ""}`}
                            className="ml-1 hover:text-orange-500"
                          >
                            ×
                          </Link>
                        </Badge>
                      )}
                      {searchParams.type && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <span>
                            Tipo:{" "}
                            {searchParams.type === "code"
                              ? "Código"
                              : searchParams.type === "deal"
                                ? "Oferta"
                                : "Envío gratis"}
                          </span>
                          <Link
                            href={`/buscar-ofertas${
                              searchParams.category ? `?category=${searchParams.category}` : ""
                            }${searchParams.store ? `${searchParams.category ? "&" : "?"}store=${searchParams.store}` : ""}${
                              searchParams.minDiscount
                                ? `${searchParams.category || searchParams.store ? "&" : "?"}minDiscount=${searchParams.minDiscount}`
                                : ""
                            }${searchParams.minRating ? `${searchParams.category || searchParams.store || searchParams.minDiscount ? "&" : "?"}minRating=${searchParams.minRating}` : ""}`}
                            className="ml-1 hover:text-orange-500"
                          >
                            ×
                          </Link>
                        </Badge>
                      )}
                      {searchParams.minDiscount && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <span>Descuento: {searchParams.minDiscount}% o más</span>
                          <Link
                            href={`/buscar-ofertas${
                              searchParams.category ? `?category=${searchParams.category}` : ""
                            }${searchParams.store ? `${searchParams.category ? "&" : "?"}store=${searchParams.store}` : ""}${
                              searchParams.type
                                ? `${searchParams.category || searchParams.store ? "&" : "?"}type=${searchParams.type}`
                                : ""
                            }${searchParams.minRating ? `${searchParams.category || searchParams.store || searchParams.type ? "&" : "?"}minRating=${searchParams.minRating}` : ""}`}
                            className="ml-1 hover:text-orange-500"
                          >
                            ×
                          </Link>
                        </Badge>
                      )}
                      {searchParams.minRating && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <span>
                            Calificación: {searchParams.minRating}+ <Star className="h-3 w-3 inline" />
                          </span>
                          <Link
                            href={`/buscar-ofertas${
                              searchParams.category ? `?category=${searchParams.category}` : ""
                            }${searchParams.store ? `${searchParams.category ? "&" : "?"}store=${searchParams.store}` : ""}${
                              searchParams.type
                                ? `${searchParams.category || searchParams.store ? "&" : "?"}type=${searchParams.type}`
                                : ""
                            }${searchParams.minDiscount ? `${searchParams.category || searchParams.store || searchParams.type ? "&" : "?"}minDiscount=${searchParams.minDiscount}` : ""}`}
                            className="ml-1 hover:text-orange-500"
                          >
                            ×
                          </Link>
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

            {/* Offers List */}
            <div className="lg:w-3/4">
              <div ref={mainListRef} />
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <h2 className="text-2xl font-bold">Ofertas</h2>
                <div className="flex items-center gap-4">
                  <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
                  <div className="flex items-center gap-2">
                    <label htmlFor="sort-offers" className="text-sm font-medium text-gray-700">Ordenar por:</label>
                    <select
                      id="sort-offers"
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={sortOption}
                      onChange={e => setSortOption(e.target.value)}
                    >
                      <option value="recent">Más recientes</option>
                      <option value="popular">Más populares</option>
                      <option value="discount">Mayor descuento</option>
                      <option value="rating">Mejor calificación</option>
                      <option value="expiring">Próximas a vencer</option>
                      <option value="combo_popular_week">Populares de la semana</option>
                      <option value="combo_new_popular">Nuevos y populares</option>
                      <option value="combo_discount_rating">Mayor descuento y mejor calificación</option>
                    </select>
                  </div>
                </div>
              </div>
              <Tabs defaultValue="all" className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <TabsList className="bg-gradient-to-r from-slate-100 to-gray-100 rounded-full p-1 flex gap-2 shadow-lg mb-4 border border-slate-200">
                    <TabsTrigger value="all" className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105">
                      <Tag className="h-4 w-4" />
                      <span>Todos</span>
                    </TabsTrigger>
                    <TabsTrigger value="popular" className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105">
                      <TrendingUp className="h-4 w-4" />
                      <span>Populares</span>
                    </TabsTrigger>
                    <TabsTrigger value="new" className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105">
                      <Clock className="h-4 w-4" />
                      <span>Nuevos</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all">
                  <div className={`transition-opacity duration-500 animate-fade-in ${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8' 
                      : 'space-y-4'
                  }`}>
                    {paginatedCoupons.length > 0 ? (
                      paginatedCoupons.map((coupon: any) => (
                        <div key={coupon.id} className={viewMode === 'list' ? 'bg-white rounded-lg shadow-md p-6' : ''}>
                          <CouponCard coupon={coupon} />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-gray-500">
                          No hay cupones disponibles con los filtros seleccionados.
                        </p>
                      </div>
                    )}
                  </div>
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
                            className={currentPage === i + 1 ? "bg-orange-500 text-white" : ""}
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
                </TabsContent>

                <TabsContent value="popular">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {popularCoupons.length > 0 ? (
                      popularCoupons.map((coupon: any) => <CouponCard key={coupon.id} coupon={coupon} />)
                    ) : (
                      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-gray-500">No hay cupones populares disponibles en este momento.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="new">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {newCoupons && newCoupons.length > 0 ? (
                      newCoupons.map((coupon: any) => <CouponCard key={coupon.id} coupon={coupon} />)
                    ) : (
                      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-center text-gray-500">No hay cupones nuevos disponibles en este momento.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Pagination - Eliminado ya que el nuevo sistema de paginación está abajo */}
            </div>
          </div>
        </main>

      {/* Newsletter Section */}
      <section className="py-12 bg-orange-50">
        <div className="container mx-auto px-4">
          <NewsletterForm 
            source="buscar-ofertas"
            title="¡No te pierdas ninguna oferta!"
            description="Suscríbete a nuestro boletín y recibe las mejores ofertas directamente en tu correo."
          />
        </div>
      </section>

      {/* Botón Volver al Top */}
      <BackToTop />
    </div>
  )
}
