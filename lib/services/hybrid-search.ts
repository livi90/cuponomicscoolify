import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createClientClient } from "@/lib/supabase/client"

export interface HybridSearchResult {
  mainProduct: ProcessedProduct | null
  alternativeProducts: ProcessedProduct[]
  totalResults: number
  source: 'nike_database' | 'serp_api' | 'hybrid'
  cacheHit: boolean
  searchMetadata: {
    query: string
    confidence: number
    matchedKeywords: string[]
    searchTime: number
  }
}

export interface ProcessedProduct {
  id: string
  title: string
  price: string
  originalPrice?: string
  rating?: number
  reviewCount?: number
  store: string
  storeId: string
  imageUrl: string
  productUrl: string
  affiliateUrl: string
  hasFreeship: boolean
  hasDiscount: boolean
  discountPercentage?: number
  couponCode?: string
  availability: 'in_stock' | 'out_of_stock' | 'limited'
  source: 'nike' | 'serp_api'
  relevanceScore: number
}

export interface SearchOptions {
  query: string
  maxResults?: number
  minConfidence?: number
}

export class HybridSearchService {

  /**
   * Búsqueda híbrida principal
   */
  static async hybridSearch(options: SearchOptions): Promise<HybridSearchResult> {
    const startTime = Date.now()
    const { query, maxResults = 20, minConfidence = 25 } = options

    try {
      // Analizar si la búsqueda es relevante para Nike
      const nikeAnalysis = await this.analyzeNikeRelevance(query)
      
      let mainProduct: ProcessedProduct | null = null
      let alternativeProducts: ProcessedProduct[] = []
      let source: 'nike_database' | 'serp_api' | 'hybrid' = 'serp_api'

      if (nikeAnalysis.shouldInclude && nikeAnalysis.confidence >= minConfidence) {
        // Buscar productos Nike de la base de datos
        const nikeProducts = await this.searchNikeProducts(query, Math.min(maxResults, 8))
        
        if (nikeProducts.length > 0) {
          // Ordenar productos Nike por score de relevancia
          const sortedNikeProducts = nikeProducts.sort((a, b) => b.relevanceScore - a.relevanceScore)
          
          // El producto principal será el de mejor score
          mainProduct = sortedNikeProducts[0]
          
          // Obtener alternativas de SERP API para el mismo producto
          const alternatives = await this.searchSerpAlternatives(query, 3)
          alternativeProducts = alternatives
          
          source = 'hybrid'
        }
      }

      // Si no hay productos Nike o no son suficientes, usar solo SERP API
      if (!mainProduct) {
        const serpResults = await this.searchSerpProducts(query, maxResults)
        
        if (serpResults.length > 0) {
          // Ordenar por score de relevancia (más alto primero)
          const sortedResults = serpResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
          
          // El producto principal será el de mejor score
          mainProduct = sortedResults[0]
          
          // Las alternativas serán los siguientes con mejor score
          alternativeProducts = sortedResults.slice(1, 4)
          
          source = 'serp_api'
        }
      }

      const result: HybridSearchResult = {
        mainProduct,
        alternativeProducts,
        totalResults: (mainProduct ? 1 : 0) + alternativeProducts.length,
        source,
        cacheHit: false,
        searchMetadata: {
          query,
          confidence: nikeAnalysis.confidence,
          matchedKeywords: nikeAnalysis.matchedKeywords,
          searchTime: Date.now() - startTime
        }
      }

      return result

    } catch (error) {
      console.error('Error en búsqueda híbrida:', error)
      
      // Fallback a SERP API
      try {
        const serpResults = await this.searchSerpProducts(query, maxResults)
        const mainProduct = serpResults[0] || null
        const alternativeProducts = serpResults.slice(1, 4)

        return {
          mainProduct,
          alternativeProducts,
          totalResults: (mainProduct ? 1 : 0) + alternativeProducts.length,
          source: 'serp_api',
          cacheHit: false,
          searchMetadata: {
            query,
            confidence: 0,
            matchedKeywords: [],
            searchTime: Date.now() - startTime
          }
        }
      } catch (fallbackError) {
        console.error('Error en fallback SERP API:', fallbackError)
        return {
          mainProduct: null,
          alternativeProducts: [],
          totalResults: 0,
          source: 'serp_api',
          cacheHit: false,
          searchMetadata: {
            query,
            confidence: 0,
            matchedKeywords: [],
            searchTime: Date.now() - startTime
          }
        }
      }
    }
  }

