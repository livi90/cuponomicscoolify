import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Webhook, 
  Zap, 
  Shield, 
  Globe, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  ExternalLink
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import WebhookManager from "@/components/tracking/webhook-manager"
import UniversalTrackingManager from "@/components/tracking/universal-tracking-manager"
import { RecommendedBadge } from "@/components/ui/recommended-badge"

export default async function TrackingHybridPage() {
  const supabase = await createClient()
  
  // Verificar autenticación
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Obtener tiendas del usuario
  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema Híbrido de Tracking</h1>
          <p className="text-muted-foreground">
            Combina webhooks y scripts para máxima precisión y simplicidad
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Sistema Recomendado
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Híbrido
          </Badge>
        </div>
      </div>

      {/* Descripción del sistema */}
      <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <Globe className="h-4 w-4" />
        <AlertDescription>
          <strong>Sistema Híbrido de Tracking</strong> - La mejor solución que combina la simplicidad de los webhooks 
          con la precisión de los scripts. Usa webhooks para casos simples y scripts para casos complejos, 
          garantizando tracking del 100% de tus conversiones.
        </AlertDescription>
      </Alert>

      {/* Tarjetas de información */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Webhook className="w-5 h-5" />
              Webhooks (Simple)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Sin instalación de código
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% confiable
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Datos completos automáticos
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Ideal para tiendas grandes
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Zap className="w-5 h-5" />
              Scripts (Preciso)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                Atribución avanzada
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                Fingerprinting único
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                Detección de fraude
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                Ideal para casos complejos
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Shield className="w-5 h-5" />
              Híbrido (Completo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                Lo mejor de ambos mundos
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                100% de conversiones
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                Máxima precisión
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                Fácil de configurar
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para configurar ambos sistemas */}
      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="w-4 h-4" />
            Webhooks
            <RecommendedBadge />
          </TabsTrigger>
          <TabsTrigger value="scripts" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Scripts Universal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Sistema de Webhooks (Recomendado)</h3>
            </div>
            <p className="text-sm text-green-700">
              Configura webhooks para tracking automático sin necesidad de instalar código en tu tienda. 
              Es la opción más simple y confiable para la mayoría de casos.
            </p>
          </div>
          
          <Suspense fallback={<div>Cargando webhooks...</div>}>
            <WebhookManager stores={stores || []} />
          </Suspense>
        </TabsContent>

        <TabsContent value="scripts" className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Sistema Universal de Scripts</h3>
            </div>
            <p className="text-sm text-purple-700">
              Usa scripts para casos complejos, atribución avanzada y detección de fraude. 
              Complementa perfectamente el sistema de webhooks.
            </p>
          </div>
          
          <Suspense fallback={<div>Cargando scripts...</div>}>
            <UniversalTrackingManager stores={stores || []} />
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* Comparación de sistemas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ¿Cuándo usar cada sistema?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Caso de Uso</th>
                  <th className="text-left py-2">Webhooks</th>
                  <th className="text-left py-2">Scripts</th>
                  <th className="text-left py-2">Recomendación</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="py-2 font-medium">Tienda Shopify/WooCommerce</td>
                  <td className="py-2">✅ Perfecto</td>
                  <td className="py-2">✅ Complementario</td>
                  <td className="py-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">Webhooks + Scripts</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Ventas con cupones</td>
                  <td className="py-2">✅ Automático</td>
                  <td className="py-2">✅ Preciso</td>
                  <td className="py-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">Ambos</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Ventas por referral</td>
                  <td className="py-2">⚠️ Limitado</td>
                  <td className="py-2">✅ Excelente</td>
                  <td className="py-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">Scripts</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Detección de fraude</td>
                  <td className="py-2">❌ Básico</td>
                  <td className="py-2">✅ Avanzado</td>
                  <td className="py-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">Scripts</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Simplicidad de instalación</td>
                  <td className="py-2">✅ Muy fácil</td>
                  <td className="py-2">⚠️ Requiere código</td>
                  <td className="py-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">Webhooks</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Enlaces útiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Recursos y Soporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">📚 Documentación</h4>
              <div className="space-y-1 text-sm">
                <a href="/docs/webhook-installation-guide.md" className="text-blue-600 hover:underline block">
                  • Guía de Instalación de Webhooks
                </a>
                <a href="/docs/universal-tracking-installation-guide.md" className="text-blue-600 hover:underline block">
                  • Guía de Scripts Universal
                </a>
                <a href="/docs/tracking-hybrid-guide.md" className="text-blue-600 hover:underline block">
                  • Guía del Sistema Híbrido
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">🆘 Soporte</h4>
              <div className="space-y-1 text-sm">
                <a href="mailto:soporte@cuponomics.app" className="text-blue-600 hover:underline block">
                  • Email: soporte@cuponomics.app
                </a>
                <span className="text-gray-600 block">
                  • Horario: Lunes a Viernes, 9:00 - 18:00 GMT-5
                </span>
                <span className="text-gray-600 block">
                  • Respuesta: Máximo 2 horas
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
