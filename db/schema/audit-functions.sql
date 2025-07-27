-- Funciones para auditoría de base de datos
-- Estas funciones deben ejecutarse en Supabase Cloud para generar el reporte completo

-- Función para obtener información de esquemas
CREATE OR REPLACE FUNCTION get_schemas()
RETURNS TABLE (
  schema_name text,
  schema_owner text,
  default_character_set_name text,
  default_collation_name text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    n.nspname as schema_name,
    pg_get_userbyid(n.nspowner) as schema_owner,
    NULL as default_character_set_name,
    NULL as default_collation_name
  FROM pg_namespace n
  WHERE n.nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
  AND n.nspname NOT LIKE 'pg_%'
  ORDER BY n.nspname;
$$;

-- Función para obtener información detallada de tablas
CREATE OR REPLACE FUNCTION get_tables_info()
RETURNS TABLE (
  table_schema text,
  table_name text,
  table_type text,
  table_owner text,
  row_count bigint,
  table_size text,
  index_size text,
  total_size text,
  columns jsonb
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_schema,
    t.table_name,
    t.table_type,
    pg_get_userbyid(c.relowner) as table_owner,
    CASE 
      WHEN c.reltuples >= 0 THEN c.reltuples::bigint
      ELSE 0
    END as row_count,
    pg_size_pretty(pg_total_relation_size(c.oid)) as table_size,
    pg_size_pretty(pg_indexes_size(c.oid)) as index_size,
    pg_size_pretty(pg_total_relation_size(c.oid)) as total_size,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'column_name', col.column_name,
          'data_type', col.data_type,
          'is_nullable', col.is_nullable,
          'column_default', col.column_default,
          'character_maximum_length', col.character_maximum_length
        )
      )
      FROM information_schema.columns col
      WHERE col.table_schema = t.table_schema 
      AND col.table_name = t.table_name
      ORDER BY col.ordinal_position), 
      '[]'::jsonb
    ) as columns
  FROM information_schema.tables t
  JOIN pg_class c ON c.relname = t.table_name
  JOIN pg_namespace n ON n.nspname = t.table_schema AND c.relnamespace = n.oid
  WHERE t.table_schema NOT IN ('information_schema', 'pg_catalog')
  AND t.table_type = 'BASE TABLE'
  ORDER BY t.table_schema, t.table_name;
END;
$$;

