import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ScriptRemovalDetector from "@/components/tracking/script-removal-detector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  AlertTriangle, 
  Settings, 
  Activity,
  Bell,
  Eye,
  Zap,
  Users,
  DollarSign,
  TrendingDown,
  CheckCircle
} from "lucide-react"

export default async function AdminScriptDetectionPage() {
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

  // Obtener estadísticas de detección
  const { data: detectionStats } = await supabase.rpc('get_script_detection_stats')

  // Obtener configuración de detección
  const { data: detectionConfig } = await supabase
    .from('script_detection_config')
    .select('*')
    .eq('is_active', true)

     // Obtener alertas recientes no resueltas
   const { data: recentAlerts } = await supabase
     .from('script_removal_alerts')
     .select(`
       *,
       stores(name, website)
     `)
     .eq('is_resolved', false)
     .order('created_at', { ascending: false })
     .limit(10)

     // Obtener intentos de reinstalación recientes
   const { data: recentReinstallAttempts } = await supabase
     .from('script_reinstallation_attempts')
     .select(`
       *,
       stores(name, website)
     `)
     .order('created_at', { ascending: false })
     .limit(5)

  const stats = detectionStats?.[0] || {
    total_alerts: 0,
    critical_alerts: 0,
    high_risk_alerts: 0,
    total_potential_loss: 0,
    stores_at_risk: 0,
    avg_resolution_time_hours: 0
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Detección de Scripts Removidos</h1>
            <p className="text-gray-600">
              Sistema de monitoreo para detectar cuando los merchants remueven scripts de tracking
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertas Totales</p>
                <p className="text-2xl font-bold text-red-600">{stats.total_alerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Críticas</p>
                <p className="text-2xl font-bold text-red-700">{stats.critical_alerts}</p>
              </div>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pérdida Estimada</p>
                <p className="text-2xl font-bold text-orange-600">€{stats.total_potential_loss?.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Riesgo</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.stores_at_risk}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Componente principal de detección */}
      <ScriptRemovalDetector />

      {/* Configuración del sistema */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración del Sistema de Detección
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Umbrales de Riesgo</h4>
              <div className="space-y-2">
                {detectionConfig?.map((config) => {
                  if (config.config_key.includes('threshold')) {
                    const hours = parseInt(config.config_value)
                    const days = hours / 24
                    return (
                      <div key={config.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{config.description}</span>
                        <Badge variant="outline">{hours}h ({days.toFixed(1)}d)</Badge>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Configuración General</h4>
              <div className="space-y-2">
                {detectionConfig?.map((config) => {
                  if (!config.config_key.includes('threshold')) {
                    return (
                      <div key={config.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{config.description}</span>
                        <Badge variant={config.config_value === 'true' ? 'default' : 'secondary'}>
                          {config.config_value === 'true' ? 'Habilitado' : config.config_value === 'false' ? 'Deshabilitado' : config.config_value}
                        </Badge>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Editar Configuración
            </Button>
            <Button variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              Ejecutar Verificación Manual
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertas recientes */}
      {recentAlerts && recentAlerts.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alertas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                                     <div>
                     <h4 className="font-medium">{alert.stores?.name}</h4>
                     <p className="text-sm text-gray-600">{alert.stores?.website}</p>
                    <p className="text-sm text-gray-500">
                      {alert.alert_type} - {alert.hours_since_last_ping} horas sin ping
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={alert.risk_level === 'critical' ? 'destructive' : 
                              alert.risk_level === 'high' ? 'default' : 'secondary'}
                    >
                      {alert.risk_level.toUpperCase()}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intentos de reinstalación recientes */}
      {recentReinstallAttempts && recentReinstallAttempts.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Intentos de Reinstalación Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReinstallAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{attempt.stores?.name}</h4>
                    <p className="text-sm text-gray-600">{attempt.attempt_type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(attempt.sent_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={attempt.status === 'delivered' ? 'default' : 
                              attempt.status === 'failed' ? 'destructive' : 'secondary'}
                    >
                      {attempt.status}
                    </Badge>
                    {attempt.response_received && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del sistema */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingDown className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-medium">Detección Automática</h4>
              <p className="text-sm text-gray-600">
                El sistema detecta automáticamente cuando los scripts cambian de estado
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-medium">Protección de Ingresos</h4>
              <p className="text-sm text-gray-600">
                Calcula la pérdida potencial de comisiones por scripts removidos
              </p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Bell className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-medium">Alertas Inteligentes</h4>
              <p className="text-sm text-gray-600">
                Sistema de notificaciones basado en niveles de riesgo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
