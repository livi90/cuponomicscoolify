"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Settings,
  Zap
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface Store {
  id: string
  name: string
  website_url: string
  ecommerce_platform: string
  webhook_url?: string
  webhook_status?: "active" | "inactive" | "error"
  webhook_last_test?: string
}

interface WebhooksManagerProps {
  userId: string
  userRole: string
}

export function WebhooksManager({ userId, userRole }: WebhooksManagerProps) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState<string>("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [platform, setPlatform] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const [youtubeLink, setYoutubeLink] = useState("")
  const youtubeInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  useEffect(() => {
    loadStores()
  }, [userId])

  const loadStores = async () => {
    try {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setStores(data || [])
      if (data && data.length > 0) {
        setSelectedStore(data[0].id)
        setWebhookUrl(data[0].webhook_url || "")
        setPlatform(data[0].ecommerce_platform || "")
      }
    } catch (error) {
      console.error("Error loading stores:", error)
      toast.error("Error al cargar las tiendas")
    } finally {
      setLoading(false)
    }
  }

  const generateWebhookUrl = (storeId: string, platform: string) => {
    const baseUrl = "https://cuponomics.app"
    return `${baseUrl}/api/webhooks/${platform.toLowerCase()}/${storeId}`
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      toast.success("Copiado al portapapeles")
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      toast.error("Error al copiar")
    }
  }

  const testWebhook = async (storeId: string) => {
    try {
      const response = await fetch(`/api/webhooks/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: storeId }),
      })

      if (response.ok) {
        toast.success("Webhook probado exitosamente")
        loadStores() // Recargar para actualizar estado
      } else {
        toast.error("Error al probar webhook")
      }
    } catch (error) {
      toast.error("Error al probar webhook")
    }
  }

  const updateWebhookConfig = async () => {
    if (!selectedStore) return

    try {
      const { error } = await supabase
        .from("stores")
        .update({
          webhook_url: webhookUrl,
          ecommerce_platform: platform,
          webhook_status: "inactive", // Se activará cuando se configure correctamente
        })
        .eq("id", selectedStore)

      if (error) throw error

      toast.success("Configuración actualizada")
      loadStores()
    } catch (error) {
      console.error("Error updating webhook config:", error)
      toast.error("Error al actualizar configuración")
    }
  }

  const getPlatformInstructions = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "shopify":
        return {
          title: "Configuración de Shopify",
          steps: [
            "1. Ve a tu panel de administración de Shopify",
            "2. Navega a Configuración > Notificaciones > Webhooks",
            "3. Haz clic en 'Crear webhook'",
            "4. Selecciona 'Orden' como tema",
            "5. Selecciona 'orden pagada' y 'orden cumplida' como eventos",
            "6. Pega la URL del webhook en el campo 'URL'",
            "7. Selecciona 'JSON' como formato",
            "8. Haz clic en 'Guardar webhook'"
          ]
        }
      case "woocommerce":
        return {
          title: "Configuración de WooCommerce",
          steps: [
            "1. Ve a tu panel de administración de WordPress",
            "2. Navega a WooCommerce > Configuración > Avanzado > Webhooks",
            "3. Haz clic en 'Añadir webhook'",
            "4. Selecciona 'Orden' como tema",
            "5. Selecciona 'Orden completada' como evento",
            "6. Pega la URL del webhook en el campo 'URL de entrega'",
            "7. Haz clic en 'Guardar webhook'"
          ]
        }
      default:
        return {
          title: "Configuración Personalizada",
          steps: [
            "1. Configura tu sistema para enviar datos de órdenes",
            "2. Envía una solicitud POST a la URL del webhook",
            "3. Incluye los datos de la orden en formato JSON",
            "4. Asegúrate de incluir UTM parameters si están disponibles"
          ]
        }
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Activo</Badge>
      case "inactive":
        return <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" />Inactivo</Badge>
      case "error":
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>
      default:
        return <Badge variant="outline">No configurado</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No hay tiendas configuradas</CardTitle>
          <CardDescription>
            Primero debes crear una tienda para configurar webhooks automáticos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = "/dashboard/stores/new"}>
            Crear Tienda
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentStore = stores.find(s => s.id === selectedStore)
  const webhookUrlForStore = currentStore ? generateWebhookUrl(currentStore.id, platform) : ""
  const instructions = getPlatformInstructions(platform)

  const isAdmin = userRole === "admin"

  const WEBHOOK_PLATFORMS = ["shopify", "woocommerce", "magento", "prestashop", "bigcommerce", "squarespace", "wix", "vtex", "tiendanube"];

  return (
    <div className="space-y-6">
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <strong>Ventaja de los Webhooks:</strong> Las conversiones se verifican automáticamente 
          sin necesidad de instalar scripts manuales en tu tienda. Esto es más confiable y 
          requiere menos configuración.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
          <TabsTrigger value="status">Estado</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Webhook Automático</CardTitle>
              <CardDescription>
                Selecciona tu tienda y plataforma para generar la URL del webhook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store">Tienda</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una tienda" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name} ({store.website_url})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Plataforma de E-commerce</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shopify">Shopify</SelectItem>
                    <SelectItem value="woocommerce">WooCommerce</SelectItem>
                    <SelectItem value="magento">Magento</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {webhookUrlForStore && (
                <div className="space-y-2">
                  <Label>URL del Webhook</Label>
                  <div className="flex gap-2">
                    <Input value={webhookUrlForStore} readOnly />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(webhookUrlForStore, "webhook")}
                    >
                      {copied === "webhook" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Copia esta URL y configúrala en tu plataforma de e-commerce
                  </p>
                </div>
              )}

              <Button onClick={updateWebhookConfig} className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{instructions.title}</CardTitle>
              <CardDescription>
                Sigue estos pasos para configurar el webhook en tu plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mensaje destacado de webhook obligatorio */}
              {WEBHOOK_PLATFORMS.includes(platform) && (
                <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <span className="font-bold text-yellow-800">⚠️ Webhook obligatorio:</span>
                  <span className="ml-2 text-yellow-700">
                    Para {platform.charAt(0).toUpperCase() + platform.slice(1)}, la integración del webhook es <strong>obligatoria</strong> para el correcto funcionamiento del tracking y la validación de tus ventas.
                    Si no configuras el webhook, tus conversiones no serán confirmadas y podrías perder acceso a la plataforma.
                  </span>
                </div>
              )}
              <div className="space-y-3">
                {instructions.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>

              {webhookUrlForStore && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">URL del Webhook:</p>
                  <code className="text-xs bg-white p-2 rounded border block break-all">
                    {webhookUrlForStore}
                  </code>
                </div>
              )}

              <div className="mt-6">
                <Label>Tutorial en video (YouTube)</Label>
                {isAdmin ? (
                  <div className="flex gap-2 items-center">
                    <Input
                      ref={youtubeInputRef}
                      value={youtubeLink}
                      onChange={e => setYoutubeLink(e.target.value)}
                      placeholder="Pega aquí el link del tutorial de YouTube"
                      className="w-full"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (youtubeInputRef.current) {
                          setYoutubeLink(youtubeInputRef.current.value)
                        }
                      }}
                    >
                      Guardar
                    </Button>
                  </div>
                ) : youtubeLink ? (
                  <a
                    href={youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm mt-2 block"
                  >
                    Ver tutorial en YouTube
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">Próximamente</span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de los Webhooks</CardTitle>
              <CardDescription>
                Monitorea el estado de tus webhooks configurados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stores.map((store) => (
                  <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{store.name}</h4>
                      <p className="text-sm text-gray-500">{store.website_url}</p>
                      <p className="text-xs text-gray-400">
                        Última prueba: {store.webhook_last_test || "Nunca"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(store.webhook_status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testWebhook(store.id)}
                      >
                        Probar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 