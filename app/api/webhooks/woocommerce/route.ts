import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-wc-webhook-signature")
    
    // Verificar autenticidad del webhook
    if (!verifyWooCommerceWebhook(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const data = JSON.parse(body)
    const supabase = await createClient()

    // Solo procesar eventos de orden completada
    if (data.status !== "completed" && data.status !== "processing") {
      return NextResponse.json({ success: true, message: "Event ignored" })
    }

    const order = data
    const orderId = order.id.toString()
    const orderTotal = parseFloat(order.total)
    const customerEmail = order.billing?.email
    const discountCodes = order.coupon_lines?.map((c: any) => c.code) || []
    const lineItems = order.line_items || []

    // Buscar tienda por dominio
    const referer = request.headers.get("referer")
    const domain = referer ? new URL(referer).hostname : null
    
    const { data: store } = await supabase
      .from("stores")
      .select("id, owner_id, commission_rate")
      .eq("website_url", `https://${domain}`)
      .single()

    if (!store) {
      console.log(`Store not found for domain: ${domain}`)
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

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

    // Buscar click relacionado por UTM parameters
    const utmSource = order.meta_data?.find((meta: any) => meta.key === "utm_source")?.value
    const utmCampaign = order.meta_data?.find((meta: any) => meta.key === "utm_campaign")?.value
    
    let clickId = null
    if (couponId) {
      // Si hay cupón, mantener lógica actual (UTM)
      if (utmSource && utmCampaign) {
        const { data: click } = await supabase
          .from("tracking_clicks")
          .select("id")
          .eq("store_id", store.id)
          .eq("utm_source", utmSource)
          .eq("utm_campaign", utmCampaign)
          .order("clicked_at", { ascending: false })
          .limit(1)
          .single()
        clickId = click?.id || null
      }
    } else {
      // Si NO hay cupón, buscar el click más reciente para la tienda en ventana de 24h antes de la orden
      const orderDate = new Date(order.date_created)
      const windowStart = new Date(orderDate.getTime() - 24 * 60 * 60 * 1000)
      const { data: click } = await supabase
        .from("tracking_clicks")
        .select("id")
        .eq("store_id", store.id)
        .lte("clicked_at", orderDate.toISOString())
        .gte("clicked_at", windowStart.toISOString())
        .order("clicked_at", { ascending: false })
        .limit(1)
        .single()
      clickId = click?.id || null
    }

    // Crear conversión
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
      utm_campaign: utmCampaign,
      coupon_id: couponId,
      coupon_code: couponCode,
      platform: "woocommerce",
      customer_email: customerEmail,
      status: "confirmed", // Automáticamente confirmado por webhook
      verification_method: "webhook",
      converted_at: new Date(order.date_created).toISOString(),
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

    console.log(`✅ WooCommerce webhook processed: Order ${orderId} for store ${store.id}`)

    return NextResponse.json({
      success: true,
      conversion_id: conversion.id,
      message: "Conversion automatically verified via webhook",
    })

  } catch (error) {
    console.error("Error processing WooCommerce webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Verificar firma del webhook de WooCommerce
function verifyWooCommerceWebhook(body: string, signature: string | null): boolean {
  if (!signature || !process.env.WOOCOMMERCE_WEBHOOK_SECRET) {
    return false
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.WOOCOMMERCE_WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("base64")

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
} 