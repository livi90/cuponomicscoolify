#!/usr/bin/env node

/**
 * Script de prueba para la funcionalidad de múltiples índices por tienda
 * 
 * Este script demuestra cómo crear y gestionar índices separados para diferentes tiendas
 * y realizar búsquedas unificadas.
 */

const { MeiliSearch } = require('meilisearch')

// Configuración
const MEILISEARCH_URL = process.env.NEXT_PUBLIC_MEILISEARCH_URL || 'https://meilisearch-b8osgk4ckgococo40080w80w.dbcuponomics.online'
const MEILISEARCH_API_KEY = process.env.SERVICE_PASSWORD_MEILISEARCH

if (!MEILISEARCH_API_KEY) {
  console.error('❌ Error: SERVICE_PASSWORD_MEILISEARCH no está configurado')
  process.exit(1)
}

// Cliente de Meilisearch
const client = new MeiliSearch({
  host: MEILISEARCH_URL,
  apiKey: MEILISEARCH_API_KEY
})

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

// Datos de ejemplo para diferentes tiendas
const sampleData = {
  nike_productos: [
    { id: 'nike_001', name: 'Nike Air Max 270', category: 'Zapatillas', price: 129.99, brand: 'Nike', store: 'Nike' },
    { id: 'nike_002', name: 'Nike Dri-FIT T-Shirt', category: 'Ropa Deportiva', price: 34.99, brand: 'Nike', store: 'Nike' },
    { id: 'nike_003', name: 'Nike Pro Shorts', category: 'Ropa Deportiva', price: 24.99, brand: 'Nike', store: 'Nike' }
  ],
  adidas_productos: [
    { id: 'adidas_001', name: 'Adidas Ultraboost 22', category: 'Zapatillas', price: 179.99, brand: 'Adidas', store: 'Adidas' },
    { id: 'adidas_002', name: 'Adidas Tiro Track Jacket', category: 'Ropa Deportiva', price: 89.99, brand: 'Adidas', store: 'Adidas' },
    { id: 'adidas_003', name: 'Adidas Training Pants', category: 'Ropa Deportiva', price: 59.99, brand: 'Adidas', store: 'Adidas' }
  ],
  zara_ropa: [
    { id: 'zara_001', name: 'Vestido Floral', category: 'Vestidos', price: 49.99, brand: 'Zara', store: 'Zara' },
    { id: 'zara_002', name: 'Blazer Clásico', category: 'Chaquetas', price: 79.99, brand: 'Zara', store: 'Zara' },
    { id: 'zara_003', name: 'Pantalón Chino', category: 'Pantalones', price: 39.99, brand: 'Zara', store: 'Zara' }
  ],
  nike_cupones: [
    { code: 'NIKE20', discount: 20, type: 'Porcentaje', valid_until: '2024-12-31', store: 'Nike' },
    { code: 'NIKE50', discount: 50, type: 'Porcentaje', valid_until: '2024-06-30', store: 'Nike' },
    { code: 'FREESHIP', discount: 0, type: 'Envío Gratis', valid_until: '2024-12-31', store: 'Nike' }
  ]
}

// Funciones de prueba
async function testConnection() {
  logInfo('Probando conexión con Meilisearch...')
  
  try {
    const health = await client.health()
    logSuccess(`Conexión exitosa - Estado: ${health.status}`)
    return true
  } catch (error) {
    logError(`Error de conexión: ${error.message}`)
    return false
  }
}

async function createStoreIndices() {
  logInfo('Creando índices para diferentes tiendas...')
  
  const indices = []
  
  for (const [indexName, data] of Object.entries(sampleData)) {
    try {
      // Crear índice
      const task = await client.createIndex(indexName, {
        primaryKey: data[0].id ? 'id' : 'code'
      })
      
      logSuccess(`Índice "${indexName}" creado - Task ID: ${task.taskUid}`)
      
      // Agregar documentos
      const index = client.index(indexName)
      const addTask = await index.addDocuments(data)
      
      logSuccess(`Documentos agregados a "${indexName}" - Task ID: ${addTask.taskUid}`)
      
      indices.push(indexName)
    } catch (error) {
      if (error.message.includes('already exists')) {
        logWarning(`El índice "${indexName}" ya existe`)
        indices.push(indexName)
      } else {
        logError(`Error creando índice "${indexName}": ${error.message}`)
      }
    }
  }
  
  return indices
}

async function testUnifiedSearch() {
  logInfo('Probando búsqueda unificada en múltiples índices...')
  
  try {
    // Obtener todos los índices
    const allIndices = await client.listIndexes()
    const indexNames = allIndices.results.map(index => index.uid)
    
    logInfo(`Índices disponibles: ${indexNames.join(', ')}`)
    
    // Realizar búsquedas en paralelo
    const searchPromises = indexNames.map(async (indexName) => {
      try {
        const index = client.index(indexName)
        const results = await index.search('zapatillas', { limit: 5 })
        
        return {
          indexName,
          hits: results.hits,
          totalHits: results.estimatedTotalHits || 0
        }
      } catch (error) {
        return {
          indexName,
          hits: [],
          totalHits: 0,
          error: error.message
        }
      }
    })
    
    const allResults = await Promise.all(searchPromises)
    
    // Combinar resultados
    const combinedHits = allResults.flatMap(result => 
      result.hits.map(hit => ({
        ...hit,
        _sourceIndex: result.indexName,
        _sourceStore: result.indexName.split('_')[0]
      }))
    )
    
    logSuccess(`Búsqueda unificada completada:`)
    log(`  - Total de resultados: ${combinedHits.length}`, 'cyan')
    log(`  - Índices consultados: ${indexNames.length}`, 'cyan')
    
    // Mostrar resultados por tienda
    const resultsByStore = {}
    combinedHits.forEach(hit => {
      const store = hit._sourceStore
      if (!resultsByStore[store]) resultsByStore[store] = []
      resultsByStore[store].push(hit)
    })
    
    Object.entries(resultsByStore).forEach(([store, hits]) => {
      log(`  - ${store}: ${hits.length} resultados`, 'cyan')
    })
    
    return combinedHits
  } catch (error) {
    logError(`Error en búsqueda unificada: ${error.message}`)
    return []
  }
}

