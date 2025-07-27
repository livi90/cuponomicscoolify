const fs = require('fs')
const path = require('path')

function generateMigrationScripts() {
  console.log('🔧 Generando scripts de migración...')
  
  // Scripts SQL que faltan basados en el análisis
  const migrationScripts = {
    '01-missing-tables.sql': generateMissingTablesScript(),
    '02-missing-triggers.sql': generateMissingTriggersScript(),
    '03-missing-policies.sql': generateMissingPoliciesScript(),
    '04-missing-indexes.sql': generateMissingIndexesScript(),
    '05-missing-sequences.sql': generateMissingSequencesScript(),
    '06-missing-functions.sql': generateMissingFunctionsScript(),
    '07-setup-complete.sql': generateCompleteSetupScript()
  }
  
  // Crear directorio para scripts de migración
  const migrationDir = path.join(__dirname, 'migration-scripts')
  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir)
  }
  
  // Generar archivos
  Object.entries(migrationScripts).forEach(([filename, content]) => {
    const filePath = path.join(migrationDir, filename)
    fs.writeFileSync(filePath, content)
    console.log(`✅ Generado: ${filename}`)
  })
  
  // Generar script principal
  const mainScript = generateMainMigrationScript(Object.keys(migrationScripts))
  const mainPath = path.join(migrationDir, '00-run-all-migrations.sql')
  fs.writeFileSync(mainPath, mainScript)
  console.log(`✅ Generado: 00-run-all-migrations.sql`)
  
  // Generar README
  const readme = generateMigrationReadme()
  const readmePath = path.join(migrationDir, 'README.md')
  fs.writeFileSync(readmePath, readme)
  console.log(`✅ Generado: README.md`)
  
  console.log(`\n📁 Scripts generados en: ${migrationDir}`)
  console.log('🚀 Ejecuta los scripts en el siguiente orden:')
  console.log('   1. 00-run-all-migrations.sql (para ejecutar todo)')
  console.log('   O individualmente:')
  console.log('   1. 01-missing-tables.sql')
  console.log('   2. 02-missing-triggers.sql')
  console.log('   3. 03-missing-policies.sql')
  console.log('   4. 04-missing-indexes.sql')
  console.log('   5. 05-missing-sequences.sql')
  console.log('   6. 06-missing-functions.sql')
  console.log('   7. 07-setup-complete.sql')
}

function generateMissingTablesScript() {
  return `-- Script para crear tablas faltantes
-- Ejecutar en Supabase Self-Hosted

-- Tablas del esquema auth (sistema de autenticación)
-- Estas tablas son parte del sistema de auth de Supabase y deben existir

-- Tablas del esquema public que faltan
CREATE TABLE IF NOT EXISTS public.affiliate_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.banner_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_id UUID NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(banner_id, date)
);

CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  position TEXT DEFAULT 'top',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupon_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coupon_id, date)
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rating_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rating_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rating_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  context JSONB,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.affiliate_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
`;
}

