"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface GeographicChartProps {
  data: {
    country: string
    clicks: number
    conversions: number
    revenue: number
  }[]
}

export function GeographicChart({ data }: GeographicChartProps) {
  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay datos geográficos disponibles</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value, name) => {
              if (name === "revenue") {
                return [`€${Number(value).toFixed(2)}`, "Ingresos"]
              }
              return [value, name === "clicks" ? "Clics" : "Conversiones"]
            }}
          />
          <Bar dataKey="clicks" fill="#f97316" name="Clics" />
          <Bar dataKey="conversions" fill="#10b981" name="Conversiones" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
