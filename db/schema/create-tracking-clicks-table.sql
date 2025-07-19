-- Eliminar tabla existente si hay problemas
DROP TABLE IF EXISTS tracking_conversions;
DROP TABLE IF EXISTS tracking_clicks;

-- Crear tabla de tracking_clicks que coincida con tu API
CREATE TABLE tracking_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  
  -- Parámetros UTM estándar
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  
  -- Parámetros personalizados de Cuponomics
  store_id TEXT,
  store_name TEXT,
  coupon_code TEXT,
  coupon_id TEXT NOT NULL, -- Required field según tu validación
  category TEXT,
  discount_type TEXT,
  discount_value TEXT,
  affiliate_id TEXT,
  
  -- URLs
  original_url TEXT NOT NULL, -- Required field según tu validación
  tracked_url TEXT NOT NULL,  -- Required field según tu validación
  store_url TEXT,
  
  -- Información del cliente
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT,
  session_id TEXT,
  device_type TEXT,
  
  -- Metadatos
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_tracking_clicks_user_id ON tracking_clicks(user_id);
CREATE INDEX idx_tracking_clicks_store_id ON tracking_clicks(store_id);
CREATE INDEX idx_tracking_clicks_coupon_id ON tracking_clicks(coupon_id);
CREATE INDEX idx_tracking_clicks_utm_campaign ON tracking_clicks(utm_campaign);
CREATE INDEX idx_tracking_clicks_utm_source ON tracking_clicks(utm_source);
CREATE INDEX idx_tracking_clicks_clicked_at ON tracking_clicks(clicked_at);
CREATE INDEX idx_tracking_clicks_session_id ON tracking_clicks(session_id);

-- Tabla para conversiones (opcional, para tracking avanzado)
CREATE TABLE tracking_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_click_id UUID REFERENCES tracking_clicks(id) ON DELETE CASCADE,
  
  -- Información de la conversión
  conversion_value DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  commission_rate DECIMAL(5,4),
  commission_amount DECIMAL(10,2),
  
  -- Estado de la conversión
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
  
  -- Información adicional
  order_id TEXT,
  product_ids TEXT[],
  
  -- Metadatos
  converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para conversiones
CREATE INDEX idx_tracking_conversions_click_id ON tracking_conversions(tracking_click_id);
CREATE INDEX idx_tracking_conversions_status ON tracking_conversions(status);
CREATE INDEX idx_tracking_conversions_converted_at ON tracking_conversions(converted_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE tracking_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_conversions ENABLE ROW LEVEL SECURITY;

-- Políticas para tracking_clicks
-- Permitir inserción anónima (para tracking)
CREATE POLICY "Allow anonymous tracking clicks insert" ON tracking_clicks
  FOR INSERT WITH CHECK (true);

-- Permitir lectura a usuarios autenticados de sus propios clicks
CREATE POLICY "Users can view own tracking clicks" ON tracking_clicks
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Permitir a admins ver todos los clicks
CREATE POLICY "Admins can view all tracking clicks" ON tracking_clicks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Políticas para conversiones
CREATE POLICY "Allow conversion inserts" ON tracking_conversions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view related conversions" ON tracking_conversions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tracking_clicks 
      WHERE tracking_clicks.id = tracking_conversions.tracking_click_id 
      AND (tracking_clicks.user_id = auth.uid() OR tracking_clicks.user_id IS NULL)
    )
  );

CREATE POLICY "Admins can manage all conversions" ON tracking_conversions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Dar permisos necesarios
GRANT INSERT ON tracking_clicks TO anon;
GRANT INSERT ON tracking_clicks TO authenticated;
GRANT SELECT ON tracking_clicks TO authenticated;

GRANT INSERT ON tracking_conversions TO anon;
GRANT INSERT ON tracking_conversions TO authenticated;
GRANT SELECT ON tracking_conversions TO authenticated;

-- Función para detectar tipo de dispositivo (opcional)
CREATE OR REPLACE FUNCTION detect_device_type(user_agent TEXT)
RETURNS TEXT AS $$
BEGIN
  IF user_agent IS NULL THEN
    RETURN 'unknown';
  END IF;
  
  IF user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN
    RETURN 'mobile';
  ELSIF user_agent ILIKE '%tablet%' OR user_agent ILIKE '%ipad%' THEN
    RETURN 'tablet';
  ELSE
    RETURN 'desktop';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-detectar device_type si no se proporciona
CREATE OR REPLACE FUNCTION set_device_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.device_type IS NULL AND NEW.user_agent IS NOT NULL THEN
    NEW.device_type := detect_device_type(NEW.user_agent);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_device_type
  BEFORE INSERT ON tracking_clicks
  FOR EACH ROW
  EXECUTE FUNCTION set_device_type();
