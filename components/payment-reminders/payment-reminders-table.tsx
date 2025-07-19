"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"
import type { PaymentReminder } from "@/lib/services/payment-reminder-service"

interface PaymentRemindersTableProps {
  reminders: PaymentReminder[]
  onMarkAsPaid: (reminderId: string, notes?: string) => void
}

export function PaymentRemindersTable({ reminders, onMarkAsPaid }: PaymentRemindersTableProps) {
  const [selectedReminder, setSelectedReminder] = useState<PaymentReminder | null>(null)
  const [paymentNotes, setPaymentNotes] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
      case "sent":
        return <Badge variant="outline">Enviado</Badge>
      case "overdue":
        return <Badge variant="destructive">Vencido</Badge>
      case "paid":
        return (
          <Badge variant="default" className="bg-green-500">
            Pagado
          </Badge>
        )
      case "cancelled":
        return <Badge variant="secondary">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleMarkAsPaid = (reminder: PaymentReminder) => {
    setSelectedReminder(reminder)
    setPaymentNotes("")
    setShowPaymentDialog(true)
  }

  const confirmPayment = () => {
    if (selectedReminder) {
      onMarkAsPaid(selectedReminder.id, paymentNotes)
      setShowPaymentDialog(false)
      setSelectedReminder(null)
      setPaymentNotes("")
    }
  }

  if (reminders.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay recordatorios de pago</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>Factura</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Recordatorios</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reminders.map((reminder) => (
              <TableRow key={reminder.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{reminder.merchant_name || "Sin nombre"}</div>
                    <div className="text-sm text-gray-500">{reminder.merchant_email}</div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{reminder.invoice_number}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(reminder.period_start)} - {formatDate(reminder.period_end)}
                  </div>
                </TableCell>
                <TableCell className="font-bold">{formatCurrency(reminder.commission_amount)}</TableCell>
                <TableCell>
                  <div
                    className={`text-sm ${
                      new Date(reminder.due_date) < new Date() && reminder.status !== "paid"
                        ? "text-red-600 font-medium"
                        : ""
                    }`}
                  >
                    {formatDate(reminder.due_date)}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {reminder.reminder_count} enviados
                    {reminder.last_reminder_sent && (
                      <div className="text-xs text-gray-500">Último: {formatDate(reminder.last_reminder_sent)}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {reminder.status !== "paid" && reminder.status !== "cancelled" && (
                      <Button size="sm" onClick={() => handleMarkAsPaid(reminder)} className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Marcar Pagado
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Payment confirmation dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Pago</DialogTitle>
            <DialogDescription>¿Estás seguro de que quieres marcar este pago como completado?</DialogDescription>
          </DialogHeader>

          {selectedReminder && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">{selectedReminder.merchant_name}</div>
                <div className="text-sm text-gray-600">{selectedReminder.merchant_email}</div>
                <div className="text-sm text-gray-600">Factura: {selectedReminder.invoice_number}</div>
                <div className="font-bold text-lg mt-2">{formatCurrency(selectedReminder.commission_amount)}</div>
              </div>

              <div>
                <label className="text-sm font-medium">Notas (opcional)</label>
                <Textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Agregar notas sobre el pago..."
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmPayment}>Confirmar Pago</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
