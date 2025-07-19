-- Paso 1: Eliminar datos de prueba (solo hay 1 registro con coupon_id: 10)
DELETE FROM tracking_clicks WHERE coupon_id = 10;

-- Paso 2: Cambiar el tipo de columna a UUID
ALTER TABLE tracking_clicks 
ALTER COLUMN coupon_id TYPE UUID USING NULL;

-- Paso 3: Cambiar store_id también a UUID para consistencia
ALTER TABLE tracking_clicks 
ALTER COLUMN store_id TYPE UUID USING NULL;

-- Paso 4: Verificar la nueva estructura
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tracking_clicks' 
AND column_name IN ('coupon_id', 'store_id');
