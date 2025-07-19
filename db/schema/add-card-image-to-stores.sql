-- Agregar campo card_image_url a la tabla stores
ALTER TABLE stores ADD COLUMN IF NOT EXISTS card_image_url TEXT;

-- Agregar campo card_image_url a la tabla store_applications
ALTER TABLE store_applications ADD COLUMN IF NOT EXISTS card_image_url TEXT;

-- Actualizar el trigger para incluir el nuevo campo
CREATE OR REPLACE FUNCTION create_store_from_application()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO stores (
        owner_id,
        name,
        slug,
        description,
        website,
        logo_url,
        card_image_url,
        category,
        contact_email,
        contact_phone,
        address,
        is_active,
        store_application_id
    ) VALUES (
        NEW.user_id,
        NEW.store_name,
        lower(regexp_replace(NEW.store_name, '[^a-zA-Z0-9]', '-', 'g')),
        NEW.description,
        NEW.website,
        NEW.logo_url,
        NEW.card_image_url,
        NEW.category,
        NEW.contact_email,
        NEW.contact_phone,
        NEW.address,
        true,
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
