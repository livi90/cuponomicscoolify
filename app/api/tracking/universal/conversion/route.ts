import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// CORS headers universales
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Cuponomics-Pixel",
  "Access-Control-Allow-Credentials": "false",
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      store_id,
      pixel_id,
      platform,
      fingerprint,
      order_id,
      conversion_value,
      currency,
      coupon_code,
      product_ids,
      product_names,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer,
      timestamp
    } = body

    // Validar datos requeridos
    if (!store_id || !pixel_id || !order_id || !conversion_value) {
      return NextResponse.json(
        { error: "store_id, pixel_id, order_id y conversion_value son requeridos" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Obtener información del cliente
    const clientInfo = {
      ip_address: request.ip || request.headers.get("x-forwarded-for") || "unknown",
      user_agent: request.headers.get("user-agent") || null,
    }

    // Verificar que el píxel existe y está activo
    const { data: pixel, error: pixelError } = await supabase
      .from("tracking_pixels")
      .select(`
        *,
        stores!inner(id, name, owner_id)
      `)
      .eq("pixel_id", pixel_id)
      .eq("is_active", true)
      .single()

    if (pixelError || !pixel) {
      return NextResponse.json(
        { error: "Píxel no encontrado o inactivo" },
        { status: 404, headers: corsHeaders }
      )
    }

    // Verificar configuración universal
    const { data: config } = await supabase
      .from("universal_tracking_config")
      .select("*")
      .eq("store_id", store_id)
      .eq("is_universal_enabled", true)
      .single()

    if (!config) {
      return NextResponse.json(
        { error: "Tracking universal no habilitado para esta tienda" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Buscar click relacionado para atribución
    let clickId = null
    let attributionMethod = "none"
    
    // Buscar por UTM parameters
    if (utm_source || utm_medium || utm_campaign) {
      const { data: click } = await supabase
        .from("tracking_clicks")
        .select("id")
        .eq("store_id", store_id)
        .eq("utm_source", utm_source)
        .eq("utm_medium", utm_medium)
        .eq("utm_campaign", utm_campaign)
        .order("clicked_at", { ascending: false })
        .limit(1)
        .single()

      if (click) {
        clickId = click.id
        attributionMethod = "utm"
      }
    }

    // Si no se encontró por UTM, buscar por fingerprint
    if (!clickId && fingerprint?.fingerprintHash) {
      const { data: click } = await supabase
        .from("tracking_clicks")
        .select("id")
        .eq("store_id", store_id)
        .eq("fingerprint_hash", fingerprint.fingerprintHash)
        .order("clicked_at", { ascending: false })
        .limit(1)
        .single()

      if (click) {
        clickId = click.id
        attributionMethod = "fingerprint"
      }
    }

    // Si no se encontró por fingerprint, buscar por IP en ventana de tiempo
    if (!clickId) {
      const orderDate = new Date(timestamp || Date.now())
      const windowStart = new Date(orderDate.getTime() - 24 * 60 * 60 * 1000) // 24 horas antes
      
      const { data: click } = await supabase
        .from("tracking_clicks")
        .select("id")
        .eq("store_id", store_id)
        .eq("ip_address", clientInfo.ip_address)
        .lte("clicked_at", orderDate.toISOString())
        .gte("clicked_at", windowStart.toISOString())
        .order("clicked_at", { ascending: false })
        .limit(1)
        .single()

      if (click) {
        clickId = click.id
        attributionMethod = "ip_time_window"
      }
    }

    // Buscar cupón si se proporcionó código
    let couponId = null
    if (coupon_code) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("id")
        .eq("code", coupon_code)
        .eq("store_id", store_id)
        .single()

      if (coupon) {
        couponId = coupon.id
        // Si hay cupón, forzar atribución al click más reciente con ese cupón
        const { data: couponClick } = await supabase
          .from("tracking_clicks")
          .select("id")
          .eq("store_id", store_id)
          .eq("coupon_code", coupon_code)
          .order("clicked_at", { ascending: false })
          .limit(1)
          .single()

        if (couponClick) {
          clickId = couponClick.id
          attributionMethod = "coupon_override"
        }
      }
    }

    // Crear la conversión
    const conversionData = {
      owner_id: pixel.stores.owner_id,
      store_id: store_id,
      click_id: clickId,
      conversion_type: "purchase",
      conversion_value: Number.parseFloat(conversion_value),
      currency: currency || "EUR",
      commission_rate: pixel.commission_rate,
      order_id: order_id,
      product_ids: product_ids || [],
      product_names: product_names || [],
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      coupon_id: couponId,
      coupon_code: coupon_code,
      discount_applied: 0, // Se calculará si es necesario
      session_id: null,
      user_agent: clientInfo.user_agent,
      ip_address: clientInfo.ip_address,
      referrer: referrer || "",
      landing_page: null,
      platform: platform || "unknown",
      store_url: pixel.store_url,
      checkout_url: null,
      status: "pending",
      verified_at: null,
      verification_method: "universal_webhook",
      // Campos adicionales para tracking universal
      fingerprint_hash: fingerprint?.fingerprintHash || null,
      attribution_method: attributionMethod,
      platform_detected: platform || "unknown",
      created_at: new Date().toISOString()
    }

    const { data: conversion, error: conversionError } = await supabase
      .from("tracking_conversions")
      .insert(conversionData)
      .select("id, conversion_value, commission_amount")
      .single()

    if (conversionError) {
      console.error("Error inserting conversion:", conversionError)
      return NextResponse.json(
        { error: "Error al registrar la conversión" },
        { status: 500, headers: corsHeaders }
      )
    }

    // Actualizar estadísticas del píxel
    await supabase
      .from("tracking_pixels")
      .update({
        total_conversions: pixel.total_conversions + 1,
        total_revenue: pixel.total_revenue + Number.parseFloat(conversion_value),
        total_commission: pixel.total_commission + conversion.commission_amount,
        last_activity_at: new Date().toISOString()
      })
      .eq("id", pixel.id)

    // Verificar fraude
    await checkForFraud(clientInfo.ip_address, fingerprint?.fingerprintHash, store_id, supabase, "conversion")

    // Enviar webhooks si están configurados
    await sendWebhooks('conversion', {
      conversion_id: conversion.id,
      click_id: clickId,
      store_id,
      pixel_id,
      platform,
      fingerprint: fingerprint?.fingerprintHash,
      order_id,
      conversion_value,
      currency,
      coupon_code,
      attribution_method: attributionMethod,
      timestamp
    }, supabase)

    return NextResponse.json({
      success: true,
      conversion_id: conversion.id,
      click_id: clickId,
      attribution_method: attributionMethod,
      commission_amount: conversion.commission_amount,
      message: "Conversión registrada exitosamente"
    }, { headers: corsHeaders })

  } catch (error) {
    console.error("Error in universal conversion tracking:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders })
}

// Función para verificar fraude
async function checkForFraud(ipAddress: string, fingerprintHash: string | null, storeId: string, supabase: any, eventType: string) {
  try {
    // Contar conversiones por IP en las últimas 24 horas
    const { data: ipConversions } = await supabase
      .from("tracking_conversions")
      .select("id")
      .eq("store_id", storeId)
      .eq("ip_address", ipAddress)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    // Contar conversiones por fingerprint en las últimas 24 horas
    let fingerprintConversions = []
    if (fingerprintHash) {
      const { data: fpConversions } = await supabase
        .from("tracking_conversions")
        .select("id")
        .eq("store_id", storeId)
        .eq("fingerprint_hash", fingerprintHash)
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      fingerprintConversions = fpConversions || []
    }

    // Detectar patrones sospechosos
    const fraudReasons = []
    let fraudScore = 0

    if (ipConversions && ipConversions.length > 10) {
      fraudReasons.push("Demasiadas conversiones desde la misma IP")
      fraudScore += 0.4
    }

    if (fingerprintConversions.length > 5) {
      fraudReasons.push("Demasiadas conversiones desde el mismo fingerprint")
      fraudScore += 0.4
    }

    if (fraudScore > 0) {
      await supabase
        .from("tracking_fraud_detection")
        .insert({
          fraud_type: "suspicious_conversions",
          severity: fraudScore > 0.5 ? "high" : "medium",
          ip_address: ipAddress,
          fingerprint_hash: fingerprintHash,
          user_agent: null,
          event_type: eventType,
          fraud_score: Math.min(fraudScore, 1.0),
          fraud_reasons: fraudReasons,
          store_id: storeId,
          evidence_data: {
            ip_conversions_count: ipConversions?.length || 0,
            fingerprint_conversions_count: fingerprintConversions.length,
            time_window_hours: 24
          }
        })
    }
  } catch (error) {
    console.error("Error checking for fraud:", error)
  }
}

// Función para enviar webhooks
async function sendWebhooks(eventType: string, data: any, supabase: any) {
  try {
    const { data: webhooks } = await supabase
      .from("universal_tracking_webhooks")
      .select("*")
      .eq("store_id", data.store_id)
      .eq("is_active", true)
      .contains("events_enabled", [eventType])

    if (!webhooks) return

    for (const webhook of webhooks) {
      try {
        const startTime = Date.now()
        const response = await fetch(webhook.endpoint_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Cuponomics-Signature": generateWebhookSignature(data, webhook.secret_key),
            "X-Cuponomics-Event": eventType
          },
          body: JSON.stringify({
            event: eventType,
            timestamp: new Date().toISOString(),
            data: data
          }),
          signal: AbortSignal.timeout(webhook.timeout_seconds * 1000)
        })

        const responseTime = Date.now() - startTime
        const isSuccess = response.ok

        // Registrar log del webhook
        await supabase
          .from("universal_webhook_logs")
          .insert({
            webhook_id: webhook.id,
            event_type: eventType,
            request_payload: data,
            response_status: response.status,
            response_body: isSuccess ? "Success" : await response.text(),
            response_time_ms: responseTime,
            is_success: isSuccess,
            error_message: isSuccess ? null : `HTTP ${response.status}`,
            ip_address: null,
            user_agent: null
          })

        // Actualizar estadísticas del webhook
        await supabase
          .from("universal_tracking_webhooks")
          .update({
            total_calls: webhook.total_calls + 1,
            successful_calls: webhook.successful_calls + (isSuccess ? 1 : 0),
            failed_calls: webhook.failed_calls + (isSuccess ? 0 : 1),
            last_called_at: new Date().toISOString()
          })
          .eq("id", webhook.id)

      } catch (error) {
        console.error(`Error sending webhook ${webhook.id}:`, error)
        
        // Registrar error en logs
        await supabase
          .from("universal_webhook_logs")
          .insert({
            webhook_id: webhook.id,
            event_type: eventType,
            request_payload: data,
            response_status: null,
            response_body: null,
            response_time_ms: null,
            is_success: false,
            error_message: error instanceof Error ? error.message : "Unknown error",
            ip_address: null,
            user_agent: null
          })
      }
    }
  } catch (error) {
    console.error("Error in webhook processing:", error)
  }
}

// Función para generar firma de webhook
function generateWebhookSignature(data: any, secretKey: string): string {
  const crypto = require('crypto')
  const payload = JSON.stringify(data)
  return crypto.createHmac('sha256', secretKey).update(payload).digest('hex')
} 