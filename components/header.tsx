"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { LogOut, Bell, User, Settings, Store, ShoppingBag, Tag, Star, Search, Menu, X } from "lucide-react"
import { NotificationIndicator } from "@/components/notifications/notification-indicator"
import { SidebarMenu } from "@/components/sidebar-menu"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { HybridSearchBar } from "./search/hybrid-search-bar"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()



  useEffect(() => {
    async function getUser() {
      setIsLoading(true)
      try {
        // Usar getUser() para validación segura
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (user && !authError) {
          setUser(user)
          // Obtener el rol del usuario
          const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

          if (profile) {
            setUserRole(profile.role)
          }
        } else {
          setUser(null)
          setUserRole(null)
        }
      } catch (error) {
        console.error("Error getting user:", error)
        setUser(null)
        setUserRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    // Suscribirse a cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null)
        setUserRole(null)
        setIsLoading(false)
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Re-validar con getUser() para seguridad
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          // Obtener rol actualizado
          const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
          if (profile) {
            setUserRole(profile.role)
          }
        }
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }



  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="border-b sticky top-0 bg-white z-50 shadow-sm h-16">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo - Tamaño optimizado */}
        <div className="flex items-center h-full">
          <Link href="/" className="flex items-center h-full">
            <img
              src="/images/Cuponomics-logo.png"
              alt="Cuponomics Logo"
              className="h-16 w-auto"
              style={{ display: "block" }}
              loading="eager"
              decoding="async"
            />
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <SidebarMenu 
            isLoggedIn={!!user} 
            user={user ? {
              name: user.email?.split('@')[0] || 'Usuario',
              email: user.email || '',
              avatar: '/placeholder.svg'
            } : undefined}
          />
        </div>

        {/* Desktop navigation - Simplificado */}
        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="/"
            className={cn("text-gray-600 hover:text-gray-900 font-medium text-sm py-2", isActive("/") && "text-orange-500")}
          >
            Inicio
          </Link>

          {/* Comparador de Precios - Protagonismo */}
          <Link
            href="/comparar-precios"
            className={cn(
              "bg-orange-500 text-white hover:bg-orange-600 font-semibold px-4 py-2 rounded-lg transition-all duration-200 text-sm",
              isActive("/comparar-precios") && "ring-2 ring-orange-300"
            )}
          >
            🔥 Encontrar mejor Precio
          </Link>

          {/* Ofertas - Simplificado */}
          <Link
            href="/buscar-ofertas"
            className={cn(
              "text-gray-600 hover:text-gray-900 font-medium text-sm py-2",
              isActive("/buscar-ofertas") && "text-orange-500"
            )}
          >
            Cupones y descuentos
          </Link>
        </nav>

        {/* Buscador principal - Tamaño optimizado */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <HybridSearchBar
            placeholder="Buscar productos..."
            onSearch={(query: string) => {
              // Redirigir a la página de búsqueda híbrida
              window.location.href = `/busqueda-hibrida?q=${encodeURIComponent(query)}`
            }}
            className="w-full"
          />
        </div>

        {/* Acciones del usuario - Simplificado */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoading && user ? (
            <div className="flex items-center gap-2">
              {/* Avatar del usuario */}
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={user.email} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              {/* Sidebar Menu */}
              <SidebarMenu 
                isLoggedIn={true} 
                user={{
                  name: user.email?.split('@')[0] || 'Usuario',
                  email: user.email || '',
                  avatar: '/placeholder.svg'
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                  Iniciar Sesión
                </Button>
              </Link>
              
              {/* Sidebar Menu para usuarios no logueados */}
              <SidebarMenu isLoggedIn={false} />
            </div>
          )}
        </div>


      </div>
    </header>
  )
}
