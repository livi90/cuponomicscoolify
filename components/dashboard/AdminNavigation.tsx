'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Database, 
  TrendingUp, 
  Store, 
  Users, 
  Settings, 
  BarChart3,
  FileText,
  Bell
} from 'lucide-react'

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Vista general de la plataforma'
  },
  {
    title: 'Gestión de Índices',
    href: '/dashboard/admin/meilisearch-indices',
    icon: Database,
    description: 'Administra índices de Meilisearch'
  },
  {
    title: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: TrendingUp,
    description: 'Métricas y estadísticas'
  },
  {
    title: 'Tiendas',
    href: '/dashboard/admin/all-stores',
    icon: Store,
    description: 'Gestiona todas las tiendas'
  },
  {
    title: 'Usuarios',
    href: '/dashboard/admin/users',
    icon: Users,
    description: 'Administra usuarios de la plataforma'
  },
  {
    title: 'Solicitudes',
    href: '/dashboard/admin/store-applications',
    icon: FileText,
    description: 'Revisa solicitudes de tiendas'
  },
  {
    title: 'Notificaciones',
    href: '/dashboard/admin/notifications',
    icon: Bell,
    description: 'Configura notificaciones del sistema'
  },
  {
    title: 'Configuración',
    href: '/dashboard/admin/settings',
    icon: Settings,
    description: 'Configuración general de la plataforma'
  }
]

export default function AdminNavigation() {
  const pathname = usePathname()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Panel de Administración
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "outline"}
                className={`w-full h-auto p-4 flex flex-col items-start space-y-2 ${
                  isActive 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                <div className="text-left">
                  <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-orange-100' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
              </Button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
