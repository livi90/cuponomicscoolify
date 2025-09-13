# 🚀 Sistema de Búsqueda Híbrida Cuponomics

## 📋 Resumen Ejecutivo

El sistema de búsqueda híbrida de Cuponomics combina **productos Nike de la base de datos local** con **resultados de SERP API** para ofrecer la mejor experiencia de búsqueda posible, optimizando costos y velocidad mediante un sistema de caché inteligente.

## 🎯 Características Principales

### 1. **Búsqueda Híbrida Inteligente**
- **Base de datos Nike**: Productos verificados con descuentos exclusivos
- **SERP API**: Resultados de otras tiendas para comparación
- **Análisis automático**: Detecta automáticamente si la búsqueda es relevante para Nike

### 2. **Sistema de Caché Local**
- **localStorage**: Almacena resultados recientes
- **Expiración automática**: Configurable por búsqueda
- **Limpieza inteligente**: Mantiene el caché optimizado
- **Reducción de requests**: Ahorra costos de API

### 3. **Resultados Optimizados**
- **Producto principal**: Mejor calificación/descuento destacado
- **Alternativas**: 3 productos similares de otras tiendas
- **Botón "Ver otras ofertas"**: Como en Shopify
- **Ordenamiento inteligente**: Por relevancia y calidad

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes     │    │   Services      │
│                 │    │                  │    │                 │
│ HybridSearch    │───▶│ /api/hybrid-    │───▶│ HybridSearch    │
│ Component       │    │ search           │    │ Service         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Hooks          │    │   Database      │
                       │                  │    │                 │
                       │ useHybridSearch  │    │ Nike Products   │
                       └──────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Components     │    │   SERP API      │
                       │                  │    │                 │
                       │ Results Display  │    │ Google Shopping │
                       └──────────────────┘    └─────────────────┘
```

## 🔧 Componentes del Sistema

### 1. **Servicio Principal** (`lib/services/hybrid-search.ts`)
```typescript
export class HybridSearchService {
  // Búsqueda híbrida principal
  static async hybridSearch(options: SearchOptions): Promise<HybridSearchResult>
  
  // Análisis de relevancia Nike
  private static async analyzeNikeRelevance(query: string)
  
  // Búsqueda en base de datos Nike
  private static async searchNikeProducts(query: string, limit: number)
  
  // Búsqueda en SERP API
  private static async searchSerpProducts(query: string, limit: number)
  
  // Sistema de caché
  private static getFromCache(query: string)
  private static saveToCache(query: string, result: HybridSearchResult, expiry: number)
}
```

### 2. **API Endpoint** (`app/api/hybrid-search/route.ts`)
```typescript
// GET /api/hybrid-search?q=query&maxResults=20&minConfidence=25
// POST /api/hybrid-search (con body JSON)
// DELETE /api/hybrid-search?action=clear (limpiar caché)
```

### 3. **Hook Personalizado** (`hooks/use-hybrid-search.ts`)
```typescript
export function useHybridSearch(options: UseHybridSearchOptions)
export function useHybridSearchWithDebounce(query: string, options)
```

### 4. **Componentes de UI**
- **`HybridSearch`**: Componente principal con input y resultados
- **`HybridSearchResults`**: Muestra productos principales y alternativas
- **`MainProductCard`**: Tarjeta destacada del producto principal
- **`AlternativeProductCard`**: Tarjetas compactas de alternativas

## 🚀 Cómo Usar el Sistema

### 1. **Implementación Básica**
```tsx
import { HybridSearch } from '@/components/search/hybrid-search'

function MyPage() {
  const handleProductClick = (product) => {
    console.log('Producto seleccionado:', product)
    window.open(product.affiliateUrl, '_blank')
  }

  return (
    <HybridSearch
      placeholder="Buscar productos..."
      maxResults={20}
      minConfidence={25}
      onProductClick={handleProductClick}
    />
  )
}
```

### 2. **Con Hook Personalizado**
```tsx
import { useHybridSearch } from '@/hooks/use-hybrid-search'

