-- Script de configuración completa
-- Ejecutar en Supabase Self-Hosted

-- Verificar que todas las tablas existen
DO $$
DECLARE
  missing_tables TEXT[] := ARRAY[
    'affiliate_tokens', 'banner_stats', 'banners', 'brands', 'categories',
    'coupon_stats', 'notifications', 'page_views', 'rating_comments',
    'rating_votes', 'system_logs'
  ];
  table_name TEXT;
BEGIN
  RAISE NOTICE '=== VERIFICACIÓN DE TABLAS ===';
  FOREACH table_name IN ARRAY missing_tables
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = table_name
    ) THEN
      RAISE NOTICE 'Tabla faltante: %', table_name;
    ELSE
      RAISE NOTICE '✅ Tabla existe: %', table_name;
    END IF;
  END LOOP;
END $$;

-- Verificar que todas las funciones existen
DO $$
DECLARE
  missing_functions TEXT[] := ARRAY[
    'detect_device_type', 'generate_pixel_id', 'increment_product_view',
    'add_store_utm_exception', 'update_payment_reminders_updated_at',
    'deactivate_expired_coupons', 'create_store_from_application',
    'auto_generate_pixel_id', 'update_coupons_updated_at',
    'update_profiles_updated_at', 'update_rating_comments_updated_at',
    'update_ratings_updated_at', 'update_store_applications_updated_at',
    'update_stores_updated_at'
  ];
  func_name TEXT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== VERIFICACIÓN DE FUNCIONES ===';
  FOREACH func_name IN ARRAY missing_functions
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' AND p.proname = func_name
    ) THEN
      RAISE NOTICE 'Función faltante: %', func_name;
    ELSE
      RAISE NOTICE '✅ Función existe: %', func_name;
    END IF;
  END LOOP;
END $$;

-- Verificar que RLS está habilitado en todas las tablas
DO $$
DECLARE
  table_record RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== VERIFICACIÓN DE RLS ===';
  FOR table_record IN 
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename NOT LIKE 'pg_%'
    ORDER BY tablename
  LOOP
    IF table_record.rowsecurity THEN
      RAISE NOTICE '✅ RLS habilitado en: %', table_record.tablename;
    ELSE
      RAISE NOTICE '❌ RLS no habilitado en: %', table_record.tablename;
    END IF;
  END LOOP;
END $$;

-- Insertar datos de ejemplo si las tablas están vacías
INSERT INTO public.categories (name, description, is_active, sort_order)
SELECT 'Electrónicos', 'Productos electrónicos y tecnología', true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Electrónicos');

INSERT INTO public.categories (name, description, is_active, sort_order)
SELECT 'Ropa', 'Ropa y accesorios', true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Ropa');

INSERT INTO public.categories (name, description, is_active, sort_order)
SELECT 'Hogar', 'Productos para el hogar', true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Hogar');

-- Mensaje de finalización
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'CONFIGURACIÓN COMPLETA FINALIZADA';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Verifica que todas las tablas, funciones y políticas estén creadas correctamente.';
  RAISE NOTICE '';
  RAISE NOTICE 'Si ves elementos marcados con ❌, revisa los scripts anteriores.';
  RAISE NOTICE 'Si todo está marcado con ✅, tu migración está completa.';
END $$;
