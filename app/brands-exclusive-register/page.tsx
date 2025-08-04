"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useEffect } from "react"
import { ImageUpload } from "@/components/ui/image-upload"

export default function PublicBrandsExclusiveRegisterPage() {
  const supabase = createClient()
  const [form, setForm] = useState({
    brand_name: "",
    website: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    description: "",
    category: "",
    logo_url: "",
    integration_type: "webhook",
    comments: "",
    commission: 7.5, // Valor por defecto
    acceptTerms: false,
  })
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [registerError, setRegisterError] = useState("")
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  useEffect(() => {
    // Cargar categorías desde Supabase
    const fetchCategories = async () => {
      
      const { data } = await supabase.from("categories").select("id, name")
      if (data && data.length > 0) {
        setCategories(data)
      } else {
        // Fallback: categorías estáticas
        setCategories([
          { id: "moda", name: "Moda y Accesorios" },
          { id: "tecnologia", name: "Tecnología" },
          { id: "hogar", name: "Hogar y Jardín" },
          { id: "deportes", name: "Deportes y Fitness" },
          { id: "belleza", name: "Belleza y Cuidado Personal" },
          { id: "alimentacion", name: "Alimentación y Bebidas" },
          { id: "libros", name: "Libros y Educación" },
          { id: "juguetes", name: "Juguetes y Niños" },
          { id: "automoviles", name: "Automóviles" },
          { id: "viajes", name: "Viajes y Turismo" },
          { id: "salud", name: "Salud y Bienestar" },
          { id: "arte", name: "Arte y Manualidades" },
          { id: "mascotas", name: "Mascotas" },
          { id: "servicios", name: "Servicios Profesionales" },
          { id: "entretenimiento", name: "Entretenimiento" },
          { id: "otros", name: "Otros" },
        ])
      }
    }
    fetchCategories()
    // Detectar usuario autenticado
    const checkUser = async () => {
      
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setForm({ ...form, [name]: e.target.checked })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, commission: parseFloat(e.target.value) })
  }

  const handleLogoChange = (url: string) => {
    setForm({ ...form, logo_url: url })
  }

  // Registro rápido
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")
    setRegisterLoading(true)
    setRegisterSuccess(false)
    try {
      
      const { data, error } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: { full_name: registerForm.name },
        },
      })
      if (error) {
        setRegisterError(error.message)
      } else {
        setRegisterSuccess(true)
        setRegisterError("")
        // Esperar a que el usuario confirme el email o inicie sesión
      }
    } catch (err: any) {
      setRegisterError("Error inesperado: " + err.message)
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    if (!form.acceptTerms) {
      setError("Debes aceptar los términos y condiciones para continuar.")
      alert("Debes aceptar los términos y condiciones para continuar.")
      return
    }
    setLoading(true)
    try {
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("No autorizado")
        setLoading(false)
        return
      }
      // Insertar en store_applications con todos los campos relevantes
      const { error: insertError } = await supabase.from("store_applications").insert({
        user_id: user.id,
        store_name: form.brand_name,
        description: form.description,
        website: form.website,
        logo_url: form.logo_url || null,
        category: form.category || null,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone || null,
        address: form.address || null,
        status: "pending",
        ecommerce_platform: form.integration_type,
        is_exclusive_brand: true,
        commission: form.commission,
        accepted_terms: form.acceptTerms,
        additional_info: form.comments,
        business_type: "exclusive_brand",
        contact_name: form.contact_name,
        store_description: form.description, // o "" si prefieres
      })
      if (insertError) {
        setError("Error al guardar la solicitud: " + insertError.message)
        alert("Error al guardar la solicitud: " + insertError.message)
      } else {
        setSuccess(true)
        alert("¡Solicitud enviada correctamente!")
        setForm({
          brand_name: "",
          website: "",
          contact_name: "",
          contact_email: "",
          contact_phone: "",
          address: "",
          description: "",
          category: "",
          logo_url: "",
          integration_type: "webhook",
          comments: "",
          commission: 7.5,
          acceptTerms: false,
        })
      }
    } catch (err: any) {
      setError("Error inesperado: " + err.message)
      alert("Error inesperado: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    // Mostrar formulario de registro rápido
    return (
      <div className="max-w-md mx-auto py-12">
        <h1 className="text-2xl font-bold mb-6 text-center">Crea tu cuenta para registrar tu marca</h1>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre completo</label>
            <Input name="name" value={registerForm.name} onChange={handleRegisterChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input name="email" value={registerForm.email} onChange={handleRegisterChange} required type="email" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <Input name="password" value={registerForm.password} onChange={handleRegisterChange} required type="password" minLength={6} />
          </div>
          {registerError && <div className="text-red-600 font-semibold">{registerError}</div>}
          {registerSuccess && <div className="text-green-600 font-semibold">¡Cuenta creada! Revisa tu correo para confirmar y luego vuelve a este enlace.</div>}
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white w-full" disabled={registerLoading}>
            {registerLoading ? "Registrando..." : "Crear cuenta y continuar"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta? <a href="/login" className="text-orange-600 underline">Inicia sesión aquí</a>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">¡Solicitud enviada!</h1>
        <p className="mb-4">Gracias por registrar tu marca. Un administrador revisará tu solicitud y te contactará pronto.</p>
        <p className="mb-4">Mientras tanto, puedes consultar las instrucciones de integración aquí:</p>
        <Link href="/dashboard/admin/brands-exclusive-instructions">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Ver instrucciones de integración</Button>
        </Link>
      </div>
    )
  }

  // Formulario de registro de marca (usuario autenticado)
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
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <Input name="address" value={form.address} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción breve</label>
          <Textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="">Selecciona una categoría</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Logo de la marca</label>
          <ImageUpload value={form.logo_url} onChange={handleLogoChange} bucket="stores" label="Logo" />
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
          <label className="block text-sm font-medium mb-1">Comisión por venta generada <span className="text-orange-600 font-semibold">({form.commission}%)</span></label>
          <input
            type="range"
            name="commission"
            min={5}
            max={10}
            step={0.5}
            value={form.commission}
            onChange={handleCommissionChange}
            className="w-full accent-orange-500"
          />
          <div className="text-xs text-gray-600 mt-1">
            Elige entre 5% y 10%. <span className="text-orange-700 font-semibold">Entre mayor sea la comisión, más nos esforzaremos en postular y posicionar tu oferta en Cuponomics.</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Comentarios adicionales</label>
          <Textarea name="comments" value={form.comments} onChange={handleChange} rows={2} />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={form.acceptTerms}
            onChange={handleChange}
            required
            className="accent-orange-500"
          />
          <span className="text-sm">
            Acepto los <Link href="/brands-exclusive-terms" className="text-orange-600 underline" target="_blank">términos y condiciones</Link> de Cuponomics
          </span>
        </div>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
          {loading ? "Enviando..." : "Registrar marca"}
        </Button>
      </form>
    </div>
  )
} 