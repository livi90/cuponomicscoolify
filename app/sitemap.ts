import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cuponomics.com'
  
  // Páginas estáticas principales
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/buscar-ofertas`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ofertas-populares`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/productos-en-oferta`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/para-comerciantes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/calificar-cupones`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  try {
    const supabase = await createClient()
    
    // Obtener cupones activos
    const { data: coupons } = await supabase
      .from('coupons')
      .select('id, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1000) // Limitar a 1000 cupones para el sitemap

    const couponUrls = (coupons || []).map((coupon) => ({
      url: `${baseUrl}/cupones/${coupon.id}`,
      lastModified: new Date(coupon.updated_at || coupon.id),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Obtener tiendas activas
    const { data: stores } = await supabase
      .from('stores')
      .select('id, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(500) // Limitar a 500 tiendas

    const storeUrls = (stores || []).map((store) => ({
      url: `${baseUrl}/tiendas/${store.id}`,
      lastModified: new Date(store.updated_at || store.id),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // Obtener productos outlet activos
    const { data: outletProducts } = await supabase
      .from('outlet_products')
      .select('id, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(500) // Limitar a 500 productos

    const productUrls = (outletProducts || []).map((product) => ({
      url: `${baseUrl}/productos/${product.id}`,
      lastModified: new Date(product.updated_at || product.id),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // Combinar todas las URLs
    return [...staticPages, ...couponUrls, ...storeUrls, ...productUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // En caso de error, devolver solo las páginas estáticas
    return staticPages
  }
} 