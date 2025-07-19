-- Insertar cupones de ejemplo si no existen
DO $$
DECLARE
  store_id UUID;
BEGIN
  -- Obtener el ID de la primera tienda activa
  SELECT id INTO store_id FROM stores WHERE is_active = true LIMIT 1;
  
  -- Si hay una tienda, insertar cupones de ejemplo
  IF store_id IS NOT NULL THEN
    -- Insertar un cupón de código si no existe
    IF NOT EXISTS (SELECT 1 FROM coupons WHERE code = 'WELCOME10' AND store_id = store_id) THEN
      INSERT INTO coupons (
        store_id, title, description, code, discount_value, discount_type,
        start_date, expiry_date, terms_conditions, coupon_type, is_verified, is_active
      ) VALUES (
        store_id,
        'Descuento de bienvenida',
        'Obtén un 10% de descuento en tu primera compra',
        'WELCOME10',
        10,
        'percentage',
        NOW(),
        NOW() + INTERVAL '30 days',
        'Válido para nuevos clientes. No acumulable con otras promociones.',
        'code',
        true,
        true
      );
    END IF;

    -- Insertar un cupón de oferta si no existe
    IF NOT EXISTS (SELECT 1 FROM coupons WHERE title = 'Oferta 2x1 en productos seleccionados' AND store_id = store_id) THEN
      INSERT INTO coupons (
        store_id, title, description, discount_type,
        start_date, expiry_date, terms_conditions, coupon_type, is_verified, is_active
      ) VALUES (
        store_id,
        'Oferta 2x1 en productos seleccionados',
        'Lleva 2 productos y paga solo 1 en nuestra selección especial',
        'bogo',
        NOW(),
        NOW() + INTERVAL '15 days',
        'Válido solo para productos marcados. No acumulable con otras promociones.',
        'deal',
        true,
        true
      );
    END IF;

    -- Insertar un cupón de envío gratis si no existe
    IF NOT EXISTS (SELECT 1 FROM coupons WHERE title = 'Envío gratis en compras superiores a 50€' AND store_id = store_id) THEN
      INSERT INTO coupons (
        store_id, title, description, discount_value, discount_type,
        start_date, expiry_date, terms_conditions, coupon_type, is_verified, is_active
      ) VALUES (
        store_id,
        'Envío gratis en compras superiores a 50€',
        'No pagues gastos de envío en pedidos de más de 50€',
        50,
        'free_shipping',
        NOW(),
        NOW() + INTERVAL '60 days',
        'Válido para pedidos nacionales. Importe mínimo 50€ antes de impuestos.',
        'free_shipping',
        true,
        true
      );
    END IF;
  END IF;
END
$$;
