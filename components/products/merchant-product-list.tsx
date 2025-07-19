"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"
import type { FeaturedProduct, Store } from "@/lib/types/product"
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  Search,
  Filter,
  X,
  ChevronDown,
  Plus,
  Tag,
  Calendar,
  Package,
} from "lucide-react"

interface MerchantProductListProps {
  initialProducts?: FeaturedProduct[]
  stores: Store[]
}

export function MerchantProductList({ initialProducts = [], stores }: MerchantProductListProps) {
  const [activeProducts, setActiveProducts] = useState<FeaturedProduct[]>([])
  const [inactiveProducts, setInactiveProducts] = useState<FeaturedProduct[]>([])
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0)
  const [loading, setLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStore, setSelectedStore] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showOnSale, setShowOnSale] = useState<boolean | null>(null)
  const [showNew, setShowNew] = useState<boolean | null>(null)
  const [showFeatured, setShowFeatured] = useState<boolean | null>(null)
  const [sortOption, setSortOption] = useState<{ value: string; direction: "asc" | "desc" }>({
    value: "created_at",
    direction: "desc",
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (initialProducts.length > 0) {
      setActiveProducts(initialProducts.filter((product) => product.status === "active"))
      setInactiveProducts(initialProducts.filter((product) => product.status !== "active"))
      setIsLoading(false)
    } else {
      loadProducts()
    }
  }, [initialProducts])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      // Obtener las tiendas del usuario
      const { data: userStores } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", session.user.id)
        .eq("is_active", true)

      if (!userStores || userStores.length === 0) {
        setIsLoading(false)
        return
      }

      // Obtener los productos de las tiendas del usuario
      const storeIds = userStores.map((store) => store.id)
      const { data: products, error } = await supabase
        .from("featured_products")
        .select(`
          *,
          store:store_id (
            id,
            name,
            logo_url
          )
        `)
        .in("store_id", storeIds)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error al cargar productos:", error)
        return
      }

      if (products) {
        setActiveProducts(products.filter((product) => product.status === "active"))
        setInactiveProducts(products.filter((product) => product.status !== "active"))
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleProductStatus = async (product: FeaturedProduct, newStatus: "active" | "inactive") => {
    setLoading(product.id)
    try {
      const { error } = await supabase.from("featured_products").update({ status: newStatus }).eq("id", product.id)

      if (error) {
        throw error
      }

      if (newStatus === "active") {
        setInactiveProducts((prev) => prev.filter((p) => p.id !== product.id))
        setActiveProducts((prev) => [...prev, { ...product, status: "active" }])
      } else {
        setActiveProducts((prev) => prev.filter((p) => p.id !== product.id))
        setInactiveProducts((prev) => [...prev, { ...product, status: "inactive" }])
      }
    } catch (error) {
      console.error("Error al actualizar el estado del producto:", error)
    } finally {
      setLoading(null)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return
    }

    setLoading(productId)
    try {
      const { error } = await supabase.from("featured_products").delete().eq("id", productId)

      if (error) {
        throw error
      }

      setActiveProducts((prev) => prev.filter((p) => p.id !== productId))
      setInactiveProducts((prev) => prev.filter((p) => p.id !== productId))
    } catch (error) {
      console.error("Error al eliminar el producto:", error)
    } finally {
      setLoading(null)
    }
  }

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const categorySet = new Set<string>()
    ;[...activeProducts, ...inactiveProducts].forEach((product) => {
      if (product.category) categorySet.add(product.category)
    })
    return Array.from(categorySet)
  }, [activeProducts, inactiveProducts])

  // Filtrar y ordenar productos
  const filterProducts = (products: FeaturedProduct[]) => {
    return products
      .filter((product) => {
        // Filtrar por término de búsqueda
        const searchMatch =
          searchTerm === "" ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.store?.name && product.store.name.toLowerCase().includes(searchTerm.toLowerCase()))

        // Filtrar por tienda
        const storeMatch = selectedStore === "all" || product.store_id === selectedStore

        // Filtrar por categoría
        const categoryMatch = selectedCategory === "all" || product.category === selectedCategory

        // Filtrar por características
        const onSaleMatch = showOnSale === null || product.is_on_sale === showOnSale
        const newMatch = showNew === null || product.is_new === showNew
        const featuredMatch = showFeatured === null || product.is_featured === showFeatured

        return searchMatch && storeMatch && categoryMatch && onSaleMatch && newMatch && featuredMatch
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
  }

  const filteredActiveProducts = useMemo(
    () => filterProducts(activeProducts),
    [activeProducts, searchTerm, selectedStore, selectedCategory, showOnSale, showNew, showFeatured, sortOption],
  )

  const filteredInactiveProducts = useMemo(
    () => filterProducts(inactiveProducts),
    [inactiveProducts, searchTerm, selectedStore, selectedCategory, showOnSale, showNew, showFeatured, sortOption],
  )

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedStore("all")
    setSelectedCategory("all")
    setShowOnSale(null)
    setShowNew(null)
    setShowFeatured(null)
    setSortOption({ value: "created_at", direction: "desc" })
  }

  const renderProductList = (products: FeaturedProduct[]) => {
    if (isLoading) {
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">Cargando productos...</p>
          </CardContent>
        </Card>
      )
    }

    const filteredProducts = filterProducts(products)

    if (filteredProducts.length === 0) {
      return (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            {products.length === 0
              ? "No hay productos disponibles"
              : "No se encontraron productos con los filtros seleccionados"}
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <Image src={product.image_url || "/placeholder.svg"} alt={product.name} width={64} height={64} />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.store?.logo_url ? (
                          <Image
                            src={product.store.logo_url || "/placeholder.svg"}
                            alt={product.store?.name || ""}
                            width={20}
                            height={20}
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-500">
                            {(product.store?.name || "").charAt(0)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{product.store?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {product.is_on_sale && (
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                      Oferta
                    </Badge>
                  )}
                  {product.is_new && (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      Nuevo
                    </Badge>
                  )}
                  {product.is_featured && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      Destacado
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                    <Tag className="h-4 w-4 text-gray-500" /> Precio
                  </h4>
                  <div className="flex items-center gap-2">
                    {product.sale_price ? (
                      <>
                        <p className="text-sm line-through text-gray-500">{product.price}€</p>
                        <p className="text-sm font-semibold text-red-600">{product.sale_price}€</p>
                        <Badge variant="outline" className="text-red-600">
                          -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                        </Badge>
                      </>
                    ) : (
                      <p className="text-sm">{product.price}€</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                    <Package className="h-4 w-4 text-gray-500" /> Stock
                  </h4>
                  <p className="text-sm">
                    {product.stock_quantity > 0 ? (
                      <span>{product.stock_quantity} unidades</span>
                    ) : (
                      <span className="text-red-500">Agotado</span>
                    )}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" /> Fecha
                  </h4>
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(product.created_at), { addSuffix: true, locale: es })}
                  </p>
                </div>
              </div>

              {product.description && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-1">Descripción</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>
              )}

              {product.sale_start_date && product.sale_end_date && (
                <div className="mt-4 p-2 bg-red-50 rounded-md border border-red-100">
                  <h4 className="text-sm font-medium mb-1 text-red-700">Periodo de oferta</h4>
                  <p className="text-sm text-red-600">
                    {format(new Date(product.sale_start_date), "dd/MM/yyyy")} -{" "}
                    {format(new Date(product.sale_end_date), "dd/MM/yyyy")}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-500"
                onClick={() => router.push(`/dashboard/products/stats/${product.id}`)}
              >
                <BarChart3 className="h-4 w-4 mr-1" /> Estadísticas
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-500"
                onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
              >
                <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
              {product.status === "active" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-500"
                  onClick={() => toggleProductStatus(product, "inactive")}
                  disabled={loading === product.id}
                >
                  <EyeOff className="h-4 w-4 mr-1" /> Desactivar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-500"
                  onClick={() => toggleProductStatus(product, "active")}
                  disabled={loading === product.id}
                >
                  <Eye className="h-4 w-4 mr-1" /> Activar
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-red-500"
                onClick={() => deleteProduct(product.id)}
                disabled={loading === product.id}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mis Productos</h2>
        <div className="flex gap-2">
          {stores.length > 0 && (
            <Select value={selectedStore} onValueChange={(value) => setSelectedStore(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar tienda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las tiendas</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Link href={stores.length === 1 ? `/dashboard/products/new/${stores[0].id}` : "/dashboard/products/new"}>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" /> Nuevo Producto
            </Button>
          </Link>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
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
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
                        setSortOption({
                          value: field,
                          direction: direction as "asc" | "desc",
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

          {selectedStore !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Tienda: {stores.find((s) => s.id === selectedStore)?.name || selectedStore}
              <button onClick={() => setSelectedStore("all")}>
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
            selectedStore !== "all" ||
            selectedCategory !== "all" ||
            showOnSale !== null ||
            showNew !== null ||
            showFeatured !== null) && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={resetFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Activos ({filteredActiveProducts.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactivos ({filteredInactiveProducts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">{renderProductList(activeProducts)}</TabsContent>
        <TabsContent value="inactive">{renderProductList(inactiveProducts)}</TabsContent>
      </Tabs>
    </div>
  )
}
