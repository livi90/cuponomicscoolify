-- Tabla para almacenar los clics de tracking
CREATE TABLE IF NOT EXISTS tracking_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  
  -- Parámetros UTM estándar
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  
  -- Parámetros personalizados de Cuponomics
  store_id UUID,
  store_name TEXT,
  coupon_code TEXT,
  coupon_id UUID,
  category TEXT,
  discount_type TEXT,
  discount_value TEXT,
  affiliate_id TEXT,
  
  -- Información del clic
  original_url TEXT NOT NULL,
  tracked_url TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address INET,
  
  -- Metadatos
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para consultas rápidas
  INDEX idx_tracking_clicks_user_id (user_id),
  INDEX idx_tracking_clicks_store_id (store_id),
  INDEX idx_tracking_clicks_coupon_id (coupon_id),
  INDEX idx_tracking_clicks_utm_campaign (utm_campaign),
  INDEX idx_tracking_clicks_clicked_at (clicked_at)
);

-- Tabla para almacenar conversiones (ventas confirmadas)
CREATE TABLE IF NOT EXISTS tracking_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_click_id UUID REFERENCES tracking_clicks(id),
  
  -- Información de la conversión
  conversion_value DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  commission_rate DECIMAL(5,4), -- Porcentaje de comisión (ej: 0.05 = 5%)
  commission_amount DECIMAL(10,2),
  
  -- Estado de la conversión
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
  
  -- Información adicional
  order_id TEXT,
  product_ids TEXT[], -- Array de IDs de productos comprados
  
  -- Metadatos
  converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices
  INDEX idx_tracking_conversions_click_id (tracking_click_id),
  INDEX idx_tracking_conversions_status (status),
  INDEX idx_tracking_conversions_converted_at (converted_at)
);

-- Políticas de seguridad
ALTER TABLE tracking_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_conversions ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver sus propios clics
CREATE POLICY "Users can view own tracking clicks" ON tracking_clicks
  FOR SELECT USING (auth.uid() = user_id);

-- Los administradores pueden ver todos los clics
CREATE POLICY "Admins can view all tracking clicks" ON tracking_clicks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Los comerciantes pueden ver clics de sus tiendas
CREATE POLICY "Merchants can view their store clicks" ON tracking_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id::text = tracking_clicks.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- Políticas similares para conversiones
CREATE POLICY "Users can view own conversions" ON tracking_conversions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tracking_clicks 
      WHERE tracking_clicks.id = tracking_conversions.tracking_click_id 
      AND tracking_clicks.user_id = auth.uid()
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
