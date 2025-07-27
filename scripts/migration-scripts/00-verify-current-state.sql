-- Script de verificación del estado actual de la base de datos
-- Ejecutar en el editor SQL de Supabase Self-Hosted ANTES de ejecutar las migraciones

-- =====================================================
-- VERIFICACIÓN DE TABLAS EXISTENTES
-- =====================================================

-- Tablas del esquema public que deberían existir
DO $$
DECLARE
    expected_tables TEXT[] := ARRAY[
        'affiliate_tokens', 'banner_stats', 'banners', 'brands', 'categories',
        'coupon_stats', 'notifications', 'page_views', 'rating_comments',
        'rating_votes', 'system_logs', 'products', 'outlet_products',
        'featured_products', 'store_images', 'subscription_plans',
        'user_subscriptions', 'subscription_payments', 'payment_reminders',
        'store_applications', 'tracking_clicks', 'tracking_conversions',
        'tracking_pixels', 'utm_tracking_exceptions', 'coupons', 'stores',
        'profiles', 'ratings', 'script_pings'
    ];
    table_name TEXT;
    missing_tables TEXT[] := ARRAY[]::TEXT[];
    existing_tables TEXT[] := ARRAY[]::TEXT[];
BEGIN
    RAISE NOTICE '=== VERIFICACIÓN DE TABLAS ===';
    
    -- Verificar cada tabla esperada
    FOREACH table_name IN ARRAY expected_tables
    LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = table_name
        ) THEN
            existing_tables := array_append(existing_tables, table_name);
            RAISE NOTICE '✅ Tabla EXISTE: %', table_name;
        ELSE
            missing_tables := array_append(missing_tables, table_name);
            RAISE NOTICE '❌ Tabla FALTA: %', table_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Resumen: % tablas existen, % tablas faltan', 
        array_length(existing_tables, 1), 
        array_length(missing_tables, 1);
    
    -- Mostrar tablas faltantes
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE NOTICE 'Tablas que necesitan ser creadas: %', array_to_string(missing_tables, ', ');
    END IF;
END $$;

-- =====================================================
-- VERIFICACIÓN DE FUNCIONES EXISTENTES
-- =====================================================

DO $$
DECLARE
    expected_functions TEXT[] := ARRAY[
        'detect_device_type', 'generate_pixel_id', 'increment_product_view',
        'add_store_utm_exception', 'update_payment_reminders_updated_at',
        'deactivate_expired_coupons', 'create_store_from_application',
        'auto_generate_pixel_id', 'update_coupons_updated_at',
        'update_profiles_updated_at', 'update_rating_comments_updated_at',
        'update_ratings_updated_at', 'update_store_applications_updated_at',
        'update_stores_updated_at', 'update_outlet_products_updated_at',
        'calculate_discount_percentage', 'has_active_subscription',
        'get_store_limit'
    ];
    func_name TEXT;
    missing_functions TEXT[] := ARRAY[]::TEXT[];
    existing_functions TEXT[] := ARRAY[]::TEXT[];
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== VERIFICACIÓN DE FUNCIONES ===';
    
    FOREACH func_name IN ARRAY expected_functions
    LOOP
        IF EXISTS (
            SELECT 1 FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public' AND p.proname = func_name
        ) THEN
            existing_functions := array_append(existing_functions, func_name);
            RAISE NOTICE '✅ Función EXISTE: %', func_name;
        ELSE
            missing_functions := array_append(missing_functions, func_name);
            RAISE NOTICE '❌ Función FALTA: %', func_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Resumen: % funciones existen, % funciones faltan', 
        array_length(existing_functions, 1), 
        array_length(missing_functions, 1);
END $$;

-- =====================================================
-- VERIFICACIÓN DE TRIGGERS EXISTENTES
-- =====================================================

DO $$
DECLARE
    expected_triggers TEXT[] := ARRAY[
        'payment_reminders_updated_at', 'trg_deactivate_expired_coupons',
        'trigger_auto_create_store_on_approval', 'trigger_auto_generate_pixel_id',
        'update_coupons_updated_at', 'update_profiles_updated_at',
        'update_rating_comments_updated_at', 'update_ratings_updated_at',
        'update_store_applications_updated_at', 'update_stores_updated_at',
        'update_outlet_products_updated_at', 'calculate_discount_percentage_trigger'
    ];
    trigger_name TEXT;
    missing_triggers TEXT[] := ARRAY[]::TEXT[];
    existing_triggers TEXT[] := ARRAY[]::TEXT[];
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== VERIFICACIÓN DE TRIGGERS ===';
    
    FOREACH trigger_name IN ARRAY expected_triggers
    LOOP
        IF EXISTS (
            SELECT 1 FROM pg_trigger t
            JOIN pg_class c ON t.tgrelid = c.oid
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE n.nspname = 'public' AND t.tgname = trigger_name
        ) THEN
            existing_triggers := array_append(existing_triggers, trigger_name);
            RAISE NOTICE '✅ Trigger EXISTE: %', trigger_name;
        ELSE
            missing_triggers := array_append(missing_triggers, trigger_name);
            RAISE NOTICE '❌ Trigger FALTA: %', trigger_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Resumen: % triggers existen, % triggers faltan', 
        array_length(existing_triggers, 1), 
        array_length(missing_triggers, 1);
END $$;

-- =====================================================
-- VERIFICACIÓN DE POLÍTICAS RLS
-- =====================================================

