"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { StoreApplication } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { CheckCircle, XCircle, AlertCircle, Store } from "lucide-react"

interface StoreApplicationItemProps {
  application: StoreApplication & {
    profiles?: {
      id: string
      username: string | null
      full_name: string | null
      email: string | null
    }
  }
}

export function StoreApplicationItem({ application }: StoreApplicationItemProps) {
  const [loading, setLoading] = useState(false)
  const [adminNotes, setAdminNotes] = useState(application.admin_notes || "")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleApprove = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log("Aprobando solicitud de tienda:", application.id)

      // Solo actualizar el estado de la solicitud - el trigger se encargará de crear la tienda automáticamente
      const { error: updateError } = await supabase
        .from("store_applications")
        .update({
          status: "approved",
          admin_notes: adminNotes || "Solicitud aprobada",
        })
        .eq("id", application.id)

      if (updateError) {
        console.error("Error al actualizar la solicitud:", updateError)
        setError(`Error al actualizar la solicitud: ${updateError.message}`)
        return
      }

      console.log("Solicitud aprobada con éxito. El trigger creará la tienda automáticamente.")
      setSuccess(
        "Solicitud aprobada con éxito. La tienda se ha creado automáticamente y el usuario ha sido actualizado a merchant.",
      )

      // Esperar un momento antes de refrescar para que el usuario pueda ver el mensaje de éxito
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (error: any) {
      console.error("Error al aprobar la solicitud:", error)
      setError(`Error inesperado: ${error.message || "Desconocido"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error: rejectError } = await supabase
        .from("store_applications")
        .update({
          status: "rejected",
          admin_notes: adminNotes,
        })
        .eq("id", application.id)

      if (rejectError) {
        console.error("Error al rechazar la solicitud:", rejectError)
        setError(`Error al rechazar la solicitud: ${rejectError.message}`)
        return
      }

      setSuccess("Solicitud rechazada con éxito.")

      // Esperar un momento antes de refrescar para que el usuario pueda ver el mensaje de éxito
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (error: any) {
      console.error("Error al rechazar la solicitud:", error)
      setError(`Error inesperado: ${error.message || "Desconocido"}`)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (application.status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Aprobada
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" /> Rechazada
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="m-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {application.logo_url ? (
                <Image
                  src={application.logo_url || "/placeholder.svg"}
                  alt={application.store_name}
                  width={64}
                  height={64}
                />
              ) : (
                <Store className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <CardTitle>{application.store_name}</CardTitle>
              <p className="text-sm text-gray-500">
                Solicitado por: {application.profiles?.full_name || application.profiles?.username || "Usuario"}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Descripción</h4>
            <p className="text-sm text-gray-600">{application.description || "Sin descripción"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Categoría</h4>
            <p className="text-sm text-gray-600">{application.category || "No especificada"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Sitio web</h4>
            <p className="text-sm text-gray-600">
              {application.website ? (
                <a
                  href={application.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {application.website}
                </a>
              ) : (
                "No especificado"
              )}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Contacto</h4>
            <p className="text-sm text-gray-600">{application.contact_email}</p>
            {application.contact_phone && <p className="text-sm text-gray-600">{application.contact_phone}</p>}
          </div>
        </div>

        {application.status === "pending" && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Notas del administrador</h4>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Añade notas sobre esta solicitud..."
              rows={2}
            />
          </div>
        )}

        {(application.status === "approved" || application.status === "rejected") && application.admin_notes && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Notas del administrador</h4>
            <p className="text-sm text-gray-600">{application.admin_notes}</p>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400">
          Solicitado {formatDistanceToNow(new Date(application.created_at), { addSuffix: true, locale: es })}
        </div>
      </CardContent>

      {application.status === "pending" && (
        <CardFooter className="pt-2 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleReject}
            disabled={loading}
          >
            Rechazar
          </Button>
          <Button
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleApprove}
            disabled={loading}
          >
            Aprobar
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
