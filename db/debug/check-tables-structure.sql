-- Verificar estructura de la tabla utm_tracking_exceptions
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'utm_tracking_exceptions'
ORDER BY ordinal_position;
