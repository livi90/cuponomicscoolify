"use client"

import { ProductForm } from "@/components/products/product-form"
import { getFeaturedProductById, getStoresByMerchant, updateFeaturedProduct } from "@/lib/services/product-service"
import type { ProductFormData } from "@/lib/types/product"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPageClient({ params }: EditProductPageProps) {
  const { id } = params
  const [product, setProduct] = useState<any>(null)
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, storesData] = await Promise.all([getFeaturedProductById(id), getStoresByMerchant()])

        if (!productData) {
          notFound()
          return
        }

        // Check if the store belongs to the merchant
        const storeExists = storesData.some((store) => store.id === productData.store_id)
        if (!storeExists) {
          notFound()
          return
        }

        setProduct(productData)
        setStores(storesData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleSubmit = async (data: ProductFormData) => {
    "use server"
    await updateFeaturedProduct(id, data)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Editar Producto</h1>
      <p className="text-gray-500">Actualiza la información de tu producto.</p>

      <ProductForm initialData={product} stores={stores} onSubmit={handleSubmit} isEdit />
    </div>
  )
}
