#!/usr/bin/env node

/**
 * Script de prueba específico para verificar la búsqueda de tiendas
 * Uso: node scripts/test-store-search.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function testStoreSearch() {
  console.log('🏪 Probando búsqueda de tiendas...\n')
  
  const testCases = [
    {
      name: 'Búsqueda general de tiendas',
      url: `${BASE_URL}/buscar-ofertas?search=amazon`,
      expected: 'debería mostrar tiendas que contengan "amazon"'
    },
    {
      name: 'Búsqueda de tienda específica',
      url: `${BASE_URL}/buscar-ofertas?store=test-store-id`,
      expected: 'debería mostrar cupones de la tienda específica'
    },
    {
      name: 'Búsqueda por categoría',
      url: `${BASE_URL}/buscar-ofertas?category=tecnologia`,
      expected: 'debería mostrar cupones de tiendas en categoría tecnología'
    },
    {
      name: 'Búsqueda de productos outlet',
      url: `${BASE_URL}/buscar-ofertas?search=zapatos`,
      expected: 'debería mostrar productos outlet que contengan "zapatos"'
    },
    {
      name: 'Búsqueda mixta',
      url: `${BASE_URL}/buscar-ofertas?search=oferta`,
      expected: 'debería mostrar tiendas, cupones y productos outlet con "oferta"'
    }
  ]

  for (const testCase of testCases) {
    try {
      console.log(`🧪 ${testCase.name}...`)
      const response = await fetch(testCase.url)
      
      if (response.ok) {
        const html = await response.text()
        
        // Verificar que la página carga correctamente
        if (html.includes('error') || html.includes('Error')) {
          console.log(`❌ ${testCase.name}: La página contiene errores`)
        } else if (html.includes('Cuponomics') || html.includes('cuponomics')) {
          console.log(`✅ ${testCase.name}: Página carga correctamente`)
          
          // Verificar elementos específicos según el tipo de búsqueda
          if (testCase.name.includes('tiendas') && html.includes('Tiendas encontradas')) {
            console.log(`   ✅ Contiene sección de tiendas encontradas`)
          }
          
          if (testCase.name.includes('productos outlet') && html.includes('Productos de Outlet encontrados')) {
            console.log(`   ✅ Contiene sección de productos outlet`)
          }
          
          if (testCase.name.includes('mixta')) {
            if (html.includes('Tiendas encontradas') || html.includes('Productos de Outlet encontrados')) {
              console.log(`   ✅ Contiene resultados mixtos`)
            }
          }
          
        } else {
          console.log(`⚠️ ${testCase.name}: Página carga pero contenido inesperado`)
        }
        
      } else {
        console.log(`❌ ${testCase.name}: Error HTTP ${response.status}`)
      }
      
    } catch (error) {
      console.log(`❌ ${testCase.name}: Error de conexión - ${error.message}`)
    }
    
    console.log('')
  }

  // Probar sugerencias de búsqueda
  console.log('🧪 Probando sugerencias de búsqueda...')
  try {
    // Simular una búsqueda en el frontend
    const searchResponse = await fetch(`${BASE_URL}/buscar-ofertas?search=test`)
    if (searchResponse.ok) {
      const searchHtml = await searchResponse.text()
      
      // Verificar que el formulario de búsqueda está presente
      if (searchHtml.includes('placeholder="Buscar tiendas, productos outlet, cupones, categorías..."')) {
        console.log('✅ Formulario de búsqueda con placeholder correcto')
      } else {
        console.log('⚠️ Formulario de búsqueda no encontrado o placeholder incorrecto')
      }
      
      // Verificar que hay elementos de búsqueda
      if (searchHtml.includes('search') && searchHtml.includes('input')) {
        console.log('✅ Elementos de búsqueda presentes')
      } else {
        console.log('⚠️ Elementos de búsqueda no encontrados')
      }
      
    } else {
      console.log('❌ Error al cargar página de búsqueda')
    }
  } catch (error) {
    console.log('❌ Error al probar sugerencias:', error.message)
  }

  console.log('')
  console.log('🎉 Pruebas de búsqueda de tiendas completadas!')
}

// Ejecutar las pruebas
testStoreSearch() 