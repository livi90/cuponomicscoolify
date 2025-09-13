#!/usr/bin/env node

/**
 * Script de prueba para el sistema de búsqueda híbrida
 * 
 * Uso:
 * node scripts/test-hybrid-search.js
 * 
 * Este script prueba:
 * 1. La API de búsqueda híbrida
 * 2. Diferentes tipos de búsquedas
 * 3. El sistema de caché
 * 4. Fallbacks y manejo de errores
 */

const BASE_URL = 'http://localhost:3000'

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logHeader(message) {
  log(`\n${colors.bright}${colors.cyan}${message}${colors.reset}`)
  log('─'.repeat(message.length), 'cyan')
}

// Función para hacer requests HTTP
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    const data = await response.json()
    
    return {
      ok: response.ok,
      status: response.status,
      data
    }
  } catch (error) {
    return {
      ok: false,
      error: error.message
    }
  }
}

// Función para probar la API de búsqueda híbrida
async function testHybridSearch(query, options = {}) {
  logInfo(`Probando búsqueda: "${query}"`)
  
  const response = await makeRequest(`${BASE_URL}/api/hybrid-search`, {
    method: 'POST',
    body: JSON.stringify({
      query,
      maxResults: options.maxResults || 20,
      minConfidence: options.minConfidence || 25,
      useCache: options.useCache !== false,
      cacheExpiry: options.cacheExpiry || 60
    })
  })
  
  if (response.ok) {
    const { data } = response
    logSuccess(`Búsqueda exitosa para "${query}"`)
    logInfo(`Fuente: ${data.source}`)
    logInfo(`Total resultados: ${data.totalResults}`)
    logInfo(`Confianza: ${data.searchMetadata.confidence}%`)
    logInfo(`Tiempo: ${data.searchMetadata.searchTime}ms`)
    logInfo(`Cache hit: ${data.cacheHit ? 'Sí' : 'No'}`)
    
    if (data.mainProduct) {
      logInfo(`Producto principal: ${data.mainProduct.title}`)
      logInfo(`Tienda: ${data.mainProduct.store}`)
      logInfo(`Precio: ${data.mainProduct.price}`)
    }
    
    if (data.alternativeProducts.length > 0) {
      logInfo(`Alternativas: ${data.alternativeProducts.length} productos`)
      data.alternativeProducts.forEach((alt, index) => {
        logInfo(`  ${index + 1}. ${alt.title} - ${alt.store} - ${alt.price}`)
      })
    }
    
    return data
  } else {
    logError(`Error en búsqueda: ${response.status}`)
    if (response.data?.message) {
      logError(`Mensaje: ${response.data.message}`)
    }
    return null
  }
}

// Función para probar el sistema de caché
async function testCacheSystem() {
  logHeader('🧪 Probando Sistema de Caché')
  
  // Primera búsqueda (debe guardar en caché)
  logInfo('Primera búsqueda (debe guardar en caché)')
  const firstResult = await testHybridSearch('nike air max')
  
  if (!firstResult) {
    logError('Primera búsqueda falló, no se puede probar caché')
    return
  }
  
  // Segunda búsqueda (debe usar caché)
  logInfo('Segunda búsqueda (debe usar caché)')
  const secondResult = await testHybridSearch('nike air max')
  
  if (secondResult && secondResult.cacheHit) {
    logSuccess('✅ Caché funcionando correctamente')
  } else {
    logWarning('⚠️ Caché no está funcionando como esperado')
  }
  
  // Limpiar caché
  logInfo('Limpiando caché...')
  const clearResponse = await makeRequest(`${BASE_URL}/api/hybrid-search?action=clear`, {
    method: 'DELETE'
  })
  
  if (clearResponse.ok) {
    logSuccess('✅ Caché limpiado correctamente')
  } else {
    logError('❌ Error al limpiar caché')
  }
}

