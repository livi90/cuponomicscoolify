import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

export class StorageService {
  private supabase = createClient()

  // Buckets disponibles
  private BUCKETS = {
    PUBLIC: "public",
    PRODUCTS: "products",
    STORES: "stores",
    PROFILES: "profiles",
  }

  /**
   * Sube una imagen a Supabase Storage
   * @param file Archivo a subir
   * @param bucket Nombre del bucket (public, products, stores, profiles)
   * @param path Ruta dentro del bucket (opcional)
   * @returns URL de la imagen subida o null si hay error
   */
  async uploadImage(file: File, bucket: string, path = ""): Promise<string | null> {
    try {
      // Validar que el archivo sea una imagen
      if (!file.type.startsWith("image/")) {
        throw new Error("El archivo debe ser una imagen")
      }

      // Limitar el tamaño a 5MB
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("La imagen no debe superar los 5MB")
      }

      // Validar que el bucket exista
      if (!Object.values(this.BUCKETS).includes(bucket)) {
        console.warn(`El bucket ${bucket} no está en la lista de buckets conocidos. Usando ${this.BUCKETS.PUBLIC}`)
        bucket = this.BUCKETS.PUBLIC
      }

      // Generar un nombre único para el archivo
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`

      // Construir la ruta del archivo dentro del bucket
      const filePath = path ? `${path}/${fileName}` : fileName

      // Subir el archivo al bucket especificado
      const { data, error } = await this.supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Error específico al subir:", error.message)
        throw error
      }

      // Obtener la URL pública
      const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(data.path)

      return urlData.publicUrl
    } catch (error) {
      console.error("Error al subir imagen:", error)
      return null
    }
  }

  /**
   * Elimina una imagen de Supabase Storage
   * @param url URL de la imagen a eliminar
   * @returns true si se eliminó correctamente, false si hubo error
   */
  async deleteImage(url: string): Promise<boolean> {
    try {
      // Extraer el path del archivo y el bucket de la URL
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split("/")

      // Identificar el bucket y el path
      // La URL tiene formato: /storage/v1/object/public/[bucket]/[path]
      const bucketIndex = pathParts.indexOf("public") + 1
      const bucket = pathParts[bucketIndex]
      const filePath = pathParts.slice(bucketIndex + 1).join("/")

      if (!bucket || !filePath) {
        throw new Error("No se pudo extraer el bucket o la ruta del archivo de la URL")
      }

      // Eliminar el archivo
      const { error } = await this.supabase.storage.from(bucket).remove([filePath])

      if (error) throw error

      return true
    } catch (error) {
      console.error("Error al eliminar imagen:", error)
      return false
    }
  }

  // Métodos específicos para cada tipo de contenido

  /**
   * Sube una imagen de producto
   * @param file Archivo a subir
   * @param path Subcarpeta opcional
   * @returns URL de la imagen subida o null si hay error
   */
  async uploadProductImage(file: File, path = ""): Promise<string | null> {
    return this.uploadImage(file, this.BUCKETS.PRODUCTS, path)
  }

  /**
   * Sube una imagen de tienda
   * @param file Archivo a subir
   * @param path Subcarpeta opcional
   * @returns URL de la imagen subida o null si hay error
   */
  async uploadStoreImage(file: File, path = ""): Promise<string | null> {
    return this.uploadImage(file, this.BUCKETS.STORES, path)
  }

  /**
   * Sube una imagen de perfil
   * @param file Archivo a subir
   * @param path Subcarpeta opcional
   * @returns URL de la imagen subida o null si hay error
   */
  async uploadProfileImage(file: File, path = ""): Promise<string | null> {
    return this.uploadImage(file, this.BUCKETS.PROFILES, path)
  }
}

// Exportar una instancia del servicio para uso global
export const storageService = new StorageService()
