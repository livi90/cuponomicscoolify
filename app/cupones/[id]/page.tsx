import { createClient } from "@/lib/supabase/server"
import CouponDetailPageClient from "./CouponDetailPageClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: coupon } = await supabase.from("coupons").select("title, description").eq("id", params.id).single()

  if (!coupon) {
    return {
      title: "Cupón no encontrado | Cuponomics",
      description: "El cupón que buscas no existe o ha sido eliminado.",
    }
  }

  return {
    title: `${coupon.title} | Cuponomics`,
    description: coupon.description || "Detalles del cupón en Cuponomics",
  }
}

export default async function CouponDetailPage({ params }: { params: { id: string } }) {
  return <CouponDetailPageClient couponId={params.id} />
}
