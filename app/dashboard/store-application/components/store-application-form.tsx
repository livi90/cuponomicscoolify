"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface StoreApplicationFormProps {
  userId: string
}

export default function StoreApplicationForm({ userId }: StoreApplicationFormProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    store_name: "",
    store_description: "",
    store_website: "",
    store_category: "",
    business_type: "",
    contact_phone: "",
    additional_info: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("user_id", userId)
      formDataToSend.append("store_name", formData.store_name)
      formDataToSend.append("store_description", formData.store_description)
      formDataToSend.append("store_website", formData.store_website)
      formDataToSend.append("store_category", formData.store_category)
      formDataToSend.append("business_type", formData.business_type)
      formDataToSend.append("contact_phone", formData.contact_phone)
      formDataToSend.append("additional_info", formData.additional_info)

      const response = await fetch("/api/store-application", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Error al enviar la solicitud")
      }

      toast.success("Solicitud enviada exitosamente")
      setSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al enviar la solicitud")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-green-600 mb-4">¡Solicitud Enviada!</h2>
        <p className="text-gray-600">
          Tu solicitud ha sido enviada exitosamente. Recibirás una respuesta en las próximas 24-48 horas.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="store_name">Nombre de la tienda *</Label>
        <Input
          id="store_name"
          name="store_name"
          value={formData.store_name}
          onChange={handleInputChange}
          required
          placeholder="Ej: Mi Tienda Online"
        />
      </div>

      <div>
        <Label htmlFor="store_description">Descripción de la tienda *</Label>
        <Textarea
          id="store_description"
          name="store_description"
          value={formData.store_description}
          onChange={handleInputChange}
          required
          placeholder="Describe tu tienda y los productos que vendes..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="store_website">Sitio web</Label>
        <Input
          id="store_website"
          name="store_website"
          type="url"
          value={formData.store_website}
          onChange={handleInputChange}
          placeholder="https://mitienda.com"
        />
      </div>

      <div>
        <Label htmlFor="store_category">Categoría *</Label>
        <select
          id="store_category"
          name="store_category"
          value={formData.store_category}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Selecciona una categoría</option>
          <option value="Moda">Moda</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Hogar">Hogar</option>
          <option value="Deportes">Deportes</option>
          <option value="Belleza">Belleza</option>
          <option value="Alimentación">Alimentación</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      <div>
        <Label htmlFor="business_type">Tipo de negocio *</Label>
        <select
          id="business_type"
          name="business_type"
          value={formData.business_type}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Selecciona el tipo</option>
          <option value="Tienda física">Tienda física</option>
          <option value="E-commerce">E-commerce</option>
          <option value="Ambos">Ambos</option>
        </select>
      </div>

      <div>
        <Label htmlFor="contact_phone">Teléfono de contacto</Label>
        <Input
          id="contact_phone"
          name="contact_phone"
          type="tel"
          value={formData.contact_phone}
          onChange={handleInputChange}
          placeholder="+1234567890"
        />
      </div>

      <div>
        <Label htmlFor="additional_info">Información adicional</Label>
        <Textarea
          id="additional_info"
          name="additional_info"
          value={formData.additional_info}
          onChange={handleInputChange}
          placeholder="Cualquier información adicional que quieras compartir..."
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Enviando..." : "Enviar Solicitud"}
      </Button>
    </form>
  )
}
