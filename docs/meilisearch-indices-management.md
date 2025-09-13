# Gestión de Índices Meilisearch - Cuponomics

## Descripción

Esta funcionalidad permite a los administradores de Cuponomics gestionar y configurar los índices de búsqueda de Meilisearch directamente desde el dashboard de administración.

## Características

### 🔍 Gestión de Índices
- **Crear nuevos índices**: Crea índices personalizados con nombres y claves primarias específicas
- **Listar índices existentes**: Visualiza todos los índices disponibles en la instancia de Meilisearch
- **Eliminar índices**: Elimina índices que ya no son necesarios (con confirmación de seguridad)
- **Importar CSV**: Carga datos directamente desde archivos CSV a los índices
- **Múltiples índices por tienda**: Estructura organizada por tienda y tipo de contenido

### 📊 Información del Índice
- **Estadísticas**: Número de documentos, estado de indexación, distribución de campos
- **Configuración**: Atributos de búsqueda, filtrables y ordenables
- **Metadatos**: Fecha de creación, última actualización, clave primaria

### ⚙️ Configuración Avanzada
- **Atributos de búsqueda**: Define qué campos se utilizan para las consultas de texto
- **Atributos filtrables**: Especifica campos que se pueden usar como filtros
- **Atributos ordenables**: Define campos que permiten ordenamiento de resultados
- **Reglas de ranking**: Configura cómo se ordenan los resultados de búsqueda

### 🔎 Pruebas de Búsqueda
- **Búsqueda en tiempo real**: Prueba consultas directamente en los índices
- **Resultados JSON**: Visualiza los resultados en formato legible
- **Límites configurables**: Controla el número máximo de resultados
- **Búsqueda unificada**: Consulta múltiples índices simultáneamente
- **Resultados combinados**: Visualiza resultados de todas las tiendas en una sola búsqueda

## Acceso

### Requisitos
- Usuario autenticado en Cuponomics
- Rol de administrador (`role = 'admin'` en la tabla `profiles`)

### Ruta de Acceso
```
/dashboard/admin/meilisearch-indices
```

## Uso

### 1. Crear un Nuevo Índice

1. Navega a la sección "Gestión de Índices Meilisearch"
2. En la tarjeta "Crear Nuevo Índice":
   - **Nombre del índice**: Usa el formato `{tienda}_{tipo}` (ej: `nike_productos`, `adidas_cupones`)
   - **Clave primaria**: Campo único que identifica cada documento (ej: `id`, `sku`, `code`)
   - **Tipo de contenido**: Selecciona el tipo para auto-configurar la clave primaria
3. Haz clic en "Crear Índice"

**💡 Recomendación**: Organiza tus índices por tienda y tipo para facilitar la gestión

### 2. Gestionar Índices Existentes

1. **Ver lista de índices**: Los índices se muestran automáticamente
2. **Seleccionar índice**: Haz clic en un índice para ver sus detalles
3. **Eliminar índice**: Usa el botón de papelera (con confirmación)

### 3. Configurar Atributos

1. Selecciona un índice de la lista
2. En la sección "Configuración del Índice":
   - **Atributos de Búsqueda**: Un campo por línea (ej: `nombre`, `descripcion`)
   - **Atributos Filtrables**: Campos para filtros (ej: `categoria`, `precio`)
   - **Atributos Ordenables**: Campos para ordenamiento (ej: `fecha`, `rating`)
3. Los cambios se aplican automáticamente

### 4. Probar Búsquedas

1. **Búsqueda individual**: Selecciona un índice y usa la sección "Búsqueda en el Índice"
2. **Búsqueda unificada**: Usa "Búsqueda Global" para consultar todos los índices simultáneamente
   - Escribe tu consulta
   - Haz clic en "Búsqueda Global"
   - Revisa los resultados combinados de todas las tiendas

### 5. Importar Datos CSV

1. Selecciona un índice
2. Haz clic en "Importar CSV" en la sección de estadísticas
3. Selecciona tu archivo CSV
4. Opcionalmente, mapea las columnas del CSV a los campos del índice
5. Haz clic en "Importar CSV al Índice"

## APIs Disponibles

### Listar Índices
```
GET /api/admin/meilisearch/indices
```

### Crear Índice
```
POST /api/admin/meilisearch/indices
Body: { "name": "nombre_indice", "primaryKey": "id" }
```

