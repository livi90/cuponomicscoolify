import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Store, Edit, Globe, Calendar, Package, BarChart3, Code } from "lucide-react"
import { TrackingScriptDisplay } from "@/components/tracking/tracking-script-display"

interface StoreDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect("/login")
  }

  // Obtener el perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  // Verificar si el usuario es comerciante o administrador
  if (profile?.role !== "merchant" && profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Obtener la tienda
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("*")
    .eq("id", resolvedParams.id)
    .eq("owner_id", user.id)
    .single()

  if (storeError || !store) {
    notFound()
  }

  // Obtener productos de la tienda
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, is_active")
    .eq("store_id", store.id)

  // Obtener cupones de la tienda
  const { data: coupons } = await supabase
    .from("coupons")
    .select("id, title, discount_percentage, is_active")
    .eq("store_id", store.id)

  const activeProducts = products?.filter((p) => p.is_active).length || 0
  const activeCoupons = coupons?.filter((c) => c.is_active).length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          {store.logo_url ? (
            <img
              src={store.logo_url || "/placeholder.svg"}
              alt={store.name}
              className="h-16 w-16 rounded-lg object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
              <Store className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{store.name}</h1>
            <p className="text-muted-foreground">{store.category || "Sin categoría"}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={store.is_active ? "default" : "secondary"}>
                {store.is_active ? "Activa" : "Inactiva"}
              </Badge>
              <Badge variant="outline">{store.status || "active"}</Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/dashboard/stores/${store.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar Tienda
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">{products?.length || 0} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cupones Activos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCoupons}</div>
            <p className="text-xs text-muted-foreground">{coupons?.length || 0} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sitio Web</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {store.website ? (
                <a
                  href={store.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate block"
                >
                  {store.website}
                </a>
              ) : (
                <span className="text-muted-foreground">No configurado</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creada</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{new Date(store.created_at).toLocaleDateString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comisión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store.commission_rate ? `${store.commission_rate}%` : "7.5%"}</div>
            <p className="text-xs text-muted-foreground">Porcentaje de comisión aplicado a las ventas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tracking Script Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Script de Tracking
          </CardTitle>
          <CardDescription>
            Copia este script e instálalo en tu tienda para hacer seguimiento de las conversiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrackingScriptDisplay
            storeId={store.id}
            storeName={store.name}
            platform={store.ecommerce_platform || "custom"}
            trackingScriptId={store.tracking_script_id}
          />
        </CardContent>
      </Card>

      {/* Store Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Tienda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Descripción</h4>
            <p className="text-muted-foreground">{store.description || "Sin descripción"}</p>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Información Básica</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">ID:</dt>
                  <dd className="font-mono">{store.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estado:</dt>
                  <dd>{store.is_active ? "Activa" : "Inactiva"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Categoría:</dt>
                  <dd>{store.category || "Sin categoría"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Plataforma:</dt>
                  <dd>{store.ecommerce_platform || "No especificada"}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="font-medium mb-2">Fechas</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Creada:</dt>
                  <dd>{new Date(store.created_at).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Actualizada:</dt>
                  <dd>{new Date(store.updated_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Gestiona los elementos de tu tienda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href={`/dashboard/products/new/${store.id}`}>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Package className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </Link>

            <Link href={`/dashboard/coupons/new?store=${store.id}`}>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BarChart3 className="h-4 w-4 mr-2" />
                Crear Cupón
              </Button>
            </Link>

            <Link href={`/dashboard/analytics?store=${store.id}`}>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
