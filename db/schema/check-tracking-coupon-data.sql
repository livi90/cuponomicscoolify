-- Ver qué datos tenemos actualmente en tracking_clicks
SELECT 
  coupon_id,
  coupon_id::text as coupon_id_text,
  LENGTH(coupon_id::text) as id_length,
  COUNT(*) as count
FROM tracking_clicks 
GROUP BY coupon_id
ORDER BY coupon_id
LIMIT 20;
