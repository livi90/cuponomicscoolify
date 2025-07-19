-- Eliminar la política restrictiva actual
DROP POLICY IF EXISTS "Merchants can create multiple stores" ON "public"."stores";

-- Crear una nueva política que permita a los administradores crear tiendas para otros usuarios
CREATE POLICY "Merchants and admins can create stores" 
ON "public"."stores"
FOR INSERT
TO authenticated
WITH CHECK (
  -- El usuario puede crear su propia tienda si es merchant o admin
  (auth.uid() = owner_id AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.role = 'merchant' OR profiles.role = 'admin')
  ))
  OR
  -- Los administradores pueden crear tiendas para otros usuarios
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ))
);
