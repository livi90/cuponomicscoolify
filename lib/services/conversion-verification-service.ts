import { createClient } from "@/lib/supabase/client"

export interface ConversionVerificationResult {
  success: boolean
  verified: boolean
  reason?: string
  method: "webhook" | "pixel" | "manual" | "api"
}

export interface UnverifiedConversion {
  id: string
  order_id: string
  store_name: string
  conversion_value: number
  created_at: string
  days_old: number
}

export class ConversionVerificationService {
  private supabase = createClient()

  /**
   * Verificar conversión automáticamente usando múltiples métodos
   */
  async verifyConversion(
    storeId: string,
    orderId: string,
    orderData: any
  ): Promise<ConversionVerificationResult> {
    try {
      // Método 1: Verificar si ya existe una conversión confirmada
      const { data: existingConversion } = await this.supabase
        .from("tracking_conversions")
        .select("id, status")
        .eq("store_id", storeId)
        .eq("order_id", orderId)
        .single()

      if (existingConversion) {
        if (existingConversion.status === "confirmed") {
          return {
            success: true,
            verified: true,
            method: "webhook",
            reason: "Conversión ya verificada"
          }
        }
      }

      // Método 2: Intentar verificar via API de la plataforma
      const store = await this.getStoreInfo(storeId)
      if (store) {
        const apiVerification = await this.verifyViaPlatformAPI(store, orderId, orderData)
        if (apiVerification.verified) {
          return apiVerification
        }
      }

      // Método 3: Verificar via webhook (si está configurado)
      if (store?.webhook_url) {
        const webhookVerification = await this.verifyViaWebhook(store, orderId, orderData)
        if (webhookVerification.verified) {
          return webhookVerification
        }
      }

      return {
        success: true,
        verified: false,
        method: "manual",
        reason: "Requiere verificación manual"
      }

    } catch (error) {
      console.error("Error verifying conversion:", error)
      return {
        success: false,
        verified: false,
        method: "manual",
        reason: "Error en verificación automática"
      }
    }
  }

  /**
   * Obtener conversiones no verificadas que requieren atención
   */
  async getUnverifiedConversions(merchantId: string): Promise<UnverifiedConversion[]> {
    try {
      const { data: conversions, error } = await this.supabase
        .from("tracking_conversions")
        .select(`
          id,
          order_id,
          conversion_value,
          created_at,
          stores!inner(name, owner_id)
        `)
        .eq("stores.owner_id", merchantId)
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (error) throw error

      const now = new Date()
      return (conversions || []).map(conv => ({
        id: conv.id,
        order_id: conv.order_id,
        store_name: conv.stores.name,
        conversion_value: conv.conversion_value,
        created_at: conv.created_at,
        days_old: Math.floor((now.getTime() - new Date(conv.created_at).getTime()) / (1000 * 60 * 60 * 24))
      }))
    } catch (error) {
      console.error("Error getting unverified conversions:", error)
      return []
    }
  }

  /**
   * Marcar conversión como verificada manualmente
   */
  async markAsVerified(conversionId: string, verifiedBy: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("tracking_conversions")
        .update({
          status: "confirmed",
          verified_at: new Date().toISOString(),
          verification_method: "manual",
          verified_by: verifiedBy
        })
        .eq("id", conversionId)

      if (error) throw error

      return true
    } catch (error) {
      console.error("Error marking conversion as verified:", error)
      return false
    }
  }

  /**
   * Enviar notificaciones sobre conversiones no verificadas
   */
  async sendUnverifiedConversionNotifications(merchantId: string): Promise<void> {
    try {
      const unverifiedConversions = await this.getUnverifiedConversions(merchantId)
      
      // Filtrar conversiones con más de 3 días sin verificar
      const oldConversions = unverifiedConversions.filter(conv => conv.days_old > 3)
      
      if (oldConversions.length > 0) {
        // Crear notificación para el merchant
        await this.supabase
          .from("notifications")
          .insert({
            user_id: merchantId,
            title: "Conversiones pendientes de verificación",
            message: `Tienes ${oldConversions.length} conversiones sin verificar que requieren tu atención.`,
            type: "conversion_verification",
            data: {
              conversion_count: oldConversions.length,
              oldest_conversion_days: Math.max(...oldConversions.map(c => c.days_old))
            }
          })
      }
    } catch (error) {
      console.error("Error sending unverified conversion notifications:", error)
    }
  }

  /**
   * Verificar conversión via API de la plataforma
   */
  private async verifyViaPlatformAPI(store: any, orderId: string, orderData: any): Promise<ConversionVerificationResult> {
    try {
      switch (store.ecommerce_platform?.toLowerCase()) {
        case "shopify":
          return await this.verifyViaShopifyAPI(store, orderId)
        case "woocommerce":
          return await this.verifyViaWooCommerceAPI(store, orderId)
        default:
          return {
            success: true,
            verified: false,
            method: "api",
            reason: "Plataforma no soportada para verificación automática"
          }
      }
    } catch (error) {
      return {
        success: false,
        verified: false,
        method: "api",
        reason: "Error en verificación via API"
      }
    }
  }

  /**
   * Verificar conversión via webhook
   */
  private async verifyViaWebhook(store: any, orderId: string, orderData: any): Promise<ConversionVerificationResult> {
    try {
      if (!store.webhook_url) {
        return {
          success: true,
          verified: false,
          method: "webhook",
          reason: "Webhook no configurado"
        }
      }

      // Simular envío de webhook para verificar
      const response = await fetch(store.webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          ...orderData
        })
      })

      if (response.ok) {
        return {
          success: true,
          verified: true,
          method: "webhook",
          reason: "Verificado via webhook"
        }
      }

      return {
        success: true,
        verified: false,
        method: "webhook",
        reason: "Webhook no respondió correctamente"
      }
    } catch (error) {
      return {
        success: false,
        verified: false,
        method: "webhook",
        reason: "Error en webhook"
      }
    }
  }

  /**
   * Verificar via Shopify API
   */
  private async verifyViaShopifyAPI(store: any, orderId: string): Promise<ConversionVerificationResult> {
    // Implementar verificación via Shopify API
    // Requiere API key y secret de la tienda
    return {
      success: true,
      verified: false,
      method: "api",
      reason: "Verificación via Shopify API no implementada"
    }
  }

  /**
   * Verificar via WooCommerce API
   */
  private async verifyViaWooCommerceAPI(store: any, orderId: string): Promise<ConversionVerificationResult> {
    // Implementar verificación via WooCommerce API
    // Requiere API key y secret de la tienda
    return {
      success: true,
      verified: false,
      method: "api",
      reason: "Verificación via WooCommerce API no implementada"
    }
  }

  /**
   * Obtener información de la tienda
   */
  private async getStoreInfo(storeId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from("stores")
        .select("*")
        .eq("id", storeId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error getting store info:", error)
      return null
    }
  }
}

// Exportar instancia singleton
export const conversionVerificationService = new ConversionVerificationService() 