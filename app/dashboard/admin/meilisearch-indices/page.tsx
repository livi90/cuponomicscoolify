'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Database, 
  Plus, 
  Trash2, 
  Settings, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AdminNavigation from "@/components/dashboard/AdminNavigation"

interface IndexInfo {
  uid: string
  name: string
  primaryKey: string
  createdAt: string
  updatedAt: string
  status: string
}

interface IndexStats {
  numberOfDocuments: number
  isIndexing: boolean
  fieldDistribution: Record<string, number>
}

interface IndexSettings {
  searchableAttributes: string[]
  filterableAttributes: string[]
  sortableAttributes: string[]
  rankingRules: string[]
  distinctAttribute: string | null
  pagination: {
    maxTotalHits: number
  }
}

export default function MeilisearchIndicesPage() {
  const [indices, setIndices] = useState<IndexInfo[]>([])
  const [selectedIndex, setSelectedIndex] = useState<string>('')
  const [indexStats, setIndexStats] = useState<IndexStats | null>(null)
  const [indexSettings, setIndexSettings] = useState<IndexSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [creatingIndex, setCreatingIndex] = useState(false)
  const [newIndexName, setNewIndexName] = useState('')
  const [newIndexPrimaryKey, setNewIndexPrimaryKey] = useState('id')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [showUnifiedSearch, setShowUnifiedSearch] = useState(false)
  const [unifiedSearchQuery, setUnifiedSearchQuery] = useState('')
  const [unifiedSearchResults, setUnifiedSearchResults] = useState<any[]>([])
  const [unifiedSearching, setUnifiedSearching] = useState(false)
  const [showImportCSV, setShowImportCSV] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [importingCSV, setImportingCSV] = useState(false)
  const [csvMapping, setCsvMapping] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Cargar índices al montar el componente
  useEffect(() => {
    loadIndices()
  }, [])

  // Cargar información del índice seleccionado
  useEffect(() => {
    if (selectedIndex) {
      loadIndexInfo(selectedIndex)
    }
  }, [selectedIndex])

  const loadIndices = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/meilisearch/indices')
      if (response.ok) {
        const data = await response.json()
        setIndices(data.indices || [])
      } else {
        throw new Error('Error al cargar índices')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los índices",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadIndexInfo = async (indexName: string) => {
    try {
      // Cargar estadísticas
      const statsResponse = await fetch(`/api/admin/meilisearch/indices/${indexName}/stats`)
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setIndexStats(statsData.stats)
      }

      // Cargar configuración
      const settingsResponse = await fetch(`/api/admin/meilisearch/indices/${indexName}/settings`)
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        setIndexSettings(settingsData.settings)
      }
    } catch (error) {
      console.error('Error al cargar información del índice:', error)
    }
  }

  const createIndex = async () => {
    if (!newIndexName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del índice es requerido",
        variant: "destructive"
      })
      return
    }

    setCreatingIndex(true)
    try {
      const response = await fetch('/api/admin/meilisearch/indices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newIndexName,
          primaryKey: newIndexPrimaryKey
        })
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Índice "${newIndexName}" creado correctamente`
        })
        setNewIndexName('')
        setNewIndexPrimaryKey('id')
        loadIndices()
      } else {
        throw new Error('Error al crear índice')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo crear el índice",
        variant: "destructive"
      })
    } finally {
      setCreatingIndex(false)
    }
  }

  const deleteIndex = async (indexName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el índice "${indexName}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/meilisearch/indices/${indexName}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Índice "${indexName}" eliminado correctamente`
        })
        if (selectedIndex === indexName) {
          setSelectedIndex('')
          setIndexStats(null)
          setIndexSettings(null)
        }
        loadIndices()
      } else {
        throw new Error('Error al eliminar índice')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el índice",
        variant: "destructive"
      })
    }
  }

  const searchInIndex = async () => {
    if (!selectedIndex || !searchQuery.trim()) return

    setSearching(true)
    try {
      const response = await fetch(`/api/admin/meilisearch/indices/${selectedIndex}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          limit: 20
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.hits || [])
      } else {
        throw new Error('Error en la búsqueda')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Error al realizar la búsqueda",
        variant: "destructive"
      })
    } finally {
      setSearching(false)
    }
  }

  const updateIndexSettings = async (settings: Partial<IndexSettings>) => {
    if (!selectedIndex) return

    try {
      const response = await fetch(`/api/admin/meilisearch/indices/${selectedIndex}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Configuración del índice actualizada"
        })
        loadIndexInfo(selectedIndex)
      } else {
        throw new Error('Error al actualizar configuración')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive"
      })
    }
  }

  const unifiedSearch = async () => {
    if (!unifiedSearchQuery.trim() || indices.length === 0) return

    setUnifiedSearching(true)
    try {
      // Usar la nueva API de búsqueda unificada
      const response = await fetch('/api/admin/meilisearch/unified-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: unifiedSearchQuery,
          limit: 50,
          indices: [] // Buscar en todos los índices
        })
      })

      if (response.ok) {
        const data = await response.json()
        setUnifiedSearchResults(data.hits || [])
        
        // Mostrar estadísticas de la búsqueda
        toast({
          title: "Búsqueda Completada",
          description: `Encontrados ${data.totalHits} resultados en ${data.indicesSearched} índices`,
        })
      } else {
        throw new Error('Error en la búsqueda unificada')
      }
    } catch (error) {
      console.error('Error en búsqueda unificada:', error)
      toast({
        title: "Error",
        description: "Error al realizar la búsqueda unificada",
        variant: "destructive"
      })
    } finally {
      setUnifiedSearching(false)
    }
  }

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
      // Leer el CSV para obtener las columnas
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        const lines = csv.split('\n')
        if (lines.length > 0) {
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
          const mapping: Record<string, string> = {}
          headers.forEach(header => {
            mapping[header] = header // Mapeo por defecto
          })
          setCsvMapping(mapping)
        }
      }
      reader.readAsText(file)
    } else {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo CSV válido",
        variant: "destructive"
      })
    }
  }

  const importCSVToIndex = async () => {
    if (!csvFile || !selectedIndex || Object.keys(csvMapping).length === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo CSV y un índice",
        variant: "destructive"
      })
      return
    }

    setImportingCSV(true)
    try {
      const formData = new FormData()
      formData.append('file', csvFile)
      formData.append('indexName', selectedIndex)
      formData.append('mapping', JSON.stringify(csvMapping))

      const response = await fetch('/api/admin/meilisearch/import-csv', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Éxito",
          description: `CSV importado correctamente. ${data.importedCount} documentos agregados.`
        })
        setShowImportCSV(false)
        setCsvFile(null)
        setCsvMapping({})
        loadIndexInfo(selectedIndex) // Recargar estadísticas
      } else {
        throw new Error('Error al importar CSV')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo importar el CSV",
        variant: "destructive"
      })
    } finally {
      setImportingCSV(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Navegación de administrador */}
      <AdminNavigation />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Índices Meilisearch</h1>
          <p className="text-gray-600 mt-2">
            Administra y configura los índices de búsqueda de la plataforma
          </p>
        </div>
        <Button onClick={loadIndices} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Crear nuevo índice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Crear Nuevo Índice
          </CardTitle>
          <CardDescription>
            Crea un nuevo índice para almacenar y buscar documentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="indexName">Nombre del Índice</Label>
              <Input
                id="indexName"
                value={newIndexName}
                onChange={(e) => setNewIndexName(e.target.value)}
                placeholder="ej: nike_productos, adidas_cupones"
              />
                             <p className="text-xs text-gray-500 mt-1">
                 Formato recomendado: tienda_tipo
               </p>
            </div>
            <div>
              <Label htmlFor="primaryKey">Clave Primaria</Label>
              <Input
                id="primaryKey"
                value={newIndexPrimaryKey}
                onChange={(e) => setNewIndexPrimaryKey(e.target.value)}
                placeholder="ej: id, sku, product_id"
              />
              <p className="text-xs text-gray-500 mt-1">
                Campo único que identifica cada documento
              </p>
            </div>
            <div>
              <Label htmlFor="indexType">Tipo de Contenido</Label>
              <select
                id="indexType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => {
                  // Auto-configurar según el tipo seleccionado
                  const type = e.target.value
                  if (type === 'productos') {
                    setNewIndexPrimaryKey('id')
                  } else if (type === 'cupones') {
                    setNewIndexPrimaryKey('code')
                  } else if (type === 'usuarios') {
                    setNewIndexPrimaryKey('email')
                  }
                }}
              >
                <option value="">Seleccionar tipo...</option>
                <option value="productos">Productos</option>
                <option value="cupones">Cupones</option>
                <option value="usuarios">Usuarios</option>
                <option value="ofertas">Ofertas</option>
                <option value="categorias">Categorías</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>
          </div>
          <Button 
            onClick={createIndex} 
            disabled={creatingIndex || !newIndexName.trim()}
            className="w-full md:w-auto"
          >
            {creatingIndex ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Crear Índice
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de índices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Índices Disponibles
          </CardTitle>
          <CardDescription>
            Selecciona un índice para ver su información y configuración
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Cargando índices...
            </div>
          ) : indices.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay índices disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {indices.map((index) => (
                <div
                  key={index.uid}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedIndex === index.uid
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedIndex(index.uid)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-blue-500" />
                      <div>
                        <h3 className="font-semibold">{index.name}</h3>
                        <p className="text-sm text-gray-500">
                          Clave primaria: {index.primaryKey}
                        </p>
                        <p className="text-xs text-gray-400">
                          Creado: {new Date(index.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={index.status === 'indexed' ? 'default' : 'secondary'}>
                        {index.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteIndex(index.uid)
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del índice seleccionado */}
      {selectedIndex && (
        <>
                     {/* Estadísticas del índice */}
           {indexStats && (
             <Card>
               <CardHeader>
                 <div className="flex items-center justify-between">
                   <CardTitle className="flex items-center gap-2">
                     <Info className="h-5 w-5" />
                     Estadísticas del Índice
                   </CardTitle>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setShowImportCSV(!showImportCSV)}
                   >
                     {showImportCSV ? 'Ocultar' : 'Importar CSV'}
                   </Button>
                 </div>
               </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {indexStats.numberOfDocuments.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Documentos</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {indexStats.isIndexing ? 'Sí' : 'No'}
                    </div>
                    <div className="text-sm text-gray-600">Indexando</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.keys(indexStats.fieldDistribution).length}
                    </div>
                    <div className="text-sm text-gray-600">Campos</div>
                  </div>
                </div>
              </CardContent>
              
              {/* Importación de CSV */}
              {showImportCSV && (
                <CardContent className="border-t pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="csvFile" className="text-sm font-medium">
                        Seleccionar archivo CSV
                      </Label>
                      <Input
                        id="csvFile"
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        El archivo debe tener encabezados en la primera fila
                      </p>
                    </div>
                    
                    {csvFile && Object.keys(csvMapping).length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">
                          Mapeo de columnas (opcional)
                        </Label>
                        <div className="mt-2 space-y-2">
                          {Object.entries(csvMapping).map(([csvHeader, targetField]) => (
                            <div key={csvHeader} className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 w-32 truncate">
                                {csvHeader}
                              </span>
                              <span className="text-sm text-gray-400">→</span>
                              <Input
                                value={targetField}
                                onChange={(e) => setCsvMapping({
                                  ...csvMapping,
                                  [csvHeader]: e.target.value
                                })}
                                className="flex-1"
                                placeholder="Campo destino"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {csvFile && (
                      <Button
                        onClick={importCSVToIndex}
                        disabled={importingCSV}
                        className="w-full"
                      >
                        {importingCSV ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Importando...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Importar CSV al Índice
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Configuración del índice */}
          {indexSettings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración del Índice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Atributos de búsqueda */}
                <div>
                  <Label className="text-sm font-medium">Atributos de Búsqueda</Label>
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={indexSettings.searchableAttributes.join('\n')}
                      onChange={(e) => {
                        const newAttributes = e.target.value.split('\n').filter(attr => attr.trim())
                        updateIndexSettings({ searchableAttributes: newAttributes })
                      }}
                      placeholder="Un atributo por línea"
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                {/* Atributos filtrables */}
                <div>
                  <Label className="text-sm font-medium">Atributos Filtrables</Label>
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={indexSettings.filterableAttributes.join('\n')}
                      onChange={(e) => {
                        const newAttributes = e.target.value.split('\n').filter(attr => attr.trim())
                        updateIndexSettings({ filterableAttributes: newAttributes })
                      }}
                      placeholder="Un atributo por línea"
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                {/* Atributos ordenables */}
                <div>
                  <Label className="text-sm font-medium">Atributos Ordenables</Label>
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={indexSettings.sortableAttributes.join('\n')}
                      onChange={(e) => {
                        const newAttributes = e.target.value.split('\n').filter(attr => attr.trim())
                        updateIndexSettings({ sortableAttributes: newAttributes })
                      }}
                      placeholder="Un atributo por línea"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Búsqueda en el índice */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Búsqueda en el Índice
                  </CardTitle>
                  <CardDescription>
                    Prueba la funcionalidad de búsqueda del índice seleccionado
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUnifiedSearch(!showUnifiedSearch)}
                >
                  {showUnifiedSearch ? 'Ocultar' : 'Mostrar'} Búsqueda Global
                </Button>
              </div>
            </CardHeader>
            
            {/* Búsqueda unificada en múltiples índices */}
            {showUnifiedSearch && (
              <CardContent className="space-y-4 border-t pt-4">
                <div className="flex gap-2">
                  <Input
                    value={unifiedSearchQuery}
                    onChange={(e) => setUnifiedSearchQuery(e.target.value)}
                    placeholder="Buscar en todos los índices..."
                    onKeyPress={(e) => e.key === 'Enter' && unifiedSearch()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={unifiedSearch} 
                    disabled={unifiedSearching || !unifiedSearchQuery.trim()}
                  >
                    {unifiedSearching ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Búsqueda Global
                      </>
                    )}
                  </Button>
                </div>

                {/* Resultados de búsqueda unificada */}
                {unifiedSearchResults.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        🔍 Resultados Globales ({unifiedSearchResults.length})
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {indices.length} índices consultados
                      </Badge>
                    </div>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {unifiedSearchResults.map((result, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {result._sourceIndexName || result._sourceIndex}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Índice: {result._sourceIndex}
                            </span>
                          </div>
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(result, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
            
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Escribe tu consulta de búsqueda..."
                  onKeyPress={(e) => e.key === 'Enter' && searchInIndex()}
                />
                <Button 
                  onClick={searchInIndex} 
                  disabled={searching || !searchQuery.trim()}
                >
                  {searching ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>

              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Resultados ({searchResults.length})</h4>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {searchResults.map((result, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-gray-50">
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
