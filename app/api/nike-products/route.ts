import { NextRequest, NextResponse } from "next/server"
import { NikeProductsService } from "@/lib/services/nike-products"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || undefined
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const hasDiscount = searchParams.get('hasDiscount') === 'true'
    const sortBy = (searchParams.get('sortBy') as 'price' | 'discount' | 'name' | 'updated') || 'discount'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    const action = searchParams.get('action') || 'search'

    switch (action) {
      case 'categories':
        const categories = await NikeProductsService.getCategories()
        return NextResponse.json({
          categories,
          totalCategories: categories.length
        })

      case 'stats':
        const stats = await NikeProductsService.getProductStats()
        return NextResponse.json(stats)

      case 'discounted':
        const discountedProducts = await NikeProductsService.searchDiscountedProducts({
          query,
          category,
          minPrice,
          maxPrice,
          sortBy,
          limit
        })
        return NextResponse.json({
          query,
          category,
          results: discountedProducts,
          totalResults: discountedProducts.length,
          filters: { minPrice, maxPrice, hasDiscount, sortBy }
        })

      case 'search':
      default:
        const products = await NikeProductsService.searchProducts({
          query,
          category,
          minPrice,
          maxPrice,
          hasDiscount,
          sortBy,
          limit
        })
        
        return NextResponse.json({
          query,
          category,
          results: products,
          totalResults: products.length,
          filters: { minPrice, maxPrice, hasDiscount, sortBy }
        })
    }

  } catch (error) {
    console.error('Nike products API error:', error)
    return NextResponse.json(
      { error: 'Error fetching Nike products' },
      { status: 500 }
    )
  }
}

// Endpoint para obtener un producto específico por ID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const product = await NikeProductsService.getProductById(productId)
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      product,
      success: true
    })

  } catch (error) {
    console.error('Nike product by ID error:', error)
    return NextResponse.json(
      { error: 'Error fetching Nike product' },
      { status: 500 }
    )
  }
}
