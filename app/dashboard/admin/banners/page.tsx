"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [form, setForm] = useState({
    title: "",
    link_url: "",
    image: null as File | null,
    start_date: "",
    end_date: "",
    position: "top",
    is_active: true,
  })
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
      router.replace("/login?redirect=/dashboard/admin/banners")
      return
    }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    if (!profile || profile.role !== "admin") {
      router.replace("/dashboard")
      return
    }
    setAdminChecked(true)
    fetchBanners()
  }

  async function fetchBanners() {
    
    const { data } = await supabase.from("banners").select("*").order("created_at", { ascending: false })
    setBanners(data || [])
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
        const fileName = `${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from("banners")
          .upload(fileName, form.image)
        if (uploadError) throw uploadError
        const { data: publicUrl } = supabase.storage.from("banners").getPublicUrl(fileName)
        image_url = publicUrl.publicUrl
      }
      
      // Desactivar otros banners activos en la misma posición
      await supabase.from("banners").update({ is_active: false }).eq("position", form.position)
      const { error: insertError } = await supabase.from("banners").insert({
        title: form.title,
        link_url: form.link_url,
        image_url,
        start_date: form.start_date,
        end_date: form.end_date,
        position: form.position,
        is_active: form.is_active,
      })
      if (insertError) throw insertError
      setSuccess("¡Banner publicado!")
      setForm({ title: "", link_url: "", image: null, start_date: "", end_date: "", position: "top", is_active: true })
      fetchBanners()
    } catch (err: any) {
      setError("Error: " + (err.message || err))
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar este banner?")) return
    
    await supabase.from("banners").delete().eq("id", id)
    fetchBanners()
  }

  // Advertencia si hay más de un banner activo por posición
  const activeBannersByPosition = banners.filter(b => b.is_active).reduce((acc: Record<string, number>, b) => {
    acc[b.position] = (acc[b.position] || 0) + 1
    return acc
  }, {})
  const multipleActive = Object.values(activeBannersByPosition).some(count => count > 1)

  if (!adminChecked || loading) {
    return <div className="p-8 text-center">Cargando...</div>
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Administrar Banner Ads</h1>
      {multipleActive && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded">
          <b>Advertencia:</b> Hay más de un banner activo en la misma posición. Solo se mostrará uno, pero revisa la configuración.
        </div>
      )}
      <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Título (opcional)</label>
          <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Enlace (opcional)</label>
          <Input value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagen (1200x240px recomendado, PNG/JPG)</label>
          <Input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, image: e.target.files?.[0] || null }))} required />
        </div>
        <div className="flex gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Inicio</label>
            <Input type="datetime-local" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fin</label>
            <Input type="datetime-local" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Posición</label>
          <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className="border rounded px-2 py-1">
            <option value="top">Superior (top)</option>
            {/* Puedes agregar más posiciones si lo deseas */}
          </select>
        </div>
        <div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
            Activo
          </label>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={uploading}>
          {uploading ? "Subiendo..." : "Publicar banner"}
        </Button>
      </form>
      <h2 className="text-lg font-bold mb-2">Banners publicados</h2>
      <div className="space-y-4">
        {banners.map(b => (
          <div key={b.id} className="flex items-center gap-4 border rounded-lg p-3">
            <div className="w-48 h-12 relative">
              <Image src={b.image_url} alt={b.title || "Banner"} fill className="object-contain rounded" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{b.title}</div>
              <div className="text-xs text-gray-500">{b.link_url}</div>
              <div className="text-xs text-gray-500">Del {b.start_date?.slice(0,16).replace('T',' ')} al {b.end_date?.slice(0,16).replace('T',' ')}</div>
              <div className="text-xs">{b.is_active ? <span className="text-green-600">Activo</span> : <span className="text-red-600">Inactivo</span>}</div>
            </div>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(b.id)}>
              Eliminar
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-xs text-gray-500">Solo un banner activo por posición. Tamaño recomendado: 1200x240px. El banner se adapta automáticamente al ancho de la página.</div>
    </div>
  )
} 