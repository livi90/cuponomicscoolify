-- Permitir que cualquier usuario autenticado pueda crear aplicaciones de tienda
DROP POLICY IF EXISTS "Users can create store applications" ON store_applications;
CREATE POLICY "Users can create store applications" ON store_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permitir que los usuarios vean sus propias aplicaciones
DROP POLICY IF EXISTS "Users can view own applications" ON store_applications;
CREATE POLICY "Users can view own applications" ON store_applications
  FOR SELECT USING (auth.uid() = user_id);

-- Permitir que los admins vean todas las aplicaciones
DROP POLICY IF EXISTS "Admins can view all applications" ON store_applications;
CREATE POLICY "Admins can view all applications" ON store_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Permitir que los admins actualicen aplicaciones
DROP POLICY IF EXISTS "Admins can update applications" ON store_applications;
CREATE POLICY "Admins can update applications" ON store_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
