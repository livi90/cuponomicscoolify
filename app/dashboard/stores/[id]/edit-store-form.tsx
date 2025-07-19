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

interface Store {
  id: string
  name: string
  description: string | null
  website: string | null
  category: string | null
  logo_url: string | null
}

interface EditStoreFormProps {
  store: Store
  categories: Category[]
}

export default function EditStoreForm({ store, categories }: EditStoreFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: store.name || "",
    description: store.description || "",
    website: store.website || "",
    category: store.category || "",
    logo_url: store.logo_url || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/stores/${store.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar la tienda")
      }

      toast.success("Tienda actualizada exitosamente")
      router.push("/dashboard/stores")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al actualizar la tienda")
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
        <Label>Logo de la tienda</Label>
        <ImageUpload
          value={formData.logo_url}
          onChange={(url) => setFormData({ ...formData, logo_url: url })}
          bucket="stores"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar Tienda"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