-- Función para obtener funciones
CREATE OR REPLACE FUNCTION get_functions()
RETURNS TABLE (
  function_schema text,
  function_name text,
  function_owner text,
  function_type text,
  return_type text,
  argument_types text,
  function_definition text,
  is_security_definer boolean
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    n.nspname as function_schema,
    p.proname as function_name,
    pg_get_userbyid(p.proowner) as function_owner,
    CASE p.prokind
      WHEN 'f' THEN 'function'
      WHEN 'p' THEN 'procedure'
      WHEN 'a' THEN 'aggregate'
      WHEN 'w' THEN 'window'
      ELSE 'unknown'
    END as function_type,
    pg_get_function_result(p.oid) as return_type,
    pg_get_function_arguments(p.oid) as argument_types,
    pg_get_functiondef(p.oid) as function_definition,
    p.prosecdef as is_security_definer
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname NOT IN ('information_schema', 'pg_catalog')
  AND n.nspname NOT LIKE 'pg_%'
  ORDER BY n.nspname, p.proname;
$$;

-- Función para obtener triggers
CREATE OR REPLACE FUNCTION get_triggers()
RETURNS TABLE (
  trigger_schema text,
  trigger_name text,
  table_schema text,
  table_name text,
  trigger_type text,
  trigger_timing text,
  trigger_orientation text,
  trigger_definition text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    n.nspname as trigger_schema,
    t.tgname as trigger_name,
    nt.nspname as table_schema,
    ct.relname as table_name,
    CASE t.tgtype & 66
      WHEN 2 THEN 'BEFORE'
      WHEN 64 THEN 'INSTEAD OF'
      ELSE 'AFTER'
    END as trigger_type,
    CASE t.tgtype & 28
      WHEN 4 THEN 'INSERT'
      WHEN 8 THEN 'DELETE'
      WHEN 16 THEN 'UPDATE'
      WHEN 12 THEN 'INSERT OR DELETE'
      WHEN 20 THEN 'INSERT OR UPDATE'
      WHEN 24 THEN 'DELETE OR UPDATE'
      WHEN 28 THEN 'INSERT OR DELETE OR UPDATE'
    END as trigger_timing,
    CASE t.tgtype & 1
      WHEN 1 THEN 'ROW'
      ELSE 'STATEMENT'
    END as trigger_orientation,
    pg_get_triggerdef(t.oid) as trigger_definition
  FROM pg_trigger t
  JOIN pg_class ct ON t.tgrelid = ct.oid
  JOIN pg_namespace nt ON ct.relnamespace = nt.oid
  JOIN pg_namespace n ON t.tgnamespace = n.oid
  WHERE NOT t.tgisinternal
  AND nt.nspname NOT IN ('information_schema', 'pg_catalog')
  ORDER BY nt.nspname, ct.relname, t.tgname;
$$;

-- Función para obtener políticas RLS
CREATE OR REPLACE FUNCTION get_policies()
RETURNS TABLE (
  schema_name text,
  table_name text,
  policy_name text,
  policy_roles text[],
  policy_cmd text,
  policy_qual text,
  policy_with_check text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    n.nspname as schema_name,
    c.relname as table_name,
    pol.polname as policy_name,
    CASE WHEN pol.polroles = '{0}' THEN ARRAY['PUBLIC']::text[]
         ELSE ARRAY(SELECT rolname FROM pg_roles WHERE oid = ANY(pol.polroles))
    END as policy_roles,
    CASE pol.polcmd
      WHEN 'r' THEN 'SELECT'
      WHEN 'a' THEN 'INSERT'
      WHEN 'w' THEN 'UPDATE'
      WHEN 'd' THEN 'DELETE'
      WHEN '*' THEN 'ALL'
    END as policy_cmd,
    pg_get_expr(pol.polqual, pol.polrelid) as policy_qual,
    pg_get_expr(pol.polwithcheck, pol.polrelid) as policy_with_check
  FROM pg_policy pol
  JOIN pg_class c ON c.oid = pol.polrelid
  JOIN pg_namespace n ON c.relnamespace = n.oid
  WHERE n.nspname NOT IN ('information_schema', 'pg_catalog')
  ORDER BY n.nspname, c.relname, pol.polname;
$$;

-- Función para obtener índices
CREATE OR REPLACE FUNCTION get_indexes()
RETURNS TABLE (
  schema_name text,
  table_name text,
  index_name text,
  index_type text,
  index_columns text,
  is_unique boolean,
  is_primary boolean,
  index_size text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    n.nspname as schema_name,
    t.relname as table_name,
    i.relname as index_name,
    am.amname as index_type,
    array_to_string(array_agg(a.attname ORDER BY array_position(ix.indkey, a.attnum)), ', ') as index_columns,
    ix.indisunique as is_unique,
    ix.indisprimary as is_primary,
    pg_size_pretty(pg_relation_size(i.oid)) as index_size
  FROM pg_index ix
  JOIN pg_class i ON i.oid = ix.indexrelid
  JOIN pg_class t ON t.oid = ix.indrelid
  JOIN pg_namespace n ON t.relnamespace = n.oid
  JOIN pg_am am ON i.relam = am.oid
  JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
  WHERE n.nspname NOT IN ('information_schema', 'pg_catalog')
  GROUP BY n.nspname, t.relname, i.relname, am.amname, ix.indisunique, ix.indisprimary, i.oid
  ORDER BY n.nspname, t.relname, i.relname;
$$;

-- Función para obtener secuencias
CREATE OR REPLACE FUNCTION get_sequences()
RETURNS TABLE (
  sequence_schema text,
  sequence_name text,
  sequence_owner text,
  data_type text,
  start_value bigint,
  minimum_value bigint,
  maximum_value bigint,
  increment bigint,
  cycle_option text,
  cache_size bigint
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    n.nspname as sequence_schema,
    s.relname as sequence_name,
    pg_get_userbyid(s.relowner) as sequence_owner,
    t.typname as data_type,
    seq.start_value,
    seq.minimum_value,
    seq.maximum_value,
    seq.increment,
    seq.cycle_option,
    seq.cache_size
  FROM pg_class s
  JOIN pg_namespace n ON s.relnamespace = n.oid
  JOIN pg_sequence seq ON s.oid = seq.seqrelid
  JOIN pg_type t ON seq.seqtypid = t.oid
  WHERE s.relkind = 'S'
  AND n.nspname NOT IN ('information_schema', 'pg_catalog')
  ORDER BY n.nspname, s.relname;
$$;

-- Función para obtener vistas
CREATE OR REPLACE FUNCTION get_views()
RETURNS TABLE (
  view_schema text,
  view_name text,
  view_owner text,
  view_definition text,
  is_updatable text,
  is_insertable_into text,
  is_trigger_updatable text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    v.table_schema as view_schema,
    v.table_name as view_name,
    pg_get_userbyid(c.relowner) as view_owner,
    v.view_definition,
    v.is_updatable,
    v.is_insertable_into,
    v.is_trigger_updatable
  FROM information_schema.views v
  JOIN pg_class c ON c.relname = v.table_name
  JOIN pg_namespace n ON n.nspname = v.table_schema AND c.relnamespace = n.oid
  WHERE v.table_schema NOT IN ('information_schema', 'pg_catalog')
  ORDER BY v.table_schema, v.table_name;
$$;

-- Función para obtener extensiones
CREATE OR REPLACE FUNCTION get_extensions()
RETURNS TABLE (
  extension_name text,
  extension_version text,
  extension_schema text,
  extension_description text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    e.extname as extension_name,
    e.extversion as extension_version,
    n.nspname as extension_schema,
    d.description as extension_description
  FROM pg_extension e
  JOIN pg_namespace n ON e.extnamespace = n.oid
  LEFT JOIN pg_description d ON d.objoid = e.oid AND d.objsubid = 0
  ORDER BY e.extname;
$$;

-- Función para obtener roles
CREATE OR REPLACE FUNCTION get_roles()
RETURNS TABLE (
  role_name text,
  role_type text,
  can_login boolean,
  can_create_role boolean,
  can_create_db boolean,
  can_init_repl boolean,
  can_bypass_rls boolean,
  connection_limit integer,
  valid_until timestamp with time zone,
  member_of text[]
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    r.rolname as role_name,
    CASE r.rolsuper
      WHEN true THEN 'superuser'
      WHEN false THEN 'normal'
    END as role_type,
    r.rolcanlogin as can_login,
    r.rolcreaterole as can_create_role,
    r.rolcreatedb as can_create_db,
    r.rolreplication as can_init_repl,
    r.rolbypassrls as can_bypass_rls,
    r.rolconnlimit as connection_limit,
    r.rolvaliduntil as valid_until,
    ARRAY(
      SELECT m.rolname 
      FROM pg_auth_members am
      JOIN pg_roles m ON m.oid = am.member
      WHERE am.roleid = r.oid
    ) as member_of
  FROM pg_roles r
  WHERE r.rolname NOT LIKE 'pg_%'
  ORDER BY r.rolname;
$$; 