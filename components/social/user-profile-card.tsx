"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Award,
  TrendingUp,
  Star,
  Heart,
  Users,
  Calendar,
  Trophy,
  Crown,
  Zap,
  Target
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  display_name: string
  username: string
  avatar_url: string
  bio: string
  location: string
  reputation_points: number
  level: number
  experience_points: number
  reviews_count: number
  helpful_reviews_count: number
  followers_count: number
  following_count: number
  created_at: string
}

interface Badge {
  id: string
  name: string
  display_name: string
  description: string
  icon_url: string
  color: string
  rarity: string
}

interface UserProfileCardProps {
  userId?: string
  showActions?: boolean
}

export default function UserProfileCard({ userId, showActions = true }: UserProfileCardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  const supabase = createClient()

  // Cargar perfil del usuario
  const loadProfile = async () => {
    try {
      setLoading(true)
      
      // Si no se proporciona userId, usar el usuario actual
      let targetUserId = userId
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        targetUserId = user.id
      }

      // Cargar perfil
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", targetUserId)
        .single()

      if (profileData) {
        setProfile(profileData)
        
        // Cargar badges del usuario
        const { data: badgesData } = await supabase
          .from("user_badges")
          .select(`
            badges(
              id,
              name,
              display_name,
              description,
              icon_url,
              color,
              rarity
            )
          `)
          .eq("user_id", targetUserId)

        if (badgesData) {
          setBadges(badgesData.map(item => item.badges))
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  // Manejar seguir/dejar de seguir
  const handleFollow = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !profile) return

      if (isFollowing) {
        // Dejar de seguir
        await supabase
          .from("user_follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", profile.id)
      } else {
        // Seguir
        await supabase
          .from("user_follows")
          .insert({
            follower_id: user.id,
            following_id: profile.id
          })
      }

      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error("Error following/unfollowing:", error)
    }
  }

  // Obtener nivel de reputación
  const getReputationLevel = (points: number) => {
    if (points >= 1000) return { 
      level: "Legendario", 
      color: "text-purple-600",
      icon: Crown,
      bgColor: "bg-purple-100"
    }
    if (points >= 500) return { 
      level: "Experto", 
      color: "text-blue-600",
      icon: Trophy,
      bgColor: "bg-blue-100"
    }
    if (points >= 100) return { 
      level: "Avanzado", 
      color: "text-green-600",
      icon: Award,
      bgColor: "bg-green-100"
    }
    if (points >= 50) return { 
      level: "Intermedio", 
      color: "text-yellow-600",
      icon: Star,
      bgColor: "bg-yellow-100"
    }
    return { 
      level: "Novato", 
      color: "text-gray-600",
      icon: Target,
      bgColor: "bg-gray-100"
    }
  }

  // Calcular experiencia para el siguiente nivel
  const getNextLevelExp = (currentLevel: number) => {
    return currentLevel * 100
  }

  // Obtener color de rareza
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-purple-600 bg-purple-100"
      case "epic": return "text-blue-600 bg-blue-100"
      case "rare": return "text-green-600 bg-green-100"
      case "uncommon": return "text-yellow-600 bg-yellow-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  useEffect(() => {
    loadProfile()
  }, [userId])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Perfil no encontrado</p>
        </CardContent>
      </Card>
    )
  }

  const reputation = getReputationLevel(profile.reputation_points)
  const ReputationIcon = reputation.icon
  const nextLevelExp = getNextLevelExp(profile.level + 1)
  const expProgress = (profile.experience_points / nextLevelExp) * 100

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-lg">
                {profile.display_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold">{profile.display_name || "Usuario"}</h3>
                <Badge className={`${reputation.bgColor} ${reputation.color} border-0`}>
                  <ReputationIcon className="h-3 w-3 mr-1" />
                  {reputation.level}
                </Badge>
              </div>
              {profile.username && (
                <p className="text-gray-500 text-sm">@{profile.username}</p>
              )}
              {profile.location && (
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {profile.location}
                </p>
              )}
            </div>
          </div>
          {showActions && (
            <Button 
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              onClick={handleFollow}
            >
              {isFollowing ? "Siguiendo" : "Seguir"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Bio */}
        {profile.bio && (
          <div>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{profile.reviews_count}</div>
            <div className="text-sm text-gray-500">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{profile.helpful_reviews_count}</div>
            <div className="text-sm text-gray-500">Útiles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{profile.followers_count}</div>
            <div className="text-sm text-gray-500">Seguidores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{profile.following_count}</div>
            <div className="text-sm text-gray-500">Siguiendo</div>
          </div>
        </div>

        {/* Nivel y experiencia */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Nivel {profile.level}</span>
            <span className="text-gray-500">
              {profile.experience_points} / {nextLevelExp} XP
            </span>
          </div>
          <Progress value={expProgress} className="h-2" />
          <p className="text-xs text-gray-500">
            {nextLevelExp - profile.experience_points} XP para el siguiente nivel
          </p>
        </div>

        {/* Reputación */}
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-orange-600" />
          <div>
            <div className="font-semibold text-orange-800">{profile.reputation_points} puntos</div>
            <div className="text-sm text-orange-600">de reputación</div>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Logros ({badges.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-2 rounded-lg text-center ${getRarityColor(badge.rarity)}`}
                  title={badge.description}
                >
                  <div className="text-xs font-medium">{badge.display_name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fecha de registro */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Miembro desde {new Date(profile.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}
