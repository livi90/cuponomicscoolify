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
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer,
      landing_page,
      timestamp
    } = body

    // Validar datos requeridos
    if (!store_id || !pixel_id) {
      return NextResponse.json(
        { error: "store_id y pixel_id son requeridos" },
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

    // Guardar fingerprint si no existe
    let fingerprintId = null
    if (fingerprint && fingerprint.fingerprintHash) {
      const { data: existingFingerprint } = await supabase
        .from("tracking_fingerprints")
        .select("id")
        .eq("fingerprint_hash", fingerprint.fingerprintHash)
        .single()

      if (!existingFingerprint) {
        const { data: newFingerprint, error: fingerprintError } = await supabase
          .from("tracking_fingerprints")
          .insert({
            fingerprint_hash: fingerprint.fingerprintHash,
            user_agent: fingerprint.userAgent,
            screen_resolution: fingerprint.screenResolution,
            color_depth: fingerprint.colorDepth,
            timezone: fingerprint.timezone,
            language: fingerprint.language,
            platform: fingerprint.platform,
            canvas_fingerprint: fingerprint.canvasFingerprint,
            webgl_fingerprint: fingerprint.webglFingerprint,
            font_list: fingerprint.fontList,
            plugin_list: fingerprint.pluginList,
            touch_support: fingerprint.touchSupport,
            cookie_enabled: fingerprint.cookieEnabled,
            do_not_track: fingerprint.doNotTrack,
            ip_address: clientInfo.ip_address,
          })
          .select("id")
          .single()

        if (!fingerprintError) {
          fingerprintId = newFingerprint.id
        }
      } else {
        fingerprintId = existingFingerprint.id
      }
    }

    // Registrar el click de llegada
    const clickData = {
      user_id: null, // Usuario anónimo
      session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_content: utm_content || null,
      utm_term: utm_term || null,
      store_id: store_id,
      store_name: pixel.stores.name,
      coupon_code: null,
      coupon_id: null, // Se asignará cuando se use un cupón
      category: null,
      discount_type: null,
      discount_value: null,
      affiliate_id: null,
      original_url: referrer || "",
      tracked_url: landing_page || "",
      store_url: pixel.store_url,
      ip_address: clientInfo.ip_address,
      user_agent: clientInfo.user_agent,
      referrer: referrer || "",
      device_type: fingerprint?.userAgent ? 
        (fingerprint.userAgent.includes('Mobile') ? 'mobile' : 
         fingerprint.userAgent.includes('Tablet') ? 'tablet' : 'desktop') : 'unknown',
      clicked_at: timestamp || new Date().toISOString(),
      created_at: new Date().toISOString(),
      // Campos adicionales para tracking universal
      fingerprint_hash: fingerprint?.fingerprintHash || null,
      platform_detected: platform || 'unknown',
      arrival_type: 'universal'
    }

    const { data: click, error: clickError } = await supabase
      .from("tracking_clicks")
      .insert(clickData)
      .select("id, tracked_url")
      .single()

    if (clickError) {
      console.error("Error inserting click:", clickError)
      return NextResponse.json(
        { error: "Error al registrar el click" },
        { status: 500, headers: corsHeaders }
      )
    }

    // Verificar fraude
    await checkForFraud(clientInfo.ip_address, fingerprint?.fingerprintHash, store_id, supabase)

    // Enviar webhooks si están configurados
    await sendWebhooks('arrival', {
      click_id: click.id,
      store_id,
      pixel_id,
      platform,
      fingerprint: fingerprint?.fingerprintHash,
      utm_source,
      utm_medium,
      utm_campaign,
      referrer,
      landing_page,
      timestamp
    }, supabase)

    return NextResponse.json({
      success: true,
      click_id: click.id,
      message: "Llegada registrada exitosamente"
    }, { headers: corsHeaders })

  } catch (error) {
    console.error("Error in universal arrival tracking:", error)
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
async function checkForFraud(ipAddress: string, fingerprintHash: string | null, storeId: string, supabase: any) {
  try {
    // Contar clicks por IP en las últimas 24 horas
    const { data: ipClicks } = await supabase
      .from("tracking_clicks")
      .select("id")
      .eq("store_id", storeId)
      .eq("ip_address", ipAddress)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    // Contar clicks por fingerprint en las últimas 24 horas
    let fingerprintClicks = []
    if (fingerprintHash) {
      const { data: fpClicks } = await supabase
        .from("tracking_clicks")
        .select("id")
        .eq("store_id", storeId)
        .eq("fingerprint_hash", fingerprintHash)
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      fingerprintClicks = fpClicks || []
    }

    // Detectar patrones sospechosos
    const fraudReasons = []
    let fraudScore = 0

    if (ipClicks && ipClicks.length > 50) {
      fraudReasons.push("Demasiados clicks desde la misma IP")
      fraudScore += 0.3
    }

    if (fingerprintClicks.length > 20) {
      fraudReasons.push("Demasiados clicks desde el mismo fingerprint")
      fraudScore += 0.3
    }

    if (fraudScore > 0) {
      await supabase
        .from("tracking_fraud_detection")
        .insert({
          fraud_type: "suspicious_activity",
          severity: fraudScore > 0.5 ? "high" : "medium",
          ip_address: ipAddress,
          fingerprint_hash: fingerprintHash,
          user_agent: null,
          event_type: "arrival",
          fraud_score: Math.min(fraudScore, 1.0),
          fraud_reasons: fraudReasons,
          store_id: storeId,
          evidence_data: {
            ip_clicks_count: ipClicks?.length || 0,
            fingerprint_clicks_count: fingerprintClicks.length,
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