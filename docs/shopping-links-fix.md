# Corrección de Enlaces de Google Shopping

## Problema Identificado

El sistema de comparación de precios estaba experimentando problemas con los enlaces de productos que no redirigían correctamente. Esto se debía a que Google Shopping utiliza enlaces encriptados que no funcionan directamente.

## Solución Implementada

### 1. Configuración Mejorada de SerpApi

Se actualizó la configuración de SerpApi para incluir parámetros adicionales que mejoran la obtención de enlaces directos:

```javascript
const params = new URLSearchParams({
  engine: 'google_shopping',
  q: query,
  api_key: SERPAPI_KEY,
  gl: 'es',
  hl: 'es',
  num: limit.toString(),
  // Parámetros adicionales para obtener enlaces directos
  tbm: 'shop',
  safe: 'active'
})
```

### 2. Detección de Enlaces Encriptados

Se implementó un sistema para detectar automáticamente enlaces encriptados de Google Shopping:

```javascript
const isGoogleShoppingLink = productUrl.includes('google.com/aclk') || 
                           productUrl.includes('googleadservices.com') ||
                           productUrl.includes('googlesyndication.com')
```

### 3. Función de Decodificación

Se creó una función que intenta extraer el enlace real de los parámetros de Google Shopping:

```javascript
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
    return null;
  }
}
```

### 4. Sistema de Fallback Inteligente

Cuando no se puede decodificar el enlace, el sistema genera URLs de búsqueda específicas para cada tienda:

- **Amazon**: `https://www.amazon.es/s?k={productTitle}`
- **El Corte Inglés**: `https://www.elcorteingles.es/search/?s={productTitle}`
- **Fnac**: `https://www.fnac.es/SearchResult/ResultList.aspx?SC={productTitle}`
- **MediaMarkt**: `https://www.mediamarkt.es/es/search.html?query={productTitle}`
- **Walmart**: `https://www.walmart.com/search?q={productTitle}`
- **Target**: `https://www.target.com/s?searchTerm={productTitle}`
- **Best Buy**: `https://www.bestbuy.com/site/searchpage.jsp?st={productTitle}`

### 5. Fallback General

Si no se puede identificar la tienda específica, se usa una búsqueda de Google Shopping como fallback:

```javascript
productUrl = `https://www.google.com/search?tbm=shop&q=${productTitle}`
```

## Archivos Modificados

1. **`lib/services/hybrid-search.ts`**
   - Agregada función `decodeGoogleShoppingLink()`
   - Mejorado el procesamiento de enlaces en `searchSerpProducts()`
   - Configuración actualizada de SerpApi

2. **`app/api/search-products/route.ts`**
   - Agregada función `decodeGoogleShoppingLink()`
   - Mejorado el procesamiento de enlaces en el endpoint GET
   - Configuración actualizada de SerpApi

3. **`scripts/test-shopping-links.js`** (nuevo)
   - Script de prueba para verificar el funcionamiento de los enlaces
   - Incluye ejemplos de uso y validación

## Cómo Probar

1. **Ejecutar el script de prueba**:
   ```bash
   node scripts/test-shopping-links.js
   ```

2. **Probar en la aplicación**:
   - Ir a `/comparar-precios`
   - Buscar cualquier producto
   - Verificar que los enlaces redirijan correctamente

3. **Verificar en la consola**:
   - Los logs mostrarán el procesamiento de enlaces
   - Se indicará si se usó decodificación o fallback

## Beneficios

- ✅ **Enlaces funcionales**: Los usuarios pueden acceder a los productos reales
- ✅ **Mejor experiencia**: Redirección directa a las tiendas
- ✅ **Fallback robusto**: Sistema de respaldo para casos edge
- ✅ **Soporte multi-tienda**: Funciona con múltiples comercios
- ✅ **Logging detallado**: Fácil debugging y monitoreo

## Consideraciones Técnicas

- Los enlaces encriptados de Google Shopping pueden cambiar su formato
- El sistema de fallback asegura que siempre haya un enlace funcional
- La decodificación es un proceso de "mejor esfuerzo" - no garantiza 100% de éxito
- Se recomienda monitorear regularmente el funcionamiento de los enlaces

## Próximos Pasos

1. Monitorear el funcionamiento en producción
2. Recopilar feedback de usuarios sobre la experiencia de navegación
3. Considerar implementar tracking de clics para analizar el rendimiento
4. Evaluar la posibilidad de usar APIs específicas de tiendas cuando estén disponibles
