-- Eliminar tabla existente si hay problemas
DROP TABLE IF EXISTS tracking_conversions;
DROP TABLE IF EXISTS tracking_clicks;

-- Crear tabla de tracking_clicks corregida
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
  store_id TEXT, -- Cambiado de UUID a TEXT para mayor flexibilidad
  store_name TEXT,
  coupon_code TEXT,
  coupon_id TEXT, -- Cambiado de UUID a TEXT
  category TEXT,
  discount_type TEXT,
  discount_value TEXT,
  affiliate_id TEXT,
  
  -- Información del clic
  original_url TEXT NOT NULL,
  tracked_url TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT, -- Cambiado de INET a TEXT para compatibilidad
  
  -- Datos adicionales como JSON
  additional_data JSONB,
  
  -- Metadatos
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX idx_tracking_clicks_user_id ON tracking_clicks(user_id);
CREATE INDEX idx_tracking_clicks_store_id ON tracking_clicks(store_id);
CREATE INDEX idx_tracking_clicks_coupon_id ON tracking_clicks(coupon_id);
CREATE INDEX idx_tracking_clicks_utm_campaign ON tracking_clicks(utm_campaign);
CREATE INDEX idx_tracking_clicks_clicked_at ON tracking_clicks(clicked_at);

-- Tabla para conversiones
CREATE TABLE tracking_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_click_id UUID REFERENCES tracking_clicks(id),
  
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

-- Habilitar RLS
ALTER TABLE tracking_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_conversions ENABLE ROW LEVEL SECURITY;

-- Políticas más permisivas para tracking_clicks
CREATE POLICY "Allow anonymous tracking clicks" ON tracking_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own tracking clicks" ON tracking_clicks
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

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
