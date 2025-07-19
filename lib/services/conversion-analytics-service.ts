import { createClient } from "@/lib/supabase/client"

export interface ConversionAnalytics {
  overview: {
    total_conversions: number
    total_revenue: number
    total_commission: number
    conversion_rate: number
    avg_order_value: number
    pending_commission: number
  }
  time_series: {
    date: string
    conversions: number
    revenue: number
    commission: number
    clicks: number
  }[]
  top_stores: {
    store_id: string
    store_name: string
    conversions: number
    revenue: number
    commission: number
    conversion_rate: number
  }[]
  top_coupons: {
    coupon_id: string
    coupon_code: string
    conversions: number
    revenue: number
    commission: number
  }[]
  conversion_status: {
    pending: number
    confirmed: number
    cancelled: number
    refunded: number
  }
  traffic_sources: {
    utm_source: string
    utm_medium: string
    conversions: number
    revenue: number
  }[]
  recent_conversions: {
    id: string
    order_id: string
    conversion_value: number
    commission_amount: number
    status: string
    store_name: string
    converted_at: string
    coupon_code?: string
  }[]
}

export class ConversionAnalyticsService {
  private supabase = createClient()

  async getMerchantConversions(
    merchantId: string,
    dateRange: { start: string; end: string },
  ): Promise<ConversionAnalytics> {
    try {
      // Obtener tiendas del merchant
      const { data: stores } = await this.supabase.from("stores").select("id, name").eq("owner_id", merchantId)

      const storeIds = stores?.map((store) => store.id) || []

      if (storeIds.length === 0) {
        return this.getEmptyAnalytics()
      }

      // Obtener conversiones del período
      const { data: conversions } = await this.supabase
        .from("tracking_conversions")
        .select(`
          *,
          stores!inner(name),
          coupons(code)
        `)
        .in("store_id", storeIds)
        .gte("converted_at", dateRange.start)
        .lte("converted_at", dateRange.end)
        .order("converted_at", { ascending: false })

      // Obtener clicks del mismo período para calcular conversion rate
      const { data: clicks } = await this.supabase
        .from("tracking_clicks")
        .select("id, store_id, clicked_at")
        .in("store_id", storeIds)
        .gte("clicked_at", dateRange.start)
        .lte("clicked_at", dateRange.end)

      const totalClicks = clicks?.length || 0
      const totalConversions = conversions?.length || 0

      // Calcular overview
      const overview = this.calculateOverview(conversions || [], totalClicks)

      // Calcular series de tiempo
      const timeSeries = this.calculateTimeSeries(conversions || [], clicks || [])

      // Top tiendas
      const topStores = this.calculateTopStores(conversions || [], stores || [])

      // Top cupones
      const topCoupons = this.calculateTopCoupons(conversions || [])

      // Estado de conversiones
      const conversionStatus = this.calculateConversionStatus(conversions || [])

      // Fuentes de tráfico
      const trafficSources = this.calculateTrafficSources(conversions || [])

      // Conversiones recientes
      const recentConversions = this.formatRecentConversions(conversions?.slice(0, 10) || [])

      return {
        overview,
        time_series: timeSeries,
        top_stores: topStores,
        top_coupons: topCoupons,
        conversion_status: conversionStatus,
        traffic_sources: trafficSources,
        recent_conversions: recentConversions,
      }
    } catch (error) {
      console.error("Error getting conversion analytics:", error)
      return this.getEmptyAnalytics()
    }
  }

  private calculateOverview(conversions: any[], totalClicks: number) {
    const totalConversions = conversions.length
    const totalRevenue = conversions.reduce((sum, conv) => sum + (conv.conversion_value || 0), 0)
    const totalCommission = conversions.reduce((sum, conv) => sum + (conv.commission_amount || 0), 0)
    const pendingCommission = conversions
      .filter((conv) => conv.status === "pending")
      .reduce((sum, conv) => sum + (conv.commission_amount || 0), 0)

    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
    const avgOrderValue = totalConversions > 0 ? totalRevenue / totalConversions : 0

    return {
      total_conversions: totalConversions,
      total_revenue: Number(totalRevenue.toFixed(2)),
      total_commission: Number(totalCommission.toFixed(2)),
      conversion_rate: Number(conversionRate.toFixed(2)),
      avg_order_value: Number(avgOrderValue.toFixed(2)),
      pending_commission: Number(pendingCommission.toFixed(2)),
    }
  }

