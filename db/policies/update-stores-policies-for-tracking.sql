-- Actualizar políticas de stores para incluir campos de tracking
DROP POLICY IF EXISTS "Merchants can update own stores" ON stores;

CREATE POLICY "Merchants can update own stores" ON stores
    FOR UPDATE USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

-- Permitir que el script actualice el último ping
CREATE POLICY "Allow script status updates" ON stores
    FOR UPDATE USING (true)
    WITH CHECK (true);
