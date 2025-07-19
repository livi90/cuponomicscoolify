"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface TopCouponsTableProps {
  coupons: {
    coupon_code: string
    coupon_id: string
    clicks: number
    conversions: number
    conversion_rate: number
    revenue: number
  }[]
}

export function TopCouponsTable({ coupons }: TopCouponsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const getConversionBadge = (rate: number) => {
    if (rate >= 5) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>
    if (rate >= 2) return <Badge className="bg-yellow-100 text-yellow-800">Bueno</Badge>
    return <Badge className="bg-red-100 text-red-800">Mejorable</Badge>
  }

  if (coupons.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay datos de cupones para el período seleccionado</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código del Cupón</TableHead>
          <TableHead className="text-right">Clics</TableHead>
          <TableHead className="text-right">Conversiones</TableHead>
          <TableHead className="text-right">Tasa Conversión</TableHead>
          <TableHead className="text-right">Ingresos</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coupons.map((coupon, index) => (
          <TableRow key={coupon.coupon_id || index}>
            <TableCell className="font-medium">{coupon.coupon_code}</TableCell>
            <TableCell className="text-right">{coupon.clicks.toLocaleString()}</TableCell>
            <TableCell className="text-right">{coupon.conversions.toLocaleString()}</TableCell>
            <TableCell className="text-right">{coupon.conversion_rate.toFixed(2)}%</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(coupon.revenue)}</TableCell>
            <TableCell>{getConversionBadge(coupon.conversion_rate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
