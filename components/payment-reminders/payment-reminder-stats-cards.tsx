"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Clock, DollarSign, Mail } from "lucide-react"
import type { PaymentReminderStats } from "@/lib/services/payment-reminder-service"

interface PaymentReminderStatsCardsProps {
  stats: PaymentReminderStats
}

export function PaymentReminderStatsCards({ stats }: PaymentReminderStatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_pending}</div>
          <p className="text-xs text-gray-500">{formatCurrency(stats.total_amount_pending)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            Vencidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.total_overdue}</div>
          <p className="text-xs text-gray-500">{formatCurrency(stats.total_amount_overdue)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            Total por Cobrar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(stats.total_amount_pending + stats.total_amount_overdue)}
          </div>
          <p className="text-xs text-gray-500">Ingresos pendientes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Enviados Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.reminders_sent_today}</div>
          <p className="text-xs text-gray-500">Recordatorios enviados</p>
        </CardContent>
      </Card>
    </div>
  )
}
