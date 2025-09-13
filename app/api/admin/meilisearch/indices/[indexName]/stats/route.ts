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
    
    // Obtener estadísticas
    const stats = await index.getStats()
    
    // Obtener información del índice
    const indexInfo = await index.fetchInfo()
    
    // Obtener distribución de campos (muestra de documentos)
    let fieldDistribution: Record<string, number> = {}
    try {
      const sampleDocs = await index.search('', { limit: 100 })
      if (sampleDocs.hits.length > 0) {
        sampleDocs.hits.forEach((doc: any) => {
          Object.keys(doc).forEach(key => {
            fieldDistribution[key] = (fieldDistribution[key] || 0) + 1
          })
        })
      }
    } catch (error) {
      console.warn('No se pudieron obtener campos de muestra:', error)
    }

    const indexStats = {
      numberOfDocuments: stats.numberOfDocuments,
      isIndexing: stats.isIndexing,
      fieldDistribution,
      createdAt: indexInfo.createdAt,
      updatedAt: indexInfo.updatedAt,
      primaryKey: indexInfo.primaryKey
    }

    return NextResponse.json({ stats: indexStats })
  } catch (error) {
    console.error(`Error en GET /api/admin/meilisearch/indices/${params.indexName}/stats:`, error)
    
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
