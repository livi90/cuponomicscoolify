-- Tabla para registrar las señales de vida del script
CREATE TABLE IF NOT EXISTS script_pings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    tracking_script_id UUID NOT NULL,
    ping_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    script_version VARCHAR(20),
    platform_detected VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_script_pings_store_id ON script_pings(store_id);
CREATE INDEX IF NOT EXISTS idx_script_pings_tracking_script_id ON script_pings(tracking_script_id);
CREATE INDEX IF NOT EXISTS idx_script_pings_timestamp ON script_pings(ping_timestamp);

-- RLS policies
ALTER TABLE script_pings ENABLE ROW LEVEL SECURITY;

-- Los merchants solo pueden ver sus propios pings
CREATE POLICY "Merchants can view own script pings" ON script_pings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = script_pings.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

-- Los admins pueden ver todos los pings
CREATE POLICY "Admins can view all script pings" ON script_pings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Permitir inserción de pings (público para el script)
CREATE POLICY "Allow script ping insertion" ON script_pings
    FOR INSERT WITH CHECK (true);
