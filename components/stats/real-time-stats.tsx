"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Users, Tag, DollarSign, Store, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsData {
  totalUsers: number
  totalCoupons: number
  totalSavings: number
  totalStores: number
  totalOutletProducts: number
  totalRatings: number
}

export function RealTimeStats() {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalCoupons: 0,
    totalSavings: 0,
    totalStores: 0,
    totalOutletProducts: 0,
    totalRatings: 0
  })
  const [loading, setLoading] = useState(true)
  const [animatedValues, setAnimatedValues] = useState<StatsData>({
    totalUsers: 0,
    totalCoupons: 0,
    totalSavings: 0,
    totalStores: 0,
    totalOutletProducts: 0,
    totalRatings: 0
  })

  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      try {
        // Obtener estadísticas en paralelo
        const [
          { count: usersCount },
          { count: couponsCount },
          { count: storesCount },
          { count: outletProductsCount },
          { count: ratingsCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('coupons').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('stores').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('outlet_products').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('ratings').select('*', { count: 'exact', head: true })
        ])

        // Calcular ahorros totales (estimado basado en cupones activos)
        const estimatedSavings = (couponsCount || 0) * 15 // Estimación promedio de $15 por cupón

        const newStats = {
          totalUsers: usersCount || 0,
          totalCoupons: couponsCount || 0,
          totalSavings: estimatedSavings,
          totalStores: storesCount || 0,
          totalOutletProducts: outletProductsCount || 0,
          totalRatings: ratingsCount || 0
        }

        setStats(newStats)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  // Animación de números
  useEffect(() => {
    const duration = 2000 // 2 segundos
    const steps = 60
    const stepDuration = duration / steps

    const animateValue = (start: number, end: number, setter: (value: number) => void) => {
      const increment = (end - start) / steps
      let current = start
      let step = 0

      const interval = setInterval(() => {
        step++
        current += increment
        setter(Math.floor(current))

        if (step >= steps) {
          setter(end)
          clearInterval(interval)
        }
      }, stepDuration)

      return interval
    }

    const intervals = [
      animateValue(0, stats.totalUsers, (value) => setAnimatedValues(prev => ({ ...prev, totalUsers: value }))),
      animateValue(0, stats.totalCoupons, (value) => setAnimatedValues(prev => ({ ...prev, totalCoupons: value }))),
      animateValue(0, stats.totalSavings, (value) => setAnimatedValues(prev => ({ ...prev, totalSavings: value }))),
      animateValue(0, stats.totalStores, (value) => setAnimatedValues(prev => ({ ...prev, totalStores: value }))),
      animateValue(0, stats.totalOutletProducts, (value) => setAnimatedValues(prev => ({ ...prev, totalOutletProducts: value }))),
      animateValue(0, stats.totalRatings, (value) => setAnimatedValues(prev => ({ ...prev, totalRatings: value })))
    ]

    return () => intervals.forEach(clearInterval)
  }, [stats])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M+`
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K+`
    return `$${num}+`
  }

  const statsItems = [
    {
      icon: Users,
      value: formatNumber(animatedValues.totalUsers),
      label: "Usuarios Registrados",
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      icon: Tag,
      value: formatNumber(animatedValues.totalCoupons),
      label: "Cupones Verificados",
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      icon: DollarSign,
      value: formatCurrency(animatedValues.totalSavings),
      label: "Ahorros Generados",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100"
    },
    {
      icon: Store,
      value: formatNumber(animatedValues.totalStores),
      label: "Tiendas Asociadas",
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      icon: TrendingUp,
      value: formatNumber(animatedValues.totalOutletProducts),
      label: "Productos Outlet",
      color: "text-emerald-500",
      bgColor: "bg-emerald-100"
    },
    {
      icon: Zap,
      value: formatNumber(animatedValues.totalRatings),
      label: "Calificaciones",
      color: "text-orange-500",
      bgColor: "bg-orange-100"
    }
  ]

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsItems.map((item, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 animate-pulse">
              {item.value}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {item.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 