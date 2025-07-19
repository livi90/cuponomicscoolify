import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import NewCouponForm from "./new-coupon-form"

const NewCouponPage = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/sign-in")
  }

  // Obtener tiendas del usuario autenticado
  const { data: stores, error: storesError } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .eq("is_active", true)

  if (storesError) {
    console.error("Error al obtener tiendas:", storesError)
  }

  if (!stores || stores.length === 0) {
    redirect("/dashboard")
  }

  return (
    <div>
      <NewCouponForm stores={stores} />
    </div>
  )
}

export default NewCouponPage
