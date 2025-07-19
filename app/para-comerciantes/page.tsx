import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Target,
  BarChart3,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  Info,
} from "lucide-react"
import Link from "next/link"

export default function ParaComerciantes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 text-orange-600 border-orange-200">
            Para Comerciantes
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Aumenta tus ventas con <span className="text-orange-500">cupones inteligentes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Únete a la red de comerciantes más grande de España. Atrae nuevos clientes, aumenta tu visibilidad y
            conversiones con Cuponomics.
          </p>

          {/* Mensaje informativo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-blue-800 font-medium">Requisito importante</p>
                <p className="text-sm text-blue-700 mt-1">
                  Para registrar tu tienda, primero debes estar registrado en la plataforma Cuponomics. Si aún no tienes
                  cuenta, créala antes de continuar.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/store-application">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6">
                Registrar mi tienda
              </Button>
            </Link>
            <Button variant="outline" className="rounded-full px-6 bg-transparent">
              Ver casos de éxito
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <p className="text-gray-600">Usuarios activos</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <ShoppingCart className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">1.2M+</div>
              <p className="text-gray-600">Cupones canjeados</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <DollarSign className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">€2.5M+</div>
              <p className="text-gray-600">Ventas generadas</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">+35%</div>
              <p className="text-gray-600">Aumento promedio</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir Cuponomics?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre las ventajas que miles de comerciantes ya están disfrutando
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Atrae nuevos clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Llega a miles de usuarios que buscan ofertas y descuentos en tu sector.</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Analytics detallados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Monitorea el rendimiento de tus cupones con métricas en tiempo real.</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Pagos seguros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Sistema de comisiones transparente con pagos puntuales y seguros.</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Configuración rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Configura tu tienda en minutos y empieza a recibir clientes hoy mismo.</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Globe className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Alcance nacional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Accede a usuarios de toda España interesados en tus productos.</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Soporte 24/7</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Equipo de soporte dedicado para ayudarte a maximizar tus resultados.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cómo funciona</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En solo 3 pasos estarás vendiendo más con Cuponomics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Regístrate</h3>
              <p className="text-gray-600">Crea tu cuenta y registra tu tienda con información básica.</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Configura cupones</h3>
              <p className="text-gray-600">Define tus ofertas, descuentos y condiciones de uso.</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Recibe clientes</h3>
              <p className="text-gray-600">Empieza a recibir nuevos clientes y aumenta tus ventas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para aumentar tus ventas?</h2>
          <p className="text-xl mb-8 opacity-90">Únete a miles de comerciantes que ya confían en Cuponomics</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/store-application">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 rounded-full px-8">
                Empezar ahora gratis
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 rounded-full px-8 bg-transparent"
            >
              Hablar con un experto
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
