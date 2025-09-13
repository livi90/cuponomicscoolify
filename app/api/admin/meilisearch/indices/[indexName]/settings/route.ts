import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { meilisearchClient } from '@/lib/meilisearch/client'

export async function GET(
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

    if (!indexName) {
      return NextResponse.json(
        { error: 'Nombre del índice es requerido' },
        { status: 400 }
      )
    }

    // Obtener el índice
    const index = meilisearchClient.index(indexName)
    
    // Obtener configuración
    const [
      searchableAttributes,
      filterableAttributes,
      sortableAttributes,
      rankingRules,
      distinctAttribute,
      pagination
    ] = await Promise.all([
      index.getSearchableAttributes(),
      index.getFilterableAttributes(),
      index.getSortableAttributes(),
      index.getRankingRules(),
      index.getDistinctAttribute(),
      index.getPagination()
    ])

    const settings = {
      searchableAttributes,
      filterableAttributes,
      sortableAttributes,
      rankingRules,
      distinctAttribute,
      pagination
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error(`Error en GET /api/admin/meilisearch/indices/${params.indexName}/settings:`, error)
    
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

export async function PATCH(
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
    const updates = await request.json()

    if (!indexName) {
      return NextResponse.json(
        { error: 'Nombre del índice es requerido' },
        { status: 400 }
      )
    }

    // Obtener el índice
    const index = meilisearchClient.index(indexName)
    
    // Aplicar actualizaciones
    const updatePromises = []

    if (updates.searchableAttributes) {
      updatePromises.push(
        index.updateSearchableAttributes(updates.searchableAttributes)
      )
    }

    if (updates.filterableAttributes) {
      updatePromises.push(
        index.updateFilterableAttributes(updates.filterableAttributes)
      )
    }

    if (updates.sortableAttributes) {
      updatePromises.push(
        index.updateSortableAttributes(updates.sortableAttributes)
      )
    }

    if (updates.rankingRules) {
      updatePromises.push(
        index.updateRankingRules(updates.rankingRules)
      )
    }

    if (updates.distinctAttribute !== undefined) {
      updatePromises.push(
        index.updateDistinctAttribute(updates.distinctAttribute)
      )
    }

    if (updates.pagination) {
      updatePromises.push(
        index.updatePagination(updates.pagination)
      )
    }

    if (updatePromises.length === 0) {
      return NextResponse.json(
        { error: 'No se especificaron actualizaciones válidas' },
        { status: 400 }
      )
    }

    // Ejecutar todas las actualizaciones
    const results = await Promise.all(updatePromises)

    return NextResponse.json({ 
      success: true, 
      message: 'Configuración del índice actualizada correctamente',
      results 
    })
  } catch (error) {
    console.error(`Error en PATCH /api/admin/meilisearch/indices/${params.indexName}/settings:`, error)
    
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
