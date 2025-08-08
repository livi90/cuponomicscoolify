"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Shield, 
  TrendingDown,
  Activity,
  Zap,
  Users,
  DollarSign
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ScriptRemovalAlert {
  id: string
  store_id: string
  store_name: string
  website_url: string
  owner_email: string
  last_ping: string
  hours_since_last_ping: number
  previous_status: string
  current_status: string
  potential_revenue_loss: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
}

interface StoreScriptStatus {
  id: string
  name: string
  website_url: string
  script_status: string
  script_last_ping: string
  script_version: string
  total_conversions: number
  total_revenue: number
  hours_since_last_ping: number
  risk_score: number
}

export default function ScriptRemovalDetector() {
  const [alerts, setAlerts] = useState<ScriptRemovalAlert[]>([])
  const [storesAtRisk, setStoresAtRisk] = useState<StoreScriptStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    potentialRevenueLoss: 0,
    storesAtRisk: 0
  })

  const supabase = createClient()

  useEffect(() => {
    loadScriptRemovalData()
  }, [])

  const loadScriptRemovalData = async () => {
    try {
      setLoading(true)

             // Obtener tiendas con scripts inactivos
       const { data: inactiveStores } = await supabase
         .from('stores')
         .select(`
           id,
           name,
           website,
           script_status,
           script_last_ping,
           owner_id,
           profiles!inner(email),
           universal_tracking_config(script_version)
         `)
         .or('script_status.eq.inactive,script_status.eq.never_installed')
         .order('script_last_ping', { ascending: false })

      // Calcular métricas de riesgo
      const storesWithRisk = inactiveStores?.map(store => {
        const lastPing = store.script_last_ping ? new Date(store.script_last_ping) : null
        const now = new Date()
        const hoursSinceLastPing = lastPing ? (now.getTime() - lastPing.getTime()) / (1000 * 60 * 60) : null

        // Calcular score de riesgo basado en tiempo sin ping y historial
        let riskScore = 0
        let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'

        if (!lastPing) {
          riskScore = 100
          riskLevel = 'critical'
        } else if (hoursSinceLastPing && hoursSinceLastPing > 168) { // 7 días
          riskScore = 90
          riskLevel = 'critical'
        } else if (hoursSinceLastPing && hoursSinceLastPing > 72) { // 3 días
          riskScore = 70
          riskLevel = 'high'
        } else if (hoursSinceLastPing && hoursSinceLastPing > 24) { // 1 día
          riskScore = 50
          riskLevel = 'medium'
        } else if (hoursSinceLastPing && hoursSinceLastPing > 6) { // 6 horas
          riskScore = 30
          riskLevel = 'low'
        }

                 return {
           id: store.id,
           name: store.name,
           website_url: store.website,
           script_status: store.script_status,
           script_last_ping: store.script_last_ping,
           script_version: store.universal_tracking_config?.[0]?.script_version || '1.0.0',
           total_conversions: 0, // TODO: Obtener de tracking_conversions
           total_revenue: 0, // TODO: Obtener de tracking_conversions
           hours_since_last_ping: hoursSinceLastPing || 0,
           risk_score: riskScore,
           owner_email: store.profiles?.email
         }
      }) || []

      // Filtrar tiendas con riesgo alto
      const highRiskStores = storesWithRisk.filter(store => store.risk_score > 50)

      // Generar alertas para tiendas críticas
      const criticalAlerts: ScriptRemovalAlert[] = highRiskStores.map(store => ({
        id: store.id,
        store_id: store.id,
        store_name: store.name,
        website_url: store.website_url,
        owner_email: store.owner_email,
        last_ping: store.script_last_ping,
        hours_since_last_ping: store.hours_since_last_ping,
        previous_status: 'active',
        current_status: store.script_status,
        potential_revenue_loss: store.total_revenue * 0.3, // Estimación de pérdida
        risk_level: store.risk_score > 80 ? 'critical' : store.risk_score > 60 ? 'high' : 'medium',
        created_at: new Date().toISOString()
      }))

      setStoresAtRisk(storesWithRisk)
      setAlerts(criticalAlerts)

      // Calcular estadísticas
      const totalAlerts = criticalAlerts.length
      const criticalAlertsCount = criticalAlerts.filter(a => a.risk_level === 'critical').length
      const potentialRevenueLoss = criticalAlerts.reduce((sum, alert) => sum + alert.potential_revenue_loss, 0)

      setStats({
        totalAlerts,
        criticalAlerts: criticalAlertsCount,
        potentialRevenueLoss,
        storesAtRisk: storesWithRisk.length
      })

    } catch (error) {
      console.error('Error loading script removal data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-black'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />
      case 'high': return <TrendingDown className="w-4 h-4" />
      case 'medium': return <Clock className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const formatTimeAgo = (hours: number) => {
    if (hours < 1) return 'Menos de 1 hora'
    if (hours < 24) return `${Math.round(hours)} horas`
    const days = Math.round(hours / 24)
    return `${days} días`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Cargando datos de detección...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertas Totales</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalAlerts}</p>
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
                <p className="text-2xl font-bold text-red-700">{stats.criticalAlerts}</p>
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
                <p className="text-2xl font-bold text-orange-600">€{stats.potentialRevenueLoss.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{stats.storesAtRisk}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas críticas */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Script Removido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Alert key={alert.id} className="border-red-200 bg-red-50">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800">{alert.store_name}</p>
                        <p className="text-sm text-red-600">
                          Último ping: {formatTimeAgo(alert.hours_since_last_ping)} atrás
                        </p>
                        <p className="text-sm text-red-600">
                          Pérdida estimada: €{alert.potential_revenue_loss.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskLevelColor(alert.risk_level)}>
                          {getRiskLevelIcon(alert.risk_level)}
                          {alert.risk_level.toUpperCase()}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Investigar
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de tiendas en riesgo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Tiendas con Scripts Inactivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {storesAtRisk.length > 0 ? (
            <div className="space-y-3">
              {storesAtRisk.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{store.name}</h4>
                      <Badge className={getRiskLevelColor(store.risk_score > 80 ? 'critical' : store.risk_score > 60 ? 'high' : store.risk_score > 40 ? 'medium' : 'low')}>
                        {getRiskLevelIcon(store.risk_score > 80 ? 'critical' : store.risk_score > 60 ? 'high' : store.risk_score > 40 ? 'medium' : 'low')}
                        Riesgo {store.risk_score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{store.website_url}</p>
                    <p className="text-sm text-gray-500">
                      Último ping: {store.script_last_ping ? formatTimeAgo(store.hours_since_last_ping) : 'Nunca'} atrás
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Zap className="w-4 h-4 mr-1" />
                      Reinstalar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay tiendas con scripts inactivos.</p>
              <p className="text-sm text-gray-400">Todos los scripts están funcionando correctamente.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones recomendadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Acciones Recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.criticalAlerts > 0 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Contactar merchants críticos</p>
                  <p className="text-sm text-red-600">
                    {stats.criticalAlerts} tiendas no han enviado pings en más de 7 días
                  </p>
                </div>
              </div>
            )}
            
            {stats.potentialRevenueLoss > 100 && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Revisar comisiones perdidas</p>
                  <p className="text-sm text-orange-600">
                    Pérdida estimada de €{stats.potentialRevenueLoss.toFixed(2)} en comisiones
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Implementar detección automática</p>
                <p className="text-sm text-blue-600">
                  Configurar alertas automáticas para scripts inactivos
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