  /**
   * Analiza si una búsqueda es relevante para productos Nike
   */
  private static async analyzeNikeRelevance(query: string): Promise<{
    shouldInclude: boolean
    confidence: number
    matchedKeywords: string[]
  }> {
    const nikeKeywords = [
      'nike', 'air', 'max', 'force', 'jordan', 'dunk', 'blazer', 'cortez',
      'react', 'zoom', 'vapormax', 'lebron', 'kobe', 'kyrie', 'kd',
      'kevin durant', 'retro', 'og', 'low', 'mid', 'high', 'flyknit',
      'presto', 'huarache', 'pegasus', 'free', 'revolution', 'downshifter',
      'tanjun', 'roshe', 'benassi', 'tenis', 'zapatillas', 'deportivas'
    ]

    const queryWords = query.toLowerCase().split(/\s+/)
    const matchedKeywords = queryWords.filter(word => 
      nikeKeywords.some(keyword => word.includes(keyword))
    )

    const confidence = Math.round((matchedKeywords.length / queryWords.length) * 100)
    const shouldInclude = confidence >= 25

    return {
      shouldInclude,
      confidence,
      matchedKeywords
    }
  }

  /**
   * Busca productos Nike en la base de datos
   */
  private static async searchNikeProducts(query: string, limit: number): Promise<ProcessedProduct[]> {
    try {
      const supabase = await this.getSupabaseClient()
      
      const { data: products, error } = await supabase
        .from('nike_products')
        .select('*')
        .eq('is_active', true)
        .or(`product_name.ilike.%${query}%,description.ilike.%${query}%,category_name.ilike.%${query}%`)
        .order('discount_percentage', { ascending: false })
        .order('rating', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error buscando productos Nike:', error)
        return []
      }

      const processedProducts = (products || []).map(product => ({
        id: product.aw_product_id || `nike-${product.id}`,
        title: product.product_name,
        price: product.display_price || `${product.search_price?.toFixed(2) || '0'} €`,
        originalPrice: product.original_price ? `${product.original_price.toFixed(2)} €` : undefined,
        rating: product.rating || 4.0 + Math.random() * 1,
        reviewCount: Math.floor(Math.random() * 500) + 100,
        store: product.merchant_name || 'Nike',
        storeId: 'nike',
        imageUrl: product.merchant_image_url || product.aw_image_url || '/placeholder.jpg',
        productUrl: product.merchant_deep_link || product.aw_deep_link || '#',
        affiliateUrl: product.aw_deep_link || product.merchant_deep_link,
        hasFreeship: product.delivery_cost === 0 || Math.random() > 0.3,
        hasDiscount: !!(product.discount_percentage && product.discount_percentage > 0),
        discountPercentage: product.discount_percentage || undefined,
        couponCode: undefined, // Se puede implementar búsqueda de cupones
        availability: (product.stock_status === 'in_stock' ? 'in_stock' : 
                     product.stock_status === 'out_of_stock' ? 'out_of_stock' : 'limited') as 'in_stock' | 'out_of_stock' | 'limited',
        source: 'nike' as const,
        relevanceScore: this.calculateRelevanceScore(product, query)
      }))

      // Ordenar por score de relevancia (más alto primero)
      return processedProducts.sort((a, b) => b.relevanceScore - a.relevanceScore)
    } catch (error) {
      console.error('Error en searchNikeProducts:', error)
      return []
    }
  }

  /**
   * Intenta decodificar enlaces encriptados de Google Shopping
   */
  private static decodeGoogleShoppingLink(encryptedLink: string): string | null {
    try {
      // Intentar extraer el enlace real de los parámetros de Google Shopping
      const url = new URL(encryptedLink)
      
      // Buscar parámetros comunes que contengan el enlace real
      const possibleParams = ['adurl', 'url', 'link', 'target', 'dest']
      
      for (const param of possibleParams) {
        const value = url.searchParams.get(param)
        if (value && value.startsWith('http')) {
          return decodeURIComponent(value)
        }
      }
      
      // Si no se encuentra en los parámetros, intentar extraer de la URL base
      if (url.hostname.includes('google.com') && url.pathname.includes('/aclk')) {
        // Para enlaces de Google Ads, intentar construir una búsqueda directa
        return null // Devolver null para que se use el fallback
      }
      
      return null
    } catch (error) {
      console.warn('Error decodificando enlace de Google Shopping:', error)
      return null
    }
  }

