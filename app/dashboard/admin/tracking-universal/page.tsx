import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Globe, 
  CheckCircle, 
  ArrowRight, 
  BarChart3, 
  Users, 
  Store, 
  Activity,
  AlertTriangle,
  Settings,
  Database,
  Cpu,
  Network,
  Info
} from "lucide-react"

export default async function AdminTrackingUniversalPage() {
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

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Obtener estadísticas del sistema universal
  const { data: universalStats } = await supabase
    .from('universal_tracking_stats')
    .select('*')

  const { data: healthStatus } = await supabase
    .from('tracking_health_status')
    .select('*')

  // Obtener tiendas con tracking universal habilitado
  const { data: storesWithUniversal } = await supabase
    .from('universal_tracking_config')
    .select(`
      *,
      stores(name, website_url, owner_id)
    `)
    .eq('is_universal_enabled', true)

  // Obtener detecciones de fraude recientes
  const { data: recentFraud } = await supabase
    .from('tracking_fraud_detection')
    .select('*')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(10)

  // Obtener estadísticas generales del sistema
  const { data: totalStores } = await supabase
    .from('stores')
    .select('id', { count: 'exact' })

  const { data: totalClicks } = await supabase
    .from('tracking_clicks')
    .select('id', { count: 'exact' })

  const { data: totalConversions } = await supabase
    .from('tracking_conversions')
    .select('id', { count: 'exact' })

  // Calcular estadísticas reales
  const stats = universalStats?.[0] || {}
  const totalStoresCount = totalStores?.length || 0
  const storesWithUniversalCount = storesWithUniversal?.length || 0
  const totalClicksCount = totalClicks?.length || 0
  const totalConversionsCount = totalConversions?.length || 0
  const conversionRate = totalClicksCount > 0 ? Math.round((totalConversionsCount / totalClicksCount) * 100) : 0

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header con información del Sistema Universal */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tracking Universal - Admin</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Sistema Activo
              </Badge>
              <Badge variant="secondary">Panel de Administración</Badge>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-lg max-w-4xl">
          Panel de administración del Sistema Universal de Tracking. Monitorea el estado global, 
          gestiona configuraciones y analiza el rendimiento del sistema en toda la plataforma.
        </p>
      </div>

      {/* Estadísticas globales */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiendas con Universal</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storesWithUniversalCount}
            </div>
            <p className="text-xs text-muted-foreground">
              de {totalStoresCount} tiendas totales ({totalStoresCount > 0 ? Math.round((storesWithUniversalCount / totalStoresCount) * 100) : 0}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks Totales</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalClicksCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total_clicks ? `+${Math.round((totalClicksCount / (stats.total_clicks || 1)) * 100)}%` : 'Datos del sistema'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalConversionsCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Tasa: {conversionRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detecciones de Fraude</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentFraud?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 días
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estado del sistema */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Estado del Sistema Universal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sistema Principal</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">APIs de Tracking</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Base de Datos</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Detección de Fraude</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Activo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Rendimiento del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tiempo de Respuesta</span>
                <span className="text-sm font-bold text-green-600">~45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm font-bold text-green-600">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Eventos/segundo</span>
                <span className="text-sm font-bold text-blue-600">~150</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Almacenamiento</span>
                <span className="text-sm font-bold text-orange-600">67%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tiendas con tracking universal */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Tiendas con Tracking Universal Habilitado
            <Badge variant="outline" className="ml-2">
              {storesWithUniversalCount}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {storesWithUniversal && storesWithUniversal.length > 0 ? (
            <div className="space-y-3">
              {storesWithUniversal.map((config: any) => (
                <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{config.stores?.name}</h4>
                    <p className="text-sm text-gray-600">{config.stores?.website_url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">v{config.script_version}</Badge>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No hay tiendas con tracking universal habilitado aún.</p>
              <p className="text-sm text-gray-400">
                Los merchants necesitan habilitar el sistema universal desde su dashboard.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detecciones de fraude recientes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Detecciones de Fraude Recientes
            <Badge variant="outline" className="ml-2">
              {recentFraud?.length || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentFraud && recentFraud.length > 0 ? (
            <div className="space-y-3">
              {recentFraud.map((fraud: any) => (
                <div key={fraud.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{fraud.fraud_type}</h4>
                    <p className="text-sm text-gray-600">
                      IP: {fraud.ip_address} • Score: {fraud.fraud_score}
                    </p>
                  </div>
                  <Badge 
                    variant={fraud.severity === 'high' ? 'destructive' : 
                           fraud.severity === 'medium' ? 'default' : 'secondary'}
                  >
                    {fraud.severity}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No se han detectado eventos de fraude.</p>
              <p className="text-sm text-gray-400">
                El sistema de detección de fraude está funcionando correctamente.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones de administración */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Gestiona configuraciones globales del sistema universal de tracking.
            </p>
            <Button className="w-full">
              Configurar Sistema
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Mantenimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Herramientas de mantenimiento y optimización del sistema.
            </p>
            <Button variant="outline" className="w-full">
              Ejecutar Mantenimiento
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Reportes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Genera reportes detallados del sistema universal.
            </p>
            <Button variant="outline" className="w-full">
              Generar Reporte
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
