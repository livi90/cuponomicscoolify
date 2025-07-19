-- Políticas de seguridad para la tabla tracking_pixels

-- Habilitar RLS
ALTER TABLE tracking_pixels ENABLE ROW LEVEL SECURITY;

-- Política para que los administradores puedan hacer todo
CREATE POLICY "Admins can manage all pixels" ON tracking_pixels
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Política para que los merchants puedan ver sus propios píxeles
CREATE POLICY "Store owners can view own pixels" ON tracking_pixels
    FOR SELECT
    TO authenticated
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = tracking_pixels.store_id
            AND stores.owner_id = auth.uid()
        )
    );

-- Política para que los merchants puedan crear píxeles para sus tiendas
CREATE POLICY "Store owners can create pixels" ON tracking_pixels
    FOR INSERT
    TO authenticated
    WITH CHECK (
        owner_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = tracking_pixels.store_id
            AND stores.owner_id = auth.uid()
            AND stores.status = 'approved'
        )
    );

-- Política para que los merchants puedan actualizar sus píxeles
CREATE POLICY "Store owners can update own pixels" ON tracking_pixels
    FOR UPDATE
    TO authenticated
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = tracking_pixels.store_id
            AND stores.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = tracking_pixels.store_id
            AND stores.owner_id = auth.uid()
        )
    );

-- Política para que los merchants puedan eliminar sus píxeles
CREATE POLICY "Store owners can delete own pixels" ON tracking_pixels
    FOR DELETE
    TO authenticated
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = tracking_pixels.store_id
            AND stores.owner_id = auth.uid()
        )
    );

-- Política para permitir acceso público a píxeles activos (para el script de tracking)
CREATE POLICY "Public access to active pixels" ON tracking_pixels
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);
