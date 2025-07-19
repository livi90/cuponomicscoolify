-- Políticas de seguridad para la tabla de cupones
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

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
      AND stores.owner_id = auth.uid()::uuid
    )
  );

CREATE POLICY "Comerciantes pueden actualizar sus cupones" ON coupons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = store_id
      AND stores.owner_id = auth.uid()::uuid
    )
  );

CREATE POLICY "Comerciantes pueden eliminar sus cupones" ON coupons
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = store_id
      AND stores.owner_id = auth.uid()::uuid
    )
  );

CREATE POLICY "Administradores pueden gestionar todos los cupones" ON coupons
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()::uuid
      AND profiles.role = 'admin'
    )
  );
