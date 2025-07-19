import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { store_id } = data
    const supabase = await createClient()

    if (!store_id) {
      return NextResponse.json({ error: "store_id is required" }, { status: 400 })
    }

    // Obtener información de la tienda
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, name, website_url, ecommerce_platform, webhook_url, owner_id")
      .eq("id", store_id)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Simular datos de prueba
    const testOrderData = {
      order_id: `TEST_${Date.now()}`,
      total: 99.99,
      currency: "EUR",
      customer_email: "test@example.com",
      platform: store.ecommerce_platform || "web",
      utm_source: "cuponomics",
      utm_campaign: "test_campaign",
      coupon_code: "TEST10",
      product_ids: ["test_product_1"],
      product_names: ["Producto de Prueba"],
    }

    // Actualizar estado de la tienda
    await supabase
      .from("stores")
      .update({
        webhook_status: "active",
        webhook_last_test: new Date().toISOString(),
      })
      .eq("id", store_id)

    // Crear conversión de prueba
    const conversionData = {
      owner_id: store.owner_id,
      store_id: store.id,
      conversion_type: "purchase",
      conversion_value: testOrderData.total,
      currency: testOrderData.currency,
      commission_rate: 5.00, // Default commission rate
      order_id: testOrderData.order_id,
      product_ids: testOrderData.product_ids,
      product_names: testOrderData.product_names,
      utm_source: testOrderData.utm_source,
      utm_campaign: testOrderData.utm_campaign,
      coupon_code: testOrderData.coupon_code,
      platform: testOrderData.platform,
      customer_email: testOrderData.customer_email,
      status: "confirmed",
      verification_method: "test",
      converted_at: new Date().toISOString(),
    }

    const { data: conversion, error: conversionError } = await supabase
      .from("tracking_conversions")
      .insert(conversionData)
      .select()
      .single()

    if (conversionError) {
      console.error("Error creating test conversion:", conversionError)
      return NextResponse.json({ error: "Error creating test conversion" }, { status: 500 })
    }

    console.log(`✅ Test webhook processed for store ${store.name}`)

    return NextResponse.json({
      success: true,
      message: "Webhook test completed successfully",
      test_data: testOrderData,
      conversion_id: conversion.id,
    })

  } catch (error) {
    console.error("Error testing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 