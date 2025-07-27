import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"


// Crear una sola instancia de Supabase para todo el componente

/**
 * /api/stores
 *
 * • GET  – Devuelve las tiendas activas del usuario autenticado
 * • POST – Crea una nueva tienda para el usuario autenticado
 *
 * IMPORTANTE
 * ──────────
 * El esquema original utiliza la columna `owner_id` (uuid) para enlazar la
 * tienda con el usuario propietario.
 * Las políticas RLS de la tabla `stores` permiten INSERT solo cuando
 *   auth.uid() = owner_id
 * y el usuario tiene el rol adecuado (merchant | admin).
 *
 * El error "row-level security policy" se producía porque en la versión
 * anterior del endpoint se intentaba insertar en la columna inexistente
 * `user_id`, quedando `owner_id` = NULL → la política fallaba.
 *
 * Esta versión vuelve a utilizar `owner_id` y, por tanto, cumple la política.
 */

/* -------------------------------------------------------------------------- */
/*  GET  – Lista de tiendas del usuario                                       */
/* -------------------------------------------------------------------------- */
export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Auth error:", userError)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { data: stores, error } = await supabase
      .from("stores")
      .select("id, name, description, logo_url, is_active")
      .eq("owner_id", user.id)
      .eq("is_active", true)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(stores ?? [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

/* -------------------------------------------------------------------------- */
/*  POST – Crear nueva tienda                                                 */
/* -------------------------------------------------------------------------- */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const payload = await request.json()

    const required = ["name", "website", "category"]
    const missing = required.filter((k) => !payload[k])
    if (missing.length) {
      return NextResponse.json({ message: `Missing required fields: ${missing.join(", ")}` }, { status: 400 })
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    /* -------------------------------------------------------------------- */
    /*  Verificar rol                                                       */
    /* -------------------------------------------------------------------- */
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileErr) {
      console.error("Profile lookup error:", profileErr)
      return NextResponse.json({ message: profileErr.message }, { status: 500 })
    }

    if (profile?.role !== "merchant" && profile?.role !== "admin") {
      return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 })
    }

    /* -------------------------------------------------------------------- */
    /*  Insertar tienda                                                     */
    /* -------------------------------------------------------------------- */
    const { data: store, error: insertErr } = await supabase
      .from("stores")
      .insert({
        name: payload.name,
        description: payload.description ?? null,
        website: payload.website,
        category: payload.category,
        logo_url: payload.logo_url ?? null,
        owner_id: user.id, // *** clave para pasar RLS ***
        is_active: true,
        ecommerce_platform: payload.ecommerce_platform ?? null,
      })
      .select()
      .single()

    if (insertErr) {
      console.error("Database error:", insertErr)
      return NextResponse.json({ message: insertErr.message }, { status: 500 })
    }

    /* -------------------------------------------------------------------- */
    /*  Crear pixel de tracking automáticamente                             */
    /* -------------------------------------------------------------------- */
    // Generar pixel_id único
    const pixel_id = `px_${store.id}_${Date.now()}`
    // Definir nombre del pixel y patrones por plataforma
    const pixel_name = `Pixel para ${store.name}`
    let checkout_patterns = [
      '/checkout/success',
      '/order-received',
      '/thank-you',
      '/order-complete',
    ]
    if (payload.ecommerce_platform === 'shopify') {
      checkout_patterns = ['/checkout/thank_you', '/orders/']
    } else if (payload.ecommerce_platform === 'woocommerce') {
      checkout_patterns = ['/checkout/order-received/', '/order-complete/']
    } else if (payload.ecommerce_platform === 'prestashop') {
      checkout_patterns = ['/order-confirmation', '/pedido-confirmado']
    }
    // Insertar pixel en la base de datos
    const { data: pixel, error: pixelErr } = await supabase
      .from('tracking_pixels')
      .insert({
        owner_id: user.id,
        store_id: store.id,
        pixel_name,
        pixel_id,
        commission_rate: 5.0,
        currency: 'EUR',
        store_url: store.website,
        checkout_patterns,
        platform: payload.ecommerce_platform ?? null,
        auto_detect_conversions: true,
        track_page_views: true,
        track_add_to_cart: false,
        is_active: true,
        is_verified: false,
      })
      .select()
      .single()
    if (pixelErr) {
      console.error('Error creando pixel:', pixelErr)
      return NextResponse.json({ message: pixelErr.message }, { status: 500 })
    }

    // Devolver la tienda y el pixel creado
    return NextResponse.json({
      success: true,
      store: store,
      pixel: pixel,
      pixel_id: pixel_id,
      message: "Tienda y pixel creados exitosamente",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
