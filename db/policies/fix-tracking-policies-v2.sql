-- Eliminar políticas existentes
DROP POLICY IF EXISTS "tracking_clicks_insert_policy" ON tracking_clicks;
DROP POLICY IF EXISTS "tracking_clicks_select_policy" ON tracking_clicks;
DROP POLICY IF EXISTS "Allow anonymous tracking clicks insert" ON tracking_clicks;
DROP POLICY IF EXISTS "Users can view own tracking clicks" ON tracking_clicks;
DROP POLICY IF EXISTS "Admins can view all tracking clicks" ON tracking_clicks;

-- Crear políticas más permisivas para tracking
CREATE POLICY "tracking_clicks_public_insert" ON tracking_clicks
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "tracking_clicks_public_select" ON tracking_clicks
FOR SELECT 
TO public
USING (true);

-- Asegurar que RLS esté habilitado
ALTER TABLE tracking_clicks ENABLE ROW LEVEL SECURITY;

-- Dar permisos completos a usuarios anónimos y autenticados
GRANT ALL ON tracking_clicks TO anon;
GRANT ALL ON tracking_clicks TO authenticated;
GRANT ALL ON tracking_clicks TO public;

-- Verificar que la tabla existe y tiene la estructura correcta
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tracking_clicks') THEN
        RAISE EXCEPTION 'Table tracking_clicks does not exist. Please run the table creation script first.';
    END IF;
END $$;
