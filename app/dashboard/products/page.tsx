import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Edit, Eye, Store } from "lucide-react"

export default async function ProductsPage() {
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

  // Obtener las tiendas del usuario
  const { data: stores } = await supabase
    .from("stores")
    .select("id, name")
    .eq("owner_id", user.id)
    .eq("is_active", true)

  // Si no tiene tiendas, redirigir a crear tienda
  if (!stores || stores.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Productos</h1>
          <p className="text-muted-foreground">Gestiona tus productos y ofertas</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Store className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Necesitas una tienda primero</h3>
            <p className="text-muted-foreground text-center mb-4">
              Para crear productos, primero debes tener una tienda activa
            </p>
            <Link href="/dashboard/stores/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Tienda
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Obtener productos de todas las tiendas del usuario
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(`
      *,
      stores!inner(name)
    `)
    .in(
      "store_id",
      stores.map((s) => s.id),
    )
    .order("created_at", { ascending: false })

  if (productsError) {
    console.error("Error fetching products:", productsError)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mis Productos</h1>
          <p className="text-muted-foreground">Gestiona tus productos y ofertas</p>
        </div>
        <div className="flex space-x-2">
          {stores.length === 1 ? (
            <Link href={`/dashboard/products/new/${stores[0].id}`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </Link>
          )}
        </div>
      </div>

      {!products || products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tienes productos aún</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crea tu primer producto para comenzar a generar ventas
            </p>
            {stores.length === 1 ? (
              <Link href={`/dashboard/products/new/${stores[0].id}`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Producto
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Producto
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                      <CardDescription className="text-sm">{product.stores?.name}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                    {product.is_featured && (
                      <Badge variant="outline" className="text-xs">
                        Destacado
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description || "Sin descripción"}
                  </p>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        {product.sale_price && product.sale_price < product.price ? (
                          <>
                            <span className="text-lg font-bold text-green-600">${product.sale_price}</span>
                            <span className="text-sm text-muted-foreground line-through">${product.price}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">${product.price}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Stock: {product.stock || 0}</p>
                    </div>

                    {product.is_new && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Nuevo
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/productos/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/dashboard/products/edit/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
