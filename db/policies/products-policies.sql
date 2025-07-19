-- Políticas para la tabla featured_products

-- Habilitar RLS
ALTER TABLE featured_products ENABLE ROW LEVEL SECURITY;

-- Política para que los administradores puedan hacer todo
CREATE POLICY admin_all_featured_products ON featured_products
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
CREATE POLICY merchant_select_own_featured_products ON featured_products
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = featured_products.store_id
      AND stores.user_id = auth.uid()
    )
  );

-- Política para que los comerciantes puedan insertar productos en sus tiendas
CREATE POLICY merchant_insert_own_featured_products ON featured_products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = featured_products.store_id
      AND stores.user_id = auth.uid()
      AND stores.status = 'approved'
    )
  );

-- Política para que los comerciantes puedan actualizar sus propios productos
CREATE POLICY merchant_update_own_featured_products ON featured_products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = featured_products.store_id
      AND stores.user_id = auth.uid()
    )
  );

-- Política para que los comerciantes puedan eliminar sus propios productos
CREATE POLICY merchant_delete_own_featured_products ON featured_products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = featured_products.store_id
      AND stores.user_id = auth.uid()
    )
  );

-- Política para que todos los usuarios puedan ver productos activos
CREATE POLICY public_select_active_featured_products ON featured_products
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'active'
  );
