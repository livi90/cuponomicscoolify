-- Script para crear funciones faltantes
-- Ejecutar en Supabase Self-Hosted

-- Función para detectar tipo de dispositivo
CREATE OR REPLACE FUNCTION detect_device_type(user_agent TEXT)
RETURNS TEXT AS $$
BEGIN
  IF user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN
    RETURN 'mobile';
  ELSIF user_agent ILIKE '%tablet%' OR user_agent ILIKE '%ipad%' THEN
    RETURN 'tablet';
  ELSE
    RETURN 'desktop';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para generar ID de pixel
CREATE OR REPLACE FUNCTION generate_pixel_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'pixel_' || gen_random_uuid()::text;
END;
$$ LANGUAGE plpgsql;

-- Función para incrementar vista de producto
CREATE OR REPLACE FUNCTION increment_product_view(product_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.product_stats (product_id, views, date)
  VALUES (product_id, 1, CURRENT_DATE)
  ON CONFLICT (product_id, date)
  DO UPDATE SET views = product_stats.views + 1;
END;
$$ LANGUAGE plpgsql;

-- Función para agregar excepción UTM de tienda
CREATE OR REPLACE FUNCTION add_store_utm_exception(
  p_store_id UUID,
  p_domain TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_exception_id UUID;
BEGIN
  INSERT INTO public.utm_tracking_exceptions (store_id, domain, reason, is_active)
  VALUES (p_store_id, p_domain, p_reason, true)
  RETURNING id INTO v_exception_id;
  
  RETURN v_exception_id;
END;
$$ LANGUAGE plpgsql;
