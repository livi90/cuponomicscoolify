-- =====================================================
-- SISTEMA DE DETECCIÓN DE SCRIPTS REMOVIDOS (CORREGIDO)
-- =====================================================
-- Este sistema detecta cuando los merchants remueven el script
-- para evitar pagar comisiones
-- Versión corregida usando las columnas reales de las tablas

-- Tabla para registrar alertas de scripts removidos
CREATE TABLE IF NOT EXISTS script_removal_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- 'script_removed', 'script_inactive', 'ping_stopped'
    risk_level VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    previous_status VARCHAR(20),
    current_status VARCHAR(20),
    last_ping_timestamp TIMESTAMP WITH TIME ZONE,
    hours_since_last_ping INTEGER,
    potential_revenue_loss DECIMAL(10,2) DEFAULT 0,
    detection_method VARCHAR(50), -- 'automatic', 'manual', 'threshold'
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES auth.users(id),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para configurar umbrales de detección
CREATE TABLE IF NOT EXISTS script_detection_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para registrar intentos de reinstalación
CREATE TABLE IF NOT EXISTS script_reinstallation_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    attempt_type VARCHAR(50) NOT NULL, -- 'email', 'notification', 'manual_contact'
    status VARCHAR(20) NOT NULL, -- 'pending', 'sent', 'delivered', 'failed'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    response_received BOOLEAN DEFAULT FALSE,
    response_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_script_removal_alerts_store_id ON script_removal_alerts(store_id);
CREATE INDEX IF NOT EXISTS idx_script_removal_alerts_risk_level ON script_removal_alerts(risk_level);
CREATE INDEX IF NOT EXISTS idx_script_removal_alerts_created_at ON script_removal_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_script_removal_alerts_is_resolved ON script_removal_alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_script_reinstallation_attempts_store_id ON script_reinstallation_attempts(store_id);
CREATE INDEX IF NOT EXISTS idx_script_reinstallation_attempts_status ON script_reinstallation_attempts(status);

-- RLS policies
ALTER TABLE script_removal_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_detection_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_reinstallation_attempts ENABLE ROW LEVEL SECURITY;

-- Los admins pueden ver todas las alertas
CREATE POLICY "Admins can view all script removal alerts" ON script_removal_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Los merchants solo pueden ver sus propias alertas
CREATE POLICY "Merchants can view own script removal alerts" ON script_removal_alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = script_removal_alerts.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

-- Permitir inserción automática de alertas
CREATE POLICY "Allow automatic alert insertion" ON script_removal_alerts
    FOR INSERT WITH CHECK (true);

-- Configuración de detección - solo admins
CREATE POLICY "Admins can manage detection config" ON script_detection_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Intentos de reinstalación - solo admins
CREATE POLICY "Admins can manage reinstallation attempts" ON script_reinstallation_attempts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Función para detectar scripts removidos automáticamente
CREATE OR REPLACE FUNCTION detect_script_removal()
RETURNS TRIGGER AS $$
DECLARE
    hours_since_last_ping INTEGER;
    risk_level VARCHAR(20);
    alert_type VARCHAR(50);
    potential_loss DECIMAL(10,2);
