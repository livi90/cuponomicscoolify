-- Script para configurar todas las tablas necesarias
-- Ejecutar este script en Supabase SQL Editor

-- 1. Habilitar la extensión uuid-ossp si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear tabla de productos si no existe
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  image_url TEXT,
  category VARCHAR(100),
  tags TEXT[],
  is_new BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft'))
);

-- 3. Crear tabla de productos de outlet si no existe
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

-- 4. Crear índices para productos
CREATE INDEX IF NOT EXISTS products_store_id_idx ON products(store_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON products(is_featured);
CREATE INDEX IF NOT EXISTS products_is_new_idx ON products(is_new);

-- 5. Crear índices para outlet_products
CREATE INDEX IF NOT EXISTS idx_outlet_products_store_id ON outlet_products(store_id);
CREATE INDEX IF NOT EXISTS idx_outlet_products_is_active ON outlet_products(is_active);
CREATE INDEX IF NOT EXISTS idx_outlet_products_is_featured ON outlet_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_outlet_products_discount_percentage ON outlet_products(discount_percentage desc);
CREATE INDEX IF NOT EXISTS idx_outlet_products_created_at ON outlet_products(created_at desc);

-- 6. Habilitar RLS en productos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 7. Políticas para productos
DROP POLICY IF EXISTS admin_all_products ON products;
CREATE POLICY admin_all_products ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS merchant_select_own_products ON products;
CREATE POLICY merchant_select_own_products ON products
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = products.store_id
      AND stores.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS merchant_insert_own_products ON products;
CREATE POLICY merchant_insert_own_products ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = products.store_id
      AND stores.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS merchant_update_own_products ON products;
CREATE POLICY merchant_update_own_products ON products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = products.store_id
      AND stores.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS merchant_delete_own_products ON products;
CREATE POLICY merchant_delete_own_products ON products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = products.store_id
      AND stores.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS public_select_active_products ON products;
CREATE POLICY public_select_active_products ON products
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'active'
  );

-- 8. Habilitar RLS en outlet_products
ALTER TABLE outlet_products ENABLE ROW LEVEL SECURITY;

-- 9. Políticas para outlet_products
DROP POLICY IF EXISTS "Allow public read access to active outlet products" ON outlet_products;
CREATE POLICY "Allow public read access to active outlet products" ON outlet_products
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow merchants to manage their outlet products" ON outlet_products;
CREATE POLICY "Allow merchants to manage their outlet products" ON outlet_products
  FOR ALL USING (
    store_id in (
      select id from stores where owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Allow admins to manage all outlet products" ON outlet_products;
CREATE POLICY "Allow admins to manage all outlet products" ON outlet_products
  FOR ALL USING (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 10. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_outlet_products_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_outlet_products_updated_at ON outlet_products;
CREATE TRIGGER update_outlet_products_updated_at
  BEFORE UPDATE ON outlet_products
  FOR EACH ROW
  EXECUTE FUNCTION update_outlet_products_updated_at();

-- 12. Función para calcular automáticamente el porcentaje de descuento
CREATE OR REPLACE FUNCTION calculate_discount_percentage()
RETURNS trigger AS $$
BEGIN
  IF NEW.original_price > 0 THEN
    NEW.discount_percentage = ROUND(((NEW.original_price - NEW.outlet_price) / NEW.original_price) * 100);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Trigger para calcular automáticamente el descuento
DROP TRIGGER IF EXISTS calculate_discount_percentage_trigger ON outlet_products;
CREATE TRIGGER calculate_discount_percentage_trigger
  BEFORE INSERT OR UPDATE ON outlet_products
  FOR EACH ROW
  EXECUTE FUNCTION calculate_discount_percentage();

-- 14. Insertar algunos productos de ejemplo para outlet (opcional)
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

-- 15. Verificar que las tablas se crearon correctamente
SELECT 
  'products' as table_name,
  COUNT(*) as row_count
FROM products
UNION ALL
SELECT 
  'outlet_products' as table_name,
  COUNT(*) as row_count
FROM outlet_products; 