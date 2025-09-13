# Implementación de Enlaces de Afiliado - Cuponomics

## 📋 Resumen Ejecutivo

Este documento describe la implementación completa del sistema de enlaces de afiliado en Cuponomics, integrando múltiples redes de afiliados (AWIN, eBay Partner Network, y Amazon Associates) para maximizar los ingresos por comisiones.

## 🎯 Objetivos

- **Integrar AWIN** para tiendas que usan esta red de afiliados
- **Implementar eBay Smart Links** para conversión automática de enlaces
- **Preparar Amazon Associates** para futura implementación
- **Optimizar conversiones** con enlaces de afiliado inteligentes
- **Reducir costos** de API mediante caché local

## 🏗️ Arquitectura del Sistema

### Componentes Principales

1. **HybridSearchService** - Servicio principal de búsqueda
2. **Sistema de Enlaces de Afiliado** - Generación automática de enlaces
3. **Caché Local** - Reducción de requests a APIs externas
4. **Scripts de Redes** - Integración con plataformas de afiliados

### Flujo de Datos

```
Búsqueda → Análisis Nike → SERP API → Generación Enlaces → Caché → UI
```

## 🔗 Implementación de Enlaces de Afiliado

### 1. AWIN (Affiliate Window)

#### Configuración
```typescript
// Variables de entorno
AWIN_PUBLISHER_ID=your_publisher_id
AWIN_ADVERTISER_ID=your_advertiser_id
AWIN_OAUTH_TOKEN=a004bf81-8fef-466a-9179-2a1468cff147
```

#### Generación de Enlaces
```typescript
private static generateAwinAffiliateUrl(
  originalUrl: string, 
  publisherId: string, 
  advertiserId: string
): string {
  return `https://www.awin1.com/cread.php?awinmid=${advertiserId}&awinaffid=${publisherId}&clicktracker=&url=${encodeURIComponent(originalUrl)}`
}
```

#### Formato de Enlace
```
https://www.awin1.com/cread.php?awinmid={advertiserId}&awinaffid={publisherId}&clicktracker=&url={encodedUrl}
```

### 2. eBay Partner Network

#### Configuración
```typescript
// Variable de entorno
EBAY_CAMPAIGN_ID=5339118953
```

#### Script de Smart Links
```html
<script>window._epn = {campaign: 5339118953};</script>
<script src="https://epnt.ebay.com/static/epn-smart-tools.js" async></script>
```

#### Características
- **Conversión automática** de todos los enlaces de eBay
- **Optimización móvil** integrada
- **Tracking automático** de conversiones
- **Sin configuración manual** de enlaces

### 3. Amazon Associates

#### Configuración (Futura)
```typescript
// Variable de entorno
AMAZON_PUBLISHER_ID=your_amazon_publisher_id
```

#### Generación de Enlaces
```typescript
private static generateAmazonAffiliateUrl(
  originalUrl: string, 
  publisherId: string
): string {
  const url = new URL(originalUrl)
  url.searchParams.set('tag', publisherId)
  return url.toString()
}
```

## 🗄️ Base de Datos

### Tabla `stores`

```sql
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  red_afiliados VARCHAR(50), -- 'AWIN', 'EBAY', 'AMAZON'
  publisherId VARCHAR(255),
  advertiserId VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Ejemplos de Configuración

```sql
-- AWIN Store
INSERT INTO stores (name, red_afiliados, publisherId, advertiserId) 
VALUES ('Walmart', 'AWIN', '12345', '67890');

-- eBay Store
INSERT INTO stores (name, red_afiliados) 
VALUES ('eBay', 'EBAY');

-- Amazon Store
INSERT INTO stores (name, red_afiliados, publisherId) 
VALUES ('Amazon', 'AMAZON', 'cuponomics-20');
```

## ⚡ Sistema de Caché

### Características
- **localStorage** para persistencia local
- **Expiración automática** configurable
- **Limpieza inteligente** cuando excede el límite
- **Reducción de requests** a APIs externas

### Configuración
```typescript
private static readonly DEFAULT_CACHE_EXPIRY = 60 // 1 hora
private static readonly MAX_CACHE_SIZE = 100 // Máximo 100 búsquedas
```

### Métodos de Caché
```typescript
// Obtener del caché
static getFromCache(query: string): HybridSearchResult | null

// Guardar en caché
static saveToCache(query: string, result: HybridSearchResult, expiryMinutes: number): void

// Limpiar caché
static clearCache(): void

// Estadísticas del caché
static getCacheStats(): { size: number; keys: string[] }
```

## 🔍 API de Búsqueda

### SERP API - Google Shopping Light

#### Endpoint
```
https://serpapi.com/search.json?engine=google_shopping&q={query}&api_key={key}&num={limit}
```

#### Configuración
```typescript
// Variable de entorno
SERPAPI_KEY=your_serpapi_key
```

#### Respuesta
```json
{
  "shopping_results": [
    {
      "position": 1,
      "title": "Product Title",
      "price": "$99.99",
      "extracted_price": 99.99,
      "link": "https://store.com/product",
      "source": "Store Name",
      "rating": 4.5,
      "reviews": 1200,
      "thumbnail": "https://image.jpg"
    }
  ]
}
```

