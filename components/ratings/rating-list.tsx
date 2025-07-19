"use client"

import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, ThumbsDown, MessageSquare, Star, Check, X, AlertCircle } from "lucide-react"
import type { Rating } from "@/lib/types"

interface RatingListProps {
  ratings: Rating[]
  showCouponInfo?: boolean
}

export function RatingList({ ratings, showCouponInfo = false }: RatingListProps) {
  const [expandedRating, setExpandedRating] = useState<string | null>(null)

  // Si no hay valoraciones, mostrar mensaje
  if (!ratings || ratings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay valoraciones todavía</h3>
        <p className="text-gray-500 max-w-md">
          Sé el primero en valorar este cupón y ayudar a otros usuarios a decidir si funciona.
        </p>
      </div>
    )
  }

  // Ordenar valoraciones: primero las más recientes
  const sortedRatings = [...ratings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="space-y-6">
      {sortedRatings.map((rating) => (
        <Card key={rating.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={rating.user?.avatar_url || ""} alt={rating.user?.username || "Usuario"} />
                  <AvatarFallback>
                    {rating.user?.username
                      ? rating.user.username.substring(0, 2).toUpperCase()
                      : rating.user?.full_name
                        ? rating.user.full_name.substring(0, 2).toUpperCase()
                        : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {rating.user?.username || rating.user?.full_name || "Usuario anónimo"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(rating.created_at), { addSuffix: true, locale: es })}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < rating.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {showCouponInfo && rating.coupon && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="text-sm font-medium">{rating.coupon.title}</div>
                {rating.coupon.code && <div className="text-xs text-gray-500">Código: {rating.coupon.code}</div>}
              </div>
            )}

            <div className="mb-4">
              <div className="flex gap-4 mb-2">
                <Badge
                  variant={rating.worked ? "default" : "destructive"}
                  className={`flex items-center gap-1 ${rating.worked ? "bg-green-500" : ""}`}
                >
                  {rating.worked ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {rating.worked ? "Funcionó" : "No funcionó"}
                </Badge>
                {rating.amount_saved && rating.amount_saved > 0 && (
                  <Badge variant="outline" className="bg-green-50">
                    Ahorró {rating.amount_saved}€
                  </Badge>
                )}
              </div>

              {rating.comment && (
                <div
                  className={`text-gray-700 ${
                    rating.comment.length > 200 && expandedRating !== rating.id ? "line-clamp-3" : ""
                  }`}
                >
                  {rating.comment}
                </div>
              )}

              {rating.comment && rating.comment.length > 200 && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-orange-500"
                  onClick={() => setExpandedRating(expandedRating === rating.id ? null : rating.id)}
                >
                  {expandedRating === rating.id ? "Ver menos" : "Ver más"}
                </Button>
              )}
            </div>

            {rating.screenshot_url && (
              <div className="mb-4">
                <div className="relative h-48 w-full rounded-md overflow-hidden">
                  <Image
                    src={rating.screenshot_url || "/placeholder.svg"}
                    alt="Captura de pantalla"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              </div>
            )}

            {rating.votes && rating.votes.length > 0 && (
              <div className="text-sm text-gray-500">
                {rating.votes.filter((vote) => vote.vote_type === "like").length} personas encontraron útil esta
                valoración
              </div>
            )}
          </CardContent>

          <Separator />

          <CardFooter className="p-3 flex justify-between">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="text-gray-500 gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>Útil</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 gap-1">
                <ThumbsDown className="h-4 w-4" />
                <span>No útil</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500 gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Comentar</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