  /**
   * Busca productos usando SERP API
   */
  private static async searchSerpProducts(query: string, limit: number): Promise<ProcessedProduct[]> {
    try {
      const SERPAPI_KEY = process.env.SERPAPI_KEY
      if (!SERPAPI_KEY) {
        console.warn('SERPAPI_KEY no configurada')
        return []
      }

      // Obtener información de tiendas para generar enlaces de afiliado
      const storeInfo = await this.getStoreAffiliateInfo()
      console.log('Información de tiendas obtenida:', storeInfo)

      const serpApiUrl = 'https://serpapi.com/search.json'
      const params = new URLSearchParams({
        engine: 'google_shopping',
        q: query,
        api_key: SERPAPI_KEY,
        gl: 'es',
        hl: 'es',
        num: limit.toString(),
        // Parámetros adicionales para obtener enlaces directos
        tbm: 'shop',
        safe: 'active'
      })

      const response = await fetch(`${serpApiUrl}?${params}`)
      
      if (!response.ok) {
        throw new Error(`SerpAPI error: ${response.status}`)
      }

      const data = await response.json()
      const products: any[] = data.shopping_results || []

      return products.map((product, index) => {
        const hasDiscount = !!(product.original_price && product.sale_price)
        let discountPercentage = 0
        
        if (hasDiscount && product.original_price && product.sale_price) {
          const original = parseFloat(product.original_price.replace(/[€$,]/g, ''))
          const sale = parseFloat(product.sale_price.replace(/[€$,]/g, ''))
          discountPercentage = Math.round(((original - sale) / original) * 100)
        }

        // Validar y procesar la URL del producto
        let productUrl = product.link || product.product_link || product.url || product.serpapi_product_api || '#'
        
        // Verificar si es un enlace encriptado de Google Shopping
        const isGoogleShoppingLink = productUrl.includes('google.com/aclk') || 
                                   productUrl.includes('googleadservices.com') ||
                                   productUrl.includes('googlesyndication.com')
        
        // Intentar decodificar enlaces encriptados
        if (isGoogleShoppingLink) {
          const decodedLink = this.decodeGoogleShoppingLink(productUrl)
          if (decodedLink) {
            productUrl = decodedLink
          }
        }
        
        if (productUrl === '#' || !productUrl || productUrl.startsWith('localhost') || isGoogleShoppingLink) {
          // Intentar construir una URL de búsqueda del producto específico en la tienda
          const storeName = product.source?.toLowerCase() || ''
          const productTitle = encodeURIComponent(product.title)
          
          if (storeName.includes('el corte inglés') || storeName.includes('elcorteingles')) {
            productUrl = `https://www.elcorteingles.es/search/?s=${productTitle}`
          } else if (storeName.includes('amazon')) {
            productUrl = `https://www.amazon.es/s?k=${productTitle}`
          } else if (storeName.includes('fnac')) {
            productUrl = `https://www.fnac.es/SearchResult/ResultList.aspx?SC=${productTitle}`
          } else if (storeName.includes('mediamarkt')) {
            productUrl = `https://www.mediamarkt.es/es/search.html?query=${productTitle}`
          } else if (storeName.includes('walmart')) {
            productUrl = `https://www.walmart.com/search?q=${productTitle}`
          } else if (storeName.includes('target')) {
            productUrl = `https://www.target.com/s?searchTerm=${productTitle}`
          } else if (storeName.includes('best buy') || storeName.includes('bestbuy')) {
            productUrl = `https://www.bestbuy.com/site/searchpage.jsp?st=${productTitle}`
          } else {
            // Usar búsqueda de Google Shopping como fallback
            productUrl = `https://www.google.com/search?tbm=shop&q=${productTitle}`
          }
        }

        const affiliateUrl = this.generateAffiliateUrl(productUrl, product.source || 'Tienda Online', storeInfo)
        console.log(`Producto ${index}: ${product.title}`)
        console.log(`  - Tienda: ${product.source}`)
        console.log(`  - URL original: ${product.link || 'N/A'}`)
        console.log(`  - URL procesada: ${productUrl}`)
        console.log(`  - Enlace afiliado: ${affiliateUrl}`)
        
        return {
          id: `serp-${index}`,
          title: product.title,
          price: product.sale_price || product.price,
          originalPrice: product.original_price,
          rating: product.rating || 4.0 + Math.random() * 1,
          reviewCount: product.reviews || Math.floor(Math.random() * 500) + 100,
          store: product.source || 'Tienda Online',
          storeId: this.extractStoreId(product.source),
          imageUrl: product.thumbnail || '/placeholder.jpg',
          productUrl: productUrl,
          affiliateUrl: affiliateUrl,
          hasFreeship: Math.random() > 0.7,
          hasDiscount,
          discountPercentage: hasDiscount ? discountPercentage : undefined,
          couponCode: undefined,
          availability: 'in_stock',
          source: 'serp_api' as const,
          relevanceScore: this.calculateSerpRelevanceScore(product, query)
        }
      })
    } catch (error) {
      console.error('Error en searchSerpProducts:', error)
      return []
    }
  }

