import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Tag } from "lucide-react"

export const metadata = {
  title: "Calificar Cupones | Cuponomics",
  description: "Califica y comparte tu experiencia con cupones y ofertas en la comunidad de Cuponomics.",
}

export default function CalificarCupones() {
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
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6">
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

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Formulario de calificación</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1">
                        Tienda
                      </label>
                      <Input id="store" placeholder="Nombre de la tienda" />
                    </div>

                    <div>
                      <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                        Código o descripción de la oferta
                      </label>
                      <Input id="coupon" placeholder="Ej: DESCUENTO20 o '50% en productos seleccionados'" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">¿Funcionó el cupón?</label>
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="worked-yes"
                            name="worked"
                            className="h-4 w-4 text-orange-500 focus:ring-orange-500"
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
                            className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                          />
                          <label htmlFor="worked-no" className="ml-2 text-sm text-gray-600">
                            No
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="worked-partially"
                            name="worked"
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
                            className="text-gray-300 hover:text-orange-500 focus:outline-none"
                          >
                            <Star className="h-8 w-8" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                        Tu experiencia
                      </label>
                      <Textarea
                        id="review"
                        placeholder="Comparte los detalles de tu experiencia con este cupón o oferta..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 mb-1">
                        Captura de pantalla (opcional)
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-orange-500 hover:text-orange-600"
                            >
                              <span>Sube un archivo</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">o arrastra y suelta</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Enviar calificación</Button>
                  </form>
                </CardContent>
              </Card>

              <h2 className="text-2xl font-bold mb-6">Últimas calificaciones de la comunidad</h2>

              <Tabs defaultValue="all" className="mb-8">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="positive">Positivas</TabsTrigger>
                  <TabsTrigger value="negative">Negativas</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <div className="space-y-6">
                    {[
                      {
                        user: "María G.",
                        store: "Amazon",
                        coupon: "TECH20",
                        rating: 5,
                        worked: true,
                        comment: "¡Excelente! El cupón funcionó perfectamente y me ahorré un 20% en mi nueva tablet.",
                        date: "Hace 2 horas",
                        likes: 12,
                        dislikes: 0,
                        replies: 3,
                      },
                      {
                        user: "Carlos R.",
                        store: "Zara",
                        coupon: "Rebajas de verano",
                        rating: 4,
                        worked: true,
                        comment: "Buenos descuentos, aunque algunas tallas ya estaban agotadas.",
                        date: "Hace 5 horas",
                        likes: 8,
                        dislikes: 1,
                        replies: 2,
                      },
                      {
                        user: "Laura M.",
                        store: "MediaMarkt",
                        coupon: "TV100",
                        rating: 2,
                        worked: false,
                        comment:
                          "El cupón no funcionó para el modelo que yo quería. Solo válido para algunos televisores específicos.",
                        date: "Hace 1 día",
                        likes: 15,
                        dislikes: 2,
                        replies: 5,
                      },
                    ].map((review, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-600 font-medium">
                                {review.user.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{review.user}</div>
                                <div className="text-sm text-gray-500">{review.date}</div>
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
                              {review.store}
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
                            {review.coupon && (
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3 text-gray-400" />
                                <span className="text-sm text-gray-600">{review.coupon}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-between">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{review.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                              <ThumbsDown className="h-4 w-4" />
                              <span>{review.dislikes}</span>
                            </button>
                            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                              <MessageSquare className="h-4 w-4" />
                              <span>{review.replies} respuestas</span>
                            </button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                            Responder
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="positive">{/* Contenido similar para calificaciones positivas */}</TabsContent>
                <TabsContent value="negative">{/* Contenido similar para calificaciones negativas */}</TabsContent>
              </Tabs>

              <div className="flex justify-center mt-8">
                <Button variant="outline">Cargar más calificaciones</Button>
              </div>
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
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm">Ayudas a otros usuarios</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm">Ganas puntos de reputación</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm">Desbloqueas recompensas exclusivas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
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

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">
                <img src="/images/Cuponomics-logo.png" alt="Cuponomics Logo" style={{ height: 32, width: "auto" }} />
              </h3>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/buscar-ofertas" className="text-gray-300 hover:text-white">
                    Buscar Ofertas
                  </Link>
                </li>
                <li>
                  <Link href="/calificar-cupones" className="text-gray-300 hover:text-white">
                    Calificar Cupones
                  </Link>
                </li>
                <li>
                  <Link href="/para-comerciantes" className="text-gray-300 hover:text-white">
                    Para Comerciantes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Categorías</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Moda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Electrónica
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Hogar
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Viajes
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Alimentación
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Términos y condiciones
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Política de cookies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} <img src="/images/Cuponomics-logo.png" alt="Cuponomics Logo" style={{ display: "inline", height: 24, width: "auto", verticalAlign: "middle" }} />. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
