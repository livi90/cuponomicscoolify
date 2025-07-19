-- Script completo para cambiar stores.owner_id de TEXT a UUID
-- Elimina TODAS las políticas que dependen de owner_id primero

-- Paso 1: Eliminar TODAS las políticas que pueden depender de owner_id
-- Políticas de stores
DROP POLICY IF EXISTS "Merchants can view their own stores" ON stores;
DROP POLICY IF EXISTS "Merchants can create multiple stores" ON stores;
DROP POLICY IF EXISTS "Merchants can update their own stores" ON stores;
DROP POLICY IF EXISTS "Merchants can delete their own stores" ON stores;

-- Políticas de products (si existen)
DROP POLICY IF EXISTS "Merchants can view own products" ON products;
DROP POLICY IF EXISTS "Merchants can insert products" ON products;
DROP POLICY IF EXISTS "Merchants can update own products" ON products;
DROP POLICY IF EXISTS "Merchants can delete own products" ON products;

-- Políticas de coupons (si existen)
DROP POLICY IF EXISTS "Merchants can view own coupons" ON coupons;
DROP POLICY IF EXISTS "Merchants can insert coupons" ON coupons;
DROP POLICY IF EXISTS "Merchants can update own coupons" ON coupons;
DROP POLICY IF EXISTS "Merchants can delete own coupons" ON coupons;

-- Paso 2: Cambiar el tipo de dato
ALTER TABLE stores
ALTER COLUMN owner_id TYPE UUID USING owner_id::uuid;

-- Paso 3: Recrear las políticas básicas de stores
CREATE POLICY "Merchants can view their own stores" 
ON stores
FOR SELECT
TO authenticated
USING (
  (auth.uid() = owner_id) OR 
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
);

CREATE POLICY "Merchants can create multiple stores" 
ON stores
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = owner_id) AND 
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'merchant' OR profiles.role = 'admin')))
);

CREATE POLICY "Merchants can update their own stores" 
ON stores
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Merchants can delete their own stores" 
ON stores
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Paso 4: Recrear políticas de products si la tabla existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
        CREATE POLICY "Merchants can view own products" ON products
        FOR SELECT
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM stores 
                WHERE stores.id = products.store_id 
                AND stores.owner_id = auth.uid()
            )
        );
        
        CREATE POLICY "Merchants can insert products" ON products
        FOR INSERT
        TO authenticated
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM stores 
                WHERE stores.id = products.store_id 
                AND stores.owner_id = auth.uid()
            )
        );
        
        CREATE POLICY "Merchants can update own products" ON products
        FOR UPDATE
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM stores 
                WHERE stores.id = products.store_id 
                AND stores.owner_id = auth.uid()
            )
        );
        
        CREATE POLICY "Merchants can delete own products" ON products
        FOR DELETE
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM stores 
                WHERE stores.id = products.store_id 
                AND stores.owner_id = auth.uid()
            )
        );
    END IF;
END $$;

-- Paso 5: Recrear políticas de coupons si la tabla existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'coupons') THEN
        CREATE POLICY "Merchants can view own coupons" ON coupons
        FOR SELECT
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM stores 
                WHERE stores.id = coupons.store_id 
                AND stores.owner_id = auth.uid()
            )
        );
        
        CREATE POLICY "Merchants can insert coupons" ON coupons
        FOR INSERT
        TO authenticated
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM stores 
                WHERE stores.id = coupons.store_id 
                AND stores.owner_id = auth.uid()
            )
        );
        
        CREATE POLICY "Merchants can update own coupons" ON coupons
        FOR UPDATE
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM stores 
                WHERE stores.id = coupons.store_id 
                AND stores.owner_id = auth.uid()
            )
        );
        
        CREATE POLICY "Merchants can delete own coupons" ON coupons
        FOR DELETE
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM stores 
                WHERE stores.id = coupons.store_id 
                AND stores.owner_id = auth.uid()
            )
        );
    END IF;
END $$;

COMMENT ON COLUMN stores.owner_id IS 'Tipo de dato corregido a UUID para consistencia con auth.users';
