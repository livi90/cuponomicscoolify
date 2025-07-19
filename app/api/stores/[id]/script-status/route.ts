import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const storeId = params.id

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obtener información del script de la tienda
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, name, script_last_ping, script_status, tracking_script_id, owner_id")
      .eq("id", storeId)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Verificar que el usuario sea el propietario o admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (store.owner_id !== user.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Obtener estadísticas de pings recientes
    const { data: recentPings, error: pingsError } = await supabase
      .from("script_pings")
      .select("ping_timestamp, page_url")
      .eq("store_id", storeId)
      .order("ping_timestamp", { ascending: false })
      .limit(10)

    if (pingsError) {
      console.error("Error fetching pings:", pingsError)
    }

    return NextResponse.json({
      store_id: store.id,
      store_name: store.name,
      script_last_ping: store.script_last_ping,
      script_status: store.script_status,
      tracking_script_id: store.tracking_script_id,
      recent_pings: recentPings || [],
      ping_count: recentPings?.length || 0,
    })
  } catch (error) {
    console.error("Error fetching script status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
