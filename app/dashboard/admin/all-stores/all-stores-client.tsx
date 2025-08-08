"use client"

import { useState } from "react"
import { Store, Profile } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Store as StoreIcon, 
  User, 
  Calendar,
  Globe,
  Mail,
  Phone,
  MapPin,
  Crown,
  Star
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface AllStoresClientProps {
  stores: Store[]
}

export function AllStoresClient({ stores }: AllStoresClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showOnlyEarlyAdopters, setShowOnlyEarlyAdopters] = useState(false)
  const [showOnlyActive, setShowOnlyActive] = useState(true)
  const [updatingStore, setUpdatingStore] = useState<string | null>(null)
  const supabase = createClient()

  // Filtrar tiendas según los criterios
  const filteredStores = stores.filter((store) => {
    const matchesSearch = 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.category?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEarlyAdopter = !showOnlyEarlyAdopters || store.is_early_adopter
    const matchesActive = !showOnlyActive || store.is_active

    return matchesSearch && matchesEarlyAdopter && matchesActive
  })

  const handleToggleEarlyAdopter = async (storeId: string, currentValue: boolean) => {
    setUpdatingStore(storeId)
    
    try {
      const response = await fetch(`/api/stores/${storeId}/early-adopter`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_early_adopter: !currentValue }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar la tienda")
      }

      toast.success(
        currentValue 
          ? "Tienda removida de Early Adopters" 
          : "Tienda marcada como Early Adopter"
      )

      // Recargar la página para actualizar los datos
      window.location.reload()
    } catch (error) {
      console.error("Error updating store:", error)
      toast.error("Error al actualizar la tienda")
    } finally {
      setUpdatingStore(null)
    }
  }

  const handleToggleActive = async (storeId: string, currentValue: boolean) => {
    setUpdatingStore(storeId)
    
    try {
      const { error } = await supabase
        .from("stores")
        .update({ is_active: !currentValue })
        .eq("id", storeId)

      if (error) {
        throw error
      }

      toast.success(
        currentValue 
          ? "Tienda desactivada" 
          : "Tienda activada"
      )

      // Recargar la página para actualizar los datos
      window.location.reload()
    } catch (error) {
      console.error("Error updating store:", error)
      toast.error("Error al actualizar la tienda")
    } finally {
      setUpdatingStore(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const earlyAdoptersCount = stores.filter(store => store.is_early_adopter).length
  const activeStoresCount = stores.filter(store => store.is_active).length

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tiendas</CardTitle>
            <StoreIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
          </CardContent>
        </Card>
        
                 <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Early Adopters</CardTitle>
             <Crown className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-amber-600">{earlyAdoptersCount}</div>
           </CardContent>
         </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiendas Activas</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStoresCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar tiendas</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                 <Input
                   id="search"
                   placeholder="Buscar por nombre, email de contacto, categoría..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10"
                 />
              </div>
            </div>
            
                         <div className="flex items-center space-x-2">
               <Checkbox
                 id="early-adopters"
                 checked={showOnlyEarlyAdopters}
                 onCheckedChange={(checked) => setShowOnlyEarlyAdopters(checked as boolean)}
               />
               <Label htmlFor="early-adopters">Solo Early Adopters</Label>
             </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active-only"
                checked={showOnlyActive}
                onCheckedChange={(checked) => setShowOnlyActive(checked as boolean)}
              />
              <Label htmlFor="active-only">Solo Activas</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de tiendas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tiendas ({filteredStores.length} de {stores.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                                 <TableRow>
                   <TableHead>Tienda</TableHead>
                   <TableHead>Propietario ID</TableHead>
                   <TableHead>Categoría</TableHead>
                   <TableHead>Estado</TableHead>
                   <TableHead>Early Adopter</TableHead>
                   <TableHead>Fecha de Registro</TableHead>
                   <TableHead className="text-right">Acciones</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {store.logo_url ? (
                          <img
                            src={store.logo_url}
                            alt={store.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <StoreIcon className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{store.name}</div>
                          {store.website && (
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Globe className="h-3 w-3 mr-1" />
                              {store.website}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                                         <TableCell>
                       <div className="flex items-center space-x-2">
                         <User className="h-4 w-4 text-muted-foreground" />
                         <div>
                           <div className="font-medium">
                             Propietario ID: {store.owner_id.slice(0, 8)}...
                           </div>
                           <div className="text-sm text-muted-foreground">
                             {store.contact_email || "Sin email"}
                           </div>
                         </div>
                       </div>
                     </TableCell>
                    
                    <TableCell>
                      {store.category ? (
                        <Badge variant="secondary">{store.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Sin categoría</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={store.is_active}
                          onCheckedChange={() => handleToggleActive(store.id, store.is_active)}
                          disabled={updatingStore === store.id}
                        />
                        <Badge variant={store.is_active ? "default" : "secondary"}>
                          {store.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                    </TableCell>
                    
                                         <TableCell>
                       <div className="flex items-center space-x-2">
                         <Switch
                           checked={store.is_early_adopter}
                           onCheckedChange={() => handleToggleEarlyAdopter(store.id, store.is_early_adopter)}
                           disabled={updatingStore === store.id}
                         />
                         {store.is_early_adopter && (
                           <Badge variant="default" className="bg-amber-600 hover:bg-amber-700">
                             <Crown className="h-3 w-3 mr-1" />
                             Early Adopter
                           </Badge>
                         )}
                       </div>
                     </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(store.created_at)}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalles de {store.name}</DialogTitle>
                            <DialogDescription>
                              Información completa de la tienda
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Descripción</Label>
                              <p className="text-sm text-muted-foreground">
                                {store.description || "Sin descripción"}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Email de contacto</Label>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {store.contact_email || "No especificado"}
                                  </span>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Teléfono</Label>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {store.contact_phone || "No especificado"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {store.address && (
                              <div>
                                <Label>Dirección</Label>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{store.address}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredStores.length === 0 && (
            <div className="text-center py-8">
              <StoreIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron tiendas</h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
