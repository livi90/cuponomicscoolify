"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/ui/image-upload"

interface Category {
  id: string
  name: string
}

interface NewStoreFormProps {
  categories: Category[]
}

export default function NewStoreForm({ categories }: NewStoreFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    category: "",
    logo_url: "",
    country: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          website: formData.website,
          category: formData.category,
          logo_url: formData.logo_url,
          country: formData.country,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear la tienda")
      }

      const result = await response.json()
      toast.success("Tienda creada exitosamente")
      router.push("/dashboard/stores")
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Error al crear la tienda")
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <Label htmlFor="name">Nombre de la tienda *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="Ej: Mi Tienda Online"
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe tu tienda..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="website">Sitio web</Label>
        <Input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="https://mitienda.com"
        />
      </div>

      <div>
        <Label htmlFor="category">Categoría</Label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="country">País donde opera la tienda *</Label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Selecciona un país</option>
          <option value="no_restriction">No afecta envíos o ventas (global, digital, etc.)</option>
          <option value="AR">Argentina</option>
          <option value="BO">Bolivia</option>
          <option value="BR">Brasil</option>
          <option value="CL">Chile</option>
          <option value="CO">Colombia</option>
          <option value="CR">Costa Rica</option>
          <option value="EC">Ecuador</option>
          <option value="ES">España</option>
          <option value="MX">México</option>
          <option value="PA">Panamá</option>
          <option value="PE">Perú</option>
          <option value="PY">Paraguay</option>
          <option value="UY">Uruguay</option>
          <option value="US">Estados Unidos</option>
          <option value="VE">Venezuela</option>
          <option value="OTRO">Otro país</option>
        </select>
      </div>

      <div>
        <Label>Logo de la tienda</Label>
        <ImageUpload
          value={formData.logo_url}
          onChange={(url) => setFormData({ ...formData, logo_url: url })}
          bucket="stores"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Tienda"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
