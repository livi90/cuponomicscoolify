-- Políticas de seguridad para tracking_conversions
-- Solo los propietarios pueden ver sus conversiones, admins pueden ver todo

-- Habilitar RLS
ALTER TABLE tracking_conversions ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can view own conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Merchants can view own conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Users can insert conversions for own stores" ON tracking_conversions;
DROP POLICY IF EXISTS "Users can update own conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Merchants can update own conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Only admins can delete conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Admins can manage all conversions" ON tracking_conversions;
DROP POLICY IF EXISTS "Allow public conversion tracking" ON tracking_conversions;

-- Política para SELECT: merchants ven solo conversiones de sus tiendas
CREATE POLICY "Merchants can view own store conversions" ON tracking_conversions
    FOR SELECT USING (
        owner_id = auth.uid()::uuid OR
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = tracking_conversions.store_id 
            AND stores.owner_id = auth.uid()::uuid
        )
    );

-- Política para admins: pueden ver todo
CREATE POLICY "Admins can view all conversions" ON tracking_conversions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::uuid 
            AND profiles.role = 'admin'
        )
    );

-- Política para INSERT: permitir inserción desde API pública (para píxeles)
CREATE POLICY "Allow conversion tracking inserts" ON tracking_conversions
    FOR INSERT WITH CHECK (true);

-- Política para UPDATE: solo propietarios de tiendas pueden actualizar
CREATE POLICY "Store owners can update conversions" ON tracking_conversions
    FOR UPDATE USING (
        owner_id = auth.uid()::uuid OR
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = tracking_conversions.store_id 
            AND stores.owner_id = auth.uid()::uuid
        )
    );

-- Política para UPDATE: admins pueden actualizar todo
CREATE POLICY "Admins can update all conversions" ON tracking_conversions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::uuid 
            AND profiles.role = 'admin'
        )
    );

-- Política para DELETE: solo admins pueden eliminar
CREATE POLICY "Only admins can delete conversions" ON tracking_conversions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()::uuid 
            AND profiles.role = 'admin'
        )
    );

-- Dar permisos necesarios
GRANT SELECT ON tracking_conversions TO authenticated;
GRANT INSERT ON tracking_conversions TO anon;
GRANT INSERT ON tracking_conversions TO authenticated;
GRANT UPDATE ON tracking_conversions TO authenticated;

-- Comentarios
COMMENT ON POLICY "Merchants can view own store conversions" ON tracking_conversions IS 'Los merchants solo pueden ver conversiones de sus tiendas';
COMMENT ON POLICY "Allow conversion tracking inserts" ON tracking_conversions IS 'Permite que los píxeles de tracking inserten conversiones';
