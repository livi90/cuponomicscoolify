import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createClientClient } from "@/lib/supabase/client"

export interface NikeProduct {
  id: string
  aw_deep_link: string
  product_name: string
  aw_product_id: string
  merchant_product_id: string
  merchant_image_url?: string
  description?: string
  merchant_category?: string
  search_price?: number
  currency?: string
  store_price?: number
  delivery_cost?: number
  display_price?: string
  merchant_name: string
  merchant_id: number
  merchant_deep_link?: string
  category_name?: string
  category_id?: number
  aw_image_url?: string
  language?: string
  last_updated?: string
  data_feed_id?: number
  created_at?: string
  updated_at?: string
  is_active?: boolean
  discount_percentage?: number
  original_price?: number
  stock_status?: string
  data_hash?: string
  import_batch_id?: string
}

export interface NikeProductWithDiscounts extends NikeProduct {
  calculated_discount?: number
}

export interface NikeSearchOptions {
  query: string
  category?: string
  minPrice?: number
  maxPrice?: number
  hasDiscount?: boolean
  sortBy?: 'price' | 'discount' | 'name' | 'updated'
  limit?: number
}

export class NikeProductsService {
  /**
   * Obtiene el cliente Supabase apropiado según el entorno
   */
  private static async getSupabaseClient() {
    if (typeof window === 'undefined') {
      // Server-side
      return await createServerClient()
    } else {
      // Client-side
      return createClientClient()
    }
  }

  /**
   * Detecta si una búsqueda está relacionada con Nike
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
   * Busca productos Nike con descuentos
   */
  static async searchDiscountedProducts(options: NikeSearchOptions): Promise<NikeProductWithDiscounts[]> {
    try {
      const supabase = await this.getSupabaseClient()
      
      let query = supabase
        .from('nike_products_with_discounts')
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
   * Busca todos los productos Nike
   */
  static async searchAllProducts(options: NikeSearchOptions): Promise<NikeProduct[]> {
    try {
      const supabase = await this.getSupabaseClient()
      
      let query = supabase
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
   * Combina resultados de productos con descuento y productos regulares
   */
  static async searchProducts(options: NikeSearchOptions): Promise<NikeProduct[]> {
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

  /**
   * Obtiene categorías disponibles de productos Nike
   */
  static async getCategories(): Promise<string[]> {
    try {
      const supabase = await this.getSupabaseClient()
      
      const { data, error } = await supabase
        .from('nike_products')
        .select('category_name')
        .eq('is_active', true)
        .not('category_name', 'is', null)

      if (error) {
        console.error('Error fetching Nike categories:', error)
        return []
      }

      // Obtener categorías únicas
      const categories = [...new Set(data?.map(item => item.category_name).filter(Boolean))]
      return categories.sort()
    } catch (error) {
      console.error('Error in getCategories:', error)
      return []
    }
  }

  /**
   * Obtiene estadísticas de productos Nike
   */
  static async getProductStats(): Promise<{
    totalProducts: number
    productsWithDiscount: number
    averagePrice: number
    categories: number
  }> {
    try {
      const supabase = await this.getSupabaseClient()
      
      // Total de productos
      const { count: totalProducts } = await supabase
        .from('nike_products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Productos con descuento
      const { count: productsWithDiscount } = await supabase
        .from('nike_products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gt('discount_percentage', 0)

      // Precio promedio
      const { data: priceData } = await supabase
        .from('nike_products')
        .select('search_price')
        .eq('is_active', true)
        .not('search_price', 'is', null)

      const averagePrice = priceData?.length > 0 
        ? priceData.reduce((sum, item) => sum + (item.search_price || 0), 0) / priceData.length
        : 0

      // Número de categorías
      const categories = await this.getCategories()

      return {
        totalProducts: totalProducts || 0,
        productsWithDiscount: productsWithDiscount || 0,
        averagePrice: Math.round(averagePrice * 100) / 100,
        categories: categories.length
      }
    } catch (error) {
      console.error('Error in getProductStats:', error)
      return {
        totalProducts: 0,
        productsWithDiscount: 0,
        averagePrice: 0,
        categories: 0
      }
    }
  }

  /**
   * Obtiene un producto específico por ID
   */
  static async getProductById(awProductId: string): Promise<NikeProduct | null> {
    try {
      const supabase = await this.getSupabaseClient()
      
      const { data, error } = await supabase
        .from('nike_products')
        .select('*')
        .eq('aw_product_id', awProductId)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching Nike product by ID:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getProductById:', error)
      return null
    }
  }
}
