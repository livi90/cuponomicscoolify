"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Users,
  ShoppingBag,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Gift,
  MessageSquare,
} from "lucide-react"
import { t } from "@/lib/i18n"
import Head from "next/head"
import { useState } from "react"
import Script from "next/script"

function getLocale() {
  if (typeof window !== "undefined" && window.navigator) {
    return window.navigator.language.split("-")[0] || "es"
  }
  return "es"
}

export default function HomePage() {
  const locale = getLocale()
  const seoKeywords = [
    t(locale, "seo.cuponomics"),
    t(locale, "seo.blackfriday"),
    t(locale, "seo.cybermonday"),
    t(locale, "seo.hotsale"),
    t(locale, "seo.primeday"),
    t(locale, "seo.buenfin"),
    t(locale, "seo.singlesday"),
    t(locale, "seo.navidad") || t(locale, "seo.christmas") || t(locale, "seo.noel") || t(locale, "seo.natal"),
    t(locale, "seo.rebajas") || t(locale, "seo.sales") || t(locale, "seo.soldes") || t(locale, "seo.rabatte") || t(locale, "seo.saldos"),
    t(locale, "seo.ofertas") || t(locale, "seo.deals") || t(locale, "seo.offres") || t(locale, "seo.angebote"),
    t(locale, "seo.cupones") || t(locale, "seo.coupons") || t(locale, "seo.cupons") || t(locale, "seo.gutscheine")
  ].filter(Boolean).join(", ")

  const [showFreeAccessNotice, setShowFreeAccessNotice] = useState(true)

  return (
    <>
      <Head>
        <title>{t(locale, "home.title")}</title>
        <meta name="description" content={t(locale, "home.description")} />
        <meta name="keywords" content={seoKeywords} />
        <meta property="og:title" content={t(locale, "home.title")} />
        <meta property="og:description" content={t(locale, "home.description")} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale} />
        <meta name="twitter:title" content={t(locale, "home.title")} />
        <meta name="twitter:description" content={t(locale, "home.description")} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-orange-100 via-orange-50 to-yellow-50 text-gray-900">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative container mx-auto px-4 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-orange-200/50 text-orange-800 border-orange-300 hover:bg-orange-300">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Próximamente plataforma #1 de Cupones
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight font-genty text-orange-600">
                    {t(locale, "home.title")}
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
                    {t(locale, "home.description")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/buscar-ofertas">
                    <Button
                      size="lg"
                      className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-4 text-lg"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      Buscar Ofertas
                    </Button>
                  </Link>
                  <Link href="/para-comerciantes">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-900 text-gray-900 hover:bg-white/10 font-semibold px-8 py-4 text-lg bg-transparent"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Para Comerciantes
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">1.2K+</div>
                    <div className="text-gray-600 text-sm">Usuarios Activos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">1K+</div>
                    <div className="text-gray-600 text-sm">Cupones Verificados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">$9K+</div>
                    <div className="text-gray-600 text-sm">Ahorros Generados</div>
                  </div>
                </div>
                {/* SEO: Días de ofertas famosos */}
                <div className="pt-4 flex flex-wrap gap-2">
                  {seoKeywords.split(", ").map((kw) => (
                    <span key={kw} className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold border border-orange-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <img
                    src="/gifs/compra-como-siempre.gif"
                    alt="Compra como siempre y Cuponomics te ayudará a ahorrar"
                    className="w-full rounded-lg shadow-2xl"
                    loading="eager"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Aviso de acceso libre a las ofertas (cerrable) */}
        {showFreeAccessNotice && (
          <section className="w-full bg-green-50 border border-green-200 rounded-lg p-4 my-6 text-center relative">
            <button
              className="absolute top-2 right-2 text-green-700 hover:text-green-900 text-xl font-bold"
              aria-label="Cerrar aviso"
              onClick={() => setShowFreeAccessNotice(false)}
            >
              ×
            </button>
            <span className="text-green-800 font-semibold text-lg">
              ¡No necesitas estar registrado para usar las ofertas de Cuponomics! Disfruta y ahorra sin crear cuenta.
            </span>
          </section>
        )}

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
                <Target className="w-4 h-4 mr-2" />
                Cómo Funciona
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 font-genty">Ahorra en 3 simples pasos</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nuestra plataforma te conecta con las mejores ofertas verificadas por la comunidad
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <img
                      src="/gifs/encuentra-mejores-ofertas.gif"
                      alt="Encuentra las mejores ofertas verificadas por la comunidad"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      loading="lazy"
                    />
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-orange-600">1</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Encuentra las mejores ofertas</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Descubre cupones verificados por nuestra comunidad en miles de tiendas online
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <img
                      src="/gifs/navega-y-compra.gif"
                      alt="Navega y compra en tus tiendas favoritas"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      loading="lazy"
                    />
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-yellow-600">2</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Navega y compra</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Compra normalmente en tus tiendas favoritas mientras nosotros aplicamos los descuentos
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <img
                      src="/gifs/ahorra-automaticamente.gif"
                      alt="Ahorra automáticamente en cada compra"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      loading="lazy"
                    />
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-green-600">3</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Ahorra automáticamente</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Recibe tus descuentos automáticamente y comparte tu experiencia con la comunidad
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Community Features Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Comunidad
                  </Badge>
                  <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 font-genty">
                    Califica y comparte tus experiencias
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Únete a nuestra comunidad de ahorradores inteligentes. Comparte reseñas, califica cupones y ayuda a
                    otros a encontrar las mejores ofertas.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Sistema de calificaciones</h4>
                      <p className="text-gray-600">Califica cupones y tiendas para ayudar a la comunidad</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Verificación comunitaria</h4>
                      <p className="text-gray-600">Todos los cupones son verificados por usuarios reales</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Recompensas por participar</h4>
                      <p className="text-gray-600">Gana puntos y beneficios por contribuir a la comunidad</p>
                    </div>
                  </div>
                </div>

                <Link href="/calificar-cupones">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Users className="w-5 h-5 mr-2" />
                    Únete a la Comunidad
                  </Button>
                </Link>
              </div>

              <div className="relative">
                <img
                  src="/gifs/califica-y-comparte.gif"
                  alt="Califica y comparte tus experiencias con la comunidad"
                  className="w-full rounded-2xl shadow-2xl"
                  loading="lazy"
                />
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-400 rounded-full opacity-20 animate-bounce"></div>
              </div>
            </div>
          </div>
        </section>

        {/* For Merchants Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <img
                  src="/gifs/para-comerciantes.gif"
                  alt="Para comerciantes: registra tu tienda y aumenta tus ventas"
                  className="w-full rounded-2xl shadow-2xl"
                  loading="lazy"
                />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
              </div>

              <div className="space-y-8 order-1 lg:order-2">
                <div>
                  <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Para Comerciantes
                  </Badge>
                  <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 font-genty">
                    Registra tu tienda y aumenta tus ventas
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Conecta con miles de compradores activos, aumenta tu visibilidad y genera más conversiones con nuestra
                    plataforma de cupones.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Aumenta tus ventas</h4>
                      <p className="text-gray-600">Atrae más clientes con ofertas exclusivas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Alcance masivo</h4>
                      <p className="text-gray-600">Accede a nuestra base de 1.2K+ usuarios activos</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Fácil integración</h4>
                      <p className="text-gray-600">Setup rápido con nuestro sistema de tracking</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/para-comerciantes">
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Registrar Tienda
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    Ver Beneficios
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 font-genty">Números que hablan por sí solos</h2>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Únete a miles de usuarios que ya están ahorrando con Cuponomics
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl lg:text-6xl font-bold mb-2">1.2K+</div>
                <div className="text-orange-200 text-lg">Usuarios Registrados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-6xl font-bold mb-2">1K+</div>
                <div className="text-orange-200 text-lg">Cupones Verificados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-6xl font-bold mb-2">$9K+</div>
                <div className="text-orange-200 text-lg">Ahorros Generados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-6xl font-bold mb-2">75+</div>
                <div className="text-orange-200 text-lg">Tiendas Asociadas</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <Badge className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border-0 text-lg px-6 py-2">
                <Heart className="w-5 h-5 mr-2" />
                Únete a la Revolución del Ahorro
              </Badge>

              <h2 className="text-3xl lg:text-6xl font-bold text-gray-900 leading-tight font-genty">
                Comienza a ahorrar
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                  hoy mismo
                </span>
              </h2>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Descubre por qué miles de usuarios confían en Cuponomics para ahorrar en sus compras online. Es gratis,
                fácil y efectivo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link href="/buscar-ofertas">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-4 text-lg"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Buscar Ofertas Gratis
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold px-8 py-4 text-lg bg-transparent"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Crear Cuenta
                  </Button>
                </Link>
              </div>

              {/* Navegación rápida */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                <Link href="/ofertas-populares">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 text-center border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-bold text-purple-700">Ofertas Populares</h3>
                    <p className="text-sm text-purple-600">Los cupones más utilizados</p>
                  </div>
                </Link>
                <Link href="/productos-en-oferta">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 text-center border border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <ShoppingBag className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <h3 className="font-bold text-emerald-700">Productos Outlet</h3>
                    <p className="text-sm text-emerald-600">Descuentos increíbles</p>
                  </div>
                </Link>
                <Link href="/buscar-ofertas">
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 text-center border border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <Gift className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-bold text-orange-700">Todas las Ofertas</h3>
                    <p className="text-sm text-orange-600">Explora todos los cupones</p>
                  </div>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>100% Gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Sin Spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Cupones Verificados</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Script de Counter.dev */}
      <Script
        src="https://cdn.counter.dev/script.js"
        data-id="893c3e96-521c-4597-b612-f002b799687e"
        data-utcoffset="2"
        strategy="afterInteractive"
      />
    </>
  )
}
