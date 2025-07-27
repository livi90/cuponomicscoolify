-- Migración para aplicar RLS a la tabla products existente
-- Ejecutar este script en Supabase SQL Editor

-- 1. Verificar que la tabla products existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
    RAISE EXCEPTION 'La tabla products no existe. Ejecuta primero el script de creación de la tabla.';
  END IF;
END $$;

-- 2. Habilitar RLS en la tabla products (si no está habilitado)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "admin_all_products" ON public.products;
DROP POLICY IF EXISTS "merchant_select_own_products" ON public.products;
DROP POLICY IF EXISTS "merchant_insert_own_products" ON public.products;
DROP POLICY IF EXISTS "merchant_update_own_products" ON public.products;
DROP POLICY IF EXISTS "merchant_delete_own_products" ON public.products;
DROP POLICY IF EXISTS "public_select_active_products" ON public.products;
DROP POLICY IF EXISTS "authenticated_select_active_store_products" ON public.products;

-- 4. Crear nuevas políticas RLS

-- Política para administradores (acceso completo)
CREATE POLICY "admin_all_products" ON public.products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Política para comerciantes - SELECT
CREATE POLICY "merchant_select_own_products" ON public.products
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = products.store_id
      AND stores.owner_id = auth.uid()
    )
  );

-- Política para comerciantes - INSERT
CREATE POLICY "merchant_insert_own_products" ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = products.store_id
      AND stores.owner_id = auth.uid()
    )
  );

-- Política para comerciantes - UPDATE
CREATE POLICY "merchant_update_own_products" ON public.products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = products.store_id
      AND stores.owner_id = auth.uid()
    )
  );

-- Política para comerciantes - DELETE
CREATE POLICY "merchant_delete_own_products" ON public.products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = products.store_id
      AND stores.owner_id = auth.uid()
    )
  );

-- Política para acceso público (solo productos activos)
CREATE POLICY "public_select_active_products" ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'active'
  );

-- Política adicional para usuarios autenticados
CREATE POLICY "authenticated_select_active_store_products" ON public.products
  FOR SELECT
  TO authenticated
  USING (
    status = 'active' AND
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = products.store_id
      AND stores.is_active = true
    )
  );

-- 5. Verificar que las políticas se crearon correctamente
SELECT 
  'Políticas aplicadas a products:' as message;

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- 6. Verificar el estado de RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'products'; 