-- Verificar si la tabla de cupones existe
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(50),
  discount_value NUMERIC,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed', 'free_shipping', 'bogo', 'other')),
  start_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  terms_conditions TEXT,
  coupon_type VARCHAR(20) NOT NULL CHECK (coupon_type IN ('code', 'deal', 'free_shipping')),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verificar si la tabla de estadísticas de cupones existe
CREATE TABLE IF NOT EXISTS coupon_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear políticas de seguridad para la tabla de cupones
DO $$
BEGIN
  -- Eliminar políticas existentes para evitar duplicados
  DROP POLICY IF EXISTS "Cupones visibles para todos" ON coupons;
  DROP POLICY IF EXISTS "Comerciantes pueden crear cupones" ON coupons;
  DROP POLICY IF EXISTS "Comerciantes pueden actualizar sus cupones" ON coupons;
  DROP POLICY IF EXISTS "Comerciantes pueden eliminar sus cupones" ON coupons;
  DROP POLICY IF EXISTS "Administradores pueden gestionar todos los cupones" ON coupons;

  -- Crear nuevas políticas
  CREATE POLICY "Cupones visibles para todos" ON coupons
    FOR SELECT USING (true);

  CREATE POLICY "Comerciantes pueden crear cupones" ON coupons
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM stores
        WHERE stores.id = store_id
        AND stores.owner_id = auth.uid()
      )
    );

  CREATE POLICY "Comerciantes pueden actualizar sus cupones" ON coupons
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM stores
        WHERE stores.id = store_id
        AND stores.owner_id = auth.uid()
      )
    );

  CREATE POLICY "Comerciantes pueden eliminar sus cupones" ON coupons
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM stores
        WHERE stores.id = store_id
        AND stores.owner_id = auth.uid()
      )
    );

  CREATE POLICY "Administradores pueden gestionar todos los cupones" ON coupons
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    );
END
$$;
