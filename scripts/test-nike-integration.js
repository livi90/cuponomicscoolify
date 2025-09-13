// Script para probar la integración de productos Nike
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan las variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testNikeIntegration() {
  console.log('🧪 Iniciando pruebas de integración Nike...\n')
  
  try {
    // Test 1: Verificar que las tablas existen y tienen datos
    console.log('📋 Test 1: Verificando tablas de Nike')
    
    const { data: nikeProducts, error: nikeError } = await supabase
      .from('nike_products')
      .select('count')
      .limit(1)
    
    if (nikeError) {
      console.error('❌ Error accediendo a nike_products:', nikeError.message)
      return
    }
    
    const { count: nikeCount } = await supabase
      .from('nike_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
    
    const { count: discountCount } = await supabase
      .from('nike_products_with_discounts')
      .select('*', { count: 'exact', head: true })
    
    console.log(`✅ Nike products table: ${nikeCount || 0} productos activos`)
    console.log(`✅ Nike discounts view: ${discountCount || 0} productos con descuento`)
    
    if ((nikeCount || 0) === 0) {
      console.log('⚠️ No hay productos Nike en la base de datos. Asegúrate de haber importado datos.')
      return
    }
    
    // Test 2: Probar búsqueda de productos Nike
    console.log('\n🔍 Test 2: Probando búsqueda de productos Nike')
    
    const searchQueries = ['nike air max', 'air force', 'jordan', 'nike']
    
    for (const query of searchQueries) {
      try {
        const response = await fetch(`http://localhost:3000/api/search-products?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        
        if (data.source === 'nike_database') {
          console.log(`✅ Búsqueda "${query}": ${data.results?.length || 0} resultados de base de datos Nike`)
        } else {
          console.log(`⚠️ Búsqueda "${query}": Usó SERP API en lugar de base de datos Nike`)
        }
      } catch (error) {
        console.log(`❌ Error en búsqueda "${query}":`, error.message)
      }
    }
    
    // Test 3: Probar API específica de Nike
    console.log('\n🏷️ Test 3: Probando API específica de Nike')
    
    try {
      const response = await fetch('http://localhost:3000/api/nike-products?action=stats')
      const stats = await response.json()
      
      console.log(`✅ Estadísticas Nike:`)
      console.log(`   - Total productos: ${stats.totalProducts}`)
      console.log(`   - Con descuento: ${stats.productsWithDiscount}`)
      console.log(`   - Precio promedio: ${stats.averagePrice}€`)
      console.log(`   - Categorías: ${stats.categories}`)
    } catch (error) {
      console.log(`❌ Error obteniendo estadísticas:`, error.message)
    }
    
    // Test 4: Probar búsqueda con filtros
    console.log('\n🎯 Test 4: Probando búsqueda con filtros')
    
    try {
      const response = await fetch('http://localhost:3000/api/nike-products?q=air&sortBy=discount&hasDiscount=true&limit=5')
      const data = await response.json()
      
      console.log(`✅ Búsqueda filtrada: ${data.results?.length || 0} productos con descuento`)
    } catch (error) {
      console.log(`❌ Error en búsqueda filtrada:`, error.message)
    }
    
    // Test 5: Verificar detección de palabras clave Nike
    console.log('\n🎯 Test 5: Verificando detección de palabras clave')
    
    const testKeywords = [
      { query: 'nike air max', shouldDetect: true },
      { query: 'jordan retro', shouldDetect: true },
      { query: 'adidas ultraboost', shouldDetect: false },
      { query: 'air force 1', shouldDetect: true },
      { query: 'zapatillas running', shouldDetect: false },
      { query: 'nike dunk', shouldDetect: true }
    ]
    
    // Simular la función de detección
    const isNikeRelated = (query) => {
      const nikeKeywords = [
        'nike', 'air max', 'air force', 'jordan', 'dunk', 'blazer', 
        'cortez', 'react', 'zoom', 'vapormax', 'air jordan', 
        'lebron', 'kobe', 'kyrie', 'kevin durant', 'kd'
      ]
      const normalizedQuery = query.toLowerCase()
      return nikeKeywords.some(keyword => normalizedQuery.includes(keyword))
    }
    
    for (const test of testKeywords) {
      const detected = isNikeRelated(test.query)
      const result = detected === test.shouldDetect ? '✅' : '❌'
      console.log(`${result} "${test.query}": ${detected ? 'Detectado' : 'No detectado'} (esperado: ${test.shouldDetect ? 'Sí' : 'No'})`)
    }
    
    console.log('\n🎉 Pruebas de integración Nike completadas!')
    
  } catch (error) {
    console.error('💥 Error general en las pruebas:', error)
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testNikeIntegration()
}

export { testNikeIntegration }
