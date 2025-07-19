"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NotificationList } from "@/components/notifications/notification-list"
import type { Notification } from "@/lib/types"

export function NotificationIndicator() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (data) {
          setNotifications(data as Notification[])
          setUnreadCount(data.filter((n) => !n.read).length)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Suscribirse a cambios en la tabla de notificaciones
    const channel = supabase
      .channel("notification_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        async (payload) => {
          try {
            const { data } = await supabase.auth.getUser()
            // Solo procesar si la notificación es para este usuario
            if (payload.new && payload.new.user_id === data.user?.id) {
              // Añadir la nueva notificación a la lista
              setNotifications((prev) => [payload.new as Notification, ...prev])
              setUnreadCount((prev) => prev + 1)
            }
          } catch (error) {
            console.error("Error processing notification:", error)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

      // Actualizar estado local
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false)

      // Actualizar estado local
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 bg-orange-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-medium">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-auto py-1">
              Marcar todas como leídas
            </Button>
          )}
        </div>
        <NotificationList notifications={notifications} loading={loading} markAsRead={markAsRead} preview />
        <div className="p-2 border-t border-gray-100 text-center">
          <Button variant="ghost" size="sm" className="text-xs w-full" asChild>
            <a href="/dashboard/notifications">Ver todas las notificaciones</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
