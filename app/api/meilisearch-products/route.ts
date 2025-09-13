import { NextRequest, NextResponse } from 'next/server'
import { searchProducts, getCategories, SearchParams } from '@/lib/meilisearch/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extraer parámetros de la URL
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    const hitsPerPage = searchParams.get('hitsPerPage') ? parseInt(searchParams.get('hitsPerPage')!) : undefined
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const sortBy = searchParams.get('sortBy') ? searchParams.get('sortBy')!.split(',') : undefined
    
    // Validar parámetros de paginación
    if (limit && limit > 100) {
      return NextResponse.json(
        { error: 'El límite no puede ser mayor a 100 productos' },
        { status: 400 }
      )
    }
    
    if (hitsPerPage && hitsPerPage > 100) {
      return NextResponse.json(
        { error: 'hitsPerPage no puede ser mayor a 100' },
        { status: 400 }
      )
    }
    
    // Configurar parámetros de búsqueda
    const searchParamsObj: SearchParams = {
      query: query.trim(),
      category,
      limit,
      offset,
      hitsPerPage,
      page,
      minPrice,
      maxPrice,
      sortBy,
    }
    
    // Realizar búsqueda
    const results = await searchProducts(searchParamsObj)
    
    return NextResponse.json({
      success: true,
      data: results,
      message: `Se encontraron productos${category ? ` en la categoría "${category}"` : ''}`,
    })
    
  } catch (error) {
    console.error('Error in meilisearch-products API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor al buscar productos',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar que el cuerpo contenga los parámetros necesarios
    const {
      query = '',
      category,
      limit,
      offset,
      hitsPerPage,
      page,
      minPrice,
      maxPrice,
      sortBy,
      filters = {}
    } = body
    
    // Validar parámetros
    if (limit && limit > 100) {
      return NextResponse.json(
        { error: 'El límite no puede ser mayor a 100 productos' },
        { status: 400 }
      )
    }
    
    // Configurar parámetros de búsqueda
    const searchParamsObj: SearchParams = {
      query: query.trim(),
      category: category || filters.category,
      limit,
      offset,
      hitsPerPage,
      page,
      minPrice: minPrice || filters.minPrice,
      maxPrice: maxPrice || filters.maxPrice,
      sortBy,
    }
    
    // Realizar búsqueda
    const results = await searchProducts(searchParamsObj)
    
    return NextResponse.json({
      success: true,
      data: results,
      message: `Búsqueda completada${category ? ` en la categoría "${category}"` : ''}`,
    })
    
  } catch (error) {
    console.error('Error in meilisearch-products POST API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor al buscar productos',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
