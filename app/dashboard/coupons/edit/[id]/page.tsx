"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import type { Coupon, Store } from "@/lib/types"

export default function EditCouponPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    store_id: "",
    title: "",
    description: "",
    code: "",
    coupon_url: "", // Nuevo campo
    discount_value: "",
    discount_type: "percentage",
    start_date: "",
    expiry_date: "",
    terms_conditions: "",
    coupon_type: "code",
    is_active: true,
  })
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const params = useParams()
  const couponId = params.id as string
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el usuario actual
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
          return
        }

        // Obtener el cupón específico
        const { data: couponData, error: couponError } = await supabase
          .from("coupons")
          .select("*")
          .eq("id", couponId)
          .single()

        if (couponError) throw couponError

        setCoupon(couponData)

        // Obtener tiendas del usuario
        const { data: storesData, error: storesError } = await supabase
          .from("stores")
          .select("*")
          .eq("owner_id", user.id)
          .eq("is_active", true)

        if (storesError) throw storesError

        setStores(storesData || [])

        // Configurar el formulario con los datos del cupón
        setFormData({
          store_id: couponData.store_id || "",
          title: couponData.title || "",
          description: couponData.description || "",
          code: couponData.code || "",
          coupon_url: couponData.coupon_url || "", // Nuevo campo
          discount_value: couponData.discount_value?.toString() || "",
          discount_type: couponData.discount_type || "percentage",
          start_date: couponData.start_date ? new Date(couponData.start_date).toISOString().split("T")[0] : "",
          expiry_date: couponData.expiry_date ? new Date(couponData.expiry_date).toISOString().split("T")[0] : "",
          terms_conditions: couponData.terms_conditions || "",
          coupon_type: couponData.coupon_type || "code",
          is_active: couponData.is_active,
        })
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setError("Error al cargar el cupón. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [couponId, supabase, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)
    setError(null)

    try {
      // Validar campos requeridos
      if (!formData.store_id || !formData.title || !formData.coupon_type) {
        throw new Error("Por favor completa todos los campos requeridos")
      }

      // Si es un cupón de tipo 'code', el código es obligatorio
      if (formData.coupon_type === "code" && !formData.code) {
        throw new Error('El código es obligatorio para cupones de tipo "Código"')
      }

      // Validar URL si se proporciona
      if (formData.coupon_url) {
        try {
          new URL(formData.coupon_url.startsWith("http") ? formData.coupon_url : `https://${formData.coupon_url}`)
        } catch {
          throw new Error("La URL del cupón no es válida")
        }
      }

      // Preparar los datos para la actualización
      const couponData = {
        store_id: formData.store_id,
        title: formData.title,
        description: formData.description || null,
        code: formData.code || null,
        coupon_url: formData.coupon_url || null, // Nuevo campo
        discount_value: formData.discount_value ? Number.parseFloat(formData.discount_value) : null,
        discount_type: formData.discount_type || null,
        start_date: formData.start_date || null,
        expiry_date: formData.expiry_date || null,
        terms_conditions: formData.terms_conditions || null,
        coupon_type: formData.coupon_type,
        is_active: formData.is_active,
      }

      // Actualizar el cupón en la base de datos
      const { error: updateError } = await supabase.from("coupons").update(couponData).eq("id", couponId)

      if (updateError) throw updateError

      setSuccess(true)

      // Redireccionar después de un tiempo
      setTimeout(() => {
        router.push("/dashboard/coupons")
        router.refresh()
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Error al actualizar el cupón")
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!coupon) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Editar Cupón</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No se encontró el cupón o no tienes permisos para editarlo.</AlertDescription>
        </Alert>
        <Button className="mt-4 bg-orange-500 hover:bg-orange-600" onClick={() => router.push("/dashboard/coupons")}>
          Volver a cupones
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Cupón</h1>

      {success ? (
        <Alert className="bg-green-50 border-green-200 mb-6">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <AlertDescription className="text-green-700">
            El cupón ha sido actualizado con éxito. Serás redirigido a la lista de cupones en unos segundos...
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Información del cupón</CardTitle>
              <CardDescription>Actualiza la información del cupón o oferta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="store_id">Tienda *</Label>
                <select
                  id="store_id"
                  name="store_id"
                  value={formData.store_id}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon_type">Tipo de cupón *</Label>
                <select
                  id="coupon_type"
                  name="coupon_type"
                  value={formData.coupon_type}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="code">Código de descuento</option>
                  <option value="deal">Oferta</option>
                  <option value="free_shipping">Envío gratis</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: 20% de descuento en toda la tienda"
                  required
                />
              </div>

              {/* Nuevo campo para URL del cupón */}
              <div className="space-y-2">
                <Label htmlFor="coupon_url">URL del cupón/oferta</Label>
                <Input
                  id="coupon_url"
                  name="coupon_url"
                  type="url"
                  value={formData.coupon_url}
                  onChange={handleChange}
                  placeholder="https://tienda.com/producto-en-oferta"
                />
                <p className="text-sm text-gray-500">
                  URL específica donde se puede usar este cupón o ver la oferta. Si no se especifica, se usará la URL
                  general de la tienda.
                </p>
              </div>

              {formData.coupon_type === "code" && (
                <div className="space-y-2">
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Ej: DESCUENTO20"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Describe brevemente el cupón o la oferta"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_value">Valor del descuento</Label>
                  <Input
                    id="discount_value"
                    name="discount_value"
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={handleChange}
                    placeholder="Ej: 20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_type">Tipo de descuento</Label>
                  <select
                    id="discount_type"
                    name="discount_type"
                    value={formData.discount_type || "percentage"}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Cantidad fija (€)</option>
                    <option value="free_shipping">Envío gratis</option>
                    <option value="bogo">Compra uno, lleva otro</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Fecha de inicio</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Fecha de expiración</Label>
                  <Input
                    id="expiry_date"
                    name="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms_conditions">Términos y condiciones</Label>
                <Textarea
                  id="terms_conditions"
                  name="terms_conditions"
                  value={formData.terms_conditions || ""}
                  onChange={handleChange}
                  placeholder="Especifica cualquier restricción o condición para el uso del cupón"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Estado del cupón</Label>
                <select
                  id="is_active"
                  name="is_active"
                  value={formData.is_active ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "true" })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/coupons")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600" disabled={saveLoading}>
                  {saveLoading ? "Guardando cambios..." : "Guardar cambios"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}