## 🚀 Implementación en Componentes

### HybridSearch Component
```typescript
import { HybridSearch } from '@/components/search/hybrid-search'

<HybridSearch
  compact={true}
  maxResults={20}
  useCache={true}
  cacheExpiry={60}
  onProductClick={(product) => {
    // Manejar clic en producto
    console.log('Product clicked:', product)
  }}
/>
```

### HybridSearchResults Component
```typescript
import { HybridSearchResults } from '@/components/search/hybrid-search-results'

<HybridSearchResults
  result={searchResult}
  onProductClick={handleProductClick}
  onViewMoreAlternatives={handleViewMore}
  compact={false}
/>
```

## 📱 Integración en Layout

### Script de eBay en Layout Principal
```typescript
// app/layout.tsx
<body>
  {/* Contenido de la aplicación */}
  
  {/* eBay Smart Links Script */}
  <script dangerouslySetInnerHTML={{
    __html: `window._epn = {campaign: 5339118953};`
  }} />
  <script src="https://epnt.ebay.com/static/epn-smart-tools.js" async />
</body>
```

## 🧪 Testing

### Script de Prueba
```bash
# Ejecutar script de prueba
node scripts/test-hybrid-search.js

# Verificar enlaces de afiliado
node scripts/test-affiliate-links.js
```

### Casos de Prueba
1. **Búsqueda Nike** - Verificar productos de base de datos
2. **Búsqueda General** - Verificar productos de SERP API
3. **Enlaces AWIN** - Verificar generación correcta
4. **Enlaces eBay** - Verificar conversión automática
5. **Caché** - Verificar funcionamiento del sistema

## 🔧 Configuración del Entorno

### Variables de Entorno Requeridas
```bash
# .env.local
SERPAPI_KEY=tu_clave_serpapi
AWIN_PUBLISHER_ID=tu_publisher_id
AWIN_ADVERTISER_ID=tu_advertiser_id
EBAY_CAMPAIGN_ID=5339118953
```

### Verificación de Configuración
```bash
# Verificar variables de entorno
npm run check-env

# Verificar conexiones
npm run check-connections
```

## 📊 Monitoreo y Analytics

### Métricas a Seguir
- **Tasa de conversión** por red de afiliados
- **Ingresos por comisión** por tienda
- **Performance del caché** (hit rate)
- **Tiempo de respuesta** de SERP API
- **Errores** en generación de enlaces

### Logs y Debugging
```typescript
// Habilitar logs detallados
console.log('Generando enlace de afiliado:', {
  originalUrl,
  storeName,
  storeInfo
})

// Verificar enlaces generados
console.log('Enlace de afiliado generado:', affiliateUrl)
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Enlaces Redirigen a localhost
**Causa**: URLs malformadas o inválidas
**Solución**: Validar URLs antes de generar enlaces de afiliado

#### 2. Script de eBay No Funciona
**Causa**: Script no cargado correctamente
**Solución**: Verificar que el script esté en el layout principal

#### 3. Enlaces AWIN No Generan Comisiones
**Causa**: IDs incorrectos o configuración mal
**Solución**: Verificar publisherId y advertiserId en la base de datos

#### 4. Caché No Funciona
**Causa**: localStorage no disponible o corrupto
**Solución**: Limpiar caché y verificar permisos del navegador

### Debugging
```typescript
// Verificar configuración de tiendas
const storeInfo = await HybridSearchService.getStoreAffiliateInfo()
console.log('Store info:', storeInfo)

// Verificar enlaces generados
const affiliateUrl = HybridSearchService.generateAffiliateUrl(
  'https://store.com/product',
  'Store Name',
  storeInfo
)
console.log('Affiliate URL:', affiliateUrl)
```

## 🔮 Mejoras Futuras

### 1. Amazon Associates
- Implementar sistema completo de enlaces de afiliado
- Integrar con Amazon Product Advertising API
- Generar enlaces con tracking avanzado

### 2. Optimización de Caché
- Implementar caché en Redis para producción
- Compresión de datos en caché
- Invalidación inteligente de caché

### 3. Analytics Avanzados
- Tracking de clics por producto
- A/B testing de enlaces de afiliado
- Optimización automática de conversiones

### 4. Más Redes de Afiliados
- ShareASale
- Commission Junction
- Rakuten Marketing
- Impact.com

## 📚 Recursos Adicionales

### Documentación Oficial
- [AWIN Developer Documentation](https://developer.awin.com/)
- [eBay Partner Network](https://partnernetwork.ebay.com/)
- [Amazon Associates](https://affiliate-program.amazon.com/)
- [SERP API Documentation](https://serpapi.com/docs)

### Herramientas de Testing
- [AWIN Link Generator](https://www.awin.com/us/affiliate-tools)
- [eBay Smart Links Testing](https://epnt.ebay.com/static/epn-smart-tools.js)
- [SERP API Playground](https://serpapi.com/playground)

### Soporte
- **AWIN**: support@awin.com
- **eBay**: partner-support@ebay.com
- **SERP API**: support@serpapi.com

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Autor**: Cuponomics Development Team
