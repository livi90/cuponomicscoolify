import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Schema de validación para la suscripción
const subscribeSchema = z.object({
  email: z.string().email("Email inválido"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  country: z.string().optional(),
  language: z.string().optional(),
  source: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Parsear el body de la request
    const body = await request.json()
    
    // Validar los datos
    const validatedData = subscribeSchema.parse(body)
    
    // Verificar si el email ya existe
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id, is_active, is_verified")
      .eq("email", validatedData.email)
      .single()
    
    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Este email ya está suscrito al newsletter" 
          },
          { status: 400 }
        )
      } else {
        // Reactivar suscripción existente
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({
            is_active: true,
            unsubscribed_at: null,
            updated_at: new Date().toISOString(),
            ...validatedData
          })
          .eq("id", existingSubscriber.id)
        
        if (updateError) throw updateError
        
        return NextResponse.json(
          { 
            success: true, 
            message: "¡Bienvenido de vuelta! Tu suscripción ha sido reactivada" 
          },
          { status: 200 }
        )
      }
    }
    
    // Crear nueva suscripción
    const { data: newSubscriber, error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: validatedData.email,
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        country: validatedData.country,
        language: validatedData.language || "es",
        source: validatedData.source,
        utm_source: validatedData.utm_source,
        utm_medium: validatedData.utm_medium,
        utm_campaign: validatedData.utm_campaign,
        utm_content: validatedData.utm_content,
        utm_term: validatedData.utm_term,
        is_active: true,
        is_verified: false, // Requiere verificación
        verification_token: crypto.randomUUID(),
        verification_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
        subscribed_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (insertError) throw insertError
    
    // Registrar evento de suscripción
    await supabase
      .from("newsletter_events")
      .insert({
        subscriber_id: newSubscriber.id,
        event_type: "subscribe",
        event_data: {
          source: validatedData.source,
          utm_data: {
            source: validatedData.utm_source,
            medium: validatedData.utm_medium,
            campaign: validatedData.utm_campaign,
            content: validatedData.utm_content,
            term: validatedData.utm_term,
          }
        },
        ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
        user_agent: request.headers.get("user-agent"),
      })
    
    // TODO: Enviar email de verificación
    // Por ahora, marcamos como verificado automáticamente para testing
    await supabase
      .from("newsletter_subscribers")
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq("id", newSubscriber.id)
    
    return NextResponse.json(
      { 
        success: true, 
        message: "¡Gracias por suscribirte! Te enviaremos las mejores ofertas." 
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error("Error en suscripción al newsletter:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Datos inválidos", 
          errors: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Error interno del servidor" 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Método no permitido" },
    { status: 405 }
  )
} 