import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Store, Edit, Eye, Code, Globe, Calendar } from "lucide-react"

export default async function StoresPage() {
  const supabase = await createClient()

  // Verificar autenticación
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect("/login")
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  // Verificar permisos
  if (profile?.role !== "merchant" && profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Obtener tiendas del usuario
  const { data: stores, error: storesError } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (storesError) {
    console.error("Error fetching stores:", storesError)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mis Tiendas</h1>
          <p className="text-muted-foreground">Gestiona tus tiendas y productos</p>
        </div>
        <Link href="/dashboard/stores/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tienda
          </Button>
        </Link>
      </div>

      {/* Stores Grid */}
      {!stores || stores.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Store className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tienes tiendas aún</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crea tu primera tienda para comenzar a vender y generar cupones
            </p>
            <Link href="/dashboard/stores/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Tienda
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Card key={store.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {store.logo_url ? (
                      <img
                        src={store.logo_url || "/placeholder.svg"}
                        alt={store.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <Store className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      <CardDescription>{store.category || "Sin categoría"}</CardDescription>
                      <div className="text-xs text-orange-600 font-semibold mt-1">
                        Comisión: {store.commission_rate ? `${store.commission_rate}%` : "7.5%"}
                      </div>
                    </div>
                  </div>
                  <Badge variant={store.is_active ? "default" : "secondary"}>
                    {store.is_active ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="line-clamp-2">{store.description || "Sin descripción"}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{new Date(store.created_at).toLocaleDateString()}</span>
                  </div>
                  {store.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={store.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Sitio web
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/stores/${store.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </Link>
                  <Link href={`/dashboard/stores/${store.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Link href={`/dashboard/stores/${store.id}#tracking-script`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Code className="h-4 w-4 mr-2" />
                      Script
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
