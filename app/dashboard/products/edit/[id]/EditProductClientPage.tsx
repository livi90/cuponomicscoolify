"use client"

import { ProductForm } from "@/components/products/product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/types/product"

interface EditProductClientPageProps {
  product: Product
}

export default function EditProductClientPage({ product }: EditProductClientPageProps) {
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
          <h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1>
          <p className="text-muted-foreground">Editar el producto: {product.name}</p>
        </div>
      </div>

      <ProductForm storeId={product.store_id} product={product} isEditing={true} />
    </div>
  )
}
