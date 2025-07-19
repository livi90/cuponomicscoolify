-- Verificar si la tabla stores existe y crear o actualizar si es necesario
DO $$
BEGIN
    -- Verificar si la tabla existe
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'stores') THEN
        -- Crear la tabla si no existe
        CREATE TABLE public.stores (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            owner_id UUID REFERENCES auth.users(id) NOT NULL,
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            website TEXT,
            logo_url TEXT,
            category TEXT,
            contact_email TEXT,
            contact_phone TEXT,
            address TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    ELSE
        -- Verificar y añadir columnas si no existen
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'name') THEN
            ALTER TABLE public.stores ADD COLUMN name TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'slug') THEN
            ALTER TABLE public.stores ADD COLUMN slug TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'description') THEN
            ALTER TABLE public.stores ADD COLUMN description TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'website') THEN
            ALTER TABLE public.stores ADD COLUMN website TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'logo_url') THEN
            ALTER TABLE public.stores ADD COLUMN logo_url TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'category') THEN
            ALTER TABLE public.stores ADD COLUMN category TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'contact_email') THEN
            ALTER TABLE public.stores ADD COLUMN contact_email TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'contact_phone') THEN
            ALTER TABLE public.stores ADD COLUMN contact_phone TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'address') THEN
            ALTER TABLE public.stores ADD COLUMN address TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'is_active') THEN
            ALTER TABLE public.stores ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'created_at') THEN
            ALTER TABLE public.stores ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'updated_at') THEN
            ALTER TABLE public.stores ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        END IF;
    END IF;
END
$$;
