-- Crear tabla para productos destacados
CREATE TABLE IF NOT EXISTS featured_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  image_url TEXT,
  category VARCHAR(100),
  tags TEXT[],
  is_new BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'active'
);

-- Crear índice para búsquedas por tienda
CREATE INDEX IF NOT EXISTS idx_featured_products_store_id ON featured_products(store_id);

-- Crear índice para búsquedas de productos destacados
CREATE INDEX IF NOT EXISTS idx_featured_products_is_featured ON featured_products(is_featured);

-- Crear índice para búsquedas de productos en oferta
CREATE INDEX IF NOT EXISTS idx_featured_products_status ON featured_products(status);

-- Tabla para almacenar las estadísticas de los productos
CREATE TABLE IF NOT EXISTS product_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES featured_products(id) NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS en las tablas
ALTER TABLE featured_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stats ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para featured_products
CREATE POLICY "Usuarios pueden ver productos activos" ON featured_products
FOR SELECT USING (status = 'active');

CREATE POLICY "Comerciantes pueden ver sus propios productos" ON featured_products
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = featured_products.store_id
    AND stores.owner_id = auth.uid()::uuid
  )
);

CREATE POLICY "Comerciantes pueden crear productos para sus tiendas" ON featured_products
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = featured_products.store_id
    AND stores.owner_id = auth.uid()::uuid
  )
);

CREATE POLICY "Comerciantes pueden actualizar sus propios productos" ON featured_products
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = featured_products.store_id
    AND stores.owner_id = auth.uid()::uuid
  )
);

CREATE POLICY "Comerciantes pueden eliminar sus propios productos" ON featured_products
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = featured_products.store_id
    AND stores.owner_id = auth.uid()::uuid
  )
);

CREATE POLICY "Administradores pueden ver todos los productos" ON featured_products
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()::uuid AND profiles.role = 'admin'
  )
);

CREATE POLICY "Administradores pueden actualizar todos los productos" ON featured_products
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()::uuid AND profiles.role = 'admin'
  )
);

-- Políticas RLS para product_stats
CREATE POLICY "Comerciantes pueden ver estadísticas de sus productos" ON product_stats
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM featured_products
    JOIN stores ON featured_products.store_id = stores.id
    WHERE featured_products.id = product_stats.product_id
    AND stores.owner_id = auth.uid()::uuid
  )
);

CREATE POLICY "Administradores pueden ver todas las estadísticas" ON product_stats
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()::uuid AND profiles.role = 'admin'
  )
);

-- Función para incrementar vistas de producto
CREATE OR REPLACE FUNCTION increment_product_view(p_product_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO product_stats (product_id, views)
  VALUES (p_product_id, 1)
  ON CONFLICT (product_id) DO UPDATE
  SET views = product_stats.views + 1,
      last_updated = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar clics de producto
CREATE OR REPLACE FUNCTION increment_product_click(p_product_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO product_stats (product_id, clicks)
  VALUES (p_product_id, 1)
  ON CONFLICT (product_id) DO UPDATE
  SET clicks = product_stats.clicks + 1,
      last_updated = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar conversiones de producto
CREATE OR REPLACE FUNCTION increment_product_conversion(p_product_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO product_stats (product_id, conversions)
  VALUES (p_product_id, 1)
  ON CONFLICT (product_id) DO UPDATE
  SET conversions = product_stats.conversions + 1,
      last_updated = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar el timestamp de actualización
CREATE OR REPLACE FUNCTION update_featured_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el timestamp de actualización
DROP TRIGGER IF EXISTS update_featured_products_updated_at ON featured_products;
CREATE TRIGGER update_featured_products_updated_at
BEFORE UPDATE ON featured_products
FOR EACH ROW
EXECUTE FUNCTION update_featured_products_updated_at();

-- Trigger para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_featured_products_modtime
BEFORE UPDATE ON featured_products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Trigger para actualizar el estado del producto basado en las fechas
CREATE OR REPLACE FUNCTION update_product_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Si la fecha de fin ha pasado, marcar como expirado
  IF NEW.end_date IS NOT NULL AND NEW.end_date < CURRENT_TIMESTAMP THEN
    NEW.status = 'expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_product_expiration
BEFORE INSERT OR UPDATE ON featured_products
FOR EACH ROW
EXECUTE FUNCTION update_product_status();
