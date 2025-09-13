import { NextRequest, NextResponse } from "next/server"
import { UniversalSearchService } from "@/lib/services/universal-search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const includeNike = searchParams.get('includeNike') !== 'false'
    const maxResults = parseInt(searchParams.get('maxResults') || '12')
    const minConfidence = parseInt(searchParams.get('minConfidence') || '25')
    const action = searchParams.get('action') || 'search'

    // Diferentes acciones del endpoint
    switch (action) {
      case 'keywords':
        // Obtener estadísticas de palabras clave
        const stats = await UniversalSearchService.getKeywordStats()
        return NextResponse.json({
          success: true,
          ...stats
        })

      case 'analyze':
        // Solo analizar la consulta sin buscar productos
        if (!query) {
          return NextResponse.json({ error: 'Query parameter is required for analysis' }, { status: 400 })
        }
        
        const analysis = await UniversalSearchService.analyzeSearchQuery(query)
        return NextResponse.json({
          success: true,
          query,
          analysis
        })

      case 'search':
      default:
        // Búsqueda completa
        if (!query) {
          return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
        }

        const result = await UniversalSearchService.universalSearch({
          query,
          includeNike,
          maxNikeResults: maxResults,
          minConfidence
        })

        return NextResponse.json({
          success: true,
          query,
          includeNike,
          result: {
            ...result,
            metadata: {
              searchedAt: new Date().toISOString(),
              parameters: {
                maxResults,
                minConfidence,
                includeNike
              }
            }
          }
        })
    }

  } catch (error) {
    console.error('Universal search API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error en búsqueda universal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'refresh-keywords':
        // Limpiar cache y forzar actualización de palabras clave
        UniversalSearchService.clearCache()
        const newStats = await UniversalSearchService.getKeywordStats()
        
        return NextResponse.json({
          success: true,
          message: 'Keywords cache refreshed',
          ...newStats
        })

      case 'batch-analyze':
        // Analizar múltiples consultas de una vez
        const { queries } = body
        
        if (!Array.isArray(queries)) {
          return NextResponse.json({ error: 'Queries must be an array' }, { status: 400 })
        }

        const results = await Promise.all(
          queries.map(async (query: string) => {
            const analysis = await UniversalSearchService.analyzeSearchQuery(query)
            return { query, analysis }
          })
        )

        return NextResponse.json({
          success: true,
          results
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Universal search POST error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error en operación de búsqueda universal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
