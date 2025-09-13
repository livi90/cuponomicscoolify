#!/usr/bin/env node

/**
 * Script para verificar la base de datos de tiendas de afiliados
 * Ejecutar con: node scripts/check-database.js
 */

// Simular la estructura de la base de datos
console.log('🔍 VERIFICACIÓN DE BASE DE DATOS DE TIENDAS\n')

console.log('📋 ESTRUCTURA REQUERIDA EN LA TABLA `stores`:')
console.log('```sql')
console.log('CREATE TABLE stores (')
console.log('  id uuid PRIMARY KEY,')
console.log('  name text NOT NULL,')
console.log('  affiliate_network text,')
console.log('  "publisherId" text,')
console.log('  "advertiserId" text,')
console.log('  is_active boolean DEFAULT true')
console.log(');')
console.log('```\n')

console.log('📝 DATOS REQUERIDOS PARA ENLACES DE AFILIADO:\n')

console.log('🏪 EL CORTE INGLÉS (AWIN):')
console.log('```sql')
console.log('INSERT INTO stores (name, affiliate_network, "publisherId", "advertiserId", is_active)')
console.log('VALUES (')
console.log('  \'El Corte Inglés\',')
console.log('  \'AWIN\',')
console.log('  \'TU_PUBLISHER_ID_AQUI\',')
console.log('  \'TU_ADVERTISER_ID_AQUI\',')
console.log('  true')
console.log(');')
console.log('```\n')

console.log('🏪 FNAC (AWIN):')
console.log('```sql')
console.log('INSERT INTO stores (name, affiliate_network, "publisherId", "advertiserId", is_active)')
console.log('VALUES (')
console.log('  \'FNAC\',')
console.log('  \'AWIN\',')
console.log('  \'TU_PUBLISHER_ID_AQUI\',')
console.log('  \'TU_ADVERTISER_ID_AQUI\',')
console.log('  true')
console.log(');')
console.log('```\n')

console.log('🏪 MEDIAMARKT (AWIN):')
console.log('```sql')
console.log('INSERT INTO stores (name, affiliate_network, "publisherId", "advertiserId", is_active)')
console.log('VALUES (')
console.log('  \'MediaMarkt\',')
console.log('  \'AWIN\',')
console.log('  \'TU_PUBLISHER_ID_AQUI\',')
console.log('  \'TU_ADVERTISER_ID_AQUI\',')
console.log('  true')
console.log(');')
console.log('```\n')

console.log('🏪 AMAZON (AMAZON ASSOCIATES):')
console.log('```sql')
console.log('INSERT INTO stores (name, affiliate_network, "publisherId", is_active)')
console.log('VALUES (')
console.log('  \'Amazon\',')
console.log('  \'AMAZON\',')
console.log('  \'TU_AMAZON_TAG_AQUI\',')
console.log('  true')
console.log(');')
console.log('```\n')

console.log('🏪 EBAY (EBAY PARTNER NETWORK):')
console.log('```sql')
console.log('INSERT INTO stores (name, affiliate_network, is_active)')
console.log('VALUES (')
console.log('  \'eBay\',')
console.log('  \'EBAY\',')
console.log('  true')
console.log(');')
console.log('```\n')

console.log('🎯 VERIFICACIONES IMPORTANTES:\n')

console.log('1. ✅ Nombres exactos:')
console.log('   - "El Corte Inglés" (con tilde)')
console.log('   - "FNAC" (en mayúsculas)')
console.log('   - "MediaMarkt" (con M mayúscula)')
console.log('   - "Amazon" (primera letra mayúscula)')
console.log('   - "eBay" (con e minúscula y B mayúscula)\n')

console.log('2. ✅ Valores de affiliate_network:')
console.log('   - "AWIN" (para El Corte Inglés, FNAC, MediaMarkt)')
console.log('   - "AMAZON" (para Amazon)')
console.log('   - "EBAY" (para eBay)\n')

console.log('3. ✅ Campos requeridos:')
console.log('   - AWIN: publisherId + advertiserId')
console.log('   - AMAZON: publisherId')
console.log('   - EBAY: solo affiliate_network\n')

console.log('4. ✅ Estado activo:')
console.log('   - is_active = true\n')

console.log('🔧 COMANDOS PARA VERIFICAR EN SUPABASE:\n')

console.log('-- Ver todas las tiendas')
console.log('SELECT name, affiliate_network, "publisherId", "advertiserId", is_active FROM stores;\n')

console.log('-- Ver solo tiendas activas')
console.log('SELECT name, affiliate_network, "publisherId", "advertiserId" FROM stores WHERE is_active = true;\n')

console.log('-- Ver tiendas AWIN')
console.log('SELECT name, "publisherId", "advertiserId" FROM stores WHERE affiliate_network = \'AWIN\' AND is_active = true;\n')

console.log('-- Ver tiendas Amazon')
console.log('SELECT name, "publisherId" FROM stores WHERE affiliate_network = \'AMAZON\' AND is_active = true;\n')

console.log('-- Ver tiendas eBay')
console.log('SELECT name FROM stores WHERE affiliate_network = \'EBAY\' AND is_active = true;\n')

console.log('🚨 PROBLEMAS COMUNES:\n')

console.log('1. ❌ Nombres incorrectos:')
console.log('   - "el corte ingles" (sin tilde)')
console.log('   - "fnac" (minúsculas)')
console.log('   - "mediamarkt" (minúsculas)\n')

console.log('2. ❌ affiliate_network incorrecto:')
console.log('   - "awin" (minúsculas)')
console.log('   - "amazon" (minúsculas)')
console.log('   - "ebay" (minúsculas)\n')

console.log('3. ❌ Campos faltantes:')
console.log('   - publisherId o advertiserId vacíos para AWIN')
console.log('   - publisherId vacío para Amazon\n')

console.log('4. ❌ Estado inactivo:')
console.log('   - is_active = false\n')

console.log('💡 SOLUCIÓN RÁPIDA:\n')

console.log('Si no tienes datos en la tabla stores, ejecuta estos INSERTs con tus IDs reales:\n')

console.log('-- Para AWIN (reemplaza con tus IDs reales)')
console.log('INSERT INTO stores (name, affiliate_network, "publisherId", "advertiserId", is_active) VALUES')
console.log('  (\'El Corte Inglés\', \'AWIN\', \'TU_PUBLISHER_ID\', \'TU_ADVERTISER_ID\', true),')
console.log('  (\'FNAC\', \'AWIN\', \'TU_PUBLISHER_ID\', \'TU_ADVERTISER_ID\', true),')
console.log('  (\'MediaMarkt\', \'AWIN\', \'TU_PUBLISHER_ID\', \'TU_ADVERTISER_ID\', true);\n')

console.log('-- Para Amazon (reemplaza con tu tag real)')
console.log('INSERT INTO stores (name, affiliate_network, "publisherId", is_active) VALUES')
console.log('  (\'Amazon\', \'AMAZON\', \'TU_AMAZON_TAG\', true);\n')

console.log('-- Para eBay')
console.log('INSERT INTO stores (name, affiliate_network, is_active) VALUES')
console.log('  (\'eBay\', \'EBAY\', true);\n')

console.log('🎯 DESPUÉS DE INSERTAR LOS DATOS:')
console.log('1. ✅ Reinicia tu aplicación')
console.log('2. ✅ Haz una búsqueda de prueba')
console.log('3. ✅ Revisa la consola del navegador')
console.log('4. ✅ Verifica que aparezcan los enlaces de afiliado correctos')
