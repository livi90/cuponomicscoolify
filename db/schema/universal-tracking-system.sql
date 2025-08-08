-- =====================================================
-- SISTEMA UNIVERSAL DE TRACKING PARA CUPONOMICS
-- =====================================================

-- Agregar columnas faltantes a tablas existentes
ALTER TABLE tracking_clicks ADD COLUMN IF NOT EXISTS fingerprint_hash TEXT;
ALTER TABLE tracking_clicks ADD COLUMN IF NOT EXISTS platform_detected TEXT DEFAULT 'unknown';
ALTER TABLE tracking_clicks ADD COLUMN IF NOT EXISTS arrival_type TEXT DEFAULT 'legacy';

ALTER TABLE tracking_conversions ADD COLUMN IF NOT EXISTS fingerprint_hash TEXT;
ALTER TABLE tracking_conversions ADD COLUMN IF NOT EXISTS attribution_method TEXT DEFAULT 'none';
ALTER TABLE tracking_conversions ADD COLUMN IF NOT EXISTS platform_detected TEXT DEFAULT 'unknown';

-- Tabla para almacenar fingerprints avanzados
CREATE TABLE IF NOT EXISTS tracking_fingerprints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Datos del fingerprint
    fingerprint_hash TEXT UNIQUE NOT NULL, -- Hash único del fingerprint
    user_agent TEXT,
    screen_resolution TEXT, -- "1920x1080"
    color_depth INTEGER,
    timezone TEXT,
    language TEXT,
    platform TEXT,
    
    -- Fingerprinting avanzado
    canvas_fingerprint TEXT,
    webgl_fingerprint TEXT,
    font_list TEXT[], -- Array de fuentes disponibles
    plugin_list TEXT[], -- Array de plugins instalados
    
    -- Datos de comportamiento
    touch_support BOOLEAN,
    cookie_enabled BOOLEAN,
    do_not_track BOOLEAN,
    
    -- Metadatos
    ip_address INET,
    country_code TEXT,
    city TEXT,
    
    -- Índices
    CONSTRAINT unique_fingerprint_hash UNIQUE (fingerprint_hash)
);

-- Tabla para reglas de atribución configurables
CREATE TABLE IF NOT EXISTS tracking_attribution_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Configuración de la regla
    rule_name TEXT NOT NULL,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    
    -- Ventanas de atribución (en horas)
    immediate_window INTEGER DEFAULT 2, -- 0-2 horas
    short_window INTEGER DEFAULT 24,    -- 2-24 horas
    medium_window INTEGER DEFAULT 168,  -- 1-7 días
    long_window INTEGER DEFAULT 720,    -- 7-30 días
    
    -- Reglas de atribución
    last_click_wins BOOLEAN DEFAULT true,
    coupon_override BOOLEAN DEFAULT true, -- Cupón anula otros referrers
    exclude_paid_ads BOOLEAN DEFAULT true,
    
    -- Configuración de matching
    require_fingerprint_match BOOLEAN DEFAULT true,
    require_ip_match BOOLEAN DEFAULT true,
    ip_match_tolerance INTEGER DEFAULT 24, -- Horas de tolerancia para IP
    
    -- Configuración de fraude
    max_conversions_per_ip INTEGER DEFAULT 10,
    max_conversions_per_fingerprint INTEGER DEFAULT 5,
    rate_limit_per_minute INTEGER DEFAULT 60
);

-- Tabla para detección de fraude
CREATE TABLE IF NOT EXISTS tracking_fraud_detection (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Datos de la detección
    fraud_type TEXT NOT NULL, -- 'suspicious_ip', 'bot_detected', 'rate_limit_exceeded'
    severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
    
    -- Datos del evento
    ip_address INET,
    fingerprint_hash TEXT,
    user_agent TEXT,
    event_type TEXT, -- 'click', 'conversion', 'arrival'
    
    -- Detalles del fraude
    fraud_score DECIMAL(3,2), -- 0.00 a 1.00
    fraud_reasons TEXT[], -- Array de razones
    evidence_data JSONB, -- Datos adicionales como evidencia
    
    -- Estado
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    -- Referencias
    click_id BIGINT REFERENCES tracking_clicks(id) ON DELETE SET NULL,
    conversion_id UUID REFERENCES tracking_conversions(id) ON DELETE SET NULL,
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL
);

