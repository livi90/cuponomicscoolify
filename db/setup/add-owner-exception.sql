-- Agregar excepción específica para tu owner_id
INSERT INTO utm_tracking_exceptions (
  owner_id,
  store_name,
  domain,
  reason,
  affiliate_program,
  priority,
  notes,
  is_active
) VALUES (
  '76f5271f-04cc-4747-afbe-e9398303f4a4',
  'Todas las tiendas del propietario principal',
  'owner-exception',
  'Tiendas del propietario principal ya tienen tokens de afiliado configurados',
  'Tokens propios preconfigurados',
  0, -- Máxima prioridad
  'Excepción automática para todas las tiendas del owner principal',
  true
) ON CONFLICT DO NOTHING;

-- Verificar que se insertó correctamente
SELECT * FROM utm_tracking_exceptions 
WHERE owner_id = '76f5271f-04cc-4747-afbe-e9398303f4a4';
