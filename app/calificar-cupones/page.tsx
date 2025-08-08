"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Tag, 
  Upload,
  CheckCircle,
  AlertTriangle,
  Heart,
  User,
  Award,
  TrendingUp
} from "lucide-react"
import { toast } from "react-hot-toast"
import { createClient } from "@/lib/supabase/client"

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
  screenshot_url: string
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

interface Coupon {
  id: string
  code: string
  description: string
  discount_type: string
  discount_value: number
  stores: {
    id: string
    name: string
    logo_url: string
  } | null
}

export default function CalificarCupones() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  // Formulario de calificación
  const [formData, setFormData] = useState({
    coupon_id: "",
    store_id: "",
    rating: 0,
    worked: null as boolean | null,
    worked_partially: false,
    title: "",
    review_text: "",
    pros: "",
    cons: "",
    purchase_amount: "",
    savings_amount: "",
    screenshot_url: ""
  })

  const supabase = createClient()

  // Cargar reviews
  const loadReviews = async (pageNum = 1, filter = "all") => {
    try {
      setLoading(true)
      
      let url = `/api/reviews?page=${pageNum}&limit=10&sort=created_at&order=desc`
      
      if (filter === "positive") {
        url += "&worked=true"
      } else if (filter === "negative") {
        url += "&worked=false"
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (pageNum === 1) {
        setReviews(data.reviews || [])
      } else {
        setReviews(prev => [...prev, ...(data.reviews || [])])
      }
      
      // Manejar paginación de forma segura
      if (data.pagination) {
        setHasMore(data.pagination.page < data.pagination.totalPages)
      } else {
        setHasMore(false)
      }
      setPage(pageNum)
      
    } catch (error) {
      console.error("Error loading reviews:", error)
      toast.error("Error al cargar reviews")
    } finally {
      setLoading(false)
    }
  }

  // Cargar cupones disponibles
  const loadCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select(`
          id,
          code,
          description,
          discount_type,
          discount_value,
          stores(
            id,
            name,
            logo_url
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(50)
      
      if (error) throw error
      setCoupons(data?.map(coupon => ({
        ...coupon,
        stores: coupon.stores?.[0] || null // Manejar caso donde no hay tienda
      })) || [])
    } catch (error) {
      console.error("Error loading coupons:", error)
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
        loadReviews(1, activeTab)
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

  // Enviar calificación
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.coupon_id || !formData.rating || formData.worked === null) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }
    
    try {
      setSubmitting(true)
      
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          purchase_amount: formData.purchase_amount ? parseFloat(formData.purchase_amount) : null,
          savings_amount: formData.savings_amount ? parseFloat(formData.savings_amount) : null
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success("¡Review enviada exitosamente!")
        
        // Limpiar formulario
        setFormData({
          coupon_id: "",
          store_id: "",
          rating: 0,
          worked: null,
          worked_partially: false,
          title: "",
          review_text: "",
          pros: "",
          cons: "",
          purchase_amount: "",
          savings_amount: "",
          screenshot_url: ""
        })
        
        // Recargar reviews
        loadReviews(1, activeTab)
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al enviar review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Error al enviar review")
    } finally {
      setSubmitting(false)
    }
  }

  // Manejar cambio de cupón
  const handleCouponChange = (couponId: string) => {
    const coupon = coupons.find(c => c.id === couponId)
    if (coupon) {
      setFormData(prev => ({
        ...prev,
        coupon_id: couponId,
        store_id: coupon.stores?.id || ""
      }))
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    loadReviews(1, activeTab)
    loadCoupons()
  }, [activeTab])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-orange-50 to-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 font-genty">
                Ayuda a la comunidad calificando cupones
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Tu experiencia es valiosa. Comparte tus opiniones sobre cupones y ofertas para ayudar a otros usuarios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6"
                  onClick={() => document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Calificar un cupón
                </Button>
                <Button variant="outline" className="rounded-full px-8 py-6">
                  Ver mis calificaciones
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold mb-6">Califica un cupón o oferta</h2>

              <Card className="mb-8" id="review-form">
                <CardHeader>
                  <CardTitle>Formulario de calificación</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                        Seleccionar cupón
                      </label>
                      <select
                        id="coupon"
                        value={formData.coupon_id}
                        onChange={(e) => handleCouponChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      >
                        <option value="">Selecciona un cupón...</option>
                        {coupons.map((coupon) => (
                          <option key={coupon.id} value={coupon.id}>
                            {coupon.code} - {coupon.stores?.name || "Tienda"} ({coupon.discount_value}% {coupon.discount_type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">¿Funcionó el cupón?</label>
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="worked-yes"
                            name="worked"
                            value="true"
                            checked={formData.worked === true}
                            onChange={(e) => setFormData(prev => ({ ...prev, worked: e.target.value === "true" }))}
                            className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                            required
                          />
                          <label htmlFor="worked-yes" className="ml-2 text-sm text-gray-600">
                            Sí
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="worked-no"
                            name="worked"
                            value="false"
                            checked={formData.worked === false}
                            onChange={(e) => setFormData(prev => ({ ...prev, worked: e.target.value === "true" }))}
                            className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                            required
                          />
                          <label htmlFor="worked-no" className="ml-2 text-sm text-gray-600">
                            No
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="worked-partially"
                            checked={formData.worked_partially}
                            onChange={(e) => setFormData(prev => ({ ...prev, worked_partially: e.target.checked }))}
                            className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                          />
                          <label htmlFor="worked-partially" className="ml-2 text-sm text-gray-600">
                            Parcialmente
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, rating }))}
                            className={`text-gray-300 hover:text-orange-500 focus:outline-none ${
                              formData.rating >= rating ? "text-orange-500" : ""
                            }`}
                          >
                            <Star className="h-8 w-8" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Título de tu review
                      </label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Resumen de tu experiencia..."
                      />
                    </div>

                    <div>
                      <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                        Tu experiencia
                      </label>
                      <Textarea
                        id="review"
                        value={formData.review_text}
                        onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
                        placeholder="Comparte los detalles de tu experiencia con este cupón o oferta..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="pros" className="block text-sm font-medium text-gray-700 mb-1">
                          Pros
                        </label>
                        <Textarea
                          id="pros"
                          value={formData.pros}
                          onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
                          placeholder="¿Qué te gustó?"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label htmlFor="cons" className="block text-sm font-medium text-gray-700 mb-1">
                          Contras
                        </label>
                        <Textarea
                          id="cons"
                          value={formData.cons}
                          onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
                          placeholder="¿Qué no te gustó?"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="purchase_amount" className="block text-sm font-medium text-gray-700 mb-1">
                          Monto de la compra (€)
                        </label>
                        <Input
                          id="purchase_amount"
                          type="number"
                          step="0.01"
                          value={formData.purchase_amount}
                          onChange={(e) => setFormData(prev => ({ ...prev, purchase_amount: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label htmlFor="savings_amount" className="block text-sm font-medium text-gray-700 mb-1">
                          Ahorro obtenido (€)
                        </label>
                        <Input
                          id="savings_amount"
                          type="number"
                          step="0.01"
                          value={formData.savings_amount}
                          onChange={(e) => setFormData(prev => ({ ...prev, savings_amount: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={submitting}
                    >
                      {submitting ? "Enviando..." : "Enviar calificación"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <h2 className="text-2xl font-bold mb-6">Últimas calificaciones de la comunidad</h2>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="positive">Positivas</TabsTrigger>
                  <TabsTrigger value="negative">Negativas</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab}>
                  <div className="space-y-6">
                    {reviews.length === 0 && !loading ? (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          No hay reviews aún. ¡Sé el primero en calificar un cupón!
                        </AlertDescription>
                      </Alert>
                    ) : (
                      reviews.map((review) => (
                        <Card key={review.id}>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-600 font-medium">
                                  {review.user_profiles?.display_name?.charAt(0) || "U"}
                                </div>
                                <div>
                                  <div className="font-medium">{review.user_profiles?.display_name || "Usuario"}</div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Award className="h-4 w-4 text-yellow-500" />
                                  <span className="text-sm text-gray-600">Nivel {review.user_profiles?.level || 1}</span>
                                </div>
                              </div>
                              <div className="flex items-center">
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
                                {review.stores?.name || "Tienda"}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`${
                                  review.worked
                                    ? "bg-green-50 text-green-600 border-green-200"
                                    : "bg-red-50 text-red-600 border-red-200"
                                }`}
                              >
                                {review.worked ? "Funcionó" : "No funcionó"}
                              </Badge>
                              {review.coupons?.code && (
                                <div className="flex items-center gap-1">
                                  <Tag className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm text-gray-600">{review.coupons.code}</span>
                                </div>
                              )}
                            </div>
                            {review.title && (
                              <h4 className="font-semibold mb-2">{review.title}</h4>
                            )}
                            <p className="text-gray-700 mb-3">{review.review_text}</p>
                            
                            {(review.pros || review.cons) && (
                              <div className="grid md:grid-cols-2 gap-4 mb-3">
                                {review.pros && (
                                  <div className="bg-green-50 p-3 rounded-lg">
                                    <h5 className="font-medium text-green-800 mb-1">Pros</h5>
                                    <p className="text-sm text-green-700">{review.pros}</p>
                                  </div>
                                )}
                                {review.cons && (
                                  <div className="bg-red-50 p-3 rounded-lg">
                                    <h5 className="font-medium text-red-800 mb-1">Contras</h5>
                                    <p className="text-sm text-red-700">{review.cons}</p>
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
                                  <span className="text-green-600">Ahorro: €{review.savings_amount}</span>
                                )}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="border-t pt-3 flex justify-between">
                            <div className="flex items-center gap-4">
                              <button 
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                                onClick={() => handleVote(review.id, "like")}
                              >
                                <ThumbsUp className="h-4 w-4" />
                                <span>{review.is_helpful_count}</span>
                              </button>
                              <button 
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                                onClick={() => handleVote(review.id, "dislike")}
                              >
                                <ThumbsDown className="h-4 w-4" />
                                <span>{review.is_not_helpful_count}</span>
                              </button>
                            </div>
                            <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                              Responder
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => loadReviews(page + 1, activeTab)}
                    disabled={loading}
                  >
                    {loading ? "Cargando..." : "Cargar más calificaciones"}
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4">Guía para calificar</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-orange-100 rounded-full h-8 w-8 flex items-center justify-center text-orange-500 font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Sé específico</h4>
                      <p className="text-sm text-gray-600">
                        Incluye detalles sobre tu experiencia con el cupón o la oferta.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-orange-100 rounded-full h-8 w-8 flex items-center justify-center text-orange-500 font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Sé honesto</h4>
                      <p className="text-sm text-gray-600">
                        Tu opinión sincera ayuda a otros usuarios a tomar mejores decisiones.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-orange-100 rounded-full h-8 w-8 flex items-center justify-center text-orange-500 font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Incluye pruebas</h4>
                      <p className="text-sm text-gray-600">
                        Si es posible, adjunta capturas de pantalla que respalden tu experiencia.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-orange-100 rounded-full h-8 w-8 flex items-center justify-center text-orange-500 font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Sé respetuoso</h4>
                      <p className="text-sm text-gray-600">
                        Mantén un tono constructivo incluso si tu experiencia fue negativa.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t mt-6 pt-6">
                  <h3 className="text-lg font-bold mb-4">Beneficios de calificar</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 rounded-full p-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-sm">Ayudas a otros usuarios</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 rounded-full p-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-sm">Ganas puntos de reputación</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 rounded-full p-1">
                        <Award className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-sm">Desbloqueas recompensas exclusivas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 rounded-full p-1">
                        <Heart className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-sm">Contribuyes a una comunidad más transparente</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
