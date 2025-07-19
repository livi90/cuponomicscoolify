"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Calendar, Mail, Plus, RefreshCw, CheckCircle } from "lucide-react"
import type { PaymentReminderStats, PaymentReminder } from "@/lib/services/payment-reminder-service"
import { PaymentRemindersTable } from "./payment-reminders-table"
import { PaymentReminderStatsCards } from "./payment-reminder-stats-cards"
import { toast } from "sonner"

export function PaymentRemindersManager() {
  const [stats, setStats] = useState<PaymentReminderStats | null>(null)
  const [reminders, setReminders] = useState<PaymentReminder[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load stats
      const statsResponse = await fetch("/api/payment-reminders/stats")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Load all reminders (you might want to paginate this in a real app)
      const remindersResponse = await fetch("/api/payment-reminders")
      if (remindersResponse.ok) {
        const remindersData = await remindersResponse.json()
        setReminders(remindersData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const generateReminders = async () => {
    setGenerating(true)
    try {
      const response = await fetch("/api/payment-reminders/generate", {
        method: "POST",
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Se generaron ${result.created} recordatorios de pago`)
        loadData()
      } else {
        toast.error("Error al generar recordatorios")
      }

      if (result.errors && result.errors.length > 0) {
        console.error("Generation errors:", result.errors)
      }
    } catch (error) {
      console.error("Error generating reminders:", error)
      toast.error("Error al generar recordatorios")
    } finally {
      setGenerating(false)
    }
  }

  const sendReminders = async () => {
    setSending(true)
    try {
      const response = await fetch("/api/payment-reminders/send", {
        method: "POST",
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Se enviaron ${result.sent} recordatorios de pago`)
        loadData()
      } else {
        toast.error("Error al enviar recordatorios")
      }

      if (result.errors && result.errors.length > 0) {
        console.error("Send errors:", result.errors)
      }
    } catch (error) {
      console.error("Error sending reminders:", error)
      toast.error("Error al enviar recordatorios")
    } finally {
      setSending(false)
    }
  }

  const markAsPaid = async (reminderId: string, notes?: string) => {
    try {
      const response = await fetch(`/api/payment-reminders/${reminderId}/paid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      })

      if (response.ok) {
        toast.success("Pago marcado como completado")
        loadData()
      } else {
        toast.error("Error al marcar el pago")
      }
    } catch (error) {
      console.error("Error marking as paid:", error)
      toast.error("Error al marcar el pago")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex gap-4">
        <Button onClick={generateReminders} disabled={generating} className="flex items-center gap-2">
          {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Generar Recordatorios Mensuales
        </Button>

        <Button
          onClick={sendReminders}
          disabled={sending}
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          {sending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Enviar Recordatorios Pendientes
        </Button>

        <Button onClick={loadData} variant="outline" className="flex items-center gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Stats cards */}
      {stats && <PaymentReminderStatsCards stats={stats} />}

      {/* Main content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos los Recordatorios</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="overdue">Vencidos</TabsTrigger>
          <TabsTrigger value="paid">Pagados</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos Vencimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todos los Recordatorios de Pago</CardTitle>
              <CardDescription>Lista completa de recordatorios de pago generados</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentRemindersTable reminders={reminders} onMarkAsPaid={markAsPaid} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Recordatorios Pendientes</CardTitle>
              <CardDescription>Recordatorios que aún no han sido enviados</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentRemindersTable
                reminders={reminders.filter((r) => r.status === "pending")}
                onMarkAsPaid={markAsPaid}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Pagos Vencidos
              </CardTitle>
              <CardDescription>Recordatorios con fecha de vencimiento pasada</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentRemindersTable
                reminders={reminders.filter((r) => r.status === "overdue")}
                onMarkAsPaid={markAsPaid}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Pagos Completados
              </CardTitle>
              <CardDescription>Recordatorios marcados como pagados</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentRemindersTable
                reminders={reminders.filter((r) => r.status === "paid")}
                onMarkAsPaid={markAsPaid}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Vencimientos
              </CardTitle>
              <CardDescription>Recordatorios que vencen en los próximos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.upcoming_due_dates && stats.upcoming_due_dates.length > 0 ? (
                <div className="space-y-4">
                  {stats.upcoming_due_dates.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{reminder.merchant_name || reminder.merchant_email}</div>
                        <div className="text-sm text-gray-500">Factura: {reminder.invoice_number}</div>
                        <div className="text-sm text-gray-500">
                          Vence: {new Date(reminder.due_date).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatCurrency(reminder.commission_amount)}</div>
                        <Badge variant={reminder.status === "overdue" ? "destructive" : "secondary"}>
                          {reminder.status === "pending" && "Pendiente"}
                          {reminder.status === "sent" && "Enviado"}
                          {reminder.status === "overdue" && "Vencido"}
                          {reminder.status === "paid" && "Pagado"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No hay vencimientos próximos</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
