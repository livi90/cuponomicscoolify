"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Plus, Eye, EyeOff, Code } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface TrackingPixel {
  id: string
  store_id: string
  pixel_id: string
  pixel_name: string
  is_active: boolean
  track_page_views: boolean
  track_purchases: boolean
  default_commission_rate: number
  total_conversions: number
  total_revenue: number
  stores: {
    name: string
  }
}

interface TrackingPixelsManagerProps {
  userId: string
  userRole: string
}

export function TrackingPixelsManager({ userId, userRole }: TrackingPixelsManagerProps) {
  const [pixels, setPixels] = useState<TrackingPixel[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showCodeDialog, setShowCodeDialog] = useState(false)
  const [selectedPixel, setSelectedPixel] = useState<TrackingPixel | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoading(true)
    try {
      // Cargar píxeles
      const { data: pixelsData } = await supabase
        .from("tracking_pixels")
        .select(`
          *,
          stores!inner(name)
        `)
        .eq("owner_id", userId)
        .order("created_at", { ascending: false })

      setPixels(pixelsData || [])

      // Cargar tiendas del usuario
      const { data: storesData } = await supabase
        .from("stores")
        .select("id, name")
        .eq("owner_id", userId)
        .eq("status", "approved")

      setStores(storesData || [])
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const createPixel = async (formData: FormData) => {
    try {
      const pixelData = {
        store_id: formData.get("store_id") as string,
        owner_id: userId,
        pixel_id: `px_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        pixel_name: formData.get("pixel_name") as string,
        is_active: true,
        track_page_views: formData.get("track_page_views") === "on",
        track_purchases: formData.get("track_purchases") === "on",
        default_commission_rate: Number.parseFloat(formData.get("commission_rate") as string) || 5.0,
      }

      const { error } = await supabase.from("tracking_pixels").insert(pixelData)

      if (error) throw error

      toast.success("Píxel creado exitosamente")
      setShowCreateDialog(false)
      loadData()
    } catch (error) {
      console.error("Error creating pixel:", error)
      toast.error("Error al crear el píxel")
    }
  }

  const togglePixelStatus = async (pixelId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("tracking_pixels").update({ is_active: !isActive }).eq("id", pixelId)

      if (error) throw error

      toast.success(`Píxel ${!isActive ? "activado" : "desactivado"}`)
      loadData()
    } catch (error) {
      console.error("Error updating pixel:", error)
      toast.error("Error al actualizar el píxel")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copiado al portapapeles")
  }

  const generateTrackingCode = (pixel: TrackingPixel) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cuponomics.com"
    return `<!-- Cuponomics Tracking Pixel -->
<script>
(function() {
  var script = document.createElement('script');
  script.src = '${baseUrl}/api/tracking/conversion?pixel_id=${pixel.pixel_id}';
  script.async = true;
  document.head.appendChild(script);
})();
</script>
<!-- End Cuponomics Tracking Pixel -->`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con botón crear */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Píxeles de Tracking</h2>
          <p className="text-gray-600">Gestiona el seguimiento de conversiones para tus tiendas</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Píxel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Píxel</DialogTitle>
              <DialogDescription>Configura un nuevo píxel de tracking para una de tus tiendas</DialogDescription>
            </DialogHeader>
            <form action={createPixel} className="space-y-4">
              <div>
                <Label htmlFor="pixel_name">Nombre del Píxel</Label>
                <Input id="pixel_name" name="pixel_name" placeholder="Ej: Tienda Principal - Tracking" required />
              </div>
              <div>
                <Label htmlFor="store_id">Tienda</Label>
                <Select name="store_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una tienda" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="commission_rate">Tasa de Comisión (%)</Label>
                <Input
                  id="commission_rate"
                  name="commission_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  defaultValue="5.00"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="track_purchases" name="track_purchases" defaultChecked />
                <Label htmlFor="track_purchases">Rastrear compras</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="track_page_views" name="track_page_views" />
                <Label htmlFor="track_page_views">Rastrear vistas de página</Label>
              </div>
              <Button type="submit" className="w-full">
                Crear Píxel
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de píxeles */}
      <div className="grid gap-4">
        {pixels.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">No tienes píxeles de tracking configurados</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear tu primer píxel
              </Button>
            </CardContent>
          </Card>
        ) : (
          pixels.map((pixel) => (
            <Card key={pixel.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {pixel.pixel_name}
                      <Badge variant={pixel.is_active ? "default" : "secondary"}>
                        {pixel.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {pixel.stores.name} • ID: {pixel.pixel_id}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPixel(pixel)
                        setShowCodeDialog(true)
                      }}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => togglePixelStatus(pixel.id, pixel.is_active)}>
                      {pixel.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Conversiones</p>
                    <p className="text-2xl font-bold">{pixel.total_conversions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ingresos</p>
                    <p className="text-2xl font-bold">{formatCurrency(pixel.total_revenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Comisión</p>
                    <p className="text-2xl font-bold text-green-600">{pixel.default_commission_rate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Configuración</p>
                    <div className="flex gap-2 mt-1">
                      {pixel.track_purchases && (
                        <Badge variant="outline" className="text-xs">
                          Compras
                        </Badge>
                      )}
                      {pixel.track_page_views && (
                        <Badge variant="outline" className="text-xs">
                          Vistas
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog para mostrar código */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Código de Tracking</DialogTitle>
            <DialogDescription>
              Copia este código y pégalo antes del cierre de la etiqueta &lt;/head&gt; en tu sitio web
            </DialogDescription>
          </DialogHeader>
          {selectedPixel && (
            <div className="space-y-4">
              <div>
                <Label>Código HTML</Label>
                <div className="relative">
                  <Textarea
                    value={generateTrackingCode(selectedPixel)}
                    readOnly
                    className="font-mono text-sm min-h-[200px]"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => copyToClipboard(generateTrackingCode(selectedPixel))}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Instrucciones de instalación:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Copia el código de arriba</li>
                  <li>Pégalo en tu sitio web antes del cierre de &lt;/head&gt;</li>
                  <li>
                    Para rastrear conversiones manualmente, usa:{" "}
                    <code className="bg-gray-200 px-1 rounded">
                      cuponomicsTrack('purchase', {'{order_id: "123", value: 99.99}'})
                    </code>
                  </li>
                  <li>El píxel detectará automáticamente páginas de checkout comunes</li>
                </ol>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
