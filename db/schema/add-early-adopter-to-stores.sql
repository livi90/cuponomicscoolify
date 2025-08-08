-- Agregar campo is_early_adopter a la tabla stores
-- Este campo permitirá marcar las tiendas pioneras que confiaron en la plataforma desde el inicio

ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS is_early_adopter BOOLEAN DEFAULT FALSE;

-- Crear índice para mejorar el rendimiento de consultas por early adopters
CREATE INDEX IF NOT EXISTS idx_stores_early_adopter ON stores(is_early_adopter);

-- Comentario para documentación
COMMENT ON COLUMN stores.is_early_adopter IS 'Indica si la tienda es un early adopter (pionera) de la plataforma';

-- Actualizar el trigger de store_applications si existe para incluir el nuevo campo
-- (Esto es opcional, ya que las aplicaciones nuevas no serían early adopters por defecto)
