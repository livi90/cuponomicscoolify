"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  XCircle,
  Calendar,
  MapPin,
  Globe,
  Users,
  Activity
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import ReviewsFeed from "@/components/social/reviews-feed"
import UserProfileCard from "@/components/social/user-profile-card"
import { toast } from "react-hot-toast"

interface UserProfile {
  id: string
  user_id: string
  display_name: string
  username: string
  avatar_url: string
  bio: string
  location: string
  website: string
  reputation_points: number
  level: number
  experience_points: number
  reviews_count: number
  helpful_reviews_count: number
  followers_count: number
  following_count: number
  created_at: string
}

interface Review {
  id: string
  rating: number
  worked: boolean
  title: string
  review_text: string
  created_at: string
  is_helpful_count: number
  is_not_helpful_count: number
  coupons: {
    code: string
    description: string
  }
  stores: {
    name: string
    logo_url: string
  }
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("reviews")

  const supabase = createClient()

  // Cargar perfil del usuario
  const loadProfile = async () => {
    try {
      setLoading(true)
      
      // Buscar perfil por username
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("username", username)
        .single()

      if (profileData) {
        setProfile(profileData)
        
        // Cargar reviews del usuario
        const { data: reviewsData } = await supabase
          .from("coupon_reviews")
          .select(`
            id,
            rating,
            worked,
            title,
            review_text,
            created_at,
            is_helpful_count,
            is_not_helpful_count,
            coupons!inner(
              code,
              description
            ),
            stores!inner(
              name,
              logo_url
            )
          `)
          .eq("user_id", profileData.user_id)
          .eq("status", "active")
          .order("created_at", { ascending: false })

        if (reviewsData) {
          setReviews(reviewsData)
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      toast.error("Error al cargar el perfil")
    } finally {
      setLoading(false)
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  // Calcular estadísticas
  const getStats = () => {
    if (!reviews.length) return null
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const avgRating = totalRating / reviews.length
    const workedCount = reviews.filter(r => r.worked).length
    const successRate = (workedCount / reviews.length) * 100
    const totalLikes = reviews.reduce((sum, review) => sum + review.is_helpful_count, 0)
    
    return {
      avgRating: avgRating.toFixed(1),
      successRate: successRate.toFixed(0),
      totalLikes,
      totalReviews: reviews.length
    }
  }

  useEffect(() => {
    if (username) {
      loadProfile()
    }
  }, [username])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Usuario no encontrado</h2>
            <p className="text-gray-500 mb-4">
              El usuario @{username} no existe o su perfil es privado.
            </p>
            <Button asChild>
              <a href="/">Volver al inicio</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header del perfil */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-2xl">
              {profile.display_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{profile.display_name}</h1>
              <Badge variant="outline" className="bg-orange-50 text-orange-600">
                Nivel {profile.level}
              </Badge>
            </div>
            <p className="text-gray-600 mb-2">@{profile.username}</p>
            {profile.bio && (
              <p className="text-gray-700 mb-3">{profile.bio}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Miembro desde {formatDate(profile.created_at)}
              </div>
              {profile.website && (
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Sitio web
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{profile.reviews_count}</div>
              <div className="text-sm text-gray-500">Reviews</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{profile.helpful_reviews_count}</div>
              <div className="text-sm text-gray-500">Útiles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.followers_count}</div>
              <div className="text-sm text-gray-500">Seguidores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{profile.following_count}</div>
              <div className="text-sm text-gray-500">Siguiendo</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Columna izquierda - Perfil y estadísticas */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Tarjeta de perfil */}
            <UserProfileCard userId={profile.user_id} showActions={true} />

            {/* Estadísticas de reviews */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Estadísticas de Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating promedio</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                      <span className="font-semibold">{stats.avgRating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tasa de éxito</span>
                    <span className="font-semibold text-green-600">{stats.successRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total de likes</span>
                    <span className="font-semibold text-blue-600">{stats.totalLikes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reviews totales</span>
                    <span className="font-semibold text-purple-600">{stats.totalReviews}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reputación */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                  <h3 className="font-semibold">Reputación</h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {profile.reputation_points}
                  </div>
                  <div className="text-sm text-gray-600">puntos de reputación</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Columna derecha - Reviews y actividad */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="reviews">Reviews ({profile.reviews_count})</TabsTrigger>
              <TabsTrigger value="activity">Actividad</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reviews">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No hay reviews aún
                    </h3>
                    <p className="text-gray-500">
                      {profile.display_name} aún no ha publicado ninguna review.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
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
                        {review.title && (
                          <h4 className="font-semibold mb-2">{review.title}</h4>
                        )}
                        <p className="text-gray-700 mb-3">{review.review_text}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{review.is_helpful_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsDown className="h-4 w-4" />
                              <span>{review.is_not_helpful_count}</span>
                            </div>
                          </div>
                          <span>{formatDate(review.created_at)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardContent className="py-12 text-center">
                  <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Actividad reciente
                  </h3>
                  <p className="text-gray-500">
                    Próximamente: Feed de actividad y logros.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
