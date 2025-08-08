-- =====================================================
-- CORREGIR TRIGGER DE REVIEWS
-- =====================================================
-- Ejecutar este script para corregir el trigger que causa el error

-- 1. Eliminar el trigger problemático
DROP TRIGGER IF EXISTS trigger_update_review_counters ON coupon_reviews;

-- 2. Crear una versión corregida del trigger que no actualice coupons.reviews_count
CREATE OR REPLACE FUNCTION update_review_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Actualizar contador de reviews del usuario
        UPDATE user_profiles 
        SET reviews_count = reviews_count + 1
        WHERE user_id = NEW.user_id;
        
        -- NOTA: No actualizamos coupons.reviews_count ya que esa columna no existe
        -- en la tabla coupons actual
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Actualizar contador de reviews del usuario
        UPDATE user_profiles 
        SET reviews_count = reviews_count - 1
        WHERE user_id = OLD.user_id;
        
        -- NOTA: No actualizamos coupons.reviews_count ya que esa columna no existe
        -- en la tabla coupons actual
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Recrear el trigger
CREATE TRIGGER trigger_update_review_counters
    AFTER INSERT OR DELETE ON coupon_reviews
    FOR EACH ROW EXECUTE FUNCTION update_review_counters();

-- 4. Verificar que el trigger se creó correctamente
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_review_counters';

-- 5. Actualizar contadores iniciales de user_profiles
UPDATE user_profiles 
SET reviews_count = (
    SELECT COUNT(*) 
    FROM coupon_reviews 
    WHERE user_id = user_profiles.user_id AND status = 'active'
);

-- 6. Verificar que los contadores se actualizaron
SELECT 
    up.display_name,
    up.reviews_count,
    COUNT(cr.id) as actual_reviews
FROM user_profiles up
LEFT JOIN coupon_reviews cr ON up.user_id = cr.user_id AND cr.status = 'active'
GROUP BY up.user_id, up.display_name, up.reviews_count
LIMIT 5;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
