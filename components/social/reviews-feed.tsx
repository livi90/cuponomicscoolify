"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Tag, 
  Award,
  TrendingUp,
  Heart,
  CheckCircle,
  XCircle
} from "lucide-react"
import { toast } from "react-hot-toast"

interface Review {
  id: string
  rating: number
  worked: boolean
  worked_partially: boolean
  title: string
  review_text: string
  pros: string
  cons: string
  purchase_amount: number
  savings_amount: number
  created_at: string
  is_helpful_count: number
  is_not_helpful_count: number
  user_profiles: {
    display_name: string
    username: string
    avatar_url: string
    reputation_points: number
    level: number
  }
  coupons: {
    code: string
    description: string
    discount_type: string
    discount_value: number
  }
  stores: {
    name: string
    logo_url: string
  }
}

interface ReviewsFeedProps {
  limit?: number
  showHeader?: boolean
  filter?: "all" | "positive" | "negative"
}

export default function ReviewsFeed({ 
  limit = 5, 
  showHeader = true, 
  filter = "all" 
}: ReviewsFeedProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)

  // Cargar reviews
  const loadReviews = async () => {
    try {
      setLoading(true)
      
      let url = `/api/reviews?page=1&limit=${limit}&sort=created_at&order=desc`
      
      if (filter === "positive") {
        url += "&worked=true"
      } else if (filter === "negative") {
        url += "&worked=false"
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      setReviews(data.reviews || [])
      
    } catch (error) {
      console.error("Error loading reviews:", error)
      toast.error("Error al cargar reviews")
    } finally {
      setLoading(false)
    }
  }

  // Manejar voto
  const handleVote = async (reviewId: string, voteType: "like" | "dislike") => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote_type: voteType })
      })
      
      if (response.ok) {
        // Recargar reviews para actualizar contadores
        loadReviews()
        toast.success("Voto registrado")
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al votar")
      }
    } catch (error) {
      console.error("Error voting:", error)
      toast.error("Error al votar")
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Hace unos minutos"
    if (diffInHours < 24) return `Hace ${diffInHours} horas`
    if (diffInHours < 48) return "Ayer"
    return date.toLocaleDateString()
  }

  // Obtener nivel de reputación
  const getReputationLevel = (points: number) => {
    if (points >= 1000) return { level: "Legendario", color: "text-purple-600" }
    if (points >= 500) return { level: "Experto", color: "text-blue-600" }
    if (points >= 100) return { level: "Avanzado", color: "text-green-600" }
    if (points >= 50) return { level: "Intermedio", color: "text-yellow-600" }
    return { level: "Novato", color: "text-gray-600" }
  }

  useEffect(() => {
    loadReviews()
  }, [limit, filter])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Reviews de la comunidad</h2>
          <Button variant="outline" size="sm" asChild>
            <a href="/calificar-cupones">Ver todas</a>
          </Button>
        </div>
      )}

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No hay reviews aún</p>
            <p className="text-sm text-gray-400 mb-4">
              ¡Sé el primero en calificar un cupón y ayudar a la comunidad!
            </p>
            <Button asChild>
              <a href="/calificar-cupones">Calificar un cupón</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const reputation = getReputationLevel(review.user_profiles.reputation_points)
            
            return (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.user_profiles.avatar_url} />
                        <AvatarFallback>
                          {review.user_profiles.display_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {review.user_profiles.display_name || "Usuario"}
                          </span>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className={`text-xs font-medium ${reputation.color}`}>
                              {reputation.level}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(review.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "text-orange-500 fill-orange-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="bg-gray-50">
                      {review.stores.name}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${
                        review.worked
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      {review.worked ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {review.worked ? "Funcionó" : "No funcionó"}
                    </Badge>
                    {review.coupons.code && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600 font-mono">
                          {review.coupons.code}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {review.title && (
                    <h4 className="font-semibold mb-2 text-lg">{review.title}</h4>
                  )}
                  
                  <p className="text-gray-700 mb-3 line-clamp-3">
                    {review.review_text}
                  </p>
                  
                  {(review.pros || review.cons) && (
                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                      {review.pros && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h5 className="font-medium text-green-800 mb-1 text-sm">Pros</h5>
                          <p className="text-sm text-green-700 line-clamp-2">{review.pros}</p>
                        </div>
                      )}
                      {review.cons && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <h5 className="font-medium text-red-800 mb-1 text-sm">Contras</h5>
                          <p className="text-sm text-red-700 line-clamp-2">{review.cons}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {(review.purchase_amount || review.savings_amount) && (
                    <div className="flex gap-4 text-sm text-gray-600 mb-3">
                      {review.purchase_amount && (
                        <span>Compra: €{review.purchase_amount}</span>
                      )}
                      {review.savings_amount && (
                        <span className="text-green-600 font-medium">
                          <TrendingUp className="h-3 w-3 inline mr-1" />
                          Ahorro: €{review.savings_amount}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="border-t pt-3 flex justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => handleVote(review.id, "like")}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.is_helpful_count}</span>
                    </button>
                    <button 
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => handleVote(review.id, "dislike")}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>{review.is_not_helpful_count}</span>
                    </button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Responder
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
