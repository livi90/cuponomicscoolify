-- Crear tabla para imágenes de tiendas
CREATE TABLE IF NOT EXISTS store_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas por store_id
CREATE INDEX IF NOT EXISTS idx_store_images_store_id ON store_images(store_id);

-- Políticas de seguridad para store_images
ALTER TABLE store_images ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los propietarios de tiendas ver sus imágenes
CREATE POLICY store_images_select_policy ON store_images
  FOR SELECT USING (
    auth.uid() IN (
      SELECT owner_id FROM stores WHERE id = store_id
    ) OR 
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    ) OR
    TRUE  -- Permitir lectura pública de imágenes
  );

-- Política para permitir a los propietarios de tiendas insertar imágenes
CREATE POLICY store_images_insert_policy ON store_images
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT owner_id FROM stores WHERE id = store_id
    ) OR 
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Política para permitir a los propietarios de tiendas actualizar sus imágenes
CREATE POLICY store_images_update_policy ON store_images
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT owner_id FROM stores WHERE id = store_id
    ) OR 
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Política para permitir a los propietarios de tiendas eliminar sus imágenes
CREATE POLICY store_images_delete_policy ON store_images
  FOR DELETE USING (
    auth.uid() IN (
      SELECT owner_id FROM stores WHERE id = store_id
    ) OR 
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );
