-- Tabla para gestionar excepciones de UTM tracking
CREATE TABLE IF NOT EXISTS utm_tracking_exceptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  domain TEXT NOT NULL, -- Dominio de la tienda (ej: amazon.com, aliexpress.com)
  reason TEXT, -- Razón de la excepción (ej: "Programa de afiliados propio")
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para consultas rápidas
  INDEX idx_utm_exceptions_store_id (store_id),
  INDEX idx_utm_exceptions_domain (domain),
  INDEX idx_utm_exceptions_active (is_active)
);

-- Insertar algunas excepciones comunes
INSERT INTO utm_tracking_exceptions (store_name, domain, reason) VALUES
('Amazon', 'amazon.com', 'Programa de afiliados Amazon Associates'),
('Amazon España', 'amazon.es', 'Programa de afiliados Amazon Associates'),
('AliExpress', 'aliexpress.com', 'Programa de afiliados AliExpress'),
('eBay', 'ebay.com', 'Programa de afiliados eBay Partner Network'),
('Booking.com', 'booking.com', 'Programa de afiliados Booking.com'),
('Expedia', 'expedia.com', 'Programa de afiliados Expedia'),
('Rakuten', 'rakuten.com', 'Programa de afiliados Rakuten'),
('ShareASale', 'shareasale.com', 'Red de afiliados ShareASale');

-- Políticas de seguridad
ALTER TABLE utm_tracking_exceptions ENABLE ROW LEVEL SECURITY;

-- Los administradores pueden gestionar todas las excepciones
CREATE POLICY "Admins can manage UTM exceptions" ON utm_tracking_exceptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Todos pueden leer las excepciones (para el sistema de tracking)
CREATE POLICY "Everyone can read UTM exceptions" ON utm_tracking_exceptions
  FOR SELECT USING (is_active = true);
