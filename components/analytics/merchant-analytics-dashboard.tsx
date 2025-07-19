"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, TrendingUp, TrendingDown, ShoppingCart, DollarSign, Eye, Target } from "lucide-react"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { analyticsService, type MerchantAnalytics } from "@/lib/services/analytics-service"
import { AnalyticsChart } from "./analytics-chart"
import { TopCouponsTable } from "./top-coupons-table"
import { TrafficSourcesChart } from "./traffic-sources-chart"
import { GeographicChart } from "./geographic-chart"

interface MerchantAnalyticsDashboardProps {
  userRole: string
  userId: string
}

export function MerchantAnalyticsDashboard({ userRole, userId }: MerchantAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<MerchantAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  })

  useEffect(() => {
    loadAnalytics()
  }, [dateRange, userId])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await analyticsService.getMerchantAnalytics(userId, dateRange)
      setAnalytics(data)
    } catch (error) {
      console.error("Error loading analytics:", error)
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
          <CardDescription>No se pudieron cargar los datos de analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={loadAnalytics}>Reintentar</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Selector de fecha */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(dateRange.start), "dd MMM", { locale: es })} -{" "}
                {format(new Date(dateRange.end), "dd MMM", { locale: es })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDateRange({
                        start: format(subDays(new Date(), 7), "yyyy-MM-dd"),
                        end: format(new Date(), "yyyy-MM-dd"),
                      })
                    }
                  >
                    Últimos 7 días
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDateRange({
                        start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
                        end: format(new Date(), "yyyy-MM-dd"),
                      })
                    }
                  >
                    Últimos 30 días
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDateRange({
                        start: format(subDays(new Date(), 90), "yyyy-MM-dd"),
                        end: format(new Date(), "yyyy-MM-dd"),
                      })
                    }
                  >
                    Últimos 90 días
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDateRange({
                        start: format(subDays(new Date(), 365), "yyyy-MM-dd"),
                        end: format(new Date(), "yyyy-MM-dd"),
                      })
                    }
                  >
                    Último año
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={loadAnalytics} variant="outline">
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Clics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.total_clicks.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Visitas generadas</p>
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
            <div className="text-2xl font-bold">{analytics.overview.total_conversions.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Ventas confirmadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tasa Conversión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(analytics.overview.conversion_rate)}</div>
            <p className="text-xs text-gray-500">
              {analytics.overview.conversion_rate > 2 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Excelente
                </span>
              ) : (
                <span className="text-orange-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> Mejorable
                </span>
              )}
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
            <div className="text-2xl font-bold">{formatCurrency(analytics.overview.total_revenue)}</div>
            <p className="text-xs text-gray-500">Ventas generadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              Comisión Cuponomics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(analytics.overview.total_commission)}
            </div>
            <p className="text-xs text-gray-500">A pagar a Cuponomics</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Facturación pendiente
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Ticket Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.overview.avg_order_value)}</div>
            <p className="text-xs text-gray-500">Por compra</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con diferentes vistas */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="coupons">Cupones</TabsTrigger>
          <TabsTrigger value="traffic">Tráfico</TabsTrigger>
          <TabsTrigger value="geographic">Geográfico</TabsTrigger>
          <TabsTrigger value="behavior">Comportamiento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Rendimiento</CardTitle>
              <CardDescription>Evolución de clics, conversiones e ingresos en el tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart data={analytics.time_series} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Fuentes de Tráfico</CardTitle>
                <CardDescription>De dónde vienen tus visitantes</CardDescription>
              </CardHeader>
              <CardContent>
                <TrafficSourcesChart data={analytics.traffic_sources} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comportamiento de Usuarios</CardTitle>
                <CardDescription>Métricas de engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Usuarios nuevos</span>
                    <span className="font-medium">{analytics.user_behavior.new_users}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Usuarios recurrentes</span>
                    <span className="font-medium">{analytics.user_behavior.returning_users}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duración promedio</span>
                    <span className="font-medium">{analytics.user_behavior.avg_session_duration}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tasa de rebote</span>
                    <span className="font-medium">{formatPercentage(analytics.user_behavior.bounce_rate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Cupones por Rendimiento</CardTitle>
              <CardDescription>Tus cupones más exitosos ordenados por ingresos generados</CardDescription>
            </CardHeader>
            <CardContent>
              <TopCouponsTable coupons={analytics.top_coupons} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado de Tráfico</CardTitle>
              <CardDescription>Fuentes de tráfico y su rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.traffic_sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{source.utm_medium}</div>
                      <div className="text-sm text-gray-500">{source.utm_campaign}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{source.clicks} clics</div>
                      <div className="text-sm text-gray-500">{source.conversions} conversiones</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución Geográfica</CardTitle>
              <CardDescription>De qué países vienen tus visitantes</CardDescription>
            </CardHeader>
            <CardContent>
              <GeographicChart data={analytics.geographic_data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Engagement</CardTitle>
                <CardDescription>Cómo interactúan los usuarios con tu contenido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Usuarios nuevos vs recurrentes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{
                          width: `${(analytics.user_behavior.new_users / (analytics.user_behavior.new_users + analytics.user_behavior.returning_users)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Nuevos: {analytics.user_behavior.new_users}</span>
                      <span>Recurrentes: {analytics.user_behavior.returning_users}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Tasa de rebote</span>
                      <span className="text-sm text-gray-600">
                        {formatPercentage(analytics.user_behavior.bounce_rate)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${analytics.user_behavior.bounce_rate > 70 ? "bg-red-500" : analytics.user_behavior.bounce_rate > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                        style={{ width: `${analytics.user_behavior.bounce_rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones</CardTitle>
                <CardDescription>Sugerencias para mejorar tu rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.overview.conversion_rate < 2 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="text-sm font-medium text-orange-800">Mejora tu tasa de conversión</div>
                      <div className="text-xs text-orange-600">
                        Tu tasa está por debajo del 2%. Considera optimizar tus cupones.
                      </div>
                    </div>
                  )}

                  {analytics.overview.avg_order_value < 50 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Aumenta el ticket promedio</div>
                      <div className="text-xs text-blue-600">Promociona productos de mayor valor o bundles.</div>
                    </div>
                  )}

                  {analytics.user_behavior.bounce_rate > 70 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm font-medium text-red-800">Reduce la tasa de rebote</div>
                      <div className="text-xs text-red-600">
                        Muchos usuarios se van sin interactuar. Mejora la experiencia.
                      </div>
                    </div>
                  )}

                  {analytics.overview.conversion_rate > 3 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm font-medium text-green-800">¡Excelente rendimiento!</div>
                      <div className="text-xs text-green-600">Tu tasa de conversión está por encima del promedio.</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
