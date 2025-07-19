"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types/product"
import { Search, Filter, X, ChevronDown } from "lucide-react"

interface ProductListProps {
  initialProducts?: Product[]
  storeId?: string
  showFilters?: boolean
}

type SortOption = {
  label: string
  value: string
  direction: "asc" | "desc"
}

export function ProductList({ initialProducts = [], storeId, showFilters = true }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [sortOption, setSortOption] = useState<SortOption>({
    label: "Más recientes",
    value: "created_at",
    direction: "desc",
  })
  const [showOnSale, setShowOnSale] = useState<boolean | null>(null)
  const [showNew, setShowNew] = useState<boolean | null>(null)
  const [showFeatured, setShowFeatured] = useState<boolean | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts)
      setIsLoading(false)

      // Calcular el precio máximo para el slider
      const highestPrice = Math.max(
        ...initialProducts.map((p) => (p.sale_price ? Math.max(p.price, p.sale_price) : p.price)),
        100,
      )
      setMaxPrice(Math.ceil(highestPrice / 100) * 100) // Redondear al siguiente 100
      setPriceRange([0, highestPrice])
    } else {
      loadProducts()
    }
  }, [initialProducts])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from("featured_products")
        .select(`
          *,
          store:stores(
            id,
            name,
            logo_url
          )
        `)
        .eq("status", "active")

      if (storeId) {
        query = query.eq("store_id", storeId)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading products:", error)
        return
      }

      if (data) {
        setProducts(data)

        // Calcular el precio máximo para el slider
        const highestPrice = Math.max(
          ...data.map((p) => (p.sale_price ? Math.max(p.price, p.sale_price) : p.price)),
          100,
        )
        setMaxPrice(Math.ceil(highestPrice / 100) * 100) // Redondear al siguiente 100
        setPriceRange([0, highestPrice])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const categorySet = new Set<string>()
    products.forEach((product) => {
      if (product.category) categorySet.add(product.category)
    })
    return Array.from(categorySet)
  }, [products])

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Filtrar por término de búsqueda
        const searchMatch =
          searchTerm === "" ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.store?.name && product.store.name.toLowerCase().includes(searchTerm.toLowerCase()))

        // Filtrar por categoría
        const categoryMatch = selectedCategory === "all" || product.category === selectedCategory

        // Filtrar por estado
        const statusMatch =
          selectedStatus === "all" ||
          (selectedStatus === "in_stock" && product.stock_quantity > 0) ||
          (selectedStatus === "out_of_stock" && product.stock_quantity === 0)

        // Filtrar por precio
        const priceToCheck = product.sale_price || product.price
        const priceMatch = priceToCheck >= priceRange[0] && priceToCheck <= priceRange[1]

        // Filtrar por ofertas, nuevos y destacados
        const onSaleMatch =
          showOnSale === null || (product.sale_price !== null && product.sale_price < product.price) === showOnSale
        const newMatch = showNew === null || product.is_new === showNew
        const featuredMatch = showFeatured === null || product.is_featured === showFeatured

        return searchMatch && categoryMatch && statusMatch && priceMatch && onSaleMatch && newMatch && featuredMatch
      })
      .sort((a, b) => {
        // Ordenar según la opción seleccionada
        const { value, direction } = sortOption

        if (value === "name") {
          return direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        }

        if (value === "price") {
          const priceA = a.sale_price || a.price
          const priceB = b.sale_price || b.price
          return direction === "asc" ? priceA - priceB : priceB - priceA
        }

        if (value === "created_at") {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return direction === "asc" ? dateA - dateB : dateB - dateA
        }

        return 0
      })
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedStatus,
    priceRange,
    sortOption,
    showOnSale,
    showNew,
    showFeatured,
  ])

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedStatus("all")
    setPriceRange([0, maxPrice])
    setShowOnSale(null)
    setShowNew(null)
    setShowFeatured(null)
    setSortOption({ label: "Más recientes", value: "created_at", direction: "desc" })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="h-96 animate-pulse">
            <CardContent className="p-0">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {/* Filtro de categorías */}
              {categories.length > 0 && (
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Filtro de estado */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="in_stock">En stock</SelectItem>
                  <SelectItem value="out_of_stock">Agotado</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtros avanzados */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filtros
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filtros avanzados</h4>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Rango de precio</h5>
                      <div className="px-2">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={maxPrice}
                          step={1}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          className="my-6"
                        />
                        <div className="flex justify-between text-sm">
                          <span>{priceRange[0]}€</span>
                          <span>{priceRange[1]}€</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Características</h5>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="on-sale"
                          checked={showOnSale === true}
                          onCheckedChange={() => setShowOnSale(showOnSale === true ? null : true)}
                        />
                        <Label htmlFor="on-sale">En oferta</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="new"
                          checked={showNew === true}
                          onCheckedChange={() => setShowNew(showNew === true ? null : true)}
                        />
                        <Label htmlFor="new">Nuevos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={showFeatured === true}
                          onCheckedChange={() => setShowFeatured(showFeatured === true ? null : true)}
                        />
                        <Label htmlFor="featured">Destacados</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Ordenar por</h5>
                      <Select
                        value={`${sortOption.value}-${sortOption.direction}`}
                        onValueChange={(value) => {
                          const [field, direction] = value.split("-")
                          const labels: Record<string, string> = {
                            "created_at-desc": "Más recientes",
                            "created_at-asc": "Más antiguos",
                            "name-asc": "Nombre (A-Z)",
                            "name-desc": "Nombre (Z-A)",
                            "price-asc": "Precio: menor a mayor",
                            "price-desc": "Precio: mayor a menor",
                          }

                          setSortOption({
                            value: field,
                            direction: direction as "asc" | "desc",
                            label: labels[value],
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="created_at-desc">Más recientes</SelectItem>
                          <SelectItem value="created_at-asc">Más antiguos</SelectItem>
                          <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
                          <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
                          <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                          <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" className="w-full" onClick={resetFilters}>
                      Resetear filtros
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Chips de filtros activos */}
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="outline" className="flex items-center gap-1">
                Búsqueda: {searchTerm}
                <button onClick={() => setSearchTerm("")}>
                  <X className="h-3 w-3 ml-1" />
                </button>
              </Badge>
            )}

            {selectedCategory !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Categoría: {selectedCategory}
                <button onClick={() => setSelectedCategory("all")}>
                  <X className="h-3 w-3 ml-1" />
                </button>
              </Badge>
            )}

            {selectedStatus !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Estado: {selectedStatus === "in_stock" ? "En stock" : "Agotado"}
                <button onClick={() => setSelectedStatus("all")}>
                  <X className="h-3 w-3 ml-1" />
                </button>
              </Badge>
            )}

            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Badge variant="outline" className="flex items-center gap-1">
                Precio: {priceRange[0]}€ - {priceRange[1]}€
                <button onClick={() => setPriceRange([0, maxPrice])}>
                  <X className="h-3 w-3 ml-1" />
                </button>
              </Badge>
            )}

            {showOnSale !== null && (
              <Badge variant="outline" className="flex items-center gap-1">
                {showOnSale ? "En oferta" : "No en oferta"}
                <button onClick={() => setShowOnSale(null)}>
                  <X className="h-3 w-3 ml-1" />
                </button>
              </Badge>
            )}

            {showNew !== null && (
              <Badge variant="outline" className="flex items-center gap-1">
                {showNew ? "Nuevos" : "No nuevos"}
                <button onClick={() => setShowNew(null)}>
                  <X className="h-3 w-3 ml-1" />
                </button>
              </Badge>
            )}

            {showFeatured !== null && (
              <Badge variant="outline" className="flex items-center gap-1">
                {showFeatured ? "Destacados" : "No destacados"}
                <button onClick={() => setShowFeatured(null)}>
                  <X className="h-3 w-3 ml-1" />
                </button>
              </Badge>
            )}

            {(searchTerm ||
              selectedCategory !== "all" ||
              selectedStatus !== "all" ||
              priceRange[0] > 0 ||
              priceRange[1] < maxPrice ||
              showOnSale !== null ||
              showNew !== null ||
              showFeatured !== null) && (
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={resetFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
          <p className="text-center text-gray-500">
            {products.length === 0
              ? "No hay productos disponibles"
              : "No se encontraron productos con los filtros seleccionados"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
