-- Script principal para ejecutar todas las migraciones
-- Ejecutar en Supabase Self-Hosted

-- Habilitar extensión uuid-ossp si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ejecutar scripts en orden
\i 01-missing-tables.sql
\i 02-missing-triggers.sql
\i 03-missing-policies.sql
\i 04-missing-indexes.sql
\i 05-missing-sequences.sql
\i 06-missing-functions.sql
\i 07-setup-complete.sql

-- Mensaje de finalización
DO $$
BEGIN
  RAISE NOTICE 'Todas las migraciones han sido ejecutadas exitosamente';
  RAISE NOTICE 'Tu base de datos Self-Hosted ahora está sincronizada con Cloud';
END $$;
