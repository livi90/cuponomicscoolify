-- Crear el bucket principal para almacenamiento público
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;

-- Crear buckets específicos para diferentes tipos de contenido
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('products', 'products', true),
  ('stores', 'stores', true),
  ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de acceso para el bucket público
-- Permitir lectura pública
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'public');

-- Permitir a usuarios autenticados subir archivos
CREATE POLICY "Authenticated Users Can Upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'public' AND
    auth.role() = 'authenticated'
  );

-- Permitir a usuarios autenticados actualizar sus propios archivos
CREATE POLICY "Authenticated Users Can Update Own Files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'public' AND
    auth.uid() = owner
  );

-- Permitir a usuarios autenticados eliminar sus propios archivos
CREATE POLICY "Authenticated Users Can Delete Own Files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'public' AND
    auth.uid() = owner
  );

-- Configurar políticas para el bucket de productos
CREATE POLICY "Public Read Products" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Authenticated Users Can Upload Products" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated Users Can Update Own Products" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'products' AND
    auth.uid() = owner
  );

CREATE POLICY "Authenticated Users Can Delete Own Products" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'products' AND
    auth.uid() = owner
  );

-- Configurar políticas para el bucket de tiendas
CREATE POLICY "Public Read Stores" ON storage.objects
  FOR SELECT USING (bucket_id = 'stores');

CREATE POLICY "Authenticated Users Can Upload Stores" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'stores' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated Users Can Update Own Stores" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'stores' AND
    auth.uid() = owner
  );

CREATE POLICY "Authenticated Users Can Delete Own Stores" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'stores' AND
    auth.uid() = owner
  );

-- Configurar políticas para el bucket de perfiles
CREATE POLICY "Public Read Profiles" ON storage.objects
  FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Authenticated Users Can Upload Profiles" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profiles' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated Users Can Update Own Profiles" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profiles' AND
    auth.uid() = owner
  );

CREATE POLICY "Authenticated Users Can Delete Own Profiles" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profiles' AND
    auth.uid() = owner
  );
