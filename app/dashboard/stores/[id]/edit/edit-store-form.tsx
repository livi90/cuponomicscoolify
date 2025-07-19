"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Store } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle2, Loader2, CreditCard, ImageIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EditStoreFormProps {
  store: Store
  categories: { id: string; name: string }[]
}

export default function EditStoreForm({ store, categories }: EditStoreFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    name: store.name || "",
    slug: store.slug || "",
    description: store.description || "",
    website: store.website || "",
    logo_url: store.logo_url || "",
    card_image_url: store.card_image_url || "",
    category: store.category || "",
    contact_email: store.contact_email || "",
    contact_phone: store.contact_phone || "",
    address: store.address || "",
    is_active: store.is_active,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleLogoChange = (url: string) => {
    setFormData((prev) => ({ ...prev, logo_url: url }))
  }

  const handleCardImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, card_image_url: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Validar campos requeridos
      if (!formData.name || !formData.slug || !formData.contact_email) {
        throw new Error("Por favor completa todos los campos requeridos")
      }

      // Actualizar la tienda
      const { error } = await supabase
        .from("stores")
        .update({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          website: formData.website,
          logo_url: formData.logo_url,
          card_image_url: formData.card_image_url,
          category: formData.category,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          address: formData.address,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", store.id)

      if (error) throw error

      setSuccess(true)
      toast({
        title: "Tienda actualizada",
        description: "La información de la tienda ha sido actualizada correctamente",
      })

      // Recargar la página después de 1 segundo
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (error: any) {
      setError(error.message || "Ha ocurrido un error al actualizar la tienda")
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Ha ocurrido un error al actualizar la tienda",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Éxito</AlertTitle>
              <AlertDescription className="text-green-700">
                La información de la tienda ha sido actualizada correctamente
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre de la tienda <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nombre de tu tienda"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug (URL) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="nombre-de-tu-tienda"
              />
              <p className="text-xs text-gray-500">
                El slug se usa para la URL de tu tienda. Solo letras minúsculas, números y guiones.
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Describe tu tienda en pocas palabras"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Sitio web</Label>
              <Input
                id="website"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                placeholder="https://www.ejemplo.com"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={formData.category || ""} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">
                Email de contacto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact_email"
                name="contact_email"
                value={formData.contact_email || ""}
                onChange={handleChange}
                required
                placeholder="contacto@ejemplo.com"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Teléfono de contacto</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone || ""}
                onChange={handleChange}
                placeholder="+1234567890"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Dirección física de la tienda"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Tabs defaultValue="logo" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="logo" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Logo de la tienda
                  </TabsTrigger>
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Imagen para cupones
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="logo" className="space-y-2">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <Label>Logo de la tienda</Label>
                    <p className="text-xs text-gray-500 mb-4">
                      Este logo se mostrará en el listado de tiendas y en la cabecera de tu página. Recomendamos una
                      imagen cuadrada de al menos 200x200 píxeles.
                    </p>
                    <ImageUpload value={formData.logo_url} onChange={handleLogoChange} bucket="stores" />
                  </div>
                </TabsContent>
                <TabsContent value="card" className="space-y-2">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <Label>Imagen para tarjetas de cupón</Label>
                    <p className="text-xs text-gray-500 mb-4">
                      Esta imagen se usará como fondo en las tarjetas de cupón, similar a una tarjeta de regalo.
                      Recomendamos una imagen rectangular de 600x400 píxeles con tu marca bien visible.
                    </p>
                    <div className="mb-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
                        <h4 className="font-medium text-sm mb-2">Recomendaciones:</h4>
                        <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                          <li>Usa una imagen atractiva que represente tu marca</li>
                          <li>Asegúrate de que el texto sea legible sobre la imagen</li>
                          <li>Evita imágenes muy oscuras o con muchos detalles</li>
                          <li>Incluye elementos visuales de tu marca (colores, logo, etc.)</li>
                        </ul>
                      </div>
                      <ImageUpload
                        value={formData.card_image_url}
                        onChange={handleCardImageChange}
                        bucket="store-cards"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
              />
              <Label htmlFor="is_active">Tienda activa</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/stores")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
