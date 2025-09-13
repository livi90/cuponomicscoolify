import { createClient } from "@/lib/supabase/client"

export interface ClientNikeSearchOptions {
  query: string
  category?: string
  minPrice?: number
  maxPrice?: number
  hasDiscount?: boolean
  sortBy?: 'price' | 'discount' | 'name' | 'updated'
  limit?: number
}

/**
 * Versión simplificada del servicio Nike que funciona solo en el cliente
 */
export class NikeProductsClientService {
  private static supabase = createClient()

  /**
   * Detecta si una búsqueda está relacionada con Nike usando palabras clave básicas
   */
  static isNikeRelated(query: string): boolean {
    const nikeKeywords = [
      'nike', 'air max', 'air force', 'jordan', 'dunk', 'blazer', 
      'cortez', 'react', 'zoom', 'vapormax', 'air jordan', 
      'lebron', 'kobe', 'kyrie', 'kevin durant', 'kd'
    ]
    
    const normalizedQuery = query.toLowerCase()
    return nikeKeywords.some(keyword => normalizedQuery.includes(keyword))
  }

  /**
   * Busca productos Nike con descuentos (solo cliente)
   */
  static async searchDiscountedProducts(options: ClientNikeSearchOptions) {
    try {
      let query = this.supabase
        .from('nike_products_with_discounts')
        .select('*')

      // Aplicar filtros de búsqueda
      if (options.query) {
        query = query.or(`product_name.ilike.%${options.query}%,description.ilike.%${options.query}%,category_name.ilike.%${options.query}%`)
      }

      if (options.category) {
        query = query.ilike('category_name', `%${options.category}%`)
      }

      if (options.minPrice !== undefined) {
        query = query.gte('search_price', options.minPrice)
      }

      if (options.maxPrice !== undefined) {
        query = query.lte('search_price', options.maxPrice)
      }

      // Ordenamiento
      switch (options.sortBy) {
        case 'price':
          query = query.order('search_price', { ascending: true })
          break
        case 'discount':
          query = query.order('calculated_discount', { ascending: false })
          break
        case 'name':
          query = query.order('product_name', { ascending: true })
          break
        case 'updated':
        default:
          query = query.order('last_updated', { ascending: false })
          break
      }

      const { data, error } = await query.limit(options.limit || 20)

      if (error) {
        console.error('Error fetching discounted Nike products:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in searchDiscountedProducts:', error)
      return []
    }
  }

  /**
   * Busca todos los productos Nike (solo cliente)
   */
  static async searchAllProducts(options: ClientNikeSearchOptions) {
    try {
      let query = this.supabase
        .from('nike_products')
        .select('*')
        .eq('is_active', true)

      // Aplicar filtros de búsqueda
      if (options.query) {
        query = query.or(`product_name.ilike.%${options.query}%,description.ilike.%${options.query}%,category_name.ilike.%${options.query}%`)
      }

      if (options.category) {
        query = query.ilike('category_name', `%${options.category}%`)
      }

      if (options.minPrice !== undefined) {
        query = query.gte('search_price', options.minPrice)
      }

      if (options.maxPrice !== undefined) {
        query = query.lte('search_price', options.maxPrice)
      }

      if (options.hasDiscount) {
        query = query.gt('discount_percentage', 0)
      }

      // Ordenamiento
      switch (options.sortBy) {
        case 'price':
          query = query.order('search_price', { ascending: true })
          break
        case 'discount':
          query = query.order('discount_percentage', { ascending: false })
          break
        case 'name':
          query = query.order('product_name', { ascending: true })
          break
        case 'updated':
        default:
          query = query.order('last_updated', { ascending: false })
          break
      }

      const { data, error } = await query.limit(options.limit || 20)

      if (error) {
        console.error('Error fetching Nike products:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in searchAllProducts:', error)
      return []
    }
  }

  /**
   * Búsqueda combinada (solo cliente)
   */
  static async searchProducts(options: ClientNikeSearchOptions) {
    try {
      // Obtener productos con descuento primero
      const discountedProducts = await this.searchDiscountedProducts({
        ...options,
        limit: Math.floor((options.limit || 20) / 2)
      })

      // Obtener productos regulares
      const allProducts = await this.searchAllProducts({
        ...options,
        limit: options.limit || 20
      })

      // Combinar y eliminar duplicados basados en aw_product_id
      const combinedProducts = [...discountedProducts, ...allProducts]
      const uniqueProducts = combinedProducts.filter((product, index, self) => 
        index === self.findIndex(p => p.aw_product_id === product.aw_product_id)
      )

      // Limitar resultados finales
      return uniqueProducts.slice(0, options.limit || 20)
    } catch (error) {
      console.error('Error in searchProducts:', error)
      return []
    }
  }
}
