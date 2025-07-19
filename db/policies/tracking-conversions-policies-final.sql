-- Políticas de seguridad para tracking_conversions
-- Ahora que stores.owner_id es UUID, estas políticas funcionarán sin problemas.

-- Habilitar RLS
ALTER TABLE tracking_conversions ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para una instalación limpia
DROP POLICY IF EXISTS "Merchants can view own store conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Admins can view all conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Allow conversion tracking inserts" ON tracking_conversions;
DROP POLICY IF EXISTS "Store owners can update conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Admins can update all conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Only admins can delete conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Admins can manage all conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Merchants can update own conversion status" ON tracking_conversions;

-- Política para que los administradores puedan hacer todo
CREATE POLICY "Admins can manage all conversions" ON tracking_conversions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Política para SELECT: merchants ven solo conversiones de sus tiendas
CREATE POLICY "Merchants can view own store conversions" ON tracking_conversions
    FOR SELECT
    TO authenticated
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = tracking_conversions.store_id
            AND stores.owner_id = auth.uid()
        )
    );

-- Política para INSERT: permitir inserción desde API pública (para píxeles)
CREATE POLICY "Allow conversion tracking inserts" ON tracking_conversions
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- Política para UPDATE: solo propietarios de tiendas pueden actualizar
CREATE POLICY "Merchants can update own conversion status" ON tracking_conversions
    FOR UPDATE
    TO authenticated
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = tracking_conversions.store_id
            AND stores.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = tracking_conversions.store_id
            AND stores.owner_id = auth.uid()
        )
    );

-- Dar permisos necesarios
GRANT SELECT ON tracking_conversions TO authenticated;
GRANT INSERT ON tracking_conversions TO anon, authenticated;
GRANT UPDATE ON tracking_conversions TO authenticated;
GRANT DELETE ON tracking_conversions TO authenticated;
