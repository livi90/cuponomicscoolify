import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import UniversalTrackingManager from "@/components/tracking/universal-tracking-manager"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, Shield, TrendingUp, Globe, CheckCircle, ArrowRight } from "lucide-react"

export default async function TrackingUniversalPage() {
  const supabase = await createClient()

  // Verificar autenticación
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect("/login")
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "merchant") {
    redirect("/dashboard")
  }

  // Obtener tiendas del merchant
  const { data: stores } = await supabase.from("stores").select("*").eq("owner_id", user.id).eq("is_active", true)

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header con información del Sistema Universal */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tracking Universal</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Recomendado
              </Badge>
              <Badge variant="secondary">Nuevo Sistema</Badge>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-lg max-w-4xl">
          El Sistema Universal de Tracking es nuestra solución más avanzada para monitorear conversiones 
          en cualquier plataforma de e-commerce. Detecta automáticamente tu plataforma y proporciona 
          tracking preciso con protección contra fraude.
        </p>
      </div>

      {/* Alertas informativas */}
      <div className="grid gap-4 mb-8">
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Seguridad Avanzada:</strong> El Sistema Universal incluye detección de fraude, 
            fingerprinting avanzado y protección contra bots automáticamente.
          </AlertDescription>
        </Alert>
        
        <Alert className="border-green-200 bg-green-50">
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            <strong>Mejor Rendimiento:</strong> Hasta 40% más preciso que el sistema anterior, 
            con mejor atribución de conversiones y datos más detallados.
          </AlertDescription>
        </Alert>
      </div>

      {/* Beneficios del Sistema Universal */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Compatibilidad Universal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Funciona automáticamente con Shopify, WooCommerce, Magento, PrestaShop, 
              BigCommerce y cualquier plataforma personalizada.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <CardTitle className="text-lg">Instalación Simple</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Una sola línea de código. Detecta automáticamente tu plataforma y 
              se configura por sí mismo sin intervención manual.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <CardTitle className="text-lg">Protección Avanzada</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Detección de fraude en tiempo real, fingerprinting avanzado y 
              protección contra bots y clicks falsos.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparación con Sistema Legacy */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            ¿Por qué migrar al Sistema Universal?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Sistema Legacy (Actual)</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Script específico por plataforma
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Configuración manual requerida
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Tracking básico sin fingerprinting
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Detección de fraude limitada
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-700 mb-3">Sistema Universal (Nuevo)</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Un solo script para todas las plataformas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Detección automática de plataforma
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Fingerprinting avanzado incluido
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Detección de fraude en tiempo real
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestor del Sistema Universal */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Configurar Tracking Universal</h2>
        <UniversalTrackingManager stores={stores || []} />
      </div>

      {/* Información adicional */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">¿Necesitas ayuda?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Documentación Completa</h4>
              <p className="text-sm text-gray-600 mb-3">
                Guías detalladas para cada plataforma con ejemplos de código y 
                instrucciones paso a paso.
              </p>
              <a 
                href="/docs/universal-tracking-installation-guide.md" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver guía completa →
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Soporte Técnico</h4>
              <p className="text-sm text-gray-600 mb-3">
                Nuestro equipo está disponible para ayudarte con la instalación 
                y configuración del sistema.
              </p>
                             <a 
                 href="mailto:soporte@cuponomics.app" 
                 className="text-blue-600 hover:text-blue-800 text-sm font-medium"
               >
                 Contactar soporte →
               </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
