"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Code, 
  Shield,
  Settings,
  Activity,
  Zap,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Play,
  Pause,
  Store as StoreIcon
} from "lucide-react"
import { UniversalTrackingScript, UNIVERSAL_ECOMMERCE_PLATFORMS } from "@/lib/services/universal-tracking-script"
import { toast } from "react-hot-toast"
import type { Store } from "@/lib/types"

interface UniversalTrackingManagerProps {
  stores: Store[]
}

interface TrackingConfig {
  id: string
  store_id: string
  is_universal_enabled: boolean
  script_version: string
  auto_detect_platform: boolean
  fallback_to_pixel: boolean
  enable_advanced_fingerprinting: boolean
  enable_canvas_fingerprint: boolean
  enable_webgl_fingerprint: boolean
  enable_font_detection: boolean
  respect_dnt_header: boolean
  anonymize_ip: boolean
  store_fingerprint_data: boolean
  script_timeout_ms: number
  max_retry_attempts: number
  batch_requests: boolean
}

export default function UniversalTrackingManager({ stores }: UniversalTrackingManagerProps) {
  const [copiedScripts, setCopiedScripts] = useState<Record<string, boolean>>({})
  const [configs, setConfigs] = useState<Record<string, TrackingConfig>>({})
  const [selectedStore, setSelectedStore] = useState<string>("")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("custom")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadConfigurations()
  }, [stores])

  const loadConfigurations = async () => {
    try {
      setIsLoading(true)
      const configsData: Record<string, TrackingConfig> = {}

      for (const store of stores) {
        const response = await fetch(`/api/stores/${store.id}/universal-tracking-config`)
        if (response.ok) {
          const data = await response.json()
          configsData[store.id] = data
        }
      }

      setConfigs(configsData)
    } catch (error) {
      console.error("Error loading configurations:", error)
      toast.error("Error al cargar las configuraciones")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleUniversalTracking = async (storeId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/stores/${storeId}/universal-tracking-config`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_universal_enabled: enabled
        }),
      })

      if (response.ok) {
        const updatedConfig = await response.json()
        setConfigs(prev => ({
          ...prev,
          [storeId]: updatedConfig
        }))
        toast.success(`Tracking universal ${enabled ? 'habilitado' : 'deshabilitado'}`)
      } else {
        toast.error("Error al actualizar la configuración")
      }
    } catch (error) {
      console.error("Error toggling universal tracking:", error)
      toast.error("Error al cambiar el estado del tracking")
    }
  }

  const copyScript = async (storeId: string, platform: string) => {
    try {
      const store = stores.find(s => s.id === storeId)
      if (!store) return

      const config = configs[storeId]
      if (!config) return

      const script = UniversalTrackingScript.generateScript({
        storeId: store.id,
        pixelId: store.tracking_script_id || `px_${store.id}`,
        apiUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || "https://cuponomics.app",
        enableAdvancedFingerprinting: config.enable_advanced_fingerprinting,
        enableCanvasFingerprint: config.enable_canvas_fingerprint,
        enableWebGLFingerprint: config.enable_webgl_fingerprint,
        enableFontDetection: config.enable_font_detection,
        respectDNT: config.respect_dnt_header,
        scriptTimeout: config.script_timeout_ms,
        maxRetryAttempts: config.max_retry_attempts
      })

      await navigator.clipboard.writeText(script)
      setCopiedScripts({ ...copiedScripts, [`${storeId}_${platform}`]: true })
      toast.success("Script copiado al portapapeles")
      setTimeout(() => {
        setCopiedScripts({ ...copiedScripts, [`${storeId}_${platform}`]: false })
      }, 2000)
    } catch (error) {
      toast.error("Error al copiar el script")
    }
  }

  const downloadScript = async (storeId: string, platform: string) => {
    try {
      const store = stores.find(s => s.id === storeId)
      if (!store) return

      const config = configs[storeId]
      if (!config) return

      const script = UniversalTrackingScript.generateScript({
        storeId: store.id,
        pixelId: store.tracking_script_id || `px_${store.id}`,
        apiUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || "https://cuponomics.app",
        enableAdvancedFingerprinting: config.enable_advanced_fingerprinting,
        enableCanvasFingerprint: config.enable_canvas_fingerprint,
        enableWebGLFingerprint: config.enable_webgl_fingerprint,
        enableFontDetection: config.enable_font_detection,
        respectDNT: config.respect_dnt_header,
        scriptTimeout: config.script_timeout_ms,
        maxRetryAttempts: config.max_retry_attempts
      })

      const blob = new Blob([script], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cuponomics-universal-tracking-${store.name}-${platform}.js`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success("Script descargado")
    } catch (error) {
      toast.error("Error al descargar el script")
    }
  }

  const getTrackingStatus = (storeId: string) => {
    const config = configs[storeId]
    if (!config) return { status: "unknown", label: "Desconocido", color: "gray", icon: AlertTriangle }
    
    if (config.is_universal_enabled) {
      return { status: "enabled", label: "Habilitado", color: "green", icon: CheckCircle }
    } else {
      return { status: "disabled", label: "Deshabilitado", color: "red", icon: XCircle }
    }
  }

  const generateScript = (storeId: string, platform: string) => {
    const store = stores.find(s => s.id === storeId)
    if (!store) return ""

    const config = configs[storeId]
    if (!config) return ""

    return UniversalTrackingScript.generateScript({
      storeId: store.id,
      pixelId: store.tracking_script_id || `px_${store.id}`,
      apiUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || "https://cuponomics.app",
      enableAdvancedFingerprinting: config.enable_advanced_fingerprinting,
      enableCanvasFingerprint: config.enable_canvas_fingerprint,
      enableWebGLFingerprint: config.enable_webgl_fingerprint,
      enableFontDetection: config.enable_font_detection,
      respectDNT: config.respect_dnt_header,
      scriptTimeout: config.script_timeout_ms,
      maxRetryAttempts: config.max_retry_attempts
    })
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
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Zap className="w-5 h-5" />
            Instalación Súper Fácil (5 minutos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h4 className="font-semibold mb-2">Copia el Código</h4>
              <p className="text-sm text-gray-600">
                Haz click en "Copiar Script" abajo
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h4 className="font-semibold mb-2">Pega en tu Sitio</h4>
              <p className="text-sm text-gray-600">
                En el &lt;head&gt; de tu página
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
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
               <StoreIcon className="w-5 h-5" />
               Tus Tiendas
             </CardTitle>
        </CardHeader>
        <CardContent>
          {stores.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No tienes tiendas configuradas. Primero crea una tienda en la sección "Tiendas".
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <div key={store.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{store.name}</h3>
                      <p className="text-sm text-gray-600">{store.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={configs[store.id]?.is_universal_enabled || false}
                        onCheckedChange={(enabled) => toggleUniversalTracking(store.id, enabled)}
                        disabled={isLoading}
                      />
                      <Badge variant={configs[store.id]?.is_universal_enabled ? "default" : "secondary"}>
                        {configs[store.id]?.is_universal_enabled ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>

                  {configs[store.id]?.is_universal_enabled && (
                    <div className="space-y-4">
                      {/* Selector de plataforma */}
                      <div>
                        <Label htmlFor={`platform-${store.id}`}>Plataforma de tu tienda:</Label>
                        <select
                          id={`platform-${store.id}`}
                          value={selectedPlatform}
                          onChange={(e) => setSelectedPlatform(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          {UNIVERSAL_ECOMMERCE_PLATFORMS.map((platform) => (
                            <option key={platform.id} value={platform.id}>
                              {platform.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Script generado */}
                      <div>
                        <Label>Script para tu tienda:</Label>
                        <div className="mt-2 relative">
                          <Textarea
                            value={generateScript(store.id, selectedPlatform)}
                            readOnly
                            className="font-mono text-sm h-32"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyScript(store.id, selectedPlatform)}
                              className="h-8"
                            >
                              {copiedScripts[`${store.id}-${selectedPlatform}`] ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadScript(store.id, selectedPlatform)}
                              className="h-8"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Instrucciones específicas */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">📋 Instrucciones para {UNIVERSAL_ECOMMERCE_PLATFORMS.find(p => p.id === selectedPlatform)?.name}:</h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          {selectedPlatform === 'shopify' && (
                            <>
                              <p>1. Ve a tu <strong>Admin de Shopify</strong></p>
                                                             <p>2. Navega a <strong>"Online Store" &gt; "Themes"</strong></p>
                               <p>3. Haz click en <strong>"Actions" &gt; "Edit code"</strong></p>
                                                             <p>4. Abre <strong>"Layout" &gt; "theme.liquid"</strong></p>
                              <p>5. Busca <code>&lt;/head&gt;</code> (Ctrl+F)</p>
                              <p>6. <strong>Pega el código ANTES</strong> de <code>&lt;/head&gt;</code></p>
                              <p>7. <strong>Guarda</strong> (Ctrl+S)</p>
                            </>
                          )}
                          {selectedPlatform === 'woocommerce' && (
                            <>
                              <p>1. Ve a tu <strong>WordPress Admin</strong></p>
                                                             <p>2. Navega a <strong>"Appearance" &gt; "Theme Editor"</strong></p>
                              <p>3. Selecciona <strong>"functions.php"</strong></p>
                              <p>4. <strong>Pega el código al FINAL</strong> del archivo</p>
                              <p>5. <strong>Guarda</strong> (Ctrl+S)</p>
                            </>
                          )}
                          {selectedPlatform === 'custom' && (
                            <>
                              <p>1. Abre tu <strong>editor de código</strong></p>
                              <p>2. Busca el archivo <strong>"index.html"</strong> o <strong>"header.php"</strong></p>
                              <p>3. Busca <code>&lt;/head&gt;</code> (Ctrl+F)</p>
                              <p>4. <strong>Pega el código ANTES</strong> de <code>&lt;/head&gt;</code></p>
                              <p>5. <strong>Guarda</strong> y sube a tu servidor</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Estado del tracking */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getTrackingStatus(store.id).status === 'enabled' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">
                          Estado: {getTrackingStatus(store.id).status === 'enabled' ? 'Script Activo' : 'Verificando...'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuraciones avanzadas */}
      {stores.some(store => configs[store.id]?.is_universal_enabled) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuraciones Avanzadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🖐️ Fingerprinting Avanzado</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Detección de Canvas
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Detección de WebGL
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Detección de Fuentes
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Fingerprint Único
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🛡️ Privacidad y Seguridad</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Respeto por Do Not Track
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Detección de Fraude
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Protección contra Bots
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Datos Encriptados
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 