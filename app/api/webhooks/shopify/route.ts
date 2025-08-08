import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Verificar que es un webhook de orden completada
    if (body.topic !== "orders/create" && body.topic !== "orders/paid") {
      return NextResponse.json({ error: "Webhook topic not supported" }, { status: 400 })
    }

    const order = body.data
    if (!order) {
      return NextResponse.json({ error: "No order data" }, { status: 400 })
    }

    // Buscar la tienda por dominio
    const domain = request.headers.get("x-shopify-shop-domain")
    if (!domain) {
      return NextResponse.json({ error: "Shop domain not found" }, { status: 400 })
    }

    const { data: store } = await supabase
      .from("stores")
      .select("id, owner_id, commission_rate, website_url")
      .eq("website_url", `https://${domain}`)
      .single()

    if (!store) {
      console.log(`Store not found for domain: ${domain}`)
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Extraer datos de la orden
    const orderId = order.id?.toString()
    const orderTotal = parseFloat(order.total_price || "0")
    const customerEmail = order.email
    const lineItems = order.line_items || []
    const discountCodes = order.discount_codes?.map((dc: any) => dc.code) || []

    // Buscar cupón usado si existe
    let couponId = null
    let couponCode = null
    if (discountCodes.length > 0) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("id, code")
        .eq("store_id", store.id)
        .in("code", discountCodes)
        .single()
      
      if (coupon) {
        couponId = coupon.id
        couponCode = coupon.code
      }
    }

    // Extraer datos de tracking mejorados
    const utmSource = order.note_attributes?.find((attr: any) => attr.name === "utm_source")?.value
    const utmMedium = order.note_attributes?.find((attr: any) => attr.name === "utm_medium")?.value
    const utmCampaign = order.note_attributes?.find((attr: any) => attr.name === "utm_campaign")?.value
    const utmContent = order.note_attributes?.find((attr: any) => attr.name === "utm_content")?.value
    const utmTerm = order.note_attributes?.find((attr: any) => attr.name === "utm_term")?.value
    
    // Extraer fingerprint si está disponible
    const fingerprintHash = order.note_attributes?.find((attr: any) => attr.name === "fingerprint_hash")?.value
    const referrer = order.note_attributes?.find((attr: any) => attr.name === "referrer")?.value
    const landingPage = order.note_attributes?.find((attr: any) => attr.name === "landing_page")?.value

    // Obtener IP del cliente (si está disponible)
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || null

    // Buscar click relacionado con lógica mejorada
    let clickId = null
    let attributionMethod = "none"
    
    // Prioridad 1: Si hay cupón, buscar click con ese cupón
    if (couponId) {
      const { data: couponClick } = await supabase
        .from("tracking_clicks")
        .select("id")
        .eq("store_id", store.id)
        .eq("coupon_code", couponCode)
        .order("clicked_at", { ascending: false })
        .limit(1)
        .single()

      if (couponClick) {
        clickId = couponClick.id
        attributionMethod = "coupon_override"
      }
    }

    // Prioridad 2: Si hay fingerprint, buscar por fingerprint
    if (!clickId && fingerprintHash) {
      const { data: fingerprintClick } = await supabase
        .from("tracking_clicks")
        .select("id")
        .eq("store_id", store.id)
        .eq("fingerprint_hash", fingerprintHash)
        .order("clicked_at", { ascending: false })
        .limit(1)
        .single()

      if (fingerprintClick) {
        clickId = fingerprintClick.id
        attributionMethod = "fingerprint"
      }
    }

    // Prioridad 3: Si hay UTM, buscar por UTM
    if (!clickId && (utmSource || utmMedium || utmCampaign)) {
      const { data: utmClick } = await supabase
        .from("tracking_clicks")
        .select("id")
        .eq("store_id", store.id)
        .eq("utm_source", utmSource)
        .eq("utm_medium", utmMedium)
        .eq("utm_campaign", utmCampaign)
        .order("clicked_at", { ascending: false })
        .limit(1)
        .single()

      if (utmClick) {
        clickId = utmClick.id
        attributionMethod = "utm"
      }
    }

    // Prioridad 4: Buscar por IP en ventana de tiempo (fallback)
    if (!clickId) {
      const orderDate = new Date(order.created_at)
      const windowStart = new Date(orderDate.getTime() - 24 * 60 * 60 * 1000) // 24 horas antes
      
      const { data: ipClick } = await supabase
        .from("tracking_clicks")
        .select("id")
        .eq("store_id", store.id)
        .eq("ip_address", clientIP)
        .lte("clicked_at", orderDate.toISOString())
        .gte("clicked_at", windowStart.toISOString())
        .order("clicked_at", { ascending: false })
        .limit(1)
        .single()

      if (ipClick) {
        clickId = ipClick.id
        attributionMethod = "ip_time_window"
      }
    }

    // Crear conversión con datos mejorados
    const conversionData = {
      owner_id: store.owner_id,
      store_id: store.id,
      click_id: clickId,
      conversion_type: "purchase",
      conversion_value: orderTotal,
      currency: order.currency || "EUR",
      commission_rate: store.commission_rate,
      order_id: orderId,
      product_ids: lineItems.map((item: any) => item.product_id?.toString()),
      product_names: lineItems.map((item: any) => item.name),
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
      coupon_id: couponId,
      coupon_code: couponCode,
      platform: "shopify",
      customer_email: customerEmail,
      status: "confirmed", // Automáticamente confirmado por webhook
      verification_method: "webhook",
      converted_at: new Date(order.created_at).toISOString(),
      // Campos adicionales para tracking mejorado
      fingerprint_hash: fingerprintHash,
      attribution_method: attributionMethod,
      platform_detected: "shopify",
      user_agent: userAgent,
      ip_address: clientIP,
      referrer: referrer,
      landing_page: landingPage,
      created_at: new Date().toISOString()
    }

    const { data: conversion, error: conversionError } = await supabase
      .from("tracking_conversions")
      .insert(conversionData)
      .select()
      .single()

    if (conversionError) {
      console.error("Error creating conversion:", conversionError)
      return NextResponse.json({ error: "Error creating conversion" }, { status: 500 })
    }

    // Actualizar estadísticas del píxel si existe
    const { data: pixel } = await supabase
      .from("tracking_pixels")
      .select("id, total_conversions, total_revenue")
      .eq("store_id", store.id)
      .single()

    if (pixel) {
      await supabase
        .from("tracking_pixels")
        .update({
          total_conversions: pixel.total_conversions + 1,
          total_revenue: pixel.total_revenue + orderTotal,
          last_activity_at: new Date().toISOString(),
        })
        .eq("id", pixel.id)
    }

    console.log(`✅ Webhook processed: Order ${orderId} for store ${store.id} with attribution: ${attributionMethod}`)

    return NextResponse.json({
      success: true,
      conversion_id: conversion.id,
      attribution_method: attributionMethod,
      commission_amount: conversion.commission_amount
    })

  } catch (error) {
    console.error("Error processing Shopify webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Función para verificar la firma del webhook de Shopify
function verifyShopifyWebhook(body: string, signature: string | null): boolean {
  if (!signature) return false
  
  // Implementar verificación de firma si es necesario
  // Por ahora retornamos true para desarrollo
  return true
} 