function MyComponent() {
  const { result, isLoading, search, hasResults } = useHybridSearch({
    maxResults: 15,
    minConfidence: 30,
    useCache: true
  })

  const handleSearch = () => {
    search('nike air max')
  }

  return (
    <div>
      <button onClick={handleSearch}>Buscar Nike Air Max</button>
      {hasResults && <div>Resultados: {result.totalResults}</div>}
    </div>
  )
}
```

### 3. **Con Debounce Automático**
```tsx
import { useHybridSearchWithDebounce } from '@/hooks/use-hybrid-search'

function SearchComponent() {
  const [query, setQuery] = useState('')
  const { result, isLoading } = useHybridSearchWithDebounce(query, {
    maxResults: 20,
    debounceMs: 500
  })

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Buscar..."
    />
  )
}
```

## ⚙️ Configuración

### 1. **Variables de Entorno**
```env
# SERP API para búsquedas externas
SERPAPI_KEY=tu_api_key_aqui

# Base de datos Supabase (ya configurada)
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 2. **Parámetros de Búsqueda**
```typescript
interface SearchOptions {
  query: string                    // Término de búsqueda
  maxResults?: number             // Máximo de resultados (default: 20)
  minConfidence?: number         // Confianza mínima para Nike (default: 25)
  useCache?: boolean             // Usar caché local (default: true)
  cacheExpiry?: number           // Expiración en minutos (default: 60)
}
```

### 3. **Configuración del Caché**
```typescript
// En HybridSearchService
private static readonly CACHE_PREFIX = 'cuponomics_search_cache'
private static readonly DEFAULT_CACHE_EXPIRY = 60 // 1 hora
private static readonly MAX_CACHE_SIZE = 100 // Máximo 100 búsquedas
```

## 📊 Flujo de Búsqueda

### 1. **Análisis de Relevancia**
```typescript
// Palabras clave Nike detectadas automáticamente
const nikeKeywords = [
  'nike', 'air', 'max', 'force', 'jordan', 'dunk', 'blazer',
  'cortez', 'react', 'zoom', 'vapormax', 'lebron', 'kobe',
  'kyrie', 'kd', 'retro', 'og', 'low', 'mid', 'high'
]
```

### 2. **Decisión de Fuente**
- **Confianza ≥ 25%**: Búsqueda híbrida (Nike + SERP)
- **Confianza < 25%**: Solo SERP API
- **Fallback**: SERP API si hay errores

### 3. **Procesamiento de Resultados**
1. **Producto principal**: Mejor calificación/descuento
2. **Alternativas**: 3 productos similares de otras tiendas
3. **Ordenamiento**: Por relevancia y score calculado
4. **Caché**: Almacenamiento local para futuras búsquedas

## 💰 Optimización de Costos

### 1. **Reducción de Requests SERP API**
- **Caché local**: Búsquedas repetidas sin costo
- **Búsqueda Nike**: Base de datos local gratuita
- **Expiración inteligente**: Balance entre frescura y costo

### 2. **Estrategias de Ahorro**
```typescript
// Solo usar SERP API cuando sea necesario
if (nikeAnalysis.shouldInclude && nikeAnalysis.confidence >= minConfidence) {
  // Usar base de datos Nike (gratis)
  const nikeProducts = await this.searchNikeProducts(query, limit)
  
  // Complementar con SERP API (costo mínimo)
  const alternatives = await this.searchSerpAlternatives(query, 3)
} else {
  // Solo SERP API para productos no-Nike
  const serpResults = await this.searchSerpProducts(query, maxResults)
}
```

## 🔍 Casos de Uso

### 1. **Búsqueda de Productos Nike**
```
Query: "nike air max 90"
Resultado: Híbrido
- Producto principal: Nike Air Max 90 desde base de datos
- Alternativas: Zapatillas similares de otras marcas
- Confianza: 85%
```

