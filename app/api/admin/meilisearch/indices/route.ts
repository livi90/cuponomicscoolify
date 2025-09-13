import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { meilisearchClient } from '@/lib/meilisearch/client'

export async function GET() {
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

    // Obtener lista de índices
    const indices = await meilisearchClient.listIndexes()
    
    // Obtener información detallada de cada índice
    const indicesWithInfo = await Promise.all(
      indices.results.map(async (index) => {
        try {
          const indexInfo = await index.fetchInfo()
          return {
            uid: index.uid,
            name: indexInfo.name || index.uid,
            primaryKey: indexInfo.primaryKey || 'id',
            createdAt: indexInfo.createdAt,
            updatedAt: indexInfo.updatedAt,
            status: 'indexed' // Por defecto, asumimos que está indexado
          }
        } catch (error) {
          console.error(`Error obteniendo información del índice ${index.uid}:`, error)
          return {
            uid: index.uid,
            name: index.uid,
            primaryKey: 'id',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'unknown'
          }
        }
      })
    )

    return NextResponse.json({ indices: indicesWithInfo })
  } catch (error) {
    console.error('Error en GET /api/admin/meilisearch/indices:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

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

    const { name, primaryKey = 'id' } = await request.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Nombre del índice es requerido' },
        { status: 400 }
      )
    }

    // Crear el índice
    const task = await meilisearchClient.createIndex(name, {
      primaryKey: primaryKey
    })

    return NextResponse.json({ 
      success: true, 
      message: `Índice "${name}" creado correctamente`,
      task 
    })
  } catch (error) {
    console.error('Error en POST /api/admin/meilisearch/indices:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'El índice ya existe' },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
