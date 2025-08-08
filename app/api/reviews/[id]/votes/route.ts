import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    
    const reviewId = params.id
    const body = await request.json()
    const { vote_type } = body
    
    // Validar datos
    if (!vote_type || !["like", "dislike"].includes(vote_type)) {
      return NextResponse.json({ error: "Tipo de voto inválido" }, { status: 400 })
    }
    
    // Verificar que la review existe
    const { data: review } = await supabase
      .from("coupon_reviews")
      .select("id, user_id")
      .eq("id", reviewId)
      .eq("status", "active")
      .single()
    
    if (!review) {
      return NextResponse.json({ error: "Review no encontrada" }, { status: 404 })
    }
    
    // Verificar que el usuario no está votando su propia review
    if (review.user_id === user.id) {
      return NextResponse.json({ error: "No puedes votar tu propia review" }, { status: 400 })
    }
    
    // Verificar si ya existe un voto
    const { data: existingVote } = await supabase
      .from("review_votes")
      .select("id, vote_type")
      .eq("user_id", user.id)
      .eq("review_id", reviewId)
      .single()
    
    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // Si vota lo mismo, eliminar el voto
        const { error } = await supabase
          .from("review_votes")
          .delete()
          .eq("id", existingVote.id)
        
        if (error) {
          console.error("Error removing vote:", error)
          return NextResponse.json({ error: "Error al remover voto" }, { status: 500 })
        }
        
        return NextResponse.json({
          message: "Voto removido",
          action: "removed"
        })
      } else {
        // Si cambia el voto, actualizar
        const { error } = await supabase
          .from("review_votes")
          .update({ vote_type })
          .eq("id", existingVote.id)
        
        if (error) {
          console.error("Error updating vote:", error)
          return NextResponse.json({ error: "Error al actualizar voto" }, { status: 500 })
        }
        
        return NextResponse.json({
          message: "Voto actualizado",
          action: "updated"
        })
      }
    } else {
      // Crear nuevo voto
      const { error } = await supabase
        .from("review_votes")
        .insert({
          user_id: user.id,
          review_id: reviewId,
          vote_type
        })
      
      if (error) {
        console.error("Error creating vote:", error)
        return NextResponse.json({ error: "Error al crear voto" }, { status: 500 })
      }
      
      // Crear notificación para el autor de la review
      if (vote_type === "like") {
        await supabase
          .from("notifications")
          .insert({
            user_id: review.user_id,
            notification_type: "review_liked",
            title: "Tu review recibió un like",
            message: `Alguien encontró útil tu review`,
            action_url: `/reviews/${reviewId}`,
            metadata: {
              review_id: reviewId,
              voter_id: user.id
            }
          })
      }
      
      return NextResponse.json({
        message: "Voto creado",
        action: "created"
      })
    }
    
  } catch (error) {
    console.error("Error in POST vote:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    
    const reviewId = params.id
    
    // Obtener el voto del usuario actual
    const { data: userVote } = await supabase
      .from("review_votes")
      .select("vote_type")
      .eq("user_id", user.id)
      .eq("review_id", reviewId)
      .single()
    
    // Obtener estadísticas de la review
    const { data: review } = await supabase
      .from("coupon_reviews")
      .select("is_helpful_count, is_not_helpful_count")
      .eq("id", reviewId)
      .single()
    
    return NextResponse.json({
      userVote: userVote?.vote_type || null,
      stats: {
        likes: review?.is_helpful_count || 0,
        dislikes: review?.is_not_helpful_count || 0
      }
    })
    
  } catch (error) {
    console.error("Error in GET vote:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
