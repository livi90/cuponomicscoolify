import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import TrackingScriptManager from "@/components/tracking/tracking-script-manager"
import UniversalTrackingManager from "@/components/tracking/universal-tracking-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Zap, Code } from "lucide-react"

export default async function TrackingScriptPage() {
  const supabase = await createClient()

  // Verificar autenticación
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect("/login")
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "merchant") {
    redirect("/dashboard")
  }

  // Obtener tiendas del merchant
  const { data: stores } = await supabase.from("stores").select("*").eq("owner_id", user.id).eq("is_active", true)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Script de Tracking</h1>
        <p className="text-gray-600 mt-2">
          Gestiona e instala el script de tracking en tus tiendas para monitorear las conversiones.
        </p>
      </div>

      <Tabs defaultValue="universal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="universal" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Sistema Universal</span>
            <Badge variant="secondary" className="ml-2">Nuevo</Badge>
          </TabsTrigger>
          <TabsTrigger value="legacy" className="flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span>Sistema Legacy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="universal" className="mt-6">
          <UniversalTrackingManager stores={stores || []} />
        </TabsContent>

        <TabsContent value="legacy" className="mt-6">
          <TrackingScriptManager stores={stores || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
