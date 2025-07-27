"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { LogOut, Bell, User, Settings, Store, ShoppingBag, Tag, Star } from "lucide-react"
import { NotificationIndicator } from "@/components/notifications/notification-indicator"
import { cn } from "@/lib/utils"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    await supabase.auth.signOut()
    router.push("/")
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

  return (
    <header className="border-b sticky top-0 bg-white z-50 shadow-sm h-20">
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        <div className="flex items-center h-full">
          <Link href="/" className="flex items-center h-full">
            <img
              src="/images/cuponomics-logo.png"
              alt="Cuponomics Logo"
              className="h-12 w-auto"
              style={{ display: "block" }}
              loading="eager"
              decoding="async"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={cn("text-gray-600 hover:text-gray-900", isActive("/") && "text-orange-500 font-medium")}
          >
            Inicio
          </Link>

          {/* Dropdown de Buscar ofertas - más llamativo */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 font-semibold px-4 py-2 rounded-full shadow-md transition-all duration-200 hover:shadow-lg",
                  (isActive("/buscar-ofertas") || isActive("/productos-en-oferta") || isActive("/ofertas-populares") || isActive("/cupones")) &&
                    "ring-2 ring-orange-300",
                )}
              >
                🔥 Buscar Ofertas
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="center">
              <DropdownMenuLabel className="text-orange-600 font-semibold">
                Encuentra las mejores ofertas
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/buscar-ofertas" className="cursor-pointer w-full flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-orange-500" />
                  <div>
                    <div className="font-medium">Cupones de descuento</div>
                    <div className="text-xs text-gray-500">Códigos y ofertas especiales</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/productos-en-oferta" className="cursor-pointer w-full flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">Productos en oferta</div>
                    <div className="text-xs text-gray-500">Los mejores precios</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ofertas-populares" className="cursor-pointer w-full flex items-center">
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  <div>
                    <div className="font-medium">Ofertas destacadas</div>
                    <div className="text-xs text-gray-500">Lo más popular</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/calificar-cupones"
            className={cn(
              "text-gray-600 hover:text-gray-900",
              isActive("/calificar-cupones") && "text-orange-500 font-medium",
            )}
          >
            Calificar cupones
          </Link>

          <Link
            href="/para-comerciantes"
            className={cn(
              "text-gray-600 hover:text-gray-900",
              isActive("/para-comerciantes") && "text-orange-500 font-medium",
            )}
          >
            Para comerciantes
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {!isLoading && user ? (
            <div className="flex items-center gap-3">
              {/* Notificaciones */}
              <Link href="/dashboard/notifications" className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
                <NotificationIndicator />
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
                    <Link href="/dashboard" className="cursor-pointer w-full flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer w-full flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </Link>
                  </DropdownMenuItem>
                  {userRole === "merchant" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/stores" className="cursor-pointer w-full flex items-center">
                          <Store className="mr-2 h-4 w-4" />
                          Mis tiendas
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/products" className="cursor-pointer w-full flex items-center">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Mis productos
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Iniciar Sesión
              </Link>
              <Link href="/login?tab=register" className="text-gray-600 hover:text-gray-900">
                Únete
              </Link>
              <a
                href="https://chromewebstore.google.com/detail/cuponomics/flkhiokfjclgfbakeamcmfefbpmjnlno?authuser=2&hl=es"
                target="_blank"
                rel="noopener noreferrer"
              >
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6">
                Añadir al navegador
              </Button>
              </a>
            </>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg md:hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                href="/"
                className={cn("text-gray-600 hover:text-gray-900 py-2", isActive("/") && "text-orange-500 font-medium")}
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>

              {/* Sección de ofertas móvil */}
              <div className="border border-orange-200 rounded-lg p-3 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="text-orange-600 font-semibold mb-2 flex items-center">🔥 Buscar Ofertas</div>
                <div className="space-y-2">
                  <Link
                    href="/buscar-ofertas"
                    className="text-gray-600 hover:text-orange-500 py-1 pl-4 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Cupones de descuento
                  </Link>
                  <Link
                    href="/productos-en-oferta"
                    className="text-gray-600 hover:text-orange-500 py-1 pl-4 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Productos en oferta
                  </Link>
                  <Link
                    href="/ofertas-populares"
                    className="text-gray-600 hover:text-orange-500 py-1 pl-4 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Ofertas destacadas
                  </Link>
                </div>
              </div>

              <Link
                href="/calificar-cupones"
                className={cn(
                  "text-gray-600 hover:text-gray-900 py-2",
                  isActive("/calificar-cupones") && "text-orange-500 font-medium",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Calificar cupones
              </Link>

              <Link
                href="/para-comerciantes"
                className={cn(
                  "text-gray-600 hover:text-gray-900 py-2",
                  isActive("/para-comerciantes") && "text-orange-500 font-medium",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Para comerciantes
              </Link>

              {!isLoading && user ? (
                <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Configuración
                  </Link>
                  {userRole === "merchant" && (
                    <>
                      <Link
                        href="/dashboard/stores"
                        className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Store className="h-4 w-4" />
                        Mis tiendas
                      </Link>
                      <Link
                        href="/dashboard/products"
                        className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Mis productos
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-700 flex items-center gap-2 py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/login?tab=register"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Únete
                  </Link>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Añadir al navegador
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
