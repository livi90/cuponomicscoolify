import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// --- CORS headers universales ---
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Shopify-Pixel, ngrok-skip-browser-warning",
  "Access-Control-Allow-Credentials": "false",
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Obtener datos del cuerpo de la petición
    const body = await request.json()

    const {
      pixel_id,
      order_id,
      conversion_value,
      currency = "EUR",
      coupon_code,
      utm_source,
      utm_medium,
      utm_campaign,
      customer_email,
      product_ids,
      product_names,
      platform = "unknown",
    } = body

    // Validar datos requeridos
    if (!pixel_id || !order_id || !conversion_value) {
      return NextResponse.json({ error: "pixel_id, order_id y conversion_value son requeridos" }, { status: 400 })
    }

    // Buscar el píxel y obtener información de la tienda
    const { data: pixel, error: pixelError } = await supabase
      .from("tracking_pixels")
      .select(`
        *,
        stores!inner(id, name, owner_id)
      `)
      .eq("pixel_id", pixel_id)
      .eq("is_active", true)
      .single()

    if (pixelError || !pixel) {
      return NextResponse.json({ error: "Píxel no encontrado o inactivo" }, { status: 404 })
    }

    // Buscar click relacionado si existe
    let click_id = null
    if (utm_source || utm_medium || utm_campaign) {
      const { data: click } = await supabase
        .from("tracking_clicks")
        .select("id")
        .eq("store_id", pixel.stores.id)
        .eq("utm_source", utm_source)
        .eq("utm_medium", utm_medium)
        .eq("utm_campaign", utm_campaign)
        .order("clicked_at", { ascending: false })
        .limit(1)
        .single()

      click_id = click?.id || null
    }

    // Buscar cupón si se proporcionó código
    let coupon_id = null
    if (coupon_code) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("id")
        .eq("code", coupon_code)
        .eq("store_id", pixel.stores.id)
        .single()

      coupon_id = coupon?.id || null
    }

    // Crear la conversión
    const conversionData = {
      owner_id: pixel.stores.owner_id,
      store_id: pixel.stores.id,
      click_id,
      conversion_type: "purchase",
      conversion_value: Number.parseFloat(conversion_value),
      currency,
      commission_rate: pixel.commission_rate,
      order_id,
      product_ids: product_ids || [],
      product_names: product_names || [],
      utm_source,
      utm_medium,
      utm_campaign,
      coupon_id,
      coupon_code,
      platform,
      customer_email,
      status: "pending",
      verification_method: "pixel",
      converted_at: new Date().toISOString(),
    }

    const { data: conversion, error: conversionError } = await supabase
      .from("tracking_conversions")
      .insert(conversionData)
      .select()
      .single()

    if (conversionError) {
      console.error("Error creating conversion:", conversionError)
      return new NextResponse(JSON.stringify({ error: "Error al crear la conversión" }), {
        status: 500,
        headers: corsHeaders,
      })
    }

    // Actualizar estadísticas del píxel
    await supabase
      .from("tracking_pixels")
      .update({
        total_conversions: pixel.total_conversions + 1,
        total_revenue: pixel.total_revenue + Number.parseFloat(conversion_value),
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", pixel.id)

    return new NextResponse(JSON.stringify({
      success: true,
      conversion_id: conversion.id,
      message: "Conversión registrada exitosamente",
    }), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    console.error("Error in conversion tracking:", error)
    return new NextResponse(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: corsHeaders,
    })
  }
}

// Endpoint para obtener el script de tracking
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const pixel_id = searchParams.get("pixel_id")

  if (!pixel_id) {
    return NextResponse.json({ error: "pixel_id es requerido" }, { status: 400 })
  }

  // Generar el script de tracking
  const trackingScript = `
(function() {
  // Cuponomics Tracking Pixel
  var pixelId = '${pixel_id}';
  var apiUrl = '${process.env.NEXT_PUBLIC_API_URL || "https://cuponomics.com"}/api/tracking/conversion';
  
  // Función para enviar conversión
  window.cuponomicsTrack = function(eventType, data) {
    if (eventType === 'purchase') {
      var conversionData = {
        pixel_id: pixelId,
        order_id: data.order_id,
        conversion_value: data.value,
        currency: data.currency || 'EUR',
        coupon_code: data.coupon_code,
        customer_email: data.customer_email,
        product_ids: data.product_ids,
        product_names: data.product_names,
        platform: data.platform || 'web',
        utm_source: getUrlParameter('utm_source'),
        utm_medium: getUrlParameter('utm_medium'),
        utm_campaign: getUrlParameter('utm_campaign')
      };
      
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversionData)
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log('Cuponomics conversion tracked:', data);
      }).catch(function(error) {
        console.error('Error tracking conversion:', error);
      });
    }
  };
  
  // Función auxiliar para obtener parámetros URL
  function getUrlParameter(name) {
    name = name.replace(/[\\[]/, '\\\\[').replace(/[\\]]/, '\\\\]');
    var regex = new RegExp('[\\\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\\+/g, ' '));
  }
  
  // Auto-detectar conversiones en páginas de checkout comunes
  if (window.location.pathname.includes('/checkout/success') || 
      window.location.pathname.includes('/order-received') ||
      window.location.pathname.includes('/thank-you')) {
    
    // Intentar extraer datos de la página
    setTimeout(function() {
      var orderValue = document.querySelector('[data-order-total], .order-total, #order-total');
      var orderId = document.querySelector('[data-order-id], .order-id, #order-id');
      
      if (orderValue && orderId) {
        var value = parseFloat(orderValue.textContent.replace(/[^0-9.]/g, ''));
        var id = orderId.textContent.trim();
        
        if (value > 0 && id) {
          cuponomicsTrack('purchase', {
            order_id: id,
            value: value
          });
        }
      }
    }, 1000);
  }
})();
  `.trim()

  return new NextResponse(trackingScript, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

// --- CORS preflight handler ---
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      "Access-Control-Allow-Origin": origin || "*",
      
    },
  });
}
