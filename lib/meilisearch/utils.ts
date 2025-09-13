import { meilisearchClient, PRODUCTS_INDEX } from './client'

/**
 * Verificar si el índice existe
 */
export async function checkIndexExists(): Promise<boolean> {
  try {
    await meilisearchClient.getIndex(PRODUCTS_INDEX)
    return true
  } catch (error) {
    console.log(`Índice ${PRODUCTS_INDEX} no existe`)
    return false
  }
}

/**
 * Obtener información del índice
 */
export async function getIndexInfo() {
  try {
    const index = meilisearchClient.index(PRODUCTS_INDEX)
    const indexInfo = await index.fetchInfo()
    const stats = await index.getStats()
    
    return {
      exists: true,
      info: indexInfo,
      stats: stats,
      documentsCount: stats.numberOfDocuments
    }
  } catch (error) {
    console.error('Error getting index info:', error)
    return {
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Crear el índice si no existe
 */
export async function createIndexIfNotExists() {
  try {
    const exists = await checkIndexExists()
    
    if (!exists) {
      console.log(`Creando índice ${PRODUCTS_INDEX}...`)
      const task = await meilisearchClient.createIndex(PRODUCTS_INDEX, {
        primaryKey: 'id'
      })
      
      console.log('Índice creado:', task)
      return { created: true, task }
    } else {
      console.log(`Índice ${PRODUCTS_INDEX} ya existe`)
      return { created: false }
    }
  } catch (error) {
    console.error('Error creating index:', error)
    throw error
  }
}

/**
 * Configurar atributos del índice para optimizar búsquedas
 */
export async function configureIndexSettings() {
  try {
    const index = meilisearchClient.index(PRODUCTS_INDEX)
    
    // Configurar atributos para búsqueda
    await index.updateSearchableAttributes([
      'product_name',
      'description', 
      'merchant_category',
      'aw_product_id',
      'merchant_product_id'
    ])
    
    // Configurar atributos para filtros
    await index.updateFilterableAttributes([
      'merchant_category',
      'search_price',
      'product_price_old',
      'rating'
    ])
    
    // Configurar atributos para ordenamiento
    await index.updateSortableAttributes([
      'search_price',
      'product_price_old', 
      'rating'
    ])
    
    // Configurar sinónimos comunes
    await index.updateSynonyms({
      'movil': ['móvil', 'telefono', 'smartphone', 'celular'],
      'tv': ['television', 'televisor', 'tele'],
      'pc': ['ordenador', 'computadora', 'computador'],
      'portatil': ['portátil', 'laptop', 'notebook']
    })
    
    console.log('Configuración del índice actualizada')
    return true
  } catch (error) {
    console.error('Error configuring index:', error)
    throw error
  }
}

/**
 * Obtener una muestra de documentos del índice
 */
export async function getSampleDocuments(limit = 5) {
  try {
    const index = meilisearchClient.index(PRODUCTS_INDEX)
    const results = await index.search('', { limit })
    
    return {
      totalDocuments: results.estimatedTotalHits,
      sampleDocuments: results.hits
    }
  } catch (error) {
    console.error('Error getting sample documents:', error)
    return {
      totalDocuments: 0,
      sampleDocuments: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
