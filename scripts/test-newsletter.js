#!/usr/bin/env node

/**
 * Script de prueba para verificar el sistema de newsletter
 * Uso: node scripts/test-newsletter.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function testNewsletterSystem() {
  console.log('🧪 Probando sistema de newsletter...\n')
  
  try {
    // 1. Verificar estado del sistema
    console.log('1️⃣ Verificando estado del sistema...')
    const statusResponse = await fetch(`${BASE_URL}/api/newsletter/status`)
    const statusData = await statusResponse.json()
    
    if (statusResponse.ok) {
      console.log('✅ Estado del sistema:', statusData.status)
      console.log('📊 Estadísticas:', statusData.stats)
      console.log('🗄️ Tablas:', Object.keys(statusData.tables).map(table => 
        `${table}: ${statusData.tables[table].exists ? '✅' : '❌'}`
      ).join(', '))
    } else {
      console.log('❌ Error al verificar estado:', statusData.message)
      return
    }
    
    console.log('')
    
    // 2. Probar suscripción
    console.log('2️⃣ Probando suscripción al newsletter...')
    const testEmail = `test-${Date.now()}@example.com`
    
    const subscribeResponse = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        first_name: 'Test',
        last_name: 'User',
        country: 'ES',
        language: 'es',
        source: 'test-script',
        utm_source: 'test',
        utm_medium: 'script',
        utm_campaign: 'newsletter-test'
      }),
    })
    
    const subscribeData = await subscribeResponse.json()
    
    if (subscribeResponse.ok) {
      console.log('✅ Suscripción exitosa:', subscribeData.message)
    } else {
      console.log('❌ Error en suscripción:', subscribeData.message)
      if (subscribeData.errors) {
        console.log('   Errores:', subscribeData.errors)
      }
    }
    
    console.log('')
    
    // 3. Probar suscripción duplicada
    console.log('3️⃣ Probando suscripción duplicada...')
    const duplicateResponse = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        source: 'test-script-duplicate'
      }),
    })
    
    const duplicateData = await duplicateResponse.json()
    
    if (duplicateResponse.status === 400) {
      console.log('✅ Correctamente rechazó suscripción duplicada:', duplicateData.message)
    } else {
      console.log('⚠️ Comportamiento inesperado en suscripción duplicada:', duplicateData)
    }
    
    console.log('')
    
    // 4. Probar email inválido
    console.log('4️⃣ Probando email inválido...')
    const invalidResponse = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email',
        source: 'test-script'
      }),
    })
    
    const invalidData = await invalidResponse.json()
    
    if (invalidResponse.status === 400) {
      console.log('✅ Correctamente rechazó email inválido:', invalidData.message)
    } else {
      console.log('⚠️ Comportamiento inesperado con email inválido:', invalidData)
    }
    
    console.log('')
    
    // 5. Verificar estadísticas actualizadas
    console.log('5️⃣ Verificando estadísticas actualizadas...')
    const updatedStatusResponse = await fetch(`${BASE_URL}/api/newsletter/status`)
    const updatedStatusData = await updatedStatusResponse.json()
    
    if (updatedStatusResponse.ok) {
      console.log('📊 Estadísticas actualizadas:', updatedStatusData.stats)
      const difference = updatedStatusData.stats.totalSubscribers - statusData.stats.totalSubscribers
      if (difference > 0) {
        console.log('✅ Se agregó correctamente el suscriptor de prueba')
      } else {
        console.log('⚠️ No se detectó cambio en el número de suscriptores')
      }
    }
    
    console.log('')
    console.log('🎉 Pruebas completadas!')
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message)
  }
}

// Ejecutar las pruebas
testNewsletterSystem() 