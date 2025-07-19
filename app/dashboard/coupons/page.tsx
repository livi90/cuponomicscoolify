import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CouponList } from "@/components/dashboard/coupon-list"
import { Plus } from "lucide-react"

// Forzar que la página sea dinámica y no se cachee
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function CouponsPage() {
  const supabase = await createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Obtener el perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  // Verificar si el usuario es comerciante o administrador
  if (profile?.role !== "merchant" && profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Obtener las tiendas del usuario
  const { data: stores, error: storesError } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .eq("is_active", true)

  if (storesError) {
    console.error("Error al obtener tiendas:", storesError)
  }

  // Si el usuario no tiene tiendas, redirigir a la página de solicitud
  if (!stores || stores.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Mis Cupones</h1>

        <Card>
          <CardContent className="py-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No tienes tiendas registradas</h2>
            <p className="text-gray-600 mb-6">Para crear cupones, primero debes registrar una tienda en Cuponomics.</p>
            <Link href="/dashboard/store-application">
              <Button className="bg-orange-500 hover:bg-orange-600">Registrar una tienda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Obtener los cupones de las tiendas del usuario
  const storeIds = stores.map((store) => store.id)

  // Si el usuario es administrador, mostrar todos los cupones
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

  // Si es comerciante, filtrar por sus tiendas
  if (profile?.role !== "admin") {
    couponsQuery = couponsQuery.in("store_id", storeIds)
  }

  const { data: coupons, error: couponsError } = await couponsQuery

  if (couponsError) {
    console.error("Error al obtener cupones:", couponsError)
  }

  console.log("Cupones obtenidos:", coupons)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Cupones</h1>
        <Link href="/dashboard/coupons/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Cupón
          </Button>
        </Link>
      </div>

      <CouponList coupons={coupons || []} stores={stores} />
    </div>
  )
}