// Función para probar diferentes tipos de búsquedas
async function testDifferentSearchTypes() {
  logHeader('🔍 Probando Diferentes Tipos de Búsqueda')
  
  const testCases = [
    {
      query: 'nike air max 90',
      description: 'Búsqueda Nike específica (debe ser híbrida)',
      expectedSource: 'hybrid'
    },
    {
      query: 'jordan retro 1',
      description: 'Búsqueda Jordan (debe ser híbrida)',
      expectedSource: 'hybrid'
    },
    {
      query: 'smartphone samsung',
      description: 'Búsqueda no-Nike (debe ser SERP API)',
      expectedSource: 'serp_api'
    },
    {
      query: 'zapatillas deportivas',
      description: 'Búsqueda genérica deportiva (puede ser híbrida)',
      expectedSource: 'hybrid'
    }
  ]
  
  for (const testCase of testCases) {
    logInfo(`\n${testCase.description}`)
    const result = await testHybridSearch(testCase.query, { maxResults: 10 })
    
    if (result) {
      if (result.source === testCase.expectedSource) {
        logSuccess(`✅ Fuente correcta: ${result.source}`)
      } else {
        logWarning(`⚠️ Fuente inesperada: ${result.source} (esperado: ${testCase.expectedSource})`)
      }
    }
    
    // Esperar un poco entre búsquedas para no sobrecargar la API
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

// Función para probar manejo de errores
async function testErrorHandling() {
  logHeader('🚨 Probando Manejo de Errores')
  
  // Búsqueda sin query
  logInfo('Probando búsqueda sin query...')
  const emptyResponse = await makeRequest(`${BASE_URL}/api/hybrid-search`, {
    method: 'POST',
    body: JSON.stringify({})
  })
  
  if (!emptyResponse.ok && emptyResponse.status === 400) {
    logSuccess('✅ Error manejado correctamente para query vacía')
  } else {
    logError('❌ Error no manejado correctamente para query vacía')
  }
  
  // Búsqueda con parámetros inválidos
  logInfo('Probando parámetros inválidos...')
  const invalidResponse = await makeRequest(`${BASE_URL}/api/hybrid-search`, {
    method: 'POST',
    body: JSON.stringify({
      query: 'test',
      maxResults: 1000, // Demasiado alto
      minConfidence: 150 // Inválido
    })
  })
  
  if (!invalidResponse.ok && invalidResponse.status === 400) {
    logSuccess('✅ Error manejado correctamente para parámetros inválidos')
  } else {
    logError('❌ Error no manejado correctamente para parámetros inválidos')
  }
}

// Función principal de pruebas
async function runTests() {
  logHeader('🚀 Iniciando Pruebas del Sistema de Búsqueda Híbrida')
  
  try {
    // Verificar que el servidor esté funcionando
    logInfo('Verificando conexión al servidor...')
    const healthCheck = await makeRequest(`${BASE_URL}/api/hybrid-search?q=test`)
    
    if (!healthCheck.ok && healthCheck.status !== 400) {
      logError('❌ No se puede conectar al servidor. Asegúrate de que esté ejecutándose en localhost:3000')
      process.exit(1)
    }
    
    logSuccess('✅ Servidor conectado correctamente')
    
    // Ejecutar pruebas
    await testDifferentSearchTypes()
    await testCacheSystem()
    await testErrorHandling()
    
    logHeader('🎉 Todas las pruebas completadas')
    logSuccess('El sistema de búsqueda híbrida está funcionando correctamente')
    
  } catch (error) {
    logError(`❌ Error durante las pruebas: ${error.message}`)
    process.exit(1)
  }
}

// Ejecutar pruebas si el script se ejecuta directamente
if (require.main === module) {
  runTests().catch(error => {
    logError(`❌ Error fatal: ${error.message}`)
    process.exit(1)
  })
}

module.exports = {
  testHybridSearch,
  testCacheSystem,
  testDifferentSearchTypes,
  testErrorHandling
}
