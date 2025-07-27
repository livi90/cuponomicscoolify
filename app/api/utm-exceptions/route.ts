import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"


// Crear una sola instancia de Supabase para todo el componente

export async function GET() {
  try {

    const { data: exceptions, error } = await supabase
      .from("utm_tracking_exceptions")
      .select("*")
      .eq("is_active", true)
      .order("store_name")

    if (error) {
      console.error("Error fetching UTM exceptions:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(exceptions || [])
  } catch (error) {
    console.error("Error in UTM exceptions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {

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
    const { store_id, store_name, domain, reason } = body

    if (!store_name || !domain) {
      return NextResponse.json({ error: "store_name and domain are required" }, { status: 400 })
    }

    const { data: exception, error } = await supabase
      .from("utm_tracking_exceptions")
      .insert({
        store_id,
        store_name,
        domain,
        reason,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating UTM exception:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(exception)
  } catch (error) {
    console.error("Error in UTM exceptions POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
