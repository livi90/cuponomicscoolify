import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"


// Crear una sola instancia de Supabase para todo el componente

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validación básica
    if (!data.original_url || !data.coupon_id || !data.tracked_url) {
      return NextResponse.json(
        { error: "Missing required fields: original_url, tracked_url, and coupon_id are required." },
        { status: 400 },
      )
    }

    // Función para detectar tipo de dispositivo
    const detectDeviceType = (userAgent: string): string => {
      if (!userAgent) return "unknown"

      if (/iPhone|iPod|Android|BlackBerry|Windows Phone|Mobile/i.test(userAgent)) {
        return "mobile"
      }

      if (/iPad|Tablet/i.test(userAgent)) {
        return "tablet"
      }

      return "desktop"
    }

    // Capturar datos del cliente
    const clientInfo = {
      ip_address: request.ip || request.headers.get("x-forwarded-for") || "unknown",
      user_agent: request.headers.get("user-agent") || null,
      referrer: request.headers.get("referer") || null,
      session_id: request.headers.get("x-session-id") || null,
    }

    // Preparar datos para insertar
    const trackingData = {
      ...data,
      user_agent: clientInfo.user_agent,
      referrer: clientInfo.referrer,
      ip_address: clientInfo.ip_address,
      session_id: clientInfo.session_id,
      device_type: detectDeviceType(clientInfo.user_agent || ""),
      created_at: new Date().toISOString(),
    }

    // Insertar directamente en Supabase
    const { data: result, error } = await supabase
      .from("tracking_clicks")
      .insert(trackingData)
      .select("id, tracked_url")
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      click_id: result.id,
      tracked_url: result.tracked_url,
    })
  } catch (error) {
    console.error("Error tracking click:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// GET para obtener estadísticas
export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url)

    const store_id = searchParams.get("store_id")
    const coupon_id = searchParams.get("coupon_id")
    const utm_campaign = searchParams.get("utm_campaign")
    const date_from = searchParams.get("date_from")
    const date_to = searchParams.get("date_to")

    let query = supabase.from("tracking_clicks").select("*")

    if (store_id) query = query.eq("store_id", Number.parseInt(store_id))
    if (coupon_id) query = query.eq("coupon_id", Number.parseInt(coupon_id))
    if (utm_campaign) query = query.eq("utm_campaign", utm_campaign)
    if (date_from) query = query.gte("created_at", date_from)
    if (date_to) query = query.lte("created_at", date_to)

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tracking data:", error)
      return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in GET tracking:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
