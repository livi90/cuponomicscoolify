-- Verificar los tipos de datos actuales de las tablas relacionadas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('tracking_clicks', 'profiles', 'stores', 'coupons')
    AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Verificar específicamente el tipo de ID de tracking_clicks
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'tracking_clicks' 
    AND column_name = 'id'
    AND table_schema = 'public';
