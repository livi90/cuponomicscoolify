"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Settings } from "lucide-react"
import type { Store } from "@/lib/types"

interface NewCouponFormProps {
  stores: Store[]
}

export default function NewCouponForm({ stores }: NewCouponFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  // Agregar el array de categorías ampliado
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
    "Todas",
    "Otros"
  ]
  const [formData, setFormData] = useState({
    store_id: stores[0]?.id || "",
    title: "",
    description: "",
    code: "",
    discount_percentage: "",
    discount_amount: "",
    coupon_url: "",
    expires_at: "",
    type: "percentage" as "percentage" | "fixed",
    coupon_type: "code" as "code" | "deal",
    coupon_category: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones del frontend
    if (!formData.store_id) {
      toast({
        title: "Error",
        description: "Debes seleccionar una tienda",
        variant: "destructive",
      })
      return
    }

    if (formData.coupon_type === "code" && !formData.code) {
      toast({
        title: "Error",
        description: "Los cupones con código deben incluir un código",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          store_id: formData.store_id,
          discount_percentage: formData.type === "percentage" ? Number.parseFloat(formData.discount_percentage) : null,
          discount_amount: formData.type === "fixed" ? Number.parseFloat(formData.discount_amount) : null,
          expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
          coupon_category: formData.coupon_category,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al crear el cupón")
      }

      toast({
        title: `${formData.coupon_type === "code" ? "Cupón" : "Oferta"} creado`,
        description: `El ${formData.coupon_type === "code" ? "cupón" : "oferta"} se ha creado exitosamente.`,
      })

      router.push("/dashboard/coupons")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el cupón. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Crear Nuevo {formData.coupon_type === "code" ? "Cupón" : "Oferta"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de Tienda */}
            <div className="space-y-2">
              <Label htmlFor="store">Tienda *</Label>
              <Select
                value={formData.store_id}
                onValueChange={(value) => handleInputChange("store_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una tienda" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      <div className="flex items-center gap-2">
                        {store.logo_url && (
                          <img 
                            src={store.logo_url ?? undefined} 
                            alt={store.name}
                            className="w-4 h-4 rounded"
                          />
                        )}
                        <span>{store.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.store_id && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Cupón/oferta para: {stores.find(s => s.id === formData.store_id)?.name}
                  </p>
                  
                  {/* Información sobre personalización de imágenes */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs font-bold">ℹ</span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 mb-1">Personaliza la imagen de tu cupón</p>
                        <p className="text-blue-700 text-xs leading-relaxed">
                          ¿Quieres cambiar cómo se ve tu cupón en las tarjetas? Puedes personalizar tanto el logo como la imagen de fondo 
                          en la configuración de tu tienda.
                        </p>
                        <div className="mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
                            onClick={() => router.push(`/dashboard/stores/${formData.store_id}/edit`)}
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            Configurar imágenes
                          </Button>
                        </div>
                        <div className="mt-2 text-xs text-blue-600">
                          <p><strong>Logo:</strong> Se muestra en listados y cabeceras (200x200px recomendado)</p>
                          <p><strong>Imagen de tarjeta:</strong> Fondo de las cupon cards (600x400px recomendado)</p>
                        </div>
                        
                        {/* Vista previa de la imagen actual */}
                        {stores.find(s => s.id === formData.store_id)?.card_image_url && (
                          <div className="mt-3 p-2 bg-white rounded border">
                            <p className="text-xs text-gray-600 mb-2">Vista previa actual:</p>
                            <div className="w-full h-16 bg-gray-100 rounded overflow-hidden">
                              <img 
                                src={stores.find(s => s.id === formData.store_id)?.card_image_url ?? undefined} 
                                alt="Vista previa"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tipo de Cupón */}
            <div className="space-y-2">
              <Label htmlFor="coupon_type">Tipo de Cupón *</Label>
              <Select
                value={formData.coupon_type}
                onValueChange={(value: "code" | "deal") => handleInputChange("coupon_type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">Cupón con Código</SelectItem>
                  <SelectItem value="deal">Oferta sin Código</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground space-y-1">
                {formData.coupon_type === "code" ? (
                  <>
                    <p>• Los usuarios necesitarán ingresar un código para obtener el descuento</p>
                    <p>• Ideal para promociones específicas y tracking de conversiones</p>
                  </>
                ) : (
                  <>
                    <p>• Los usuarios obtienen el descuento automáticamente al hacer clic</p>
                    <p>• Perfecto para ofertas generales y descuentos directos</p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Cupón *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ej: 20% de descuento en toda la tienda"
                  required
                />
              </div>

              {formData.coupon_type === "code" && (
                <div className="space-y-2">
                  <Label htmlFor="code">Código del Cupón *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    placeholder="Ej: DESCUENTO20"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Código que los usuarios deberán ingresar en el checkout para obtener el descuento
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe los términos y condiciones del cupón..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coupon_url">URL del Producto/Oferta *</Label>
              <Input
                id="coupon_url"
                type="url"
                value={formData.coupon_url}
                onChange={(e) => handleInputChange("coupon_url", e.target.value)}
                placeholder="https://ejemplo.com/producto-en-oferta"
                required
              />
              <p className="text-sm text-muted-foreground">
                URL específica donde los usuarios serán redirigidos al hacer clic en el cupón
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Descuento</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "percentage" | "fixed") => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje</SelectItem>
                    <SelectItem value="fixed">Monto Fijo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="discount_percentage">Porcentaje de Descuento</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount_percentage}
                    onChange={(e) => handleInputChange("discount_percentage", e.target.value)}
                    placeholder="20"
                  />
                </div>
              )}

              {formData.type === "fixed" && (
                <div className="space-y-2">
                  <Label htmlFor="discount_amount">Monto de Descuento</Label>
                  <Input
                    id="discount_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount_amount}
                    onChange={(e) => handleInputChange("discount_amount", e.target.value)}
                    placeholder="50.00"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="expires_at">Fecha de Expiración</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => handleInputChange("expires_at", e.target.value)}
                />
              </div>
            </div>

            {/* Agregar campo de selección de categoría al formulario */}
            <div className="space-y-2">
              <Label htmlFor="coupon_category">Categoría del cupón *</Label>
              <Select
                value={formData.coupon_category}
                onValueChange={(value) => handleInputChange("coupon_category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? "Creando..." 
                  : `Crear ${formData.coupon_type === "code" ? "Cupón" : "Oferta"}`
                }
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/coupons")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
