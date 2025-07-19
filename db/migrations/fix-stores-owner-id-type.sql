-- Este script corrige el tipo de dato de la columna owner_id en la tabla stores.
-- Lo cambia de TEXT a UUID para que coincida con la tabla de usuarios (auth.users y profiles).
-- Esto es crucial para la integridad de los datos y para que las políticas de seguridad (RLS) funcionen correctamente.

-- ADVERTENCIA: Siempre respalda tus datos antes de ejecutar una migración.

ALTER TABLE stores
ALTER COLUMN owner_id TYPE UUID USING owner_id::uuid;

-- Después de esta migración, las políticas de RLS funcionarán correctamente sin errores de tipo.

COMMENT ON COLUMN stores.owner_id IS 'El tipo de dato ahora es UUID, referenciando correctamente el ID del usuario.';
