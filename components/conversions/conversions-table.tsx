"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface ConversionsTableProps {
  conversions: {
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

export function ConversionsTable({ conversions }: ConversionsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const, icon: Clock },
      confirmed: { label: "Confirmada", variant: "default" as const, icon: CheckCircle },
      cancelled: { label: "Cancelada", variant: "destructive" as const, icon: XCircle },
      refunded: { label: "Reembolsada", variant: "outline" as const, icon: RefreshCw },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  if (conversions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay conversiones en el período seleccionado</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Tienda</TableHead>
            <TableHead>Cupón</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Comisión</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversions.map((conversion) => (
            <TableRow key={conversion.id}>
              <TableCell className="font-medium">{conversion.order_id}</TableCell>
              <TableCell>{conversion.store_name}</TableCell>
              <TableCell>
                {conversion.coupon_code ? (
                  <Badge variant="outline">{conversion.coupon_code}</Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>{formatCurrency(conversion.conversion_value)}</TableCell>
              <TableCell className="text-green-600 font-medium">
                {formatCurrency(conversion.commission_amount)}
              </TableCell>
              <TableCell>{getStatusBadge(conversion.status)}</TableCell>
              <TableCell className="text-sm text-gray-500">{formatDate(conversion.converted_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
