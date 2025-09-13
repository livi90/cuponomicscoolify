import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { meilisearchClient } from '@/lib/meilisearch/client'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y permisos de administrador
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar que el usuario sea administrador
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { query = '', limit = 20, filter, sort, indices = [] } = await request.json()

    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Query de búsqueda es requerida' },
        { status: 400 }
      )
    }

    // Obtener todos los índices si no se especifican
    let targetIndices = indices
    if (targetIndices.length === 0) {
      const allIndices = await meilisearchClient.listIndexes()
      targetIndices = allIndices.results.map(index => index.uid)
    }

    // Configurar opciones de búsqueda
    const searchOptions: any = {
      limit: Math.min(limit, 50), // Máximo 50 resultados por índice
      offset: 0
    }

    if (filter) {
      searchOptions.filter = filter
    }

    if (sort) {
      searchOptions.sort = sort
    }

    // Realizar búsquedas en paralelo en todos los índices
    const searchPromises = targetIndices.map(async (indexName: string) => {
      try {
        const index = meilisearchClient.index(indexName)
        const searchResults = await index.search(query, searchOptions)
        
        // Agregar metadatos del índice a cada resultado
        const enrichedHits = searchResults.hits.map((hit: any) => ({
          ...hit,
          _sourceIndex: indexName,
          _sourceIndexName: indexName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          _relevanceScore: searchResults.processingTimeMs // Usar tiempo de procesamiento como score básico
        }))

        return {
          indexName,
          hits: enrichedHits,
          totalHits: searchResults.estimatedTotalHits || 0,
          processingTimeMs: searchResults.processingTimeMs
        }
      } catch (error) {
        console.warn(`Error buscando en índice ${indexName}:`, error)
        return {
          indexName,
          hits: [],
          totalHits: 0,
          processingTimeMs: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    const allResults = await Promise.all(searchPromises)
    
    // Combinar todos los resultados
    const combinedHits = allResults.flatMap(result => result.hits)
    
    // Ordenar por relevancia (puedes personalizar este algoritmo)
    combinedHits.sort((a, b) => {
      // Priorizar resultados de índices que coincidan con la query
      const aIndexMatch = a._sourceIndexName?.toLowerCase().includes(query.toLowerCase())
      const bIndexMatch = b._sourceIndexName?.toLowerCase().includes(query.toLowerCase())
      
      if (aIndexMatch && !bIndexMatch) return -1
      if (!aIndexMatch && bIndexMatch) return 1
      
      // Si ambos coinciden o ninguno, ordenar por score de relevancia
      return (b._relevanceScore || 0) - (a._relevanceScore || 0)
    })

    // Limitar el total de resultados
    const limitedHits = combinedHits.slice(0, limit)

    // Calcular estadísticas
    const totalHits = allResults.reduce((sum, result) => sum + result.totalHits, 0)
    const totalProcessingTime = allResults.reduce((sum, result) => sum + result.processingTimeMs, 0)
    const successfulIndices = allResults.filter(result => !result.error).length
    const failedIndices = allResults.filter(result => result.error).length

    return NextResponse.json({
      hits: limitedHits,
      query,
      totalHits,
      totalProcessingTime,
      indicesSearched: targetIndices.length,
      successfulIndices,
      failedIndices,
      resultsByIndex: allResults.map(result => ({
        indexName: result.indexName,
        hitCount: result.hits.length,
        totalHits: result.totalHits,
        processingTimeMs: result.processingTimeMs,
        hasError: !!result.error
      }))
    })
  } catch (error) {
    console.error('Error en búsqueda unificada:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
