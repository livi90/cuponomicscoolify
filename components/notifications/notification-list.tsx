"use client"

import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Bell, CheckCircle, XCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/lib/types"

interface NotificationListProps {
  notifications: Notification[]
  loading: boolean
  markAsRead: (id: string) => void
  preview?: boolean
}

export function NotificationList({ notifications, loading, markAsRead, preview = false }: NotificationListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <Bell className="h-10 w-10 text-gray-300 mb-2" />
        <p className="text-gray-500">No tienes notificaciones</p>
      </div>
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "role_change":
        return <User className="h-5 w-5 text-blue-500" />
      case "store_application_approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "store_application_rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-orange-500" />
    }
  }

  return (
    <div className={`divide-y divide-gray-100 ${preview ? "max-h-80 overflow-y-auto" : ""}`}>
      {notifications.map((notification) => (
        <div key={notification.id} className={`p-4 ${notification.read ? "bg-white" : "bg-orange-50"}`}>
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: es })}
                </p>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="text-xs h-auto py-1"
                  >
                    Marcar como leída
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
