"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Edit, Trash2, Plus, ShoppingBag } from "lucide-react"

// Crear una sola instancia de Supabase para todo el componente
const supabase = createClient()

interface OutletProduct {
  id: string
  name: string
  description: string
  original_price: number
  outlet_price: number
  discount_percentage: number
  image_url: string
  store_id: string
  store_name: string
  rating?: number
  review_count?: number
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export default function AdminOutletProductsPage() {
  const [products, setProducts] = useState<OutletProduct[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [form, setForm] = useState({
    name: "",
    description: "",
    original_price: "",
    outlet_price: "",
    image: null as File | null,
    store_id: "",
    rating: "",
    review_count: "",
    is_featured: false,
    is_active: true,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [adminChecked, setAdminChecked] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace("/login?redirect=/dashboard/admin/outlet-products")
      return
    }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    if (!profile || profile.role !== "admin") {
      router.replace("/dashboard")
      return
    }
    setAdminChecked(true)
    fetchData()
  }

  async function fetchData() {
    // Obtener productos de outlet
    const { data: productsData } = await supabase
      .from("outlet_products")
      .select(`
        *,
        store:stores(name)
      `)
      .order("created_at", { ascending: false })

    // Obtener tiendas
    const { data: storesData } = await supabase
      .from("stores")
      .select("id, name")
      .eq("is_active", true)
      .order("name")

    setProducts(productsData?.map((p: any) => ({
      ...p,
      store_name: p.store?.name || "Tienda desconocida"
    })) || [])
    setStores(storesData || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setUploading(true)
    
    try {
      let image_url = ""
      if (form.image) {
        const fileExt = form.image.name.split('.').pop()
        const fileName = `outlet-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, form.image)
        if (uploadError) throw uploadError
        const { data: publicUrl } = supabase.storage.from("products").getPublicUrl(fileName)
        image_url = publicUrl.publicUrl
      }

      const productData = {
        name: form.name,
        description: form.description,
        original_price: parseFloat(form.original_price),
        outlet_price: parseFloat(form.outlet_price),
        image_url: image_url || (editingId ? products.find(p => p.id === editingId)?.image_url : ""),
        store_id: form.store_id,
        rating: form.rating ? parseFloat(form.rating) : 0,
        review_count: form.review_count ? parseInt(form.review_count) : 0,
        is_featured: form.is_featured,
        is_active: form.is_active,
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from("outlet_products")
          .update(productData)
          .eq("id", editingId)
        if (updateError) throw updateError
        setSuccess("¡Producto actualizado!")
      } else {
        const { error: insertError } = await supabase
          .from("outlet_products")
          .insert(productData)
        if (insertError) throw insertError
        setSuccess("¡Producto creado!")
      }

      resetForm()
      fetchData()
    } catch (err: any) {
      setError("Error: " + (err.message || err))
    } finally {
      setUploading(false)
    }
  }

  function resetForm() {
    setForm({
      name: "",
      description: "",
      original_price: "",
      outlet_price: "",
      image: null,
      store_id: "",
      rating: "",
      review_count: "",
      is_featured: false,
      is_active: true,
    })
    setEditingId(null)
  }

  function editProduct(product: OutletProduct) {
    setForm({
      name: product.name,
      description: product.description || "",
      original_price: product.original_price.toString(),
      outlet_price: product.outlet_price.toString(),
      image: null,
      store_id: product.store_id,
      rating: product.rating?.toString() || "",
      review_count: product.review_count?.toString() || "",
      is_featured: product.is_featured,
      is_active: product.is_active,
    })
    setEditingId(product.id)
  }

  async function deleteProduct(id: string) {
    if (!window.confirm("¿Eliminar este producto de outlet?")) return
    await supabase.from("outlet_products").delete().eq("id", id)
    fetchData()
  }

  async function toggleFeatured(id: string, currentFeatured: boolean) {
    await supabase
      .from("outlet_products")
      .update({ is_featured: !currentFeatured })
      .eq("id", id)
    fetchData()
  }

  async function toggleActive(id: string, currentActive: boolean) {
    await supabase
      .from("outlet_products")
      .update({ is_active: !currentActive })
      .eq("id", id)
    fetchData()
  }

  if (!adminChecked || loading) {
    return <div className="p-8 text-center">Cargando...</div>
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="h-8 w-8 text-purple-600" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Administrar Productos de Outlet
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingId ? "Editar Producto" : "Crear Nuevo Producto"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del producto</label>
              <Input 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <Textarea 
                value={form.description} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Precio original</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={form.original_price} 
                  onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Precio outlet</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={form.outlet_price} 
                  onChange={e => setForm(f => ({ ...f, outlet_price: e.target.value }))} 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Imagen</label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={e => setForm(f => ({ ...f, image: e.target.files?.[0] || null }))} 
                required={!editingId}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tienda</label>
              <select 
                value={form.store_id} 
                onChange={e => setForm(f => ({ ...f, store_id: e.target.value }))} 
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Seleccionar tienda</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="5" 
                  value={form.rating} 
                  onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Número de reseñas</label>
                <Input 
                  type="number" 
                  min="0" 
                  value={form.review_count} 
                  onChange={e => setForm(f => ({ ...f, review_count: e.target.value }))} 
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={form.is_featured} 
                  onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} 
                />
                Destacado
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={form.is_active} 
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} 
                />
                Activo
              </label>
            </div>
            
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            
            <div className="flex gap-2">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={uploading}>
                {uploading ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Lista de productos */}
        <div>
          <h2 className="text-xl font-bold mb-6">Productos de Outlet ({products.length})</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {products.map(product => (
              <Card key={product.id} className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.store_name}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="line-through text-gray-500">€{product.original_price}</span>
                          <span className="font-bold text-purple-600">€{product.outlet_price}</span>
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            -{product.discount_percentage}%
                          </Badge>
                        </div>
                        {product.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{product.rating}</span>
                            {product.review_count && (
                              <span className="text-sm text-gray-500">({product.review_count})</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={product.is_featured ? "default" : "outline"}
                            onClick={() => toggleFeatured(product.id, product.is_featured)}
                            className="h-8 w-8 p-0"
                          >
                            ⭐
                          </Button>
                          <Button
                            size="sm"
                            variant={product.is_active ? "default" : "outline"}
                            onClick={() => toggleActive(product.id, product.is_active)}
                            className="h-8 w-8 p-0"
                          >
                            {product.is_active ? "✓" : "✗"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editProduct(product)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProduct(product.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          {product.is_featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">Destacado</Badge>
                          )}
                          {!product.is_active && (
                            <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 