  /**
   * Busca alternativas de SERP API para productos Nike
   */
  private static async searchSerpAlternatives(query: string, limit: number): Promise<ProcessedProduct[]> {
    try {
      // Buscar productos similares pero de otras marcas/tiendas
      const alternativeQuery = this.generateAlternativeQuery(query)
      return await this.searchSerpProducts(alternativeQuery, limit)
    } catch (error) {
      console.error('Error buscando alternativas SERP:', error)
      return []
    }
  }

  /**
   * Genera una query alternativa para buscar productos similares
   */
  private static generateAlternativeQuery(query: string): string {
    // Reemplazar marcas Nike con términos genéricos
    const replacements: Record<string, string> = {
      'nike': 'zapatillas deportivas',
      'air max': 'zapatillas deportivas',
      'jordan': 'zapatillas deportivas',
      'dunk': 'zapatillas deportivas',
      'blazer': 'zapatillas deportivas'
    }

    let alternativeQuery = query.toLowerCase()
    
    for (const [brand, replacement] of Object.entries(replacements)) {
      alternativeQuery = alternativeQuery.replace(new RegExp(brand, 'gi'), replacement)
    }

    return alternativeQuery
  }

  /**
   * Calcula score de relevancia para productos Nike
   */
  private static calculateRelevanceScore(product: any, query: string): number {
    let score = 0
    
    // Score por coincidencia exacta en nombre (más importante)
    if (product.product_name?.toLowerCase().includes(query.toLowerCase())) {
      score += 100
    }
    
    // Score por coincidencia en descripción
    if (product.description?.toLowerCase().includes(query.toLowerCase())) {
      score += 50
    }
    
    // Score por descuento (muy importante para Nike)
    if (product.discount_percentage && product.discount_percentage > 0) {
      score += Math.min(product.discount_percentage * 3, 80) // Máximo 80 puntos por descuento
    }
    
    // Score por rating
    if (product.rating) {
      const rating = parseFloat(product.rating)
      if (rating >= 4.5) score += 40
      else if (rating >= 4.0) score += 30
      else if (rating >= 3.5) score += 20
      else if (rating >= 3.0) score += 10
    }
    
    // Score por precio (productos más baratos tienen mayor score)
    if (product.search_price) {
      const price = parseFloat(product.search_price)
      if (price > 0) {
        if (price < 50) score += 30
        else if (price < 100) score += 25
        else if (price < 200) score += 20
        else if (price < 500) score += 15
        else score += 10
      }
    }
    
    // Score por stock (disponibilidad)
    if (product.stock_status === 'in_stock') {
      score += 25
    } else if (product.stock_status === 'limited') {
      score += 15
    }
    
    // Score por envío gratis
    if (product.delivery_cost === 0) {
      score += 20
    }
    
    // Bonus por coincidencia exacta de palabras clave
    const queryWords = query.toLowerCase().split(/\s+/)
    const productNameWords = product.product_name?.toLowerCase().split(/\s+/) || []
    const exactMatches = queryWords.filter(word => 
      productNameWords.some((nameWord: string) => nameWord === word)
    )
    score += exactMatches.length * 15
    
    return Math.round(score)
  }

