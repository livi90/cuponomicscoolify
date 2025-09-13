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
  Search,
  Tag,
  Filter,
  SlidersHorizontal,
} from "lucide-react"
import { t } from "@/lib/i18n"
import Head from "next/head"
import { useState } from "react"
import Script from "next/script"
import { RealTimeStats } from "@/components/stats/real-time-stats"
import { LatestOffersSection } from "@/components/latest-offers/latest-offers-section"
import { SpecialEventBanner } from "@/components/banners/special-event-banner"
import { EarlyAdoptersSection } from "@/components/early-adopters/early-adopters-section"
import ReviewsFeed from "@/components/social/reviews-feed"
import { PopularCouponsSection } from "@/components/coupons/popular-coupons-section"
import { FeaturedOffersSection } from "@/components/products/featured-offers-section"


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

  const [showInfoSection, setShowInfoSection] = useState(false)

  return (
    <>
      <Head>
        <title>Cuponomics - Comparador de Precios y Ofertas</title>
        <meta name="description" content="Encuentra y compara los mejores precios online. Cupones verificados, ofertas exclusivas y el mejor comparador de precios del mercado." />
        <meta name="keywords" content={seoKeywords} />
        <meta property="og:title" content="Cuponomics - Comparador de Precios y Ofertas" />
        <meta property="og:description" content="Encuentra y compara los mejores precios online. Cupones verificados, ofertas exclusivas y el mejor comparador de precios del mercado." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale} />
        <meta name="twitter:title" content="Cuponomics - Comparador de Precios y Ofertas" />
        <meta name="twitter:description" content="Encuentra y compara los mejores precios online. Cupones verificados, ofertas exclusivas y el mejor comparador de precios del mercado." />
      </Head>
      <div className="min-h-screen bg-white">
        {/* Banner de eventos especiales */}
        <SpecialEventBanner />
        
                        {/* Sección de Imágenes Landing - Marketplace Focus */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">

            {/* Layout Optimizado - Sin espacios vacíos */}
            <div className="space-y-6">
              {/* Fila 1: Tecnología destacada + 3 categorías pequeñas */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
                {/* Tecnología - Destacada (2 columnas) */}
                <Link href="/categorias/tecnologia" className="lg:col-span-2">
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-52 lg:h-64">
                    <div className="relative h-full">
                      <img
                        src="/Imagenes landing/1.jpg"
                        alt="Tecnología"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-2xl lg:text-3xl font-bold">Tecnología</h3>
                        <p className="text-base lg:text-lg opacity-90">Ordenadores, smartphones y gadgets</p>
                      </div>
                    </div>
                  </Card>
                </Link>

                {/* 3 categorías reorganizadas: 1 arriba, 2 abajo - Altura total igual a Tecnología */}
                <div className="lg:col-span-2 space-y-3 h-52 lg:h-64">
                  {/* Electrodomésticos - Arriba (ancho completo) */}
                  <Link href="/categorias/electrodomesticos-hogar">
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-32 lg:h-40">
                      <div className="relative h-full">
                        <img
                          src="/Imagenes landing/3.jpg"
                          alt="Electrodomésticos"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <h3 className="text-base font-semibold">Electrodomésticos</h3>
                          <p className="text-xs opacity-90">& Hogar</p>
                        </div>
                      </div>
                    </Card>
                  </Link>

                  {/* Cosméticos y Sneakers - Abajo (2 columnas) */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/categorias/cosmeticos-farmacia">
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-20 lg:h-24">
                        <div className="relative h-full">
                          <img
                            src="/Imagenes landing/4.jpg"
                            alt="Cosméticos"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                          <div className="absolute bottom-2 left-2 text-white">
                            <h3 className="text-sm font-semibold">Cosméticos</h3>
                          </div>
                        </div>
                      </Card>
                    </Link>

                    <Link href="/categorias/sneakers-zapatos">
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-20 lg:h-24">
                        <div className="relative h-full">
                          <img
                            src="/Imagenes landing/5.jpg"
                            alt="Sneakers"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                          <div className="absolute bottom-2 left-2 text-white">
                            <h3 className="text-sm font-semibold">Sneakers</h3>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Fila 2: 3 categorías medianas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/categorias/ropa-accesorios-deporte">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-40">
                    <div className="relative h-full">
                      <img
                        src="/Imagenes landing/2.jpg"
                        alt="Ropa & Deporte"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-bold">Ropa & Deporte</h3>
                        <p className="text-sm opacity-90">Moda y equipamiento deportivo</p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link href="/categorias/viajes-experiencias">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-40">
                    <div className="relative h-full">
                      <img
                        src="/Imagenes landing/6 Viajes & Experiencias.jpg"
                        alt="Viajes"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-bold">Viajes</h3>
                        <p className="text-sm opacity-90">Vacaciones y experiencias</p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link href="/categorias/supermercado-alimentacion">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-40">
                    <div className="relative h-full">
                      <img
                        src="/Imagenes landing/7. Supermercado & Alimentación.jpg"
                        alt="Supermercado"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-bold">Supermercado</h3>
                        <p className="text-sm opacity-90">Comida y productos frescos</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>

                {/* Sección de Ofertas Destacadas - Estilo Shoparize */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-genty">
                Ofertas destacadas
              </h2>
              <Link href="/comparar-precios">
                <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <FeaturedOffersSection />

            {/* Botón de llamada a la acción al estilo Shoparize */}
            <div className="text-center mt-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  ¿No encuentras lo que buscas?
                </h3>
                <p className="text-gray-600 mb-6">
                  Explora miles de ofertas más en nuestras categorías especializadas y encuentra los mejores precios del mercado.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/buscar-ofertas">
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Ver otras ofertas
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/categorias">
                    <Button variant="outline" size="lg" className="border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3">
                      <Filter className="w-5 h-5 mr-2" />
                      Explorar categorías
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Cupones Populares */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-genty">
                Cupones más utilizados
              </h2>
              <Link href="/buscar-ofertas">
                <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                  Ver todos los cupones
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <PopularCouponsSection />
          </div>
        </section>

        {/* Últimas Ofertas Destacadas */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <LatestOffersSection />
          </div>
        </section>

        {/* Barra Inferior - Información sobre la plataforma (colapsable) */}
        <section className="bg-gray-50 border-t">
          <div className="container mx-auto px-4">
            <div className="py-6">
              <button
                onClick={() => setShowInfoSection(!showInfoSection)}
                className="w-full flex items-center justify-between text-left text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors"
              >
                <span>💡 ¿Qué es Cuponomics? Conoce más sobre nuestra plataforma</span>
                <ArrowRight className={`w-5 h-5 transition-transform ${showInfoSection ? 'rotate-90' : ''}`} />
              </button>
              </div>

            {showInfoSection && (
              <div className="border-t border-gray-200 py-8 animate-fade-in-up">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Cómo funciona */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-orange-600">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Busca y compara</h4>
                          <p className="text-sm text-gray-600">Encuentra los mejores precios en tiempo real</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-orange-600">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Aplica cupones</h4>
                          <p className="text-sm text-gray-600">Usa códigos verificados por la comunidad</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-orange-600">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Ahorra dinero</h4>
                          <p className="text-sm text-gray-600">Obtén los mejores descuentos disponibles</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Para comerciantes */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Para Comerciantes</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Aumenta tu visibilidad online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Atrae más clientes con ofertas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Integración fácil y rápida</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Analytics y seguimiento detallado</span>
                      </div>
                    </div>
                    <Link href="/para-comerciantes">
                      <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Registrar Tienda
                      </Button>
                </Link>
                  </div>

                  {/* Estadísticas y comunidad */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Nuestra Comunidad</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Cupones verificados</span>
                        <span className="font-semibold text-gray-900">1,200+</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tiendas asociadas</span>
                        <span className="font-semibold text-gray-900">500+</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Usuarios activos</span>
                        <span className="font-semibold text-gray-900">50K+</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ahorros generados</span>
                        <span className="font-semibold text-orange-600">€2.5M+</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link href="/calificar-cupones">
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4 mr-2" />
                          Calificar Cupones
                        </Button>
                </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
