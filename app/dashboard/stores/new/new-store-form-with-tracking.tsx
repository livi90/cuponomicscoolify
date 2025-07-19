"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Info, Store, Code, Shield, ExternalLink, AlertTriangle } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
import { TrackingScriptGenerator, ECOMMERCE_PLATFORMS } from "@/lib/services/tracking-script-generator"

interface Category {
  id: string
  name: string
}

interface NewStoreFormWithTrackingProps {
  categories: Category[]
  userId: string
}

export default function NewStoreFormWithTracking({ categories, userId }: NewStoreFormWithTrackingProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [generatedScript, setGeneratedScript] = useState("")
  const [scriptCopied, setScriptCopied] = useState(false)
  const [showScript, setShowScript] = useState(false)
  const [storeCreated, setStoreCreated] = useState(false)
  const [createdStore, setCreatedStore] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    category: "",
    logo_url: "",
    ecommerce_platform: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          website: formData.website,
          category: formData.category,
          logo_url: formData.logo_url,
          ecommerce_platform: formData.ecommerce_platform,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear la tienda")
      }

      const result = await response.json()
      console.log("API Response:", result) // Debug

      // Verificar que tenemos los datos de la tienda y el pixel
      if (result.success && result.store && result.pixel && result.pixel.pixel_id) {
        setCreatedStore(result.store)

        // Generar script de tracking usando el pixel_id real de la base de datos
        const script = TrackingScriptGenerator.generateScript(
          result.store.id,
          result.pixel.pixel_id,
          formData.ecommerce_platform,
        )

        setGeneratedScript(script)
        setShowScript(true)
        setStoreCreated(true)

        toast.success("¡Tienda y pixel creados exitosamente!")
      } else {
        throw new Error("No se pudo obtener la información de la tienda o el pixel creado")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Error al crear la tienda")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value)
    setFormData({
      ...formData,
      ecommerce_platform: value,
    })
  }

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(generatedScript)
      setScriptCopied(true)
      toast.success("Script copiado al portapapeles")
      setTimeout(() => setScriptCopied(false), 2000)
    } catch (error) {
      toast.error("Error al copiar el script")
    }
  }

  const selectedPlatformData = ECOMMERCE_PLATFORMS.find((p) => p.id === selectedPlatform)

  const WEBHOOK_PLATFORMS = ["shopify", "woocommerce", "magento"];

  const isWebhookRecommended = WEBHOOK_PLATFORMS.includes(selectedPlatform);

  if (storeCreated && showScript) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
              <Check className="h-6 w-6" />
              ¡Tienda Creada Exitosamente!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600 mb-4">
              Tu tienda <strong>{formData.name}</strong> ha sido creada.
              {isWebhookRecommended ? (
                <> Ahora configura el <strong>webhook automático</strong> para comenzar a registrar conversiones de forma más confiable y sencilla.</>
              ) : (
                <> Ahora instala el script de tracking para comenzar a generar comisiones.</>
              )}
            </p>
            <div className="flex gap-4">
              <Button onClick={() => router.push("/dashboard/stores")} variant="outline">
                Ver Mis Tiendas
              </Button>
              <Button
                onClick={() => router.push("/dashboard/products/new")}
                className="bg-green-600 hover:bg-green-700"
              >
                Agregar Productos
              </Button>
            </div>
          </CardContent>
        </Card>

        {isWebhookRecommended ? (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-700 flex items-center gap-2">
                <Info className="h-6 w-6" />
                Webhook recomendado para {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-blue-700 font-semibold">
                  Para tu plataforma, el método recomendado es el <strong>webhook automático</strong>.
                  Ve a la sección <strong>Tracking &gt; Webhooks</strong> en el dashboard para obtener la URL y las instrucciones paso a paso.
                </p>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">¿Por qué usar webhooks?</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                    <li>Más confiable y seguro que el script manual</li>
                    <li>Confirmación automática de ventas en tiempo real</li>
                    <li>Menos mantenimiento y menos errores</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg border border-blue-300">
                  <h4 className="font-semibold text-blue-800 mb-2">¿Necesitas ayuda?</h4>
                  <p className="text-blue-700 text-sm">Contacta a soporte o revisa la guía de webhooks en la documentación.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Mostrar el script solo si la plataforma no soporta webhooks
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                ⚠️ INSTALACIÓN OBLIGATORIA DEL SCRIPT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-red-700 font-semibold">
                  La instalación del script de tracking es <strong>OBLIGATORIA</strong> para mantener tu acceso a la plataforma Cuponomics.
                </p>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">📋 Requisitos Obligatorios:</h4>
                  <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                    <li>
                      Instalar el script en tu sitio web dentro de las próximas <strong>48 horas</strong>
                    </li>
                    <li>Mantener el script activo y funcionando en todo momento</li>
                    <li>No modificar ni eliminar el código de tracking</li>
                    <li>Permitir que el script registre conversiones de cupones</li>
                  </ul>
                </div>
                <div className="bg-red-100 p-3 rounded-lg border border-red-300">
                  <h4 className="font-semibold text-red-800 mb-2">🚫 Consecuencias del Incumplimiento:</h4>
                  <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                    <li>
                      <strong>Suspensión inmediata</strong> de tu cuenta de merchant
                    </li>
                    <li>
                      <strong>Pérdida de acceso</strong> a todas tus tiendas y productos
                    </li>
                    <li>
                      <strong>Retención de comisiones</strong> pendientes de pago
                    </li>
                    <li>
                      <strong>Eliminación permanente</strong> de la plataforma
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Tu Script de Tracking Personalizado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>¿Para qué sirve este script?</strong>
                <br />
                Este código rastrea las ventas generadas a través de cupones de Cuponomics. Es completamente seguro, no
                recopila información personal y solo registra conversiones para calcular comisiones justas.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {selectedPlatformData?.name || "Plataforma personalizada"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyScript}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {scriptCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {scriptCopied ? "Copiado" : "Copiar Script"}
                </Button>
              </div>
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto max-h-64">
                <code>{generatedScript}</code>
              </pre>
            </div>

            {selectedPlatformData && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Instrucciones para {selectedPlatformData.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Pasos de Instalación:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      {selectedPlatformData.instructions.map((instruction, index) => (
                        <li key={index} className="text-gray-700">
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {selectedPlatformData.additionalNotes && (
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <h4 className="font-medium text-amber-800 mb-2">💡 Consejos Adicionales:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                        {selectedPlatformData.additionalNotes.map((note, index) => (
                          <li key={index}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>¿Necesitas ayuda?</strong> Si tienes problemas instalando el script, contacta a nuestro
                      equipo de soporte. Estamos aquí para ayudarte a maximizar tus ganancias.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mensaje de advertencia sobre script obligatorio */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-orange-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            ⚠️ Requisito Obligatorio: Script de Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-orange-700 font-medium">
              Al crear tu tienda, recibirás un script de tracking que <strong>DEBES instalar obligatoriamente</strong>{" "}
              en tu sitio web.
            </p>
            <div className="bg-white p-3 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">📋 Condiciones de Uso:</h4>
              <ul className="list-disc list-inside space-y-1 text-orange-700 text-sm">
                <li>
                  La instalación del script es <strong>obligatoria</strong> para mantener tu cuenta activa
                </li>
                <li>
                  Tienes <strong>48 horas</strong> después de crear la tienda para instalarlo
                </li>
                <li>
                  El script debe permanecer <strong>activo permanentemente</strong>
                </li>
                <li>No puedes modificar, eliminar o bloquear el funcionamiento del script</li>
              </ul>
            </div>
            <Alert className="border-red-300 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-700">
                <strong>Advertencia:</strong> Si no instalas el script o lo removes posteriormente,
                <strong> perderás acceso permanente a tu cuenta y todas tus tiendas</strong> en Cuponomics.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Información de la Tienda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nombre de la tienda *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Mi Tienda Online"
                />
              </div>

              <div>
                <Label htmlFor="website">Sitio web *</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  required
                  placeholder="https://mitienda.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe tu tienda y los productos que vendes..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Moda y Accesorios">Moda y Accesorios</SelectItem>
                        <SelectItem value="Tecnología">Tecnología</SelectItem>
                        <SelectItem value="Hogar y Jardín">Hogar y Jardín</SelectItem>
                        <SelectItem value="Deportes y Fitness">Deportes y Fitness</SelectItem>
                        <SelectItem value="Belleza y Cuidado Personal">Belleza y Cuidado Personal</SelectItem>
                        <SelectItem value="Alimentación y Bebidas">Alimentación y Bebidas</SelectItem>
                        <SelectItem value="Libros y Educación">Libros y Educación</SelectItem>
                        <SelectItem value="Juguetes y Niños">Juguetes y Niños</SelectItem>
                        <SelectItem value="Automóviles">Automóviles</SelectItem>
                        <SelectItem value="Viajes y Turismo">Viajes y Turismo</SelectItem>
                        <SelectItem value="Salud y Bienestar">Salud y Bienestar</SelectItem>
                        <SelectItem value="Arte y Manualidades">Arte y Manualidades</SelectItem>
                        <SelectItem value="Mascotas">Mascotas</SelectItem>
                        <SelectItem value="Servicios Profesionales">Servicios Profesionales</SelectItem>
                        <SelectItem value="Entretenimiento">Entretenimiento</SelectItem>
                        <SelectItem value="Otros">Otros</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ecommerce_platform">Plataforma de E-commerce *</Label>
                <Select value={formData.ecommerce_platform} onValueChange={handlePlatformChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {ECOMMERCE_PLATFORMS.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        <div>
                          <div className="font-medium">{platform.name}</div>
                          <div className="text-xs text-gray-500">{platform.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Logo de la tienda</Label>
              <ImageUpload
                value={formData.logo_url}
                onChange={(url) => setFormData({ ...formData, logo_url: url })}
                bucket="stores"
              />
            </div>

            {selectedPlatformData && (
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Plataforma seleccionada: {selectedPlatformData.name}</strong>
                  <br />
                  Después de crear tu tienda, recibirás un script personalizado con instrucciones específicas para
                  instalar en {selectedPlatformData.name}.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? "Creando..." : "Crear Tienda y Generar Script"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ¿Qué incluye el script de tracking?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ Lo que SÍ hace:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Rastrea ventas de cupones</li>
                <li>• Calcula comisiones justas</li>
                <li>• Detecta conversiones automáticamente</li>
                <li>• Funciona en segundo plano</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">❌ Lo que NO hace:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• No recopila datos personales</li>
                <li>• No afecta la velocidad del sitio</li>
                <li>• No interfiere con otros scripts</li>
                <li>• No almacena información sensible</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
