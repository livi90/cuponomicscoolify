"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, AlertTriangle, CheckCircle, XCircle, Code, Shield } from "lucide-react"
import { TrackingScriptGenerator, ECOMMERCE_PLATFORMS } from "@/lib/services/tracking-script-generator"
import { toast } from "react-hot-toast"
import type { Store } from "@/lib/types"

interface TrackingScriptManagerProps {
  stores: Store[]
}

export default function TrackingScriptManager({ stores }: TrackingScriptManagerProps) {
  const [copiedScripts, setCopiedScripts] = useState<Record<string, boolean>>({})
  const [scriptStatuses, setScriptStatuses] = useState<Record<string, any>>({})

  useEffect(() => {
    // Cargar estados de los scripts
    loadScriptStatuses()
  }, [stores])

  const loadScriptStatuses = async () => {
    try {
      const statuses: Record<string, any> = {}

      for (const store of stores) {
        const response = await fetch(`/api/stores/${store.id}/script-status`)
        if (response.ok) {
          const data = await response.json()
          statuses[store.id] = data
        }
      }

      setScriptStatuses(statuses)
    } catch (error) {
      console.error("Error loading script statuses:", error)
    }
  }

  const copyScript = async (storeId: string, script: string) => {
    try {
      await navigator.clipboard.writeText(script)
      setCopiedScripts({ ...copiedScripts, [storeId]: true })
      toast.success("Script copiado al portapapeles")
      setTimeout(() => {
        setCopiedScripts({ ...copiedScripts, [storeId]: false })
      }, 2000)
    } catch (error) {
      toast.error("Error al copiar el script")
    }
  }

  const getScriptStatus = (store: Store) => {
    const status = scriptStatuses[store.id]
    const lastPing = status?.script_last_ping ? new Date(status.script_last_ping) : null
    const now = new Date()
    const hoursSinceLastPing = lastPing ? (now.getTime() - lastPing.getTime()) / (1000 * 60 * 60) : null

    if (!lastPing) {
      return { status: "never_installed", label: "No instalado", color: "red", icon: XCircle }
    } else if (hoursSinceLastPing && hoursSinceLastPing < 1) {
      return { status: "active", label: "Activo", color: "green", icon: CheckCircle }
    } else if (hoursSinceLastPing && hoursSinceLastPing < 24) {
      return { status: "warning", label: "Inactivo reciente", color: "yellow", icon: AlertTriangle }
    } else {
      return { status: "inactive", label: "Inactivo", color: "red", icon: XCircle }
    }
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
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>¿Para qué sirve el script de tracking?</strong>
          <br />
          Este código nos permite rastrear las ventas que se generen a través de los cupones publicados en Cuponomics.
          Es completamente seguro, no recopila información personal de tus clientes, y solo registra cuando alguien
          realiza una compra después de usar uno de tus cupones. Esto nos ayuda a calcular las comisiones de forma justa
          y transparente.
        </AlertDescription>
      </Alert>

      {stores.map((store) => {
        const script = TrackingScriptGenerator.generateScript(
          store.id,
          store.tracking_script_id || `script_${Date.now()}`,
          store.ecommerce_platform || "custom",
        )
        const platformData = ECOMMERCE_PLATFORMS.find((p) => p.id === store.ecommerce_platform)
        const scriptStatus = getScriptStatus(store)
        const StatusIcon = scriptStatus.icon

        return (
          <Card key={store.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    {store.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{platformData?.name || "Plataforma personalizada"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`
                      ${scriptStatus.color === "green" ? "bg-green-50 text-green-700 border-green-200" : ""}
                      ${scriptStatus.color === "yellow" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                      ${scriptStatus.color === "red" ? "bg-red-50 text-red-700 border-red-200" : ""}
                    `}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {scriptStatus.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="script" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="script">Script</TabsTrigger>
                  <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
                  <TabsTrigger value="status">Estado</TabsTrigger>
                </TabsList>

                <TabsContent value="script" className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Script de Tracking</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyScript(store.id, script)}
                        className="flex items-center gap-2"
                      >
                        {copiedScripts[store.id] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedScripts[store.id] ? "Copiado" : "Copiar"}
                      </Button>
                    </div>
                    <pre className="text-xs bg-white p-3 rounded border overflow-x-auto max-h-64">
                      <code>{script}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="instructions" className="space-y-4">
                  {platformData ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Instrucciones para {platformData.name}:</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {platformData.instructions.map((instruction, index) => (
                          <li key={index} className="text-gray-700">
                            {instruction}
                          </li>
                        ))}
                      </ol>

                      {platformData.additionalNotes && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Notas Adicionales:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                            {platformData.additionalNotes.map((note, index) => (
                              <li key={index}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">
                        No hay instrucciones específicas disponibles para esta plataforma.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="status" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Estado del Script</h4>
                      <div className="flex items-center gap-2">
                        <StatusIcon
                          className={`h-4 w-4 ${
                            scriptStatus.color === "green"
                              ? "text-green-600"
                              : scriptStatus.color === "yellow"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        />
                        <span className="text-sm">{scriptStatus.label}</span>
                      </div>
                    </div>

                    {scriptStatuses[store.id]?.script_last_ping && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Última Actividad</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(scriptStatuses[store.id].script_last_ping).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {scriptStatus.status === "never_installed" && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        El script aún no ha sido instalado en tu tienda. Instálalo siguiendo las instrucciones para
                        comenzar a rastrear conversiones.
                      </AlertDescription>
                    </Alert>
                  )}

                  {scriptStatus.status === "inactive" && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        El script no ha enviado señales en las últimas 24 horas. Verifica que esté correctamente
                        instalado en tu tienda.
                      </AlertDescription>
                    </Alert>
                  )}

                  {scriptStatus.status === "active" && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        ¡Perfecto! El script está funcionando correctamente y enviando datos.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
