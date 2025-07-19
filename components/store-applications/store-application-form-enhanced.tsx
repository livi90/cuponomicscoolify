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
import { Copy, Check, Info, Store, Code, Shield } from "lucide-react"
import { TrackingScriptGenerator, ECOMMERCE_PLATFORMS } from "@/lib/services/tracking-script-generator"
import { TermsCheckbox } from "@/components/legal/terms-checkbox"

interface StoreApplicationFormEnhancedProps {
  userId: string
}

export default function StoreApplicationFormEnhanced({ userId }: StoreApplicationFormEnhancedProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [generatedScript, setGeneratedScript] = useState("")
  const [scriptCopied, setScriptCopied] = useState(false)
  const [showScript, setShowScript] = useState(false)
  const [acceptMerchantTerms, setAcceptMerchantTerms] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    store_name: "",
    store_description: "",
    store_website: "",
    store_category: "",
    business_type: "",
    contact_phone: "",
    additional_info: "",
    ecommerce_platform: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptMerchantTerms) {
      toast.error("Debes aceptar los términos de uso para merchants para continuar")
      return
    }
    
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("user_id", userId)
      formDataToSend.append("store_name", formData.store_name)
      formDataToSend.append("store_description", formData.store_description)
      formDataToSend.append("store_website", formData.store_website)
      formDataToSend.append("store_category", formData.store_category)
      formDataToSend.append("business_type", formData.business_type)
      formDataToSend.append("contact_phone", formData.contact_phone)
      formDataToSend.append("additional_info", formData.additional_info)
      formDataToSend.append("ecommerce_platform", formData.ecommerce_platform)

      const response = await fetch("/api/store-applications", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Error al enviar la solicitud")
      }

      const result = await response.json()

      // Generar script de tracking
      if (result.application && result.application.id) {
        const script = TrackingScriptGenerator.generateScript(
          result.application.id,
          result.application.tracking_script_id || `script_${Date.now()}`,
          formData.ecommerce_platform,
        )
        setGeneratedScript(script)
        setShowScript(true)
      }

      toast.success("Solicitud enviada exitosamente")
      setSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al enviar la solicitud")
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

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Check className="h-6 w-6" />
              ¡Solicitud Enviada Exitosamente!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Tu solicitud ha sido enviada y está siendo revisada por nuestro equipo. Recibirás una respuesta en las
              próximas 24-48 horas.
            </p>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Para acelerar el proceso de aprobación, instala el script de tracking en tu
                tienda ahora mismo. Esto nos permitirá verificar que todo funciona correctamente.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {showScript && generatedScript && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Tu Script de Tracking Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">{selectedPlatformData?.name || "Plataforma personalizada"}</Badge>
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
                <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                  <code>{generatedScript}</code>
                </pre>
              </div>

              {selectedPlatformData && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Instrucciones de Instalación para {selectedPlatformData.name}:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    {selectedPlatformData.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-700">
                        {instruction}
                      </li>
                    ))}
                  </ol>

                  {selectedPlatformData.additionalNotes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Notas Adicionales:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                        {selectedPlatformData.additionalNotes.map((note, index) => (
                          <li key={index}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>¿Para qué sirve este script?</strong>
                  <br />
                  Este código nos permite rastrear las ventas que se generen a través de los cupones publicados en
                  Cuponomics. Es completamente seguro, no recopila información personal de tus clientes, y solo registra
                  cuando alguien realiza una compra después de usar uno de tus cupones. Esto nos ayuda a calcular las
                  comisiones de forma justa y transparente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Solicitud de Registro de Tienda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="store_name">Nombre de la tienda *</Label>
              <Input
                id="store_name"
                name="store_name"
                value={formData.store_name}
                onChange={handleInputChange}
                required
                placeholder="Ej: Mi Tienda Online"
              />
            </div>

            <div>
              <Label htmlFor="store_description">Descripción de la tienda *</Label>
              <Textarea
                id="store_description"
                name="store_description"
                value={formData.store_description}
                onChange={handleInputChange}
                required
                placeholder="Describe tu tienda y los productos que vendes..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="store_website">Sitio web de la tienda *</Label>
              <Input
                id="store_website"
                name="store_website"
                type="url"
                value={formData.store_website}
                onChange={handleInputChange}
                required
                placeholder="https://mitienda.com"
              />
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

            <div>
              <Label htmlFor="store_category">Categoría *</Label>
              <Select
                value={formData.store_category}
                onValueChange={(value) => setFormData({ ...formData, store_category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Moda">Moda y Accesorios</SelectItem>
                  <SelectItem value="Tecnología">Tecnología y Electrónicos</SelectItem>
                  <SelectItem value="Hogar">Hogar y Jardín</SelectItem>
                  <SelectItem value="Deportes">Deportes y Fitness</SelectItem>
                  <SelectItem value="Belleza">Belleza y Cuidado Personal</SelectItem>
                  <SelectItem value="Alimentación">Alimentación y Bebidas</SelectItem>
                  <SelectItem value="Libros">Libros y Educación</SelectItem>
                  <SelectItem value="Juguetes">Juguetes y Niños</SelectItem>
                  <SelectItem value="Automóvil">Automóvil y Motocicletas</SelectItem>
                  <SelectItem value="Otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="business_type">Tipo de negocio *</Label>
              <Select
                value={formData.business_type}
                onValueChange={(value) => setFormData({ ...formData, business_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tienda física">Solo tienda física</SelectItem>
                  <SelectItem value="E-commerce">Solo tienda online</SelectItem>
                  <SelectItem value="Ambos">Tienda física y online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contact_phone">Teléfono de contacto</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={handleInputChange}
                placeholder="+1234567890"
              />
            </div>

            <div>
              <Label htmlFor="additional_info">Información adicional</Label>
              <Textarea
                id="additional_info"
                name="additional_info"
                value={formData.additional_info}
                onChange={handleInputChange}
                placeholder="Cualquier información adicional que quieras compartir..."
                rows={3}
              />
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Al enviar esta solicitud, se generará automáticamente un script de tracking personalizado para tu
                tienda. Este script es necesario para rastrear las ventas generadas a través de Cuponomics y calcular
                las comisiones correspondientes.
              </AlertDescription>
            </Alert>

            <TermsCheckbox
              checked={acceptMerchantTerms}
              onCheckedChange={setAcceptMerchantTerms}
              type="merchant"
              required={true}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Enviando..." : "Enviar Solicitud y Generar Script"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
