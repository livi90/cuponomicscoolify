import { NextRequest, NextResponse } from 'next/server'
import { meilisearchClient, PRODUCTS_INDEX } from '@/lib/meilisearch/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'stats'
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const index = meilisearchClient.index(PRODUCTS_INDEX)
    
    switch (action) {
      case 'stats':
        const stats = await index.getStats()
        return NextResponse.json({
          success: true,
          data: {
            indexName: PRODUCTS_INDEX,
            stats,
            totalDocuments: stats.numberOfDocuments
          }
        })
        
      case 'raw-search':
        // Búsqueda directa sin filtros
        const rawResults = await index.search(query, {
          limit,
          attributesToRetrieve: ['id', 'product_name', 'merchant_category', 'search_price', 'description'],
        })
        
        return NextResponse.json({
          success: true,
          data: {
            query,
            totalHits: rawResults.estimatedTotalHits,
            processingTime: rawResults.processingTimeMs,
            hits: rawResults.hits
          }
        })
        
      case 'sample':
        // Obtener muestra aleatoria de productos
        const sampleResults = await index.search('', {
          limit,
          attributesToRetrieve: ['id', 'product_name', 'merchant_category', 'search_price', 'description'],
        })
        
        return NextResponse.json({
          success: true,
          data: {
            totalDocuments: sampleResults.estimatedTotalHits,
            sampleSize: sampleResults.hits.length,
            hits: sampleResults.hits
          }
        })
        
      case 'categories':
        // Obtener todas las categorías únicas
        const categoryResults = await index.search('', {
          limit: 1000,
          attributesToRetrieve: ['merchant_category'],
        })
        
        const categories = new Set()
        categoryResults.hits.forEach((hit: any) => {
          if (hit.merchant_category) {
            categories.add(hit.merchant_category)
          }
        })
        
        return NextResponse.json({
          success: true,
          data: {
            totalDocuments: categoryResults.estimatedTotalHits,
            uniqueCategories: Array.from(categories).sort(),
            categoriesCount: categories.size
          }
        })
        
      case 'searchable-attributes':
        // Obtener atributos de búsqueda configurados
        const searchableAttributes = await index.getSearchableAttributes()
        const filterableAttributes = await index.getFilterableAttributes()
        const sortableAttributes = await index.getSortableAttributes()
        
        return NextResponse.json({
          success: true,
          data: {
            searchableAttributes,
            filterableAttributes,
            sortableAttributes
          }
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Acción no válida. Usa: stats, raw-search, sample, categories, searchable-attributes'
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in debug-meilisearch API:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido',
      details: error
    }, { status: 500 })
  }
}
