"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, CreditCard, Calendar, Store, Tag } from "lucide-react"
import { subscriptionService } from "@/lib/services/subscription-service"
import type { SubscriptionStats } from "@/lib/types/subscription"
import { formatCurrency } from "@/lib/utils"

export function SubscriptionOverview() {
  const [stats, setStats] = useState<SubscriptionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [reactivateLoading, setReactivateLoading] = useState(false)

  useEffect(() => {
    async function loadStats() {
      const stats = await subscriptionService.getSubscriptionStats()
      setStats(stats)
      setLoading(false)
    }

    loadStats()
  }, [])

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "¿Estás seguro de que deseas cancelar tu suscripción? Tu suscripción seguirá activa hasta el final del período de facturación.",
      )
    ) {
      return
    }

    setCancelLoading(true)
    const success = await subscriptionService.cancelSubscription()
    setCancelLoading(false)

    if (success) {
      // Recargar estadísticas
      const stats = await subscriptionService.getSubscriptionStats()
      setStats(stats)
      alert("Tu suscripción ha sido cancelada. Seguirá activa hasta el final del período de facturación.")
    } else {
      alert("Ha ocurrido un error al cancelar tu suscripción. Por favor, inténtalo de nuevo.")
    }
  }

  const handleReactivateSubscription = async () => {
    setReactivateLoading(true)
    const success = await subscriptionService.reactivateSubscription()
    setReactivateLoading(false)

    if (success) {
      // Recargar estadísticas
      const stats = await subscriptionService.getSubscriptionStats()
      setStats(stats)
      alert("Tu suscripción ha sido reactivada.")
    } else {
      alert("Ha ocurrido un error al reactivar tu suscripción. Por favor, inténtalo de nuevo.")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando información de suscripción...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>No se pudo cargar la información de suscripción</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>
              Ha ocurrido un error al cargar la información de tu suscripción. Por favor, inténtalo de nuevo más tarde.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </CardFooter>
      </Card>
    )
  }

  if (!stats.isActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No tienes una suscripción activa</CardTitle>
          <CardDescription>Suscríbete para publicar tus tiendas y cupones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p>
                No tienes una suscripción activa. Para publicar tus tiendas y cupones, debes suscribirte a uno de
                nuestros planes.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => (window.location.href = "/dashboard/subscription/plans")}>
            Ver planes disponibles
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tu suscripción</CardTitle>
              <CardDescription>Detalles de tu plan actual</CardDescription>
            </div>
            <Badge variant={stats.cancelAtPeriodEnd ? "destructive" : "default"}>
              {stats.cancelAtPeriodEnd ? "Cancelada" : "Activa"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {stats.currentPlan && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{stats.currentPlan.name}</h3>
                  <p className="text-xl font-bold">
                    {formatCurrency(stats.currentPlan.price)}/{stats.currentPlan.interval === "monthly" ? "mes" : "año"}
                  </p>
                </div>
                <p className="text-sm text-gray-500">{stats.currentPlan.description}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Próxima facturación</span>
                </div>
                <span className="font-medium">
                  {stats.nextBillingDate ? new Date(stats.nextBillingDate).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Días restantes</span>
                  <span>{stats.daysRemaining} días</span>
                </div>
                <Progress value={(stats.daysRemaining / 30) * 100} className="h-2" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-medium">Características del plan</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {stats.storeLimit === -1
                      ? "Tiendas ilimitadas"
                      : `${stats.storeLimit} tienda${stats.storeLimit !== 1 ? "s" : ""}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {stats.couponLimit === -1
                      ? "Cupones ilimitados"
                      : `${stats.couponLimit} cupone${stats.couponLimit !== 1 ? "s" : ""}`}
                  </span>
                </div>
                {stats.currentPlan?.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {stats.cancelAtPeriodEnd ? (
            <Button onClick={handleReactivateSubscription} disabled={reactivateLoading} className="w-full">
              {reactivateLoading ? "Reactivando..." : "Reactivar suscripción"}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard/subscription/change-plan")}
                className="w-full"
              >
                Cambiar plan
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelSubscription}
                disabled={cancelLoading}
                className="w-full"
              >
                {cancelLoading ? "Cancelando..." : "Cancelar suscripción"}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de pagos</CardTitle>
          <CardDescription>Tus pagos recientes</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentPayments.length === 0 ? (
            <div className="flex items-center justify-center py-6 text-gray-500">
              <p>No hay pagos recientes</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {stats.recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gray-100 p-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">Pago de suscripción</p>
                      <p className="text-sm text-gray-500">{new Date(payment.payment_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                    <Badge
                      variant={
                        payment.status === "paid" ? "success" : payment.status === "pending" ? "warning" : "destructive"
                      }
                    >
                      {payment.status === "paid" ? "Pagado" : payment.status === "pending" ? "Pendiente" : "Fallido"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/dashboard/subscription/payments")}
          >
            Ver todos los pagos
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
