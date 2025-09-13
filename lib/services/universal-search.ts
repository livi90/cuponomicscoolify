import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createClientClient } from "@/lib/supabase/client"
import { NikeProductsService } from "./nike-products"

export interface UniversalSearchResult {
  nikeProducts: any[]
  hasNikeResults: boolean
  searchKeywords: string[]
  matchedKeywords: string[]
  confidence: number
}

export interface SearchOptions {
  query: string
  includeNike?: boolean
  maxNikeResults?: number
  minConfidence?: number
}

export class UniversalSearchService {
  private static keywordCache: Set<string> | null = null
  private static cacheTimestamp: number = 0
  private static readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutos

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
   * Extrae palabras clave únicas de todos los productos Nike en la base de datos
   */
  static async extractNikeKeywords(): Promise<Set<string>> {
    const now = Date.now()
    
    // Usar cache si está disponible y no ha expirado
    if (this.keywordCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.keywordCache
    }

    try {
      const supabase = await this.getSupabaseClient()
      
      // Obtener todos los nombres y descripciones de productos Nike activos
      const { data: products } = await supabase
        .from('nike_products')
        .select('product_name, description, category_name, merchant_name')
        .eq('is_active', true)

      const keywords = new Set<string>()

      // Palabras clave base de Nike
      const baseKeywords = [
        'nike', 'air', 'max', 'force', 'jordan', 'dunk', 'blazer', 
        'cortez', 'react', 'zoom', 'vapormax', 'lebron', 'kobe', 
        'kyrie', 'kd', 'kevin durant', 'retro', 'og', 'low', 'mid', 
        'high', 'flyknit', 'presto', 'huarache', 'pegasus', 'free',
        'revolution', 'downshifter', 'tanjun', 'roshe', 'benassi'
      ]

      baseKeywords.forEach(keyword => keywords.add(keyword.toLowerCase()))

      if (products) {
        products.forEach(product => {
          // Extraer palabras del nombre del producto
          if (product.product_name) {
            const nameWords = this.extractWordsFromText(product.product_name)
            nameWords.forEach(word => keywords.add(word))
          }

          // Extraer palabras de la descripción
          if (product.description) {
            const descWords = this.extractWordsFromText(product.description)
            descWords.forEach(word => keywords.add(word))
          }

          // Extraer palabras de la categoría
          if (product.category_name) {
            const catWords = this.extractWordsFromText(product.category_name)
            catWords.forEach(word => keywords.add(word))
          }
        })
      }

      // Filtrar palabras muy cortas o genéricas
      const filteredKeywords = new Set(
        Array.from(keywords).filter(keyword => 
          keyword.length >= 3 && 
          !this.isGenericWord(keyword)
        )
      )

      this.keywordCache = filteredKeywords
      this.cacheTimestamp = now

      console.log(`🔍 Extraídas ${filteredKeywords.size} palabras clave únicas de productos Nike`)
      
      return filteredKeywords

    } catch (error) {
      console.error('Error extrayendo palabras clave Nike:', error)
      // Retornar palabras clave base en caso de error
      return new Set(baseKeywords)
    }
  }

  /**
   * Extrae palabras relevantes de un texto
   */
  private static extractWordsFromText(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remover puntuación
      .split(/\s+/)
      .filter(word => word.length >= 3)
      .filter(word => !this.isGenericWord(word))
  }

