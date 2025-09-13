import { MeiliSearch } from 'meilisearch'

// Cliente de Meilisearch configurado
export const meilisearchClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_URL || 'https://meilisearch-b8osgk4ckgococo40080w80w.dbcuponomics.online',
  apiKey: process.env.SERVICE_PASSWORD_MEILISEARCH, // Opcional para búsquedas públicas
})

// Nombre del índice donde están almacenados los productos
export const PRODUCTS_INDEX = 'datafeed_2523969_2da_prueba'

// Interface para los productos de Meilisearch basada en las columnas del CSV
export interface MeilisearchProduct {
  id: string
  aw_deep_link: string
  product_name: string
  aw_product_id: string
  merchant_product_id: string
  merchant_image_url: string
  description: string
  merchant_category: string
  search_price: number
  product_price_old?: number
  rating?: number
}

// Interface para los parámetros de búsqueda
export interface SearchParams {
  query?: string
  category?: string
  limit?: number
  offset?: number
  hitsPerPage?: number
  page?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: string[]
}

// Interface para la respuesta de búsqueda
export interface SearchResponse {
  hits: MeilisearchProduct[]
  query: string
  processingTimeMs: number
  limit?: number
  offset?: number
  estimatedTotalHits?: number
  hitsPerPage?: number
  page?: number
  totalHits?: number
  totalPages?: number
}

/**
 * Buscar productos en Meilisearch
 */
export async function searchProducts(params: SearchParams): Promise<SearchResponse> {
  try {
    const index = meilisearchClient.index(PRODUCTS_INDEX)
    
    // Configurar filtros
    const filters: string[] = []
    
    // Filtro por categoría
    if (params.category) {
      filters.push(`merchant_category = "${params.category}"`)
    }
    
    // Filtro por rango de precios
    if (params.minPrice !== undefined) {
      filters.push(`search_price >= ${params.minPrice}`)
    }
    
    if (params.maxPrice !== undefined) {
      filters.push(`search_price <= ${params.maxPrice}`)
    }
    
    // Configurar opciones de búsqueda
    const searchOptions: any = {
      filter: filters.length > 0 ? filters : undefined,
      attributesToRetrieve: [
        'id',
        'aw_deep_link',
        'product_name',
        'aw_product_id',
        'merchant_product_id',
        'merchant_image_url',
        'description',
        'merchant_category',
        'search_price',
        'product_price_old',
        'rating'
      ],
      attributesToHighlight: ['product_name', 'description'],
      attributesToCrop: ['description'],
      cropLength: 100,
    }
    
    // Configurar paginación
    if (params.hitsPerPage !== undefined || params.page !== undefined) {
      // Usar hitsPerPage y page para obtener totalHits y totalPages
      searchOptions.hitsPerPage = params.hitsPerPage || 20
      searchOptions.page = params.page || 1
    } else {
      // Usar limit y offset para navegación simple anterior/siguiente
      searchOptions.limit = params.limit || 20
      searchOptions.offset = params.offset || 0
    }
    
    // Configurar ordenamiento
    if (params.sortBy) {
      searchOptions.sort = params.sortBy
    }
    
    // Realizar búsqueda
    let searchResults = await index.search(params.query || '', searchOptions)
    
    // Si no hay resultados y hay una query, intentar búsqueda más amplia
    if (searchResults.hits.length === 0 && params.query && params.query.trim()) {
      console.log('No results found, trying broader search...')
      // Intentar búsqueda sin filtros
      const broaderSearchOptions = {
        ...searchOptions,
        filter: undefined, // Remover filtros
      }
      searchResults = await index.search(params.query, broaderSearchOptions)
      
      // Si aún no hay resultados, intentar búsqueda parcial (primeras 3 letras)
      if (searchResults.hits.length === 0 && params.query.length > 3) {
        const partialQuery = params.query.substring(0, 3)
        searchResults = await index.search(partialQuery, broaderSearchOptions)
      }
    }
    
    // Limpiar y validar los datos de productos
    const cleanedHits = searchResults.hits.map((hit: any) => ({
      ...hit,
      search_price: parseFloat(hit.search_price) || 0,
      product_price_old: hit.product_price_old ? parseFloat(hit.product_price_old) : undefined,
      rating: hit.rating ? parseFloat(hit.rating) : undefined,
    }))

    return {
      hits: cleanedHits as MeilisearchProduct[],
      query: searchResults.query,
      processingTimeMs: searchResults.processingTimeMs,
      limit: searchResults.limit,
      offset: searchResults.offset,
      estimatedTotalHits: searchResults.estimatedTotalHits,
      hitsPerPage: searchResults.hitsPerPage,
      page: searchResults.page,
      totalHits: searchResults.totalHits,
      totalPages: searchResults.totalPages,
    }
  } catch (error) {
    console.error('Error searching products in Meilisearch:', error)
    
    // Si el índice no existe, devolver respuesta vacía en lugar de error
    if (error instanceof Error && error.message.includes('not found')) {
      return {
        hits: [],
        query: params.query || '',
        processingTimeMs: 0,
        limit: params.limit || 20,
        offset: params.offset || 0,
        estimatedTotalHits: 0,
      }
    }
    
    throw new Error('Failed to search products')
  }
}

/**
 * Obtener producto por ID
 */
export async function getProductById(id: string): Promise<MeilisearchProduct | null> {
  try {
    const index = meilisearchClient.index(PRODUCTS_INDEX)
    const product = await index.getDocument(id)
    return product as MeilisearchProduct
  } catch (error) {
    console.error('Error getting product by ID:', error)
    return null
  }
}

/**
 * Obtener categorías únicas de productos
 */
export async function getCategories(): Promise<string[]> {
  try {
    const index = meilisearchClient.index(PRODUCTS_INDEX)
    
    // Buscar todos los productos con limit mínimo para obtener las categorías
    const searchResults = await index.search('', {
      limit: 1000,
      attributesToRetrieve: ['merchant_category'],
    })
    
    // Extraer categorías únicas
    const categories = new Set<string>()
    searchResults.hits.forEach((hit: any) => {
      if (hit.merchant_category) {
        categories.add(hit.merchant_category)
      }
    })
    
    return Array.from(categories).sort()
  } catch (error) {
    console.error('Error getting categories:', error)
    
    // Si el índice no existe, devolver categorías por defecto
    if (error instanceof Error && error.message.includes('not found')) {
      return [
        'Electrodomésticos',
        'TV y Audio', 
        'Cocina',
        'Hogar',
        'Tecnología',
        'Móviles y Tablets',
        'Ropa y Accesorios',
        'Deporte',
        'Cosméticos',
        'Farmacia'
      ]
    }
    
    return []
  }
}

/**
 * Obtener productos relacionados basados en categoría
 */
export async function getRelatedProducts(productId: string, category: string, limit: number = 5): Promise<MeilisearchProduct[]> {
  try {
    const index = meilisearchClient.index(PRODUCTS_INDEX)
    
    const searchResults = await index.search('', {
      filter: [`merchant_category = "${category}"`, `id != "${productId}"`],
      limit,
      attributesToRetrieve: [
        'id',
        'aw_deep_link',
        'product_name',
        'merchant_image_url',
        'search_price',
        'product_price_old',
        'rating'
      ],
    })
    
    return searchResults.hits as MeilisearchProduct[]
  } catch (error) {
    console.error('Error getting related products:', error)
    return []
  }
}