function generateMissingTriggersScript() {
  return `-- Script para crear triggers faltantes
-- Ejecutar en Supabase Self-Hosted

-- Trigger para actualizar updated_at en payment_reminders
CREATE OR REPLACE FUNCTION update_payment_reminders_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_reminders_updated_at
  BEFORE UPDATE ON public.payment_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_reminders_updated_at();

-- Trigger para desactivar cupones expirados
CREATE OR REPLACE FUNCTION deactivate_expired_coupons()
RETURNS trigger AS $$
BEGIN
  UPDATE public.coupons 
  SET is_active = false 
  WHERE expiry_date < NOW() AND is_active = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deactivate_expired_coupons
  AFTER INSERT OR UPDATE ON public.coupons
  FOR EACH ROW
  EXECUTE FUNCTION deactivate_expired_coupons();

-- Trigger para crear tienda automáticamente al aprobar aplicación
CREATE OR REPLACE FUNCTION create_store_from_application()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    INSERT INTO public.stores (
      name, 
      description, 
      website_url, 
      logo_url, 
      owner_id, 
      store_application_id,
      is_active
    ) VALUES (
      NEW.store_name,
      NEW.description,
      NEW.website_url,
      NEW.logo_url,
      NEW.user_id,
      NEW.id,
      true
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_create_store_on_approval
  AFTER UPDATE ON public.store_applications
  FOR EACH ROW
  EXECUTE FUNCTION create_store_from_application();

-- Trigger para generar pixel_id automáticamente
CREATE OR REPLACE FUNCTION auto_generate_pixel_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.pixel_id IS NULL OR NEW.pixel_id = '' THEN
    NEW.pixel_id = 'pixel_' || gen_random_uuid()::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_pixel_id
  BEFORE INSERT ON public.tracking_pixels
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_pixel_id();

-- Trigger para actualizar updated_at en cupones
CREATE OR REPLACE FUNCTION update_coupons_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_coupons_updated_at();

-- Trigger para actualizar updated_at en perfiles
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- Trigger para actualizar updated_at en comentarios de ratings
CREATE OR REPLACE FUNCTION update_rating_comments_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_comments_updated_at
  BEFORE UPDATE ON public.rating_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_rating_comments_updated_at();

-- Trigger para actualizar updated_at en ratings
CREATE OR REPLACE FUNCTION update_ratings_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON public.ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_ratings_updated_at();

-- Trigger para actualizar updated_at en store_applications
CREATE OR REPLACE FUNCTION update_store_applications_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_store_applications_updated_at
  BEFORE UPDATE ON public.store_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_store_applications_updated_at();

-- Trigger para actualizar updated_at en stores
CREATE OR REPLACE FUNCTION update_stores_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW
  EXECUTE FUNCTION update_stores_updated_at();
`;
}

function generateMissingPoliciesScript() {
  return `-- Script para crear políticas RLS faltantes
-- Ejecutar en Supabase Self-Hosted

-- Políticas para affiliate_tokens
CREATE POLICY "Users can manage their own affiliate tokens" ON public.affiliate_tokens
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all affiliate tokens" ON public.affiliate_tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas para banner_stats
CREATE POLICY "Admins can manage banner stats" ON public.banner_stats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas para banners
CREATE POLICY "Public can view active banners" ON public.banners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all banners" ON public.banners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas para brands
CREATE POLICY "Public can view active brands" ON public.brands
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all brands" ON public.brands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas para categories
CREATE POLICY "Public can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas para coupon_stats
CREATE POLICY "Store owners can view their coupon stats" ON public.coupon_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.coupons
      JOIN public.stores ON stores.id = coupons.store_id
      WHERE coupons.id = coupon_stats.coupon_id
      AND stores.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all coupon stats" ON public.coupon_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas para notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para page_views
CREATE POLICY "Public can insert page views" ON public.page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all page views" ON public.page_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas para rating_comments
CREATE POLICY "Public can view approved comments" ON public.rating_comments
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can insert their own comments" ON public.rating_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments" ON public.rating_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas para rating_votes
CREATE POLICY "Users can manage their own votes" ON public.rating_votes
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para system_logs
CREATE POLICY "Admins can view system logs" ON public.system_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas para tracking_clicks (públicas para inserción)
CREATE POLICY "Public can insert tracking clicks" ON public.tracking_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view tracking clicks" ON public.tracking_clicks
  FOR SELECT USING (true);
`;
}

