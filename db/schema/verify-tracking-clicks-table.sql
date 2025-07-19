-- Verify the tracking_clicks table was created correctly
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'tracking_clicks' 
ORDER BY ordinal_position;

-- Check indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'tracking_clicks';

-- Check RLS policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'tracking_clicks';

-- Test the device detection function
SELECT 
    detect_device_type('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)') as mobile_test,
    detect_device_type('Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)') as tablet_test,
    detect_device_type('Mozilla/5.0 (Windows NT 10.0; Win64; x64)') as desktop_test,
    detect_device_type(NULL) as null_test;
