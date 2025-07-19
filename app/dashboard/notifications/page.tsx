"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationList } from "@/components/notifications/notification-list"
import type { Notification } from "@/lib/types"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const supabase = createClient()

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

        if (data) {
          setNotifications(data as Notification[])
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [supabase])

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

      // Actualizar estado local
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
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
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type.includes(activeTab)
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notificaciones</h1>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Centro de notificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unread">No leídas {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
              <TabsTrigger value="role_change">Cambios de rol</TabsTrigger>
              <TabsTrigger value="store_application">Solicitudes de tienda</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <NotificationList notifications={filteredNotifications} loading={loading} markAsRead={markAsRead} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