function generateMissingIndexesScript() {
  return `-- Script para crear índices faltantes
-- Ejecutar en Supabase Self-Hosted

-- Índices para affiliate_tokens
CREATE INDEX IF NOT EXISTS idx_affiliate_tokens_domain ON public.affiliate_tokens(domain);
CREATE INDEX IF NOT EXISTS idx_affiliate_tokens_user_id ON public.affiliate_tokens(user_id);

-- Índices para banner_stats
CREATE INDEX IF NOT EXISTS idx_banner_stats_banner_id ON public.banner_stats(banner_id);
CREATE INDEX IF NOT EXISTS idx_banner_stats_date ON public.banner_stats(date);

-- Índices para banners
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON public.banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_position ON public.banners(position);

-- Índices para brands
CREATE INDEX IF NOT EXISTS idx_brands_is_active ON public.brands(is_active);
CREATE INDEX IF NOT EXISTS idx_brands_is_featured ON public.brands(is_featured);

-- Índices para categories
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);

-- Índices para coupon_stats
CREATE INDEX IF NOT EXISTS idx_coupon_stats_coupon_id ON public.coupon_stats(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_stats_date ON public.coupon_stats(date);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Índices para page_views
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON public.page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON public.page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);

-- Índices para rating_comments
CREATE INDEX IF NOT EXISTS idx_rating_comments_rating_id ON public.rating_comments(rating_id);
CREATE INDEX IF NOT EXISTS idx_rating_comments_user_id ON public.rating_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_rating_comments_is_approved ON public.rating_comments(is_approved);

-- Índices para rating_votes
CREATE INDEX IF NOT EXISTS idx_rating_votes_rating_id ON public.rating_votes(rating_id);
CREATE INDEX IF NOT EXISTS idx_rating_votes_user_id ON public.rating_votes(user_id);

-- Índices para system_logs
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON public.system_logs(user_id);

-- Índices para cupones (si no existen)
CREATE INDEX IF NOT EXISTS idx_coupons_expiry_date ON public.coupons(expiry_date);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_store_id ON public.coupons(store_id);

-- Índices para stores (si no existen)
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON public.stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_store_application_id ON public.stores(store_application_id);

-- Índices para tracking_pixels (si no existen)
CREATE INDEX IF NOT EXISTS idx_tracking_pixels_active ON public.tracking_pixels(is_active);

-- Índices para utm_tracking_exceptions (si no existen)
CREATE INDEX IF NOT EXISTS idx_utm_exceptions_active ON public.utm_tracking_exceptions(is_active);
CREATE INDEX IF NOT EXISTS idx_utm_exceptions_domain ON public.utm_tracking_exceptions(domain);
CREATE INDEX IF NOT EXISTS idx_utm_exceptions_store_id ON public.utm_tracking_exceptions(store_id);
`;
}

function generateMissingSequencesScript() {
  return `-- Script para crear secuencias faltantes
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
`;
}

function generateMissingFunctionsScript() {
  return `-- Script para crear funciones faltantes
-- Ejecutar en Supabase Self-Hosted

-- Función para detectar tipo de dispositivo
CREATE OR REPLACE FUNCTION detect_device_type(user_agent TEXT)
RETURNS TEXT AS $$
BEGIN
  IF user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN
    RETURN 'mobile';
  ELSIF user_agent ILIKE '%tablet%' OR user_agent ILIKE '%ipad%' THEN
    RETURN 'tablet';
  ELSE
    RETURN 'desktop';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para generar ID de pixel
CREATE OR REPLACE FUNCTION generate_pixel_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'pixel_' || gen_random_uuid()::text;
END;
$$ LANGUAGE plpgsql;

-- Función para incrementar vista de producto
CREATE OR REPLACE FUNCTION increment_product_view(product_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.product_stats (product_id, views, date)
  VALUES (product_id, 1, CURRENT_DATE)
  ON CONFLICT (product_id, date)
  DO UPDATE SET views = product_stats.views + 1;
END;
$$ LANGUAGE plpgsql;

-- Función para agregar excepción UTM de tienda
CREATE OR REPLACE FUNCTION add_store_utm_exception(
  p_store_id UUID,
  p_domain TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_exception_id UUID;
BEGIN
  INSERT INTO public.utm_tracking_exceptions (store_id, domain, reason, is_active)
  VALUES (p_store_id, p_domain, p_reason, true)
  RETURNING id INTO v_exception_id;
  
  RETURN v_exception_id;
END;
$$ LANGUAGE plpgsql;
`;
}

