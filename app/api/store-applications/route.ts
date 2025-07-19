import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/store-applications
 * Obtiene las solicitudes de tienda (admin) o del usuario actual
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Obtener perfil del usuario
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    let query = supabase.from("store_applications").select(`
      *,
      profiles (
        email,
        full_name
      )
    `)

    // Si no es admin, solo mostrar sus propias solicitudes
    if (profile?.role !== "admin") {
      query = query.eq("user_id", user.id)
    }

    const { data: applications, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(applications || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/store-applications
 * Crea una nueva solicitud de tienda
 */
export async function POST(request: Request) {
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

    // Verificar si ya tiene una solicitud pendiente
    const { data: existingApplication } = await supabase
      .from("store_applications")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .single()

    if (existingApplication) {
      return NextResponse.json({ message: "Ya tienes una solicitud pendiente" }, { status: 400 })
    }

    // Crear la solicitud
    const { data: application, error } = await supabase
      .from("store_applications")
      .insert({
        user_id: user.id,
        store_name: data.store_name,
        description: data.description,
        website: data.website,
        category: data.category,
        ecommerce_platform: data.ecommerce_platform,
        business_type: data.business_type,
        expected_monthly_sales: data.expected_monthly_sales,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/store-applications
 * Aprueba o rechaza una solicitud (solo admin)
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { applicationId, status, adminNotes } = await request.json()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verificar que es admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 })
    }

    // Obtener la solicitud
    const { data: application, error: fetchError } = await supabase
      .from("store_applications")
      .select("*")
      .eq("id", applicationId)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Actualizar la solicitud
    const { error: updateError } = await supabase
      .from("store_applications")
      .update({
        status,
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq("id", applicationId)

    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json({ message: updateError.message }, { status: 500 })
    }

    // Si se aprueba, crear la tienda y cambiar rol del usuario
    if (status === "approved") {
      // Crear la tienda
      const { data: store, error: storeError } = await supabase
        .from("stores")
        .insert({
          name: application.store_name,
          description: application.description,
          website: application.website,
          category: application.category,
          ecommerce_platform: application.ecommerce_platform,
          owner_id: application.user_id,
          is_active: true,
          status: "active",
          commission_rate: application.commission ?? 7.5, // ← Copia la comisión elegida, default 7.5%
        })
        .select()
        .single()

      if (storeError) {
        console.error("Store creation error:", storeError)
        return NextResponse.json({ message: "Error creating store" }, { status: 500 })
      }

      // Cambiar rol del usuario a merchant
      const { error: roleError } = await supabase
        .from("profiles")
        .update({ role: "merchant" })
        .eq("id", application.user_id)

      if (roleError) {
        console.error("Role update error:", roleError)
        // No fallar si no se puede actualizar el rol, pero log el error
      }

      // Crear notificación
      await supabase.from("notifications").insert({
        user_id: application.user_id,
        title: "¡Tienda Aprobada!",
        message: `Tu tienda "${application.store_name}" ha sido aprobada y está lista para usar.`,
        type: "store_approved",
        is_read: false,
      })

      return NextResponse.json({ message: "Application approved and store created", store })
    } else if (status === "rejected") {
      // Crear notificación de rechazo
      await supabase.from("notifications").insert({
        user_id: application.user_id,
        title: "Solicitud de Tienda Rechazada",
        message: `Tu solicitud para la tienda "${application.store_name}" ha sido rechazada. ${adminNotes ? `Motivo: ${adminNotes}` : ""}`,
        type: "store_rejected",
        is_read: false,
      })
    }

    return NextResponse.json({ message: "Application updated successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
