# Fix de Compatibilidad Cliente-Servidor

## 🚨 Problema Identificado

```
Error: You're importing a component that needs "next/headers". 
That only works in a Server Component which is not supported in the pages/ directory.
```

## 🔧 Solución Implementada

### 1. **Servicios Híbridos (Server + Client)**

Los servicios principales ahora detectan automáticamente el entorno y usan el cliente Supabase apropiado:

```typescript
// lib/services/universal-search.ts
// lib/services/nike-products.ts

private static async getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side
    return await createServerClient()
  } else {
    // Client-side
    return createClientClient()
  }
}
```

### 2. **Servicio Solo Cliente**

Creado `lib/services/nike-products-client.ts` para casos donde solo necesitas funcionalidad del cliente:

```typescript
import { createClient } from "@/lib/supabase/client"

export class NikeProductsClientService {
  private static supabase = createClient()
  // ... métodos simplificados
}
```

### 3. **Hook Optimizado**

El hook `useUniversalSearch` ya usa fetch API, por lo que funciona perfectamente en el cliente:

```typescript
// hooks/use-universal-search.ts
const response = await fetch(`/api/universal-search?q=${query}`)
```

### 4. **Componentes Client-Side**

Los componentes React usan `"use client"` y los hooks, evitando importaciones directas de servicios servidor:

```typescript
// components/search/universal-search-results.tsx
"use client"
import { useUniversalSearch } from "@/hooks/use-universal-search"
```

## 📋 Archivos Modificados

### ✅ **Actualizados para Híbrido (Server + Client):**
- `lib/services/universal-search.ts`
- `lib/services/nike-products.ts`

### ✅ **Nuevos Archivos Solo Cliente:**
- `lib/services/nike-products-client.ts`

### ✅ **Componentes Actualizados:**
- `app/buscar-ofertas/BuscarOfertasClient.tsx` (usa versión cliente)

### ✅ **Ya Compatibles:**
- `hooks/use-universal-search.ts` (usa fetch API)
- `components/search/universal-search-results.tsx` (usa hooks)
- `app/api/universal-search/route.ts` (server-only)

## 🎯 Estrategias Usadas

### 1. **Detección de Entorno**
```typescript
if (typeof window === 'undefined') {
  // Server-side: usar createServerClient()
} else {
  // Client-side: usar createClientClient()
}
```

### 2. **Fetch API para Hooks**
```typescript
// En lugar de importar servicios directamente
const response = await fetch('/api/universal-search?q=' + query)
```

### 3. **Servicios Especializados**
- **Híbridos**: Para APIs y componentes que pueden renderizarse en servidor
- **Solo Cliente**: Para componentes que siempre son client-side

### 4. **Separación de Responsabilidades**
- **APIs**: Usan servicios híbridos
- **Hooks**: Usan fetch API
- **Componentes**: Usan hooks
- **Páginas**: Pueden usar cualquiera según necesidad

## 🚀 Resultado

✅ **No más errores de `next/headers`**  
✅ **Funciona en Server Components**  
✅ **Funciona en Client Components**  
✅ **APIs funcionan correctamente**  
✅ **Hooks funcionan en cliente**  
✅ **Servicios auto-detectan entorno**

## 📖 Guía de Uso

### En Server Components:
```typescript
import { UniversalSearchService } from '@/lib/services/universal-search'
// Funciona automáticamente
```

### En Client Components:
```typescript
import { useUniversalSearch } from '@/hooks/use-universal-search'
// O
import { NikeProductsClientService } from '@/lib/services/nike-products-client'
```

### En APIs:
```typescript
import { UniversalSearchService } from '@/lib/services/universal-search'
// Usa automáticamente el servidor
```

## 🎉 Beneficios

1. **Compatibilidad Total**: Funciona en cualquier entorno Next.js
2. **Rendimiento**: Usa el cliente apropiado según el contexto
3. **Flexibilidad**: Múltiples formas de acceder a la funcionalidad
4. **Mantenibilidad**: Código limpio y bien separado
5. **Escalabilidad**: Fácil de extender y modificar
