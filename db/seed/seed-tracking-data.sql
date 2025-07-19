-- Insertar algunos píxeles de ejemplo (solo si no existen)
INSERT INTO tracking_pixels (
    owner_id,
    store_id,
    pixel_name,
    pixel_id,
    commission_rate,
    store_url,
    platform,
    is_active
)
SELECT 
    s.owner_id,
    s.id,
    'Píxel Principal',
    'px_test_' || substr(s.id::text, 1, 8),
    5.00,
    'https://' || lower(s.name) || '.com',
    'shopify',
    true
FROM stores s
WHERE NOT EXISTS (
    SELECT 1 FROM tracking_pixels tp 
    WHERE tp.store_id = s.id
)
LIMIT 5;

-- Insertar algunas conversiones de ejemplo
INSERT INTO tracking_conversions (
    owner_id,
    store_id,
    click_id,
    conversion_type,
    conversion_value,
    commission_rate,
    order_id,
    product_names,
    quantity,
    utm_source,
    utm_medium,
    utm_campaign,
    coupon_code,
    discount_applied,
    platform,
    status,
    verification_method,
    customer_email,
    is_new_customer,
    converted_at
)
SELECT 
    s.owner_id,
    s.id,
    tc.id,
    'purchase',
    ROUND((RANDOM() * 200 + 20)::numeric, 2), -- Valor entre 20 y 220
    5.00,
    'ORDER_' || LPAD((RANDOM() * 99999)::int::text, 5, '0'),
    ARRAY['Producto ' || (RANDOM() * 100)::int],
    (RANDOM() * 3 + 1)::int,
    'cuponomics',
    'affiliate',
    'black-friday-2024',
    'DESCUENTO' || (RANDOM() * 50 + 10)::int,
    ROUND((RANDOM() * 30 + 5)::numeric, 2),
    CASE (RANDOM() * 3)::int 
        WHEN 0 THEN 'shopify'
        WHEN 1 THEN 'woocommerce'
        ELSE 'magento'
    END,
    CASE (RANDOM() * 4)::int
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'confirmed'
        WHEN 2 THEN 'confirmed'
        ELSE 'confirmed'
    END,
    'pixel',
    'cliente' || (RANDOM() * 1000)::int || '@email.com',
    RANDOM() > 0.3,
    NOW() - (RANDOM() * INTERVAL '30 days')
FROM stores s
JOIN tracking_clicks tc ON tc.coupon_id IN (
    SELECT c.id FROM coupons c WHERE c.store_id = s.id LIMIT 1
)
WHERE EXISTS (SELECT 1 FROM tracking_pixels tp WHERE tp.store_id = s.id)
LIMIT 20; -- Crear 20 conversiones de ejemplo

-- Insertar conversiones de prueba (solo si existen píxeles y cupones)
INSERT INTO tracking_conversions (
    owner_id, 
    store_id, 
    conversion_type,
    conversion_value, 
    commission_rate,
    order_id,
    utm_source,
    utm_medium,
    utm_campaign,
    coupon_code,
    platform,
    status,
    verification_method,
    customer_email,
    is_new_customer
)
SELECT 
    s.owner_id,
    s.id as store_id,
    'purchase',
    (random() * 200 + 50)::decimal(10,2), -- Entre 50 y 250
    5.00,
    'ORDER_' || generate_random_uuid()::text,
    'cuponomics',
    'affiliate',
    'black-friday-2024',
    'DESCUENTO20',
    'shopify',
    CASE 
        WHEN random() > 0.8 THEN 'confirmed'
        WHEN random() > 0.9 THEN 'cancelled'
        ELSE 'pending'
    END,
    'pixel',
    'customer' || floor(random() * 1000) || '@example.com',
    random() > 0.3
FROM stores s
CROSS JOIN generate_series(1, 3) -- 3 conversiones por tienda
WHERE EXISTS (SELECT 1 FROM tracking_pixels tp WHERE tp.store_id = s.id)
LIMIT 15;

-- Actualizar estadísticas de píxeles
UPDATE tracking_pixels SET
    total_conversions = (
        SELECT COUNT(*) 
        FROM tracking_conversions tc 
        WHERE tc.store_id = tracking_pixels.store_id
    ),
    total_revenue = (
        SELECT COALESCE(SUM(conversion_value), 0) 
        FROM tracking_conversions tc 
        WHERE tc.store_id = tracking_pixels.store_id
        AND status = 'confirmed'
    ),
    total_commission = (
        SELECT COALESCE(SUM(commission_amount), 0) 
        FROM tracking_conversions tc 
        WHERE tc.store_id = tracking_pixels.store_id
    ),
    last_activity_at = NOW() - (random() * interval '7 days')
WHERE EXISTS (
    SELECT 1 FROM tracking_conversions tc 
    WHERE tc.store_id = tracking_pixels.store_id
);

-- Función auxiliar para generar UUID (si no existe)
CREATE OR REPLACE FUNCTION generate_random_uuid()
RETURNS UUID AS $$
BEGIN
    RETURN gen_random_uuid();
END;
$$ LANGUAGE plpgsql;

-- Mostrar resumen de datos creados
SELECT 
    'Píxeles creados' as tipo,
    COUNT(*) as cantidad
FROM tracking_pixels
UNION ALL
SELECT 
    'Conversiones creadas' as tipo,
    COUNT(*) as cantidad
FROM tracking_conversions
UNION ALL
SELECT 
    'Revenue total' as tipo,
    ROUND(SUM(conversion_value)::numeric, 2) as cantidad
FROM tracking_conversions
WHERE status = 'confirmed';