### 2. **Búsqueda de Productos Generales**
```
Query: "smartphone samsung"
Resultado: SERP API
- Producto principal: Mejor oferta de SERP API
- Alternativas: Otras opciones de diferentes tiendas
- Confianza: 0% (no es Nike)
```

### 3. **Búsqueda Mixta**
```
Query: "zapatillas deportivas running"
Resultado: Híbrido (si hay productos Nike relevantes)
- Producto principal: Nike relevante si existe
- Alternativas: Otras marcas deportivas
- Confianza: Variable según relevancia
```

## 🧪 Testing y Debugging

### 1. **Página de Demostración**
```
/busqueda-hibrida
```
- Componente completo funcional
- Ejemplos de búsquedas
- Información del sistema

### 2. **Logs de Debug**
```typescript
console.log(`🔍 Búsqueda híbrida iniciada: "${query}"`)
console.log(`✅ Búsqueda híbrida completada:`, {
  source: result.source,
  totalResults: result.totalResults,
  cacheHit: result.cacheHit,
  confidence: result.searchMetadata.confidence
})
```

### 3. **Estadísticas del Caché**
```typescript
const stats = HybridSearchService.getCacheStats()
console.log('Estadísticas del caché:', stats)
// { totalEntries: 15, totalSize: 2048, oldestEntry: 1234567890, newestEntry: 1234567899 }
```

## 🚨 Solución de Problemas

### 1. **Error: SERPAPI_KEY no configurada**
```typescript
// Verificar variable de entorno
if (!process.env.SERPAPI_KEY) {
  console.warn('SERPAPI_KEY no configurada')
  return [] // Fallback a solo base de datos Nike
}
```

### 2. **Error: Base de datos Nike no disponible**
```typescript
// Fallback automático a SERP API
try {
  const nikeProducts = await this.searchNikeProducts(query, limit)
} catch (error) {
  console.error('Error en base de datos Nike, usando SERP API')
  return await this.searchSerpProducts(query, limit)
}
```

### 3. **Caché corrupto**
```typescript
// Limpiar caché manualmente
HybridSearchService.clearCache()

// O desde la API
DELETE /api/hybrid-search?action=clear
```

## 🔮 Futuras Mejoras

### 1. **Optimizaciones de Rendimiento**
- **Indexación avanzada**: Mejorar búsquedas en base de datos
- **Compresión de caché**: Reducir uso de localStorage
- **Lazy loading**: Cargar alternativas bajo demanda

### 2. **Funcionalidades Adicionales**
- **Filtros avanzados**: Precio, categoría, tienda
- **Historial de búsquedas**: Persistencia de queries populares
- **Recomendaciones**: Productos relacionados automáticos
- **Comparación de precios**: Tabla comparativa de alternativas

### 3. **Integración con Analytics**
- **Tracking de búsquedas**: Métricas de uso
- **A/B testing**: Diferentes algoritmos de relevancia
- **Machine Learning**: Mejora automática de resultados

## 📚 Recursos Adicionales

### 1. **Archivos Relacionados**
- `lib/services/hybrid-search.ts` - Servicio principal
- `app/api/hybrid-search/route.ts` - API endpoint
- `hooks/use-hybrid-search.ts` - Hooks personalizados
- `components/search/hybrid-search.tsx` - Componente principal
- `components/search/hybrid-search-results.tsx` - Visualización de resultados

### 2. **APIs Relacionadas**
- `/api/search-products` - Búsqueda original (legacy)
- `/api/universal-search` - Búsqueda universal Nike
- `/api/meilisearch-products` - Búsqueda en Meilisearch

### 3. **Servicios Base**
- `NikeProductsService` - Gestión de productos Nike
- `UniversalSearchService` - Análisis de palabras clave
- `MeilisearchClient` - Búsqueda en índices

---

**🎯 El sistema de búsqueda híbrida está diseñado para ser escalable, eficiente en costos y proporcionar la mejor experiencia de usuario posible, combinando lo mejor de ambos mundos: productos Nike verificados y ofertas de otras tiendas.**
