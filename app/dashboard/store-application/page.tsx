import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircleIcon, ClockIcon, XCircleIcon, PlusIcon } from "@heroicons/react/24/outline"

export default async function StoreApplicationPage() {
  const supabase = await createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect("/login")
  }

  // Obtener aplicaciones de tienda del usuario
  const { data: applications } = await supabase
    .from("store_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Obtener tiendas aprobadas del usuario
  const { data: approvedStores } = await supabase
    .from("stores")
    .select("id, name, status, created_at")
    .eq("owner_id", user.id)
    .eq("is_active", true)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Aprobada</Badge>
      case "rejected":
        return <Badge variant="destructive">Rechazada</Badge>
      default:
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Solicitudes de Tienda</h1>
          <p className="text-gray-600">Gestiona tus solicitudes para crear tiendas</p>
        </div>
        <Link href="/dashboard/store-application/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nueva Solicitud
          </Button>
        </Link>
      </div>

      {/* Tiendas Aprobadas */}
      {approvedStores && approvedStores.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Tiendas Activas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedStores.map((store) => (
              <Card key={store.id} className="border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <CardDescription>Activa desde {new Date(store.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/stores/${store.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Gestionar
                      </Button>
                    </Link>
                    <Link href={`/tiendas/${store.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Ver Tienda
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Solicitudes */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Historial de Solicitudes</h2>

        {!applications || applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes solicitudes de tienda</h3>
              <p className="text-gray-600 mb-6">Crea tu primera solicitud para comenzar a vender en Cuponomics</p>
              <Link href="/dashboard/store-application/new">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Crear Primera Solicitud
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(application.status)}
                      <div>
                        <CardTitle className="text-lg">{application.store_name}</CardTitle>
                        <CardDescription>
                          Solicitada el {new Date(application.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Descripción:</p>
                      <p className="text-sm">{application.description}</p>
                    </div>

                    {application.website && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Sitio web:</p>
                        <a
                          href={application.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {application.website}
                        </a>
                      </div>
                    )}

                    {application.category && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Categoría:</p>
                        <p className="text-sm">{application.category}</p>
                      </div>
                    )}

                    {application.admin_notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Notas del administrador:</p>
                        <p className="text-sm">{application.admin_notes}</p>
                      </div>
                    )}

                    {application.status === "approved" && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          ¡Felicitaciones! Tu solicitud ha sido aprobada. Tu tienda ha sido creada automáticamente.
                        </p>
                      </div>
                    )}

                    {application.status === "rejected" && (
                      <div className="mt-4 flex gap-2">
                        <Link href="/dashboard/store-application/new" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Nueva Solicitud
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
