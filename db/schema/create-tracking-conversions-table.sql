-- Crear tabla para tracking de conversiones (similar a Facebook Pixel/Google Analytics)
CREATE TABLE IF NOT EXISTS tracking_conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Identificadores principales
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    click_id UUID REFERENCES tracking_clicks(id) ON DELETE SET NULL,
    
    -- Datos de la conversión
    conversion_type VARCHAR(50) DEFAULT 'purchase', -- purchase, lead, signup, etc.
    conversion_value DECIMAL(10,2) NOT NULL, -- Valor de la venta
    currency VARCHAR(3) DEFAULT 'EUR',
    commission_rate DECIMAL(5,2) DEFAULT 5.00, -- Porcentaje de comisión
    commission_amount DECIMAL(10,2) GENERATED ALWAYS AS (conversion_value * commission_rate / 100) STORED,
    
    -- Datos del producto/pedido
    order_id VARCHAR(255), -- ID del pedido en la tienda externa
    product_ids TEXT[], -- Array de IDs de productos
    product_names TEXT[], -- Array de nombres de productos
    quantity INTEGER DEFAULT 1,
    
    -- Datos UTM (heredados del click o nuevos)
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255),
    
    -- Datos del cupón usado
    coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
    coupon_code VARCHAR(100),
    discount_applied DECIMAL(10,2) DEFAULT 0,
    
    -- Datos de tracking
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    landing_page TEXT,
    
    -- Datos de la tienda externa
    platform VARCHAR(50), -- shopify, woocommerce, magento, etc.
    store_url TEXT,
    checkout_url TEXT,
    
    -- Datos de verificación
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled, refunded
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_method VARCHAR(50), -- webhook, api, manual, pixel
    
    -- Datos adicionales
    customer_email VARCHAR(255),
    customer_id VARCHAR(255), -- ID del cliente en la tienda externa
    is_new_customer BOOLEAN DEFAULT true,
    
    -- Timestamps
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_tracking_conversions_owner_id ON tracking_conversions(owner_id);
CREATE INDEX IF NOT EXISTS idx_tracking_conversions_store_id ON tracking_conversions(store_id);
CREATE INDEX IF NOT EXISTS idx_tracking_conversions_click_id ON tracking_conversions(click_id);
CREATE INDEX IF NOT EXISTS idx_tracking_conversions_converted_at ON tracking_conversions(converted_at);
CREATE INDEX IF NOT EXISTS idx_tracking_conversions_status ON tracking_conversions(status);
CREATE INDEX IF NOT EXISTS idx_tracking_conversions_coupon_id ON tracking_conversions(coupon_id);
CREATE INDEX IF NOT EXISTS idx_tracking_conversions_order_id ON tracking_conversions(order_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_tracking_conversions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tracking_conversions_updated_at
    BEFORE UPDATE ON tracking_conversions
    FOR EACH ROW
    EXECUTE FUNCTION update_tracking_conversions_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE tracking_conversions IS 'Tabla para rastrear conversiones de ventas desde enlaces de afiliados';
COMMENT ON COLUMN tracking_conversions.conversion_value IS 'Valor total de la venta en la moneda especificada';
COMMENT ON COLUMN tracking_conversions.commission_amount IS 'Comisión calculada automáticamente basada en el porcentaje';
COMMENT ON COLUMN tracking_conversions.status IS 'Estado de la conversión: pending, confirmed, cancelled, refunded';
COMMENT ON COLUMN tracking_conversions.verification_method IS 'Método usado para verificar la conversión';