BEGIN
    -- Calcular horas desde el último ping
    IF NEW.script_last_ping IS NULL THEN
        hours_since_last_ping := NULL;
    ELSE
        hours_since_last_ping := EXTRACT(EPOCH FROM (NOW() - NEW.script_last_ping)) / 3600;
    END IF;

    -- Determinar si hay un cambio de estado que requiera alerta
    IF OLD.script_status = 'active' AND NEW.script_status = 'inactive' THEN
        alert_type := 'script_removed';
        
        -- Calcular nivel de riesgo basado en tiempo sin ping
        IF hours_since_last_ping IS NULL THEN
            risk_level := 'critical';
        ELSIF hours_since_last_ping > 168 THEN -- 7 días
            risk_level := 'critical';
        ELSIF hours_since_last_ping > 72 THEN -- 3 días
            risk_level := 'high';
        ELSIF hours_since_last_ping > 24 THEN -- 1 día
            risk_level := 'medium';
        ELSE
            risk_level := 'low';
        END IF;

        -- Calcular pérdida potencial (estimación basada en conversiones previas)
        SELECT COALESCE(SUM(conversion_value), 0) * 0.3 
        INTO potential_loss
        FROM tracking_conversions 
        WHERE store_id = NEW.id 
        AND created_at > NOW() - INTERVAL '30 days';

        -- Crear alerta
        INSERT INTO script_removal_alerts (
            store_id,
            alert_type,
            risk_level,
            previous_status,
            current_status,
            last_ping_timestamp,
            hours_since_last_ping,
            potential_revenue_loss,
            detection_method
        ) VALUES (
            NEW.id,
            alert_type,
            risk_level,
            OLD.script_status,
            NEW.script_status,
            NEW.script_last_ping,
            hours_since_last_ping,
            potential_loss,
            'automatic'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para detectar cambios de estado del script
CREATE TRIGGER trigger_detect_script_removal
    AFTER UPDATE ON stores
    FOR EACH ROW
    WHEN (OLD.script_status IS DISTINCT FROM NEW.script_status)
    EXECUTE FUNCTION detect_script_removal();

-- Función para verificar scripts inactivos periódicamente
CREATE OR REPLACE FUNCTION check_inactive_scripts()
RETURNS TABLE(
    store_id UUID,
    store_name TEXT,
    hours_inactive INTEGER,
    risk_level VARCHAR(20),
    potential_loss DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600::INTEGER as hours_inactive,
        CASE 
            WHEN s.script_last_ping IS NULL THEN 'critical'
            WHEN EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 168 THEN 'critical'
            WHEN EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 72 THEN 'high'
            WHEN EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 24 THEN 'medium'
            ELSE 'low'
        END as risk_level,
        COALESCE(SUM(tc.conversion_value), 0) * 0.3 as potential_loss
    FROM stores s
    LEFT JOIN tracking_conversions tc ON s.id = tc.store_id 
        AND tc.created_at > NOW() - INTERVAL '30 days'
    WHERE s.script_status = 'inactive' 
        OR s.script_status = 'never_installed'
        OR (s.script_last_ping IS NOT NULL 
            AND s.script_last_ping < NOW() - INTERVAL '24 hours')
    GROUP BY s.id, s.name, s.script_last_ping, s.script_status
    HAVING EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 6 -- Solo scripts inactivos por más de 6 horas
    ORDER BY hours_inactive DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de detección
CREATE OR REPLACE FUNCTION get_script_detection_stats()
RETURNS TABLE(
    total_alerts INTEGER,
    critical_alerts INTEGER,
    high_risk_alerts INTEGER,
    total_potential_loss DECIMAL(10,2),
    stores_at_risk INTEGER,
    avg_resolution_time_hours DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_alerts,
        COUNT(*) FILTER (WHERE risk_level = 'critical')::INTEGER as critical_alerts,
        COUNT(*) FILTER (WHERE risk_level IN ('critical', 'high'))::INTEGER as high_risk_alerts,
        COALESCE(SUM(potential_revenue_loss), 0) as total_potential_loss,
        COUNT(DISTINCT store_id)::INTEGER as stores_at_risk,
        AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600) as avg_resolution_time_hours
    FROM script_removal_alerts
    WHERE created_at > NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Insertar configuración por defecto
INSERT INTO script_detection_config (config_key, config_value, description) VALUES
('critical_threshold_hours', '168', 'Horas sin ping para considerar crítico (7 días)'),
('high_threshold_hours', '72', 'Horas sin ping para considerar alto riesgo (3 días)'),
('medium_threshold_hours', '24', 'Horas sin ping para considerar riesgo medio (1 día)'),
('low_threshold_hours', '6', 'Horas sin ping para considerar riesgo bajo (6 horas)'),
('auto_alert_enabled', 'true', 'Habilitar alertas automáticas'),
('email_notifications_enabled', 'true', 'Habilitar notificaciones por email'),
('potential_loss_multiplier', '0.3', 'Multiplicador para calcular pérdida potencial (30%)'),
('check_interval_minutes', '60', 'Intervalo de verificación en minutos')
ON CONFLICT (config_key) DO NOTHING;

-- Vista para dashboard de detección (usando columnas reales)
CREATE OR REPLACE VIEW script_detection_dashboard AS
SELECT 
    s.id as store_id,
    s.name as store_name,
    s.website,
    s.script_status,
    s.script_last_ping,
    utc.script_version,
    p.email as owner_email,
    EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600::INTEGER as hours_since_last_ping,
    CASE 
        WHEN s.script_last_ping IS NULL THEN 'critical'
        WHEN EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 168 THEN 'critical'
        WHEN EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 72 THEN 'high'
        WHEN EXTRACT(EPOCH FROM (NOW() - s.script_last_ping)) / 3600 > 24 THEN 'medium'
        ELSE 'low'
    END as risk_level,
    COALESCE(SUM(tc.conversion_value), 0) * 0.3 as potential_revenue_loss,
    COUNT(sra.id) as active_alerts_count,
    MAX(sra.created_at) as last_alert_created
FROM stores s
LEFT JOIN profiles p ON s.owner_id = p.id
LEFT JOIN universal_tracking_config utc ON s.id = utc.store_id
LEFT JOIN tracking_conversions tc ON s.id = tc.store_id 
    AND tc.created_at > NOW() - INTERVAL '30 days'
LEFT JOIN script_removal_alerts sra ON s.id = sra.store_id 
    AND sra.is_resolved = FALSE
GROUP BY s.id, s.name, s.website, s.script_status, s.script_last_ping, utc.script_version, p.email;

-- Comentarios
COMMENT ON TABLE script_removal_alerts IS 'Registro de alertas cuando los merchants remueven scripts de tracking';
COMMENT ON TABLE script_detection_config IS 'Configuración para el sistema de detección automática';
COMMENT ON TABLE script_reinstallation_attempts IS 'Registro de intentos de reinstalación de scripts';
COMMENT ON FUNCTION detect_script_removal() IS 'Función que detecta automáticamente cuando se remueve un script';
COMMENT ON FUNCTION check_inactive_scripts() IS 'Función para verificar scripts inactivos periódicamente';
COMMENT ON FUNCTION get_script_detection_stats() IS 'Función para obtener estadísticas de detección';

-- =====================================================
-- FIN DEL SCRIPT CORREGIDO
-- =====================================================