function generateCompleteSetupScript() {
  return `-- Script de configuración completa
-- Ejecutar en Supabase Self-Hosted

-- Verificar que todas las tablas existen
DO $$
DECLARE
  missing_tables TEXT[] := ARRAY[
    'affiliate_tokens', 'banner_stats', 'banners', 'brands', 'categories',
    'coupon_stats', 'notifications', 'page_views', 'rating_comments',
    'rating_votes', 'system_logs'
  ];
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY missing_tables
  LOOP
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = table_name) THEN
      RAISE NOTICE 'Tabla faltante: %', table_name;
    END IF;
  END LOOP;
END $$;

-- Verificar que todas las funciones existen
DO $$
DECLARE
  missing_functions TEXT[] := ARRAY[
    'detect_device_type', 'generate_pixel_id', 'increment_product_view',
    'add_store_utm_exception', 'update_payment_reminders_updated_at',
    'deactivate_expired_coupons', 'create_store_from_application',
    'auto_generate_pixel_id', 'update_coupons_updated_at',
    'update_profiles_updated_at', 'update_rating_comments_updated_at',
    'update_ratings_updated_at', 'update_store_applications_updated_at',
    'update_stores_updated_at'
  ];
  func_name TEXT;
BEGIN
  FOREACH func_name IN ARRAY missing_functions
  LOOP
    IF NOT EXISTS (SELECT FROM pg_proc WHERE proname = func_name) THEN
      RAISE NOTICE 'Función faltante: %', func_name;
    END IF;
  END LOOP;
END $$;

-- Verificar que RLS está habilitado en todas las tablas
DO $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    IF NOT EXISTS (
      SELECT FROM pg_tables 
      WHERE tablename = table_record.table_name 
      AND rowsecurity = true
    ) THEN
      RAISE NOTICE 'RLS no habilitado en: %', table_record.table_name;
    END IF;
  END LOOP;
END $$;

-- Insertar datos de ejemplo si las tablas están vacías
INSERT INTO public.categories (name, description, is_active, sort_order)
SELECT 'Electrónicos', 'Productos electrónicos y tecnología', true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Electrónicos');

INSERT INTO public.categories (name, description, is_active, sort_order)
SELECT 'Ropa', 'Ropa y accesorios', true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Ropa');

INSERT INTO public.categories (name, description, is_active, sort_order)
SELECT 'Hogar', 'Productos para el hogar', true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Hogar');

-- Mensaje de finalización
DO $$
BEGIN
  RAISE NOTICE 'Configuración completa finalizada';
  RAISE NOTICE 'Verifica que todas las tablas, funciones y políticas estén creadas correctamente';
END $$;
`;
}

function generateMainMigrationScript(scriptFiles) {
  return `-- Script principal para ejecutar todas las migraciones
-- Ejecutar en Supabase Self-Hosted

-- Habilitar extensión uuid-ossp si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ejecutar scripts en orden
\\i 01-missing-tables.sql
\\i 02-missing-triggers.sql
\\i 03-missing-policies.sql
\\i 04-missing-indexes.sql
\\i 05-missing-sequences.sql
\\i 06-missing-functions.sql
\\i 07-setup-complete.sql

-- Mensaje de finalización
DO $$
BEGIN
  RAISE NOTICE 'Todas las migraciones han sido ejecutadas exitosamente';
  RAISE NOTICE 'Tu base de datos Self-Hosted ahora está sincronizada con Cloud';
END $$;
`;
}

