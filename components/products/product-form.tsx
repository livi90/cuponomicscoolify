"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/ui/image-upload"
import { productService } from "@/lib/services/product-service"
import type { Product } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

// Esquema de validación
const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.coerce.number().positive("El precio debe ser mayor que 0"),
  sale_price: z.coerce.number().positive("El precio de oferta debe ser mayor que 0").optional(),
  image_url: z.string().optional(),
  product_url: z.string().url("Debe ser una URL válida").optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  is_new: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  stock_quantity: z.coerce
    .number()
    .int("La cantidad debe ser un número entero")
    .nonnegative("La cantidad no puede ser negativa"),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  status: z.enum(["active", "inactive", "draft"]).default("active"),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  storeId: string
  product?: Product
  isEditing?: boolean
}

export function ProductForm({ storeId, product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Configurar el formulario con valores predeterminados
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      sale_price: product?.sale_price || undefined,
      image_url: product?.image_url || "",
      product_url: product?.product_url || "",
      category: product?.category || undefined,
      tags: product?.tags?.join(", ") || "",
      is_new: product?.is_new ?? true,
      is_featured: product?.is_featured ?? false,
      stock_quantity: product?.stock_quantity || 0,
      start_date: product?.start_date ? new Date(product.start_date) : undefined,
      end_date: product?.end_date ? new Date(product.end_date) : undefined,
      status: product?.status || "active",
    },
  })

  // Manejar el envío del formulario
  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      console.log("Enviando datos del producto:", values)

      // Procesar los tags
      const processedValues = {
        ...values,
        tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : undefined,
      }

      let result
      if (isEditing && product) {
        // Actualizar producto existente
        result = await productService.updateProduct(product.id, processedValues)
      } else {
        // Crear nuevo producto
        console.log("Creando nuevo producto para tienda:", storeId)
        result = await productService.createProduct(storeId, processedValues)
      }

      if (result) {
        toast({
          title: isEditing ? "Producto actualizado" : "Producto creado",
          description: `El producto ${values.name} ha sido ${isEditing ? "actualizado" : "creado"} exitosamente.`,
        })
        router.push("/dashboard/products")
        router.refresh()
      } else {
        setError("No se pudo guardar el producto. Inténtalo de nuevo.")
      }
    } catch (err: any) {
      console.error("Error al guardar producto:", err)
      setError(`Error al guardar producto: ${err.message || JSON.stringify(err)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Categorías predefinidas
  const categories = [
    "Electrónica",
    "Ropa",
    "Hogar",
    "Alimentos",
    "Bebidas",
    "Salud",
    "Belleza",
    "Deportes",
    "Juguetes",
    "Libros",
    "Música",
    "Productos digitales",
    "Software",
    "Apps",
    "Cursos online",
    "Viajes",
    "Servicios",
    "Entretenimiento",
    "Videojuegos",
    "Mascotas",
    "Arte y diseño",
    "Fotografía",
    "Finanzas",
    "Educación",
    "Salud y bienestar",
    "Automóviles",
    "Bebés y niños",
    "Oficina",
    "Jardín",
    "Herramientas",
    "Otros"
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del producto*</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Camiseta de algodón" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción*</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe tu producto..." className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio regular*</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input type="number" step="0.01" className="pl-7" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sale_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de oferta</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      className="pl-7"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </FormControl>
                <FormDescription>Opcional, si el producto está en oferta</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad en stock*</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Nuevo campo para URL del producto */}
        <FormField
          control={form.control}
          name="product_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del producto</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://www.ejemplo.com/producto" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Enlace directo al producto en tu tienda o sitio web</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen del producto</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  bucket="products"
                  path={`store_${storeId}`}
                />
              </FormControl>
              <FormDescription>Sube una imagen para mostrar tu producto</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiquetas</FormLabel>
              <FormControl>
                <Input placeholder="verano, oferta, nuevo" {...field} />
              </FormControl>
              <FormDescription>Separa las etiquetas con comas</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de inicio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Cuándo comienza la oferta o disponibilidad</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de fin</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const startDate = form.getValues("start_date")
                        return startDate && date < startDate
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Cuándo termina la oferta o disponibilidad</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="is_new"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Producto nuevo</FormLabel>
                  <FormDescription>Marcar como lanzamiento de producto</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Destacado</FormLabel>
                  <FormDescription>Mostrar en sección de destacados</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/products")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Actualizar producto" : "Crear producto"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
