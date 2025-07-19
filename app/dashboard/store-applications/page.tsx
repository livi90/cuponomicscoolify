import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StoreApplicationItem } from "@/components/dashboard/store-application-item"
import type { StoreApplication } from "@/lib/types"

export default async function StoreApplicationsPage() {
  const supabase = await createClient()

  // Verificar si el usuario es administrador
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session?.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Obtener todas las solicitudes de tiendas
  const { data: applications } = await supabase
    .from("store_applications")
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  // Agrupar solicitudes por estado
  const pendingApplications = applications?.filter((app) => app.status === "pending") || []
  const approvedApplications = applications?.filter((app) => app.status === "approved") || []
  const rejectedApplications = applications?.filter((app) => app.status === "rejected") || []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Solicitudes de Tiendas</h1>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Solicitudes pendientes</h2>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {pendingApplications.length} pendientes
          </Badge>
        </div>

        {pendingApplications.length > 0 ? (
          <div className="space-y-4">
            {pendingApplications.map((application: any) => (
              <StoreApplicationItem key={application.id} application={application as StoreApplication} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-gray-500">No hay solicitudes pendientes</CardContent>
          </Card>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Solicitudes aprobadas</h2>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {approvedApplications.length} aprobadas
          </Badge>
        </div>

        {approvedApplications.length > 0 ? (
          <div className="space-y-4">
            {approvedApplications.map((application: any) => (
              <StoreApplicationItem key={application.id} application={application as StoreApplication} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-gray-500">No hay solicitudes aprobadas</CardContent>
          </Card>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Solicitudes rechazadas</h2>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {rejectedApplications.length} rechazadas
          </Badge>
        </div>

        {rejectedApplications.length > 0 ? (
          <div className="space-y-4">
            {rejectedApplications.map((application: any) => (
              <StoreApplicationItem key={application.id} application={application as StoreApplication} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-gray-500">No hay solicitudes rechazadas</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
