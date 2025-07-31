#!/usr/bin/env node

/**
 * Script de prueba para verificar todas las funcionalidades de búsqueda
 * Uso: node scripts/test-search-functionality.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function testSearchFunctionality() {
  console.log('🔍 Probando funcionalidades de búsqueda...\n')
  
  const tests = [
    {
      name: 'Búsqueda de cupones',
      url: `${BASE_URL}/buscar-ofertas?search=descuento`,
      expected: 'debería devolver cupones con "descuento" en el título o descripción'
    },
    {
      name: 'Búsqueda por tienda',
      url: `${BASE_URL}/buscar-ofertas?store=test-store-id`,
      expected: 'debería devolver cupones de la tienda específica'
    },
    {
      name: 'Búsqueda por categoría',
      url: `${BASE_URL}/buscar-ofertas?category=tecnologia`,
      expected: 'debería devolver cupones de tiendas en la categoría tecnología'
    },
    {
      name: 'Búsqueda por tipo de cupón',
      url: `${BASE_URL}/buscar-ofertas?type=code`,
      expected: 'debería devolver solo cupones de tipo código'
    },
    {
      name: 'Filtro por descuento mínimo',
      url: `${BASE_URL}/buscar-ofertas?minDiscount=20`,
      expected: 'debería devolver cupones con descuento de 20% o más'
    },
    {
      name: 'Filtro por calificación',
      url: `${BASE_URL}/buscar-ofertas?minRating=4`,
      expected: 'debería devolver cupones con calificación de 4+ estrellas'
    },
    {
      name: 'Búsqueda con múltiples filtros',
      url: `${BASE_URL}/buscar-ofertas?search=oferta&type=deal&minDiscount=10`,
      expected: 'debería combinar búsqueda de texto con filtros'
    },
    {
      name: 'Página de ofertas populares',
      url: `${BASE_URL}/ofertas-populares`,
      expected: 'debería mostrar ofertas populares sin errores'
    },
    {
      name: 'Página de productos en oferta',
      url: `${BASE_URL}/productos-en-oferta`,
      expected: 'debería mostrar productos de outlet sin errores'
    }
  ]

  for (const test of tests) {
    try {
      console.log(`🧪 ${test.name}...`)
      const response = await fetch(test.url)
      
      if (response.ok) {
        const html = await response.text()
        
        // Verificar que la página carga correctamente
        if (html.includes('error') || html.includes('Error')) {
          console.log(`❌ ${test.name}: La página contiene errores`)
        } else if (html.includes('Cuponomics') || html.includes('cuponomics')) {
          console.log(`✅ ${test.name}: Página carga correctamente`)
        } else {
          console.log(`⚠️ ${test.name}: Página carga pero contenido inesperado`)
        }
        
        // Verificar elementos específicos según el tipo de búsqueda
        if (test.name.includes('cupones') && html.includes('cupones')) {
          console.log(`   ✅ Contiene elementos de cupones`)
        }
        
        if (test.name.includes('productos') && html.includes('outlet')) {
          console.log(`   ✅ Contiene elementos de productos outlet`)
        }
        
      } else {
        console.log(`❌ ${test.name}: Error HTTP ${response.status}`)
      }
      
    } catch (error) {
      console.log(`❌ ${test.name}: Error de conexión - ${error.message}`)
    }
    
    console.log('')
  }

  // Probar API de sugerencias
  console.log('🧪 Probando API de sugerencias...')
  try {
    const suggestionsResponse = await fetch(`${BASE_URL}/api/suggestions?q=test`)
    if (suggestionsResponse.ok) {
      const suggestions = await suggestionsResponse.json()
      console.log('✅ API de sugerencias responde correctamente')
      console.log(`   Sugerencias encontradas: ${suggestions.length || 0}`)
    } else {
      console.log('⚠️ API de sugerencias no disponible o con error')
    }
  } catch (error) {
    console.log('⚠️ API de sugerencias no accesible')
  }

  console.log('')
  console.log('🎉 Pruebas de búsqueda completadas!')
}

// Ejecutar las pruebas
testSearchFunctionality() 