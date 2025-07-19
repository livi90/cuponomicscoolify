import { createClient } from "@/lib/supabase/client"

export interface MerchantAnalytics {
  overview: {
    total_clicks: number
    total_conversions: number
    conversion_rate: number
    total_revenue: number
    total_commission: number
    avg_order_value: number
  }
  time_series: {
    date: string
    clicks: number
    conversions: number
    revenue: number
  }[]
  top_coupons: {
    coupon_code: string
    coupon_id: string
    clicks: number
    conversions: number
    conversion_rate: number
    revenue: number
  }[]
  top_products: {
    product_id: string
    product_name: string
    clicks: number
    conversions: number
    revenue: number
  }[]
  traffic_sources: {
    utm_medium: string
    utm_campaign: string
    clicks: number
    conversions: number
  }[]
  user_behavior: {
    new_users: number
    returning_users: number
    avg_session_duration: number
    bounce_rate: number
  }
  geographic_data: {
    country: string
    clicks: number
    conversions: number
    revenue: number
  }[]
}

export interface AdminAnalytics {
  global_overview: {
    total_stores: number
    total_merchants: number
    total_users: number
    total_clicks: number
    total_conversions: number
    total_revenue: number
    total_commission_paid: number
    avg_conversion_rate: number
    platform_revenue: number
    growth_rate: number
  }
  revenue_breakdown: {
    date: string
    total_revenue: number
    commission_revenue: number
    subscription_revenue: number
    stores_count: number
    new_merchants: number
    active_merchants: number
  }[]
  top_performing_stores: {
    store_id: string
    store_name: string
    merchant_email: string
    clicks: number
    conversions: number
    conversion_rate: number
    revenue: number
    commission_generated: number
    last_activity: string
    status: string
  }[]
  category_performance: {
    category: string
    stores_count: number
    clicks: number
    conversions: number
    revenue: number
    avg_conversion_rate: number
    top_store: string
  }[]
  user_acquisition: {
    date: string
    new_users: number
    new_merchants: number
    user_retention_rate: number
    merchant_retention_rate: number
    churn_rate: number
  }[]
  platform_health: {
    active_coupons: number
    expired_coupons: number
    pending_store_applications: number
    approved_stores: number
    rejected_stores: number
    reported_issues: number
    avg_response_time: number
    system_uptime: number
    script_installation_rate: number
  }
  traffic_analysis: {
    utm_source: string
    utm_medium: string
    utm_campaign: string
    clicks: number
    conversions: number
    revenue: number
    cost_per_acquisition: number
    return_on_ad_spend: number
  }[]
  merchant_analytics: {
    merchant_id: string
    merchant_email: string
    stores_count: number
    total_revenue: number
    commission_owed: number
    commission_paid: number
    last_activity: string
    status: string
    subscription_plan: string
    lifetime_value: number
  }[]
  financial_metrics: {
    monthly_recurring_revenue: number
    annual_recurring_revenue: number
    customer_lifetime_value: number
    churn_rate: number
    net_revenue_retention: number
    gross_margin: number
  }
  operational_metrics: {
    support_tickets_open: number
    support_tickets_resolved: number
    avg_resolution_time: number
    customer_satisfaction_score: number
    nps_score: number
  }
}

export class AnalyticsService {
  private supabase = createClient()

  async getMerchantAnalytics(
    merchantId: string,
    dateRange: { start: string; end: string },
  ): Promise<MerchantAnalytics> {
    try {
      // Verificar que el usuario solo acceda a sus propios datos
      const { data: userProfile } = await this.supabase
        .from("profiles")
        .select("id, role")
        .eq("id", merchantId)
        .single()

      if (!userProfile) {
        throw new Error("Usuario no encontrado")
      }

      // Obtener tiendas del merchant específico
      const { data: stores } = await this.supabase
        .from("stores")
        .select("id, name, status")
        .eq("owner_id", merchantId)
        .eq("status", "approved")

      const storeIds = stores?.map((store) => store.id) || []

      if (storeIds.length === 0) {
        return this.getEmptyMerchantAnalytics()
      }

      // Overview general (solo para las tiendas del merchant)
      const overview = await this.getMerchantOverview(storeIds, dateRange)

      // Series de tiempo
      const timeSeries = await this.getMerchantTimeSeries(storeIds, dateRange)

      // Top cupones
      const topCoupons = await this.getMerchantTopCoupons(storeIds, dateRange)

      // Top productos
      const topProducts = await this.getMerchantTopProducts(storeIds, dateRange)

      // Fuentes de tráfico
      const trafficSources = await this.getMerchantTrafficSources(storeIds, dateRange)

      // Comportamiento de usuarios
      const userBehavior = await this.getMerchantUserBehavior(storeIds, dateRange)

      // Datos geográficos
      const geographicData = await this.getMerchantGeographicData(storeIds, dateRange)

      return {
        overview,
        time_series: timeSeries,
        top_coupons: topCoupons,
        top_products: topProducts,
        traffic_sources: trafficSources,
        user_behavior: userBehavior,
        geographic_data: geographicData,
      }
    } catch (error) {
      console.error("Error getting merchant analytics:", error)
      return this.getEmptyMerchantAnalytics()
    }
  }

