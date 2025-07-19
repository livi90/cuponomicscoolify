"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"
import { subscriptionService } from "@/lib/services/subscription-service"
import type { SubscriptionPlan } from "@/lib/types/subscription"
import { formatCurrency } from "@/lib/utils"

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[]
  currentPlanId?: string | null
}

export function SubscriptionPlans({ plans, currentPlanId }: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    try {
      setLoading(planId)
      setError(null)

      // Si ya tiene este plan, no hacer nada
      if (planId === currentPlanId) {
        setLoading(null)
        return
      }

      // Si ya tiene un plan, cambiar de plan
      if (currentPlanId) {
        const success = await subscriptionService.changePlan(planId)
        if (success) {
          window.location.href = "/dashboard/subscription?success=plan-changed"
        } else {
          setError("No se pudo cambiar el plan. Por favor, inténtalo de nuevo.")
        }
      } else {
        // Si no tiene un plan, crear una nueva suscripción
        const success = await subscriptionService.createSubscription(planId)
        if (success) {
          window.location.href = "/dashboard/subscription?success=subscription-created"
        } else {
          setError("No se pudo crear la suscripción. Por favor, inténtalo de nuevo.")
        }
      }
    } catch (err) {
      console.error("Error al seleccionar plan:", err)
      setError("Ha ocurrido un error. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(null)
    }
  }

  // Agrupar planes por intervalo
  const monthlyPlans = plans.filter((plan) => plan.interval === "monthly")
  const yearlyPlans = plans.filter((plan) => plan.interval === "yearly")

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">Planes mensuales</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {monthlyPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col ${plan.id === currentPlanId ? "border-2 border-orange-500" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.id === currentPlanId && <Badge>Plan actual</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-4">
                  <p className="text-3xl font-bold">
                    {formatCurrency(plan.price)}
                    <span className="text-sm font-normal text-gray-500">/mes</span>
                  </p>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading === plan.id || plan.id === currentPlanId}
                >
                  {loading === plan.id
                    ? "Procesando..."
                    : plan.id === currentPlanId
                      ? "Plan actual"
                      : "Seleccionar plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">
          Planes anuales{" "}
          <Badge variant="outline" className="ml-2">
            Ahorra hasta un 20%
          </Badge>
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {yearlyPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col ${plan.id === currentPlanId ? "border-2 border-orange-500" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.id === currentPlanId && <Badge>Plan actual</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-4">
                  <p className="text-3xl font-bold">
                    {formatCurrency(plan.price)}
                    <span className="text-sm font-normal text-gray-500">/año</span>
                  </p>
                  <p className="text-sm text-gray-500">Equivalente a {formatCurrency(plan.price / 12)}/mes</p>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading === plan.id || plan.id === currentPlanId}
                >
                  {loading === plan.id
                    ? "Procesando..."
                    : plan.id === currentPlanId
                      ? "Plan actual"
                      : "Seleccionar plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
