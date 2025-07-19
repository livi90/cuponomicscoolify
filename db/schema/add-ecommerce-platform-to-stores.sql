-- Agregar campo de plataforma de ecommerce a las tablas
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS ecommerce_platform VARCHAR(50),
ADD COLUMN IF NOT EXISTS tracking_script_id UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS script_last_ping TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS script_status VARCHAR(20) DEFAULT 'inactive';

ALTER TABLE store_applications 
ADD COLUMN IF NOT EXISTS ecommerce_platform VARCHAR(50);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_stores_script_status ON stores(script_status);
CREATE INDEX IF NOT EXISTS idx_stores_script_last_ping ON stores(script_last_ping);
CREATE INDEX IF NOT EXISTS idx_stores_tracking_script_id ON stores(tracking_script_id);

-- Comentarios para documentación
COMMENT ON COLUMN stores.ecommerce_platform IS 'Plataforma de ecommerce: shopify, woocommerce, magento, prestashop, etc.';
COMMENT ON COLUMN stores.tracking_script_id IS 'ID único del script de tracking para esta tienda';
COMMENT ON COLUMN stores.script_last_ping IS 'Última vez que el script envió señal de vida';
COMMENT ON COLUMN stores.script_status IS 'Estado del script: active, inactive, never_installed';
