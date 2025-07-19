"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, RefreshCw } from "lucide-react"

interface UTMException {
  id: string
  store_id?: string
  store_name: string
  domain: string
  reason?: string
  is_active: boolean
  created_at: string
}

export default function UTMExceptionsPage() {
  const [exceptions, setExceptions] = useState<UTMException[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newException, setNewException] = useState({
    store_name: "",
    domain: "",
    reason: "",
  })

  const loadExceptions = async () => {
    try {
      const response = await fetch("/api/utm-exceptions")
      if (response.ok) {
        const data = await response.json()
        setExceptions(data)
      }
    } catch (error) {
      console.error("Error loading exceptions:", error)
    } finally {
      setLoading(false)
    }
  }

  const addException = async () => {
    if (!newException.store_name || !newException.domain) return

    setAdding(true)
    try {
      const response = await fetch("/api/utm-exceptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newException),
      })

      if (response.ok) {
        setNewException({ store_name: "", domain: "", reason: "" })
        loadExceptions()
      }
    } catch (error) {
      console.error("Error adding exception:", error)
    } finally {
      setAdding(false)
    }
  }

  useEffect(() => {
    loadExceptions()
  }, [])

  if (loading) {
    return <div className="p-6">Cargando excepciones UTM...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Excepciones UTM Tracking</h1>
        <Button onClick={loadExceptions} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Recargar
        </Button>
      </div>

      {/* Formulario para agregar nueva excepción */}
      <Card>
        <CardHeader>
          <CardTitle>Agregar Nueva Excepción</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="store_name">Nombre de la Tienda</Label>
              <Input
                id="store_name"
                value={newException.store_name}
                onChange={(e) => setNewException((prev) => ({ ...prev, store_name: e.target.value }))}
                placeholder="Amazon, AliExpress, etc."
              />
            </div>
            <div>
              <Label htmlFor="domain">Dominio</Label>
              <Input
                id="domain"
                value={newException.domain}
                onChange={(e) => setNewException((prev) => ({ ...prev, domain: e.target.value }))}
                placeholder="amazon.com, aliexpress.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="reason">Razón (Opcional)</Label>
            <Textarea
              id="reason"
              value={newException.reason}
              onChange={(e) => setNewException((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Programa de afiliados propio, enlaces especiales, etc."
            />
          </div>
          <Button onClick={addException} disabled={adding || !newException.store_name || !newException.domain}>
            <Plus className="w-4 h-4 mr-2" />
            {adding ? "Agregando..." : "Agregar Excepción"}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de excepciones */}
      <Card>
        <CardHeader>
          <CardTitle>Excepciones Activas ({exceptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {exceptions.length === 0 ? (
            <p className="text-muted-foreground">No hay excepciones configuradas.</p>
          ) : (
            <div className="space-y-4">
              {exceptions.map((exception) => (
                <div key={exception.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{exception.store_name}</h3>
                      <Badge variant="secondary">{exception.domain}</Badge>
                    </div>
                    {exception.reason && <p className="text-sm text-muted-foreground">{exception.reason}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Creado: {new Date(exception.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información */}
      <Card>
        <CardHeader>
          <CardTitle>¿Cómo funciona?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Las tiendas en esta lista NO tendrán parámetros UTM agregados a sus enlaces</p>
          <p>
            • Esto es útil para tiendas con programas de afiliados que pueden verse afectados por parámetros adicionales
          </p>
          <p>• Los clics aún se registrarán internamente para estadísticas</p>
          <p>• Los enlaces se mantendrán exactamente como están configurados originalmente</p>
        </CardContent>
      </Card>
    </div>
  )
}
