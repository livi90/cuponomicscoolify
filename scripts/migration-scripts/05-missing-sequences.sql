-- Script para crear secuencias faltantes
-- Ejecutar en Supabase Self-Hosted

-- Secuencia para tracking_clicks
CREATE SEQUENCE IF NOT EXISTS public.tracking_clicks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Secuencia para facturas
CREATE SEQUENCE IF NOT EXISTS public.invoice_sequence
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Asignar secuencias a columnas si es necesario
-- (Esto se hace automáticamente si las tablas usan SERIAL o BIGSERIAL)