### Eliminar Índice
```
DELETE /api/admin/meilisearch/indices/{indexName}
```

### Obtener Estadísticas
```
GET /api/admin/meilisearch/indices/{indexName}/stats
```

### Obtener/Actualizar Configuración
```
GET /api/admin/meilisearch/indices/{indexName}/settings
PATCH /api/admin/meilisearch/indices/{indexName}/settings
```

### Búsqueda en Índice
```
POST /api/admin/meilisearch/indices/{indexName}/search
Body: { "query": "texto_busqueda", "limit": 20 }
```

### Búsqueda Unificada
```
POST /api/admin/meilisearch/unified-search
Body: { "query": "texto_busqueda", "limit": 50, "indices": [] }
```

### Importar CSV
```
POST /api/admin/meilisearch/import-csv
Body: FormData con archivo CSV, nombre del índice y mapeo de columnas
```

## Seguridad

- **Autenticación requerida**: Todas las APIs verifican la autenticación del usuario
- **Autorización**: Solo usuarios con rol `admin` pueden acceder
- **Validación de entrada**: Se validan todos los parámetros de entrada
- **Confirmación de eliminación**: Se requiere confirmación para eliminar índices

## Configuración de Meilisearch

### Variables de Entorno
```env
NEXT_PUBLIC_MEILISEARCH_URL=https://tu-instancia-meilisearch.com
SERVICE_PASSWORD_MEILISEARCH=tu-api-key-admin
```

### Cliente Configurado
```typescript
import { meilisearchClient } from '@/lib/meilisearch/client'

// El cliente se configura automáticamente con las variables de entorno
```

## Casos de Uso Comunes

### 1. Índice de Productos
- **Nombre**: `productos`
- **Clave primaria**: `id`
- **Atributos de búsqueda**: `nombre`, `descripcion`, `categoria`
- **Atributos filtrables**: `categoria`, `precio`, `marca`
- **Atributos ordenables**: `precio`, `fecha_creacion`, `rating`

### 2. Índice de Usuarios
- **Nombre**: `usuarios`
- **Clave primaria**: `id`
- **Atributos de búsqueda**: `nombre`, `email`, `rol`
- **Atributos filtrables**: `rol`, `estado`, `fecha_registro`
- **Atributos ordenables**: `fecha_registro`, `ultima_actividad`

### 3. Índice de Cupones
- **Nombre**: `cupones`
- **Clave primaria**: `id`
- **Atributos de búsqueda**: `titulo`, `descripcion`, `tienda`
- **Atributos filtrables**: `tienda`, `categoria`, `estado`
- **Atributos ordenables**: `fecha_expiracion`, `descuento`, `rating`

## Solución de Problemas

### Error: "El índice ya existe"
- Verifica que el nombre del índice sea único
- Usa un nombre más específico o descriptivo

### Error: "El índice no existe"
- Verifica que el índice esté creado correctamente
- Revisa la conexión con Meilisearch
- Verifica las variables de entorno

### Error: "Acceso denegado"
- Verifica que tu usuario tenga rol `admin`
- Asegúrate de estar autenticado
- Revisa los permisos en la base de datos

### Búsquedas sin resultados
- Verifica que el índice tenga documentos
- Revisa la configuración de atributos de búsqueda
- Asegúrate de que los campos estén indexados correctamente

## Mejoras Futuras

- [ ] **Importación masiva**: Cargar documentos desde archivos CSV/JSON
- [ ] **Sincronización**: Sincronizar índices con bases de datos externas
- [ ] **Backup/Restore**: Funcionalidad para respaldar y restaurar índices
- [ ] **Monitoreo**: Métricas de rendimiento y logs de búsqueda
- [ ] **Plantillas**: Plantillas predefinidas para tipos comunes de índices
- [ ] **Colaboración**: Compartir configuraciones entre administradores

## Soporte

Para problemas técnicos o preguntas sobre esta funcionalidad:

1. Revisa los logs del servidor
2. Verifica la conectividad con Meilisearch
3. Consulta la documentación oficial de Meilisearch
4. Contacta al equipo de desarrollo de Cuponomics

---

**Nota**: Esta funcionalidad está diseñada para administradores técnicos. Se recomienda tener conocimientos básicos de búsqueda y indexación antes de realizar cambios importantes en la configuración.
