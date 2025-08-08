import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Verificar si el usuario está autenticado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verificar si el usuario es admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // Obtener el body de la request
    const { is_early_adopter } = await request.json()

    if (typeof is_early_adopter !== "boolean") {
      return NextResponse.json(
        { message: "is_early_adopter debe ser un boolean" },
        { status: 400 }
      )
    }

    // Actualizar la tienda
    const { data: store, error } = await supabase
      .from("stores")
      .update({ is_early_adopter })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
