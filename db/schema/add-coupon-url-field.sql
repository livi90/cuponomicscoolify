-- Agregar campo para URL específica del cupón
ALTER TABLE coupons 
ADD COLUMN IF NOT EXISTS coupon_url TEXT;

-- Agregar comentario para documentar el campo
COMMENT ON COLUMN coupons.coupon_url IS 'URL específica del cupón/oferta que redirige al producto o página de la oferta';

-- Crear índice para mejorar rendimiento en búsquedas por URL
CREATE INDEX IF NOT EXISTS idx_coupons_coupon_url ON coupons(coupon_url) WHERE coupon_url IS NOT NULL;