  /**
   * Calcula score de relevancia para productos SERP
   */
  private static calculateSerpRelevanceScore(product: any, query: string): number {
    let score = 0
    
    // Score por coincidencia en título (más importante)
    if (product.title?.toLowerCase().includes(query.toLowerCase())) {
      score += 100
    }
    
    // Score por precio (productos más baratos tienen mayor score)
    if (product.price) {
      try {
        const price = parseFloat(product.price.replace(/[€$,]/g, ''))
        if (price > 0) {
          // Fórmula inversa: precios más bajos = mayor score
          if (price < 20) score += 50
          else if (price < 50) score += 40
          else if (price < 100) score += 30
          else if (price < 200) score += 20
          else if (price < 500) score += 10
          else score += 5
        }
      } catch (error) {
        console.warn('Error parseando precio:', error)
      }
    }
    
    // Score por descuento
    if (product.original_price && product.sale_price) {
      try {
        const original = parseFloat(product.original_price.replace(/[€$,]/g, ''))
        const sale = parseFloat(product.sale_price.replace(/[€$,]/g, ''))
        if (original > sale && original > 0) {
          const discountPercentage = ((original - sale) / original) * 100
          score += Math.min(discountPercentage * 2, 50) // Máximo 50 puntos por descuento
        }
      } catch (error) {
        console.warn('Error calculando descuento:', error)
      }
    }
    
    // Score por rating (más importante)
    if (product.rating) {
      const rating = parseFloat(product.rating)
      if (rating >= 4.5) score += 40
      else if (rating >= 4.0) score += 30
      else if (rating >= 3.5) score += 20
      else if (rating >= 3.0) score += 10
    }
    
    // Score por número de reviews (más reviews = más confiable)
    if (product.reviews) {
      const reviews = parseInt(product.reviews)
      if (reviews >= 1000) score += 25
      else if (reviews >= 500) score += 20
      else if (reviews >= 100) score += 15
      else if (reviews >= 50) score += 10
      else if (reviews >= 10) score += 5
    }
    
    // Score por tienda afiliada (MUY IMPORTANTE)
    const storeName = product.source?.toLowerCase() || ''
    if (storeName.includes('el corte inglés') || storeName.includes('elcorteingles')) {
      score += 80 // Máxima prioridad para El Corte Inglés
    } else if (storeName.includes('amazon')) {
      score += 70 // Alta prioridad para Amazon
    } else if (storeName.includes('ebay')) {
      score += 60 // Prioridad alta para eBay
    } else if (storeName.includes('fnac') || storeName.includes('mediamarkt') || 
               storeName.includes('carrefour') || storeName.includes('pccomponentes')) {
      score += 30 // Prioridad media para tiendas conocidas
    }
    
    // Score por disponibilidad (stock)
    if (product.availability === 'in_stock' || product.availability === 'available') {
      score += 20
    } else if (product.availability === 'limited') {
      score += 10
    }
    
    // Score por envío gratis (si se puede detectar)
    if (product.shipping === 'free' || product.shipping === 'gratis' || 
        product.shipping_cost === '0' || product.shipping_cost === 0) {
      score += 25
    }
    
    // Score por marca reconocida
    const recognizedBrands = ['nike', 'adidas', 'apple', 'samsung', 'sony', 'lg', 'canon', 'nikon', 'dell', 'hp', 'lenovo']
    const titleLower = product.title?.toLowerCase() || ''
    for (const brand of recognizedBrands) {
      if (titleLower.includes(brand)) {
        score += 15
        break // Solo una marca por producto
      }
    }
    
    // Score por novedad (productos más nuevos)
    if (product.year || product.model_year) {
      const currentYear = new Date().getFullYear()
      const productYear = parseInt(product.year || product.model_year)
      if (productYear >= currentYear - 1) {
        score += 20
      } else if (productYear >= currentYear - 3) {
        score += 10
      }
    }
    
    // Bonus por coincidencia exacta de palabras clave
    const queryWords = query.toLowerCase().split(/\s+/)
    const titleWords = product.title?.toLowerCase().split(/\s+/) || []
    const exactMatches = queryWords.filter(word => 
      titleWords.some((titleWord: string) => titleWord === word)
    )
    score += exactMatches.length * 10
    
    return Math.round(score)
  }