  private calculateTimeSeries(conversions: any[], clicks: any[]) {
    const dailyData: { [key: string]: any } = {}

    // Procesar conversiones
    conversions.forEach((conv) => {
      const date = new Date(conv.converted_at).toISOString().split("T")[0]
      if (!dailyData[date]) {
        dailyData[date] = { conversions: 0, revenue: 0, commission: 0, clicks: 0 }
      }
      dailyData[date].conversions++
      dailyData[date].revenue += conv.conversion_value || 0
      dailyData[date].commission += conv.commission_amount || 0
    })

    // Procesar clicks
    clicks.forEach((click) => {
      const date = new Date(click.clicked_at).toISOString().split("T")[0]
      if (!dailyData[date]) {
        dailyData[date] = { conversions: 0, revenue: 0, commission: 0, clicks: 0 }
      }
      dailyData[date].clicks++
    })

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        conversions: data.conversions,
        revenue: Number(data.revenue.toFixed(2)),
        commission: Number(data.commission.toFixed(2)),
        clicks: data.clicks,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  private calculateTopStores(conversions: any[], stores: any[]) {
    const storeData: { [key: string]: any } = {}

    conversions.forEach((conv) => {
      const storeId = conv.store_id
      if (!storeData[storeId]) {
        const store = stores.find((s) => s.id === storeId)
        storeData[storeId] = {
          store_id: storeId,
          store_name: store?.name || "Unknown",
          conversions: 0,
          revenue: 0,
          commission: 0,
        }
      }
      storeData[storeId].conversions++
      storeData[storeId].revenue += conv.conversion_value || 0
      storeData[storeId].commission += conv.commission_amount || 0
    })

    return Object.values(storeData)
      .map((store: any) => ({
        ...store,
        revenue: Number(store.revenue.toFixed(2)),
        commission: Number(store.commission.toFixed(2)),
        conversion_rate: 0, // Se calcularía con datos de clicks por tienda
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }

  private calculateTopCoupons(conversions: any[]) {
    const couponData: { [key: string]: any } = {}

    conversions
      .filter((conv) => conv.coupon_id && conv.coupons?.code)
      .forEach((conv) => {
        const couponId = conv.coupon_id
        if (!couponData[couponId]) {
          couponData[couponId] = {
            coupon_id: couponId,
            coupon_code: conv.coupons.code,
            conversions: 0,
            revenue: 0,
            commission: 0,
          }
        }
        couponData[couponId].conversions++
        couponData[couponId].revenue += conv.conversion_value || 0
        couponData[couponId].commission += conv.commission_amount || 0
      })

    return Object.values(couponData)
      .map((coupon: any) => ({
        ...coupon,
        revenue: Number(coupon.revenue.toFixed(2)),
        commission: Number(coupon.commission.toFixed(2)),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }

  private calculateConversionStatus(conversions: any[]) {
    const statusCount = {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      refunded: 0,
    }

    conversions.forEach((conv) => {
      const status = conv.status || "pending"
      if (statusCount.hasOwnProperty(status)) {
        statusCount[status as keyof typeof statusCount]++
      }
    })

    return statusCount
  }

  private calculateTrafficSources(conversions: any[]) {
    const sourceData: { [key: string]: any } = {}

    conversions.forEach((conv) => {
      const source = conv.utm_source || "direct"
      const medium = conv.utm_medium || "none"
      const key = `${source}-${medium}`

      if (!sourceData[key]) {
        sourceData[key] = {
          utm_source: source,
          utm_medium: medium,
          conversions: 0,
          revenue: 0,
        }
      }
      sourceData[key].conversions++
      sourceData[key].revenue += conv.conversion_value || 0
    })

    return Object.values(sourceData)
      .map((source: any) => ({
        ...source,
        revenue: Number(source.revenue.toFixed(2)),
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }

  private formatRecentConversions(conversions: any[]) {
    return conversions.map((conv) => ({
      id: conv.id,
      order_id: conv.order_id || "N/A",
      conversion_value: conv.conversion_value || 0,
      commission_amount: conv.commission_amount || 0,
      status: conv.status || "pending",
      store_name: conv.stores?.name || "Unknown",
      converted_at: conv.converted_at,
      coupon_code: conv.coupons?.code || null,
    }))
  }

  private getEmptyAnalytics(): ConversionAnalytics {
    return {
      overview: {
        total_conversions: 0,
        total_revenue: 0,
        total_commission: 0,
        conversion_rate: 0,
        avg_order_value: 0,
        pending_commission: 0,
      },
      time_series: [],
      top_stores: [],
      top_coupons: [],
      conversion_status: {
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        refunded: 0,
      },
      traffic_sources: [],
      recent_conversions: [],
    }
  }
}

export const conversionAnalyticsService = new ConversionAnalyticsService()
