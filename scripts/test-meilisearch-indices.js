#!/usr/bin/env node

/**
 * Script de prueba para la funcionalidad de gestión de índices de Meilisearch
 * 
 * Este script prueba las APIs de administración de índices sin necesidad de
 * iniciar la aplicación completa.
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

async function testListIndices() {
  logInfo('Probando listado de índices...')
  
  try {
    const indices = await client.listIndexes()
    logSuccess(`Índices encontrados: ${indices.results.length}`)
    
    if (indices.results.length > 0) {
      indices.results.forEach((index, i) => {
        log(`  ${i + 1}. ${index.uid}`, 'cyan')
      })
    }
    
    return indices.results
  } catch (error) {
    logError(`Error al listar índices: ${error.message}`)
    return []
  }
}

async function testCreateIndex(indexName, primaryKey = 'id') {
  logInfo(`Probando creación de índice: ${indexName}`)
  
  try {
    const task = await client.createIndex(indexName, { primaryKey })
    logSuccess(`Índice "${indexName}" creado - Task ID: ${task.taskUid}`)
    return true
  } catch (error) {
    if (error.message.includes('already exists')) {
      logWarning(`El índice "${indexName}" ya existe`)
      return true
    } else {
      logError(`Error al crear índice: ${error.message}`)
      return false
    }
  }
}

async function testIndexInfo(indexName) {
  logInfo(`Probando información del índice: ${indexName}`)
  
  try {
    const index = client.index(indexName)
    const info = await index.fetchInfo()
    const stats = await index.getStats()
    
    logSuccess(`Información del índice "${indexName}":`)
    log(`  - Nombre: ${info.name || indexName}`, 'cyan')
    log(`  - Clave primaria: ${info.primaryKey}`, 'cyan')
    log(`  - Documentos: ${stats.numberOfDocuments}`, 'cyan')
    log(`  - Indexando: ${stats.isIndexing}`, 'cyan')
    
    return { info, stats }
  } catch (error) {
    logError(`Error al obtener información del índice: ${error.message}`)
    return null
  }
}

async function testIndexSettings(indexName) {
  logInfo(`Probando configuración del índice: ${indexName}`)
  
  try {
    const index = client.index(indexName)
    
    const [
      searchableAttributes,
      filterableAttributes,
      sortableAttributes,
      rankingRules
    ] = await Promise.all([
      index.getSearchableAttributes(),
      index.getFilterableAttributes(),
      index.getSortableAttributes(),
      index.getRankingRules()
    ])
    
    logSuccess(`Configuración del índice "${indexName}":`)
    log(`  - Atributos de búsqueda: ${searchableAttributes.join(', ')}`, 'cyan')
    log(`  - Atributos filtrables: ${filterableAttributes.join(', ')}`, 'cyan')
    log(`  - Atributos ordenables: ${sortableAttributes.join(', ')}`, 'cyan')
    log(`  - Reglas de ranking: ${rankingRules.join(', ')}`, 'cyan')
    
    return { searchableAttributes, filterableAttributes, sortableAttributes, rankingRules }
  } catch (error) {
    logError(`Error al obtener configuración del índice: ${error.message}`)
    return null
  }
}

async function testUpdateSettings(indexName) {
  logInfo(`Probando actualización de configuración del índice: ${indexName}`)
  
  try {
    const index = client.index(indexName)
    
    // Actualizar atributos de búsqueda
    const newSearchableAttributes = ['id', 'name', 'description']
    await index.updateSearchableAttributes(newSearchableAttributes)
    
    // Actualizar atributos filtrables
    const newFilterableAttributes = ['category', 'status']
    await index.updateFilterableAttributes(newFilterableAttributes)
    
    // Actualizar atributos ordenables
    const newSortableAttributes = ['created_at', 'updated_at']
    await index.updateSortableAttributes(newSortableAttributes)
    
    logSuccess(`Configuración del índice "${indexName}" actualizada`)
    return true
  } catch (error) {
    logError(`Error al actualizar configuración: ${error.message}`)
    return false
  }
}

async function testSearch(indexName, query = 'test') {
  logInfo(`Probando búsqueda en el índice: ${indexName} - Query: "${query}"`)
  
  try {
    const index = client.index(indexName)
    const results = await index.search(query, { limit: 5 })
    
    logSuccess(`Búsqueda exitosa - Resultados: ${results.hits.length}`)
    log(`  - Tiempo de procesamiento: ${results.processingTimeMs}ms`, 'cyan')
    log(`  - Total estimado: ${results.estimatedTotalHits}`, 'cyan')
    
    if (results.hits.length > 0) {
      log('  - Primer resultado:', 'cyan')
      log(`    ${JSON.stringify(results.hits[0], null, 2)}`, 'cyan')
    }
    
    return results
  } catch (error) {
    logError(`Error en la búsqueda: ${error.message}`)
    return null
  }
}

async function testDeleteIndex(indexName) {
  logInfo(`Probando eliminación del índice: ${indexName}`)
  
  try {
    const task = await client.deleteIndex(indexName)
    logSuccess(`Índice "${indexName}" eliminado - Task ID: ${task.taskUid}`)
    return true
  } catch (error) {
    logError(`Error al eliminar índice: ${error.message}`)
    return false
  }
}

// Función principal de prueba
async function runTests() {
  log('🚀 Iniciando pruebas de gestión de índices de Meilisearch', 'bright')
  log('=' * 60, 'blue')
  
  // 1. Probar conexión
  const connected = await testConnection()
  if (!connected) {
    process.exit(1)
  }
  
  // 2. Listar índices existentes
  const existingIndices = await testListIndices()
  
  // 3. Crear índice de prueba
  const testIndexName = 'test_index_' + Date.now()
  const created = await testCreateIndex(testIndexName)
  
  if (created) {
    // 4. Probar información del índice
    await testIndexInfo(testIndexName)
    
    // 5. Probar configuración del índice
    await testIndexSettings(testIndexName)
    
    // 6. Probar actualización de configuración
    await testUpdateSettings(testIndexName)
    
    // 7. Probar búsqueda
    await testSearch(testIndexName, 'test')
    
    // 8. Limpiar - eliminar índice de prueba
    await testDeleteIndex(testIndexName)
  }
  
  // 9. Listar índices finales
  logInfo('Estado final de índices:')
  await testListIndices()
  
  log('=' * 60, 'blue')
  log('✨ Pruebas completadas', 'bright')
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
  testListIndices,
  testCreateIndex,
  testIndexInfo,
  testIndexSettings,
  testUpdateSettings,
  testSearch,
  testDeleteIndex
}
