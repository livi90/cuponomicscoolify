"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Webhook,
  Settings,
  Zap,
  Globe,
  Shield,
  Download,
  ExternalLink
} from "lucide-react"
import { toast } from "react-hot-toast"
import type { Store } from "@/lib/types"

interface WebhookManagerProps {
  stores: Store[]
}

interface WebhookStatus {
  storeId: string
  isActive: boolean
  lastActivity: string | null
  totalConversions: number
  platform: string
  webhookUrl: string
}

export default function WebhookManager({ stores }: WebhookManagerProps) {
  const [webhookStatuses, setWebhookStatuses] = useState<Record<string, WebhookStatus>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStore, setSelectedStore] = useState<string>("")

  useEffect(() => {
    loadWebhookStatuses()
  }, [stores])

  const loadWebhookStatuses = async () => {
    try {
      setIsLoading(true)
      const statuses: Record<string, WebhookStatus> = {}

      for (const store of stores) {
        // Simular datos de webhook (en producción esto vendría de la API)
        statuses[store.id] = {
          storeId: store.id,
          isActive: false, // Por defecto inactivo hasta que se configure
          lastActivity: null,
          totalConversions: 0,
          platform: detectPlatform(store.website_url || ""),
          webhookUrl: generateWebhookUrl(store.id, detectPlatform(store.website_url || ""))
        }
      }

      setWebhookStatuses(statuses)
    } catch (error) {
      console.error("Error loading webhook statuses:", error)
      toast.error("Error al cargar el estado de los webhooks")
    } finally {
      setIsLoading(false)
    }
  }

  const detectPlatform = (url: string): string => {
    if (url.includes("myshopify.com") || url.includes("shopify.com")) return "shopify"
    if (url.includes("wordpress") || url.includes("wp-content")) return "woocommerce"
    if (url.includes("magento")) return "magento"
    if (url.includes("prestashop")) return "prestashop"
    return "custom"
  }

  const generateWebhookUrl = (storeId: string, platform: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || "https://cuponomics.app"
    return `${baseUrl}/api/webhooks/${platform}`
  }

  const copyWebhookUrl = async (storeId: string) => {
    try {
      const url = webhookStatuses[storeId]?.webhookUrl
      if (url) {
        await navigator.clipboard.writeText(url)
        toast.success("URL del webhook copiada")
      }
    } catch (error) {
      toast.error("Error al copiar la URL")
    }
  }

  const getPlatformInstructions = (platform: string) => {
    switch (platform) {
      case "shopify":
        return {
          title: "Shopify",
          steps: [
            "Ve a tu Admin de Shopify",
            "Settings > Notifications",
            "Busca 'Webhooks' en el menú lateral",
            "Create webhook",
            "Event: Order creation y Order payment",
            "Format: JSON",
            "URL: (copia la URL de arriba)",
            "Save webhook"
          ]
        }
      case "woocommerce":
        return {
          title: "WooCommerce",
          steps: [
            "Abre tu WordPress Admin",
            "WooCommerce > Settings",
            "Advanced > Webhooks",
            "Add webhook",
            "Name: Cuponomics Tracking",
            "Topic: Order created y Order updated",
            "Delivery URL: (copia la URL de arriba)",
            "Status: Active",
            "Save webhook"
          ]
        }
      default:
        return {
          title: "Plataforma Personalizada",
          steps: [
            "Contacta soporte para configuración personalizada",
            "Te ayudaremos a configurar el webhook específico",
            "Email: soporte@cuponomics.app"
          ]
        }
    }
  }

  const getWebhookStatusIcon = (isActive: boolean) => {
    return isActive ? CheckCircle : XCircle
  }

  const getWebhookStatusColor = (isActive: boolean) => {
    return isActive ? "text-green-600" : "text-gray-400"
  }

  if (!stores || stores.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No tienes tiendas registradas aún.</p>
          <Button className="mt-4" onClick={() => (window.location.href = "/dashboard/stores/new")}>
            Registrar Primera Tienda
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Instrucciones Visuales Simples */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Webhook className="w-5 h-5" />
            Sistema de Webhooks (Más Simple)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h4 className="font-semibold mb-2">Configura el Webhook</h4>
              <p className="text-sm text-gray-600">
                En tu plataforma (Shopify/WooCommerce)
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h4 className="font-semibold mb-2">Copia la URL</h4>
              <p className="text-sm text-gray-600">
                Pega la URL en la configuración
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h4 className="font-semibold mb-2">¡Listo!</h4>
              <p className="text-sm text-gray-600">
                Funciona automáticamente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tiendas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Configurar Webhooks por Tienda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stores.map((store) => {
              const status = webhookStatuses[store.id]
              const StatusIcon = getWebhookStatusIcon(status?.isActive || false)
              const instructions = getPlatformInstructions(status?.platform || "custom")

              return (
                <div key={store.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{store.name}</h3>
                      <p className="text-sm text-gray-600">{store.website_url}</p>
                      <p className="text-xs text-gray-500">Plataforma: {instructions.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-5 h-5 ${getWebhookStatusColor(status?.isActive || false)}`} />
                      <Badge variant={status?.isActive ? "default" : "secondary"}>
                        {status?.isActive ? "Activo" : "Pendiente"}
                      </Badge>
                    </div>
                  </div>

                  {/* URL del webhook */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">URL del Webhook:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={status?.webhookUrl || ""}
                        readOnly
                        className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm font-mono"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyWebhookUrl(store.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Instrucciones específicas */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">📋 Instrucciones para {instructions.title}:</h4>
                    <ol className="text-sm text-gray-700 space-y-1">
                      {instructions.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Estado del webhook */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${status?.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">
                        Estado: {status?.isActive ? 'Webhook Activo' : 'Pendiente de configuración'}
                      </span>
                    </div>
                    {status?.lastActivity && (
                      <span className="text-xs text-gray-500">
                        Última actividad: {new Date(status.lastActivity).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Estadísticas */}
                  {status?.isActive && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">
                          Conversiones detectadas: {status.totalConversions}
                        </span>
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          Funcionando
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ventajas del sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Ventajas del Sistema de Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">✅ vs Scripts de Tracking</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Sin instalación de código
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Sin mantenimiento
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Sin conflictos con otros scripts
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No depende del navegador
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">📊 Datos Capturados</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  ID de orden y valor total
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Cupones aplicados
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Productos comprados
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Datos del cliente
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enlaces útiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Recursos Útiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => window.open('/docs/webhook-installation-guide.md', '_blank')}
              className="justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Guía Completa de Instalación
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('mailto:soporte@cuponomics.app', '_blank')}
              className="justify-start"
            >
              <Settings className="w-4 h-4 mr-2" />
              Contactar Soporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
