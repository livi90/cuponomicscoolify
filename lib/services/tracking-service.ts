import { createClient } from "@/lib/supabase/client"

export interface TrackingClickData {
  coupon_id: string // ← UUID obligatorio
  coupon_code?: string | null
  store_id?: number | null
  store_name?: string | null
  category?: string | null
  discount_type?: string | null
  discount_value?: number | null
  affiliate_id?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_content?: string | null
  utm_term?: string | null
  original_url: string
  tracked_url: string
  store_url?: string | null
  session_id?: string | null
}

// Convierte a número o devuelve null si no es válido
const toNullableNumber = (value: unknown): number | null => {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export class TrackingService {
  private supabase = createClient()

  // Función para detectar tipo de dispositivo
  private detectDeviceType(userAgent: string): string {
    if (!userAgent) return "unknown"

    if (/iPhone|iPod|Android|BlackBerry|Windows Phone|Mobile/i.test(userAgent)) {
      return "mobile"
    }

    if (/iPad|Tablet/i.test(userAgent)) {
      return "tablet"
    }

    return "desktop"
  }

  // Validar URL
  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Registrar click de tracking
  async trackClick(data: TrackingClickData): Promise<{ success: boolean; click_id?: string; error?: string }> {
    try {
      console.log("Starting trackClick with data:", data)

      // Validar URLs requeridas
      if (!this.isValidUrl(data.original_url)) {
        console.error("Invalid original_url:", data.original_url)
        return { success: false, error: "Invalid original URL" }
      }

      if (!this.isValidUrl(data.tracked_url)) {
        console.error("Invalid tracked_url:", data.tracked_url)
        return { success: false, error: "Invalid tracked URL" }
      }

      // Obtener información del cliente de forma segura
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "unknown"
      const referrer = typeof document !== "undefined" ? document.referrer : ""

      // Obtener usuario actual si está logueado
      const {
        data: { user },
        error: userError,
      } = await this.supabase.auth.getUser()

      if (userError) {
        console.log("No authenticated user:", userError.message)
      }

      // Generar session ID si no existe
      let sessionId = data.session_id
      if (!sessionId && typeof sessionStorage !== "undefined") {
        sessionId = sessionStorage.getItem("tracking_session_id")
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          sessionStorage.setItem("tracking_session_id", sessionId)
        }
      }

      if (!data.coupon_id) {
        return { success: false, error: "coupon_id requerido" }
      }

      const trackingData = {
        user_id: user?.id || null,

        utm_source: data.utm_source || null,
        utm_medium: data.utm_medium || null,
        utm_campaign: data.utm_campaign || null,
        utm_content: data.utm_content || null,
        utm_term: data.utm_term || null,

        // -------------  NUMÉRICOS SANEADOS -------------
        store_id: Number.isFinite(Number(data.store_id)) ? Number(data.store_id) : null,
        coupon_id: data.coupon_id, // ← UUID sin tocar
        discount_value: toNullableNumber(data.discount_value),
        // -----------------------------------------------

        store_name: data.store_name || null,
        coupon_code: data.coupon_code || null,
        category: data.category || null,
        discount_type: data.discount_type || null,
        affiliate_id: data.affiliate_id || null,

        original_url: data.original_url,
        tracked_url: data.tracked_url,
        store_url: data.store_url || null,

        session_id: sessionId || null,
        user_agent: userAgent,
        referrer: referrer,

        device_type: this.detectDeviceType(userAgent),
        clicked_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }

      console.log("Inserting tracking data:", trackingData)

      const { data: result, error } = await this.supabase
        .from("tracking_clicks")
        .insert(trackingData)
        .select("id, tracked_url")
        .single()

      if (error) {
        console.error("Supabase insert error:", error)
        return { success: false, error: `Database error: ${error.message}` }
      }

      console.log("Successfully tracked click:", result)

      return {
        success: true,
        click_id: result.id,
      }
    } catch (error) {
      console.error("Error in trackClick:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Obtener estadísticas de clicks (simplificado)
  async getClickStats(filters?: { store_id?: number; coupon_id?: number }) {
    try {
      let query = this.supabase.from("tracking_clicks").select("*")

      if (filters?.store_id) {
        query = query.eq("store_id", filters.store_id.toString())
      }

      if (filters?.coupon_id) {
        query = query.eq("coupon_id", filters.coupon_id.toString())
      }

      const { data, error } = await query.order("created_at", { ascending: false }).limit(100)

      if (error) {
        console.error("Error fetching click stats:", error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error("Error in getClickStats:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

// Exportar instancia singleton
export const trackingService = new TrackingService()
