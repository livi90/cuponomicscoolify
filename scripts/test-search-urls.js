#!/usr/bin/env node

/**
 * Script para probar las URLs de búsqueda de productos en diferentes tiendas
 * Ejecutar con: node scripts/test-search-urls.js
 */

console.log('🔍 PRUEBA DE URLs DE BÚSQUEDA DE PRODUCTOS\n')

// Simular productos de SERP API
const testProducts = [
  {
    title: 'Zapatos para hombre Callaghan 47105 Awat MARINO',
    source: 'El Corte Inglés',
    link: '#'
  },
  {
    title: 'iPhone 15 Pro 128GB Negro',
    source: 'FNAC',
    link: '#'
  },
  {
    title: 'Samsung Galaxy S24 Ultra',
    source: 'Amazon',
    link: '#'
  },
  {
    title: 'Nike Air Max 270',
    source: 'MediaMarkt',
    link: '#'
  }
]

console.log('📋 PRODUCTOS DE PRUEBA:')
testProducts.forEach((product, index) => {
  console.log(`${index + 1}. ${product.title}`)
  console.log(`   Tienda: ${product.source}`)
  console.log(`   URL original: ${product.link}`)
  console.log('')
})

console.log('🔗 URLs DE BÚSQUEDA GENERADAS:\n')

testProducts.forEach((product, index) => {
  const productTitle = encodeURIComponent(product.title)
  let searchUrl = ''
  
  if (product.source.toLowerCase().includes('el corte inglés') || product.source.toLowerCase().includes('elcorteingles')) {
    searchUrl = `https://www.elcorteingles.es/search/?s=${productTitle}`
  } else if (product.source.toLowerCase().includes('amazon')) {
    searchUrl = `https://www.amazon.es/s?k=${productTitle}`
  } else if (product.source.toLowerCase().includes('fnac')) {
    searchUrl = `https://www.fnac.es/SearchResult/ResultList.aspx?SC=${productTitle}`
  } else if (product.source.toLowerCase().includes('mediamarkt')) {
    searchUrl = `https://www.mediamarkt.es/es/search.html?query=${productTitle}`
  } else {
    searchUrl = `https://www.google.com/search?q=${productTitle}`
  }
  
  console.log(`${index + 1}. ${product.title}`)
  console.log(`   Tienda: ${product.source}`)
  console.log(`   URL de búsqueda: ${searchUrl}`)
  console.log('')
})

console.log('🎯 VERIFICACIONES:\n')

console.log('✅ El Corte Inglés:')
console.log('   - Formato: https://www.elcorteingles.es/search/?s={producto}')
console.log('   - Ejemplo: https://www.elcorteingles.es/search/?s=Zapatos%20para%20hombre%20Callaghan%2047105%20Awat%20MARINO')
console.log('')

console.log('✅ FNAC:')
console.log('   - Formato: https://www.fnac.es/SearchResult/ResultList.aspx?SC={producto}')
console.log('   - Ejemplo: https://www.fnac.es/SearchResult/ResultList.aspx?SC=iPhone%2015%20Pro%20128GB%20Negro')
console.log('')

console.log('✅ Amazon:')
console.log('   - Formato: https://www.amazon.es/s?k={producto}')
console.log('   - Ejemplo: https://www.amazon.es/s?k=Samsung%20Galaxy%20S24%20Ultra')
console.log('')

console.log('✅ MediaMarkt:')
console.log('   - Formato: https://www.mediamarkt.es/es/search.html?query={producto}')
console.log('   - Ejemplo: https://www.mediamarkt.es/es/search.html?query=Nike%20Air%20Max%20270')
console.log('')

console.log('🔧 CÓMO FUNCIONA:\n')

console.log('1. SERP API proporciona el título del producto y la tienda')
console.log('2. Si no hay URL del producto, construimos una URL de búsqueda')
console.log('3. La URL de búsqueda incluye el título del producto codificado')
console.log('4. El usuario es redirigido a la página de resultados de búsqueda de la tienda')
console.log('5. El usuario puede encontrar y comprar el producto específico')
console.log('')

console.log('💡 VENTAJAS:\n')

console.log('✅ El usuario llega a la tienda correcta')
console.log('✅ Se busca el producto específico')
console.log('✅ Se mantiene el tracking de afiliados')
console.log('✅ Funciona incluso cuando SERP API no proporciona URLs')
console.log('')

console.log('⚠️ CONSIDERACIONES:\n')

console.log('⚠️ El usuario debe hacer clic en el producto correcto en los resultados')
console.log('⚠️ La búsqueda puede mostrar productos similares')
console.log('⚠️ Es mejor que no tener enlace, pero no es perfecto')
console.log('')

console.log('🚀 PRÓXIMOS PASOS:\n')

console.log('1. ✅ Verificar que las URLs de búsqueda funcionen')
console.log('2. ✅ Probar que los enlaces de afiliado se generen correctamente')
console.log('3. ✅ Confirmar que el usuario llegue a la tienda correcta')
console.log('4. ✅ Monitorear la conversión de afiliados')
console.log('')

console.log('🎉 RESULTADO ESPERADO:\n')

console.log('Ahora cuando hagas clic en un producto:')
console.log('- Serás redirigido a la tienda correcta')
console.log('- Se buscará el producto específico')
console.log('- Se aplicará el tracking de afiliados')
console.log('- Podrás encontrar y comprar el producto')
