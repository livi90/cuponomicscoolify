-- =====================================================
-- SCRIPT PARA CREAR TABLAS DE NEWSLETTER
-- Cuponomics - Sistema de Suscripción a Boletín
-- =====================================================

-- Habilitar la extensión uuid-ossp si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA PRINCIPAL: newsletter_subscribers
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    country VARCHAR(10), -- Código de país (ES, MX, AR, etc.)
    language VARCHAR(10) DEFAULT 'es', -- Idioma preferido
    source VARCHAR(100), -- Página donde se suscribió (buscar-ofertas, productos-en-oferta, etc.)
    utm_source VARCHAR(100), -- Parámetros UTM para tracking
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_token UUID DEFAULT uuid_generate_v4(),
    verification_expires_at TIMESTAMP WITH TIME ZONE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    last_email_sent_at TIMESTAMP WITH TIME ZONE,
    total_emails_sent INTEGER DEFAULT 0,
    total_emails_opened INTEGER DEFAULT 0,
    total_emails_clicked INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: newsletter_campaigns
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    html_content TEXT,
    plain_text_content TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sending, sent, cancelled
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    total_recipients INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_bounced INTEGER DEFAULT 0,
    total_unsubscribed INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: newsletter_campaign_recipients
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_campaign_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
    subscriber_id UUID NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, opened, clicked, bounced, unsubscribed
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    bounce_reason TEXT,
    tracking_id UUID DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, subscriber_id)
);

-- =====================================================
-- TABLA: newsletter_templates
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject_template VARCHAR(255) NOT NULL,
    html_template TEXT NOT NULL,
    plain_text_template TEXT,
    variables JSONB, -- Variables disponibles en el template
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: newsletter_events
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- subscribe, unsubscribe, open, click, bounce, etc.
    event_data JSONB, -- Datos adicionales del evento
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: newsletter_segments
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    filter_criteria JSONB NOT NULL, -- Criterios para filtrar suscriptores
    total_subscribers INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- =====================================================

-- Índices para newsletter_subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(is_active, is_verified);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_country ON newsletter_subscribers(country);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_language ON newsletter_subscribers(language);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_source ON newsletter_subscribers(source);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at);

-- Índices para newsletter_campaigns
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_scheduled_at ON newsletter_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_sent_at ON newsletter_campaigns(sent_at);

-- Índices para newsletter_campaign_recipients
CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_recipients_campaign_id ON newsletter_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_recipients_subscriber_id ON newsletter_campaign_recipients(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_recipients_status ON newsletter_campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_recipients_tracking_id ON newsletter_campaign_recipients(tracking_id);

-- Índices para newsletter_events
CREATE INDEX IF NOT EXISTS idx_newsletter_events_subscriber_id ON newsletter_events(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_events_campaign_id ON newsletter_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_events_event_type ON newsletter_events(event_type);
CREATE INDEX IF NOT EXISTS idx_newsletter_events_created_at ON newsletter_events(created_at);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at 
    BEFORE UPDATE ON newsletter_subscribers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_campaigns_updated_at 
    BEFORE UPDATE ON newsletter_campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_campaign_recipients_updated_at 
    BEFORE UPDATE ON newsletter_campaign_recipients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_templates_updated_at 
    BEFORE UPDATE ON newsletter_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_segments_updated_at 
    BEFORE UPDATE ON newsletter_segments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para contar suscriptores en segmentos
CREATE OR REPLACE FUNCTION update_segment_subscriber_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar el conteo de suscriptores en el segmento
    UPDATE newsletter_segments 
    SET total_subscribers = (
        SELECT COUNT(*) 
        FROM newsletter_subscribers 
        WHERE is_active = true AND is_verified = true
    )
    WHERE id = NEW.segment_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_segments ENABLE ROW LEVEL SECURITY;

-- Políticas para newsletter_subscribers
CREATE POLICY "newsletter_subscribers_select_policy" ON newsletter_subscribers
    FOR SELECT USING (true); -- Cualquiera puede leer suscriptores

CREATE POLICY "newsletter_subscribers_insert_policy" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true); -- Cualquiera puede insertar suscriptores

CREATE POLICY "newsletter_subscribers_update_policy" ON newsletter_subscribers
    FOR UPDATE USING (auth.role() = 'authenticated'); -- Solo usuarios autenticados pueden actualizar

-- Políticas para newsletter_campaigns (solo admins)
CREATE POLICY "newsletter_campaigns_select_policy" ON newsletter_campaigns
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "newsletter_campaigns_insert_policy" ON newsletter_campaigns
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "newsletter_campaigns_update_policy" ON newsletter_campaigns
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas para newsletter_campaign_recipients
CREATE POLICY "newsletter_campaign_recipients_select_policy" ON newsletter_campaign_recipients
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "newsletter_campaign_recipients_insert_policy" ON newsletter_campaign_recipients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas para newsletter_events
CREATE POLICY "newsletter_events_select_policy" ON newsletter_events
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "newsletter_events_insert_policy" ON newsletter_events
    FOR INSERT WITH CHECK (true); -- Cualquiera puede insertar eventos

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar template básico de newsletter
INSERT INTO newsletter_templates (name, description, subject_template, html_template, plain_text_template, variables) 
VALUES (
    'Template Básico',
    'Template básico para newsletters de Cuponomics',
    '🎉 ¡Nuevas ofertas en Cuponomics!',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Cuponomics</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Las mejores ofertas te esperan</p>
        </div>
        
        <div style="padding: 30px;">
            <h2 style="color: #333; margin-bottom: 20px;">¡Hola {{first_name}}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                {{content}}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{cta_url}}" style="background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                    {{cta_text}}
                </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 14px; text-align: center;">
                Si no deseas recibir más emails, puedes <a href="{{unsubscribe_url}}" style="color: #f97316;">darte de baja aquí</a>
            </p>
        </div>
    </div>
</body>
</html>',
    '¡Hola {{first_name}}!

{{content}}

{{cta_text}}: {{cta_url}}

Si no deseas recibir más emails, puedes darte de baja aquí: {{unsubscribe_url}}',
    '{"first_name": "string", "content": "text", "cta_text": "string", "cta_url": "url", "unsubscribe_url": "url"}'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE newsletter_subscribers IS 'Suscriptores al newsletter de Cuponomics';
COMMENT ON TABLE newsletter_campaigns IS 'Campañas de email marketing';
COMMENT ON TABLE newsletter_campaign_recipients IS 'Destinatarios de cada campaña';
COMMENT ON TABLE newsletter_templates IS 'Templates de email para newsletters';
COMMENT ON TABLE newsletter_events IS 'Eventos de tracking de emails';
COMMENT ON TABLE newsletter_segments IS 'Segmentos de suscriptores';

COMMENT ON COLUMN newsletter_subscribers.source IS 'Página donde se suscribió el usuario';
COMMENT ON COLUMN newsletter_subscribers.country IS 'Código de país del suscriptor';
COMMENT ON COLUMN newsletter_subscribers.language IS 'Idioma preferido del suscriptor';
COMMENT ON COLUMN newsletter_subscribers.verification_token IS 'Token para verificar el email';
COMMENT ON COLUMN newsletter_subscribers.verification_expires_at IS 'Fecha de expiración del token de verificación';

-- =====================================================
-- FIN DEL SCRIPT
-- ===================================================== 