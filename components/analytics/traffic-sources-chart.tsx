"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface TrafficSourcesChartProps {
  data: {
    utm_medium: string
    utm_campaign: string
    clicks: number
    conversions: number
  }[]
}

const COLORS = ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"]

export function TrafficSourcesChart({ data }: TrafficSourcesChartProps) {
  const chartData = data.map((item) => ({
    name: item.utm_medium,
    value: item.clicks,
    conversions: item.conversions,
  }))

  if (chartData.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay datos de tráfico para mostrar</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, "Clics"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
