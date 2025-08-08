-- =====================================================
-- DATOS DE MUESTRA PARA EL SISTEMA SOCIAL
-- =====================================================
-- Ejecutar este script después de crear las tablas sociales

-- 1. Crear perfiles de usuario de muestra usando usuarios existentes
DO $$
DECLARE
    user_record RECORD;
    user_count INTEGER := 0;
BEGIN
    -- Crear perfiles para usuarios existentes (máximo 5)
    FOR user_record IN 
        SELECT id, email FROM auth.users 
        WHERE email IS NOT NULL 
        ORDER BY created_at 
        LIMIT 5
    LOOP
        user_count := user_count + 1;
        
        -- Crear perfil de usuario con datos de muestra
        INSERT INTO user_profiles (
            user_id, 
            display_name, 
            username, 
            bio, 
            reputation_points, 
            level, 
            experience_points
        ) VALUES (
            user_record.id,
            CASE user_count
                WHEN 1 THEN 'María García'
                WHEN 2 THEN 'Carlos López'
                WHEN 3 THEN 'Ana Martínez'
                WHEN 4 THEN 'David Rodríguez'
                WHEN 5 THEN 'Laura Sánchez'
            END,
            CASE user_count
                WHEN 1 THEN 'maria_garcia'
                WHEN 2 THEN 'carlos_lopez'
                WHEN 3 THEN 'ana_martinez'
                WHEN 4 THEN 'david_rodriguez'
                WHEN 5 THEN 'laura_sanchez'
            END,
            CASE user_count
                WHEN 1 THEN 'Amo encontrar las mejores ofertas y compartirlas con la comunidad'
                WHEN 2 THEN 'Experto en cupones de tecnología y gadgets'
                WHEN 3 THEN 'Siempre buscando ahorrar en moda y belleza'
                WHEN 4 THEN 'Especialista en ofertas de comida y restaurantes'
                WHEN 5 THEN 'Nueva en la comunidad, aprendiendo a ahorrar'
            END,
            CASE user_count
                WHEN 1 THEN 150
                WHEN 2 THEN 320
                WHEN 3 THEN 85
                WHEN 4 THEN 210
                WHEN 5 THEN 25
            END,
            CASE user_count
                WHEN 1 THEN 3
                WHEN 2 THEN 5
                WHEN 3 THEN 2
                WHEN 4 THEN 4
                WHEN 5 THEN 1
            END,
            CASE user_count
                WHEN 1 THEN 450
                WHEN 2 THEN 1200
                WHEN 3 THEN 200
                WHEN 4 THEN 800
                WHEN 5 THEN 50
            END
        ) ON CONFLICT (user_id) DO NOTHING;
    END LOOP;
    
    RAISE NOTICE 'Perfiles creados para % usuarios', user_count;
END $$;

-- 2. Crear algunas reviews de muestra usando cupones y tiendas existentes
DO $$
DECLARE
    sample_coupon_id UUID;
    sample_store_id UUID;
    user_record RECORD;
    review_count INTEGER := 0;
