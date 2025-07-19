"use client"

import { ProductForm } from "@/components/products/product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface NewProductClientPageProps {
  storeId: string
  storeName: string
}

export default function NewProductClientPage({ storeId, storeName }: NewProductClientPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Producto</h1>
          <p className="text-muted-foreground">Crear un nuevo producto para la tienda: {storeName}</p>
        </div>
      </div>

      <ProductForm storeId={storeId} />
    </div>
  )
}
