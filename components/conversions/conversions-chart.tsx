"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface ConversionsChartProps {
  data: {
    date: string
    conversions: number
    revenue: number
    commission: number
    clicks: number
  }[]
}

export function ConversionsChart({ data }: ConversionsChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    })
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
          <YAxis yAxisId="left" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" fontSize={12} />
          <Tooltip
            labelFormatter={(value) => formatDate(value as string)}
            formatter={(value: number, name: string) => {
              if (name === "revenue" || name === "commission") {
                return [formatCurrency(value), name === "revenue" ? "Ingresos" : "Comisión"]
              }
              return [value, name === "conversions" ? "Conversiones" : "Clicks"]
            }}
          />
          <Legend
            formatter={(value) => {
              const labels = {
                conversions: "Conversiones",
                revenue: "Ingresos",
                commission: "Comisión",
                clicks: "Clicks",
              }
              return labels[value as keyof typeof labels] || value
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="conversions"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="commission"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="clicks"
            stroke="#6b7280"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={{ fill: "#6b7280", strokeWidth: 1, r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
