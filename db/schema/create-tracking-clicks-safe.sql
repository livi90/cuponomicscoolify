CREATE TABLE IF NOT EXISTS tracking_clicks (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- User information
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    
    -- UTM Parameters
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    
    -- Store and Coupon information
    store_id BIGINT,
    store_name TEXT,
    coupon_code TEXT,
    coupon_id BIGINT NOT NULL,
    category TEXT,
    
    -- Discount information
    discount_type TEXT,
    discount_value DECIMAL(10,2),
    
    -- Affiliate information
    affiliate_id TEXT,
    
    -- URLs
    original_url TEXT NOT NULL,
    tracked_url TEXT NOT NULL,
    store_url TEXT,
    
    -- Client information
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    device_type TEXT,
    
    -- Constraints
    CONSTRAINT valid_discount_type CHECK (discount_type IN ('percentage', 'fixed', 'free_shipping', 'bogo', 'other') OR discount_type IS NULL),
    CONSTRAINT valid_device_type CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown') OR device_type IS NULL)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tracking_clicks_user_id ON tracking_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_clicks_coupon_id ON tracking_clicks(coupon_id);
CREATE INDEX IF NOT EXISTS idx_tracking_clicks_store_id ON tracking_clicks(store_id);
CREATE INDEX IF NOT EXISTS idx_tracking_clicks_utm_source ON tracking_clicks(utm_source);
CREATE INDEX IF NOT EXISTS idx_tracking_clicks_utm_campaign ON tracking_clicks(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_tracking_clicks_created_at ON tracking_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_tracking_clicks_session_id ON tracking_clicks(session_id);

-- Function to detect device type from user agent
CREATE OR REPLACE FUNCTION detect_device_type(user_agent_string TEXT)
RETURNS TEXT AS $$
BEGIN
    IF user_agent_string IS NULL THEN
        RETURN 'unknown';
    END IF;
    
    -- Mobile detection
    IF user_agent_string ~* '(iPhone|iPod|Android|BlackBerry|Windows Phone|Mobile)' THEN
        RETURN 'mobile';
    END IF;
    
    -- Tablet detection
    IF user_agent_string ~* '(iPad|Tablet)' THEN
        RETURN 'tablet';
    END IF;
    
    -- Desktop (default)
    RETURN 'desktop';
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-detect device type
CREATE OR REPLACE FUNCTION set_device_type()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.device_type IS NULL AND NEW.user_agent IS NOT NULL THEN
        NEW.device_type := detect_device_type(NEW.user_agent);
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_device_type ON tracking_clicks;
CREATE TRIGGER trigger_set_device_type
    BEFORE INSERT OR UPDATE ON tracking_clicks
    FOR EACH ROW
    EXECUTE FUNCTION set_device_type();

-- Enable RLS
ALTER TABLE tracking_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Allow anonymous inserts for tracking" ON tracking_clicks;
CREATE POLICY "Allow anonymous inserts for tracking" ON tracking_clicks
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read their own data" ON tracking_clicks;
CREATE POLICY "Allow authenticated users to read their own data" ON tracking_clicks
    FOR SELECT 
    USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow admins full access" ON tracking_clicks;
CREATE POLICY "Allow admins full access" ON tracking_clicks
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
