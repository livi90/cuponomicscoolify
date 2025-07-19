export interface UTMParams {
  // Parámetros UTM estándar
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string

  // Parámetros personalizados
  store_id?: string
  store_name?: string
  coupon_code?: string
  coupon_id?: string
  user_id?: string
  category?: string
  discount_type?: string
  discount_value?: string
  affiliate_id?: string
}

export interface TrackingLink {
  original_url: string
  tracked_url: string
  utm_params: UTMParams
  created_at: string
  expires_at?: string
  is_utm_applied: boolean
  exception_reason?: string
  affiliate_program?: string
  custom_params?: Record<string, any>
}

export interface UTMExceptionCheck {
  should_exclude: boolean
  exception_id?: string
  reason?: string
  affiliate_program?: string
  affiliate_id?: string
}

export interface UTMException {
  id: string
  store_id?: string
  domain?: string
  owner_id?: string
  reason?: string
  affiliate_program?: string
  affiliate_id?: string
}

export class UTMTrackingService {
  private static instance: UTMTrackingService
  private baseSource = "cuponomics"
  private apiBaseUrl: string
  private exceptions: UTMException[] = []
  private exceptionsLoaded = false

  // Tu owner_id específico - todas las tiendas con este owner_id se excluyen automáticamente
  private readonly ADMIN_OWNER_ID = "76f5271f-04cc-4747-afbe-e9398303f4a4"

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cuponomics.app"
  }

  static getInstance(): UTMTrackingService {
    if (!UTMTrackingService.instance) {
      UTMTrackingService.instance = new UTMTrackingService()
    }
    return UTMTrackingService.instance
  }

  /**
   * Verifica si una tienda debe ser excluida del tracking UTM
   * PRIORIDAD 1: Si el owner_id es el tuyo (admin) -> SIEMPRE excluir
   * PRIORIDAD 2: Verificar en base de datos por store_id, owner_id, domain
   */
  private async shouldExcludeFromUTM(url: string, storeId?: string, ownerId?: string): Promise<UTMExceptionCheck> {
    // PRIORIDAD 1: Si es tu owner_id, excluir automáticamente
    if (ownerId === this.ADMIN_OWNER_ID) {
      return {
        should_exclude: true,
        reason: "Tienda del administrador - URLs con tokens de afiliado ya incluidos",
        affiliate_program: "Admin Direct Links",
      }
    }

    // PRIORIDAD 2: Verificar excepciones en base de datos
    if (!this.apiBaseUrl) {
      return { should_exclude: false }
    }

    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname.toLowerCase()

      const response = await fetch(`${this.apiBaseUrl}/api/utm-exceptions/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: storeId,
          domain: domain,
          owner_id: ownerId,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        return {
          should_exclude: result.should_exclude || false,
          exception_id: result.exception_id,
          reason: result.reason,
          affiliate_program: result.affiliate_program,
          affiliate_id: result.affiliate_id,
        }
      }

      return { should_exclude: false }
    } catch (error) {
      console.error("Error checking UTM exclusions:", error)
      return { should_exclude: false }
    }
  }

  /**
   * Genera un enlace con parámetros UTM para tracking
   */
  async generateTrackingLink(originalUrl: string, params: UTMParams, ownerId?: string): Promise<TrackingLink> {
    const exclusionCheck = await this.shouldExcludeFromUTM(originalUrl, params.store_id, ownerId)

    if (exclusionCheck.should_exclude) {
      console.log(`🚫 UTM Excluido: ${exclusionCheck.reason}`, {
        store_id: params.store_id,
        store_name: params.store_name,
        owner_id: ownerId,
        url: originalUrl,
      })

      // Si tiene programa de afiliados específico, usar el affiliate_id
      let finalUrl = originalUrl
      if (exclusionCheck.affiliate_id && ownerId !== this.ADMIN_OWNER_ID) {
        const url = new URL(originalUrl)
        // Agregar parámetros de afiliado específicos según el programa
        if (exclusionCheck.affiliate_program?.includes("Amazon")) {
          url.searchParams.set("tag", exclusionCheck.affiliate_id)
        } else if (exclusionCheck.affiliate_program?.includes("AliExpress")) {
          url.searchParams.set("aff_trace_key", exclusionCheck.affiliate_id)
        } else if (exclusionCheck.affiliate_program?.includes("eBay")) {
          url.searchParams.set("campid", exclusionCheck.affiliate_id)
        }
        finalUrl = url.toString()
      }
      // Si es tu owner_id, dejar la URL completamente intacta (ya tiene tokens de afiliado)

      return {
        original_url: originalUrl,
        tracked_url: finalUrl,
        utm_params: params,
        created_at: new Date().toISOString(),
        is_utm_applied: false,
        exception_reason: exclusionCheck.reason,
        affiliate_program: exclusionCheck.affiliate_program,
      }
    }

    console.log(`✅ UTM Aplicado:`, {
      store_id: params.store_id,
      store_name: params.store_name,
      owner_id: ownerId,
      url: originalUrl,
    })

    const url = new URL(originalUrl)

    // Agregar parámetros UTM
    if (params.utm_source) url.searchParams.set("utm_source", params.utm_source)
    if (params.utm_medium) url.searchParams.set("utm_medium", params.utm_medium)
    if (params.utm_campaign) url.searchParams.set("utm_campaign", params.utm_campaign)
    if (params.utm_content) url.searchParams.set("utm_content", params.utm_content)
    if (params.utm_term) url.searchParams.set("utm_term", params.utm_term)

    // Parámetros personalizados
    if (params.store_id) url.searchParams.set("cp_store_id", params.store_id)
    if (params.store_name) url.searchParams.set("cp_store_name", params.store_name)
    if (params.coupon_code) url.searchParams.set("cp_coupon_code", params.coupon_code)
    if (params.coupon_id) url.searchParams.set("cp_coupon_id", params.coupon_id)
    if (params.user_id) url.searchParams.set("cp_user_id", params.user_id)
    if (params.category) url.searchParams.set("cp_category", params.category)
    if (params.discount_type) url.searchParams.set("cp_discount_type", params.discount_type)
    if (params.discount_value) url.searchParams.set("cp_discount_value", params.discount_value)
    if (params.affiliate_id) url.searchParams.set("cp_affiliate_id", params.affiliate_id)

    return {
      original_url: originalUrl,
      tracked_url: url.toString(),
      utm_params: params,
      created_at: new Date().toISOString(),
      is_utm_applied: true,
    }
  }

  /**
   * Registra un clic enviándolo a tu API externa
   */
  async trackClick(trackingParams: UTMParams, additionalData?: any): Promise<void> {
    if (!this.apiBaseUrl) {
      console.log("No API URL configured, skipping click tracking")
      return
    }

    try {
      const trackingData = {
        ...trackingParams,
        ...additionalData,
        timestamp: new Date().toISOString(),
        user_agent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
        referrer: typeof window !== "undefined" ? document.referrer : undefined,
      }

      // Enviar a tu API en Render
      const response = await fetch(`${this.apiBaseUrl}/api/tracking/click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackingData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Click tracked successfully:", result)
    } catch (error) {
      console.error("Error tracking click:", error)
      // No interrumpir la UX del usuario
    }
  }

  /**
   * Genera enlace para cupón específico con verificación mejorada
   */
  async generateCouponLink(
    storeUrl: string,
    couponData: {
      coupon_id: string
      coupon_code: string
      store_id: string
      store_name: string
      discount_type: string
      discount_value: string
      category?: string
      owner_id?: string // Parámetro clave para la verificación
    },
    userId?: string,
  ): Promise<TrackingLink> {
    const params: UTMParams = {
      utm_source: this.baseSource,
      utm_medium: "coupon",
      utm_campaign: `${couponData.store_name.toLowerCase().replace(/\s+/g, "-")}-coupons`,
      utm_content: `coupon-${couponData.coupon_code}`,
      store_id: couponData.store_id,
      store_name: couponData.store_name,
      coupon_code: couponData.coupon_code,
      coupon_id: couponData.coupon_id,
      user_id: userId,
      category: couponData.category,
      discount_type: couponData.discount_type,
      discount_value: couponData.discount_value,
    }

    return await this.generateTrackingLink(storeUrl, params, couponData.owner_id)
  }

  /**
   * Genera enlace para producto específico
   */
  async generateProductLink(
    productUrl: string,
    productData: {
      product_id: string
      store_id: string
      store_name: string
      category?: string
      price?: string
      owner_id?: string // Agregar owner_id también aquí
    },
    userId?: string,
    campaign?: string,
  ): Promise<TrackingLink> {
    const params: UTMParams = {
      utm_source: this.baseSource,
      utm_medium: "product",
      utm_campaign: campaign || `${productData.store_name.toLowerCase().replace(/\s+/g, "-")}-products`,
      utm_content: `product-${productData.product_id}`,
      store_id: productData.store_id,
      store_name: productData.store_name,
      user_id: userId,
      category: productData.category,
    }

    return await this.generateTrackingLink(productUrl, params, productData.owner_id)
  }

  /**
   * Genera enlace para tienda
   */
  async generateStoreLink(
    storeUrl: string,
    storeData: {
      store_id: string
      store_name: string
      category?: string
      owner_id?: string // Agregar owner_id también aquí
    },
    userId?: string,
    medium = "store-visit",
  ): Promise<TrackingLink> {
    const params: UTMParams = {
      utm_source: this.baseSource,
      utm_medium: medium,
      utm_campaign: `${storeData.store_name.toLowerCase().replace(/\s+/g, "-")}-store`,
      utm_content: `store-${storeData.store_id}`,
      store_id: storeData.store_id,
      store_name: storeData.store_name,
      user_id: userId,
      category: storeData.category,
    }

    return await this.generateTrackingLink(storeUrl, params, storeData.owner_id)
  }

  /**
   * Genera enlace para campaña específica
   */
  async generateCampaignLink(
    targetUrl: string,
    campaignData: {
      campaign_name: string
      campaign_type: string
      store_id?: string
      store_name?: string
    },
    userId?: string,
  ): Promise<TrackingLink> {
    const params: UTMParams = {
      utm_source: this.baseSource,
      utm_medium: campaignData.campaign_type,
      utm_campaign: campaignData.campaign_name,
      utm_content: `campaign-${campaignData.campaign_name}`,
      store_id: campaignData.store_id,
      store_name: campaignData.store_name,
      user_id: userId,
    }

    return await this.generateTrackingLink(targetUrl, params)
  }

  /**
   * Extrae parámetros de tracking de una URL
   */
  extractTrackingParams(url: string): UTMParams {
    const urlObj = new URL(url)
    const params: UTMParams = {}

    // Extraer parámetros UTM estándar
    params.utm_source = urlObj.searchParams.get("utm_source") || undefined
    params.utm_medium = urlObj.searchParams.get("utm_medium") || undefined
    params.utm_campaign = urlObj.searchParams.get("utm_campaign") || undefined
    params.utm_content = urlObj.searchParams.get("utm_content") || undefined
    params.utm_term = urlObj.searchParams.get("utm_term") || undefined

    // Extraer parámetros personalizados
    params.store_id = urlObj.searchParams.get("cp_store_id") || undefined
    params.store_name = urlObj.searchParams.get("cp_store_name") || undefined
    params.coupon_code = urlObj.searchParams.get("cp_coupon_code") || undefined
    params.coupon_id = urlObj.searchParams.get("cp_coupon_id") || undefined
    params.user_id = urlObj.searchParams.get("cp_user_id") || undefined
    params.category = urlObj.searchParams.get("cp_category") || undefined
    params.discount_type = urlObj.searchParams.get("cp_discount_type") || undefined
    params.discount_value = urlObj.searchParams.get("cp_discount_value") || undefined
    params.affiliate_id = urlObj.searchParams.get("cp_affiliate_id") || undefined

    return params
  }

  /**
   * Método para verificar si un owner_id es el admin
   */
  isAdminOwner(ownerId?: string): boolean {
    return ownerId === this.ADMIN_OWNER_ID
  }

  /**
   * Obtiene la lista actual de excepciones
   */
  async getExceptions(): Promise<UTMException[]> {
    await this.loadExceptions()
    return this.exceptions
  }

  /**
   * Fuerza la recarga de excepciones desde la base de datos
   */
  async reloadExceptions(): Promise<void> {
    this.exceptionsLoaded = false
    await this.loadExceptions()
  }

  /**
   * Carga las excepciones desde la base de datos
   */
  private async loadExceptions(): Promise<void> {
    if (this.exceptionsLoaded) {
      return
    }

    if (!this.apiBaseUrl) {
      console.warn("API Base URL not configured, skipping loading UTM exceptions")
      return
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/utm-exceptions`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        this.exceptions = await response.json()
        this.exceptionsLoaded = true
        console.log("UTM exceptions loaded successfully")
      } else {
        console.error("Failed to load UTM exceptions:", response.status)
      }
    } catch (error) {
      console.error("Error loading UTM exceptions:", error)
    }
  }
}

export const utmTracker = UTMTrackingService.getInstance()
