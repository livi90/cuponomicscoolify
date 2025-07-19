"use client"

import { type ChangeEvent, useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { storageService } from "@/lib/services/storage-service"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  bucket: string
  label?: string
  disabled?: boolean
  path?: string
}

export const ImageUpload = ({
  value,
  onChange,
  bucket,
  label = "Imagen",
  disabled = false,
  path = "",
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)

      let url: string | null = null

      // Usar métodos específicos según el tipo de contenido
      switch (bucket) {
        case "products":
          url = await storageService.uploadProductImage(file, path)
          break
        case "stores":
          url = await storageService.uploadStoreImage(file, path)
          break
        case "profiles":
          url = await storageService.uploadProfileImage(file, path)
          break
        default:
          url = await storageService.uploadImage(file, bucket, path)
      }

      if (url) {
        onChange(url)
      } else {
        console.error("No se pudo obtener la URL de la imagen")
      }
    } catch (error) {
      console.error("Error al subir imagen:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async () => {
    if (disabled) return

    try {
      setIsLoading(true)

      if (value) {
        await storageService.deleteImage(value)
      }

      onChange("")
    } catch (error) {
      console.error("Error al eliminar imagen:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) return null

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-col items-center gap-4">
        {value ? (
          <div className="relative w-full h-40">
            <Image
              src={value || "/placeholder.svg"}
              alt={label}
              fill
              className="object-contain rounded-md"
              sizes="(max-width: 768px) 100vw, 300px"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0"
              onClick={handleRemove}
              disabled={disabled || isLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled || isLoading}
              className="cursor-pointer"
            />
            {isLoading && <p className="text-sm text-muted-foreground mt-2">Subiendo imagen...</p>}
          </div>
        )}
      </div>
    </div>
  )
}
