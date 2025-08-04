-- Agregar campo para banner individual del cupón
ALTER TABLE coupons 
ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Agregar comentario para documentar el campo
COMMENT ON COLUMN coupons.banner_url IS 'URL de la imagen de banner personalizada para este cupón específico. Si no se especifica, se usará el logo de la tienda como fondo.';

-- Crear índice para mejorar rendimiento en búsquedas por banner
CREATE INDEX IF NOT EXISTS idx_coupons_banner_url ON coupons(banner_url) WHERE banner_url IS NOT NULL; 