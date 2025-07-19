import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"

export default async function LoginPage() {
  const supabase = await createClient()

  // Verificar si el usuario ya está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Inicia sesión en tu cuenta</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O <span className="font-medium text-indigo-600">regístrate para comenzar</span>
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
