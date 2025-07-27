-- Script completo para crear la tabla outlet_products
-- Ejecutar este script en Supabase SQL Editor

-- 1. Crear tabla de productos de outlet
CREATE TABLE IF NOT EXISTS public.outlet_products (
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

-- 2. Crear índices para outlet_products
CREATE INDEX IF NOT EXISTS idx_outlet_products_store_id ON outlet_products(store_id);
CREATE INDEX IF NOT EXISTS idx_outlet_products_is_active ON outlet_products(is_active);
CREATE INDEX IF NOT EXISTS idx_outlet_products_is_featured ON outlet_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_outlet_products_discount_percentage ON outlet_products(discount_percentage desc);
CREATE INDEX IF NOT EXISTS idx_outlet_products_created_at ON outlet_products(created_at desc);
CREATE INDEX IF NOT EXISTS idx_outlet_products_rating ON outlet_products(rating desc);

-- 3. Habilitar RLS en outlet_products
ALTER TABLE outlet_products ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para outlet_products

-- Política para acceso público (solo productos activos)
DROP POLICY IF EXISTS "Allow public read access to active outlet products" ON outlet_products;
CREATE POLICY "Allow public read access to active outlet products" ON outlet_products
  FOR SELECT USING (is_active = true);

-- Política para comerciantes (gestionar sus productos de outlet)
DROP POLICY IF EXISTS "Allow merchants to manage their outlet products" ON outlet_products;
CREATE POLICY "Allow merchants to manage their outlet products" ON outlet_products
  FOR ALL USING (
    store_id in (
      select id from stores where owner_id = auth.uid()
    )
  );

-- Política para administradores (acceso completo)
DROP POLICY IF EXISTS "Allow admins to manage all outlet products" ON outlet_products;
CREATE POLICY "Allow admins to manage all outlet products" ON outlet_products
  FOR ALL USING (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 5. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_outlet_products_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_outlet_products_updated_at ON outlet_products;
CREATE TRIGGER update_outlet_products_updated_at
  BEFORE UPDATE ON outlet_products
  FOR EACH ROW
  EXECUTE FUNCTION update_outlet_products_updated_at();

-- 7. Función para calcular automáticamente el porcentaje de descuento
CREATE OR REPLACE FUNCTION calculate_discount_percentage()
RETURNS trigger AS $$
BEGIN
  IF NEW.original_price > 0 THEN
    NEW.discount_percentage = ROUND(((NEW.original_price - NEW.outlet_price) / NEW.original_price) * 100);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger para calcular automáticamente el descuento
DROP TRIGGER IF EXISTS calculate_discount_percentage_trigger ON outlet_products;
CREATE TRIGGER calculate_discount_percentage_trigger
  BEFORE INSERT OR UPDATE ON outlet_products
  FOR EACH ROW
  EXECUTE FUNCTION calculate_discount_percentage();

-- 9. Función para validar que el precio de outlet sea menor que el original
CREATE OR REPLACE FUNCTION validate_outlet_price()
RETURNS trigger AS $$
BEGIN
  IF NEW.outlet_price >= NEW.original_price THEN
    RAISE EXCEPTION 'El precio de outlet debe ser menor que el precio original';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Trigger para validar el precio de outlet
DROP TRIGGER IF EXISTS validate_outlet_price_trigger ON outlet_products;
CREATE TRIGGER validate_outlet_price_trigger
  BEFORE INSERT OR UPDATE ON outlet_products
  FOR EACH ROW
  EXECUTE FUNCTION validate_outlet_price();

-- 11. Insertar algunos productos de ejemplo para outlet (opcional)
INSERT INTO outlet_products (name, description, original_price, outlet_price, image_url, store_id, is_featured, is_active)
SELECT 
  'Producto de Outlet ' || s.name,
  'Descripción del producto de outlet de ' || s.name,
  99.99,
  49.99,
  'https://via.placeholder.com/400x300?text=Outlet+Product',
  s.id,
  true,
  true
FROM stores s 
WHERE s.is_active = true 
LIMIT 5
ON CONFLICT DO NOTHING;

-- 12. Verificar que las tablas se crearon correctamente
SELECT 
  'outlet_products' as table_name,
  COUNT(*) as row_count
FROM outlet_products;

-- 13. Verificar las políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'outlet_products'
ORDER BY policyname; 