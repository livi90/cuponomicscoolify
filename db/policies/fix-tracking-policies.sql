-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "tracking_clicks_insert_policy" ON tracking_clicks;
DROP POLICY IF EXISTS "tracking_clicks_select_policy" ON tracking_clicks;

-- Crear políticas más permisivas para tracking
CREATE POLICY "tracking_clicks_insert_policy" ON tracking_clicks
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "tracking_clicks_select_policy" ON tracking_clicks
FOR SELECT 
TO public
USING (true);

-- Asegurar que RLS esté habilitado
ALTER TABLE tracking_clicks ENABLE ROW LEVEL SECURITY;

-- Dar permisos de inserción a usuarios anónimos
GRANT INSERT ON tracking_clicks TO anon;
GRANT INSERT ON tracking_clicks TO authenticated;
