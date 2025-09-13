"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Home, Tag, ShoppingBag, Star, Store, User, LogOut, Menu, X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationIndicator } from "@/components/notifications/notification-indicator"
import { cn } from "@/lib/utils"

export function GlobalNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
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

  useEffect(() => {
    // Evitar doble tracking en desarrollo con Fast Refresh
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    const country = navigator.language;
    const userAgent = navigator.userAgent;
    // Hash simple para visitas únicas aproximadas
    const visitorHash = btoa(userAgent + path);
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, country, userAgent, visitorHash })
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  const navItems = [
    { name: "Inicio", path: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Ofertas", path: "/buscar-ofertas", icon: <Tag className="h-4 w-4" /> },
    { name: "Outlet", path: "/productos-en-oferta", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "Productos", path: "/productos", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "Calificar", path: "/calificar-cupones", icon: <Star className="h-4 w-4" /> },
    { name: "Tiendas", path: "/tiendas", icon: <Store className="h-4 w-4" /> },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm h-20">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        {/* Logo y nombre */}
        <div className="flex items-center h-full">
          <Link href="/" className="flex items-center h-full gap-2">
            <img
              src="/images/Cuponomics-logo.png"
              alt="Cuponomics Logo"
              className="h-18 w-auto"
              style={{ display: "block" }}
            />
          </Link>
        </div>

        {/* Navegación de escritorio */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive(item.path)
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Acciones de usuario */}
        <div className="flex items-center gap-2">
          <a
            href="https://chromewebstore.google.com/detail/cuponomics/flkhiokfjclgfbakeamcmfefbpmjnlno?authuser=2"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-block"
          >
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Añadir a Chrome
            </Button>
          </a>
          {!isLoading && user ? (
            <>
              {/* Notificaciones */}
              <Link href="/dashboard/notifications" className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
                <NotificationIndicator /* userId={user.id} */ />
              </Link>

              {/* Menú de usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={user.email} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userRole === "admin" ? "Administrador" : userRole === "merchant" ? "Comerciante" : "Usuario"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer w-full">
                      Configuración
                    </Link>
                  </DropdownMenuItem>
                  {userRole === "merchant" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/stores" className="cursor-pointer w-full">
                        Mis tiendas
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/login?tab=register">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Registrarse
                </Button>
              </Link>
            </>
          )}

          {/* Botón de menú móvil */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3">
            <nav className="grid grid-cols-1 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.path)
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              {user && (
                <>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
