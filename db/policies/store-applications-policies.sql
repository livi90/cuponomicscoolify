-- Eliminar políticas existentes para store_applications
DROP POLICY IF EXISTS "Usuarios pueden crear solicitudes de tienda" ON store_applications;
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias solicitudes" ON store_applications;
DROP POLICY IF EXISTS "Administradores pueden ver todas las solicitudes" ON store_applications;
DROP POLICY IF EXISTS "Administradores pueden actualizar cualquier solicitud" ON store_applications;

-- Habilitar RLS en la tabla store_applications si no está habilitado
ALTER TABLE store_applications ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios crear solicitudes de tienda (sin límite)
CREATE POLICY "Usuarios pueden crear solicitudes de tienda" ON store_applications
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para permitir a los usuarios ver sus propias solicitudes
CREATE POLICY "Usuarios pueden ver sus propias solicitudes" ON store_applications
FOR SELECT USING (auth.uid() = user_id);

-- Política para permitir a los administradores ver todas las solicitudes
CREATE POLICY "Administradores pueden ver todas las solicitudes" ON store_applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Política para permitir a los administradores actualizar cualquier solicitud
CREATE POLICY "Administradores pueden actualizar cualquier solicitud" ON store_applications
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
