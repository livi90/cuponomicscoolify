# Configuración de Productos y Productos de Outlet

Esta documentación explica cómo configurar las tablas `products` y `outlet_products` en Supabase.

## Tabla Products

La tabla `products` ya existe en tu base de datos. Para aplicar las políticas RLS (Row Level Security), ejecuta el siguiente script:

### 1. Aplicar RLS a Products

```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: db/migrations/apply-products-rls.sql
```

Este script:
- Habilita RLS en la tabla `products`
- Crea políticas para administradores (acceso completo)
- Crea políticas para comerciantes (solo sus productos)
- Crea políticas para acceso público (solo productos activos)

### 2. Políticas RLS para Products

- **Administradores**: Acceso completo a todos los productos
- **Comerciantes**: Solo pueden gestionar productos de sus tiendas
- **Público**: Solo pueden ver productos con status 'active'

## Tabla Outlet Products

La tabla `outlet_products` no existe y necesita ser creada. Ejecuta el siguiente script:

### 1. Crear Outlet Products

```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: db/schema/create-outlet-products-table.sql
```

Este script:
- Crea la tabla `outlet_products`
- Crea índices para optimizar consultas
- Habilita RLS
- Crea políticas de seguridad
- Crea triggers para:
  - Actualizar `updated_at` automáticamente
  - Calcular `discount_percentage` automáticamente
  - Validar que el precio de outlet sea menor que el original

### 2. Estructura de Outlet Products

```sql
CREATE TABLE public.outlet_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  original_price decimal(10,2) not null,
  outlet_price decimal(10,2) not null,
  discount_percentage integer not null,
  image_url text not null,
  store_id uuid references stores(id) on delete cascade not null,
  rating decimal(3,2) default 0,
  review_count integer default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 3. Políticas RLS para Outlet Products

- **Público**: Solo pueden ver productos activos (`is_active = true`)
- **Comerciantes**: Pueden gestionar productos de sus tiendas
- **Administradores**: Acceso completo a todos los productos

### 4. Triggers Automáticos

1. **Actualización de timestamp**: Actualiza `updated_at` automáticamente
2. **Cálculo de descuento**: Calcula `discount_percentage` basado en `original_price` y `outlet_price`
3. **Validación de precios**: Asegura que `outlet_price` sea menor que `original_price`

## Tipos TypeScript

Los tipos TypeScript están definidos en `lib/types/product.ts`:

```typescript
export interface Product {
  id: string
  store_id: string
  name: string
  description?: string
  price: number
  sale_price?: number
  image_url?: string
  product_url?: string
  category?: string
  tags?: string[]
  is_new?: boolean
  is_featured?: boolean
  stock_quantity?: number
  created_at: string
  updated_at: string
  start_date?: string
  end_date?: string
  status: 'active' | 'inactive' | 'draft'
  store?: {
    id: string
    name: string
    logo_url?: string
  }
}

export interface OutletProduct {
  id: string
  name: string
  description?: string
  original_price: number
  outlet_price: number
  discount_percentage: number
  image_url: string
  store_id: string
  rating?: number
  review_count?: number
  is_featured?: boolean
  is_active?: boolean
  created_at: string
  updated_at: string
  store?: {
    id: string
    name: string
    logo_url?: string
  }
}
```

## Orden de Ejecución

1. **Primero**: Ejecutar `db/migrations/apply-products-rls.sql` para aplicar RLS a la tabla products existente
2. **Segundo**: Ejecutar `db/schema/create-outlet-products-table.sql` para crear la tabla outlet_products

## Verificación

Después de ejecutar los scripts, puedes verificar que todo esté funcionando correctamente:

```sql
-- Verificar políticas de products
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'products';

-- Verificar políticas de outlet_products
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'outlet_products';

-- Verificar que RLS esté habilitado
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('products', 'outlet_products');
```

## Uso en la Aplicación

### Products
- Los comerciantes pueden crear, editar y eliminar productos en sus tiendas
- Los usuarios pueden ver productos activos de todas las tiendas
- Los administradores tienen acceso completo

### Outlet Products
- Los comerciantes pueden crear productos de outlet con descuentos
- El sistema calcula automáticamente el porcentaje de descuento
- Los usuarios pueden ver productos de outlet activos
- Los administradores pueden gestionar todos los productos de outlet 