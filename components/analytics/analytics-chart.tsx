"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface AnalyticsChartProps {
  data: {
    date: string
    clicks: number
    conversions: number
    revenue: number
  }[]
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString("es-ES")}
            formatter={(value, name) => {
              if (name === "revenue") {
                return [`€${Number(value).toFixed(2)}`, "Ingresos"]
              }
              return [value, name === "clicks" ? "Clics" : "Conversiones"]
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="clicks" stroke="#f97316" strokeWidth={2} name="Clics" />
          <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} name="Conversiones" />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Ingresos (€)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
