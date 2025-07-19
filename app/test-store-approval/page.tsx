"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, StoreIcon, Users, Building } from "lucide-react"

interface StoreApplication {
  id: string
  store_name: string
  status: string
  user_id: string
  created_at: string
}

interface Store {
  id: string
  name: string
  slug: string
  owner_id: string
  is_active: boolean
  created_at: string
}

interface Profile {
  id: string
  role: string
  full_name: string | null
  email: string | null
}

export default function TestStoreApprovalPage() {
  const [applications, setApplications] = useState<StoreApplication[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
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

      // Obtener perfiles de usuarios
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, role, full_name, email")

      if (profilesError) throw profilesError

      setApplications(appsData || [])
      setStores(storesData || [])
      setProfiles(profilesData || [])
    } catch (error: any) {
      console.error("Error al cargar datos:", error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createTestApplication = async () => {
    try {
      setLoading(true)
      setMessage(null)

      // Crear una solicitud de tienda de prueba
      const testApplication = {
        store_name: `Tienda de Prueba ${Date.now()}`,
        description: "Esta es una tienda de prueba para verificar el flujo automático",
        category: "Tecnología",
        website: "https://ejemplo.com",
        logo_url: null,
        user_id: "test-user-id", // En un caso real, esto sería el ID del usuario actual
        status: "pending",
      }

      const { data, error } = await supabase.from("store_applications").insert([testApplication]).select()

      if (error) throw error

      setMessage("Solicitud de prueba creada exitosamente")
      await fetchData()
    } catch (error: any) {
      console.error("Error al crear solicitud de prueba:", error)
      setMessage(`Error: ${error.message}`)
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

      setMessage("Solicitud aprobada. El trigger debería crear la tienda automáticamente.")

      // Esperar un momento para que el trigger se ejecute
      setTimeout(async () => {
        await fetchData()
      }, 2000)
    } catch (error: any) {
      console.error("Error al aprobar solicitud:", error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
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

  const merchantProfiles = profiles.filter((p) => p.role === "merchant")

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando datos de prueba...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prueba de Aprobación de Tiendas</h1>
        <Button onClick={createTestApplication} disabled={loading}>
          Crear Solicitud de Prueba
        </Button>
      </div>

      {message && (
        <Alert className={message.includes("Error") ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Solicitudes de Tienda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Solicitudes de Tienda ({applications.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay solicitudes</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{app.store_name}</h4>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-xs text-gray-500">Creada: {new Date(app.created_at).toLocaleDateString()}</p>
                  {app.status === "pending" && (
                    <Button size="sm" onClick={() => approveApplication(app.id)} disabled={loading} className="w-full">
                      Aprobar
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
              <StoreIcon className="h-5 w-5" />
              Tiendas Creadas ({stores.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
                  <p className="text-xs text-gray-500">Creada: {new Date(store.created_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Usuarios Merchant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuarios Merchant ({merchantProfiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {merchantProfiles.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay merchants</p>
            ) : (
              merchantProfiles.map((profile) => (
                <div key={profile.id} className="border rounded-lg p-3 space-y-1">
                  <h4 className="font-medium text-sm">{profile.full_name || "Sin nombre"}</h4>
                  <p className="text-xs text-gray-500">{profile.email}</p>
                  <Badge variant="outline" className="text-xs">
                    {profile.role}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Cómo probar el flujo:</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Haz clic en "Crear Solicitud de Prueba" para generar una nueva solicitud</li>
          <li>2. Aparecerá en la columna "Solicitudes de Tienda" con estado "Pendiente"</li>
          <li>3. Haz clic en "Aprobar" para aprobar la solicitud</li>
          <li>4. El trigger automáticamente creará la tienda en la columna "Tiendas Creadas"</li>
          <li>5. El usuario se convertirá en merchant (aparecerá en "Usuarios Merchant")</li>
        </ol>
      </div>
    </div>
  )
}
