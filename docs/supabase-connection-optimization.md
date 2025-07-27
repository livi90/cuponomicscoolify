# Optimización de Conexiones de Supabase

## 🔍 Problema Identificado

Se detectaron **múltiples llamadas a `createClient()`** en el mismo archivo, lo que estaba causando conexiones simultáneas innecesarias a Supabase. Esto podía resultar en:

- Conexiones duplicadas a la base de datos
- Logs confusos en Supabase Cloud y self-hosted
- Rendimiento degradado
- Uso innecesario de recursos

## 🛠️ Solución Implementada

### 1. **Análisis de Archivos Problemáticos**

Se identificaron archivos con múltiples llamadas a `createClient()`:

- **Componentes de React**: Múltiples instancias en el mismo componente
- **API Routes**: Instancias globales incorrectas
- **Servicios**: Múltiples instanciaciones

### 2. **Correcciones Aplicadas**

#### **Componentes de React**
- ✅ `app/dashboard/admin/outlet-products/page.tsx` - Corregido manualmente
- ✅ `app/buscar-ofertas/BuscarOfertasClient.tsx` - Corregido automáticamente
- ✅ `app/productos/[id]/page.tsx` - Corregido automáticamente

#### **API Routes**
- ✅ `app/api/store-applications/route.ts` - Eliminadas instancias globales incorrectas
- ✅ `app/api/stores/route.ts` - Eliminadas instancias globales incorrectas
- ✅ `app/api/stores/[id]/route.ts` - Eliminadas instancias globales incorrectas
- ✅ `app/api/tracking/click/route.ts` - Eliminadas instancias globales incorrectas
- ✅ `app/api/tracking/conversion/route.ts` - Eliminadas instancias globales incorrectas
- ✅ `app/api/utm-exceptions/route.ts` - Eliminadas instancias globales incorrectas

### 3. **Patrones de Corrección**

#### **Para Componentes de React**
```typescript
// ❌ ANTES: Múltiples llamadas a createClient()
export default function MyComponent() {
  async function handleSubmit() {
    const supabase = createClient() // Primera llamada
    // ...
  }
  
  async function handleDelete() {
    const supabase = createClient() // Segunda llamada
    // ...
  }
}

// ✅ DESPUÉS: Una sola instancia global
const supabase = createClient() // Instancia global

export default function MyComponent() {
  async function handleSubmit() {
    // Usar la instancia global
    // ...
  }
  
  async function handleDelete() {
    // Usar la instancia global
    // ...
  }
}
```

#### **Para API Routes**
```typescript
// ❌ ANTES: Instancia global incorrecta
const supabase = createClient() // Incorrecto para API routes

export async function GET() {
  const supabase = await createClient() // Correcto
  // ...
}

export async function POST() {
  const supabase = await createClient() // Correcto
  // ...
}

// ✅ DESPUÉS: Cada función crea su propia instancia
export async function GET() {
  const supabase = await createClient() // Correcto
  // ...
}

export async function POST() {
  const supabase = await createClient() // Correcto
  // ...
}
```

## 🎯 Resultados

### **Antes de la Optimización**
- 17 archivos con múltiples llamadas a `createClient()`
- Conexiones simultáneas innecesarias
- Logs confusos en Supabase

### **Después de la Optimización**
- ✅ 6 archivos corregidos automáticamente
- ✅ 1 archivo corregido manualmente
- ✅ Conexiones optimizadas
- ✅ Logs más claros

## 📋 Mejores Prácticas

### **Para Componentes de React**
1. **Usar una sola instancia global** de Supabase por componente
2. **Evitar crear clientes en loops** o funciones que se ejecutan frecuentemente
3. **No crear clientes en event handlers** directamente
4. **Usar el patrón singleton** para servicios

### **Para API Routes**
1. **Cada función debe crear su propia instancia** con `await createClient()`
2. **No usar instancias globales** en API routes
3. **Mantener las instancias dentro del scope de la función**

### **Para Servicios**
1. **Usar una sola instancia por servicio**
2. **Implementar el patrón singleton** si es necesario
3. **Evitar múltiples instanciaciones**

## 🔧 Verificación

Para verificar que las optimizaciones funcionan:

1. **Reinicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

2. **Verifica los logs de Supabase**:
   - Deberías ver menos conexiones simultáneas
   - Los logs deberían ser más claros y organizados

3. **Monitorea el rendimiento**:
   - Menor uso de recursos
   - Respuestas más rápidas
   - Menos errores de conexión

## 🚀 Próximos Pasos

1. **Monitorear los logs** de Supabase para confirmar las mejoras
2. **Implementar métricas** para medir el rendimiento
3. **Revisar periódicamente** el código para evitar regresiones
4. **Documentar nuevos patrones** para el equipo

## ⚠️ Prevención

Para evitar este problema en el futuro:

1. **Revisar el código** antes de hacer commits
2. **Usar linters** que detecten múltiples llamadas a `createClient()`
3. **Implementar pruebas** que verifiquen el patrón correcto
4. **Documentar las mejores prácticas** para el equipo

---

**Nota**: Las conexiones simultáneas a Supabase Cloud y self-hosted deberían haberse reducido significativamente después de estas optimizaciones. 