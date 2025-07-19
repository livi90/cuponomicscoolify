-- Paso 1: Ver qué datos tenemos actualmente
SELECT 
  coupon_id,
  CASE 
    WHEN coupon_id ~ '^[0-9]+$' THEN 'numeric'
    WHEN coupon_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 'uuid'
    ELSE 'other'
  END as id_type,
  COUNT(*) as count
FROM tracking_clicks 
GROUP BY coupon_id, 
  CASE 
    WHEN coupon_id ~ '^[0-9]+$' THEN 'numeric'
    WHEN coupon_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 'uuid'
    ELSE 'other'
  END
ORDER BY id_type, coupon_id;
