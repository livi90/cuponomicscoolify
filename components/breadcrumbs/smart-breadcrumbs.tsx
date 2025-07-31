"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  name: string
  href: string
  isCurrent?: boolean
}

export function SmartBreadcrumbs() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Inicio", href: "/" }
    ]

    // Página principal
    if (pathname === "/") {
      return breadcrumbs
    }

    // Buscar ofertas
    if (pathname === "/buscar-ofertas") {
      breadcrumbs.push({ name: "Buscar Ofertas", href: "/buscar-ofertas", isCurrent: true })
      
      // Agregar filtros activos
      const category = searchParams.get("category")
      const store = searchParams.get("store")
      const search = searchParams.get("search")
      
      if (category) {
        breadcrumbs.push({ name: `Categoría: ${category}`, href: `/buscar-ofertas?category=${category}`, isCurrent: true })
      }
      if (store) {
        breadcrumbs.push({ name: `Tienda: ${store}`, href: `/buscar-ofertas?store=${store}`, isCurrent: true })
      }
      if (search) {
        breadcrumbs.push({ name: `Búsqueda: ${search}`, href: `/buscar-ofertas?search=${search}`, isCurrent: true })
      }
      
      return breadcrumbs
    }

    // Ofertas populares
    if (pathname === "/ofertas-populares") {
      breadcrumbs.push({ name: "Ofertas Populares", href: "/ofertas-populares", isCurrent: true })
      return breadcrumbs
    }

    // Productos en oferta
    if (pathname === "/productos-en-oferta") {
      breadcrumbs.push({ name: "Productos en Oferta", href: "/productos-en-oferta", isCurrent: true })
      return breadcrumbs
    }

    // Cupones individuales
    if (pathname.startsWith("/cupones/")) {
      const couponId = pathname.split("/")[2]
      breadcrumbs.push({ name: "Buscar Ofertas", href: "/buscar-ofertas" })
      breadcrumbs.push({ name: "Cupón", href: `/cupones/${couponId}`, isCurrent: true })
      return breadcrumbs
    }

    // Productos individuales
    if (pathname.startsWith("/productos/")) {
      const productId = pathname.split("/")[2]
      breadcrumbs.push({ name: "Productos en Oferta", href: "/productos-en-oferta" })
      breadcrumbs.push({ name: "Producto", href: `/productos/${productId}`, isCurrent: true })
      return breadcrumbs
    }

    // Tiendas individuales
    if (pathname.startsWith("/tiendas/")) {
      const storeId = pathname.split("/")[2]
      breadcrumbs.push({ name: "Tiendas", href: "/buscar-ofertas" })
      breadcrumbs.push({ name: "Tienda", href: `/tiendas/${storeId}`, isCurrent: true })
      return breadcrumbs
    }

    // Dashboard
    if (pathname.startsWith("/dashboard")) {
      breadcrumbs.push({ name: "Dashboard", href: "/dashboard" })
      
      const segments = pathname.split("/").filter(Boolean)
      if (segments.length > 1) {
        const section = segments[1]
        const sectionNames: Record<string, string> = {
          "stores": "Tiendas",
          "coupons": "Cupones",
          "products": "Productos",
          "analytics": "Analytics",
          "settings": "Configuración",
          "subscription": "Suscripción",
          "admin": "Admin"
        }
        
        if (sectionNames[section]) {
          breadcrumbs.push({ name: sectionNames[section], href: `/dashboard/${section}` })
          
          // Subsecciones
          if (segments.length > 2) {
            const subsection = segments[2]
            if (subsection === "new") {
              breadcrumbs.push({ name: "Nuevo", href: pathname, isCurrent: true })
            } else if (subsection === "edit") {
              breadcrumbs.push({ name: "Editar", href: pathname, isCurrent: true })
            } else {
              breadcrumbs.push({ name: subsection, href: pathname, isCurrent: true })
            }
          } else {
            breadcrumbs[breadcrumbs.length - 1].isCurrent = true
          }
        }
      } else {
        breadcrumbs[breadcrumbs.length - 1].isCurrent = true
      }
      
      return breadcrumbs
    }

    // Páginas estáticas
    const staticPages: Record<string, string> = {
      "/login": "Iniciar Sesión",
      "/para-comerciantes": "Para Comerciantes",
      "/calificar-cupones": "Calificar Cupones",
      "/privacy-policy": "Política de Privacidad",
      "/cookies": "Política de Cookies"
    }

    if (staticPages[pathname]) {
      breadcrumbs.push({ name: staticPages[pathname], href: pathname, isCurrent: true })
      return breadcrumbs
    }

    // Página no encontrada
    breadcrumbs.push({ name: "Página no encontrada", href: pathname, isCurrent: true })
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
          {item.isCurrent ? (
            <span className="text-gray-900 font-medium">{item.name}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              {index === 0 && <Home className="w-4 h-4" />}
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
} 