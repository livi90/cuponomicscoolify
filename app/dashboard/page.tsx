import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tag, Store, Users, ThumbsUp, TrendingUp, Coins, Gift, ShoppingBag } from "lucide-react"
import CopyExclusiveLinkButton from "@/components/dashboard/CopyExclusiveLinkButton"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Obtener el usuario autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Usuario no autenticado")
  }

  // Obtener el perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const userRole = profile?.role || "user"

  // Obtener estadísticas según el rol del usuario
  let storeCount = 0
  let couponCount = 0
  let ratingCount = 0
  let pendingApplications = 0

  // Obtener cupones activos para mostrar en el dashboard de usuarios
  let featuredCoupons: any[] = []
  let totalActiveCoupons = 0

  if (userRole === "user") {
    try {
      const { data: coupons } = await supabase
        .from("coupons")
        .select(`
          *,
          store:stores(
            id,
            name,
            logo_url
          ),
          ratings (
            id,
            rating,
            worked
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6)

      // Calcular valoración media para cada cupón
      featuredCoupons = coupons?.map((coupon) => {
        const ratings = coupon.ratings || []
        const totalRatings = ratings.length
        const sumRatings = ratings.reduce((sum: number, rating: { rating: number }) => sum + rating.rating, 0)
        const avgRating = totalRatings > 0 ? sumRatings / totalRatings : 0
        const verifications = ratings.filter((r: { worked: boolean }) => r.worked).length

        return {
          ...coupon,
          avg_rating: avgRating,
          ratings_count: totalRatings,
          verifications,
        }
      }) || []

      // Obtener total de cupones activos
      const { count: totalCoupons } = await supabase
        .from("coupons")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)

      totalActiveCoupons = totalCoupons || 0
    } catch (error) {
      console.error("Error al obtener cupones:", error)
    }
  }

  if (userRole === "admin") {
    // Estadísticas para administradores (todas las tiendas, cupones, etc.)
    const { count: totalStores } = await supabase.from("stores").select("*", { count: "exact", head: true })

    const { count: totalCoupons } = await supabase.from("coupons").select("*", { count: "exact", head: true })

    const { count: totalRatings } = await supabase.from("ratings").select("*", { count: "exact", head: true })

    const { count: totalPendingApplications } = await supabase
      .from("store_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    storeCount = totalStores || 0
    couponCount = totalCoupons || 0
    ratingCount = totalRatings || 0
    pendingApplications = totalPendingApplications || 0
  } else if (userRole === "merchant") {
    // Estadísticas para comerciantes (solo sus tiendas y cupones)
    const { count: merchantStores } = await supabase
      .from("stores")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", user.id)

    const { data: storeIds } = await supabase.from("stores").select("id").eq("owner_id", user.id)

    const storeIdArray = storeIds?.map((store) => store.id) || []

    let merchantCoupons = 0
    if (storeIdArray.length > 0) {
      const { count: couponsCount } = await supabase
        .from("coupons")
        .select("*", { count: "exact", head: true })
        .in("store_id", storeIdArray)

      merchantCoupons = couponsCount || 0
    }

    storeCount = merchantStores || 0
    couponCount = merchantCoupons
  } else {
    // Estadísticas para usuarios normales (sus calificaciones)
    const { count: userRatings } = await supabase
      .from("ratings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    ratingCount = userRatings || 0
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tarjetas de estadísticas según el rol del usuario */}
        {userRole === "user" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-orange-500" />
                  Ofertas Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalActiveCoupons}</div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">Cupones disponibles</p>
                  <Link href="/buscar-ofertas">
                    <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600 p-0">
                      Ver todas
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-green-500" />
                  Productos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Próximamente</div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">En desarrollo</p>
                  <Link href="/productos-en-oferta">
                    <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600 p-0">
                      Explorar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tarjetas de estadísticas según el rol del usuario */}
        {(userRole === "admin" || userRole === "merchant") && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-orange-500" />
                Tiendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{storeCount}</div>
              <p className="text-sm text-gray-500">{userRole === "admin" ? "Total de tiendas" : "Tus tiendas"}</p>
            </CardContent>
          </Card>
        )}

        {(userRole === "admin" || userRole === "merchant") && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-orange-500" />
                Cupones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{couponCount}</div>
              <p className="text-sm text-gray-500">{userRole === "admin" ? "Total de cupones" : "Tus cupones"}</p>
            </CardContent>
          </Card>
        )}

        {userRole === "admin" && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                Solicitudes pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingApplications}</div>
              <p className="text-sm text-gray-500">Tiendas por revisar</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-orange-500" />
              Calificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ratingCount}</div>
            <p className="text-sm text-gray-500">
              {userRole === "admin" ? "Total de calificaciones" : "Tus calificaciones"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido específico según el rol */}
      {userRole === "user" && (
        <div className="space-y-6">
          {/* Ofertas Destacadas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>🔥 Ofertas Destacadas</CardTitle>
                  <CardDescription>Las mejores ofertas verificadas por la comunidad</CardDescription>
                </div>
                <Link href="/buscar-ofertas">
                  <Button variant="outline" className="bg-transparent">
                    Ver todas las ofertas
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {featuredCoupons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredCoupons.map((coupon) => (
                    <div key={coupon.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <img
                          src={
                            coupon.store?.logo_url ||
                            `/placeholder.svg?height=24&width=24&text=${coupon.store?.name?.charAt(0) || "C"}`
                          }
                          alt={coupon.store?.name || "Tienda"}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span className="font-medium text-sm">{coupon.store?.name || "Tienda"}</span>
                      </div>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{coupon.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>
                          {coupon.expiry_date
                            ? `Expira: ${new Date(coupon.expiry_date).toLocaleDateString()}`
                            : "Sin caducidad"}
                        </span>
                        {coupon.avg_rating > 0 && (
                          <span className="flex items-center gap-1">
                            ⭐ {coupon.avg_rating.toFixed(1)}/5
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        {coupon.code && (
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                            {coupon.code}
                          </code>
                        )}
                        <Link href={`/calificar-cupones?id=${coupon.id}`}>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-xs">
                            Ver oferta
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No hay ofertas destacadas disponibles en este momento.</p>
                  <Link href="/buscar-ofertas">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Explorar todas las ofertas
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Productos en Oferta */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>🛍️ Productos en Oferta</CardTitle>
                  <CardDescription>Descubre productos con descuentos especiales</CardDescription>
                </div>
                <Link href="/productos-en-oferta">
                  <Button variant="outline" className="bg-transparent">
                    Ver todos los productos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="mb-4">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Próximamente</h3>
                  <p className="text-gray-500 mb-4">
                    Estamos trabajando para traerte los mejores productos en oferta. Muy pronto podrás descubrir
                    increíbles descuentos y novedades.
                  </p>
                </div>
                <Link href="/productos-en-oferta">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Explorar productos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Convertirse en Comerciante */}
          <Card>
            <CardHeader>
              <CardTitle>💼 ¿Tienes una tienda?</CardTitle>
              <CardDescription>Únete como comerciante y llega a miles de usuarios</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Si tienes una tienda online, puedes registrarte como comerciante en Cuponomics para crear cupones y
                ofertas que lleguen a miles de usuarios activos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard/store-application">
                  <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
                    <Store className="mr-2 h-4 w-4" /> Solicitar registro
                  </Button>
                </Link>
                <Link href="/para-comerciantes">
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    Conocer más
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {userRole === "merchant" && (
        <Card>
          <CardHeader>
            <CardTitle>Panel de Comerciante</CardTitle>
            <CardDescription>Gestiona tus tiendas y cupones para llegar a más clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Desde aquí puedes administrar tus tiendas, crear nuevos cupones y ver estadísticas de rendimiento. Mantén
              tus ofertas actualizadas para maximizar tu visibilidad.
            </p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Acciones rápidas:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Añade una nueva tienda</li>
                <li>Crea cupones para tus tiendas existentes</li>
                <li>Revisa las estadísticas de tus ofertas</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Panel de Administración</CardTitle>
            <CardDescription>Gestiona todos los aspectos de la plataforma Cuponomics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Como administrador, tienes acceso completo a todas las funcionalidades de la plataforma. Puedes revisar
              solicitudes de tiendas, gestionar usuarios y supervisar todas las actividades.
            </p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Tareas pendientes:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Revisar {pendingApplications} solicitudes de tiendas pendientes</li>
                <li>Moderar calificaciones recientes</li>
                <li>Verificar cupones reportados</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Link para registro de marcas exclusivas</CardTitle>
            <CardDescription>Comparte este enlace con marcas grandes para que se registren como merchants exclusivos.</CardDescription>
          </CardHeader>
          <CardContent>
            <CopyExclusiveLinkButton />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
