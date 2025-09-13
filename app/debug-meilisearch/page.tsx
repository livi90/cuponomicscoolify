"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Database, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Settings,
  Info
} from "lucide-react"

interface IndexInfo {
  exists: boolean
  info?: any
  stats?: any
  documentsCount?: number
  error?: string
}

interface SampleData {
  totalDocuments: number
  sampleDocuments: any[]
  error?: string
}

export default function DebugMeilisearchPage() {
  const [indexInfo, setIndexInfo] = useState<IndexInfo | null>(null)
  const [sampleData, setSampleData] = useState<SampleData | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadIndexInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/meilisearch-admin?action=info')
      const data = await response.json()
      
      if (data.success) {
        setIndexInfo(data.data.indexInfo)
        setSampleData(data.data.sampleDocuments)
      } else {
        console.error('Error loading index info:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const performAction = async (action: string) => {
    setActionLoading(action)
    try {
      const response = await fetch(`/api/meilisearch-admin?action=${action}`)
      const data = await response.json()
      
      if (data.success) {
        alert(`Acción "${action}" completada exitosamente`)
        // Recargar información después de la acción
        await loadIndexInfo()
      } else {
        alert(`Error en acción "${action}": ${data.error}`)
      }
    } catch (error) {
      alert(`Error: ${error}`)
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    loadIndexInfo()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Diagnóstico de Meilisearch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={loadIndexInfo}
                disabled={loading}
                variant="outline"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Info className="h-4 w-4 mr-2" />}
                Actualizar información
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estado del índice */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Índice: datafeed_2523969_2da_prueba</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Cargando información...</span>
              </div>
            ) : indexInfo ? (
              <div className="space-y-4">
                {indexInfo.exists ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      ✅ El índice existe y está funcionando correctamente
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      ❌ El índice no existe: {indexInfo.error}
                    </AlertDescription>
                  </Alert>
                )}
                
                {indexInfo.exists && indexInfo.stats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{indexInfo.stats.numberOfDocuments}</div>
                        <div className="text-sm text-gray-600">Documentos</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{indexInfo.stats.isIndexing ? 'Sí' : 'No'}</div>
                        <div className="text-sm text-gray-600">Indexando</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{indexInfo.info?.primaryKey || 'N/A'}</div>
                        <div className="text-sm text-gray-600">Primary Key</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              <div>No se pudo cargar la información del índice</div>
            )}
          </CardContent>
        </Card>

        {/* Acciones de administración */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones de Administración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => performAction('check')}
                disabled={!!actionLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                {actionLoading === 'check' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Verificar Índice
              </Button>
              
              <Button
                onClick={() => performAction('create')}
                disabled={!!actionLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                {actionLoading === 'create' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                Crear Índice
              </Button>
              
              <Button
                onClick={() => performAction('configure')}
                disabled={!!actionLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                {actionLoading === 'configure' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4" />
                )}
                Configurar Índice
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documentos de muestra */}
        {sampleData && sampleData.sampleDocuments && sampleData.sampleDocuments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Documentos de Muestra ({sampleData.totalDocuments} total)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleData.sampleDocuments.map((doc, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>ID:</strong> {doc.id}
                        </div>
                        <div>
                          <strong>Nombre:</strong> {doc.product_name?.substring(0, 50)}...
                        </div>
                        <div>
                          <strong>Precio:</strong> {doc.search_price} €
                        </div>
                        <div>
                          <strong>Categoría:</strong> {doc.merchant_category}
                        </div>
                        <div>
                          <strong>Rating:</strong> {doc.rating || 'N/A'}
                        </div>
                        <div>
                          <strong>Tiene imagen:</strong> {doc.merchant_image_url ? '✅' : '❌'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información de configuración */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>Índice:</strong> <Badge>datafeed_2523969_2da_prueba</Badge></div>
              <div><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">https://meilisearch-b8osgk4ckgococo40080w80w.dbcuponomics.online</code></div>
              <div><strong>API Key:</strong> {process.env.NEXT_PUBLIC_MEILISEARCH_URL ? '✅ Configurada' : '❌ No configurada'}</div>
              
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Si el índice no existe, necesitas indexar tus datos CSV en Meilisearch. 
                  El índice debe llamarse exactamente <code>datafeed_2523969_2da_prueba</code> para que funcione con esta aplicación.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
