import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/meilisearch/client'

export async function GET() {
  try {
    // Obtener categorías de Meilisearch
    const categories = await getCategories()
    
    return NextResponse.json({
      success: true,
      data: categories,
      message: `Se encontraron ${categories.length} categorías`,
    })
    
  } catch (error) {
    console.error('Error in meilisearch-categories API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor al obtener categorías',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