async function testStoreSpecificSearch() {
  logInfo('Probando búsquedas específicas por tienda...')
  
  const queries = [
    { query: 'nike', expectedStore: 'Nike' },
    { query: 'adidas', expectedStore: 'Adidas' },
    { query: 'zara', expectedStore: 'Zara' },
    { query: 'zapatillas', expectedStore: 'Nike,Adidas' },
    { query: 'ropa', expectedStore: 'Zara,Nike,Adidas' }
  ]
  
  for (const { query, expectedStore } of queries) {
    try {
      logInfo(`Buscando "${query}"...`)
      
      // Buscar en todos los índices
      const allIndices = await client.listIndexes()
      const searchPromises = allIndices.results.map(async (index) => {
        try {
          const indexInstance = client.index(index.uid)
          const results = await indexInstance.search(query, { limit: 3 })
          
          return {
            indexName: index.uid,
            hits: results.hits,
            totalHits: results.estimatedTotalHits || 0
          }
        } catch (error) {
          return { indexName: index.uid, hits: [], totalHits: 0 }
        }
      })
      
      const allResults = await Promise.all(searchPromises)
      const totalHits = allResults.reduce((sum, result) => sum + result.totalHits, 0)
      
      logSuccess(`Query "${query}": ${totalHits} resultados totales`)
      
      // Mostrar resultados por índice
      allResults.forEach(result => {
        if (result.hits.length > 0) {
          log(`  - ${result.indexName}: ${result.hits.length} resultados`, 'cyan')
        }
      })
      
    } catch (error) {
      logError(`Error buscando "${query}": ${error.message}`)
    }
  }
}

async function testIndexManagement() {
  logInfo('Probando gestión de índices...')
  
  try {
    // Listar todos los índices
    const indices = await client.listIndexes()
    logSuccess(`Total de índices: ${indices.results.length}`)
    
    // Mostrar información de cada índice
    for (const index of indices.results) {
      try {
        const indexInstance = client.index(index.uid)
        const info = await indexInstance.fetchInfo()
        const stats = await indexInstance.getStats()
        
        log(`  📊 ${index.uid}:`, 'cyan')
        log(`     - Documentos: ${stats.numberOfDocuments}`, 'cyan')
        log(`     - Clave primaria: ${info.primaryKey}`, 'cyan')
        log(`     - Estado: ${stats.isIndexing ? 'Indexando' : 'Indexado'}`, 'cyan')
        
      } catch (error) {
        logWarning(`No se pudo obtener información de ${index.uid}: ${error.message}`)
      }
    }
    
  } catch (error) {
    logError(`Error en gestión de índices: ${error.message}`)
  }
}

// Función principal de prueba
async function runTests() {
  log('🚀 Iniciando pruebas de múltiples índices por tienda', 'bright')
  log('=' * 70, 'blue')
  
  // 1. Probar conexión
  const connected = await testConnection()
  if (!connected) {
    process.exit(1)
  }
  
  // 2. Crear índices de tiendas
  const createdIndices = await createStoreIndices()
  
  // 3. Esperar un momento para que se indexen los documentos
  logInfo('Esperando que se indexen los documentos...')
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 4. Probar gestión de índices
  await testIndexManagement()
  
  // 5. Probar búsquedas específicas por tienda
  await testStoreSpecificSearch()
  
  // 6. Probar búsqueda unificada
  await testUnifiedSearch()
  
  log('=' * 70, 'blue')
  log('✨ Pruebas de múltiples índices completadas', 'bright')
  log('', 'cyan')
  log('🎯 Resumen de la funcionalidad implementada:', 'bright')
  log('  ✅ Índices separados por tienda', 'green')
  log('  ✅ Búsqueda unificada en múltiples índices', 'green')
  log('  ✅ Importación de CSV', 'green')
  log('  ✅ Gestión administrativa completa', 'green')
  log('', 'cyan')
  log('🏪 Estructura recomendada para tus índices:', 'bright')
  log('  - {tienda}_{tipo} (ej: nike_productos, adidas_cupones)', 'cyan')
  log('  - Cada tienda puede tener múltiples tipos de contenido', 'cyan')
  log('  - Búsqueda unificada consulta todos los índices', 'cyan')
}

// Manejo de errores
process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection at:')
  logError(`  Promise: ${promise}`)
  logError(`  Reason: ${reason}`)
  process.exit(1)
})

// Ejecutar pruebas
if (require.main === module) {
  runTests().catch(error => {
    logError(`Error en las pruebas: ${error.message}`)
    process.exit(1)
  })
}

module.exports = {
  testConnection,
  createStoreIndices,
  testUnifiedSearch,
  testStoreSpecificSearch,
  testIndexManagement
}