DO $$
DECLARE
    expected_policies TEXT[] := ARRAY[
        'tracking_clicks_public_insert', 'tracking_clicks_public_select',
        'admin_all_products', 'merchant_select_own_products',
        'merchant_insert_own_products', 'merchant_update_own_products',
        'merchant_delete_own_products', 'public_select_active_products'
    ];
    policy_name TEXT;
    missing_policies TEXT[] := ARRAY[]::TEXT[];
    existing_policies TEXT[] := ARRAY[]::TEXT[];
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== VERIFICACIÓN DE POLÍTICAS RLS ===';
    
    FOREACH policy_name IN ARRAY expected_policies
    LOOP
        IF EXISTS (
            SELECT 1 FROM pg_policy p
            JOIN pg_class c ON p.polrelid = c.oid
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE n.nspname = 'public' AND p.polname = policy_name
        ) THEN
            existing_policies := array_append(existing_policies, policy_name);
            RAISE NOTICE '✅ Política EXISTE: %', policy_name;
        ELSE
            missing_policies := array_append(missing_policies, policy_name);
            RAISE NOTICE '❌ Política FALTA: %', policy_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Resumen: % políticas existen, % políticas faltan', 
        array_length(existing_policies, 1), 
        array_length(missing_policies, 1);
END $$;

-- =====================================================
-- VERIFICACIÓN DE ÍNDICES IMPORTANTES
-- =====================================================

DO $$
DECLARE
    expected_indexes TEXT[] := ARRAY[
        'idx_coupons_expiry_date', 'idx_coupons_is_active', 'idx_coupons_store_id',
        'idx_stores_owner_id', 'idx_stores_store_application_id',
        'idx_tracking_pixels_active', 'idx_utm_exceptions_active',
        'idx_utm_exceptions_domain', 'idx_utm_exceptions_store_id',
        'idx_notifications_user_id', 'idx_ratings_coupon_id', 'idx_ratings_user_id'
    ];
    index_name TEXT;
    missing_indexes TEXT[] := ARRAY[]::TEXT[];
    existing_indexes TEXT[] := ARRAY[]::TEXT[];
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== VERIFICACIÓN DE ÍNDICES ===';
    
    FOREACH index_name IN ARRAY expected_indexes
    LOOP
        IF EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE schemaname = 'public' AND indexname = index_name
        ) THEN
            existing_indexes := array_append(existing_indexes, index_name);
            RAISE NOTICE '✅ Índice EXISTE: %', index_name;
        ELSE
            missing_indexes := array_append(missing_indexes, index_name);
            RAISE NOTICE '❌ Índice FALTA: %', index_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Resumen: % índices existen, % índices faltan', 
        array_length(existing_indexes, 1), 
        array_length(missing_indexes, 1);
END $$;

-- =====================================================
-- VERIFICACIÓN DE EXTENSIONES
-- =====================================================

DO $$
DECLARE
    expected_extensions TEXT[] := ARRAY['uuid-ossp'];
    ext_name TEXT;
    missing_extensions TEXT[] := ARRAY[]::TEXT[];
    existing_extensions TEXT[] := ARRAY[]::TEXT[];
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== VERIFICACIÓN DE EXTENSIONES ===';
    
    FOREACH ext_name IN ARRAY expected_extensions
    LOOP
        IF EXISTS (
            SELECT 1 FROM pg_extension WHERE extname = ext_name
        ) THEN
            existing_extensions := array_append(existing_extensions, ext_name);
            RAISE NOTICE '✅ Extensión EXISTE: %', ext_name;
        ELSE
            missing_extensions := array_append(missing_extensions, ext_name);
            RAISE NOTICE '❌ Extensión FALTA: %', ext_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Resumen: % extensiones existen, % extensiones faltan', 
        array_length(existing_extensions, 1), 
        array_length(missing_extensions, 1);
END $$;

-- =====================================================
-- VERIFICACIÓN DE RLS HABILITADO
-- =====================================================

DO $$
DECLARE
    table_record RECORD;
    rls_enabled_count INTEGER := 0;
    rls_disabled_count INTEGER := 0;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== VERIFICACIÓN DE RLS (Row Level Security) ===';
    
    FOR table_record IN 
        SELECT tablename, rowsecurity 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
        ORDER BY tablename
    LOOP
        IF table_record.rowsecurity THEN
            rls_enabled_count := rls_enabled_count + 1;
            RAISE NOTICE '✅ RLS HABILITADO: %', table_record.tablename;
        ELSE
            rls_disabled_count := rls_disabled_count + 1;
            RAISE NOTICE '❌ RLS DESHABILITADO: %', table_record.tablename;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Resumen RLS: % tablas con RLS habilitado, % tablas con RLS deshabilitado', 
        rls_enabled_count, rls_disabled_count;
END $$;

-- =====================================================
-- RESUMEN FINAL
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICACIÓN COMPLETADA';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Si ves elementos marcados con ❌, necesitas ejecutar los scripts de migración.';
    RAISE NOTICE 'Si todo está marcado con ✅, tu base de datos ya está actualizada.';
    RAISE NOTICE '';
    RAISE NOTICE 'Orden recomendado de ejecución:';
    RAISE NOTICE '1. 01-missing-tables.sql';
    RAISE NOTICE '2. 02-missing-triggers.sql';
    RAISE NOTICE '3. 03-missing-policies.sql';
    RAISE NOTICE '4. 04-missing-indexes.sql';
    RAISE NOTICE '5. 05-missing-sequences.sql';
    RAISE NOTICE '6. 06-missing-functions.sql';
    RAISE NOTICE '7. 07-setup-complete.sql';
    RAISE NOTICE '';
END $$; 