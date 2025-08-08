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
      page_url,
      script_version,
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

    // Actualizar el estado del script en la tienda
    await supabase
      .from("stores")
      .update({
        script_last_ping: new Date().toISOString(),
        script_status: "active",
        script_version: script_version || "1.0.0"
      })
      .eq("id", store_id)

    // Registrar el ping de health
    const pingData = {
      store_id: store_id,
      tracking_script_id: pixel_id,
      ping_timestamp: timestamp || new Date().toISOString(),
      page_url: page_url || "",
      user_agent: clientInfo.user_agent,
      ip_address: clientInfo.ip_address,
      script_version: script_version || "1.0.0",
      platform_detected: platform || "unknown",
      fingerprint_hash: fingerprint?.fingerprintHash || null,
      health_status: "active"
    }

    // Insertar en la tabla de pings (si existe) o crear un log
    try {
      await supabase
        .from("script_pings")
        .insert(pingData)
    } catch (error) {
      // Si la tabla no existe, solo registrar en logs
      console.log("Health ping received:", pingData)
    }

    // Actualizar configuración universal con última actividad
    await supabase
      .from("universal_tracking_config")
      .update({
        updated_at: new Date().toISOString()
      })
      .eq("store_id", store_id)

    // Enviar webhooks si están configurados
    await sendWebhooks('health', {
      store_id,
      pixel_id,
      platform,
      fingerprint: fingerprint?.fingerprintHash,
      page_url,
      script_version,
      health_status: "active",
      timestamp
    }, supabase)

    return NextResponse.json({
      success: true,
      message: "Health ping registrado exitosamente",
      status: "active",
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders })

  } catch (error) {
    console.error("Error in universal health tracking:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('store_id')
    const pixelId = searchParams.get('pixel_id')

    if (!storeId || !pixelId) {
      return NextResponse.json(
        { error: "store_id y pixel_id son requeridos" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Obtener estado de health del sistema
    const { data: store } = await supabase
      .from("stores")
      .select("script_last_ping, script_status, script_version")
      .eq("id", storeId)
      .single()

    const { data: config } = await supabase
      .from("universal_tracking_config")
      .select("is_universal_enabled, script_version")
      .eq("store_id", storeId)
      .single()

    const { data: recentPings } = await supabase
      .from("script_pings")
      .select("ping_timestamp, platform_detected, health_status")
      .eq("store_id", storeId)
      .order("ping_timestamp", { ascending: false })
      .limit(5)

    // Calcular estado de health
    const lastPing = store?.script_last_ping ? new Date(store.script_last_ping) : null
    const now = new Date()
    const hoursSinceLastPing = lastPing ? (now.getTime() - lastPing.getTime()) / (1000 * 60 * 60) : null

    let healthStatus = "unknown"
    if (!lastPing) {
      healthStatus = "never_installed"
    } else if (hoursSinceLastPing && hoursSinceLastPing < 1) {
      healthStatus = "active"
    } else if (hoursSinceLastPing && hoursSinceLastPing < 24) {
      healthStatus = "warning"
    } else {
      healthStatus = "inactive"
    }

    return NextResponse.json({
      success: true,
      health_status: healthStatus,
      last_ping: store?.script_last_ping,
      hours_since_last_ping: hoursSinceLastPing,
      script_status: store?.script_status,
      script_version: store?.script_version,
      universal_enabled: config?.is_universal_enabled,
      recent_pings: recentPings || [],
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders })

  } catch (error) {
    console.error("Error getting health status:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders })
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