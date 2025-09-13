# Guía de Integración - Sistema de Búsqueda Universal Nike

## 🎯 Objetivo

El sistema de búsqueda universal permite que **cualquier barra de búsqueda** en tu aplicación muestre automáticamente productos Nike cuando detecte palabras clave relevantes extraídas directamente de tu base de datos.

## 🔧 Cómo Funciona

1. **Extracción Automática**: El sistema extrae palabras clave únicas de todos los productos Nike en tu base de datos
2. **Análisis Inteligente**: Cada búsqueda se analiza para determinar si contiene palabras relacionadas con Nike
3. **Nivel de Confianza**: Se calcula un porcentaje basado en cuántas palabras coinciden
4. **Resultados Automáticos**: Si la confianza supera el umbral, se muestran productos Nike

## 📚 APIs Disponibles

### 1. API Universal Search (`/api/universal-search`)

```javascript
// Búsqueda completa
GET /api/universal-search?q=nike+air+max&minConfidence=25&maxResults=12

// Solo análisis
GET /api/universal-search?action=analyze&q=air+force

// Estadísticas de palabras clave
GET /api/universal-search?action=keywords

// Actualizar cache (POST)
POST /api/universal-search
Body: { "action": "refresh-keywords" }
```

### 2. API de Productos (Ya integrada)

```javascript
// Usa automáticamente el sistema universal
GET /api/search-products?q=jordan+retro
// Respuesta incluye metadata sobre la detección Nike
```

## 🎨 Componentes Disponibles

### 1. Hook personalizado

```tsx
import { useUniversalSearch } from '@/hooks/use-universal-search'

function SearchComponent() {
  const { 
    result, 
    search, 
    isLoading,
    hasNikeResults,
    confidence,
    matchedKeywords 
  } = useUniversalSearch('', {
    minConfidence: 25,
    maxNikeResults: 8,
    autoSearch: true // Busca automáticamente al cambiar query
  })

  return (
    <div>
      {hasNikeResults && (
        <div>
          <h3>Productos Nike ({confidence}% relevancia)</h3>
          <p>Palabras detectadas: {matchedKeywords.join(', ')}</p>
          {result.nikeProducts.map(product => (
            <ProductCard key={product.aw_product_id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### 2. Componente visual completo

```tsx
import { UniversalSearchResults } from '@/components/search/universal-search-results'

function SearchPage() {
  const [query, setQuery] = useState('')

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
      />
      
      <UniversalSearchResults 
        query={query}
        maxResults={8}
        minConfidence={25}
        compact={false}
        showAnalysis={true}
        onProductClick={(product) => {
          // Manejar click en producto
          window.open(product.aw_deep_link, '_blank')
        }}
      />
    </div>
  )
}
```

## 🔌 Ejemplos de Integración

### 1. En el Header Principal

```tsx
// components/header.tsx
import { useState } from 'react'
import { UniversalSearchResults } from '@/components/search/universal-search-results'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  return (
    <header>
      <div className="search-container relative">
        <input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowResults(e.target.value.length > 2)
          }}
          placeholder="Buscar ofertas, tiendas, productos..."
        />
        
        {showResults && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg p-4 z-50">
            <UniversalSearchResults 
              query={searchQuery}
              compact={true}
              maxResults={4}
              minConfidence={20}
            />
          </div>
        )}
      </div>
    </header>
  )
}
```

### 2. En Página de Categorías

```tsx
// app/categorias/[categoria]/page.tsx
import { useUniversalSearch } from '@/hooks/use-universal-search'

export default function CategoriaPage({ params }) {
  const { hasNikeResults, nikeProducts } = useUniversalSearch(params.categoria, {
    autoSearch: true,
    minConfidence: 15 // Umbral más bajo para categorías
  })

  return (
    <div>
      <h1>Categoría: {params.categoria}</h1>
      
      {/* Productos regulares de la categoría */}
      <CategoryProducts category={params.categoria} />
      
      {/* Productos Nike si son relevantes */}
      {hasNikeResults && (
        <section className="mt-8">
          <h2>Productos Nike relacionados</h2>
          <UniversalSearchResults 
            query={params.categoria}
            compact={true}
            maxResults={6}
          />
        </section>
      )}
    </div>
  )
}
```

### 3. En Dashboard de Admin

```tsx
// app/dashboard/search-analytics/page.tsx
import { useSearchAnalysis } from '@/hooks/use-universal-search'

