import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { NikeProductsService } from "@/lib/services/nike-products"
import { UniversalSearchService } from "@/lib/services/universal-search"

const SERPAPI_KEY = "d8afca09702be142840abab9a13ce9300018138f2aeadf89909d8468ecd519e5"

interface SerpApiProduct {
  position: number
  title: string
  link: string
  price?: string
  rating?: number
  reviews?: number
  thumbnail?: string
  source?: string
  original_price?: string
  sale_price?: string
  shipping?: string
}

interface ProcessedProduct {
  id: string
  title: string
  price: string
  originalPrice?: string
  rating: number
  reviewCount: number
  store: string
  storeId?: string
  imageUrl: string
  productUrl: string
  affiliateUrl?: string
  hasFreeship: boolean
  hasDiscount: boolean
  discountPercentage?: number
  couponCode?: string
  availability: "in_stock" | "limited" | "out_of_stock"
}

async function generateAffiliateLink(originalUrl: string, storeId?: string): Promise<string> {
  try {
    const supabase = await createClient()
    
    // Buscar información de la tienda en la base de datos
    const { data: store } = await supabase
      .from('stores')
      .select('*')
      .or(`website.ilike.%${getDomainFromUrl(originalUrl)}%,name.ilike.%${storeId}%`)
      .single()

    if (!store) {
      return originalUrl
    }

    // Si la tienda usa AWIN
    if (store.red_afiliados === 'AWIN' && store.publisherId && store.advertiserId) {
      const awinUrl = await generateAwinLink(originalUrl, store.publisherId, store.advertiserId)
      return awinUrl || originalUrl
    }

    // Para otras redes de afiliación, añadir lógica aquí
    return originalUrl
  } catch (error) {
    console.error('Error generating affiliate link:', error)
    return originalUrl
  }
}

async function generateAwinLink(originalUrl: string, publisherId: string, advertiserId: string): Promise<string | null> {
  try {
    const awinApiUrl = 'https://api.awin.com/publishers/573651/links'
    const oauthToken = 'a004bf81-8fef-466a-9179-2a1468cff147'
    
    const response = await fetch(awinApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${oauthToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: originalUrl,
        advertiserId: advertiserId,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.clickUrl || null
    }
    
    return null
  } catch (error) {
    console.error('Error generating AWIN link:', error)
    return null
  }
}

function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return ''
  }
}

async function getCouponForStore(storeId: string): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    const { data: coupon } = await supabase
      .from('coupons')
      .select('code')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .eq('is_verified', true)
      .not('code', 'is', null)
      .limit(1)
      .single()

    return coupon?.code || null
  } catch (error) {
    console.error('Error getting coupon:', error)
    return null
  }
}

// Función para convertir productos Nike al formato ProcessedProduct
async function convertNikeToProcessedProducts(nikeProducts: any[]): Promise<ProcessedProduct[]> {
  const processedProducts: ProcessedProduct[] = await Promise.all(
    nikeProducts.map(async (product, index) => {
      const hasDiscount = (product.discount_percentage && product.discount_percentage > 0) || 
                         (product.calculated_discount && product.calculated_discount > 0) ||
                         (product.original_price && product.search_price && product.original_price > product.search_price)
      
      let discountPercentage = 0
      let originalPrice: string | undefined
      
      if (hasDiscount) {
        if (product.calculated_discount && product.calculated_discount > 0) {
          discountPercentage = product.calculated_discount
        } else if (product.discount_percentage && product.discount_percentage > 0) {
          discountPercentage = product.discount_percentage
        } else if (product.original_price && product.search_price && product.original_price > product.search_price) {
          discountPercentage = Math.round(((product.original_price - product.search_price) / product.original_price) * 100)
        }
        originalPrice = product.original_price ? `${product.original_price.toFixed(2)} €` : undefined
      }

      // Buscar cupón para Nike
      const couponCode = await getCouponForStore('nike')
      
      return {
        id: product.aw_product_id || `nike-${index}`,
        title: product.product_name,
        price: product.display_price || (product.search_price ? `${product.search_price.toFixed(2)} €` : '0 €'),
        originalPrice,
        rating: 4.0 + Math.random() * 1, // Rating aleatorio entre 4-5
        reviewCount: Math.floor(Math.random() * 500) + 100,
        store: product.merchant_name || 'Nike',
        storeId: 'nike',
        imageUrl: product.merchant_image_url || product.aw_image_url || '/placeholder.jpg',
        productUrl: product.merchant_deep_link || product.aw_deep_link || '#',
        affiliateUrl: product.aw_deep_link || product.merchant_deep_link, // Ya es un enlace de afiliado
        hasFreeship: product.delivery_cost === 0 || Math.random() > 0.3,
        hasDiscount,
        discountPercentage: hasDiscount ? discountPercentage : undefined,
        couponCode,
        availability: product.stock_status === 'in_stock' ? 'in_stock' : 
                     product.stock_status === 'out_of_stock' ? 'out_of_stock' : 'limited',
      }
    })
  )

  return processedProducts
}

/**
 * Intenta decodificar enlaces encriptados de Google Shopping
 */
