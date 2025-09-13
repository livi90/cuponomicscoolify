import { NextRequest, NextResponse } from 'next/server'
import { HybridSearchService, SearchOptions } from '@/lib/services/hybrid-search'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json({ 
        error: 'Query parameter is required',
        message: 'El parámetro de búsqueda es requerido'
      }, { status: 400 })
    }

    const maxResults = searchParams.get('maxResults') ? parseInt(searchParams.get('maxResults')!) : 20
    const minConfidence = searchParams.get('minConfidence') ? parseInt(searchParams.get('minConfidence')!) : 25

    // Validar parámetros
    if (maxResults > 50) {
      return NextResponse.json({ 
        error: 'maxResults cannot exceed 50',
        message: 'El máximo de resultados no puede exceder 50'
      }, { status: 400 })
    }

    if (minConfidence < 0 || minConfidence > 100) {
      return NextResponse.json({ 
        error: 'minConfidence must be between 0 and 100',
        message: 'La confianza mínima debe estar entre 0 y 100'
      }, { status: 400 })
    }

    const searchOptions: SearchOptions = {
      query: query.trim(),
      maxResults,
      minConfidence
    }

    console.log(`🔍 Búsqueda híbrida iniciada: "${query}" (maxResults: ${maxResults}, minConfidence: ${minConfidence})`)

    const result = await HybridSearchService.hybridSearch(searchOptions)

    console.log(`✅ Búsqueda híbrida completada:`, {
      query: result.searchMetadata.query,
      source: result.source,
      totalResults: result.totalResults,
      cacheHit: result.cacheHit,
      searchTime: result.searchMetadata.searchTime,
      confidence: result.searchMetadata.confidence
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: `Búsqueda completada en ${result.searchTime}ms`,
      metadata: {
        query: result.searchMetadata.query,
        source: result.source,
        confidence: result.searchMetadata.confidence,
        matchedKeywords: result.searchMetadata.matchedKeywords,
        cacheHit: result.cacheHit,
        searchTime: result.searchMetadata.searchTime
      }
    })

  } catch (error) {
    console.error('Error en API de búsqueda híbrida:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        message: 'Error al realizar la búsqueda híbrida',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      query = '',
      maxResults = 20,
      minConfidence = 25
    } = body

    if (!query.trim()) {
      return NextResponse.json({ 
        error: 'Query is required',
        message: 'La consulta de búsqueda es requerida'
      }, { status: 400 })
    }

    // Validar parámetros
    if (maxResults > 50) {
      return NextResponse.json({ 
        error: 'maxResults cannot exceed 50',
        message: 'El máximo de resultados no puede exceder 50'
      }, { status: 400 })
    }

    if (minConfidence < 0 || minConfidence > 100) {
      return NextResponse.json({ 
        error: 'minConfidence must be between 0 and 100',
        message: 'La confianza mínima debe estar entre 0 y 100'
      }, { status: 400 })
    }

    const searchOptions: SearchOptions = {
      query: query.trim(),
      maxResults,
      minConfidence
    }

    console.log(`🔍 Búsqueda híbrida POST iniciada: "${query}" (maxResults: ${maxResults}, minConfidence: ${minConfidence})`)

    const result = await HybridSearchService.hybridSearch(searchOptions)

    console.log(`✅ Búsqueda híbrida POST completada:`, {
      query: result.searchMetadata.query,
      source: result.source,
      totalResults: result.totalResults,
      cacheHit: result.cacheHit,
      searchTime: result.searchMetadata.searchTime,
      confidence: result.searchMetadata.confidence
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: `Búsqueda completada en ${result.searchMetadata.searchTime}ms`,
      metadata: {
        query: result.searchMetadata.query,
        source: result.source,
        confidence: result.searchMetadata.confidence,
        matchedKeywords: result.searchMetadata.matchedKeywords,
        cacheHit: result.cacheHit,
        searchTime: result.searchMetadata.searchTime
      }
    })

  } catch (error) {
    console.error('Error en API de búsqueda híbrida POST:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        message: 'Error al realizar la búsqueda híbrida',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

