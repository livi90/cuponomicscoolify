import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()

    const { title, description, code, discount_percentage, discount_amount, coupon_url, expires_at, store_id, coupon_type } = body

    // Validaciones básicas
    if (!title || !store_id) {
      return NextResponse.json({ error: "Título y tienda son requeridos" }, { status: 400 })
    }

    // Validar que los cupones de tipo "code" tengan un código
    if (coupon_type === "code" && !code) {
      return NextResponse.json({ error: "Los cupones con código deben incluir un código" }, { status: 400 })
    }

    // Verificar que el usuario sea dueño de la tienda
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id")
      .eq("id", store_id)
      .eq("owner_id", user.id)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Tienda no encontrada o no te pertenece" }, { status: 404 })
    }

    // Adaptar los datos del body a la estructura de la base de datos
    const couponData = {
      title: body.title,
      description: body.description,
      code: body.code,
      coupon_url: body.coupon_url,
      expiry_date: body.expires_at || body.expiry_date,
      store_id: body.store_id,
      is_active: true,
      // Usar los nombres de columna correctos: discount_value y discount_type
      discount_value: body.discount_value || body.discount_amount || body.discount_percentage || null,
      discount_type: body.discount_type || (body.discount_percentage ? 'percentage' : (body.discount_amount ? 'fixed' : null)),
      coupon_type: body.coupon_type || 'code',
      coupon_category: body.coupon_category || null,
    };

    // Crear el cupón
    const { data: coupon, error: couponError } = await supabase
      .from("coupons")
      .insert(couponData)
      .select()
      .single()

    if (couponError) {
      console.error("Error creating coupon:", couponError)
      return NextResponse.json({ error: "Error al crear el cupón" }, { status: 500 })
    }

    return NextResponse.json(coupon)
  } catch (error) {
    console.error("Error in POST /api/coupons:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
