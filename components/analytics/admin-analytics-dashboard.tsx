"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Store,
  DollarSign,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Globe,
  Shield,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
} from "lucide-react"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { analyticsService, type AdminAnalytics } from "@/lib/services/analytics-service"

export function AdminAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  })

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await analyticsService.getAdminAnalytics(dateRange)
      setAnalytics(data)
    } catch (error) {
      console.error("Error loading admin analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error al cargar analytics</CardTitle>
          <CardDescription>No se pudieron cargar los datos de analytics administrativos</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={loadAnalytics}>Reintentar</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controles superiores */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h2>
          <p className="text-gray-600">Vista completa de la plataforma Cuponomics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadAnalytics} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {format(new Date(dateRange.start), "dd MMM", { locale: es })} -{" "}
            {format(new Date(dateRange.end), "dd MMM", { locale: es })}
          </Button>
        </div>
      </div>

      {/* Métricas principales expandidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Store className="h-4 w-4" />
              Tiendas Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.global_overview.total_stores.toLocaleString()}</div>
            <p className="text-xs text-gray-500">{analytics.platform_health.approved_stores} aprobadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.global_overview.total_users.toLocaleString()}</div>
            <p className="text-xs text-gray-500">{analytics.global_overview.total_merchants} comerciantes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Conversiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.global_overview.total_conversions.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              {formatPercentage(analytics.global_overview.avg_conversion_rate)} tasa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.global_overview.total_revenue)}</div>
            <p className="text-xs text-gray-500">Ventas generadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Ingresos Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analytics.global_overview.platform_revenue)}
            </div>
            <p className="text-xs text-gray-500">Margen neto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Crecimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${analytics.global_overview.growth_rate >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {analytics.global_overview.growth_rate >= 0 ? "+" : ""}
              {formatPercentage(analytics.global_overview.growth_rate)}
            </div>
            <p className="text-xs text-gray-500">vs período anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con vistas expandidas */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
          <TabsTrigger value="stores">Tiendas</TabsTrigger>
          <TabsTrigger value="merchants">Comerciantes</TabsTrigger>
          <TabsTrigger value="traffic">Tráfico</TabsTrigger>
          <TabsTrigger value="operational">Operacional</TabsTrigger>
          <TabsTrigger value="health">Salud</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Métricas Clave
                </CardTitle>
                <CardDescription>Indicadores principales de rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de clics</span>
                    <span className="font-medium">{analytics.global_overview.total_clicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tasa conversión promedio</span>
                    <Badge variant={analytics.global_overview.avg_conversion_rate >= 3 ? "default" : "secondary"}>
                      {formatPercentage(analytics.global_overview.avg_conversion_rate)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Margen bruto</span>
                    <span className="font-medium text-green-600">
                      {formatPercentage(analytics.financial_metrics.gross_margin)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Scripts instalados</span>
                    <Badge
                      variant={analytics.platform_health.script_installation_rate >= 80 ? "default" : "destructive"}
                    >
                      {formatPercentage(analytics.platform_health.script_installation_rate)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-500" />
                  Distribución de Ingresos
                </CardTitle>
                <CardDescription>Desglose de fuentes de ingresos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Comisiones de ventas</span>
                      <span className="font-medium">{formatCurrency(analytics.global_overview.platform_revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${(analytics.global_overview.platform_revenue / analytics.global_overview.total_revenue) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Suscripciones</span>
                      <span className="font-medium">{formatCurrency(0)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Otros ingresos</span>
                      <span className="font-medium">{formatCurrency(0)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-orange-500" />
                  Tendencias de Crecimiento
                </CardTitle>
                <CardDescription>Evolución de métricas clave</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nuevos usuarios</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        +{analytics.user_acquisition.reduce((sum, day) => sum + day.new_users, 0)}
                      </span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nuevos comerciantes</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        +{analytics.user_acquisition.reduce((sum, day) => sum + day.new_merchants, 0)}
                      </span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tasa de retención</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatPercentage(90)}</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Churn rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatPercentage(analytics.financial_metrics.churn_rate)}</span>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">MRR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics.financial_metrics.monthly_recurring_revenue)}
                </div>
                <p className="text-xs text-gray-500">Ingresos recurrentes mensuales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">ARR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics.financial_metrics.annual_recurring_revenue)}
                </div>
                <p className="text-xs text-gray-500">Ingresos recurrentes anuales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">LTV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics.financial_metrics.customer_lifetime_value)}
                </div>
                <p className="text-xs text-gray-500">Valor de vida del cliente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">NRR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatPercentage(analytics.financial_metrics.net_revenue_retention)}
                </div>
                <p className="text-xs text-gray-500">Retención neta de ingresos</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desglose de Ingresos por Período</CardTitle>
              <CardDescription>Evolución detallada de ingresos y comisiones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.revenue_breakdown.slice(0, 10).map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{format(new Date(day.date), "dd MMM yyyy", { locale: es })}</div>
                      <div className="text-sm text-gray-500">{day.stores_count} tiendas activas</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(day.total_revenue)}</div>
                      <div className="text-sm text-gray-500">Comisión: {formatCurrency(day.commission_revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Tiendas por Rendimiento</CardTitle>
              <CardDescription>Las tiendas que más ingresos generan a la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.top_performing_stores.slice(0, 15).map((store, index) => (
                  <div key={store.store_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-medium text-orange-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{store.store_name}</div>
                        <div className="text-sm text-gray-500">{store.merchant_email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={store.status === "approved" ? "default" : "secondary"} className="text-xs">
                            {store.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            Última actividad: {format(new Date(store.last_activity), "dd MMM", { locale: es })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(store.revenue)}</div>
                      <div className="text-sm text-gray-500">
                        {store.clicks} clics • {formatPercentage(store.conversion_rate)} conversión
                      </div>
                      <div className="text-sm text-green-600">
                        Comisión: {formatCurrency(store.commission_generated)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merchants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics de Comerciantes</CardTitle>
              <CardDescription>Rendimiento detallado de cada comerciante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.merchant_analytics.slice(0, 20).map((merchant, index) => (
                  <div key={merchant.merchant_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{merchant.merchant_email}</div>
                      <div className="text-sm text-gray-500">
                        {merchant.stores_count} tienda{merchant.stores_count !== 1 ? "s" : ""} • Plan{" "}
                        {merchant.subscription_plan}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={merchant.status === "active" ? "default" : "secondary"} className="text-xs">
                          {merchant.status}
                        </Badge>
                        <span className="text-xs text-gray-400">LTV: {formatCurrency(merchant.lifetime_value)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(merchant.total_revenue)}</div>
                      <div className="text-sm text-orange-600">Debe: {formatCurrency(merchant.commission_owed)}</div>
                      <div className="text-sm text-green-600">Pagado: {formatCurrency(merchant.commission_paid)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Tráfico Global</CardTitle>
              <CardDescription>Fuentes de tráfico de toda la plataforma con métricas avanzadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.traffic_analysis.map((traffic, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {traffic.utm_source} / {traffic.utm_medium}
                      </div>
                      <div className="text-sm text-gray-500">{traffic.utm_campaign}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400">
                          CPA: {formatCurrency(traffic.cost_per_acquisition)}
                        </span>
                        <span className="text-xs text-gray-400">ROAS: {traffic.return_on_ad_spend.toFixed(2)}x</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{traffic.clicks.toLocaleString()} clics</div>
                      <div className="text-sm text-gray-500">{traffic.conversions} conversiones</div>
                      <div className="text-sm text-green-600">{formatCurrency(traffic.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Soporte al Cliente
                </CardTitle>
                <CardDescription>Métricas de atención al cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tickets abiertos</span>
                    <Badge variant="destructive">{analytics.operational_metrics.support_tickets_open}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tickets resueltos</span>
                    <Badge variant="default">{analytics.operational_metrics.support_tickets_resolved}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tiempo promedio resolución</span>
                    <span className="font-medium">{analytics.operational_metrics.avg_resolution_time}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Satisfacción del Cliente
                </CardTitle>
                <CardDescription>Métricas de satisfacción y lealtad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CSAT Score</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{analytics.operational_metrics.customer_satisfaction_score}/5</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-3 h-3 ${
                              star <= analytics.operational_metrics.customer_satisfaction_score
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ⭐
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">NPS Score</span>
                    <Badge variant="default">{analytics.operational_metrics.nps_score}/10</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  Rendimiento por Categoría
                </CardTitle>
                <CardDescription>Top categorías de productos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.category_performance.slice(0, 5).map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{category.category}</div>
                        <div className="text-xs text-gray-500">{category.stores_count} tiendas</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(category.revenue)}</div>
                        <div className="text-xs text-gray-500">{formatPercentage(category.avg_conversion_rate)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Alertas y Notificaciones
                </CardTitle>
                <CardDescription>Elementos que requieren atención inmediata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.platform_health.pending_store_applications > 0 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="text-sm font-medium text-orange-800">
                        {analytics.platform_health.pending_store_applications} solicitudes de tienda pendientes
                      </div>
                      <div className="text-xs text-orange-600">Requieren revisión manual</div>
                    </div>
                  )}

                  {analytics.platform_health.script_installation_rate < 80 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm font-medium text-red-800">
                        Baja tasa de instalación de scripts (
                        {formatPercentage(analytics.platform_health.script_installation_rate)})
                      </div>
                      <div className="text-xs text-red-600">Muchas tiendas sin tracking activo</div>
                    </div>
                  )}

                  {analytics.platform_health.expired_coupons > 100 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="text-sm font-medium text-yellow-800">
                        {analytics.platform_health.expired_coupons} cupones expirados
                      </div>
                      <div className="text-xs text-yellow-600">Considera limpiar cupones antiguos</div>
                    </div>
                  )}

                  {analytics.operational_metrics.support_tickets_open > 20 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm font-medium text-red-800">
                        Alto volumen de tickets de soporte ({analytics.operational_metrics.support_tickets_open})
                      </div>
                      <div className="text-xs text-red-600">Requiere atención del equipo de soporte</div>
                    </div>
                  )}

                  {analytics.platform_health.pending_store_applications === 0 &&
                    analytics.platform_health.script_installation_rate >= 80 &&
                    analytics.platform_health.expired_coupons <= 100 &&
                    analytics.operational_metrics.support_tickets_open <= 20 && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-sm font-medium text-green-800">¡Sistema funcionando óptimamente!</div>
                        <div className="text-xs text-green-600">Todas las métricas dentro de rangos normales</div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Salud del Sistema</CardTitle>
                <CardDescription>Indicadores técnicos y operacionales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Uptime del sistema</span>
                      <span className="text-sm text-gray-600">
                        {formatPercentage(analytics.platform_health.system_uptime)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${analytics.platform_health.system_uptime}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Scripts instalados</span>
                      <span className="text-sm text-gray-600">
                        {formatPercentage(analytics.platform_health.script_installation_rate)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          analytics.platform_health.script_installation_rate >= 80
                            ? "bg-green-500"
                            : analytics.platform_health.script_installation_rate >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${analytics.platform_health.script_installation_rate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Tasa de aprobación de tiendas</span>
                      <span className="text-sm text-gray-600">
                        {formatPercentage(
                          (analytics.platform_health.approved_stores /
                            (analytics.platform_health.approved_stores + analytics.platform_health.rejected_stores)) *
                            100,
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (analytics.platform_health.approved_stores /
                              (analytics.platform_health.approved_stores + analytics.platform_health.rejected_stores)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Resumen de Estado</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Cupones activos:</span>
                        <span className="font-medium ml-2">{analytics.platform_health.active_coupons}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tiempo resp. promedio:</span>
                        <span className="font-medium ml-2">{analytics.platform_health.avg_response_time}h</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tiendas aprobadas:</span>
                        <span className="font-medium ml-2">{analytics.platform_health.approved_stores}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Solicitudes pendientes:</span>
                        <span className="font-medium ml-2">{analytics.platform_health.pending_store_applications}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
