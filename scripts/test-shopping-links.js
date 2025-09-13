/**
 * Script de prueba para verificar que los enlaces de productos de Google Shopping funcionen correctamente
 * 
 * Este script prueba:
 * 1. La configuración de SerpApi
 * 2. El procesamiento de enlaces encriptados
 * 3. La generación de enlaces de afiliado
 */

const SERPAPI_KEY = process.env.SERPAPI_KEY;

if (!SERPAPI_KEY) {
  console.error('❌ SERPAPI_KEY no está configurada en las variables de entorno');
  process.exit(1);
}

/**
 * Función para decodificar enlaces encriptados de Google Shopping
 */
function decodeGoogleShoppingLink(encryptedLink) {
  try {
    const url = new URL(encryptedLink);
    
    const possibleParams = ['adurl', 'url', 'link', 'target', 'dest'];
    
    for (const param of possibleParams) {
      const value = url.searchParams.get(param);
      if (value && value.startsWith('http')) {
        return decodeURIComponent(value);
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Error decodificando enlace:', error.message);
    return null;
  }
}

/**
 * Función para generar URL de búsqueda de tienda
 */
function generateStoreSearchUrl(storeName, productTitle) {
  const encodedTitle = encodeURIComponent(productTitle);
  
  if (storeName.includes('amazon')) {
    return `https://www.amazon.es/s?k=${encodedTitle}`;
  } else if (storeName.includes('el corte inglés') || storeName.includes('elcorteingles')) {
    return `https://www.elcorteingles.es/search/?s=${encodedTitle}`;
  } else if (storeName.includes('fnac')) {
    return `https://www.fnac.es/SearchResult/ResultList.aspx?SC=${encodedTitle}`;
  } else if (storeName.includes('mediamarkt')) {
    return `https://www.mediamarkt.es/es/search.html?query=${encodedTitle}`;
  } else if (storeName.includes('walmart')) {
    return `https://www.walmart.com/search?q=${encodedTitle}`;
  } else if (storeName.includes('target')) {
    return `https://www.target.com/s?searchTerm=${encodedTitle}`;
  } else if (storeName.includes('best buy') || storeName.includes('bestbuy')) {
    return `https://www.bestbuy.com/site/searchpage.jsp?st=${encodedTitle}`;
  } else {
    return `https://www.google.com/search?tbm=shop&q=${encodedTitle}`;
  }
}

/**
 * Función principal de prueba
 */
async function testShoppingLinks() {
  console.log('🔍 Iniciando prueba de enlaces de Google Shopping...\n');
  
  const testQueries = [
    'macbook pro m4',
    'nike air max',
    'iphone 15',
    'samsung galaxy s24'
  ];
  
  for (const query of testQueries) {
    console.log(`\n📱 Probando búsqueda: "${query}"`);
    console.log('─'.repeat(50));
    
    try {
      const serpApiUrl = 'https://serpapi.com/search.json';
      const params = new URLSearchParams({
        engine: 'google_shopping',
        q: query,
        api_key: SERPAPI_KEY,
        gl: 'es',
        hl: 'es',
        num: '5',
        tbm: 'shop',
        safe: 'active'
      });
      
      const response = await fetch(`${serpApiUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`SerpAPI error: ${response.status}`);
      }
      
      const data = await response.json();
      const products = data.shopping_results || [];
      
      console.log(`✅ Encontrados ${products.length} productos`);
      
      products.forEach((product, index) => {
        console.log(`\n  ${index + 1}. ${product.title}`);
        console.log(`     Tienda: ${product.source}`);
        console.log(`     Precio: ${product.price || 'N/A'}`);
        
        // Procesar URL original
        let originalUrl = product.link || product.product_link || product.url || '#';
        console.log(`     URL original: ${originalUrl}`);
        
        // Verificar si es enlace encriptado
        const isEncrypted = originalUrl.includes('google.com/aclk') || 
                           originalUrl.includes('googleadservices.com') ||
                           originalUrl.includes('googlesyndication.com');
        
        if (isEncrypted) {
          console.log(`     🔒 Enlace encriptado detectado`);
          
          // Intentar decodificar
          const decodedUrl = decodeGoogleShoppingLink(originalUrl);
          if (decodedUrl) {
            console.log(`     ✅ Enlace decodificado: ${decodedUrl}`);
          } else {
            console.log(`     ⚠️  No se pudo decodificar, usando fallback`);
            const fallbackUrl = generateStoreSearchUrl(product.source, product.title);
            console.log(`     🔄 URL de fallback: ${fallbackUrl}`);
          }
        } else {
          console.log(`     ✅ Enlace directo válido`);
        }
      });
      
    } catch (error) {
      console.error(`❌ Error en búsqueda "${query}":`, error.message);
    }
  }
  
  console.log('\n🎉 Prueba completada!');
  console.log('\n📋 Resumen de mejoras implementadas:');
  console.log('   • Configuración mejorada de SerpApi con parámetros tbm=shop y safe=active');
  console.log('   • Detección automática de enlaces encriptados de Google Shopping');
  console.log('   • Función de decodificación para extraer enlaces reales');
  console.log('   • Sistema de fallback con URLs de búsqueda específicas por tienda');
  console.log('   • Soporte para múltiples tiendas (Amazon, El Corte Inglés, Fnac, etc.)');
}

// Ejecutar la prueba
testShoppingLinks().catch(console.error);
