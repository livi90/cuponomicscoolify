SELECT 
    table_name, 
    column_name, 
    data_type 
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' AND 
    (
        (table_name = 'profiles' AND column_name = 'id') OR
        (table_name = 'stores' AND column_name IN ('id', 'owner_id'))
    )
ORDER BY
    table_name,
    column_name;
