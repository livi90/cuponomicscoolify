"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { RecommendedBadge } from "@/components/ui/recommended-badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import {
  LayoutDashboard,
  Store,
  Tag,
  Package,
  BarChart3,
  Users,
  Settings,
  Bell,
  FileText,
  TrendingUp,
  Target,
  Megaphone,
  ShoppingBag,
  Zap,
  Shield,
  LogOut,
} from "lucide-react"

interface DashboardNavProps {
  userRole: string
}

export function DashboardNav({ userRole }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["user", "merchant", "admin"],
    },
    {
      title: "Tiendas",
      href: "/dashboard/stores",
      icon: Store,
      roles: ["merchant", "admin"],
    },
    {
      title: "Cupones",
      href: "/dashboard/coupons",
      icon: Tag,
      roles: ["merchant", "admin"],
    },
    {
      title: "Productos",
      href: "/dashboard/products",
      icon: Package,
      roles: ["merchant", "admin"],
    },
    {
      title: "Tracking Universal",
      href: "/dashboard/tracking-universal",
      icon: Zap,
      roles: ["merchant"],
    },
    {
      title: "Tracking Webhooks",
      href: "/dashboard/tracking-webhooks",
      icon: FileText,
      roles: ["merchant", "admin"],
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      roles: ["merchant", "admin"],
    },
    {
      title: "Conversiones",
      href: "/dashboard/conversions",
      icon: Target,
      roles: ["merchant", "admin"],
    },
    {
      title: "Solicitar Tienda",
      href: "/dashboard/store-application",
      icon: FileText,
      roles: ["user"],
    },
    {
      title: "Usuarios",
      href: "/dashboard/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Solicitudes",
      href: "/dashboard/store-applications",
      icon: TrendingUp,
      roles: ["admin"],
    },
    {
      title: "Todas las Tiendas",
      href: "/dashboard/admin/all-stores",
      icon: Store,
      roles: ["admin"],
    },
    {
      title: "Tracking Universal",
      href: "/dashboard/admin/tracking-universal",
      icon: Zap,
      roles: ["admin"],
    },
    {
      title: "Detección de Scripts",
      href: "/dashboard/admin/script-detection",
      icon: Shield,
      roles: ["admin"],
    },
    {
      title: "Notificaciones",
      href: "/dashboard/notifications",
      icon: Bell,
      roles: ["user", "merchant", "admin"],
    },
    {
      title: "Configuración",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["user", "merchant", "admin"],
    },
    {
      title: "Banners",
      href: "/dashboard/admin/banners",
      icon: Megaphone,
      roles: ["admin"],
    },
    {
      title: "Productos Outlet",
      href: "/dashboard/admin/outlet-products",
      icon: ShoppingBag,
      roles: ["admin"],
    },
  ]

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {filteredNavItems.map((item) => {
        const Icon = item.icon
        const isTrackingUniversal = item.href.includes('tracking-universal')
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary relative",
              pathname === item.href && "bg-muted text-primary",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="flex items-center gap-2">
              {item.title}
              {isTrackingUniversal && <RecommendedBadge />}
            </span>
          </Link>
        )
      })}
      
      {/* Separador */}
      <div className="border-t my-4" />
      
      {/* Botón de Cerrar Sesión */}
      <Button
        variant="ghost"
        onClick={handleSignOut}
        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4 mr-3" />
        Cerrar Sesión
      </Button>
    </nav>
  )
}
