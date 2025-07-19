"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { conversionAnalyticsService, type ConversionAnalytics } from "@/lib/services/conversion-analytics-service"
import { ConversionsChart } from "./conversions-chart"
import { ConversionsTable } from "./conversions-table"

interface ConversionsDashboardProps {
  userId: string
  userRole: string
}

export function ConversionsDashboard({ userId, userRole }: ConversionsDashboardProps) {
  const [analytics, setAnalytics] = useState<ConversionAnalytics | null>(null)
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
      const data = await conversionAnalyticsService.getMerchantConversions(userId, dateRange)
      setAnalytics(data)
    } catch (error) {
      console.error("Error loading conversion analytics:", error)
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const, icon: Clock },
      confirmed: { label: "Confirmada", variant: "default" as const, icon: CheckCircle },
      cancelled: { label: "Cancelada", variant: "destructive" as const, icon: XCircle },
      refunded: { label: "Reembolsada", variant: "outline" as const, icon: RefreshCw },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
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
          <CardTitle>Error al cargar datos</CardTitle>
          <CardDescription>No se pudieron cargar los datos de conversiones</CardDescription>
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
              <ShoppingCart className="h-4 w-4" />
              Conversiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.total_conversions}</div>
            <p className="text-xs text-gray-500">Ventas confirmadas</p>
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
              <DollarSign className="h-4 w-4 text-green-600" />
              Comisiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analytics.overview.total_commission)}
            </div>
            <p className="text-xs text-gray-500">Tus ganancias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(analytics.overview.pending_commission)}
            </div>
            <p className="text-xs text-gray-500">Por confirmar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Target className="h-4 w-4" />
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
                <span className="text-orange-600">Mejorable</span>
              )}
            </p>
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
            <p className="text-xs text-gray-500">Por venta</p>
          </CardContent>
        </Card>
      </div>

      {/* Estado de conversiones */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.conversion_status.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold text-green-600">{analytics.conversion_status.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{analytics.conversion_status.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reembolsadas</p>
                <p className="text-2xl font-bold text-gray-600">{analytics.conversion_status.refunded}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con diferentes vistas */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="conversions">Conversiones</TabsTrigger>
          <TabsTrigger value="stores">Tiendas</TabsTrigger>
          <TabsTrigger value="coupons">Cupones</TabsTrigger>
          <TabsTrigger value="traffic">Tráfico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Conversiones</CardTitle>
              <CardDescription>Evolución de conversiones e ingresos en el tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ConversionsChart data={analytics.time_series} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Fuentes de Tráfico</CardTitle>
                <CardDescription>De dónde vienen tus conversiones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.traffic_sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{source.utm_source}</div>
                        <div className="text-sm text-gray-500">{source.utm_medium}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(source.revenue)}</div>
                        <div className="text-sm text-gray-500">{source.conversions} conversiones</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Tiendas</CardTitle>
                <CardDescription>Tus tiendas con mejor rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.top_stores.slice(0, 5).map((store, index) => (
                    <div key={store.store_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{store.store_name}</div>
                        <div className="text-sm text-gray-500">{store.conversions} conversiones</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(store.revenue)}</div>
                        <div className="text-sm text-green-600">{formatCurrency(store.commission)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversiones Recientes</CardTitle>
              <CardDescription>Últimas ventas registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <ConversionsTable conversions={analytics.recent_conversions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Tienda</CardTitle>
              <CardDescription>Análisis detallado de cada tienda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.top_stores.map((store) => (
                  <div key={store.store_id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{store.store_name}</h3>
                        <p className="text-sm text-gray-500">ID: {store.store_id}</p>
                      </div>
                      <Badge variant="outline">{store.conversions} conversiones</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Ingresos</p>
                        <p className="font-medium">{formatCurrency(store.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Comisión</p>
                        <p className="font-medium text-green-600">{formatCurrency(store.commission)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tasa Conv.</p>
                        <p className="font-medium">{formatPercentage(store.conversion_rate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Cupones</CardTitle>
              <CardDescription>Cupones que más conversiones generan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.top_coupons.map((coupon) => (
                  <div key={coupon.coupon_id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{coupon.coupon_code}</h3>
                        <p className="text-sm text-gray-500">ID: {coupon.coupon_id}</p>
                      </div>
                      <Badge variant="outline">{coupon.conversions} conversiones</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Ingresos</p>
                        <p className="font-medium">{formatCurrency(coupon.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Comisión</p>
                        <p className="font-medium text-green-600">{formatCurrency(coupon.commission)}</p>
                      </div>
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
              <CardTitle>Análisis de Tráfico</CardTitle>
              <CardDescription>Fuentes de tráfico que generan conversiones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.traffic_sources.map((source, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{source.utm_source}</h3>
                        <p className="text-sm text-gray-500">{source.utm_medium}</p>
                      </div>
                      <Badge variant="outline">{source.conversions} conversiones</Badge>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Ingresos generados</p>
                      <p className="font-medium text-lg">{formatCurrency(source.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
