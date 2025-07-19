"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Info, Code, BookOpen } from "lucide-react"
import { TrackingScriptGenerator, ECOMMERCE_PLATFORMS } from "@/lib/services/tracking-script-generator"

interface TrackingScriptDisplayProps {
  storeId: string
  storeName: string
  platform: string
  trackingScriptId?: string
}

export function TrackingScriptDisplay({ storeId, storeName, platform, trackingScriptId }: TrackingScriptDisplayProps) {
  const [copied, setCopied] = useState(false)

  // Generar un tracking script ID si no existe
  const scriptId = trackingScriptId || `track_${storeId.slice(0, 8)}_${Date.now()}`

  // Generar el script
  const script = TrackingScriptGenerator.generateScript(storeId, scriptId, platform)

  // Obtener información de la plataforma
  const platformInfo =
    ECOMMERCE_PLATFORMS.find((p) => p.id === platform) || ECOMMERCE_PLATFORMS.find((p) => p.id === "custom")!

  const copyToClipboard = async () => {
    if (!navigator.clipboard) {
      console.error("La API del portapapeles no es compatible con este navegador o contexto.")
      alert("No se puede copiar al portapapeles en este navegador o en un entorno no seguro (HTTP).")
      return
    }
    try {
      await navigator.clipboard.writeText(script)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Error al copiar:", err)
      alert("Hubo un error al intentar copiar el script.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Script para {storeName}</h3>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            Plataforma: <Badge variant="outline">{platformInfo.name}</Badge>
          </div>
        </div>
        <Button onClick={copyToClipboard} className="flex items-center gap-2">
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copiar Script
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="script" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="script" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Script
          </TabsTrigger>
          <TabsTrigger value="instructions" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Instrucciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="script" className="space-y-4">
          {/* Script Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Código del Script</CardTitle>
              <CardDescription>Copia este código e instálalo en tu tienda según las instrucciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-96">
                  <code>{script}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Script Info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>¿Qué hace este script?</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Rastrea las conversiones (ventas) de tu tienda</li>
                <li>• Identifica qué cupones generan más ventas</li>
                <li>• No recopila información personal de tus clientes</li>
                <li>• Es completamente seguro y no afecta la velocidad de tu sitio</li>
                <li>• Solo envía datos de pedidos completados</li>
              </ul>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          {/* Platform Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Instrucciones para {platformInfo.name}</CardTitle>
              <CardDescription>{platformInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Pasos de instalación:</h4>
                <ol className="space-y-2">
                  {platformInfo.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {platformInfo.additionalNotes && platformInfo.additionalNotes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Notas adicionales:</h4>
                    <ul className="space-y-1">
                      {platformInfo.additionalNotes.map((note, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex gap-2">
                          <span>•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>¿Necesitas ayuda?</strong>
              <p className="mt-1 text-sm">
                Si tienes problemas instalando el script o no ves conversiones después de 24 horas, contacta nuestro
                soporte técnico. Incluye el ID de tu tienda: <code className="bg-muted px-1 rounded">{storeId}</code>
              </p>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
