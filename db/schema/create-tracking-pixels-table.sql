-- Eliminar tabla si existe
DROP TABLE IF EXISTS tracking_pixels CASCADE;

-- Crear tabla para gestionar píxeles de tracking por tienda
CREATE TABLE tracking_pixels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Identificadores
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    
    -- Configuración del píxel
    pixel_name VARCHAR(255) NOT NULL,
    pixel_id VARCHAR(100) UNIQUE NOT NULL, -- ID público del píxel (ej: px_1234567890)
    
    -- Configuración de comisiones
    commission_rate DECIMAL(5,2) DEFAULT 5.00, -- Porcentaje de comisión
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- URLs y configuración
    store_url TEXT NOT NULL,
    checkout_patterns TEXT[] DEFAULT ARRAY['/checkout/success', '/order-received', '/thank-you', '/order-complete'], -- Patrones de URLs de éxito
    platform VARCHAR(50), -- shopify, woocommerce, magento, prestashop, etc.
    
    -- Configuración avanzada
    auto_detect_conversions BOOLEAN DEFAULT true,
    track_page_views BOOLEAN DEFAULT true,
    track_add_to_cart BOOLEAN DEFAULT false,
    
    -- Estado
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false, -- Si el píxel está correctamente instalado
    last_activity_at TIMESTAMP WITH TIME ZONE,
    
    -- Estadísticas básicas
    total_conversions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    total_commission DECIMAL(12,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_pixel_per_store UNIQUE (store_id, pixel_name)
);

-- Índices
CREATE INDEX idx_tracking_pixels_owner_id ON tracking_pixels(owner_id);
CREATE INDEX idx_tracking_pixels_store_id ON tracking_pixels(store_id);
CREATE INDEX idx_tracking_pixels_pixel_id ON tracking_pixels(pixel_id);
CREATE INDEX idx_tracking_pixels_is_active ON tracking_pixels(is_active);
CREATE INDEX idx_tracking_pixels_platform ON tracking_pixels(platform);

-- Función para generar pixel_id único
CREATE OR REPLACE FUNCTION generate_pixel_id()
RETURNS TEXT AS $$
BEGIN
    RETURN 'px_' || substr(md5(random()::text), 1, 10);
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar pixel_id automáticamente
CREATE OR REPLACE FUNCTION set_pixel_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.pixel_id IS NULL OR NEW.pixel_id = '' THEN
        NEW.pixel_id := generate_pixel_id();
        -- Asegurar que sea único
        WHILE EXISTS (SELECT 1 FROM tracking_pixels WHERE pixel_id = NEW.pixel_id) LOOP
            NEW.pixel_id := generate_pixel_id();
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_pixel_id
    BEFORE INSERT ON tracking_pixels
    FOR EACH ROW
    EXECUTE FUNCTION set_pixel_id();

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_tracking_pixels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tracking_pixels_updated_at
    BEFORE UPDATE ON tracking_pixels
    FOR EACH ROW
    EXECUTE FUNCTION update_tracking_pixels_updated_at();

-- Comentarios
COMMENT ON TABLE tracking_pixels IS 'Gestión de píxeles de tracking por tienda para conversiones';
COMMENT ON COLUMN tracking_pixels.pixel_id IS 'ID público único del píxel (ej: px_1234567890)';
COMMENT ON COLUMN tracking_pixels.checkout_patterns IS 'Patrones de URL que indican una conversión exitosa';
COMMENT ON COLUMN tracking_pixels.commission_rate IS 'Porcentaje de comisión para esta tienda';
