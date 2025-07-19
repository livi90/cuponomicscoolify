import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // Verificar que el usuario sea admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { store_id, reason, affiliate_program, affiliate_id, priority = 1 } = body

    if (!store_id) {
      return NextResponse.json({ error: "store_id is required" }, { status: 400 })
    }

    // Usar la función de Supabase para agregar excepción
    const { data, error } = await supabase.rpc("add_store_utm_exception", {
      p_store_id: store_id,
      p_reason: reason || null,
      p_affiliate_program: affiliate_program || null,
      p_affiliate_id: affiliate_id || null,
      p_priority: priority,
    })

    if (error) {
      console.error("Error adding store UTM exception:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ exception_id: data, success: true })
  } catch (error) {
    console.error("Error in store UTM exception API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
