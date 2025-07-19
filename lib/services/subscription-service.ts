import { createClient } from "@/lib/supabase/client"
import type { SubscriptionPlan, UserSubscription, SubscriptionStats } from "@/lib/types/subscription"

export class SubscriptionService {
  private supabase = createClient()

  // Obtener todos los planes de suscripción disponibles
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data: plans } = await this.supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true })

      return plans || []
    } catch (error) {
      console.error("Error al obtener planes de suscripción:", error)
      return []
    }
  }

  // Obtener la suscripción actual del usuario
  async getCurrentSubscription(): Promise<UserSubscription | null> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return null

      const { data: subscription } = await this.supabase
        .from("user_subscriptions")
        .select("*, plan:plan_id(*)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      return subscription
    } catch (error) {
      console.error("Error al obtener suscripción actual:", error)
      return null
    }
  }

  // Obtener estadísticas de suscripción del usuario
  async getSubscriptionStats(): Promise<SubscriptionStats | null> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return null

      // Obtener la suscripción actual
      const subscription = await this.getCurrentSubscription()

      // Si no hay suscripción activa
      if (!subscription) {
        return {
          isActive: false,
          currentPlan: null,
          daysRemaining: 0,
          nextBillingDate: null,
          storeLimit: 0,
          couponLimit: 0,
          cancelAtPeriodEnd: false,
          recentPayments: [],
        }
      }

      // Calcular días restantes
      const currentPeriodEnd = new Date(subscription.current_period_end)
      const now = new Date()
      const daysRemaining = Math.ceil((currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      // Obtener pagos recientes
      const { data: payments } = await this.supabase
        .from("subscription_payments")
        .select("*")
        .eq("user_id", user.id)
        .order("payment_date", { ascending: false })
        .limit(5)

      // Determinar límites según el plan
      let storeLimit = 0
      let couponLimit = 0

      if (subscription.plan) {
        const features = subscription.plan.features as string[]

        // Determinar límite de tiendas
        if (features.some((f) => f.includes("ilimitadas"))) {
          storeLimit = -1 // -1 significa ilimitado
        } else if (features.some((f) => f.includes("3 tiendas"))) {
          storeLimit = 3
        } else if (features.some((f) => f.includes("1 tienda"))) {
          storeLimit = 1
        }

        // Determinar límite de cupones
        if (features.some((f) => f.includes("ilimitados"))) {
          couponLimit = -1 // -1 significa ilimitado
        } else if (features.some((f) => f.includes("50 cupones"))) {
          couponLimit = 50
        } else if (features.some((f) => f.includes("10 cupones"))) {
          couponLimit = 10
        }
      }

      return {
        isActive: true,
        currentPlan: subscription.plan || null,
        daysRemaining,
        nextBillingDate: subscription.current_period_end,
        storeLimit,
        couponLimit,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        recentPayments: payments || [],
      }
    } catch (error) {
      console.error("Error al obtener estadísticas de suscripción:", error)
      return null
    }
  }

  // Versión simplificada para crear una suscripción (sin Stripe)
  async createSubscription(planId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return false

      // Obtener información del plan
      const { data: plan } = await this.supabase.from("subscription_plans").select("*").eq("id", planId).single()

      if (!plan) return false

      // Crear una suscripción simulada
      const now = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + (plan.interval === "monthly" ? 1 : 12))

      await this.supabase.from("user_subscriptions").insert({
        user_id: user.id,
        plan_id: planId,
        stripe_customer_id: `cus_mock_${user.id.substring(0, 8)}`,
        stripe_subscription_id: `sub_mock_${Date.now()}`,
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
        cancel_at_period_end: false,
      })

      // Simular un pago
      await this.supabase.from("subscription_payments").insert({
        user_id: user.id,
        subscription_id: `sub_mock_${Date.now()}`,
        stripe_invoice_id: `inv_mock_${Date.now()}`,
        amount: plan.price,
        status: "paid",
        payment_date: now.toISOString(),
      })

      return true
    } catch (error) {
      console.error("Error al crear suscripción:", error)
      return false
    }
  }

  // Cancelar suscripción (versión simplificada)
  async cancelSubscription(): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return false

      // Obtener la suscripción actual
      const { data: subscription } = await this.supabase
        .from("user_subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single()

      if (!subscription) return false

      // Actualizar estado en la base de datos
      await this.supabase
        .from("user_subscriptions")
        .update({
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id)

      return true
    } catch (error) {
      console.error("Error al cancelar suscripción:", error)
      return false
    }
  }

  // Reactivar suscripción cancelada (versión simplificada)
  async reactivateSubscription(): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return false

      // Obtener la suscripción actual
      const { data: subscription } = await this.supabase
        .from("user_subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .eq("cancel_at_period_end", true)
        .single()

      if (!subscription) return false

      // Actualizar estado en la base de datos
      await this.supabase
        .from("user_subscriptions")
        .update({
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id)

      return true
    } catch (error) {
      console.error("Error al reactivar suscripción:", error)
      return false
    }
  }

  // Cambiar plan de suscripción (versión simplificada)
  async changePlan(newPlanId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return false

      // Obtener la suscripción actual
      const { data: subscription } = await this.supabase
        .from("user_subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single()

      if (!subscription) return false

      // Actualizar plan en la base de datos
      await this.supabase
        .from("user_subscriptions")
        .update({
          plan_id: newPlanId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id)

      return true
    } catch (error) {
      console.error("Error al cambiar plan de suscripción:", error)
      return false
    }
  }
}

// Exportar una instancia del servicio para uso global
export const subscriptionService = new SubscriptionService()
