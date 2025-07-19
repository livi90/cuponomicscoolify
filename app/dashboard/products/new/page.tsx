"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ProductService } from "@/lib/services/product-service"
import { ImageUpload } from "@/components/ui/image-upload"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  price: z.string().refine(
    (value) => {
      try {
        const parsed = Number.parseFloat(value)
        return !isNaN(parsed) && parsed > 0
      } catch (error) {
        return false
      }
    },
    {
      message: "Price must be a valid number greater than 0.",
    },
  ),
})

const ProductNewPage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stores, setStores] = useState<{ id: string; name: string }[]>([])
  const [storesLoading, setStoresLoading] = useState(true)
  const [selectedStoreId, setSelectedStoreId] = useState("")
  const [imageUrl1, setImageUrl1] = useState("")
  const [imageUrl2, setImageUrl2] = useState("")
  const [productUrl, setProductUrl] = useState("")

  useEffect(() => {
    const fetchStores = async () => {
      setStoresLoading(true)
      try {
        const storesList = await productService.getUserStores()
        setStores(storesList)
        if (storesList.length === 1) setSelectedStoreId(storesList[0].id)
      } catch (e) {
        setError("Error al cargar tus tiendas")
      } finally {
        setStoresLoading(false)
      }
    }
    fetchStores()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    setError(null)
    try {
      if (!selectedStoreId) {
        throw new Error('Debes seleccionar una tienda para crear el producto')
      }
      if (!imageUrl1 || !imageUrl2) {
        throw new Error('Debes subir dos imágenes del producto')
      }
      if (!productUrl) {
        throw new Error('Debes ingresar la URL del producto')
      }
      const productServiceInstance = new ProductService()
      await productServiceInstance.createProduct(selectedStoreId, {
        ...values,
        image_url_1: imageUrl1,
        image_url_2: imageUrl2,
        product_url: productUrl,
      })
      toast({
        title: "Success",
        description: "Product created successfully.",
      })
      router.push("/dashboard/products")
    } catch (error: any) {
      setError(error?.message || "Something went wrong. Please try again.")
      toast({
        title: "Error",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Product</h1>
      </div>
      <Separator className="my-4" />
      {storesLoading ? (
        <div className="mb-4">Cargando tiendas...</div>
      ) : stores.length === 0 ? (
        <div className="mb-4 text-red-600">No tienes tiendas activas. Debes crear una tienda antes de poder crear productos.</div>
      ) : null}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-2">{error}</div>
          )}
          <div className="space-y-2">
            <label htmlFor="storeId" className="block font-medium">Tienda *</label>
            <select
              id="storeId"
              value={selectedStoreId}
              onChange={e => setSelectedStoreId(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              disabled={stores.length === 0 || storesLoading}
            >
              <option value="">Selecciona una tienda</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              value={imageUrl1}
              onChange={setImageUrl1}
              bucket="products"
              label="Imagen 1 del producto*"
            />
            <ImageUpload
              value={imageUrl2}
              onChange={setImageUrl2}
              bucket="products"
              label="Imagen 2 del producto*"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="productUrl" className="block font-medium">URL del producto *</label>
            <input
              id="productUrl"
              type="url"
              value={productUrl}
              onChange={e => setProductUrl(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="https://tutienda.com/producto"
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Product description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading || stores.length === 0 || storesLoading}>
            {loading ? "Creating..." : "Create"}
          </Button>
          {productUrl && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href={productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-orange-100 border border-orange-300 rounded p-4 text-center font-semibold hover:bg-orange-200 transition"
              >
                Ver producto
              </a>
              <div></div>
              <a
                href={productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-orange-100 border border-orange-300 rounded p-4 text-center font-semibold hover:bg-orange-200 transition"
              >
                Ver más del producto
              </a>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}

export default ProductNewPage
