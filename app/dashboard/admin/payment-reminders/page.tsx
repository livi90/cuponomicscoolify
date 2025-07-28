import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PaymentRemindersManager } from "@/components/payment-reminders/payment-reminders-manager"

// Configurar como página dinámica para evitar errores de build
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PaymentRemindersPage() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    
    if (error || !user) {
      redirect("/login")
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      redirect("/dashboard")
    }

    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Gestión de Recordatorios de Pago</h1>
          <p className="text-gray-600 mt-2">Administra los recordatorios de pago de comisiones para merchants</p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          }
        >
          <PaymentRemindersManager />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error in PaymentRemindersPage:", error)
    redirect("/login")
  }
}
