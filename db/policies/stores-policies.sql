-- Actualizar las políticas para permitir que un merchant tenga múltiples tiendas

-- Primero, eliminamos la política restrictiva si existe
DROP POLICY IF EXISTS "Merchants can only have one store" ON "public"."stores";

-- Luego creamos una política que permita a los merchants ver sus propias tiendas
CREATE POLICY "Merchants can view their own stores" 
ON "public"."stores"
FOR SELECT
TO authenticated
USING (
  (auth.uid() = owner_id) OR 
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
);

-- Política para permitir a los merchants crear múltiples tiendas
CREATE POLICY "Merchants can create multiple stores" 
ON "public"."stores"
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = owner_id) AND 
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'merchant' OR profiles.role = 'admin')))
);

-- Política para permitir a los merchants actualizar sus propias tiendas
CREATE POLICY "Merchants can update their own stores" 
ON "public"."stores"
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Política para permitir a los merchants eliminar sus propias tiendas
CREATE POLICY "Merchants can delete their own stores" 
ON "public"."stores"
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);
