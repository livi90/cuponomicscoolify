-- Verificar y corregir las políticas de RLS para la tabla stores

-- Habilitar RLS en la tabla stores si no está habilitado
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Administradores pueden insertar tiendas" ON stores;
DROP POLICY IF EXISTS "Todos pueden ver tiendas activas" ON stores;
DROP POLICY IF EXISTS "Propietarios pueden ver sus tiendas" ON stores;
DROP POLICY IF EXISTS "Administradores pueden ver todas las tiendas" ON stores;
DROP POLICY IF EXISTS "Propietarios pueden actualizar sus tiendas" ON stores;
DROP POLICY IF EXISTS "Administradores pueden actualizar cualquier tienda" ON stores;

-- Crear políticas nuevas y corregidas
-- Política para permitir a los administradores insertar tiendas
CREATE POLICY "Administradores pueden insertar tiendas" ON stores
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Política para permitir a todos ver tiendas activas
CREATE POLICY "Todos pueden ver tiendas activas" ON stores
FOR SELECT USING (is_active = true);

-- Política para permitir a los propietarios ver sus propias tiendas
CREATE POLICY "Propietarios pueden ver sus tiendas" ON stores
FOR SELECT USING (owner_id = auth.uid());

-- Política para permitir a los administradores ver todas las tiendas
CREATE POLICY "Administradores pueden ver todas las tiendas" ON stores
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Política para permitir a los propietarios actualizar sus tiendas
CREATE POLICY "Propietarios pueden actualizar sus tiendas" ON stores
FOR UPDATE USING (owner_id = auth.uid());

-- Política para permitir a los administradores actualizar cualquier tienda
CREATE POLICY "Administradores pueden actualizar cualquier tienda" ON stores
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Política para permitir a los administradores eliminar tiendas
CREATE POLICY "Administradores pueden eliminar tiendas" ON stores
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
