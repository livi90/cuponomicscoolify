import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

export default function BrandsExclusiveRegisterPage() {
  const [form, setForm] = useState({
    brand_name: "",
    website: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    description: "",
    integration_type: "webhook",
    comments: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Solo admins pueden acceder
  // (En producción, proteger también por server-side o middleware)
  // Aquí solo ejemplo en client-side
  // TODO: Mejorar seguridad en entorno real

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("No autorizado")
        setLoading(false)
        return
      }
      // Verificar rol admin
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
      if (!profile || profile.role !== "admin") {
        setError("Solo administradores pueden acceder a este formulario.")
        setLoading(false)
        return
      }
      // Insertar en store_applications con flag especial
      const { error: insertError } = await supabase.from("store_applications").insert({
        user_id: user.id,
        store_name: form.brand_name,
        store_description: form.description,
        store_website: form.website,
        business_type: "exclusive_brand",
        contact_phone: form.contact_phone,
        contact_email: form.contact_email,
        contact_name: form.contact_name,
        additional_info: `Tipo integración: ${form.integration_type}. Comentarios: ${form.comments}`,
        is_exclusive_brand: true,
        status: "pending",
      })
      if (insertError) {
        setError("Error al guardar la solicitud: " + insertError.message)
      } else {
        setSuccess(true)
        setForm({
          brand_name: "",
          website: "",
          contact_name: "",
          contact_email: "",
          contact_phone: "",
          description: "",
          integration_type: "webhook",
          comments: "",
        })
      }
    } catch (err: any) {
      setError("Error inesperado: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Registro exclusivo de marcas grandes</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Nombre de la marca *</label>
          <Input name="brand_name" value={form.brand_name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sitio web *</label>
          <Input name="website" value={form.website} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Persona de contacto *</label>
          <Input name="contact_name" value={form.contact_name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email de contacto *</label>
          <Input name="contact_email" value={form.contact_email} onChange={handleChange} required type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <Input name="contact_phone" value={form.contact_phone} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción breve</label>
          <Textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de integración preferida</label>
          <select name="integration_type" value={form.integration_type} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="webhook">Webhook</option>
            <option value="pixel">Pixel</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Comentarios adicionales</label>
          <Textarea name="comments" value={form.comments} onChange={handleChange} rows={2} />
        </div>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        {success && <div className="text-green-600 font-semibold">¡Solicitud registrada correctamente!</div>}
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
          {loading ? "Enviando..." : "Registrar marca"}
        </Button>
      </form>
    </div>
  )
} 