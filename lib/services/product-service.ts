import { createClient } from "@/lib/supabase/client"
import type { Product, ProductFormData } from "@/lib/types/product"

export class ProductService {
  private supabase = createClient()

  // Verificar límite de productos gratuitos
  async checkProductLimit(storeId: string): Promise<{ canCreate: boolean; currentCount: number; limit: number }> {
    try {
      const { data: userData } = await this.supabase.auth.getUser()
      if (!userData.user) throw new Error("Usuario no autenticado")

      // Contar productos actuales de la tienda
      const { data: products, error } = await this.supabase
        .from("products")
        .select("id")
        .eq("store_id", storeId)
        .eq("status", "active")

      if (error) throw error

      const currentCount = products?.length || 0
      const freeLimit = 20

      // Verificar si tiene suscripción activa
      const { data: subscription } = await this.supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("status", "active")
        .single()

      // Si tiene suscripción, no hay límite
      if (subscription) {
        return { canCreate: true, currentCount, limit: -1 } // -1 = ilimitado
      }

      // Sin suscripción, límite de 20 productos
      return {
        canCreate: currentCount < freeLimit,
        currentCount,
        limit: freeLimit,
      }
    } catch (error) {
      console.error("Error al verificar límite de productos:", error)
      return { canCreate: false, currentCount: 0, limit: 20 }
    }
  }

  // Obtener todos los productos de una tienda
  async getProductsByStore(storeId: string): Promise<Product[]> {
    try {
      const { data, error } = await this.supabase
        .from("products")
        .select("*, store:stores(*)")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error al obtener productos:", error)
      return []
    }
  }

  // Obtener un producto por ID
  async getProductById(productId: string): Promise<Product | null> {
    try {
      const { data, error } = await this.supabase
        .from("products")
        .select("*, store:stores(*)")
        .eq("id", productId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error al obtener producto:", error)
      return null
    }
  }

  // Crear un nuevo producto
  async createProduct(storeId: string, productData: ProductFormData): Promise<Product | null> {
    try {
      console.log("Creando producto para tienda:", storeId, "con datos:", productData)

      // Verificar límite de productos PRIMERO
      const limitCheck = await this.checkProductLimit(storeId)
      if (!limitCheck.canCreate) {
        throw new Error(
          `Has alcanzado el límite gratuito de ${limitCheck.limit} productos. Suscríbete para agregar productos ilimitados.`,
        )
      }

      // Verificar que la tienda existe y pertenece al usuario
      const { data: userData } = await this.supabase.auth.getUser()
      if (!userData.user) throw new Error("Usuario no autenticado")

      const { data: storeData, error: storeError } = await this.supabase
        .from("stores")
        .select("*")
        .eq("id", storeId)
        .single()

      if (storeError) {
        console.error("Error al verificar tienda:", storeError)
        throw new Error(`No se pudo verificar la tienda: ${storeError.message}`)
      }

      if (!storeData) {
        throw new Error("La tienda no existe")
      }

      // Verificar que el usuario es propietario de la tienda
      if (storeData.user_id !== userData.user.id && storeData.owner_id !== userData.user.id) {
        throw new Error("No tienes permiso para crear productos en esta tienda")
      }

      // Crear el producto
      const { data, error } = await this.supabase
        .from("products")
        .insert({
          store_id: storeId,
          ...productData,
          // Convertir fechas a formato ISO si existen
          start_date: productData.start_date ? new Date(productData.start_date).toISOString() : null,
          end_date: productData.end_date ? new Date(productData.end_date).toISOString() : null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error al insertar producto:", error)
        throw error
      }

      return data
    } catch (error: any) {
      console.error("Error detallado al crear producto:", error)
      throw error
    }
  }

  // Actualizar un producto existente
  async updateProduct(productId: string, productData: Partial<ProductFormData>): Promise<Product | null> {
    try {
      const { data, error } = await this.supabase
        .from("products")
        .update({
          ...productData,
          // Convertir fechas a formato ISO si existen
          start_date: productData.start_date ? new Date(productData.start_date).toISOString() : undefined,
          end_date: productData.end_date ? new Date(productData.end_date).toISOString() : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error al actualizar producto:", error)
      throw error
    }
  }

  // Eliminar un producto
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("products").delete().eq("id", productId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      return false
    }
  }

  // Obtener productos destacados para la página pública
  async getFeaturedProducts(limit = 12): Promise<Product[]> {
    try {
      const { data, error } = await this.supabase
        .from("products")
        .select("*, store:stores(*)")
        .eq("status", "active")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error al obtener productos destacados:", error)
      return []
    }
  }

  // Obtener productos nuevos para la página pública
  async getNewProducts(limit = 12): Promise<Product[]> {
    try {
      const { data, error } = await this.supabase
        .from("products")
        .select("*, store:stores(*)")
        .eq("status", "active")
        .eq("is_new", true)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error al obtener productos nuevos:", error)
      return []
    }
  }

  // Buscar productos por categoría
  async getProductsByCategory(category: string, limit = 12): Promise<Product[]> {
    try {
      const { data, error } = await this.supabase
        .from("products")
        .select("*, store:stores(*)")
        .eq("status", "active")
        .eq("category", category)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error al obtener productos por categoría:", error)
      return []
    }
  }

  // Obtener todas las tiendas para el usuario actual
  async getUserStores(): Promise<{ id: string; name: string }[]> {
    try {
      const { data: userData } = await this.supabase.auth.getUser()
      if (!userData.user) return []

      // Buscar tiendas donde el usuario es propietario (por user_id o owner_id)
      const { data, error } = await this.supabase
        .from("stores")
        .select("id, name")
        .or(`user_id.eq.${userData.user.id},owner_id.eq.${userData.user.id}`)
        .eq("is_active", true)

      if (error) {
        console.error("Error al obtener tiendas:", error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error al obtener tiendas del usuario:", error)
      return []
    }
  }

  async getFeaturedProductById(productId: string): Promise<Product | null> {
    try {
      const { data, error } = await this.supabase
        .from("products")
        .select("*, store:stores(*)")
        .eq("id", productId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error al obtener producto:", error)
      return null
    }
  }

  async getStoresByMerchant(): Promise<any[]> {
    try {
      const { data: userData } = await this.supabase.auth.getUser()
      if (!userData.user) return []

      // Buscar tiendas donde el usuario es propietario (por user_id o owner_id)
      const { data, error } = await this.supabase
        .from("stores")
        .select("*")
        .or(`user_id.eq.${userData.user.id},owner_id.eq.${userData.user.id}`)
        .eq("is_active", true)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error al obtener tiendas del usuario:", error)
      return []
    }
  }

  async updateFeaturedProduct(productId: string, productData: ProductFormData): Promise<Product | null> {
    try {
      const { data, error } = await this.supabase
        .from("products")
        .update({
          ...productData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error al actualizar producto:", error)
      return null
    }
  }
}

// Exportar una instancia del servicio para uso global
export const productService = new ProductService()

export const getFeaturedProductById = async (productId: string): Promise<Product | null> => {
  return productService.getFeaturedProductById(productId)
}

export const getStoresByMerchant = async (): Promise<any[]> => {
  return productService.getStoresByMerchant()
}

export const updateFeaturedProduct = async (
  productId: string,
  productData: ProductFormData,
): Promise<Product | null> => {
  return productService.updateFeaturedProduct(productId, productData)
}
