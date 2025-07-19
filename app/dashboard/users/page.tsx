import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserManagement } from "@/components/dashboard/user-management"
import type { Profile } from "@/lib/types"

export default async function UsersPage() {
  const supabase = await createClient()

  // Verificar si el usuario es administrador
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session?.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Obtener todos los usuarios
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Estadísticas de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total de usuarios</p>
              <p className="text-3xl font-bold">{users?.length || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Comerciantes</p>
              <p className="text-3xl font-bold">
                {users?.filter((user: Profile) => user.role === "merchant").length || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Administradores</p>
              <p className="text-3xl font-bold">
                {users?.filter((user: Profile) => user.role === "admin").length || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserManagement initialUsers={users || []} />
    </div>
  )
}
