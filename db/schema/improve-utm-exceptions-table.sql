-- Mejorar la tabla de excepciones UTM con más datos específicos
ALTER TABLE utm_tracking_exceptions 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS store_slug TEXT,
ADD COLUMN IF NOT EXISTS affiliate_program TEXT,
ADD COLUMN IF NOT EXISTS affiliate_id TEXT,
ADD COLUMN IF NOT EXISTS custom_tracking_params JSONB,
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_utm_exceptions_owner_id ON utm_tracking_exceptions(owner_id);
CREATE INDEX IF NOT EXISTS idx_utm_exceptions_store_slug ON utm_tracking_exceptions(store_slug);
CREATE INDEX IF NOT EXISTS idx_utm_exceptions_priority ON utm_tracking_exceptions(priority);

-- Limpiar datos existentes genéricos y agregar datos más específicos
DELETE FROM utm_tracking_exceptions;

-- Insertar excepciones más específicas basadas en tiendas reales
-- Estas se pueden agregar cuando las tiendas se registren o manualmente por admin
INSERT INTO utm_tracking_exceptions (
  store_name, 
  domain, 
  reason, 
  affiliate_program,
  priority,
  notes
) VALUES
-- Grandes marketplaces con programas de afiliados
('Amazon', 'amazon.com', 'Programa de afiliados Amazon Associates', 'Amazon Associates', 1, 'Usar affiliate_id específico'),
('Amazon España', 'amazon.es', 'Programa de afiliados Amazon Associates', 'Amazon Associates', 1, 'Usar affiliate_id específico'),
('AliExpress', 'aliexpress.com', 'Programa de afiliados AliExpress', 'AliExpress Partners', 1, 'Usar tracking_id específico'),
('eBay', 'ebay.com', 'Programa de afiliados eBay Partner Network', 'eBay Partner Network', 1, 'Usar campid específico'),
('Booking.com', 'booking.com', 'Programa de afiliados Booking.com', 'Booking.com Affiliate', 1, 'Usar aid específico'),

-- Tiendas de moda
('Zara', 'zara.com', 'Sistema de tracking interno', 'Inditex Affiliate', 2, 'UTM puede interferir con su sistema'),
('H&M', 'hm.com', 'Programa de afiliados H&M', 'H&M Affiliate', 2, 'Usar parámetros específicos'),

-- Tecnología
('Apple', 'apple.com', 'Programa de afiliados Apple', 'Apple Affiliate', 1, 'Usar at específico'),
('Best Buy', 'bestbuy.com', 'Programa de afiliados Best Buy', 'Best Buy Affiliate', 2, 'Usar parámetros específicos'),

-- Viajes
('Expedia', 'expedia.com', 'Programa de afiliados Expedia', 'Expedia Affiliate', 1, 'Usar TPID específico'),
('Airbnb', 'airbnb.com', 'Programa de afiliados Airbnb', 'Airbnb Affiliate', 1, 'Usar c específico');

-- Función para agregar excepción basada en tienda existente
CREATE OR REPLACE FUNCTION add_store_utm_exception(
  p_store_id UUID,
  p_reason TEXT DEFAULT NULL,
  p_affiliate_program TEXT DEFAULT NULL,
  p_affiliate_id TEXT DEFAULT NULL,
  p_priority INTEGER DEFAULT 1
) RETURNS UUID AS $$
DECLARE
  v_exception_id UUID;
  v_store_record RECORD;
BEGIN
  -- Obtener datos de la tienda
  SELECT s.*, p.id as owner_id 
  INTO v_store_record
  FROM stores s
  LEFT JOIN profiles p ON s.owner_id = p.id
  WHERE s.id = p_store_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Store not found: %', p_store_id;
  END IF;
  
  -- Insertar excepción
  INSERT INTO utm_tracking_exceptions (
    store_id,
    owner_id,
    store_name,
    store_slug,
    domain,
    reason,
    affiliate_program,
    affiliate_id,
    priority,
    is_active
  ) VALUES (
    p_store_id,
    v_store_record.owner_id,
    v_store_record.name,
    v_store_record.slug,
    COALESCE(
      -- Extraer dominio de website si existe
      CASE 
        WHEN v_store_record.website IS NOT NULL 
        THEN regexp_replace(
          regexp_replace(v_store_record.website, '^https?://', ''), 
          '^www\.', ''
        )
        ELSE NULL
      END,
      'unknown-domain.com'
    ),
    p_reason,
    p_affiliate_program,
    p_affiliate_id,
    p_priority,
    true
  ) RETURNING id INTO v_exception_id;
  
  RETURN v_exception_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si una tienda debe ser excluida
CREATE OR REPLACE FUNCTION should_exclude_utm_tracking(
  p_store_id UUID DEFAULT NULL,
  p_domain TEXT DEFAULT NULL,
  p_owner_id UUID DEFAULT NULL
) RETURNS TABLE(
  should_exclude BOOLEAN,
  exception_id UUID,
  reason TEXT,
  affiliate_program TEXT,
  affiliate_id TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true as should_exclude,
    ute.id as exception_id,
    ute.reason,
    ute.affiliate_program,
    ute.affiliate_id
  FROM utm_tracking_exceptions ute
  WHERE ute.is_active = true
    AND (
      -- Coincidencia exacta por store_id (máxima prioridad)
      (p_store_id IS NOT NULL AND ute.store_id = p_store_id)
      OR
      -- Coincidencia por owner_id
      (p_owner_id IS NOT NULL AND ute.owner_id = p_owner_id)
      OR
      -- Coincidencia por dominio
      (p_domain IS NOT NULL AND p_domain ILIKE '%' || ute.domain || '%')
    )
  ORDER BY 
    -- Priorizar coincidencias exactas
    CASE 
      WHEN ute.store_id = p_store_id THEN 1
      WHEN ute.owner_id = p_owner_id THEN 2
      WHEN p_domain ILIKE '%' || ute.domain || '%' THEN 3
      ELSE 4
    END,
    ute.priority ASC
  LIMIT 1;
  
  -- Si no hay coincidencias, no excluir
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
