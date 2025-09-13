// Script para probar el sistema de búsqueda universal
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan las variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testUniversalSearch() {
  console.log('🔍 Iniciando pruebas del sistema de búsqueda universal...\n')
  
  try {
    // Test 1: Verificar extracción de palabras clave
    console.log('📋 Test 1: Verificando extracción de palabras clave')
    
    try {
      const response = await fetch('http://localhost:3000/api/universal-search?action=keywords')
      const data = await response.json()
      
      if (data.success) {
        console.log(`✅ Total palabras clave extraídas: ${data.totalKeywords}`)
        console.log(`📝 Muestra de palabras: ${data.sampleKeywords.slice(0, 10).join(', ')}...`)
        console.log(`🕒 Última actualización: ${new Date(data.lastUpdated).toLocaleString()}`)
      } else {
        console.log('❌ Error obteniendo palabras clave')
      }
    } catch (error) {
      console.log('❌ Error en test de palabras clave:', error.message)
    }

    // Test 2: Probar análisis de consultas diversas
    console.log('\n🧪 Test 2: Probando análisis de consultas diversas')
    
    const testQueries = [
      // Búsquedas que DEBERÍAN detectar Nike
      'air max 90',
      'jordan retro',
      'nike dunk low',
      'zapatillas nike',
      'cortez classic',
      'air force 1',
      'react element',
      'zoom pegasus',
      'lebron james',
      'kobe bryant',
      
      // Búsquedas que NO deberían detectar Nike
      'adidas ultraboost',
      'converse all star',
      'vans old skool',
      'puma suede',
      'reebok classic',
      'new balance 574',
      'camiseta casual',
      'pantalones jeans',
      'reloj digital',
      'auriculares bluetooth',
      
      // Búsquedas ambiguas
      'zapatillas running',
      'calzado deportivo',
      'sneakers retro',
      'basketball shoes',
      'flyknit technology'
    ]

    for (const query of testQueries) {
      try {
        const response = await fetch(`http://localhost:3000/api/universal-search?action=analyze&q=${encodeURIComponent(query)}`)
        const data = await response.json()
        
        if (data.success) {
          const analysis = data.analysis
          const icon = analysis.shouldIncludeNike ? '✅' : '❌'
          const confidence = analysis.confidence
          const matched = analysis.matchedKeywords.join(', ')
          
          console.log(`${icon} "${query}": ${confidence}% (${matched || 'sin coincidencias'})`)
        } else {
          console.log(`⚠️ Error analizando "${query}"`)
        }
      } catch (error) {
        console.log(`❌ Error en "${query}":`, error.message)
      }
    }

    // Test 3: Probar búsqueda completa con diferentes niveles de confianza
    console.log('\n🎯 Test 3: Probando búsqueda completa con diferentes umbrales')
    
    const searchTests = [
      { query: 'nike air max', minConfidence: 50 },
      { query: 'air force 1', minConfidence: 30 },
      { query: 'zapatillas deporte', minConfidence: 20 },
      { query: 'jordan basketball', minConfidence: 40 },
      { query: 'running shoes', minConfidence: 25 }
    ]

    for (const test of searchTests) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/universal-search?q=${encodeURIComponent(test.query)}&minConfidence=${test.minConfidence}&maxResults=5`
        )
        const data = await response.json()
        
        if (data.success) {
          const result = data.result
          const status = result.hasNikeResults ? '✅' : '❌'
          
          console.log(`${status} "${test.query}" (min: ${test.minConfidence}%):`)
          console.log(`   - Confianza: ${result.confidence}%`)
          console.log(`   - Productos: ${result.nikeProducts?.length || 0}`)
          console.log(`   - Palabras: ${result.matchedKeywords?.join(', ') || 'ninguna'}`)
        }
      } catch (error) {
        console.log(`❌ Error en búsqueda "${test.query}":`, error.message)
      }
    }

    // Test 4: Verificar que el endpoint de productos general usa el sistema universal
    console.log('\n🔄 Test 4: Verificando integración con API de productos')
    
    const productSearchTests = ['nike air', 'jordan', 'air max']
    
    for (const query of productSearchTests) {
      try {
        const response = await fetch(`http://localhost:3000/api/search-products?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        
        if (data.source === 'nike_database') {
          console.log(`✅ "${query}": Usó base de datos Nike (${data.results?.length || 0} productos)`)
          if (data.metadata) {
            console.log(`   - Confianza: ${data.metadata.confidence}%`)
            console.log(`   - Palabras: ${data.metadata.matchedKeywords?.join(', ') || 'ninguna'}`)
          }
        } else {
          console.log(`⚠️ "${query}": Usó ${data.source || 'fuente desconocida'}`)
        }
      } catch (error) {
        console.log(`❌ Error en productos "${query}":`, error.message)
      }
    }

    // Test 5: Probar actualización de cache
    console.log('\n🔄 Test 5: Probando actualización de cache')
    
    try {
      const response = await fetch('http://localhost:3000/api/universal-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh-keywords' })
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log(`✅ Cache actualizado: ${data.totalKeywords} palabras clave`)
      } else {
        console.log('❌ Error actualizando cache')
      }
    } catch (error) {
      console.log('❌ Error en actualización de cache:', error.message)
    }

    console.log('\n🎉 Pruebas del sistema universal completadas!')
    console.log('\n📋 Resumen:')
    console.log('- El sistema ahora extrae palabras clave reales de tus productos Nike')
    console.log('- Cualquier búsqueda que contenga esas palabras mostrará productos Nike')
    console.log('- El nivel de confianza se basa en cuántas palabras coinciden')
    console.log('- Funciona desde cualquier barra de búsqueda en tu aplicación')
    
  } catch (error) {
    console.error('💥 Error general en las pruebas:', error)
  }
}

// Función para mostrar ejemplos de integración
function showIntegrationExamples() {
  console.log('\n📚 Ejemplos de integración:')
  console.log(`
// En cualquier componente:
import { useUniversalSearch } from '@/hooks/use-universal-search'

function SearchComponent() {
  const { result, search, isLoading } = useUniversalSearch()
  
  const handleSearch = (query) => {
    search(query)
  }
  
  return (
    <div>
      {result.hasNikeResults && (
        <div>
          <h3>Productos Nike encontrados ({result.confidence}% relevancia)</h3>
          {result.nikeProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

// O usar el componente universal:
import { UniversalSearchResults } from '@/components/search/universal-search-results'

<UniversalSearchResults 
  query={searchQuery}
  maxResults={8}
  minConfidence={25}
  compact={true}
/>
`)
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testUniversalSearch().then(() => {
    showIntegrationExamples()
  })
}

export { testUniversalSearch }
