-- Verificar si existe la extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla para registrar los buckets creados (para referencia)
CREATE TABLE IF NOT EXISTS storage_buckets_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bucket_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Insertar registro para el bucket media (esto es solo para registro, no crea el bucket)
INSERT INTO storage_buckets_log (bucket_name, created_by)
VALUES ('media', (SELECT id FROM auth.users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'))
ON CONFLICT DO NOTHING;
