import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()

    // Obtener usuario actual
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Crear la solicitud de tienda
    const { data: application, error } = await supabase
      .from("store_applications")
      .insert({
        user_id: user.id,
        store_name: formData.get("store_name"),
        store_description: formData.get("store_description"),
        store_website: formData.get("store_website"),
        store_category: formData.get("store_category"),
        business_type: formData.get("business_type"),
        contact_phone: formData.get("contact_phone"),
        additional_info: formData.get("additional_info"),
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