function generateMigrationReadme() {
  return `# 🔄 Scripts de Migración - Supabase Cloud a Self-Hosted

Este directorio contiene los scripts SQL necesarios para completar la migración de tu base de datos de Supabase Cloud a Self-Hosted.

## 📋 Archivos incluidos

### Scripts principales:
- **00-run-all-migrations.sql** - Ejecuta todos los scripts en orden
- **01-missing-tables.sql** - Crea las tablas faltantes
- **02-missing-triggers.sql** - Crea los triggers faltantes
- **03-missing-policies.sql** - Crea las políticas RLS faltantes
- **04-missing-indexes.sql** - Crea los índices faltantes
- **05-missing-sequences.sql** - Crea las secuencias faltantes
- **06-missing-functions.sql** - Crea las funciones faltantes
- **07-setup-complete.sql** - Verificación y configuración final

## 🚀 Cómo ejecutar

### Opción 1: Ejecutar todo de una vez
\`\`\`bash
psql -h tu-host-selfhosted -U postgres -d postgres -f 00-run-all-migrations.sql
\`\`\`

### Opción 2: Ejecutar individualmente
\`\`\`bash
# 1. Tablas
psql -h tu-host-selfhosted -U postgres -d postgres -f 01-missing-tables.sql

# 2. Triggers
psql -h tu-host-selfhosted -U postgres -d postgres -f 02-missing-triggers.sql

# 3. Políticas RLS
psql -h tu-host-selfhosted -U postgres -d postgres -f 03-missing-policies.sql

# 4. Índices
psql -h tu-host-selfhosted -U postgres -d postgres -f 04-missing-indexes.sql

# 5. Secuencias
psql -h tu-host-selfhosted -U postgres -d postgres -f 05-missing-sequences.sql

# 6. Funciones
psql -h tu-host-selfhosted -U postgres -d postgres -f 06-missing-functions.sql

# 7. Verificación final
psql -h tu-host-selfhosted -U postgres -d postgres -f 07-setup-complete.sql
\`\`\`

## 📊 Qué se migra

### Tablas creadas:
- \`affiliate_tokens\` - Tokens de afiliados
- \`banner_stats\` - Estadísticas de banners
- \`banners\` - Banners publicitarios
- \`brands\` - Marcas
- \`categories\` - Categorías de productos
- \`coupon_stats\` - Estadísticas de cupones
- \`notifications\` - Notificaciones de usuarios
- \`page_views\` - Vistas de páginas
- \`rating_comments\` - Comentarios de ratings
- \`rating_votes\` - Votos de ratings
- \`system_logs\` - Logs del sistema

### Funciones creadas:
- \`detect_device_type()\` - Detecta tipo de dispositivo
- \`generate_pixel_id()\` - Genera ID de pixel
- \`increment_product_view()\` - Incrementa vista de producto
- \`add_store_utm_exception()\` - Agrega excepción UTM

### Triggers creados:
- Triggers para actualizar \`updated_at\` automáticamente
- Trigger para desactivar cupones expirados
- Trigger para crear tiendas automáticamente
- Trigger para generar pixel IDs

### Políticas RLS:
- Políticas para acceso público donde corresponde
- Políticas para propietarios de tiendas
- Políticas para administradores
- Políticas para usuarios autenticados

## ⚠️ Notas importantes

1. **Haz backup** antes de ejecutar los scripts
2. **Ejecuta en orden** para evitar errores de dependencias
3. **Verifica** que tu aplicación funcione después de la migración
4. **Revisa los logs** para detectar posibles errores

## 🔍 Verificación post-migración

Después de ejecutar los scripts, verifica:

1. Que todas las tablas existen:
\`\`\`sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
\`\`\`

2. Que todas las funciones existen:
\`\`\`sql
SELECT proname FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;
\`\`\`

3. Que RLS está habilitado:
\`\`\`sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
\`\`\`

## 🆘 Solución de problemas

Si encuentras errores:

1. **Verifica permisos** - Asegúrate de tener permisos de administrador
2. **Revisa dependencias** - Algunos scripts dependen de otros
3. **Check logs** - Revisa los logs de PostgreSQL para errores específicos
4. **Rollback** - Si es necesario, restaura desde backup

## ✅ Completado

Una vez que todos los scripts se ejecuten exitosamente, tu base de datos Self-Hosted estará completamente sincronizada con tu base de datos Cloud.
`;
}

// Ejecutar generación
if (require.main === module) {
  generateMigrationScripts()
    .then(() => {
      console.log('🎉 Scripts de migración generados exitosamente')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error generando scripts:', error)
      process.exit(1)
    })
}

module.exports = { generateMigrationScripts } 