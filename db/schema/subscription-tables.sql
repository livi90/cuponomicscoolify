-- Tabla para almacenar los planes de suscripción
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  interval TEXT NOT NULL, -- 'monthly', 'yearly'
  features JSONB NOT NULL,
  stripe_price_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para almacenar las suscripciones de los usuarios
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'trialing'
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para almacenar el historial de pagos
CREATE TABLE IF NOT EXISTS subscription_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  subscription_id UUID REFERENCES user_subscriptions(id) NOT NULL,
  stripe_invoice_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL, -- 'paid', 'pending', 'failed'
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS en las tablas
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para subscription_plans
CREATE POLICY "Todos pueden ver los planes activos" ON subscription_plans
FOR SELECT USING (is_active = true);

CREATE POLICY "Administradores pueden ver todos los planes" ON subscription_plans
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()::uuid AND profiles.role = 'admin'
  )
);

-- Políticas RLS para user_subscriptions
CREATE POLICY "Usuarios pueden ver sus propias suscripciones" ON user_subscriptions
FOR SELECT USING (auth.uid()::uuid = user_id);

CREATE POLICY "Administradores pueden ver todas las suscripciones" ON user_subscriptions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()::uuid AND profiles.role = 'admin'
  )
);

-- Políticas RLS para subscription_payments
CREATE POLICY "Usuarios pueden ver sus propios pagos" ON subscription_payments
FOR SELECT USING (auth.uid()::uuid = user_id);

CREATE POLICY "Administradores pueden ver todos los pagos" ON subscription_payments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()::uuid AND profiles.role = 'admin'
  )
);

-- Insertar planes de suscripción predeterminados
INSERT INTO subscription_plans (name, description, price, interval, features, stripe_price_id, is_active)
VALUES 
  ('Básico', 'Plan básico para comerciantes que inician', 9.99, 'monthly', 
   '["1 tienda", "10 cupones activos", "Estadísticas básicas"]', 
   'price_basic_monthly', true),
  ('Profesional', 'Plan ideal para comerciantes establecidos', 19.99, 'monthly', 
   '["3 tiendas", "50 cupones activos", "Estadísticas avanzadas", "Prioridad en listados"]', 
   'price_pro_monthly', true),
  ('Premium', 'Plan completo para grandes comerciantes', 39.99, 'monthly', 
   '["Tiendas ilimitadas", "Cupones ilimitados", "Estadísticas completas", "Prioridad máxima en listados", "Soporte prioritario"]', 
   'price_premium_monthly', true),
  ('Básico Anual', 'Plan básico con descuento anual', 99.99, 'yearly', 
   '["1 tienda", "10 cupones activos", "Estadísticas básicas"]', 
   'price_basic_yearly', true),
  ('Profesional Anual', 'Plan profesional con descuento anual', 199.99, 'yearly', 
   '["3 tiendas", "50 cupones activos", "Estadísticas avanzadas", "Prioridad en listados"]', 
   'price_pro_yearly', true),
  ('Premium Anual', 'Plan premium con descuento anual', 399.99, 'yearly', 
   '["Tiendas ilimitadas", "Cupones ilimitados", "Estadísticas completas", "Prioridad máxima en listados", "Soporte prioritario"]', 
   'price_premium_yearly', true)
ON CONFLICT DO NOTHING;

-- Crear función para verificar si un usuario tiene una suscripción activa
CREATE OR REPLACE FUNCTION has_active_subscription(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_subscription BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM user_subscriptions
    WHERE user_id = p_user_id
    AND status = 'active'
    AND current_period_end > CURRENT_TIMESTAMP
  ) INTO v_has_subscription;
  
  RETURN v_has_subscription;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para obtener el límite de tiendas según la suscripción
CREATE OR REPLACE FUNCTION get_store_limit(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_plan_features JSONB;
  v_store_limit INTEGER;
BEGIN
  -- Obtener las características del plan
  SELECT sp.features INTO v_plan_features
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id
  AND us.status = 'active'
  AND us.current_period_end > CURRENT_TIMESTAMP
  LIMIT 1;
  
  -- Si no hay suscripción activa, devolver 0
  IF v_plan_features IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Extraer el límite de tiendas de las características
  IF v_plan_features::text LIKE '%tiendas ilimitadas%' THEN
    RETURN -1; -- -1 significa ilimitado
  ELSIF v_plan_features::text LIKE '%3 tiendas%' THEN
    RETURN 3;
  ELSIF v_plan_features::text LIKE '%1 tienda%' THEN
    RETURN 1;
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