-- Tabla para webhooks universales
CREATE TABLE IF NOT EXISTS universal_tracking_webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Configuración del webhook
    webhook_name TEXT NOT NULL,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    webhook_type TEXT NOT NULL, -- 'arrival', 'conversion', 'health'
    endpoint_url TEXT NOT NULL,
    
    -- Configuración de seguridad
    secret_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    
    -- Configuración de eventos
    events_enabled TEXT[], -- ['click', 'conversion', 'fraud']
    retry_count INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    
    -- Estadísticas
    total_calls INTEGER DEFAULT 0,
    successful_calls INTEGER DEFAULT 0,
    failed_calls INTEGER DEFAULT 0,
    last_called_at TIMESTAMPTZ
);

-- Tabla para logs de webhooks
CREATE TABLE IF NOT EXISTS universal_webhook_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Referencias
    webhook_id UUID REFERENCES universal_tracking_webhooks(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    
    -- Datos de la llamada
    request_payload JSONB,
    response_status INTEGER,
    response_body TEXT,
    response_time_ms INTEGER,
    
    -- Estado
    is_success BOOLEAN,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Metadatos
    ip_address INET,
    user_agent TEXT
);

-- Tabla para configuración universal de tracking
CREATE TABLE IF NOT EXISTS universal_tracking_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Configuración global
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE UNIQUE,
    is_universal_enabled BOOLEAN DEFAULT false,
    
    -- Configuración del script
    script_version TEXT DEFAULT '1.0.0',
    auto_detect_platform BOOLEAN DEFAULT true,
    fallback_to_pixel BOOLEAN DEFAULT true,
    
    -- Configuración de fingerprinting
    enable_advanced_fingerprinting BOOLEAN DEFAULT true,
    enable_canvas_fingerprint BOOLEAN DEFAULT true,
    enable_webgl_fingerprint BOOLEAN DEFAULT true,
    enable_font_detection BOOLEAN DEFAULT true,
    
    -- Configuración de privacidad
    respect_dnt_header BOOLEAN DEFAULT true,
    anonymize_ip BOOLEAN DEFAULT false,
    store_fingerprint_data BOOLEAN DEFAULT true,
    
    -- Configuración de rendimiento
    script_timeout_ms INTEGER DEFAULT 5000,
    max_retry_attempts INTEGER DEFAULT 3,
    batch_requests BOOLEAN DEFAULT false
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para tracking_fingerprints
CREATE INDEX IF NOT EXISTS idx_tracking_fingerprints_hash ON tracking_fingerprints(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_tracking_fingerprints_ip ON tracking_fingerprints(ip_address);
CREATE INDEX IF NOT EXISTS idx_tracking_fingerprints_created_at ON tracking_fingerprints(created_at);

-- Índices para tracking_attribution_rules
CREATE INDEX IF NOT EXISTS idx_tracking_attribution_rules_store ON tracking_attribution_rules(store_id);
CREATE INDEX IF NOT EXISTS idx_tracking_attribution_rules_active ON tracking_attribution_rules(is_active);

-- Índices para tracking_fraud_detection
CREATE INDEX IF NOT EXISTS idx_tracking_fraud_detection_ip ON tracking_fraud_detection(ip_address);
CREATE INDEX IF NOT EXISTS idx_tracking_fraud_detection_fingerprint ON tracking_fraud_detection(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_tracking_fraud_detection_type ON tracking_fraud_detection(fraud_type);
CREATE INDEX IF NOT EXISTS idx_tracking_fraud_detection_severity ON tracking_fraud_detection(severity);
CREATE INDEX IF NOT EXISTS idx_tracking_fraud_detection_resolved ON tracking_fraud_detection(is_resolved);

-- Índices para universal_tracking_webhooks
CREATE INDEX IF NOT EXISTS idx_universal_tracking_webhooks_store ON universal_tracking_webhooks(store_id);
CREATE INDEX IF NOT EXISTS idx_universal_tracking_webhooks_type ON universal_tracking_webhooks(webhook_type);
CREATE INDEX IF NOT EXISTS idx_universal_tracking_webhooks_active ON universal_tracking_webhooks(is_active);

-- Índices para universal_webhook_logs
CREATE INDEX IF NOT EXISTS idx_universal_webhook_logs_webhook ON universal_webhook_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_universal_webhook_logs_event ON universal_webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_universal_webhook_logs_success ON universal_webhook_logs(is_success);
CREATE INDEX IF NOT EXISTS idx_universal_webhook_logs_created_at ON universal_webhook_logs(created_at);

-- Índices para universal_tracking_config
CREATE INDEX IF NOT EXISTS idx_universal_tracking_config_store ON universal_tracking_config(store_id);
CREATE INDEX IF NOT EXISTS idx_universal_tracking_config_enabled ON universal_tracking_config(is_universal_enabled);

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para generar hash de fingerprint
CREATE OR REPLACE FUNCTION generate_fingerprint_hash(
    user_agent TEXT,
    screen_resolution TEXT,
    timezone TEXT,
    language TEXT,
    canvas_fingerprint TEXT,
    webgl_fingerprint TEXT
) RETURNS TEXT AS $$
BEGIN
    RETURN encode(sha256(
        COALESCE(user_agent, '') ||
        COALESCE(screen_resolution, '') ||
        COALESCE(timezone, '') ||
        COALESCE(language, '') ||
        COALESCE(canvas_fingerprint, '') ||
        COALESCE(webgl_fingerprint, '')
    ), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Función para calcular score de fraude
CREATE OR REPLACE FUNCTION calculate_fraud_score(
    ip_address INET,
    fingerprint_hash TEXT,
    event_count INTEGER,
    time_window_hours INTEGER
) RETURNS DECIMAL(3,2) AS $$
DECLARE
    score DECIMAL(3,2) := 0.0;
    ip_events INTEGER;
    fingerprint_events INTEGER;
BEGIN
    -- Contar eventos por IP en la ventana de tiempo
    SELECT COUNT(*) INTO ip_events
    FROM tracking_clicks
    WHERE ip_address = $1
    AND created_at >= NOW() - INTERVAL '1 hour' * $4;
    
    -- Contar eventos por fingerprint en la ventana de tiempo (solo si fingerprint_hash existe)
    IF fingerprint_hash IS NOT NULL THEN
        SELECT COUNT(*) INTO fingerprint_events
        FROM tracking_clicks tc
        WHERE tc.fingerprint_hash = $2
        AND tc.created_at >= NOW() - INTERVAL '1 hour' * $4;
    ELSE
        fingerprint_events := 0;
    END IF;
    
    -- Calcular score basado en múltiples factores
    IF ip_events > 50 THEN score := score + 0.3; END IF;
    IF fingerprint_events > 20 THEN score := score + 0.3; END IF;
    IF event_count > 10 THEN score := score + 0.2; END IF;
    
    -- Score máximo es 1.0
    RETURN LEAST(score, 1.0);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE tracking_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_attribution_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_fraud_detection ENABLE ROW LEVEL SECURITY;
ALTER TABLE universal_tracking_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE universal_webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE universal_tracking_config ENABLE ROW LEVEL SECURITY;

-- Políticas para tracking_fingerprints
CREATE POLICY "Allow anonymous fingerprint inserts" ON tracking_fingerprints
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Merchants can view their store fingerprints" ON tracking_fingerprints
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tracking_clicks tc
            JOIN stores s ON tc.store_id::UUID = s.id
            WHERE tc.fingerprint_hash IS NOT NULL 
            AND tc.fingerprint_hash = tracking_fingerprints.fingerprint_hash
            AND s.owner_id = auth.uid()
        )
    );

-- Políticas para tracking_attribution_rules
CREATE POLICY "Merchants can manage their attribution rules" ON tracking_attribution_rules
    FOR ALL USING (store_id IN (
        SELECT id FROM stores WHERE owner_id = auth.uid()
    ));

-- Políticas para tracking_fraud_detection
CREATE POLICY "Merchants can view their fraud detections" ON tracking_fraud_detection
    FOR SELECT USING (store_id IN (
        SELECT id FROM stores WHERE owner_id = auth.uid()
    ));

-- Políticas para universal_tracking_webhooks
CREATE POLICY "Merchants can manage their webhooks" ON universal_tracking_webhooks
    FOR ALL USING (store_id IN (
        SELECT id FROM stores WHERE owner_id = auth.uid()
    ));

-- Políticas para universal_webhook_logs
CREATE POLICY "Merchants can view their webhook logs" ON universal_webhook_logs
    FOR SELECT USING (
        webhook_id IN (
            SELECT id FROM universal_tracking_webhooks 
            WHERE store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
        )
    );

-- Políticas para universal_tracking_config
CREATE POLICY "Merchants can manage their tracking config" ON universal_tracking_config
    FOR ALL USING (store_id IN (
        SELECT id FROM stores WHERE owner_id = auth.uid()
    ));

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar configuración por defecto para tiendas existentes
INSERT INTO universal_tracking_config (store_id, is_universal_enabled)
SELECT id, false FROM stores
ON CONFLICT (store_id) DO NOTHING;

-- Insertar reglas de atribución por defecto
INSERT INTO tracking_attribution_rules (rule_name, store_id, is_active)
SELECT 'Default Attribution Rules', id, true FROM stores
ON CONFLICT DO NOTHING;

-- =====================================================
-- TRIGGERS PARA MANTENIMIENTO AUTOMÁTICO
-- =====================================================

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tracking_attribution_rules_updated_at
    BEFORE UPDATE ON tracking_attribution_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_universal_tracking_webhooks_updated_at
    BEFORE UPDATE ON universal_tracking_webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_universal_tracking_config_updated_at
    BEFORE UPDATE ON universal_tracking_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para limpiar logs antiguos (mantener solo 30 días)
CREATE OR REPLACE FUNCTION cleanup_old_webhook_logs()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM universal_webhook_logs 
    WHERE created_at < NOW() - INTERVAL '30 days';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_webhook_logs_trigger
    AFTER INSERT ON universal_webhook_logs
    FOR EACH ROW EXECUTE FUNCTION cleanup_old_webhook_logs();

-- =====================================================
-- VISTAS ÚTILES PARA REPORTES
-- =====================================================

-- Vista para estadísticas de tracking universal
CREATE OR REPLACE VIEW universal_tracking_stats AS
SELECT 
    s.id as store_id,
    s.name as store_name,
    utc.is_universal_enabled,
    utc.script_version,
    COUNT(DISTINCT tf.id) as total_fingerprints,
    COUNT(DISTINCT tc.id) as total_clicks,
    COUNT(DISTINCT tconv.id) as total_conversions,
    COUNT(DISTINCT tfd.id) as total_fraud_detections,
    COUNT(DISTINCT utw.id) as total_webhooks
FROM stores s
LEFT JOIN universal_tracking_config utc ON s.id = utc.store_id
LEFT JOIN tracking_fingerprints tf ON tf.id IS NOT NULL
LEFT JOIN tracking_clicks tc ON tc.store_id::UUID = s.id
LEFT JOIN tracking_conversions tconv ON tconv.store_id = s.id
LEFT JOIN tracking_fraud_detection tfd ON tfd.store_id = s.id
LEFT JOIN universal_tracking_webhooks utw ON utw.store_id = s.id
GROUP BY s.id, s.name, utc.is_universal_enabled, utc.script_version;

-- Vista para health del sistema de tracking
CREATE OR REPLACE VIEW tracking_health_status AS
SELECT 
    s.id as store_id,
    s.name as store_name,
    utc.is_universal_enabled,
    CASE 
        WHEN utc.is_universal_enabled THEN 'Universal'
        ELSE 'Legacy'
    END as tracking_type,
    COUNT(tc.id) as clicks_last_24h,
    COUNT(tconv.id) as conversions_last_24h,
    COUNT(tfd.id) as fraud_detections_last_24h,
    CASE 
        WHEN COUNT(tc.id) > 0 AND COUNT(tconv.id) > 0 
        THEN ROUND((COUNT(tconv.id)::DECIMAL / COUNT(tc.id)::DECIMAL) * 100, 2)
        ELSE 0
    END as conversion_rate_percent
FROM stores s
LEFT JOIN universal_tracking_config utc ON s.id = utc.store_id
LEFT JOIN tracking_clicks tc ON tc.store_id::UUID = s.id 
    AND tc.created_at >= NOW() - INTERVAL '24 hours'
LEFT JOIN tracking_conversions tconv ON tconv.store_id = s.id 
    AND tconv.created_at >= NOW() - INTERVAL '24 hours'
LEFT JOIN tracking_fraud_detection tfd ON tfd.store_id = s.id 
    AND tfd.created_at >= NOW() - INTERVAL '24 hours'
GROUP BY s.id, s.name, utc.is_universal_enabled;

-- =====================================================
-- FIN DEL SCRIPT
-- ===================================================== 