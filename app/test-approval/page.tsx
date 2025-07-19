"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Store, User, Building } from "lucide-react"

interface StoreApplication {
  id: string
  store_name: string
  description: string
  category: string
  website: string
  contact_email: string
  contact_phone: string
  address: string
  logo_url: string
  status: string
  user_id: string
  created_at: string
}

interface StoreData {
  id: string
  name: string
  slug: string
  user_id: string
  owner_id: string
  is_active: boolean
  created_at: string
  store_application_id: string
}

export default function TestApprovalPage() {
  const [applications, setApplications] = useState<StoreApplication[]>([])
  const [stores, setStores] = useState<StoreData[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [newApplication, setNewApplication] = useState({
    store_name: "",
    description: "",
    category: "Tecnología",
    website: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    user_id: "",
  })

  const supabase = createClient()

  const fetchData = async () => {
    try {
      // Obtener solicitudes de tienda
      const { data: appsData, error: appsError } = await supabase
        .from("store_applications")
        .select("*")
        .order("created_at", { ascending: false })

      if (appsError) throw appsError

      // Obtener tiendas
      const { data: storesData, error: storesError } = await supabase
        .from("stores")
        .select("*")
        .order("created_at", { ascending: false })

      if (storesError) throw storesError

      setApplications(appsData || [])
      setStores(storesData || [])
    } catch (error: any) {
      console.error("Error al cargar datos:", error)
      setMessage(`Error: ${error.message}`)
    }
  }

  const createTestApplication = async () => {
    if (!newApplication.store_name || !newApplication.contact_email || !newApplication.user_id) {
      setMessage("Por favor completa al menos el nombre de la tienda, email y user_id")
      return
    }

    try {
      setLoading(true)
      setMessage(null)

      const applicationData = {
        ...newApplication,
        status: "pending",
        logo_url: null,
      }

      const { data, error } = await supabase.from("store_applications").insert([applicationData]).select()

      if (error) throw error

      setMessage("✅ Solicitud de prueba creada exitosamente")
      setNewApplication({
        store_name: "",
        description: "",
        category: "Tecnología",
        website: "",
        contact_email: "",
        contact_phone: "",
        address: "",
        user_id: "",
      })
      await fetchData()
    } catch (error: any) {
      console.error("Error al crear solicitud:", error)
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const approveApplication = async (applicationId: string) => {
    try {
      setLoading(true)
      setMessage(null)

      const { error } = await supabase.from("store_applications").update({ status: "approved" }).eq("id", applicationId)

      if (error) throw error

      setMessage("✅ Solicitud aprobada. El trigger creará la tienda automáticamente.")

      // Esperar para que el trigger se ejecute
      setTimeout(async () => {
        await fetchData()
        setLoading(false)
      }, 2000)
    } catch (error: any) {
      console.error("Error al aprobar:", error)
      setMessage(`❌ Error: ${error.message}`)
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobada
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Rechazada
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🧪 Prueba de Aprobación de Tiendas</h1>
        <Button onClick={fetchData} variant="outline">
          🔄 Actualizar
        </Button>
      </div>

      {message && (
        <Alert className={message.includes("❌") ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Formulario para crear solicitud de prueba */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Crear Solicitud de Prueba
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="store_name">Nombre de la tienda *</Label>
              <Input
                id="store_name"
                value={newApplication.store_name}
                onChange={(e) => setNewApplication({ ...newApplication, store_name: e.target.value })}
                placeholder="Mi Tienda de Prueba"
              />
            </div>
            <div>
              <Label htmlFor="user_id">User ID (UUID) *</Label>
              <Input
                id="user_id"
                value={newApplication.user_id}
                onChange={(e) => setNewApplication({ ...newApplication, user_id: e.target.value })}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
            </div>
            <div>
              <Label htmlFor="contact_email">Email de contacto *</Label>
              <Input
                id="contact_email"
                type="email"
                value={newApplication.contact_email}
                onChange={(e) => setNewApplication({ ...newApplication, contact_email: e.target.value })}
                placeholder="contacto@mitienda.com"
              />
            </div>
            <div>
              <Label htmlFor="website">Sitio web</Label>
              <Input
                id="website"
                value={newApplication.website}
                onChange={(e) => setNewApplication({ ...newApplication, website: e.target.value })}
                placeholder="https://mitienda.com"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newApplication.description}
                onChange={(e) => setNewApplication({ ...newApplication, description: e.target.value })}
                placeholder="Descripción de la tienda de prueba"
              />
            </div>
          </div>
          <Button onClick={createTestApplication} disabled={loading} className="w-full">
            {loading ? "Creando..." : "Crear Solicitud de Prueba"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solicitudes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Solicitudes de Tienda ({applications.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {applications.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay solicitudes</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{app.store_name}</h4>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-xs text-gray-500">Email: {app.contact_email}</p>
                  <p className="text-xs text-gray-500">User ID: {app.user_id}</p>
                  <p className="text-xs text-gray-500">
                    Creada: {new Date(app.created_at).toLocaleDateString("es-ES")}
                  </p>
                  {app.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => approveApplication(app.id)}
                      disabled={loading}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      ✅ Aprobar
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Tiendas Creadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Tiendas Creadas ({stores.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {stores.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay tiendas creadas</p>
            ) : (
              stores.map((store) => (
                <div key={store.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{store.name}</h4>
                    <Badge variant={store.is_active ? "default" : "secondary"}>
                      {store.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">Slug: {store.slug}</p>
                  <p className="text-xs text-gray-500">User ID: {store.user_id}</p>
                  <p className="text-xs text-gray-500">Owner ID: {store.owner_id}</p>
                  {store.store_application_id && (
                    <p className="text-xs text-gray-500">App ID: {store.store_application_id}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Creada: {new Date(store.created_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">📋 Instrucciones de Prueba</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>1.</strong> Completa el formulario con los datos de la tienda de prueba
          </p>
          <p>
            <strong>2.</strong> Asegúrate de usar un User ID válido (UUID de un usuario existente)
          </p>
          <p>
            <strong>3.</strong> Haz clic en "Crear Solicitud de Prueba"
          </p>
          <p>
            <strong>4.</strong> La solicitud aparecerá en la columna izquierda con estado "Pendiente"
          </p>
          <p>
            <strong>5.</strong> Haz clic en "Aprobar" para activar el trigger automático
          </p>
          <p>
            <strong>6.</strong> La tienda se creará automáticamente y aparecerá en la columna derecha
          </p>
          <p>
            <strong>7.</strong> El usuario se convertirá automáticamente en "merchant"
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
