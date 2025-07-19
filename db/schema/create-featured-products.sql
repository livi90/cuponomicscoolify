-- Crear la tabla featured_products si no existe
CREATE TABLE IF NOT EXISTS featured_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  image_url TEXT,
  category VARCHAR(100),
  tags TEXT[],
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft'))
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_featured_products_store_id ON featured_products(store_id);
CREATE INDEX IF NOT EXISTS idx_featured_products_category ON featured_products(category);
CREATE INDEX IF NOT EXISTS idx_featured_products_status ON featured_products(status);
CREATE INDEX IF NOT EXISTS idx_featured_products_is_featured ON featured_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_featured_products_is_new ON featured_products(is_new);
CREATE INDEX IF NOT EXISTS idx_featured_products_is_on_sale ON featured_products(is_on_sale);

-- Añadir políticas RLS
ALTER TABLE featured_products ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios ver productos activos
CREATE POLICY featured_products_select_policy ON featured_products
  FOR SELECT USING (status = 'active');

-- Política para permitir a los propietarios de tiendas gestionar sus productos
CREATE POLICY featured_products_store_owner_policy ON featured_products
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Política para permitir a los administradores gestionar todos los productos
CREATE POLICY featured_products_admin_policy ON featured_products
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Añadir datos de ejemplo
INSERT INTO featured_products (
  store_id, 
  name, 
  description, 
  price, 
  sale_price, 
  category, 
  is_new, 
  is_featured, 
  is_on_sale, 
  stock_quantity, 
  status
)
SELECT 
  id as store_id,
  'Producto de ejemplo ' || s.name,
  'Este es un producto de ejemplo para la tienda ' || s.name,
  ROUND((RANDOM() * 100)::numeric, 2),
  CASE WHEN RANDOM() > 0.5 THEN ROUND((RANDOM() * 80)::numeric, 2) ELSE NULL END,
  (ARRAY['Electrónica', 'Moda', 'Hogar', 'Alimentación', 'Belleza'])[floor(random() * 5 + 1)],
  RANDOM() > 0.7,
  RANDOM() > 0.7,
  RANDOM() > 0.5,
  floor(random() * 100),
  'active'
FROM stores s
WHERE s.status = 'approved'
LIMIT 20;
