"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Coupon, Store } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Tag, Calendar, Edit, Trash2, Eye, EyeOff, BarChart3, Search, Filter, X, ChevronDown } from "lucide-react"

interface CouponListProps {
  coupons: (Coupon & {
    store: Pick<Store, "id" | "name" | "logo_url">
  })[]
  stores: Store[]
}

type SortOption = {
  label: string
  value: string
  direction: "asc" | "desc"
}

export function CouponList({ coupons: initialCoupons, stores }: CouponListProps) {
  const [activeCoupons, setActiveCoupons] = useState<
    (Coupon & {
      store: Pick<Store, "id" | "name" | "logo_url">
    })[]
  >([])
  const [inactiveCoupons, setInactiveCoupons] = useState<
    (Coupon & {
      store: Pick<Store, "id" | "name" | "logo_url">
    })[]
  >([])
  const [loading, setLoading] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStore, setSelectedStore] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [sortOption, setSortOption] = useState<SortOption>({
    label: "Más recientes",
    value: "created_at",
    direction: "desc",
  })
  const [showVerified, setShowVerified] = useState<boolean | null>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    console.log("Cupones iniciales recibidos:", initialCoupons)

    // Función para cargar cupones directamente desde Supabase
    const loadCouponsDirectly = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) return

        // Obtener el perfil del usuario
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

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

        // Obtener los cupones
        let couponsQuery = supabase
          .from("coupons")
          .select(`
            *,
            store:store_id (
              id,
              name,
              logo_url
            )
          `)
          .order("created_at", { ascending: false })

        // Si no es admin, filtrar por tiendas del usuario
        if (profile?.role !== "admin") {
          const storeIds = userStores.map((store) => store.id)
          couponsQuery = couponsQuery.in("store_id", storeIds)
        }

        const { data: userCoupons, error } = await couponsQuery

        if (error) {
          console.error("Error al cargar cupones:", error)
          return
        }

        console.log("Cupones cargados directamente:", userCoupons)

        if (userCoupons) {
          setActiveCoupons(userCoupons.filter((coupon) => coupon.is_active))
          setInactiveCoupons(userCoupons.filter((coupon) => !coupon.is_active))
        }
      } catch (error) {
        console.error("Error al cargar cupones:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Si hay cupones iniciales, usarlos
    if (initialCoupons && initialCoupons.length > 0) {
      console.log("Usando cupones iniciales:", initialCoupons)
      setActiveCoupons(initialCoupons.filter((coupon) => coupon.is_active))
      setInactiveCoupons(initialCoupons.filter((coupon) => !coupon.is_active))
      setIsLoading(false)
    } else {
      // Si no hay cupones iniciales, cargarlos directamente
      console.log("No hay cupones iniciales, cargando directamente...")
      loadCouponsDirectly()
    }
  }, [initialCoupons, supabase])

  const toggleCouponStatus = async (
    coupon: Coupon & { store: Pick<Store, "id" | "name" | "logo_url"> },
    newStatus: boolean,
  ) => {
    setLoading(coupon.id)
    try {
      const { error } = await supabase.from("coupons").update({ is_active: newStatus }).eq("id", coupon.id)

      if (error) {
        throw error
      }

      if (newStatus) {
        setInactiveCoupons((prev) => prev.filter((c) => c.id !== coupon.id))
        setActiveCoupons((prev) => [...prev, { ...coupon, is_active: true }])
      } else {
        setActiveCoupons((prev) => prev.filter((c) => c.id !== coupon.id))
        setInactiveCoupons((prev) => [...prev, { ...coupon, is_active: false }])
      }
    } catch (error) {
      console.error("Error al actualizar el estado del cupón:", error)
    } finally {
      setLoading(null)
    }
  }

  const deleteCoupon = async (couponId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este cupón?")) {
      return
    }

    setLoading(couponId)
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", couponId)

      if (error) {
        throw error
      }

      setActiveCoupons((prev) => prev.filter((c) => c.id !== couponId))
      setInactiveCoupons((prev) => prev.filter((c) => c.id !== couponId))
    } catch (error) {
      console.error("Error al eliminar el cupón:", error)
    } finally {
      setLoading(null)
    }
  }

  const getCouponTypeBadge = (type: string) => {
    switch (type) {
      case "code":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Código
          </Badge>
        )
      case "deal":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
            Oferta
          </Badge>
        )
      case "free_shipping":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Envío gratis
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // Función para filtrar y ordenar cupones
  const filterAndSortCoupons = (coupons: (Coupon & { store: Pick<Store, "id" | "name" | "logo_url"> })[]) => {
    return coupons
      .filter((coupon) => {
        // Filtrar por término de búsqueda
        const searchMatch =
          searchTerm === "" ||
          coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (coupon.code && coupon.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (coupon.store.name && coupon.store.name.toLowerCase().includes(searchTerm.toLowerCase()))

        // Filtrar por tienda
        const storeMatch = selectedStore === "all" || coupon.store_id === selectedStore

        // Filtrar por tipo de cupón
        const typeMatch = selectedType === "all" || coupon.coupon_type === selectedType

        // Filtrar por verificación
        const verifiedMatch = showVerified === null || coupon.is_verified === showVerified

        return searchMatch && storeMatch && typeMatch && verifiedMatch
      })
      .sort((a, b) => {
        // Ordenar según la opción seleccionada
        const { value, direction } = sortOption

        if (value === "title") {
          return direction === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        }

        if (value === "created_at") {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return direction === "asc" ? dateA - dateB : dateB - dateA
        }

        if (value === "expiry_date") {
          // Manejar casos donde la fecha de expiración puede ser null
          if (!a.expiry_date) return direction === "asc" ? 1 : -1
          if (!b.expiry_date) return direction === "asc" ? -1 : 1

          const dateA = new Date(a.expiry_date).getTime()
          const dateB = new Date(b.expiry_date).getTime()
          return direction === "asc" ? dateA - dateB : dateB - dateA
        }

        return 0
      })
  }

  // Aplicar filtros y ordenación
  const filteredActiveCoupons = useMemo(
    () => filterAndSortCoupons(activeCoupons),
    [activeCoupons, searchTerm, selectedStore, selectedType, sortOption, showVerified],
  )

  const filteredInactiveCoupons = useMemo(
    () => filterAndSortCoupons(inactiveCoupons),
    [inactiveCoupons, searchTerm, selectedStore, selectedType, sortOption, showVerified],
  )

  // Obtener tipos de cupones únicos
  const couponTypes = useMemo(() => {
    const types = new Set<string>()
    ;[...activeCoupons, ...inactiveCoupons].forEach((coupon) => {
      if (coupon.coupon_type) types.add(coupon.coupon_type)
    })
    return Array.from(types)
  }, [activeCoupons, inactiveCoupons])

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedStore("all")
    setSelectedType("all")
    setShowVerified(null)
    setSortOption({ label: "Más recientes", value: "created_at", direction: "desc" })
  }

  const renderCouponList = (coupons: (Coupon & { store: Pick<Store, "id" | "name" | "logo_url"> })[]) => {
    if (isLoading) {
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">Cargando cupones...</p>
          </CardContent>
        </Card>
      )
    }

    const filteredCoupons = filterAndSortCoupons(coupons)

    if (filteredCoupons.length === 0) {
      return (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            {coupons.length === 0
              ? "No hay cupones disponibles"
              : "No se encontraron cupones con los filtros seleccionados"}
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {filteredCoupons.map((coupon) => (
          <Card key={coupon.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {coupon.store?.logo_url ? (
                      <Image
                        src={coupon.store.logo_url || "/placeholder.svg"}
                        alt={coupon.store?.name || "Tienda"}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <span className="font-medium text-gray-500">{(coupon.store?.name || "T").charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base">{coupon.title}</CardTitle>
                    <p className="text-sm text-gray-500">{coupon.store?.name || "Tienda"}</p>
                  </div>
                </div>
                {getCouponTypeBadge(coupon.coupon_type)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupon.code && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                      <Tag className="h-4 w-4 text-gray-500" /> Código
                    </h4>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{coupon.code}</code>
                  </div>
                )}

                {coupon.discount_value && coupon.discount_type && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Descuento</h4>
                    <p className="text-sm">
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}%`
                        : coupon.discount_type === "fixed"
                          ? `${coupon.discount_value}€`
                          : coupon.discount_type}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" /> Vigencia
                  </h4>
                  <p className="text-sm">
                    {coupon.expiry_date ? (
                      <>Expira {formatDistanceToNow(new Date(coupon.expiry_date), { addSuffix: true, locale: es })}</>
                    ) : (
                      "Sin fecha de expiración"
                    )}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Estado</h4>
                  <Badge
                    variant={coupon.is_verified ? "default" : "outline"}
                    className={coupon.is_verified ? "bg-green-500" : ""}
                  >
                    {coupon.is_verified ? "Verificado" : "No verificado"}
                  </Badge>
                </div>
              </div>

              {coupon.description && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-1">Descripción</h4>
                  <p className="text-sm text-gray-600">{coupon.description}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-500"
                onClick={() => router.push(`/dashboard/coupons/stats/${coupon.id}`)}
              >
                <BarChart3 className="h-4 w-4 mr-1" /> Estadísticas
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-500"
                onClick={() => router.push(`/dashboard/coupons/edit/${coupon.id}`)}
              >
                <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
              {coupon.is_active ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-500"
                  onClick={() => toggleCouponStatus(coupon, false)}
                  disabled={loading === coupon.id}
                >
                  <EyeOff className="h-4 w-4 mr-1" /> Desactivar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-500"
                  onClick={() => toggleCouponStatus(coupon, true)}
                  disabled={loading === coupon.id}
                >
                  <Eye className="h-4 w-4 mr-1" /> Activar
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-red-500"
                onClick={() => deleteCoupon(coupon.id)}
                disabled={loading === coupon.id}
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
      {/* Barra de búsqueda y filtros */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar cupones..."
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
            {/* Filtro de tiendas */}
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas las tiendas" />
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

            {/* Filtro de tipos de cupón */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="code">Código</SelectItem>
                <SelectItem value="deal">Oferta</SelectItem>
                <SelectItem value="free_shipping">Envío gratis</SelectItem>
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
                    <h5 className="text-sm font-medium">Estado de verificación</h5>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified-yes"
                        checked={showVerified === true}
                        onCheckedChange={() => setShowVerified(showVerified === true ? null : true)}
                      />
                      <Label htmlFor="verified-yes">Verificados</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified-no"
                        checked={showVerified === false}
                        onCheckedChange={() => setShowVerified(showVerified === false ? null : false)}
                      />
                      <Label htmlFor="verified-no">No verificados</Label>
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
                          "title-asc": "Título (A-Z)",
                          "title-desc": "Título (Z-A)",
                          "expiry_date-asc": "Expiran antes",
                          "expiry_date-desc": "Expiran después",
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
                        <SelectItem value="title-asc">Título (A-Z)</SelectItem>
                        <SelectItem value="title-desc">Título (Z-A)</SelectItem>
                        <SelectItem value="expiry_date-asc">Expiran antes</SelectItem>
                        <SelectItem value="expiry_date-desc">Expiran después</SelectItem>
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

          {selectedType !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Tipo:{" "}
              {selectedType === "code"
                ? "Código"
                : selectedType === "deal"
                  ? "Oferta"
                  : selectedType === "free_shipping"
                    ? "Envío gratis"
                    : selectedType}
              <button onClick={() => setSelectedType("all")}>
                <X className="h-3 w-3 ml-1" />
              </button>
            </Badge>
          )}

          {showVerified !== null && (
            <Badge variant="outline" className="flex items-center gap-1">
              {showVerified ? "Verificados" : "No verificados"}
              <button onClick={() => setShowVerified(null)}>
                <X className="h-3 w-3 ml-1" />
              </button>
            </Badge>
          )}

          {(searchTerm || selectedStore !== "all" || selectedType !== "all" || showVerified !== null) && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={resetFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Pestañas de cupones activos/inactivos */}
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Activos ({filteredActiveCoupons.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactivos ({filteredInactiveCoupons.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">{renderCouponList(activeCoupons)}</TabsContent>
        <TabsContent value="inactive">{renderCouponList(inactiveCoupons)}</TabsContent>
      </Tabs>
    </div>
  )
}