  /**
   * Determina si una palabra es demasiado genérica
   */
  private static isGenericWord(word: string): boolean {
    const genericWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
      'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
      'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy',
      'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'para', 'con',
      'una', 'por', 'del', 'las', 'los', 'que', 'mas', 'como', 'pero', 'sin',
      'color', 'size', 'talla', 'zapatos', 'zapatillas', 'calzado', 'shoes',
      'sneakers', 'running', 'sport', 'deportivo', 'hombre', 'mujer', 'men',
      'women', 'unisex', 'adult', 'junior', 'kids', 'niño', 'niña'
    ])
    
    return genericWords.has(word.toLowerCase())
  }

  /**
   * Analiza una consulta de búsqueda y determina si debe incluir productos Nike
   */
  static async analyzeSearchQuery(query: string): Promise<{
    shouldIncludeNike: boolean
    matchedKeywords: string[]
    confidence: number
    extractedWords: string[]
  }> {
    try {
      const keywords = await this.extractNikeKeywords()
      const queryWords = this.extractWordsFromText(query)
      
      const matchedKeywords: string[] = []
      let totalMatches = 0

      // Buscar coincidencias exactas
      queryWords.forEach(word => {
        if (keywords.has(word.toLowerCase())) {
          matchedKeywords.push(word)
          totalMatches++
        }
      })

      // Buscar coincidencias parciales (para palabras compuestas)
      queryWords.forEach(queryWord => {
        keywords.forEach(keyword => {
          if (queryWord.includes(keyword) || keyword.includes(queryWord)) {
            if (!matchedKeywords.includes(queryWord)) {
              matchedKeywords.push(queryWord)
              totalMatches += 0.5 // Peso menor para coincidencias parciales
            }
          }
        })
      })

      // Calcular confianza basada en número de palabras coincidentes
      const confidence = Math.min((totalMatches / Math.max(queryWords.length, 1)) * 100, 100)
      const shouldIncludeNike = confidence >= 25 // Umbral del 25%

      return {
        shouldIncludeNike,
        matchedKeywords,
        confidence: Math.round(confidence),
        extractedWords: queryWords
      }

    } catch (error) {
      console.error('Error analizando consulta:', error)
      return {
        shouldIncludeNike: false,
        matchedKeywords: [],
        confidence: 0,
        extractedWords: []
      }
    }
  }

  /**
   * Búsqueda universal que incluye productos Nike cuando es relevante
   */
  static async universalSearch(options: SearchOptions): Promise<UniversalSearchResult> {
    const { query, includeNike = true, maxNikeResults = 12, minConfidence = 25 } = options

    const result: UniversalSearchResult = {
      nikeProducts: [],
      hasNikeResults: false,
      searchKeywords: [],
      matchedKeywords: [],
      confidence: 0
    }

    if (!includeNike || !query.trim()) {
      return result
    }

    try {
      // Analizar la consulta
      const analysis = await this.analyzeSearchQuery(query)
      
      result.searchKeywords = analysis.extractedWords
      result.matchedKeywords = analysis.matchedKeywords
      result.confidence = analysis.confidence

      console.log(`🔍 Análisis de búsqueda para "${query}":`, {
        shouldInclude: analysis.shouldIncludeNike,
        confidence: analysis.confidence,
        matched: analysis.matchedKeywords
      })

      // Si la confianza es suficiente, buscar productos Nike
      if (analysis.shouldIncludeNike && analysis.confidence >= minConfidence) {
        const nikeProducts = await NikeProductsService.searchProducts({
          query,
          sortBy: 'discount',
          limit: maxNikeResults
        })

        result.nikeProducts = nikeProducts
        result.hasNikeResults = nikeProducts.length > 0

        console.log(`✅ Encontrados ${nikeProducts.length} productos Nike para "${query}"`)
      }

      return result

    } catch (error) {
      console.error('Error en búsqueda universal:', error)
      return result
    }
  }

  /**
   * Obtiene estadísticas de palabras clave
   */
  static async getKeywordStats(): Promise<{
    totalKeywords: number
    sampleKeywords: string[]
    lastUpdated: Date
  }> {
    const keywords = await this.extractNikeKeywords()
    const keywordArray = Array.from(keywords)
    
    return {
      totalKeywords: keywords.size,
      sampleKeywords: keywordArray.slice(0, 20), // Primeras 20 como muestra
      lastUpdated: new Date(this.cacheTimestamp)
    }
  }

  /**
   * Limpia el cache de palabras clave (útil para testing)
   */
  static clearCache(): void {
    this.keywordCache = null
    this.cacheTimestamp = 0
  }
}
