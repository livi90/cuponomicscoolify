import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { meilisearchClient } from '@/lib/meilisearch/client'

export async function POST(
  request: NextRequest,
  { params }: { params: { indexName: string } }
) {
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

    const { indexName } = params
    const { query = '', limit = 20, offset = 0, filter, sort } = await request.json()

    if (!indexName) {
      return NextResponse.json(
        { error: 'Nombre del índice es requerido' },
        { status: 400 }
      )
    }

    // Obtener el índice
    const index = meilisearchClient.index(indexName)
    
    // Configurar opciones de búsqueda
    const searchOptions: any = {
      limit: Math.min(limit, 100), // Máximo 100 resultados
      offset: Math.max(offset, 0)
    }

    if (filter) {
      searchOptions.filter = filter
    }

    if (sort) {
      searchOptions.sort = sort
    }

    // Realizar búsqueda
    const searchResults = await index.search(query, searchOptions)

    return NextResponse.json({
      hits: searchResults.hits,
      query: searchResults.query,
      processingTimeMs: searchResults.processingTimeMs,
      limit: searchResults.limit,
      offset: searchResults.offset,
      estimatedTotalHits: searchResults.estimatedTotalHits,
      hitsPerPage: searchResults.hitsPerPage,
      page: searchResults.page,
      totalHits: searchResults.totalHits,
      totalPages: searchResults.totalPages
    })
  } catch (error) {
    console.error(`Error en POST /api/admin/meilisearch/indices/${params.indexName}/search:`, error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'El índice no existe' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