  /**
   * Extrae ID de tienda del nombre de la fuente
   */
  private static extractStoreId(source: string): string {
    if (!source) return 'unknown'
    
    const storeMap: Record<string, string> = {
      'amazon': 'amazon',
      'el corte inglés': 'elcorteingles',
      'carrefour': 'carrefour',
      'mediamarkt': 'mediamarkt',
      'pccomponentes': 'pccomponentes',
      'fnac': 'fnac',
      'zara': 'zara',
      'h&m': 'hm',
      'pull&bear': 'pullbear'
    }
    
    const sourceLower = source.toLowerCase()
    for (const [store, id] of Object.entries(storeMap)) {
      if (sourceLower.includes(store)) {
        return id
      }
    }
    
    return 'other'
  }

  /**
   * Obtiene el cliente Supabase apropiado
   */
  private static async getSupabaseClient() {
    if (typeof window === 'undefined') {
      return await createServerClient()
    } else {
      return createClientClient()
    }
  }







  /**
   * Obtiene información de tiendas para generar enlaces de afiliado
   */
  private static async getStoreAffiliateInfo(): Promise<{ [key: string]: any }> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)

      if (error) {
        console.error('Error obteniendo información de tiendas de afiliados:', error)
        return {}
      }

      const storeInfo: { [key: string]: any } = {}
      if (data) {
        console.log('Datos de tiendas obtenidos de Supabase:', data)
        
        data.forEach((store: any) => {
          // Mapear nombres de tiendas a diferentes variaciones
          const storeName = store.name?.toLowerCase() || ''
          console.log(`Procesando tienda: ${store.name} (${storeName}) - Red: ${store.affiliate_network}`)
          
          if (storeName.includes('el corte inglés') || storeName.includes('elcorteingles')) {
            storeInfo['el corte inglés'] = store
            storeInfo['elcorteingles'] = store
            storeInfo['corte inglés'] = store
            console.log(`Mapeada tienda AWIN: El Corte Inglés`)
          } else if (storeName.includes('amazon')) {
            storeInfo['amazon'] = store
            storeInfo['amazon.es'] = store
            console.log(`Mapeada tienda Amazon`)
          } else if (storeName.includes('ebay')) {
            storeInfo['ebay'] = store
            storeInfo['ebay.es'] = store
            console.log(`Mapeada tienda eBay`)
          } else if (storeName.includes('fnac')) {
            storeInfo['fnac'] = store
            storeInfo['fnac.es'] = store
            console.log(`Mapeada tienda FNAC`)
          } else if (storeName.includes('mediamarkt')) {
            storeInfo['mediamarkt'] = store
            storeInfo['mediamarkt.es'] = store
            console.log(`Mapeada tienda MediaMarkt`)
          } else {
            storeInfo[storeName] = store
            console.log(`Mapeada tienda genérica: ${storeName}`)
          }
        })
      }
      
      console.log('Mapeo final de tiendas:', storeInfo)
      return storeInfo
    } catch (error) {
      console.error('Error en getStoreAffiliateInfo:', error)
      return {}
    }
  }

  /**
   * Genera enlaces de afiliado para diferentes redes
   */
  private static generateAffiliateUrl(originalUrl: string, storeName: string, storeInfo: { [key: string]: any }): string {
    try {
      // Validar que la URL original sea válida
      if (!originalUrl || originalUrl === '#' || originalUrl.startsWith('localhost')) {
        console.warn('URL inválida para enlace de afiliado:', originalUrl)
        return originalUrl
      }

      // Limpiar y normalizar el nombre de la tienda
      const storeLower = storeName.toLowerCase().trim()
      let store = storeInfo[storeLower]
      
      // Si no se encuentra directamente, buscar por variaciones del nombre
      if (!store) {
        if (storeLower.includes('el corte inglés') || storeLower.includes('elcorteingles') || storeLower.includes('corte inglés')) {
          store = storeInfo['el corte inglés'] || storeInfo['elcorteingles']
        } else if (storeLower.includes('amazon')) {
          store = storeInfo['amazon']
        } else if (storeLower.includes('ebay')) {
          store = storeInfo['ebay']
        } else if (storeLower.includes('fnac')) {
          store = storeInfo['fnac']
        } else if (storeLower.includes('mediamarkt')) {
          store = storeInfo['mediamarkt']
        }
      }
      
      if (!store) {
        console.warn(`No se encontró información de afiliado para la tienda: ${storeName} (${storeLower})`)
        console.log('Tiendas disponibles en storeInfo:', Object.keys(storeInfo))
        console.log('Contenido completo de storeInfo:', storeInfo)
        return originalUrl
      }

      console.log(`Generando enlace de afiliado para ${storeName}:`, store)

      // AWIN (El Corte Inglés, FNAC, MediaMarkt, etc.)
      if (store.affiliate_network === 'AWIN' && store.publisherId && store.advertiserId) {
        console.log(`Generando enlace AWIN para ${storeName} con publisherId: ${store.publisherId}, advertiserId: ${store.advertiserId}`)
        return this.generateAwinAffiliateUrl(originalUrl, store.publisherId, store.advertiserId)
      }
      
      // eBay Smart Link (se maneja automáticamente con el script)
      if (store.affiliate_network === 'EBAY') {
        console.log(`eBay Smart Link para ${storeName} - usando URL original`)
        return originalUrl // El script de eBay se encarga automáticamente
      }
      
      // Amazon Associates
      if (store.affiliate_network === 'AMAZON' && store.publisherId) {
        console.log(`Generando enlace Amazon para ${storeName} con publisherId: ${store.publisherId}`)
        return this.generateAmazonAffiliateUrl(originalUrl, store.publisherId)
      }
      
      // Si no es una red de afiliados reconocida, usar URL original
      console.log(`Tienda ${storeName} no tiene red de afiliados configurada, usando URL original`)
      return originalUrl
    } catch (error) {
      console.error('Error generando enlace de afiliado:', error)
      return originalUrl
    }
  }

  /**
   * Genera enlaces de afiliado de AWIN
   */
  private static generateAwinAffiliateUrl(originalUrl: string, publisherId: string, advertiserId: string): string {
    try {
      // Validar URL
      if (!originalUrl || originalUrl === '#' || originalUrl.startsWith('localhost')) {
        console.warn('URL inválida para enlace AWIN:', originalUrl)
        return originalUrl
      }

      // Validar que tengamos los IDs necesarios
      if (!publisherId || !advertiserId) {
        console.error('Faltan publisherId o advertiserId para generar enlace AWIN')
        return originalUrl
      }

      // Formato oficial de enlace de afiliado de AWIN según documentación
      // https://developer.awin.com/apidocs/generatelink
      const affiliateUrl = `https://www.awin1.com/cread.php?awinmid=${advertiserId}&awinaffid=${publisherId}&clicktracker=&url=${encodeURIComponent(originalUrl)}`
      
      console.log(`Enlace AWIN generado para ${originalUrl}:`)
      console.log(`- publisherId: ${publisherId}`)
      console.log(`- advertiserId: ${advertiserId}`)
      console.log(`- URL final: ${affiliateUrl}`)
      
      return affiliateUrl
    } catch (error) {
      console.error('Error generando enlace AWIN:', error)
      return originalUrl
    }
  }

  /**
   * Genera enlaces de afiliado de Amazon
   */
  private static generateAmazonAffiliateUrl(originalUrl: string, publisherId: string): string {
    try {
      // Validar URL
      if (!originalUrl || originalUrl === '#' || originalUrl.startsWith('localhost')) {
        console.warn('URL inválida para enlace Amazon:', originalUrl)
        return originalUrl
      }

      // Validar que tengamos el publisherId
      if (!publisherId) {
        console.error('Falta publisherId para generar enlace Amazon')
        return originalUrl
      }

      // Formato básico de enlace de afiliado de Amazon
      const url = new URL(originalUrl)
      url.searchParams.set('tag', publisherId)
      const affiliateUrl = url.toString()
      
      console.log(`Enlace Amazon generado: ${affiliateUrl}`)
      return affiliateUrl
    } catch (error) {
      console.error('Error generando enlace Amazon:', error)
      return originalUrl
    }
  }
}
