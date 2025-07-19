-- Políticas de seguridad para tracking_conversions
-- Solo los propietarios pueden ver sus conversiones, admins pueden ver todo

-- Habilitar RLS
ALTER TABLE tracking_conversions ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: usuarios ven solo sus conversiones, admins ven todo
CREATE POLICY "Users can view own conversions" ON tracking_conversions
    FOR SELECT USING (
        owner_id = auth.uid()
    );

-- Política para que los merchants solo vean conversiones de sus tiendas
CREATE POLICY "Merchants can view own conversions" ON tracking_conversions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = tracking_conversions.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

-- Política para que los usuarios puedan insertar conversiones en sus tiendas
CREATE POLICY "Users can insert conversions for own stores" ON tracking_conversions
    FOR INSERT WITH CHECK (
        owner_id = auth.uid()
    );

-- Política para que los usuarios puedan actualizar sus propias conversiones
CREATE POLICY "Users can update own conversions" ON tracking_conversions
    FOR UPDATE USING (
        owner_id = auth.uid()
    );

-- Política para que los merchants puedan actualizar sus conversiones
CREATE POLICY "Merchants can update own conversions" ON tracking_conversions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = tracking_conversions.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

-- Política para DELETE: solo admins pueden eliminar
CREATE POLICY "Only admins can delete conversions" ON tracking_conversions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Política para admins (pueden ver y gestionar todo)
CREATE POLICY "Admins can manage all conversions" ON tracking_conversions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Política para permitir inserción desde API pública (para píxeles)
CREATE POLICY "Allow public conversion tracking" ON tracking_conversions
    FOR INSERT WITH CHECK (true);

-- Comentarios
COMMENT ON POLICY "Users can view own conversions" ON tracking_conversions IS 'Los merchants solo pueden ver conversiones de sus tiendas';
COMMENT ON POLICY "Allow public conversion tracking" ON tracking_conversions IS 'Permite que los píxeles de tracking inserten conversiones';

-- Dar permisos necesarios
GRANT SELECT ON tracking_conversions TO authenticated;
GRANT INSERT ON tracking_conversions TO anon;
GRANT INSERT ON tracking_conversions TO authenticated;
GRANT UPDATE ON tracking_conversions TO authenticated;
