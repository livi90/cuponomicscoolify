"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Menu,
  User,
  UserPlus,
  Settings,
  HelpCircle,
  LogOut,
  Star,
  Tag,
  Store,
  Users,
  ChevronRight,
  X
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface SidebarMenuProps {
  isLoggedIn?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function SidebarMenu({ isLoggedIn = false, user }: SidebarMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleClose = () => setIsOpen(false)

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      handleClose()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Menú</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClose}
                className="text-white hover:bg-white/20 p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-white/20 text-white">
                    {user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-orange-100 text-sm">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/login" onClick={handleClose}>
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-orange-600 hover:bg-orange-50"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register" onClick={handleClose}>
                  <Button 
                    variant="outline" 
                    className="w-full border-white text-white hover:bg-white/10"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Únete Gratis
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Contenido del Sidebar */}
          <div className="flex-1 p-4 space-y-2">
            {/* Sección principal */}
            <div className="space-y-1">
              <Link href="/comparar-precios" onClick={handleClose}>
                <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto">
                  <Star className="w-5 h-5 mr-3 text-orange-500" />
                  <div>
                    <p className="font-medium">Comparar Precios</p>
                    <p className="text-sm text-gray-500">Encuentra las mejores ofertas</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </Button>
              </Link>

              <Link href="/buscar-ofertas" onClick={handleClose}>
                <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto">
                  <Tag className="w-5 h-5 mr-3 text-orange-500" />
                  <div>
                    <p className="font-medium">Cupones y Ofertas</p>
                    <p className="text-sm text-gray-500">Códigos de descuento verificados</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </Button>
              </Link>

              <Link href="/productos-en-oferta" onClick={handleClose}>
                <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto">
                  <Store className="w-5 h-5 mr-3 text-orange-500" />
                  <div>
                    <p className="font-medium">Productos en Oferta</p>
                    <p className="text-sm text-gray-500">Los mejores descuentos</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </Button>
              </Link>
            </div>

            <hr className="my-4" />

            {/* Sección secundaria */}
            <div className="space-y-1">
              <Link href="/calificar-cupones" onClick={handleClose}>
                <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto">
                  <Star className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Calificar Cupones</p>
                    <p className="text-sm text-gray-500">Ayuda a la comunidad</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </Button>
              </Link>

              <Link href="/para-comerciantes" onClick={handleClose}>
                <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto">
                  <Users className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Para Comerciantes</p>
                    <p className="text-sm text-gray-500">Únete como partner</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </Button>
              </Link>
            </div>

            {isLoggedIn && (
              <>
                <hr className="my-4" />
                
                {/* Opciones de usuario logueado */}
                <div className="space-y-1">
                  <Link href="/perfil" onClick={handleClose}>
                    <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto">
                      <Settings className="w-5 h-5 mr-3 text-gray-400" />
                      <span>Mi Perfil</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                    </Button>
                  </Link>

                  <Link href="/ayuda" onClick={handleClose}>
                    <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto">
                      <HelpCircle className="w-5 h-5 mr-3 text-gray-400" />
                      <span>Ayuda</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Footer del Sidebar */}
          {isLoggedIn && (
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
