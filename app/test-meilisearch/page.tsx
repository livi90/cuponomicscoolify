"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Database, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Info,
  FileText
} from "lucide-react"

export default function TestMeilisearchPage() {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [categories, setCategories] = useState<any>(null)
  const [sample, setSample] = useState<any>(null)
  const [attributes, setAttributes] = useState<any>(null)

  const performAction = async (action: string, query?: string) => {
    setLoading(true)
    try {
      let url = `/api/debug-meilisearch?action=${action}`
      if (query) url += `&q=${encodeURIComponent(query)}`
      if (action === 'sample') url += '&limit=20'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        switch (action) {
          case 'stats':
            setStats(data.data)
            break
          case 'raw-search':
            setResults(data.data)
            break
          case 'sample':
            setSample(data.data)
            break
          case 'categories':
            setCategories(data.data)
            break
          case 'searchable-attributes':
            setAttributes(data.data)
            break
        }
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      alert(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      performAction('raw-search', searchQuery)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Test y Debug de Meilisearch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={() => performAction('stats')}
                disabled={loading}
                variant="outline"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Info className="h-4 w-4 mr-2" />}
                Obtener Estadísticas
              </Button>
              <Button 
                onClick={() => performAction('sample')}
                disabled={loading}
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                Muestra de Productos
              </Button>
              <Button 
                onClick={() => performAction('categories')}
                disabled={loading}
                variant="outline"
              >
                <Database className="h-4 w-4 mr-2" />
                Ver Categorías
              </Button>
              <Button 
                onClick={() => performAction('searchable-attributes')}
                disabled={loading}
                variant="outline"
              >
                <Search className="h-4 w-4 mr-2" />
                Ver Configuración
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Búsqueda directa */}
        <Card>
          <CardHeader>
            <CardTitle>Prueba de Búsqueda Directa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Buscar productos (ej: nike, laptop, camiseta)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                Buscar
              </Button>
            </div>
            
            {results && (
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Query:</strong> "{results.query}" | 
                    <strong> Resultados:</strong> {results.totalHits} | 
                    <strong> Tiempo:</strong> {results.processingTime}ms
                  </AlertDescription>
                </Alert>
                
                {results.hits && results.hits.length > 0 ? (
                  <div className="grid gap-4">
                    {results.hits.map((hit: any, index: number) => (
                      <Card key={index} className="bg-white">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <strong>ID:</strong> {hit.id}
                            </div>
                            <div>
                              <strong>Nombre:</strong> {hit.product_name?.substring(0, 50)}...
                            </div>
                            <div>
                              <strong>Categoría:</strong> {hit.merchant_category}
                            </div>
                            <div>
                              <strong>Precio:</strong> {hit.search_price} €
                            </div>
                          </div>
                          {hit.description && (
                            <div className="mt-2 text-xs text-gray-600">
                              <strong>Descripción:</strong> {hit.description.substring(0, 100)}...
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No se encontraron resultados para "{results.query}"
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs con información */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            <TabsTrigger value="sample">Muestra</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="config">Configuración</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas del Índice</CardTitle>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold">{stats.totalDocuments}</div>
                        <div className="text-sm text-gray-600">Total Documentos</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold">{stats.stats.isIndexing ? 'Sí' : 'No'}</div>
                        <div className="text-sm text-gray-600">Indexando</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold">{stats.indexName}</div>
                        <div className="text-sm text-gray-600">Nombre del Índice</div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p>Haz clic en "Obtener Estadísticas" para ver la información</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sample">
            <Card>
              <CardHeader>
                <CardTitle>Muestra de Productos</CardTitle>
              </CardHeader>
              <CardContent>
                {sample ? (
                  <div className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Mostrando {sample.sampleSize} de {sample.totalDocuments} productos total
                      </AlertDescription>
                    </Alert>
                    <div className="grid gap-2">
                      {sample.hits.map((hit: any, index: number) => (
                        <div key={index} className="border rounded p-2 text-sm">
                          <strong>{hit.product_name}</strong> | 
                          <Badge variant="outline" className="ml-2">{hit.merchant_category}</Badge> | 
                          <span className="ml-2">{hit.search_price} €</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>Haz clic en "Muestra de Productos" para ver ejemplos</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Categorías Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                {categories ? (
                  <div className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        {categories.categoriesCount} categorías únicas de {categories.totalDocuments} productos
                      </AlertDescription>
                    </Alert>
                    <div className="flex flex-wrap gap-2">
                      {categories.uniqueCategories.map((category: string, index: number) => (
                        <Badge key={index} variant="outline">{category}</Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>Haz clic en "Ver Categorías" para ver todas las categorías</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Búsqueda</CardTitle>
              </CardHeader>
              <CardContent>
                {attributes ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Atributos de Búsqueda:</h4>
                      <div className="flex flex-wrap gap-2">
                        {attributes.searchableAttributes.map((attr: string, index: number) => (
                          <Badge key={index} variant="default">{attr}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Atributos Filtrables:</h4>
                      <div className="flex flex-wrap gap-2">
                        {attributes.filterableAttributes.map((attr: string, index: number) => (
                          <Badge key={index} variant="secondary">{attr}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Atributos Ordenables:</h4>
                      <div className="flex flex-wrap gap-2">
                        {attributes.sortableAttributes.map((attr: string, index: number) => (
                          <Badge key={index} variant="outline">{attr}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Haz clic en "Ver Configuración" para ver los atributos</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
