-- =====================================================
-- AGREGAR COLUMNA REVIEWS_COUNT A TABLA COUPONS
-- =====================================================
-- Ejecutar este script para agregar la columna faltante

-- 1. Agregar la columna reviews_count a la tabla coupons
ALTER TABLE coupons 
ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;

-- 2. Actualizar el contador inicial basado en reviews existentes
UPDATE coupons 
SET reviews_count = (
    SELECT COUNT(*) 
    FROM coupon_reviews 
    WHERE coupon_id = coupons.id AND status = 'active'
);

-- 3. Verificar que la columna se agregó correctamente
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'coupons' 
AND column_name = 'reviews_count';

-- 4. Mostrar algunos cupones con su contador de reviews
SELECT 
    c.code,
    c.description,
    c.reviews_count,
    COUNT(cr.id) as actual_reviews
FROM coupons c
LEFT JOIN coupon_reviews cr ON c.id = cr.coupon_id AND cr.status = 'active'
GROUP BY c.id, c.code, c.description, c.reviews_count
LIMIT 5;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
