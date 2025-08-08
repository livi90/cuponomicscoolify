import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const storeId = params.id

    // Verificar que el usuario tiene acceso a esta tienda
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que la tienda pertenece al usuario
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, owner_id")
      .eq("id", storeId)
      .eq("owner_id", user.id)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    // Obtener configuración del tracking universal
    const { data: config, error: configError } = await supabase
      .from("universal_tracking_config")
      .select("*")
      .eq("store_id", storeId)
      .single()

    if (configError && configError.code !== "PGRST116") {
      return NextResponse.json({ error: "Error al obtener configuración" }, { status: 500 })
    }

    // Si no existe configuración, crear una por defecto
    if (!config) {
      const { data: newConfig, error: createError } = await supabase
        .from("universal_tracking_config")
        .insert({
          store_id: storeId,
          is_universal_enabled: false,
          script_version: "1.0.0",
          auto_detect_platform: true,
          fallback_to_pixel: true,
          enable_advanced_fingerprinting: true,
          enable_canvas_fingerprint: true,
          enable_webgl_fingerprint: true,
          enable_font_detection: true,
          respect_dnt_header: true,
          anonymize_ip: false,
          store_fingerprint_data: true,
          script_timeout_ms: 5000,
          max_retry_attempts: 3,
          batch_requests: false
        })
        .select("*")
        .single()

      if (createError) {
        return NextResponse.json({ error: "Error al crear configuración" }, { status: 500 })
      }

      return NextResponse.json(newConfig)
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error in GET universal tracking config:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const storeId = params.id
    const body = await request.json()

    // Verificar que el usuario tiene acceso a esta tienda
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que la tienda pertenece al usuario
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, owner_id")
      .eq("id", storeId)
      .eq("owner_id", user.id)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    // Validar campos permitidos
    const allowedFields = [
      "is_universal_enabled",
      "script_version",
      "auto_detect_platform",
      "fallback_to_pixel",
      "enable_advanced_fingerprinting",
      "enable_canvas_fingerprint",
      "enable_webgl_fingerprint",
      "enable_font_detection",
      "respect_dnt_header",
      "anonymize_ip",
      "store_fingerprint_data",
      "script_timeout_ms",
      "max_retry_attempts",
      "batch_requests"
    ]

    const updateData: any = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Validar tipos de datos
    if (updateData.script_timeout_ms && typeof updateData.script_timeout_ms !== "number") {
      return NextResponse.json({ error: "script_timeout_ms debe ser un número" }, { status: 400 })
    }

    if (updateData.max_retry_attempts && typeof updateData.max_retry_attempts !== "number") {
      return NextResponse.json({ error: "max_retry_attempts debe ser un número" }, { status: 400 })
    }

    // Verificar si existe configuración
    const { data: existingConfig } = await supabase
      .from("universal_tracking_config")
      .select("id")
      .eq("store_id", storeId)
      .single()

    let result
    if (existingConfig) {
      // Actualizar configuración existente
      const { data: updatedConfig, error: updateError } = await supabase
        .from("universal_tracking_config")
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq("store_id", storeId)
        .select("*")
        .single()

      if (updateError) {
        return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 })
      }

      result = updatedConfig
    } else {
      // Crear nueva configuración
      const { data: newConfig, error: createError } = await supabase
        .from("universal_tracking_config")
        .insert({
          store_id: storeId,
          ...updateData,
          script_version: updateData.script_version || "1.0.0",
          auto_detect_platform: updateData.auto_detect_platform ?? true,
          fallback_to_pixel: updateData.fallback_to_pixel ?? true,
          enable_advanced_fingerprinting: updateData.enable_advanced_fingerprinting ?? true,
          enable_canvas_fingerprint: updateData.enable_canvas_fingerprint ?? true,
          enable_webgl_fingerprint: updateData.enable_webgl_fingerprint ?? true,
          enable_font_detection: updateData.enable_font_detection ?? true,
          respect_dnt_header: updateData.respect_dnt_header ?? true,
          anonymize_ip: updateData.anonymize_ip ?? false,
          store_fingerprint_data: updateData.store_fingerprint_data ?? true,
          script_timeout_ms: updateData.script_timeout_ms || 5000,
          max_retry_attempts: updateData.max_retry_attempts || 3,
          batch_requests: updateData.batch_requests ?? false
        })
        .select("*")
        .single()

      if (createError) {
        return NextResponse.json({ error: "Error al crear configuración" }, { status: 500 })
      }

      result = newConfig
    }

    // Si se está habilitando el tracking universal, crear reglas de atribución por defecto
    if (updateData.is_universal_enabled === true) {
      const { data: existingRules } = await supabase
        .from("tracking_attribution_rules")
        .select("id")
        .eq("store_id", storeId)
        .single()

      if (!existingRules) {
        await supabase
          .from("tracking_attribution_rules")
          .insert({
            rule_name: "Default Attribution Rules",
            store_id: storeId,
            is_active: true,
            immediate_window: 2,
            short_window: 24,
            medium_window: 168,
            long_window: 720,
            last_click_wins: true,
            coupon_override: true,
            exclude_paid_ads: true,
            require_fingerprint_match: true,
            require_ip_match: true,
            ip_match_tolerance: 24,
            max_conversions_per_ip: 10,
            max_conversions_per_fingerprint: 5,
            rate_limit_per_minute: 60
          })
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in PATCH universal tracking config:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const storeId = params.id

    // Verificar que el usuario tiene acceso a esta tienda
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que la tienda pertenece al usuario
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, owner_id")
      .eq("id", storeId)
      .eq("owner_id", user.id)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    // Eliminar configuración
    const { error: deleteError } = await supabase
      .from("universal_tracking_config")
      .delete()
      .eq("store_id", storeId)

    if (deleteError) {
      return NextResponse.json({ error: "Error al eliminar configuración" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Configuración eliminada" })
  } catch (error) {
    console.error("Error in DELETE universal tracking config:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
} 