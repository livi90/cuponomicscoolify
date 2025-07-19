import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const supabase = await createClient()

    // Validar datos requeridos
    if (!data.storeId || !data.trackingScriptId) {
      return NextResponse.json({ error: "Missing required fields: storeId and trackingScriptId" }, { status: 400 })
    }

    // Obtener información del cliente
    const clientInfo = {
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      user_agent: data.userAgent || request.headers.get("user-agent") || null,
    }

    // Registrar el ping
    const { error: pingError } = await supabase.from("script_pings").insert({
      store_id: data.storeId,
      tracking_script_id: data.trackingScriptId,
      ping_timestamp: new Date().toISOString(),
      page_url: data.pageUrl,
      user_agent: clientInfo.user_agent,
      ip_address: clientInfo.ip_address,
      script_version: data.version,
      platform_detected: data.platform,
    })

    if (pingError) {
      console.error("Error inserting ping:", pingError)
    }

    // Actualizar el estado del script en la tienda
    const { error: updateError } = await supabase
      .from("stores")
      .update({
        script_last_ping: new Date().toISOString(),
        script_status: "active",
      })
      .eq("id", data.storeId)
      .eq("tracking_script_id", data.trackingScriptId)

    if (updateError) {
      console.error("Error updating store script status:", updateError)
    }

    return NextResponse.json({
      success: true,
      message: "Ping received successfully",
    })
  } catch (error) {
    console.error("Error processing ping:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
