-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
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

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS products_store_id_idx ON products(store_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);

-- Políticas de seguridad para la tabla de productos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para que los administradores puedan hacer todo
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

-- Política para que los comerciantes puedan ver sus propios productos
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

-- Política para que los comerciantes puedan insertar productos en sus tiendas
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

-- Política para que los comerciantes puedan actualizar sus propios productos
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

-- Política para que los comerciantes puedan eliminar sus propios productos
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

-- Política para que todos los usuarios puedan ver productos activos
CREATE POLICY public_select_active_products ON products
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'active'
  );