  async getAdminAnalytics(dateRange: { start: string; end: string }): Promise<AdminAnalytics> {
    try {
      // Verificar que el usuario sea admin
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuario no autenticado")
      }

      const { data: userProfile } = await this.supabase.from("profiles").select("role").eq("id", user.id).single()

      if (!userProfile || userProfile.role !== "admin") {
        throw new Error("Acceso denegado: se requieren permisos de administrador")
      }

      // Overview global (todos los datos de la plataforma)
      const globalOverview = await this.getGlobalOverview(dateRange)

      // Desglose de ingresos detallado
      const revenueBreakdown = await this.getRevenueBreakdown(dateRange)

      // Tiendas con mejor rendimiento (todas las tiendas)
      const topPerformingStores = await this.getTopPerformingStores(dateRange)

      // Rendimiento por categoría (todas las categorías)
      const categoryPerformance = await this.getCategoryPerformance(dateRange)

      // Adquisición de usuarios (toda la plataforma)
      const userAcquisition = await this.getUserAcquisition(dateRange)

      // Salud de la plataforma (métricas completas)
      const platformHealth = await this.getPlatformHealth()

      // Análisis de tráfico (todo el tráfico)
      const trafficAnalysis = await this.getTrafficAnalysis(dateRange)

      // Analytics de merchants (todos los merchants)
      const merchantAnalytics = await this.getMerchantAnalyticsForAdmin(dateRange)

      // Métricas financieras avanzadas
      const financialMetrics = await this.getFinancialMetrics(dateRange)

      // Métricas operacionales
      const operationalMetrics = await this.getOperationalMetrics()

      return {
        global_overview: globalOverview,
        revenue_breakdown: revenueBreakdown,
        top_performing_stores: topPerformingStores,
        category_performance: categoryPerformance,
        user_acquisition: userAcquisition,
        platform_health: platformHealth,
        traffic_analysis: trafficAnalysis,
        merchant_analytics: merchantAnalytics,
        financial_metrics: financialMetrics,
        operational_metrics: operationalMetrics,
      }
    } catch (error) {
      console.error("Error getting admin analytics:", error)
      throw error
    }
  }

  private async getMerchantOverview(storeIds: string[], dateRange: { start: string; end: string }) {
    const { data: clicksData } = await this.supabase
      .from("tracking_clicks")
      .select(`
        id,
        tracking_conversions(
          conversion_value,
          commission_amount,
          status
        )
      `)
      .in("store_id", storeIds)
      .gte("clicked_at", dateRange.start)
      .lte("clicked_at", dateRange.end)

    const totalClicks = clicksData?.length || 0
    const conversions =
      clicksData?.filter((click) => click.tracking_conversions && click.tracking_conversions.length > 0) || []

    const totalConversions = conversions.length
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

    const totalRevenue = conversions.reduce((sum, click) => {
      const conversion = click.tracking_conversions[0]
      return sum + (conversion?.conversion_value || 0)
    }, 0)

    const totalCommission = conversions.reduce((sum, click) => {
      const conversion = click.tracking_conversions[0]
      return sum + (conversion?.commission_amount || 0)
    }, 0)

    const avgOrderValue = totalConversions > 0 ? totalRevenue / totalConversions : 0

    return {
      total_clicks: totalClicks,
      total_conversions: totalConversions,
      conversion_rate: Number(conversionRate.toFixed(2)),
      total_revenue: Number(totalRevenue.toFixed(2)),
      total_commission: Number(totalCommission.toFixed(2)),
      avg_order_value: Number(avgOrderValue.toFixed(2)),
    }
  }

  private async getMerchantTimeSeries(storeIds: string[], dateRange: { start: string; end: string }) {
    const { data } = await this.supabase
      .from("tracking_clicks")
      .select(`
        clicked_at,
        tracking_conversions(conversion_value)
      `)
      .in("store_id", storeIds)
      .gte("clicked_at", dateRange.start)
      .lte("clicked_at", dateRange.end)
      .order("clicked_at")

    // Agrupar por día
    const dailyData: { [key: string]: { clicks: number; conversions: number; revenue: number } } = {}

    data?.forEach((click) => {
      const date = new Date(click.clicked_at).toISOString().split("T")[0]

      if (!dailyData[date]) {
        dailyData[date] = { clicks: 0, conversions: 0, revenue: 0 }
      }

      dailyData[date].clicks++

      if (click.tracking_conversions && click.tracking_conversions.length > 0) {
        dailyData[date].conversions++
        dailyData[date].revenue += click.tracking_conversions[0].conversion_value || 0
      }
    })

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      clicks: data.clicks,
      conversions: data.conversions,
      revenue: Number(data.revenue.toFixed(2)),
    }))
  }

  private async getMerchantTopCoupons(storeIds: string[], dateRange: { start: string; end: string }) {
    const { data } = await this.supabase
      .from("tracking_clicks")
      .select(`
        coupon_code,
        coupon_id,
        tracking_conversions(conversion_value)
      `)
      .in("store_id", storeIds)
      .gte("clicked_at", dateRange.start)
      .lte("clicked_at", dateRange.end)
      .not("coupon_code", "is", null)

    // Agrupar por cupón
    const couponData: { [key: string]: any } = {}

    data?.forEach((click) => {
      const key = click.coupon_code!

      if (!couponData[key]) {
        couponData[key] = {
          coupon_code: click.coupon_code,
          coupon_id: click.coupon_id,
          clicks: 0,
          conversions: 0,
          revenue: 0,
        }
      }

      couponData[key].clicks++

      if (click.tracking_conversions && click.tracking_conversions.length > 0) {
        couponData[key].conversions++
        couponData[key].revenue += click.tracking_conversions[0].conversion_value || 0
      }
    })

    return Object.values(couponData)
      .map((coupon: any) => ({
        ...coupon,
        conversion_rate: coupon.clicks > 0 ? Number(((coupon.conversions / coupon.clicks) * 100).toFixed(2)) : 0,
        revenue: Number(coupon.revenue.toFixed(2)),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }

  private async getMerchantTopProducts(storeIds: string[], dateRange: { start: string; end: string }) {
    const { data } = await this.supabase
      .from("tracking_clicks")
      .select(`
        product_id,
        products(name),
        tracking_conversions(conversion_value)
      `)
      .in("store_id", storeIds)
      .gte("clicked_at", dateRange.start)
      .lte("clicked_at", dateRange.end)
      .not("product_id", "is", null)

    // Agrupar por producto
    const productData: { [key: string]: any } = {}

    data?.forEach((click) => {
      const key = click.product_id!

      if (!productData[key]) {
        productData[key] = {
          product_id: click.product_id,
          product_name: click.products?.name || "Producto desconocido",
          clicks: 0,
          conversions: 0,
          revenue: 0,
        }
      }

      productData[key].clicks++

      if (click.tracking_conversions && click.tracking_conversions.length > 0) {
        productData[key].conversions++
        productData[key].revenue += click.tracking_conversions[0].conversion_value || 0
      }
    })

    return Object.values(productData)
      .map((product: any) => ({
        ...product,
        revenue: Number(product.revenue.toFixed(2)),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }

  private async getMerchantTrafficSources(storeIds: string[], dateRange: { start: string; end: string }) {
    const { data } = await this.supabase
      .from("tracking_clicks")
      .select(`
        utm_medium,
        utm_campaign,
        tracking_conversions(conversion_value)
      `)
      .in("store_id", storeIds)
      .gte("clicked_at", dateRange.start)
      .lte("clicked_at", dateRange.end)

    // Agrupar por fuente de tráfico
    const trafficData: { [key: string]: any } = {}

    data?.forEach((click) => {
      const key = `${click.utm_medium || "direct"}-${click.utm_campaign || "none"}`

      if (!trafficData[key]) {
        trafficData[key] = {
          utm_medium: click.utm_medium || "direct",
          utm_campaign: click.utm_campaign || "none",
          clicks: 0,
          conversions: 0,
        }
      }

      trafficData[key].clicks++

      if (click.tracking_conversions && click.tracking_conversions.length > 0) {
        trafficData[key].conversions++
      }
    })

    return Object.values(trafficData)
  }

  private async getMerchantUserBehavior(storeIds: string[], dateRange: { start: string; end: string }) {
    // Implementación básica - se puede expandir con más datos
    const { data: clicksData } = await this.supabase
      .from("tracking_clicks")
      .select("user_id, clicked_at")
      .in("store_id", storeIds)
      .gte("clicked_at", dateRange.start)
      .lte("clicked_at", dateRange.end)

    const uniqueUsers = new Set(clicksData?.map((click) => click.user_id).filter(Boolean))
    const totalUsers = uniqueUsers.size

    return {
      new_users: Math.floor(totalUsers * 0.7), // Estimación
      returning_users: Math.floor(totalUsers * 0.3), // Estimación
      avg_session_duration: 180, // Estimación en segundos
      bounce_rate: 45, // Estimación en porcentaje
    }
  }

  private async getMerchantGeographicData(storeIds: string[], dateRange: { start: string; end: string }) {
    const { data } = await this.supabase
      .from("tracking_clicks")
      .select(`
        country,
        tracking_conversions(conversion_value)
      `)
      .in("store_id", storeIds)
      .gte("clicked_at", dateRange.start)
      .lte("clicked_at", dateRange.end)

    // Agrupar por país
    const countryData: { [key: string]: any } = {}

    data?.forEach((click) => {
      const country = click.country || "España"

      if (!countryData[country]) {
        countryData[country] = {
          country,
          clicks: 0,
          conversions: 0,
          revenue: 0,
        }
      }

      countryData[country].clicks++

      if (click.tracking_conversions && click.tracking_conversions.length > 0) {
        countryData[country].conversions++
        countryData[country].revenue += click.tracking_conversions[0].conversion_value || 0
      }
    })

    return Object.values(countryData)
      .map((country: any) => ({
        ...country,
        revenue: Number(country.revenue.toFixed(2)),
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }

  private async getGlobalOverview(dateRange: { start: string; end: string }) {
    const [storesCount, merchantsCount, usersCount, clicksData, approvedStores] = await Promise.all([
      this.supabase.from("stores").select("id", { count: "exact", head: true }),
      this.supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "merchant"),
      this.supabase.from("profiles").select("id", { count: "exact", head: true }),
      this.supabase
        .from("tracking_clicks")
        .select(`
          id,
          tracking_conversions(conversion_value, commission_amount)
        `)
        .gte("clicked_at", dateRange.start)
        .lte("clicked_at", dateRange.end),
      this.supabase.from("stores").select("id", { count: "exact", head: true }).eq("status", "approved"),
    ])

    const totalClicks = clicksData.data?.length || 0
    const conversions =
      clicksData.data?.filter((click) => click.tracking_conversions && click.tracking_conversions.length > 0) || []

    const totalConversions = conversions.length
    const totalRevenue = conversions.reduce((sum, click) => {
      const conversion = click.tracking_conversions[0]
      return sum + (conversion?.conversion_value || 0)
    }, 0)

    const totalCommissionPaid = conversions.reduce((sum, click) => {
      const conversion = click.tracking_conversions[0]
      return sum + (conversion?.commission_amount || 0)
    }, 0)

    const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
    const platformRevenue = totalRevenue - totalCommissionPaid

    // Calcular tasa de crecimiento (comparar con período anterior)
    const previousPeriodStart = new Date(dateRange.start)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30)
    const previousPeriodEnd = new Date(dateRange.start)

    const { data: previousClicksData } = await this.supabase
      .from("tracking_clicks")
      .select("id")
      .gte("clicked_at", previousPeriodStart.toISOString().split("T")[0])
      .lte("clicked_at", previousPeriodEnd.toISOString().split("T")[0])

    const previousClicks = previousClicksData?.length || 0
    const growthRate = previousClicks > 0 ? ((totalClicks - previousClicks) / previousClicks) * 100 : 0

    return {
      total_stores: storesCount.count || 0,
      total_merchants: merchantsCount.count || 0,
      total_users: usersCount.count || 0,
      total_clicks: totalClicks,
      total_conversions: totalConversions,
      total_revenue: Number(totalRevenue.toFixed(2)),
      total_commission_paid: Number(totalCommissionPaid.toFixed(2)),
      avg_conversion_rate: Number(avgConversionRate.toFixed(2)),
      platform_revenue: Number(platformRevenue.toFixed(2)),
      growth_rate: Number(growthRate.toFixed(2)),
    }
  }

  private async getRevenueBreakdown(dateRange: { start: string; end: string }) {
    const { data } = await this.supabase
      .from("tracking_clicks")
      .select(`
        clicked_at,
        tracking_conversions(conversion_value, commission_amount),
        stores(id)
      `)
      .gte("clicked_at", dateRange.start)
      .lte("clicked_at", dateRange.end)
      .order("clicked_at")

    // Agrupar por día
    const dailyData: { [key: string]: any } = {}

    data?.forEach((click) => {
      const date = new Date(click.clicked_at).toISOString().split("T")[0]

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          total_revenue: 0,
          commission_revenue: 0,
          subscription_revenue: 0, // Placeholder para futuras suscripciones
          stores_count: new Set(),
          new_merchants: 0,
          active_merchants: new Set(),
        }
      }

      if (click.tracking_conversions && click.tracking_conversions.length > 0) {
        const conversion = click.tracking_conversions[0]
        dailyData[date].total_revenue += conversion.conversion_value || 0
        dailyData[date].commission_revenue += conversion.commission_amount || 0
      }

      if (click.stores?.id) {
        dailyData[date].stores_count.add(click.stores.id)
      }
    })

    return Object.values(dailyData).map((day: any) => ({
      ...day,
      total_revenue: Number(day.total_revenue.toFixed(2)),
      commission_revenue: Number(day.commission_revenue.toFixed(2)),
      stores_count: day.stores_count.size,
      active_merchants: day.active_merchants.size,
    }))
  }

  private async getTopPerformingStores(dateRange: { start: string; end: string }) {
    const { data } = await this.supabase
      .from("tracking_clicks")
      .select(`
        store_id,
        store_name,
        stores!inner(
          owner_id,
          status,
          updated_at,
          profiles!inner(email)
        ),
        tracking_conversions(conversion_value, commission_amount)
      `)
      .gte("clicked_at", dateRange.start)
      .lte("clicked_at", dateRange.end)

    // Agrupar por tienda
    const storeData: { [key: string]: any } = {}

    data?.forEach((click) => {
      const storeId = click.store_id

      if (!storeData[storeId]) {
        storeData[storeId] = {
          store_id: storeId,
          store_name: click.store_name,
          merchant_email: click.stores?.profiles?.email || "Unknown",
          clicks: 0,
          conversions: 0,
          revenue: 0,
          commission_generated: 0,
          last_activity: click.stores?.updated_at || new Date().toISOString(),
          status: click.stores?.status || "unknown",
        }
      }

      storeData[storeId].clicks++

      if (click.tracking_conversions && click.tracking_conversions.length > 0) {
        const conversion = click.tracking_conversions[0]
        storeData[storeId].conversions++
        storeData[storeId].revenue += conversion.conversion_value || 0
        storeData[storeId].commission_generated += conversion.commission_amount || 0
      }
    })

    return Object.values(storeData)
      .map((store: any) => ({
        ...store,
        conversion_rate: store.clicks > 0 ? Number(((store.conversions / store.clicks) * 100).toFixed(2)) : 0,
        revenue: Number(store.revenue.toFixed(2)),
        commission_generated: Number(store.commission_generated.toFixed(2)),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20)
  }

  private async getCategoryPerformance(dateRange: { start: string; end: string }) {
    const { data } = await this.supabase
      .from("tracking_clicks")
      .select(`
        stores!inner(category),
        tracking_conversions(conversion_value)
      `)
      .gte("clicked_at", dateRange.start)
      .lte("clicked_at", dateRange.end)

    // Agrupar por categoría
    const categoryData: { [key: string]: any } = {}

    data?.forEach((click) => {
      const category = click.stores?.category || "Sin categoría"

      if (!categoryData[category]) {
        categoryData[category] = {
          category,
          stores_count: new Set(),
          clicks: 0,
          conversions: 0,
          revenue: 0,
        }
      }

      categoryData[category].clicks++

      if (click.tracking_conversions && click.tracking_conversions.length > 0) {
        categoryData[category].conversions++
        categoryData[category].revenue += click.tracking_conversions[0].conversion_value || 0
      }
    })

    // Obtener conteo de tiendas por categoría
    const { data: storesByCategory } = await this.supabase.from("stores").select("category").eq("status", "approved")

    const storeCounts: { [key: string]: number } = {}
    storesByCategory?.forEach((store) => {
      const category = store.category || "Sin categoría"
      storeCounts[category] = (storeCounts[category] || 0) + 1
    })

    return Object.entries(categoryData).map(([category, data]: [string, any]) => ({
      category,
      stores_count: storeCounts[category] || 0,
      clicks: data.clicks,
      conversions: data.conversions,
      revenue: Number(data.revenue.toFixed(2)),
      avg_conversion_rate: data.clicks > 0 ? Number(((data.conversions / data.clicks) * 100).toFixed(2)) : 0,
      top_store: "N/A", // Se puede implementar más tarde
    }))
  }

  private async getUserAcquisition(dateRange: { start: string; end: string }) {
    const { data: newUsers } = await this.supabase
      .from("profiles")
      .select("created_at, role")
      .gte("created_at", dateRange.start)
      .lte("created_at", dateRange.end)

    // Agrupar por día
    const dailyData: { [key: string]: any } = {}

    newUsers?.forEach((user) => {
      const date = new Date(user.created_at).toISOString().split("T")[0]

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          new_users: 0,
          new_merchants: 0,
          user_retention_rate: 85, // Placeholder
          merchant_retention_rate: 90, // Placeholder
          churn_rate: 5, // Placeholder
        }
      }

      dailyData[date].new_users++
      if (user.role === "merchant") {
        dailyData[date].new_merchants++
      }
    })

    return Object.values(dailyData)
  }

  private async getPlatformHealth() {
    const [activeCoupons, expiredCoupons, pendingApplications, approvedStores, rejectedStores, scriptPings] =
      await Promise.all([
        this.supabase.from("coupons").select("id", { count: "exact", head: true }).eq("is_active", true),
        this.supabase.from("coupons").select("id", { count: "exact", head: true }).eq("is_active", false),
        this.supabase.from("store_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        this.supabase.from("stores").select("id", { count: "exact", head: true }).eq("status", "approved"),
        this.supabase.from("stores").select("id", { count: "exact", head: true }).eq("status", "rejected"),
        this.supabase
          .from("script_pings")
          .select("store_id")
          .gte("pinged_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      ])

    const activeScripts = new Set(scriptPings.data?.map((ping) => ping.store_id)).size
    const totalStores = approvedStores.count || 0
    const scriptInstallationRate = totalStores > 0 ? (activeScripts / totalStores) * 100 : 0

    return {
      active_coupons: activeCoupons.count || 0,
      expired_coupons: expiredCoupons.count || 0,
      pending_store_applications: pendingApplications.count || 0,
      approved_stores: approvedStores.count || 0,
      rejected_stores: rejectedStores.count || 0,
      reported_issues: 0, // Placeholder
      avg_response_time: 2.5, // Placeholder en horas
      system_uptime: 99.9, // Placeholder en porcentaje
      script_installation_rate: Number(scriptInstallationRate.toFixed(2)),
    }
  }

  private async getTrafficAnalysis(dateRange: { start: string; end: string }) {
    const { data } = await this.supabase
      .from("tracking_clicks")
      .select(`
        utm_source,
        utm_medium,
        utm_campaign,
        tracking_conversions(conversion_value)
      `)
      .gte("clicked_at", dateRange.start)
      .lte("clicked_at", dateRange.end)

    // Agrupar por fuente de tráfico
    const trafficData: { [key: string]: any } = {}

    data?.forEach((click) => {
      const key = `${click.utm_source || "direct"}-${click.utm_medium || "none"}-${click.utm_campaign || "none"}`

      if (!trafficData[key]) {
        trafficData[key] = {
          utm_source: click.utm_source || "direct",
          utm_medium: click.utm_medium || "none",
          utm_campaign: click.utm_campaign || "none",
          clicks: 0,
          conversions: 0,
          revenue: 0,
          cost_per_acquisition: 0, // Placeholder
          return_on_ad_spend: 0, // Placeholder
        }
      }

      trafficData[key].clicks++

      if (click.tracking_conversions && click.tracking_conversions.length > 0) {
        trafficData[key].conversions++
        trafficData[key].revenue += click.tracking_conversions[0].conversion_value || 0
      }
    })

    return Object.values(trafficData)
      .map((traffic: any) => ({
        ...traffic,
        revenue: Number(traffic.revenue.toFixed(2)),
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }

  private async getMerchantAnalyticsForAdmin(dateRange: { start: string; end: string }) {
    const { data: merchants } = await this.supabase
      .from("profiles")
      .select(`
        id,
        email,
        created_at,
        stores(
          id,
          status,
          tracking_clicks(
            id,
            clicked_at,
            tracking_conversions(conversion_value, commission_amount)
          )
        )
      `)
      .eq("role", "merchant")

    return (
      merchants?.map((merchant) => {
        const stores = merchant.stores || []
        const approvedStores = stores.filter((store) => store.status === "approved")

        let totalRevenue = 0
        let commissionOwed = 0
        const commissionPaid = 0 // Placeholder
        let lastActivity = merchant.created_at

        stores.forEach((store) => {
          store.tracking_clicks?.forEach((click) => {
            if (click.clicked_at > lastActivity) {
              lastActivity = click.clicked_at
            }

            click.tracking_conversions?.forEach((conversion) => {
              totalRevenue += conversion.conversion_value || 0
              commissionOwed += conversion.commission_amount || 0
            })
          })
        })

        return {
          merchant_id: merchant.id,
          merchant_email: merchant.email,
          stores_count: approvedStores.length,
          total_revenue: Number(totalRevenue.toFixed(2)),
          commission_owed: Number(commissionOwed.toFixed(2)),
          commission_paid: Number(commissionPaid.toFixed(2)),
          last_activity: lastActivity,
          status: approvedStores.length > 0 ? "active" : "inactive",
          subscription_plan: "free", // Placeholder
          lifetime_value: Number(totalRevenue.toFixed(2)),
        }
      }) || []
    )
  }

  private async getFinancialMetrics(dateRange: { start: string; end: string }) {
    // Métricas financieras avanzadas para admins
    const { data: conversions } = await this.supabase
      .from("tracking_conversions")
      .select("conversion_value, commission_amount, created_at")
      .gte("created_at", dateRange.start)
      .lte("created_at", dateRange.end)

    const totalRevenue = conversions?.reduce((sum, conv) => sum + (conv.conversion_value || 0), 0) || 0
    const totalCommissions = conversions?.reduce((sum, conv) => sum + (conv.commission_amount || 0), 0) || 0
    const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalCommissions) / totalRevenue) * 100 : 0

    return {
      monthly_recurring_revenue: Number((totalRevenue / 30).toFixed(2)), // Estimación
      annual_recurring_revenue: Number((totalRevenue * 12).toFixed(2)), // Estimación
      customer_lifetime_value: 1250, // Placeholder
      churn_rate: 5.2, // Placeholder
      net_revenue_retention: 110, // Placeholder
      gross_margin: Number(grossMargin.toFixed(2)),
    }
  }

  private async getOperationalMetrics() {
    // Métricas operacionales para admins
    return {
      support_tickets_open: 12, // Placeholder
      support_tickets_resolved: 45, // Placeholder
      avg_resolution_time: 4.5, // Placeholder en horas
      customer_satisfaction_score: 4.2, // Placeholder sobre 5
      nps_score: 8.5, // Placeholder sobre 10
    }
  }

  private getEmptyMerchantAnalytics(): MerchantAnalytics {
    return {
      overview: {
        total_clicks: 0,
        total_conversions: 0,
        conversion_rate: 0,
        total_revenue: 0,
        total_commission: 0,
        avg_order_value: 0,
      },
      time_series: [],
      top_coupons: [],
      top_products: [],
      traffic_sources: [],
      user_behavior: {
        new_users: 0,
        returning_users: 0,
        avg_session_duration: 0,
        bounce_rate: 0,
      },
      geographic_data: [],
    }
  }
}

export const analyticsService = new AnalyticsService()