function decodeGoogleShoppingLink(encryptedLink: string): string | null {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    // Usar búsqueda universal para detectar si incluir productos Nike
    const universalResult = await UniversalSearchService.universalSearch({
      query,
      includeNike: true,
      maxNikeResults: 20,
      minConfidence: 25
    })
    
    if (universalResult.hasNikeResults && universalResult.nikeProducts.length > 0) {
      console.log(`🔍 Búsqueda Nike detectada: "${query}" (confianza: ${universalResult.confidence}%)`)
      console.log(`🎯 Palabras coincidentes: ${universalResult.matchedKeywords.join(', ')}`)
      
      const processedProducts = await convertNikeToProcessedProducts(universalResult.nikeProducts)
      
      return NextResponse.json({
        query,
        results: processedProducts,
        totalResults: processedProducts.length,
        source: 'nike_database',
        message: `Resultados desde base de datos Nike (${universalResult.confidence}% relevancia)`,
        metadata: {
          confidence: universalResult.confidence,
          matchedKeywords: universalResult.matchedKeywords,
          searchKeywords: universalResult.searchKeywords
        }
      })
    }
    
    if (universalResult.confidence > 0) {
      console.log(`⚠️ Productos Nike detectados pero insuficientes (confianza: ${universalResult.confidence}%) - Fallback a SERP API`)
    }

    // Fallback a SERP API para búsquedas que no son de Nike o cuando no hay resultados de Nike
    console.log(`🌐 Usando SERP API para: "${query}"`)
    
    const serpApiUrl = `https://serpapi.com/search.json`
    const params = new URLSearchParams({
      engine: 'google_shopping',
      q: query,
      api_key: SERPAPI_KEY,
      gl: 'es', // País España
      hl: 'es', // Idioma español
      num: '20', // Número de resultados
      // Parámetros adicionales para obtener enlaces directos
      tbm: 'shop',
      safe: 'active'
    })

    const response = await fetch(`${serpApiUrl}?${params}`)
    
    if (!response.ok) {
      throw new Error(`SerpAPI error: ${response.status}`)
    }

    const data = await response.json()
    const products: SerpApiProduct[] = data.shopping_results || []

    // Procesar y enriquecer los resultados de SERP API
    const processedProducts: ProcessedProduct[] = await Promise.all(
      products.map(async (product, index) => {
        // Procesar la URL del producto para manejar enlaces encriptados
        let productUrl = product.link || product.product_link || product.url || product.serpapi_product_api || '#'
        
        // Verificar si es un enlace encriptado de Google Shopping
        const isGoogleShoppingLink = productUrl.includes('google.com/aclk') || 
                                   productUrl.includes('googleadservices.com') ||
                                   productUrl.includes('googlesyndication.com')
        
        // Intentar decodificar enlaces encriptados
        if (isGoogleShoppingLink) {
          const decodedLink = decodeGoogleShoppingLink(productUrl)
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
        
        const domain = getDomainFromUrl(productUrl)
        const storeId = mapDomainToStoreId(domain)
        const affiliateUrl = await generateAffiliateLink(productUrl, storeId)
        const couponCode = storeId ? await getCouponForStore(storeId) : null
        
        // Determinar si tiene descuento
        const hasDiscount = !!(product.original_price && product.sale_price)
        let discountPercentage = 0
        
        if (hasDiscount && product.original_price && product.sale_price) {
          const original = parseFloat(product.original_price.replace(/[€$,]/g, ''))
          const sale = parseFloat(product.sale_price.replace(/[€$,]/g, ''))
          discountPercentage = Math.round(((original - sale) / original) * 100)
        }

        return {
          id: `serp-${index}`,
          title: product.title,
          price: product.price || product.sale_price || '0 €',
          originalPrice: hasDiscount ? product.original_price : undefined,
          rating: product.rating || 4.0 + Math.random(), // Fallback rating
          reviewCount: product.reviews || Math.floor(Math.random() * 1000) + 100,
          store: mapDomainToStoreName(domain),
          storeId,
          imageUrl: product.thumbnail || '/placeholder.jpg',
          productUrl: productUrl,
          affiliateUrl,
          hasFreeship: product.shipping?.toLowerCase().includes('free') || Math.random() > 0.5,
          hasDiscount,
          discountPercentage: hasDiscount ? discountPercentage : undefined,
          couponCode,
          availability: Math.random() > 0.1 ? 'in_stock' : (Math.random() > 0.5 ? 'limited' : 'out_of_stock'),
        }
      })
    )

    return NextResponse.json({
      query,
      results: processedProducts,
      totalResults: products.length,
      source: 'serp_api'
    })

  } catch (error) {
    console.error('Search products error:', error)
    return NextResponse.json(
      { error: 'Error searching products' },
      { status: 500 }
    )
  }
}

// Mapeo de dominios a nombres de tienda
function mapDomainToStoreName(domain: string): string {
  const storeMap: Record<string, string> = {
    'amazon.es': 'Amazon',
    'amazon.com': 'Amazon',
    'mediamarkt.es': 'MediaMarkt',
    'elcorteingles.es': 'El Corte Inglés',
    'fnac.es': 'Fnac',
    'carrefour.es': 'Carrefour',
    'pccomponentes.com': 'PcComponentes',
    'worten.es': 'Worten',
    'zara.com': 'Zara',
    'hm.com': 'H&M',
    'aliexpress.com': 'AliExpress',
    'ebay.es': 'eBay',
  }
  
  return storeMap[domain] || domain.charAt(0).toUpperCase() + domain.slice(1).replace('.com', '').replace('.es', '')
}

// Mapeo de dominios a IDs de tienda
function mapDomainToStoreId(domain: string): string | undefined {
  const storeIdMap: Record<string, string> = {
    'amazon.es': 'amazon',
    'amazon.com': 'amazon',
    'mediamarkt.es': 'mediamarkt',
    'elcorteingles.es': 'elcorteingles',
    'fnac.es': 'fnac',
    'carrefour.es': 'carrefour',
    'pccomponentes.com': 'pccomponentes',
    'worten.es': 'worten',
    'zara.com': 'zara',
    'hm.com': 'hm',
    'aliexpress.com': 'aliexpress',
    'ebay.es': 'ebay',
  }
  
  return storeIdMap[domain]
}
