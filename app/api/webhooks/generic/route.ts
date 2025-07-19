import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const {
      store_id,
      order_id,
      total,
      currency = "EUR",
      customer_email,
      utm_source,
      utm_campaign,
      coupon_code,
      product_ids,
      product_names,
      platform = "webhook-generic",
    } = body

    if (!store_id || !order_id || !total) {
      return NextResponse.json({ error: "store_id, order_id y total son requeridos" }, { status: 400 })
    }

    // Buscar la tienda y su owner
    const { data: store } = await supabase.from("stores").select("id, owner_id, commission_rate").eq("id", store_id).single()
    if (!store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    // Crear conversión
    const conversionData = {
      owner_id: store.owner_id,
      store_id: store.id,
      conversion_type: "purchase",
      conversion_value: Number.parseFloat(total),
      currency,
      order_id,
      product_ids: product_ids || [],
      product_names: product_names || [],
      utm_source,
      utm_campaign,
      coupon_code,
      platform,
      customer_email,
      status: "confirmed",
      verification_method: "webhook",
      converted_at: new Date().toISOString(),
      commission_rate: store.commission_rate ?? 7.5, // ← Nuevo: incluye la comisión personalizada
    }

    const { data: conversion, error: conversionError } = await supabase
      .from("tracking_conversions")
      .insert(conversionData)
      .select()
      .single()

    if (conversionError) {
      return NextResponse.json({ error: "Error al crear la conversión" }, { status: 500 })
    }

    return NextResponse.json({ success: true, conversion_id: conversion.id })
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
} 