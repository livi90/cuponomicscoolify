-- Script para crear triggers faltantes
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