BEGIN
    -- Obtener un cupón existente
    SELECT id INTO sample_coupon_id FROM coupons WHERE is_active = true LIMIT 1;
    
    -- Obtener una tienda existente
    SELECT id INTO sample_store_id FROM stores WHERE is_active = true LIMIT 1;
    
    -- Si no hay cupones o tiendas, crear algunos de muestra
    IF sample_coupon_id IS NULL THEN
        INSERT INTO coupons (code, description, discount_type, discount_value, is_active, expiry_date) VALUES
        ('MUESTRA10', 'Cupón de muestra 10% descuento', 'percentage', 10, true, NOW() + INTERVAL '30 days')
        RETURNING id INTO sample_coupon_id;
    END IF;
    
    IF sample_store_id IS NULL THEN
        INSERT INTO stores (name, description, website, is_active, status) VALUES
        ('Tienda de Muestra', 'Tienda de ejemplo para testing', 'https://ejemplo.com', true, 'active')
        RETURNING id INTO sample_store_id;
    END IF;
    
    -- Crear reviews para usuarios que tengan perfiles
    FOR user_record IN 
        SELECT up.user_id 
        FROM user_profiles up 
        ORDER BY up.created_at 
        LIMIT 5
    LOOP
        review_count := review_count + 1;
        
        INSERT INTO coupon_reviews (
            user_id, coupon_id, store_id, rating, worked, worked_partially,
            title, review_text, pros, cons, purchase_amount, savings_amount
        ) VALUES (
            user_record.user_id, 
            sample_coupon_id, 
            sample_store_id, 
            CASE review_count
                WHEN 1 THEN 5
                WHEN 2 THEN 4
                WHEN 3 THEN 2
                WHEN 4 THEN 5
                WHEN 5 THEN 3
            END,
            CASE review_count
                WHEN 1 THEN true
                WHEN 2 THEN true
                WHEN 3 THEN false
                WHEN 4 THEN true
                WHEN 5 THEN true
            END,
            CASE review_count
                WHEN 1 THEN false
                WHEN 2 THEN false
                WHEN 3 THEN false
                WHEN 4 THEN false
                WHEN 5 THEN true
            END,
            CASE review_count
                WHEN 1 THEN '¡Excelente cupón!'
                WHEN 2 THEN 'Buen cupón, pero con limitaciones'
                WHEN 3 THEN 'No funcionó como esperaba'
                WHEN 4 THEN '¡Increíble ahorro!'
                WHEN 5 THEN 'Funcionó parcialmente'
            END,
            CASE review_count
                WHEN 1 THEN 'Funcionó perfectamente, ahorré mucho dinero en mi compra. El proceso fue muy sencillo y el descuento se aplicó correctamente.'
                WHEN 2 THEN 'El cupón funcionó bien, pero solo se puede usar una vez por cuenta. El descuento es real y vale la pena.'
                WHEN 3 THEN 'Intenté usar el cupón pero no se aplicó el descuento. Contacté al soporte pero no me ayudaron mucho.'
                WHEN 4 THEN 'Este cupón me salvó mucho dinero. Lo usé en una compra grande y el descuento fue significativo. Muy recomendado.'
                WHEN 5 THEN 'El cupón se aplicó pero solo en algunos productos. No está claro cuáles están incluidos en la oferta.'
            END,
            CASE review_count
                WHEN 1 THEN 'Descuento real, fácil de usar, proceso rápido'
                WHEN 2 THEN 'Descuento válido, ahorro real'
                WHEN 3 THEN 'Fácil de encontrar'
                WHEN 4 THEN 'Gran descuento, fácil aplicación, ahorro real'
                WHEN 5 THEN 'Algún descuento aplicado'
            END,
            CASE review_count
                WHEN 1 THEN 'Ninguno'
                WHEN 2 THEN 'Solo un uso por cuenta'
                WHEN 3 THEN 'No funcionó, mal soporte'
                WHEN 4 THEN 'Ninguno'
                WHEN 5 THEN 'Limitaciones no claras'
            END,
            CASE review_count
                WHEN 1 THEN 100.00
                WHEN 2 THEN 50.00
                WHEN 3 THEN 75.00
                WHEN 4 THEN 200.00
                WHEN 5 THEN 120.00
            END,
            CASE review_count
                WHEN 1 THEN 10.00
                WHEN 2 THEN 5.00
                WHEN 3 THEN 0.00
                WHEN 4 THEN 20.00
                WHEN 5 THEN 6.00
            END
        ) ON CONFLICT DO NOTHING;
    END LOOP;
    
    RAISE NOTICE 'Reviews creadas: %', review_count;
END $$;

-- 3. Crear algunos votos de muestra entre usuarios
DO $$
DECLARE
    review_record RECORD;
    voter_record RECORD;
    vote_count INTEGER := 0;
BEGIN
    -- Crear votos entre diferentes usuarios
    FOR review_record IN 
        SELECT cr.id, cr.user_id 
        FROM coupon_reviews cr 
        ORDER BY cr.created_at 
        LIMIT 3
    LOOP
        FOR voter_record IN 
            SELECT up.user_id 
            FROM user_profiles up 
            WHERE up.user_id != review_record.user_id 
            ORDER BY up.created_at 
            LIMIT 2
        LOOP
            vote_count := vote_count + 1;
            
            INSERT INTO review_votes (user_id, review_id, vote_type) VALUES
            (voter_record.user_id, review_record.id, 'like')
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Votos creados: %', vote_count;
END $$;

-- 4. Actualizar contadores de reviews útiles
UPDATE coupon_reviews 
SET is_helpful_count = (
    SELECT COUNT(*) 
    FROM review_votes 
    WHERE review_id = coupon_reviews.id AND vote_type = 'like'
);

-- 5. Actualizar reputación de usuarios
UPDATE user_profiles 
SET reputation_points = calculate_reputation(user_id),
    level = CASE 
        WHEN reputation_points >= 500 THEN 5
        WHEN reputation_points >= 300 THEN 4
        WHEN reputation_points >= 150 THEN 3
        WHEN reputation_points >= 50 THEN 2
        ELSE 1
    END;

-- 6. Verificar que los datos se insertaron correctamente
SELECT 
    'Reviews creadas:' as info,
    COUNT(*) as count
FROM coupon_reviews;

SELECT 
    'Perfiles de usuario:' as info,
    COUNT(*) as count
FROM user_profiles;

SELECT 
    'Votos creados:' as info,
    COUNT(*) as count
FROM review_votes;

-- Mostrar algunos datos de muestra
SELECT 
    'Datos de muestra creados:' as info,
    'Puedes ver las reviews en la página de calificar cupones' as message;

-- =====================================================
-- FIN DEL SCRIPT DE DATOS DE MUESTRA
-- =====================================================