export default function SearchAnalytics() {
  const [testQuery, setTestQuery] = useState('')
  const { analysis, isAnalyzing } = useSearchAnalysis(testQuery)

  return (
    <div>
      <h1>Análisis de Búsquedas</h1>
      
      <input
        value={testQuery}
        onChange={(e) => setTestQuery(e.target.value)}
        placeholder="Probar consulta de búsqueda..."
      />
      
      {analysis && (
        <div className="analysis-results">
          <h3>Análisis para: "{testQuery}"</h3>
          <p>Confianza Nike: {analysis.confidence}%</p>
          <p>Debería incluir Nike: {analysis.shouldIncludeNike ? 'Sí' : 'No'}</p>
          <p>Palabras detectadas: {analysis.matchedKeywords.join(', ')}</p>
          <p>Palabras extraídas: {analysis.extractedWords.join(', ')}</p>
        </div>
      )}
    </div>
  )
}
```

## ⚙️ Configuración Avanzada

### Umbrales de Confianza Recomendados

```javascript
// Para búsquedas principales (muy específicas)
minConfidence: 50

// Para búsquedas generales
minConfidence: 25

// Para categorías y exploración
minConfidence: 15

// Para sugerencias y autocompletado
minConfidence: 10
```

### Personalización del Cache

```javascript
// El cache se actualiza automáticamente cada 30 minutos
// Para forzar actualización:
fetch('/api/universal-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'refresh-keywords' })
})
```

## 🎯 Palabras Clave Detectadas

El sistema extrae automáticamente palabras de:
- **Nombres de productos**: "Nike Air Max 90", "Jordan Retro 1"
- **Descripciones**: "zapatillas running", "basketball shoes"
- **Categorías**: "calzado deportivo", "sneakers"
- **Marcas**: "Nike", "Jordan", "Air"

### Ejemplos de Detección

✅ **Detectará Nike para:**
- "nike air max"
- "jordan retro"
- "air force 1" 
- "zapatillas nike"
- "cortez leather"
- "dunk low"
- "react element"

❌ **NO detectará Nike para:**
- "adidas ultraboost"
- "converse all star"
- "camiseta básica"
- "reloj deportivo"

## 🔄 Mantenimiento

### Actualización Automática
- El cache se actualiza cada 30 minutos
- Se regenera automáticamente si detecta nuevos productos

### Monitoreo
```javascript
// Obtener estadísticas
fetch('/api/universal-search?action=keywords')
  .then(res => res.json())
  .then(data => {
    console.log(`Total palabras: ${data.totalKeywords}`)
    console.log(`Última actualización: ${data.lastUpdated}`)
  })
```

## 🚀 Pruebas

Ejecuta el script de pruebas:

```bash
node scripts/test-universal-search.js
```

Esto verificará:
- Extracción de palabras clave
- Análisis de consultas
- Niveles de confianza
- Integración con APIs existentes

## 📈 Beneficios

1. **🎯 Detección Inteligente**: Basada en productos reales, no palabras hardcoded
2. **🔄 Auto-actualización**: Se adapta automáticamente a nuevos productos
3. **⚡ Alto Rendimiento**: Cache optimizado, respuestas rápidas
4. **🎨 Fácil Integración**: Hooks y componentes listos para usar
5. **📊 Analytics**: Información detallada sobre coincidencias y confianza
6. **🛡️ Fallback Inteligente**: Usa SERP API cuando no hay productos Nike

## 🎊 ¡Ya está listo!

Ahora cualquier búsqueda en tu aplicación que contenga palabras de tus productos Nike mostrará automáticamente esos productos. El sistema es:

- **Universal**: Funciona desde cualquier barra de búsqueda
- **Inteligente**: Extrae palabras reales de tu base de datos
- **Flexible**: Configurable según tus necesidades
- **Escalable**: Se adapta automáticamente a nuevos productos
