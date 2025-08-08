import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Parámetros de consulta
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const couponId = searchParams.get("coupon_id")
    const storeId = searchParams.get("store_id")
    const rating = searchParams.get("rating")
    const worked = searchParams.get("worked")
    const sortBy = searchParams.get("sort") || "created_at"
    const order = searchParams.get("order") || "desc"
    
    // Construir query base
    let query = supabase
      .from("coupon_reviews")
      .select(`
        *,
        user_profiles(
          display_name,
          username,
          avatar_url,
          reputation_points,
          level
        ),
        coupons(
          code,
          description,
          discount_type,
          discount_value
        ),
        stores(
          name,
          logo_url
        )
      `)
      .eq("status", "active")
    
    // Aplicar filtros
    if (couponId) {
      query = query.eq("coupon_id", couponId)
    }
    
    if (storeId) {
      query = query.eq("store_id", storeId)
    }
    
    if (rating) {
      query = query.eq("rating", parseInt(rating))
    }
    
    if (worked) {
      query = query.eq("worked", worked === "true")
    }
    
    // Aplicar ordenamiento
    if (sortBy === "helpful") {
      query = query.order("is_helpful_count", { ascending: order === "asc" })
    } else if (sortBy === "rating") {
      query = query.order("rating", { ascending: order === "asc" })
    } else {
      query = query.order("created_at", { ascending: order === "asc" })
    }
    
    // Aplicar paginación
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    const { data: reviews, error, count } = await query
    
    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Error al obtener reviews" }, { status: 500 })
    }
    
    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
    
  } catch (error) {
    console.error("Error in GET reviews:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    
    const body = await request.json()
    const {
      coupon_id,
      store_id,
      rating,
      worked,
      worked_partially = false,
      title,
      review_text,
      pros,
      cons,
      purchase_amount,
      savings_amount,
      screenshot_url
    } = body
    
    // Validar datos requeridos
    if (!coupon_id || !store_id || !rating || worked === undefined) {
      return NextResponse.json({ error: "Datos requeridos faltantes" }, { status: 400 })
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating debe estar entre 1 y 5" }, { status: 400 })
    }
    
    // Verificar que el cupón existe
    const { data: coupon } = await supabase
      .from("coupons")
      .select("id")
      .eq("id", coupon_id)
      .single()
    
    if (!coupon) {
      return NextResponse.json({ error: "Cupón no encontrado" }, { status: 404 })
    }
    
    // Verificar que no existe ya una review del usuario para este cupón
    const { data: existingReview } = await supabase
      .from("coupon_reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("coupon_id", coupon_id)
      .eq("status", "active")
      .single()
    
    if (existingReview) {
      return NextResponse.json({ error: "Ya has calificado este cupón" }, { status: 409 })
    }
    
    // Crear la review
    const { data: review, error } = await supabase
      .from("coupon_reviews")
      .insert({
        user_id: user.id,
        coupon_id,
        store_id,
        rating,
        worked,
        worked_partially,
        title,
        review_text,
        pros,
        cons,
        purchase_amount,
        savings_amount,
        screenshot_url
      })
      .select(`
        *,
        user_profiles!inner(
          display_name,
          username,
          avatar_url
        ),
        coupons!inner(
          code,
          description
        ),
        stores!inner(
          name,
          logo_url
        )
      `)
      .single()
    
    if (error) {
      console.error("Error creating review:", error)
      return NextResponse.json({ error: "Error al crear review" }, { status: 500 })
    }
    
    // Verificar y asignar badges
    await supabase.rpc("check_and_assign_badges", { user_uuid: user.id })
    
    // Crear actividad en el feed
    await supabase
      .from("activity_feed")
      .insert({
        user_id: user.id,
        activity_type: "review_created",
        target_id: review.id,
        target_type: "review",
        metadata: {
          coupon_code: review.coupons.code,
          store_name: review.stores.name,
          rating: review.rating
        }
      })
    
    return NextResponse.json({
      review,
      message: "Review creada exitosamente"
    })
    
  } catch (error) {
    console.error("Error in POST review:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
