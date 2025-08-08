-- =====================================================
-- DATOS DE EJEMPLO PARA SISTEMA DE DETECCIÓN
-- =====================================================
-- Este script inserta datos de ejemplo para probar el sistema
-- de detección de scripts removidos

-- Simular algunas tiendas con scripts inactivos
UPDATE stores 
SET 
  script_status = 'inactive',
  script_last_ping = NOW() - INTERVAL '8 days'
WHERE id IN (
  SELECT id FROM stores LIMIT 2
);

-- Simular tiendas con scripts críticamente inactivos
UPDATE stores 
SET 
  script_status = 'inactive',
  script_last_ping = NOW() - INTERVAL '15 days'
WHERE id IN (
  SELECT id FROM stores OFFSET 2 LIMIT 1
);

-- Simular tiendas con scripts nunca instalados
UPDATE stores 
SET 
  script_status = 'never_installed',
  script_last_ping = NULL
WHERE id IN (
  SELECT id FROM stores OFFSET 3 LIMIT 1
);

-- Insertar algunas alertas de ejemplo
INSERT INTO script_removal_alerts (
  store_id,
  alert_type,
  risk_level,
  previous_status,
  current_status,
  last_ping_timestamp,
  hours_since_last_ping,
  potential_revenue_loss,
  detection_method,
  is_resolved
) 
SELECT 
  s.id,
  'script_removed',
  CASE 
    WHEN s.script_last_ping IS NULL THEN 'critical'
    WHEN EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 168 THEN 'critical'
    WHEN EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 72 THEN 'high'
    ELSE 'medium'
  END,
  'active',
  s.script_status,
  s.script_last_ping,
  EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600::INTEGER,
  RANDOM() * 500 + 100, -- Pérdida aleatoria entre 100-600€
  'automatic',
  FALSE
FROM stores s
WHERE s.script_status IN ('inactive', 'never_installed')
AND (
  s.script_last_ping IS NULL OR s.script_last_ping < NOW() - INTERVAL '24 hours'
)
LIMIT 5;

-- Insertar algunos intentos de reinstalación de ejemplo
INSERT INTO script_reinstallation_attempts (
  store_id,
  attempt_type,
  status,
  sent_at,
  response_received,
  response_notes
)
SELECT 
  s.id,
  CASE (RANDOM() * 2)::INTEGER
    WHEN 0 THEN 'email'
    WHEN 1 THEN 'notification'
    ELSE 'manual_contact'
  END,
  CASE (RANDOM() * 3)::INTEGER
    WHEN 0 THEN 'pending'
    WHEN 1 THEN 'sent'
    WHEN 2 THEN 'delivered'
    ELSE 'failed'
  END,
  NOW() - INTERVAL '2 days',
  RANDOM() > 0.5,
  CASE 
    WHEN RANDOM() > 0.7 THEN 'Merchant respondió que reinstalará el script'
    WHEN RANDOM() > 0.5 THEN 'Sin respuesta del merchant'
    ELSE NULL
  END
FROM stores s
WHERE s.script_status IN ('inactive', 'never_installed')
LIMIT 3;

-- Insertar algunos pings de script para simular actividad
INSERT INTO script_pings (
  store_id,
  tracking_script_id,
  ping_timestamp,
  page_url,
  user_agent,
  ip_address,
  script_version,
  platform_detected
)
SELECT 
  s.id,
  s.tracking_script_id,
  NOW() - INTERVAL '1 hour',
  'https://' || s.website || '/checkout',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  ('192.168.1.' || ((RANDOM() * 254)::INTEGER + 1))::inet,
  '1.0.0',
  'shopify'
FROM stores s
WHERE s.script_status = 'active'
LIMIT 10;

-- Verificar los datos insertados
SELECT 
  'Stores con scripts inactivos:' as info,
  COUNT(*) as count
FROM stores 
WHERE script_status IN ('inactive', 'never_installed')

UNION ALL

SELECT 
  'Alertas activas:' as info,
  COUNT(*) as count
FROM script_removal_alerts 
WHERE is_resolved = FALSE

UNION ALL

SELECT 
  'Intentos de reinstalación:' as info,
  COUNT(*) as count
FROM script_reinstallation_attempts

UNION ALL

SELECT 
  'Pings recientes:' as info,
  COUNT(*) as count
FROM script_pings 
WHERE ping_timestamp > NOW() - INTERVAL '24 hours';

-- Mostrar algunas tiendas con riesgo
SELECT 
  s.name,
  s.script_status,
  s.script_last_ping,
  EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600::INTEGER as hours_inactive,
  CASE 
    WHEN s.script_last_ping IS NULL THEN 'critical'
    WHEN EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 168 THEN 'critical'
    WHEN EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 72 THEN 'high'
    WHEN EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 24 THEN 'medium'
    ELSE 'low'
  END as risk_level
FROM stores s
WHERE s.script_status IN ('inactive', 'never_installed')
ORDER BY hours_inactive DESC NULLS FIRST
LIMIT 5;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
