import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { data: store, error } = await supabase.from("stores").select("*").eq("id", params.id).single()

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 })
    }

    // Verificar permisos
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin" && store.owner_id !== user.id) {
      return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 })
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const data = await request.json()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verificar permisos
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    const { data: store } = await supabase.from("stores").select("owner_id").eq("id", params.id).single()

    if (!store || (profile?.role !== "admin" && store.owner_id !== user.id)) {
      return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 })
    }

    const { data: updatedStore, error } = await supabase
      .from("stores")
      .update({
        name: data.name,
        description: data.description,
        website: data.website,
        category: data.category,
        logo_url: data.logo_url,
        card_image_url: data.card_image_url,
        ecommerce_platform: data.ecommerce_platform,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(updatedStore)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
