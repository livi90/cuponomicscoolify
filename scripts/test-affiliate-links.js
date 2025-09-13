#!/usr/bin/env node

/**
 * Script de prueba para verificar enlaces de afiliado de AWIN
 * Ejecutar con: node scripts/test-affiliate-links.js
 */

// Simular datos de tiendas de Supabase
const mockStoreInfo = {
  'el corte inglés': {
    name: 'El Corte Inglés',
    affiliate_network: 'AWIN',
    publisherId: '12345',
    advertiserId: '67890',
    is_active: true
  },
  'fnac': {
    name: 'FNAC',
    affiliate_network: 'AWIN',
    publisherId: '11111',
    advertiserId: '22222',
    is_active: true
  },
  'amazon': {
    name: 'Amazon',
    affiliate_network: 'AMAZON',
    publisherId: 'amazon-tag-123',
    is_active: true
  },
  'ebay': {
    name: 'eBay',
    affiliate_network: 'EBAY',
    is_active: true
  }
}

// Función para generar enlaces AWIN (copia de la función real)
function generateAwinAffiliateUrl(originalUrl, publisherId, advertiserId) {
  try {
    if (!originalUrl || originalUrl === '#' || originalUrl.startsWith('localhost')) {
      console.warn('URL inválida para enlace AWIN:', originalUrl)
      return originalUrl
    }

    if (!publisherId || !advertiserId) {
      console.error('Faltan publisherId o advertiserId para generar enlace AWIN')
      return originalUrl
    }

    // Formato oficial de enlace de afiliado de AWIN
    const affiliateUrl = `https://www.awin1.com/cread.php?awinmid=${advertiserId}&awinaffid=${publisherId}&clicktracker=&url=${encodeURIComponent(originalUrl)}`
    
    return affiliateUrl
  } catch (error) {
    console.error('Error generando enlace AWIN:', error)
    return originalUrl
  }
}

// Función para generar enlaces de afiliado (copia de la función real)
function generateAffiliateUrl(originalUrl, storeName, storeInfo) {
  try {
    if (!originalUrl || originalUrl === '#' || originalUrl.startsWith('localhost')) {
      console.warn('URL inválida para enlace de afiliado:', originalUrl)
      return originalUrl
    }

    const storeLower = storeName.toLowerCase().trim()
    let store = storeInfo[storeLower]
    
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
      return originalUrl
    }

    console.log(`Generando enlace de afiliado para ${storeName}:`, store)

    if (store.affiliate_network === 'AWIN' && store.publisherId && store.advertiserId) {
      console.log(`Generando enlace AWIN para ${storeName}`)
      return generateAwinAffiliateUrl(originalUrl, store.publisherId, store.advertiserId)
    }
    
    if (store.affiliate_network === 'EBAY') {
      console.log(`eBay Smart Link para ${storeName} - usando URL original`)
      return originalUrl
    }
    
    if (store.affiliate_network === 'AMAZON' && store.publisherId) {
      console.log(`Generando enlace Amazon para ${storeName}`)
      return `${originalUrl}?tag=${store.publisherId}`
    }
    
    console.log(`Tienda ${storeName} no tiene red de afiliados configurada, usando URL original`)
    return originalUrl
  } catch (error) {
    console.error('Error generando enlace de afiliado:', error)
    return originalUrl
  }
}

// Pruebas
console.log('🧪 PRUEBAS DE ENLACES DE AFILIADO AWIN\n')

const testUrls = [
  'https://www.elcorteingles.es/electronica/A123456789-iphone-15-pro/',
  'https://www.fnac.es/iPhone-15-Pro-128GB-Negro/a1234567',
  'https://www.amazon.es/dp/B0CHX1W1XP',
  'https://www.ebay.es/itm/123456789',
  'https://www.mediamarkt.es/producto/123456'
]

const testStores = [
  'El Corte Inglés',
  'FNAC',
  'Amazon',
  'eBay',
  'MediaMarkt'
]

console.log('📋 DATOS DE TIENDAS DISPONIBLES:')
console.log(mockStoreInfo)
console.log('\n')

console.log('🔗 PRUEBAS DE GENERACIÓN DE ENLACES:\n')

testUrls.forEach((url, index) => {
  const storeName = testStores[index]
  console.log(`📍 Prueba ${index + 1}: ${storeName}`)
  console.log(`   URL original: ${url}`)
  
  const affiliateUrl = generateAffiliateUrl(url, storeName, mockStoreInfo)
  
  console.log(`   Enlace afiliado: ${affiliateUrl}`)
  console.log(`   ✅ ${affiliateUrl !== url ? 'ENLACE GENERADO' : 'URL ORIGINAL'}`)
  console.log('')
})

console.log('📚 DOCUMENTACIÓN AWIN:')
console.log('https://developer.awin.com/apidocs/generatelink')
console.log('\n📝 FORMATO DEL ENLACE:')
console.log('https://www.awin1.com/cread.php?awinmid={advertiserId}&awinaffid={publisherId}&clicktracker=&url={URL_ORIGINAL}')

console.log('\n🎯 VERIFICACIONES:')
console.log('1. ✅ publisherId y advertiserId deben estar en la tabla stores')
console.log('2. ✅ affiliate_network debe ser "AWIN"')
console.log('3. ✅ is_active debe ser true')
console.log('4. ✅ Los nombres de tiendas deben coincidir exactamente')
console.log('5. ✅ Las URLs deben ser válidas y no localhost')
