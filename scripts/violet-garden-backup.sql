--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-25 14:38:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = on;

DROP DATABASE postgres;
--
-- TOC entry 4557 (class 1262 OID 5)
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = on;

--
-- TOC entry 4558 (class 0 OID 0)
-- Dependencies: 4557
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- TOC entry 4560 (class 0 OID 0)
-- Name: postgres; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE postgres SET "app.settings.jwt_exp" TO '3600';


\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = on;

--
-- TOC entry 21 (class 2615 OID 16488)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- TOC entry 18 (class 2615 OID 16388)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- TOC entry 29 (class 2615 OID 16618)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- TOC entry 13 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4563 (class 0 OID 0)
-- Dependencies: 13
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 32 (class 2615 OID 16599)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- TOC entry 19 (class 2615 OID 16536)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- TOC entry 33 (class 2615 OID 135114)
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- TOC entry 26 (class 2615 OID 16645)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- TOC entry 1160 (class 1247 OID 16762)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- TOC entry 1184 (class 1247 OID 16903)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- TOC entry 1157 (class 1247 OID 16756)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1154 (class 1247 OID 16750)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1190 (class 1247 OID 16945)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1241 (class 1247 OID 17302)
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- TOC entry 1232 (class 1247 OID 17263)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- TOC entry 1235 (class 1247 OID 17277)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- TOC entry 1247 (class 1247 OID 17344)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- TOC entry 1244 (class 1247 OID 17315)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- TOC entry 387 (class 1255 OID 16534)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- TOC entry 4568 (class 0 OID 0)
-- Dependencies: 387
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 467 (class 1255 OID 16732)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- TOC entry 386 (class 1255 OID 16533)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- TOC entry 4571 (class 0 OID 0)
-- Dependencies: 386
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 385 (class 1255 OID 16532)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- TOC entry 4573 (class 0 OID 0)
-- Dependencies: 385
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 451 (class 1255 OID 16591)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO postgres;

--
-- TOC entry 4575 (class 0 OID 0)
-- Dependencies: 451
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 459 (class 1255 OID 16612)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- TOC entry 4577 (class 0 OID 0)
-- Dependencies: 459
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 457 (class 1255 OID 16593)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO postgres;

--
-- TOC entry 4579 (class 0 OID 0)
-- Dependencies: 457
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 456 (class 1255 OID 16603)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- TOC entry 411 (class 1255 OID 16604)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- TOC entry 458 (class 1255 OID 16614)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- TOC entry 4583 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 365 (class 1255 OID 93571)
-- Name: add_store_utm_exception(uuid, text, text, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_store_utm_exception(p_store_id uuid, p_reason text DEFAULT NULL::text, p_affiliate_program text DEFAULT NULL::text, p_affiliate_id text DEFAULT NULL::text, p_priority integer DEFAULT 1) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  v_exception_id UUID;
  v_store_record RECORD;
BEGIN
  -- Obtener datos de la tienda
  SELECT s.*, p.id as owner_id 
  INTO v_store_record
  FROM stores s
  LEFT JOIN profiles p ON s.owner_id = p.id
  WHERE s.id = p_store_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Store not found: %', p_store_id;
  END IF;
  
  -- Insertar excepción
  INSERT INTO utm_tracking_exceptions (
    store_id,
    owner_id,
    store_name,
    store_slug,
    domain,
    reason,
    affiliate_program,
    affiliate_id,
    priority,
    is_active
  ) VALUES (
    p_store_id,
    v_store_record.owner_id,
    v_store_record.name,
    v_store_record.slug,
    COALESCE(
      -- Extraer dominio de website si existe
      CASE 
        WHEN v_store_record.website IS NOT NULL 
        THEN regexp_replace(
          regexp_replace(v_store_record.website, '^https?://', ''), 
          '^www\.', ''
        )
        ELSE NULL
      END,
      'unknown-domain.com'
    ),
    p_reason,
    p_affiliate_program,
    p_affiliate_id,
    p_priority,
    true
  ) RETURNING id INTO v_exception_id;
  
  RETURN v_exception_id;
END;
$$;


ALTER FUNCTION public.add_store_utm_exception(p_store_id uuid, p_reason text, p_affiliate_program text, p_affiliate_id text, p_priority integer) OWNER TO postgres;

--
-- TOC entry 412 (class 1255 OID 58838)
-- Name: auto_create_store_on_approval(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_create_store_on_approval() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Solo proceder si el estado cambió a 'approved' y no existía antes
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Verificar que no exista ya una tienda para este usuario
    IF NOT EXISTS (
      SELECT 1 FROM stores 
      WHERE user_id = NEW.user_id
      AND name = NEW.store_name
    ) THEN
      -- Crear la tienda usando los campos correctos de la tabla stores
      INSERT INTO stores (
        user_id,           -- UUID - ID del usuario propietario
        owner_id,          -- TEXT - Convertimos el UUID a texto
        name,              -- TEXT - Nombre de la tienda
        slug,              -- TEXT - Slug generado automáticamente
        description,       -- TEXT - Descripción de la tienda
        website,           -- TEXT - Sitio web
        logo_url,          -- TEXT - URL del logo
        category,          -- TEXT - Categoría
        contact_email,     -- TEXT - Email de contacto
        contact_phone,     -- TEXT - Teléfono de contacto
        address,           -- TEXT - Dirección
        is_active,         -- BOOLEAN - Estado activo
        store_application_id, -- UUID - Referencia a la solicitud
        created_at,        -- TIMESTAMP - Fecha de creación
        updated_at         -- TIMESTAMP - Fecha de actualización
      ) VALUES (
        NEW.user_id,                    -- user_id (UUID)
        NEW.user_id::text,              -- owner_id (TEXT) - convertimos UUID a texto
        NEW.store_name,                 -- name
        LOWER(REGEXP_REPLACE(           -- slug - generar slug limpio
          REGEXP_REPLACE(NEW.store_name, '[^a-zA-Z0-9\s]', '', 'g'), 
          '\s+', '-', 'g'
        )),
        COALESCE(NEW.description, ''),  -- description
        NEW.website,                    -- website
        NEW.logo_url,                   -- logo_url
        NEW.category,                   -- category
        NEW.contact_email,              -- contact_email
        NEW.contact_phone,              -- contact_phone
        NEW.address,                    -- address
        true,                           -- is_active
        NEW.id,                         -- store_application_id
        NOW(),                          -- created_at
        NOW()                           -- updated_at
      );
      
      -- Actualizar el rol del usuario a 'merchant' si no lo es ya
      UPDATE profiles 
      SET role = 'merchant', updated_at = NOW()
      WHERE id = NEW.user_id 
      AND role NOT IN ('merchant', 'admin');
      
      -- Log para debugging
      RAISE NOTICE 'Tienda creada automáticamente: % para usuario: %', NEW.store_name, NEW.user_id;
      
    ELSE
      RAISE NOTICE 'Ya existe una tienda con el nombre % para el usuario %', NEW.store_name, NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.auto_create_store_on_approval() OWNER TO postgres;

--
-- TOC entry 399 (class 1255 OID 96175)
-- Name: auto_generate_pixel_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_generate_pixel_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.pixel_id IS NULL OR NEW.pixel_id = '' THEN
        NEW.pixel_id := generate_pixel_id();
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.auto_generate_pixel_id() OWNER TO postgres;

--
-- TOC entry 325 (class 1255 OID 122478)
-- Name: deactivate_expired_coupons(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.deactivate_expired_coupons() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.expiry_date IS NOT NULL AND NEW.expiry_date < NOW() THEN
    NEW.is_active := FALSE;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.deactivate_expired_coupons() OWNER TO postgres;

--
-- TOC entry 326 (class 1255 OID 92316)
-- Name: detect_device_type(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.detect_device_type(user_agent_string text) RETURNS text
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.detect_device_type(user_agent_string text) OWNER TO postgres;

--
-- TOC entry 329 (class 1255 OID 97458)
-- Name: generate_invoice_number(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_invoice_number() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number = 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_sequence')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.generate_invoice_number() OWNER TO postgres;

--
-- TOC entry 394 (class 1255 OID 97506)
-- Name: generate_monthly_payment_reminders(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_monthly_payment_reminders() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- This would call your API endpoint or execute the logic directly
  -- For now, we'll just log that the function was called
  INSERT INTO system_logs (message, created_at) 
  VALUES ('Monthly payment reminders generation triggered', NOW());
END;
$$;


ALTER FUNCTION public.generate_monthly_payment_reminders() OWNER TO postgres;

--
-- TOC entry 398 (class 1255 OID 96174)
-- Name: generate_pixel_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_pixel_id() RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_id TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        new_id := 'px_' || substr(md5(random()::text), 1, 10);
        SELECT COUNT(*) INTO exists_check FROM tracking_pixels WHERE pixel_id = new_id;
        EXIT WHEN exists_check = 0;
    END LOOP;
    RETURN new_id;
END;
$$;


ALTER FUNCTION public.generate_pixel_id() OWNER TO postgres;

--
-- TOC entry 324 (class 1255 OID 18558)
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Insertar un nuevo registro en la tabla profiles con rol 'user' por defecto
  INSERT INTO public.profiles (id, email, username, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    'user'  -- Asignar rol 'user' por defecto
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- TOC entry 395 (class 1255 OID 97507)
-- Name: send_pending_payment_reminders(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.send_pending_payment_reminders() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- This would call your API endpoint or execute the logic directly
  -- For now, we'll just log that the function was called
  INSERT INTO system_logs (message, created_at) 
  VALUES ('Payment reminders sending triggered', NOW());
END;
$$;


ALTER FUNCTION public.send_pending_payment_reminders() OWNER TO postgres;

--
-- TOC entry 327 (class 1255 OID 92317)
-- Name: set_device_type(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_device_type() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.device_type IS NULL AND NEW.user_agent IS NOT NULL THEN
        NEW.device_type := detect_device_type(NEW.user_agent);
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_device_type() OWNER TO postgres;

--
-- TOC entry 366 (class 1255 OID 93572)
-- Name: should_exclude_utm_tracking(uuid, text, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.should_exclude_utm_tracking(p_store_id uuid DEFAULT NULL::uuid, p_domain text DEFAULT NULL::text, p_owner_id uuid DEFAULT NULL::uuid) RETURNS TABLE(should_exclude boolean, exception_id uuid, reason text, affiliate_program text, affiliate_id text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true as should_exclude,
    ute.id as exception_id,
    ute.reason,
    ute.affiliate_program,
    ute.affiliate_id
  FROM utm_tracking_exceptions ute
  WHERE ute.is_active = true
    AND (
      -- Coincidencia exacta por store_id (máxima prioridad)
      (p_store_id IS NOT NULL AND ute.store_id = p_store_id)
      OR
      -- Coincidencia por owner_id
      (p_owner_id IS NOT NULL AND ute.owner_id = p_owner_id)
      OR
      -- Coincidencia por dominio
      (p_domain IS NOT NULL AND p_domain ILIKE '%' || ute.domain || '%')
    )
  ORDER BY 
    -- Priorizar coincidencias exactas
    CASE 
      WHEN ute.store_id = p_store_id THEN 1
      WHEN ute.owner_id = p_owner_id THEN 2
      WHEN p_domain ILIKE '%' || ute.domain || '%' THEN 3
      ELSE 4
    END,
    ute.priority ASC
  LIMIT 1;
  
  -- Si no hay coincidencias, no excluir
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT;
  END IF;
END;
$$;


ALTER FUNCTION public.should_exclude_utm_tracking(p_store_id uuid, p_domain text, p_owner_id uuid) OWNER TO postgres;

--
-- TOC entry 323 (class 1255 OID 97456)
-- Name: update_payment_reminders_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_payment_reminders_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_payment_reminders_updated_at() OWNER TO postgres;

--
-- TOC entry 388 (class 1255 OID 96108)
-- Name: update_tracking_conversions_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_tracking_conversions_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_tracking_conversions_updated_at() OWNER TO postgres;

--
-- TOC entry 397 (class 1255 OID 96172)
-- Name: update_tracking_pixels_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_tracking_pixels_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_tracking_pixels_updated_at() OWNER TO postgres;

--
-- TOC entry 478 (class 1255 OID 17250)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- TOC entry 416 (class 1255 OID 17337)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 482 (class 1255 OID 17415)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- TOC entry 486 (class 1255 OID 17349)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- TOC entry 480 (class 1255 OID 17299)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- TOC entry 485 (class 1255 OID 17294)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- TOC entry 487 (class 1255 OID 17345)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- TOC entry 417 (class 1255 OID 17356)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 479 (class 1255 OID 17293)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- TOC entry 483 (class 1255 OID 17414)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- TOC entry 484 (class 1255 OID 17291)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- TOC entry 481 (class 1255 OID 17326)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- TOC entry 488 (class 1255 OID 17408)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- TOC entry 473 (class 1255 OID 17010)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- TOC entry 470 (class 1255 OID 16984)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 469 (class 1255 OID 16983)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 468 (class 1255 OID 16982)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 471 (class 1255 OID 16996)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- TOC entry 475 (class 1255 OID 17049)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 474 (class 1255 OID 17012)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 477 (class 1255 OID 17065)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- TOC entry 476 (class 1255 OID 16999)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 472 (class 1255 OID 17000)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 260 (class 1259 OID 16519)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- TOC entry 4613 (class 0 OID 0)
-- Dependencies: 260
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 277 (class 1259 OID 16907)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- TOC entry 4615 (class 0 OID 0)
-- Dependencies: 277
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- TOC entry 268 (class 1259 OID 16704)
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- TOC entry 4617 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4618 (class 0 OID 0)
-- Dependencies: 268
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 259 (class 1259 OID 16512)
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- TOC entry 4620 (class 0 OID 0)
-- Dependencies: 259
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 272 (class 1259 OID 16794)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- TOC entry 4622 (class 0 OID 0)
-- Dependencies: 272
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 271 (class 1259 OID 16782)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- TOC entry 4624 (class 0 OID 0)
-- Dependencies: 271
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 270 (class 1259 OID 16769)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- TOC entry 4626 (class 0 OID 0)
-- Dependencies: 270
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 278 (class 1259 OID 16957)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 258 (class 1259 OID 16501)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 4629 (class 0 OID 0)
-- Dependencies: 258
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 257 (class 1259 OID 16500)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- TOC entry 4631 (class 0 OID 0)
-- Dependencies: 257
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 275 (class 1259 OID 16836)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 4633 (class 0 OID 0)
-- Dependencies: 275
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 276 (class 1259 OID 16854)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- TOC entry 4635 (class 0 OID 0)
-- Dependencies: 276
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 261 (class 1259 OID 16527)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- TOC entry 4637 (class 0 OID 0)
-- Dependencies: 261
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 269 (class 1259 OID 16734)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- TOC entry 4639 (class 0 OID 0)
-- Dependencies: 269
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4640 (class 0 OID 0)
-- Dependencies: 269
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 274 (class 1259 OID 16821)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- TOC entry 4642 (class 0 OID 0)
-- Dependencies: 274
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 273 (class 1259 OID 16812)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 4644 (class 0 OID 0)
-- Dependencies: 273
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4645 (class 0 OID 0)
-- Dependencies: 273
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 256 (class 1259 OID 16489)
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- TOC entry 4647 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4648 (class 0 OID 0)
-- Dependencies: 256
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 309 (class 1259 OID 115702)
-- Name: affiliate_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affiliate_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    store_id uuid,
    store_domain text NOT NULL,
    affiliate_url text NOT NULL,
    cookies jsonb,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.affiliate_tokens OWNER TO postgres;

--
-- TOC entry 317 (class 1259 OID 129408)
-- Name: banner_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banner_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    banner_id uuid,
    views integer DEFAULT 0 NOT NULL,
    clicks integer DEFAULT 0 NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.banner_stats OWNER TO postgres;

--
-- TOC entry 316 (class 1259 OID 129348)
-- Name: banners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banners (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text,
    image_url text NOT NULL,
    link_url text,
    brand_id uuid,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    is_active boolean DEFAULT true NOT NULL,
    "position" text DEFAULT 'top'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.banners OWNER TO postgres;

--
-- TOC entry 315 (class 1259 OID 129300)
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    logo_url text,
    website text
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 17225)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    parent_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 17210)
-- Name: coupon_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupon_stats (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    coupon_id uuid NOT NULL,
    views integer DEFAULT 0,
    clicks integer DEFAULT 0,
    conversions integer DEFAULT 0,
    last_updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.coupon_stats OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 17126)
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    store_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    code text,
    discount_value numeric,
    discount_type text,
    start_date timestamp with time zone,
    expiry_date timestamp with time zone,
    terms_conditions text,
    coupon_type text NOT NULL,
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    coupon_url text,
    coupon_category text,
    CONSTRAINT coupons_coupon_type_check CHECK ((coupon_type = ANY (ARRAY['code'::text, 'deal'::text, 'free_shipping'::text]))),
    CONSTRAINT coupons_discount_type_check CHECK ((discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text, 'free_shipping'::text, 'bogo'::text, 'other'::text])))
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- TOC entry 4656 (class 0 OID 0)
-- Dependencies: 284
-- Name: COLUMN coupons.coupon_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.coupons.coupon_url IS 'URL específica del cupón/oferta que redirige al producto o página de la oferta';


--
-- TOC entry 305 (class 1259 OID 97459)
-- Name: invoice_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoice_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoice_sequence OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 18576)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    read boolean DEFAULT false,
    data jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 308 (class 1259 OID 110105)
-- Name: page_views; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.page_views (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    path text NOT NULL,
    country text,
    user_agent text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    visitor_hash text
);


ALTER TABLE public.page_views OWNER TO postgres;

--
-- TOC entry 304 (class 1259 OID 97430)
-- Name: payment_reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_reminders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    merchant_id uuid NOT NULL,
    commission_amount numeric(10,2) NOT NULL,
    period_start date NOT NULL,
    period_end date NOT NULL,
    due_date date NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    reminder_count integer DEFAULT 0,
    last_reminder_sent timestamp with time zone,
    payment_method text DEFAULT 'paypal'::text,
    merchant_email text NOT NULL,
    merchant_name text,
    invoice_number text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT payment_reminders_payment_method_check CHECK ((payment_method = ANY (ARRAY['paypal'::text, 'stripe'::text, 'bank_transfer'::text]))),
    CONSTRAINT payment_reminders_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'sent'::text, 'paid'::text, 'overdue'::text, 'cancelled'::text])))
);


ALTER TABLE public.payment_reminders OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 67738)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    store_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    sale_price numeric(10,2),
    image_url text,
    product_url text,
    category character varying(100),
    tags text[],
    is_new boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    stock_quantity integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    status character varying(20) DEFAULT 'active'::character varying,
    CONSTRAINT products_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'draft'::character varying])::text[])))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 17071)
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text,
    full_name text,
    avatar_url text,
    email text,
    role text DEFAULT 'user'::text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['user'::text, 'merchant'::text, 'admin'::text])))
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 17190)
-- Name: rating_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rating_comments (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    rating_id uuid NOT NULL,
    user_id uuid NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rating_comments OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 17168)
-- Name: rating_votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rating_votes (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    rating_id uuid NOT NULL,
    user_id uuid NOT NULL,
    vote_type text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rating_votes_vote_type_check CHECK ((vote_type = ANY (ARRAY['like'::text, 'dislike'::text])))
);


ALTER TABLE public.rating_votes OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 17145)
-- Name: ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ratings (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    coupon_id uuid NOT NULL,
    rating integer NOT NULL,
    worked boolean,
    comment text,
    amount_saved numeric,
    screenshot_url text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.ratings OWNER TO postgres;

--
-- TOC entry 307 (class 1259 OID 97552)
-- Name: script_pings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.script_pings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    store_id uuid,
    tracking_script_id uuid NOT NULL,
    ping_timestamp timestamp with time zone DEFAULT now(),
    page_url text,
    user_agent text,
    ip_address inet,
    script_version character varying(20),
    platform_detected character varying(50),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.script_pings OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 17091)
-- Name: store_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_applications (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    store_name text NOT NULL,
    description text,
    website text,
    logo_url text,
    category text,
    contact_email text NOT NULL,
    contact_phone text,
    address text,
    status text DEFAULT 'pending'::text NOT NULL,
    admin_notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    ecommerce_platform character varying(50),
    is_exclusive_brand boolean,
    commission numeric(4,2) DEFAULT 7.5,
    accepted_terms boolean,
    additional_info text,
    business_type text,
    contact_name text,
    store_description text,
    CONSTRAINT store_applications_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);


ALTER TABLE public.store_applications OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 17108)
-- Name: stores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stores (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid,
    owner_id uuid NOT NULL,
    slug text,
    description text,
    website text,
    logo_url text,
    category text,
    contact_email text,
    contact_phone text,
    address text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    name text,
    store_application_id uuid,
    ecommerce_platform character varying(50),
    tracking_script_id uuid DEFAULT gen_random_uuid(),
    script_last_ping timestamp with time zone,
    script_status character varying(20) DEFAULT 'inactive'::character varying,
    card_image_url text,
    country text,
    commission_rate numeric(4,2) DEFAULT 7.5
);


ALTER TABLE public.stores OWNER TO postgres;

--
-- TOC entry 4669 (class 0 OID 0)
-- Dependencies: 283
-- Name: COLUMN stores.owner_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.stores.owner_id IS 'Tipo de dato corregido a UUID para consistencia con auth.users';


--
-- TOC entry 4670 (class 0 OID 0)
-- Dependencies: 283
-- Name: COLUMN stores.ecommerce_platform; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.stores.ecommerce_platform IS 'Plataforma de ecommerce: shopify, woocommerce, magento, prestashop, etc.';


--
-- TOC entry 4671 (class 0 OID 0)
-- Dependencies: 283
-- Name: COLUMN stores.tracking_script_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.stores.tracking_script_id IS 'ID único del script de tracking para esta tienda';


--
-- TOC entry 4672 (class 0 OID 0)
-- Dependencies: 283
-- Name: COLUMN stores.script_last_ping; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.stores.script_last_ping IS 'Última vez que el script envió señal de vida';


--
-- TOC entry 4673 (class 0 OID 0)
-- Dependencies: 283
-- Name: COLUMN stores.script_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.stores.script_status IS 'Estado del script: active, inactive, never_installed';


--
-- TOC entry 306 (class 1259 OID 97508)
-- Name: system_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.system_logs OWNER TO postgres;

--
-- TOC entry 301 (class 1259 OID 92292)
-- Name: tracking_clicks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tracking_clicks (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    session_id text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_content text,
    utm_term text,
    store_id uuid,
    store_name text,
    coupon_code text,
    coupon_id uuid,
    category text,
    discount_type text,
    discount_value numeric(10,2),
    affiliate_id text,
    original_url text NOT NULL,
    tracked_url text NOT NULL,
    store_url text,
    ip_address inet,
    user_agent text,
    referrer text,
    device_type text,
    clicked_at text,
    CONSTRAINT valid_device_type CHECK (((device_type = ANY (ARRAY['mobile'::text, 'tablet'::text, 'desktop'::text, 'unknown'::text])) OR (device_type IS NULL))),
    CONSTRAINT valid_discount_type CHECK (((discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text, 'free_shipping'::text, 'bogo'::text, 'other'::text])) OR (discount_type IS NULL)))
);


ALTER TABLE public.tracking_clicks OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 92291)
-- Name: tracking_clicks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tracking_clicks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tracking_clicks_id_seq OWNER TO postgres;

--
-- TOC entry 4677 (class 0 OID 0)
-- Dependencies: 300
-- Name: tracking_clicks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tracking_clicks_id_seq OWNED BY public.tracking_clicks.id;


--
-- TOC entry 302 (class 1259 OID 96058)
-- Name: tracking_conversions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tracking_conversions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid,
    store_id uuid,
    click_id bigint,
    conversion_type character varying(50) DEFAULT 'purchase'::character varying,
    conversion_value numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'EUR'::character varying,
    commission_rate numeric(5,2) DEFAULT 5.00,
    commission_amount numeric(10,2) GENERATED ALWAYS AS (((conversion_value * commission_rate) / (100)::numeric)) STORED,
    order_id character varying(255),
    product_ids text[],
    product_names text[],
    quantity integer DEFAULT 1,
    utm_source character varying(255),
    utm_medium character varying(255),
    utm_campaign character varying(255),
    utm_content character varying(255),
    utm_term character varying(255),
    coupon_id uuid,
    coupon_code character varying(100),
    discount_applied numeric(10,2) DEFAULT 0,
    session_id character varying(255),
    user_agent text,
    ip_address inet,
    referrer text,
    landing_page text,
    platform character varying(50),
    store_url text,
    checkout_url text,
    status character varying(20) DEFAULT 'pending'::character varying,
    verified_at timestamp with time zone,
    verification_method character varying(50),
    customer_email character varying(255),
    customer_id character varying(255),
    is_new_customer boolean DEFAULT true,
    converted_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.tracking_conversions OWNER TO postgres;

--
-- TOC entry 4679 (class 0 OID 0)
-- Dependencies: 302
-- Name: TABLE tracking_conversions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tracking_conversions IS 'Tabla para rastrear conversiones de ventas desde enlaces de afiliados';


--
-- TOC entry 4680 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN tracking_conversions.click_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tracking_conversions.click_id IS 'Referencia al click original (BIGINT para compatibilidad)';


--
-- TOC entry 4681 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN tracking_conversions.conversion_value; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tracking_conversions.conversion_value IS 'Valor total de la venta en la moneda especificada';


--
-- TOC entry 4682 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN tracking_conversions.commission_amount; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tracking_conversions.commission_amount IS 'Comisión calculada automáticamente basada en el porcentaje';


--
-- TOC entry 4683 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN tracking_conversions.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tracking_conversions.status IS 'Estado de la conversión: pending, confirmed, cancelled, refunded';


--
-- TOC entry 4684 (class 0 OID 0)
-- Dependencies: 302
-- Name: COLUMN tracking_conversions.verification_method; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tracking_conversions.verification_method IS 'Método usado para verificar la conversión';


--
-- TOC entry 303 (class 1259 OID 96133)
-- Name: tracking_pixels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tracking_pixels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    store_id uuid NOT NULL,
    pixel_name character varying(255) NOT NULL,
    pixel_id character varying(100) NOT NULL,
    commission_rate numeric(5,2) DEFAULT 5.00,
    currency character varying(3) DEFAULT 'EUR'::character varying,
    track_all_pages boolean DEFAULT false,
    checkout_pages text[] DEFAULT ARRAY['/checkout/success'::text, '/order-received'::text, '/thank-you'::text],
    track_purchases boolean DEFAULT true,
    track_leads boolean DEFAULT false,
    track_signups boolean DEFAULT false,
    allowed_domains text[],
    webhook_url text,
    is_active boolean DEFAULT true,
    is_test_mode boolean DEFAULT false,
    total_conversions integer DEFAULT 0,
    total_revenue numeric(12,2) DEFAULT 0,
    last_conversion_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    auto_detect_conversions boolean DEFAULT true,
    checkout_patterns text[] DEFAULT ARRAY['/checkout/success'::text, '/order-received'::text, '/thank-you'::text, '/order-complete'::text],
    is_verified boolean DEFAULT false,
    platform character varying(50),
    store_url text DEFAULT ''::text NOT NULL,
    track_add_to_cart boolean DEFAULT false,
    track_page_views boolean DEFAULT true,
    last_activity_at timestamp with time zone,
    total_commission numeric(12,2) DEFAULT 0
);


ALTER TABLE public.tracking_pixels OWNER TO postgres;

--
-- TOC entry 4686 (class 0 OID 0)
-- Dependencies: 303
-- Name: TABLE tracking_pixels; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tracking_pixels IS 'Tabla para gestionar píxeles de tracking por tienda';


--
-- TOC entry 4687 (class 0 OID 0)
-- Dependencies: 303
-- Name: COLUMN tracking_pixels.pixel_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tracking_pixels.pixel_id IS 'ID público único del píxel para usar en el código JavaScript';


--
-- TOC entry 4688 (class 0 OID 0)
-- Dependencies: 303
-- Name: COLUMN tracking_pixels.commission_rate; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tracking_pixels.commission_rate IS 'Porcentaje de comisión para esta tienda';


--
-- TOC entry 4689 (class 0 OID 0)
-- Dependencies: 303
-- Name: COLUMN tracking_pixels.checkout_pages; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tracking_pixels.checkout_pages IS 'Array de URLs que indican páginas de checkout exitoso';


--
-- TOC entry 4690 (class 0 OID 0)
-- Dependencies: 303
-- Name: COLUMN tracking_pixels.allowed_domains; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tracking_pixels.allowed_domains IS 'Array de dominios donde puede funcionar el píxel';


--
-- TOC entry 299 (class 1259 OID 91156)
-- Name: utm_tracking_exceptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utm_tracking_exceptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    store_id uuid,
    store_name text NOT NULL,
    domain text NOT NULL,
    reason text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    owner_id uuid,
    store_slug text,
    affiliate_program text,
    affiliate_id text,
    custom_tracking_params jsonb,
    priority integer DEFAULT 1,
    notes text
);


ALTER TABLE public.utm_tracking_exceptions OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 17418)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- TOC entry 310 (class 1259 OID 121364)
-- Name: messages_2025_07_18; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_07_18 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_07_18 OWNER TO supabase_admin;

--
-- TOC entry 311 (class 1259 OID 123603)
-- Name: messages_2025_07_19; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_07_19 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_07_19 OWNER TO supabase_admin;

--
-- TOC entry 312 (class 1259 OID 123614)
-- Name: messages_2025_07_20; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_07_20 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_07_20 OWNER TO supabase_admin;

--
-- TOC entry 313 (class 1259 OID 124789)
-- Name: messages_2025_07_21; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_07_21 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_07_21 OWNER TO supabase_admin;

--
-- TOC entry 314 (class 1259 OID 127006)
-- Name: messages_2025_07_22; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_07_22 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_07_22 OWNER TO supabase_admin;

--
-- TOC entry 318 (class 1259 OID 129526)
-- Name: messages_2025_07_23; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_07_23 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_07_23 OWNER TO supabase_admin;

--
-- TOC entry 319 (class 1259 OID 129537)
-- Name: messages_2025_07_24; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_07_24 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_07_24 OWNER TO supabase_admin;

--
-- TOC entry 290 (class 1259 OID 17257)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- TOC entry 293 (class 1259 OID 17279)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- TOC entry 292 (class 1259 OID 17278)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 262 (class 1259 OID 16540)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- TOC entry 4704 (class 0 OID 0)
-- Dependencies: 262
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 264 (class 1259 OID 16582)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- TOC entry 263 (class 1259 OID 16555)
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- TOC entry 4707 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 279 (class 1259 OID 17014)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- TOC entry 280 (class 1259 OID 17028)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- TOC entry 321 (class 1259 OID 135115)
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- TOC entry 322 (class 1259 OID 135122)
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


ALTER TABLE supabase_migrations.seed_files OWNER TO postgres;

--
-- TOC entry 3703 (class 0 OID 0)
-- Name: messages_2025_07_18; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_07_18 FOR VALUES FROM ('2025-07-18 00:00:00') TO ('2025-07-19 00:00:00');


--
-- TOC entry 3704 (class 0 OID 0)
-- Name: messages_2025_07_19; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_07_19 FOR VALUES FROM ('2025-07-19 00:00:00') TO ('2025-07-20 00:00:00');


--
-- TOC entry 3705 (class 0 OID 0)
-- Name: messages_2025_07_20; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_07_20 FOR VALUES FROM ('2025-07-20 00:00:00') TO ('2025-07-21 00:00:00');


--
-- TOC entry 3706 (class 0 OID 0)
-- Name: messages_2025_07_21; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_07_21 FOR VALUES FROM ('2025-07-21 00:00:00') TO ('2025-07-22 00:00:00');


--
-- TOC entry 3707 (class 0 OID 0)
-- Name: messages_2025_07_22; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_07_22 FOR VALUES FROM ('2025-07-22 00:00:00') TO ('2025-07-23 00:00:00');


--
-- TOC entry 3708 (class 0 OID 0)
-- Name: messages_2025_07_23; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_07_23 FOR VALUES FROM ('2025-07-23 00:00:00') TO ('2025-07-24 00:00:00');


--
-- TOC entry 3709 (class 0 OID 0)
-- Name: messages_2025_07_24; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_07_24 FOR VALUES FROM ('2025-07-24 00:00:00') TO ('2025-07-25 00:00:00');


--
-- TOC entry 3719 (class 2604 OID 16504)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 3802 (class 2604 OID 92295)
-- Name: tracking_clicks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_clicks ALTER COLUMN id SET DEFAULT nextval('public.tracking_clicks_id_seq'::regclass);


--
-- TOC entry 4497 (class 0 OID 16519)
-- Dependencies: 260
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e2292603-11cc-48af-b133-d51879f15604', '{"action":"user_confirmation_requested","actor_id":"8bad478e-3eea-43ae-a441-1ff32ddb0c4e","actor_name":"osca","actor_username":"castillokase@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-04-17 19:45:07.210453+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c053de68-eb3d-488f-a33e-6b19f3b85210', '{"action":"user_signedup","actor_id":"8bad478e-3eea-43ae-a441-1ff32ddb0c4e","actor_name":"osca","actor_username":"castillokase@gmail.com","actor_via_sso":false,"log_type":"team"}', '2025-04-17 19:46:38.444222+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6ed45bdf-3b3b-4add-97c2-f92d61d5c451', '{"action":"login","actor_id":"8bad478e-3eea-43ae-a441-1ff32ddb0c4e","actor_name":"osca","actor_username":"castillokase@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-17 19:46:55.843124+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '98d68816-6185-4281-9546-b3407bbe2359', '{"action":"logout","actor_id":"8bad478e-3eea-43ae-a441-1ff32ddb0c4e","actor_name":"osca","actor_username":"castillokase@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-04-17 19:49:47.755221+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cc9450af-3e24-4502-9abc-2efaab0eb257', '{"action":"user_confirmation_requested","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-04-19 10:19:02.431972+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a55cda82-dc56-42df-b122-de39f42360c9', '{"action":"user_signedup","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"team"}', '2025-04-19 10:20:04.017129+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b030df4c-fe08-4978-a098-a5099d841429', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 10:20:26.220387+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b131987f-fc77-440c-a1a5-629a765b90a2', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 10:23:00.309104+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4a8b0455-638d-42d8-9457-1d616cd1bdbe', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 10:36:36.971045+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c5219145-6be8-4182-abf8-a82f1209965a', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-04-19 10:48:43.352074+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7833a15e-1b74-4d3c-b402-c67d48bcbef6', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 10:49:12.312754+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'af0b04cd-9016-410e-b8d6-6f37a39c8ef4', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-04-19 10:55:33.687004+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7834fd84-a92b-4044-b948-3c041d3cbe67', '{"action":"user_confirmation_requested","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-04-19 10:57:13.00495+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e7156759-8ed8-45ce-8727-5eb0b1728c53', '{"action":"user_signedup","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"team"}', '2025-04-19 10:57:36.424891+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '80fcd8f8-e88b-410e-b902-b75848425a1f', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 10:57:44.002084+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0e15051b-7fe2-48a9-8c93-ae49542f1e66', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-04-19 10:59:33.090856+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cca7df02-978b-45ea-b613-416b00e95af4', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 11:01:51.896101+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd54ef578-b4c2-46b0-91ac-7f12a25a436c', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-04-19 11:04:52.818569+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5629343a-5369-4179-95fa-756387ab07b5', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 11:05:13.487753+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'efdf33b0-f74f-4bac-a9cb-4588a8d43530', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-04-19 11:07:02.070783+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0de55526-15f4-4c6d-8adf-efcc551a4306', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 11:08:05.466447+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2504e896-cbd2-41b8-9341-c26382fbae49', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 11:33:33.476798+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '99727865-de97-445b-b7c1-33b92ad71bea', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-04-19 11:34:12.905783+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0b10863a-6584-44c0-9524-e9c2a6927fe7', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 11:34:30.94108+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2f5433a9-54c6-4ad8-a642-03df9185261b', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 11:41:09.969498+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b8c59274-fcfa-4248-8af0-8b9dbcc9abd0', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-19 12:59:52.013688+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a6ea9de8-cef2-4007-b0c8-f9d5fdfc884a', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-22 19:33:57.792054+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f04a7814-2f80-4aaf-9f36-e59b4f11ca11', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-04-22 19:34:43.234966+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7bd8fc01-c29e-4c08-9deb-74cfdeceb646', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-22 19:35:05.226261+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2226be4a-0223-4ebe-b7d9-893fa8959e60', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-04-22 19:36:31.805933+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0b1fecd5-d88d-4e60-97a4-e4babd38a547', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-26 15:50:46.01674+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '92f6e3cc-0f3d-4c1e-a2d2-69b39614466f', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-04-26 16:11:46.569545+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3804ff84-149e-422d-9872-062de1ebfaa3', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-11 13:57:52.562785+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '82b287f1-991e-415d-a43c-2e65911d46b2', '{"action":"token_refreshed","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-11 17:55:00.868268+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f67fce84-ffe6-4f25-9644-35a06936bfeb', '{"action":"token_revoked","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-11 17:55:00.873665+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '51c6246a-460a-4706-8c45-ac72a4b17f70', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 10:37:07.111719+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c62069e2-eeac-4a58-b297-1beded809add', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 13:56:20.831931+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2a677469-3ce9-45aa-9167-8d4e7a47bddc', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 14:07:40.700199+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd03b7179-525b-45a5-99ea-8c393bf1a630', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 14:11:41.117118+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9fbd8507-36d6-4e7d-8f2e-a6d0aa23a1bd', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 14:32:07.47754+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '37071310-732b-4e9b-9a5c-54f36eb1aa7a', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 14:40:42.356034+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '89ef710b-5d0b-4f2a-af44-96e9368a9fc8', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-18 14:40:57.545102+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0aaec9be-3c6e-4e66-8cbf-1bf3a6f0ab6f', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-18 14:42:55.436644+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '82ae29be-7918-4e98-95f7-bd5fc92b9d88', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-19 18:37:21.310302+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '875bbcdc-19f6-40b7-b870-71209d9666a1', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-19 18:42:52.289534+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd2c65e00-034a-4860-9a13-6141de3fa030', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-20 14:55:54.709798+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '51d643fb-049e-491c-ba2e-7a1e371586e9', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-20 15:15:25.035931+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '88315326-2812-47c2-81ab-c6e1b4e78682', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-20 15:18:00.483344+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cb54ea49-88b2-44c8-a2fc-8510e329799f', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-20 15:26:16.767666+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7b6c8ef5-8801-4216-ba61-1aaaac82b209', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-21 06:56:51.871921+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b2f9c6fe-444f-479d-8c46-bf210ad48a77', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-21 07:02:49.420485+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a0426e31-aa93-4f20-aeea-c8c79cc10b31', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-21 07:04:02.475115+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7e4a90d1-10fc-4b41-9618-8a51506fd010', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-22 18:34:46.009857+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b843ecbe-24c3-4f1f-ada4-44d7d117a093', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-22 18:39:18.026986+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9fdd684c-a7dd-44c6-b280-cd0ba24f9ed6', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 08:12:07.452555+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '56a864c6-829e-44ac-9495-1c2e20a6cb02', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-24 08:13:43.528611+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4a25509d-1ae2-4bde-a554-fac363527b83', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 08:13:56.656606+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1b831410-6118-478e-9770-bb1741e18b51', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 08:15:50.110791+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8ecd0730-677b-4daf-96ad-4cc311706af1', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-24 08:16:07.225674+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8260fe6e-0f87-4289-b051-ca701a7dd90d', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 08:16:26.467305+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cde7a631-6d7b-464e-9ef9-c7caf089dff9', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-24 08:17:57.756361+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c93a53ce-8051-44c4-94b9-0887e8a23e35', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 10:30:25.58352+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8210f223-985f-48d7-a8c7-72ddc273478d', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-24 10:34:17.924013+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3b4ef1b8-89f6-4ef6-906f-23203b14cd10', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 10:41:23.612789+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1e23c57e-2d46-4f98-937a-ad34142cadce', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 10:43:38.718625+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9bbe69e1-cb57-443e-8f39-319ca90217f4', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-24 10:44:50.037915+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a1f31d65-82b4-482e-b1da-915e62116d99', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 11:44:54.163313+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2107c696-8df8-4ff3-aae8-68e8c5774d48', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-24 11:46:11.001628+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '38bb3367-ef39-4603-990f-547b6303733c', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 15:40:16.883567+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ecdc3715-c983-4c40-9d69-8fc4a4c58f26', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-24 15:43:10.168133+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6e79acf4-c689-42b8-b3cd-2150abc605e2', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 15:43:21.514512+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '97b88cc9-77da-4085-9df6-fb0ad4e925db', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 15:51:20.387233+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '330ecc03-9c81-4cec-bb02-1c4ee1aae428', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 16:53:18.476522+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '368d1f8a-4157-4fa6-b357-8b18876a0830', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-24 16:53:39.42011+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e09f1a65-3f2a-4021-995b-ddd6f032bd55', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 16:54:06.394931+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '388e3e96-539c-4d05-9392-285b6414375c', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-24 16:59:35.958118+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd31e7174-4063-4aa2-b27e-aba4bd05d325', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 18:09:00.33669+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'da90aaf6-c631-48cf-909f-53b0d834e7d3', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-24 18:16:26.402248+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1e743972-3f69-4084-b5c8-f09901755594', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-01 09:49:20.797795+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f6ce9a10-0684-44da-8a11-c891c8be87d8', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-01 09:53:17.415893+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e3ea2007-f081-4b17-8b58-a9f7f051a398', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-01 09:53:28.628654+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bc2f463f-8964-48bc-9aab-ce5d3a26d7ed', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-01 10:15:59.200524+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '14b9dbf7-dafe-4b11-8a6f-ee84d2dc2c43', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-01 10:17:39.600662+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3702285b-0951-42ec-b8a1-a91d57ed0fb5', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-01 15:33:41.823609+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a6c8bf93-ed30-4810-8f4b-ff259d9ca32f', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-01 15:46:59.953933+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '814ff5f3-2116-4d78-a2b1-61d7c0043daa', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-01 15:58:09.862797+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e119fdf7-6613-4987-a7f8-e48dc1359663', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-01 19:50:05.340647+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9b9657e0-1394-4177-99ad-9300b6393dfa', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-01 19:53:47.255193+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f12489bc-4209-4e58-89cd-2b0d63f01923', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-02 15:55:30.85451+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '27d4fbfa-41dc-4141-ba3d-f1e4814f4e4e', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-02 19:55:35.05068+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '25f6debc-8a94-4006-8db7-8164c8289321', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-02 19:58:23.701187+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5975e6ed-2717-480a-8f74-aa9f90255690', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-03 17:15:13.521466+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '58a23e6d-8a51-48e1-be2e-af20344d9787', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-03 17:19:03.702408+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '909bdbc4-1a61-40a0-b9f7-31c35d6138bb', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-03 17:19:21.765416+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '967a5cec-c799-418e-8e34-0be7dba61344', '{"action":"token_refreshed","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-03 18:49:26.40327+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e82109b9-ecaf-4a82-98f7-9885cf1e1e70', '{"action":"token_revoked","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-03 18:49:26.405322+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd0fd29e8-f671-485d-a4be-fef361f99bd5', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-07 17:05:59.251387+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '54ab7483-af9b-45e1-9a51-ba5ded327606', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-07 17:13:04.355207+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '76add9fc-2e18-4a95-8764-3dc8666ef88b', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-07 17:56:28.01329+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ab07f99a-f44f-465e-ae74-dcd20bbc99d7', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-07 17:58:10.665259+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b65b3fef-6c8a-4e80-9a64-d8523f2eb43b', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-08 13:06:40.525762+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '223953db-0b05-44a3-a2ec-38a131a3ecee', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-08 13:11:48.134194+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '03a974ce-98bd-4158-8b81-17890005d04d', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-15 14:53:19.6946+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '47a18b8c-85fe-471c-8b9b-af031afcc097', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-15 14:55:52.836245+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c9e424ed-85f8-4b9b-bade-4b1644eae2e2', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-15 15:02:41.995826+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6b44c1ad-b0e5-41e2-bc5a-2a713b8e666c', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-15 15:09:25.463405+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4769f1dd-f61c-471a-9f3c-edf5d01d50da', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-15 15:14:40.792476+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bb3b3a48-5d90-43be-bafd-5a9482e2821d', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-17 18:53:23.842243+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2bdb49e8-793a-44ac-a377-93e170a70203', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 14:36:32.187013+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'eb659035-00b4-42f4-a26b-1682f86e5c9b', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 14:42:31.490244+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4fe80ab8-00a3-4e5c-98b4-c98ec6c8969a', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-21 14:43:23.974022+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2f407a29-e48b-46b3-94be-1a64a91aa450', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 14:44:03.497275+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7d3c3444-37c1-4cb2-862a-e758b73c8eec', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 14:51:24.833032+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '706b7f6c-5b3c-4c2c-87d2-f262b1f8ae7b', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 14:54:31.780726+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '496e9750-3fc9-42a6-b322-09e02800d946', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 14:56:39.570663+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3500ffc1-6a03-4da8-8430-893ec430ba13', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 15:06:04.865099+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1d0180e6-260d-4a9d-8b09-832de75a194d', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 15:08:31.103389+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd095e34b-a44d-4859-a171-14371659d29b', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 15:14:42.427833+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'dcf734de-b67b-483d-ba1c-f06d2dfe2781', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 15:16:39.106167+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8315e9d3-b65b-4542-8978-04e68f0a90bf', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 15:25:04.667308+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '305c50f8-f223-41d1-94d0-3403ade9e233', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 15:32:13.143297+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f68aed86-f511-470d-93e7-dab2ec56b4ea', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-21 15:36:10.095162+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a06aebf6-26be-4add-a15e-3b7b0bfba641', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-21 19:18:37.333416+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fdabbbd0-f9c6-42dd-9184-a63502b8c18d', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-21 19:22:27.514109+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd86aab38-38c1-42b9-a5fb-21e11382cf39', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 09:01:48.898365+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8a21cf51-4dc4-4082-bafb-e8ec3a76ccd2', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 09:05:30.052656+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '02849453-1fd1-4f44-b040-03f108ef223d', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 09:10:03.202832+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a0f7a1ec-43f8-4390-b766-ac40fd3d02ef', '{"action":"token_refreshed","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-22 10:57:18.30694+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9bde0f4a-14b5-4cd7-87ec-9615ef92f6be', '{"action":"token_revoked","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-22 10:57:18.308999+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c4527d4d-52be-426f-8ecf-2256bdcb7588', '{"action":"token_refreshed","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-22 10:57:20.829337+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7fec9032-afff-474e-a7d0-e57545568985', '{"action":"token_refreshed","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-22 10:57:43.037963+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '13702351-d3de-480f-89f5-73644dcae5f9', '{"action":"token_refreshed","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-22 10:57:44.844632+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cdd177db-9950-45bf-937c-50018b79228a', '{"action":"token_refreshed","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-22 10:57:45.884464+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5281fe89-5171-4ae8-bf78-472c18b80af8', '{"action":"token_refreshed","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-22 10:57:46.645355+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a7fe9c25-3a26-4b71-9933-04156076784c', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 11:00:14.636736+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '15bc413f-697c-49ff-824e-c0b03d6c8af0', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 11:04:19.424736+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a5ad7152-c182-422b-b803-1085ac07c067', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 11:36:18.641963+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2f58010a-bd2d-455e-a0e8-4d5a374712cc', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-22 11:42:41.984992+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '655812af-47be-4962-909f-2abb734b0662', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 11:47:39.862186+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '44b25eb0-b47b-4975-b191-9faf48dd879c', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-22 11:48:15.65214+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'af03b274-2267-49fd-a668-359684815aac', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 11:48:25.295286+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f290d709-8c3d-4e10-b83e-6fb137a14a56', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-22 11:49:20.432607+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a21c74b3-d1a1-4f91-8f68-abb39d4769ac', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 11:51:18.33614+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cd3f79d8-579f-4403-a423-446acbc33a76', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-22 11:56:52.932664+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ef85f429-fab1-4941-9e65-81d223b62e8f', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 12:08:33.138724+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7eda8b53-48ab-45cb-a66e-29065e042f47', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-22 12:14:07.943918+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e09db272-239d-4333-a4cd-136b2c597794', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 16:08:44.131785+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ade8d0d8-e64e-48f7-838d-b94a3ce1f8b3', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 16:20:01.717989+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8d305549-ba42-4450-a99d-76ceb0c31272', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 16:32:06.026661+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '56b2fd50-c5b1-4e13-8574-d0b4e1857698', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-22 16:35:20.743396+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8463cea8-ef0a-4a24-a5e6-bfdaab98c337', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-22 16:35:32.395668+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4c10c538-7000-4166-b79f-ef8a85fa6829', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-23 07:40:55.693299+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '26779681-5f03-46c6-ac44-f81dcf86e291', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-23 15:59:00.833506+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fa076cb4-b519-4ee5-a352-f1de1380e4e1', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-23 16:28:21.403914+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ab1666d3-e427-4766-b83f-6a6b7e51b636', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-23 16:40:21.619825+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1101c553-0e92-4c48-b8a8-cc1a023404f8', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-24 15:20:57.963378+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3aa6908d-2df9-40cb-9079-db3e13ec2988', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-24 15:23:09.323374+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6363c941-882f-40f9-a5ee-4d9c6c28a19e', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-24 15:28:03.996743+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5e23f30b-3e8f-47f2-a384-6715cabb6e7f', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-24 19:09:25.695541+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b08a3740-338b-4119-a7fd-5b238049dfb7', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-24 19:16:35.137633+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'df9aa0c3-420e-47ca-a655-20820c5419dd', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-24 19:19:11.388773+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f24b6f89-82b8-4e43-bc7a-bfa98d14a24d', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-24 19:24:40.885437+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b91aaf96-4a49-4683-aeaf-d1f7fbc8c26b', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-24 19:26:02.010329+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7a5ce743-7425-44ef-aa7e-ffe0f824b652', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-24 19:26:30.339527+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bdee4d10-40b2-4d4f-a5a1-78ae000baf45', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-24 19:55:24.597376+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '67f27a76-9087-438b-aa8b-8beff4fb4044', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-25 16:30:35.455288+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e58aa66b-8533-41d0-98ac-2ce7149b6600', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-25 16:39:09.132608+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9e0ede90-6b46-406d-bb2b-9e3b824886bc', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-25 16:58:18.438573+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd85deadb-73f5-46ba-8ae9-0225efcb3a69', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-25 16:58:53.489308+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '314ffb9f-c7cb-401f-bc83-59fe295de0a3', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-25 17:02:29.02733+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '71bd565e-61cd-4de0-a54e-53274d0fa09c', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-25 17:06:44.691483+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7958e29a-e9ae-4e22-9b02-b02ab44f82a9', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-25 20:16:50.463815+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7672ba43-28da-417e-a05b-9f1ead235da3', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-25 20:24:58.66594+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '65cddead-ec7c-4524-9031-1668b7c98842', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-26 07:02:57.381383+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '46c0722f-9594-4145-ab42-a15e9bff515a', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-26 07:07:22.867118+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9df8a7da-c842-4739-9f64-a6700ec42a6c', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-26 07:12:02.189593+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e4191fd1-9b81-4736-ac83-61abfc7adc6f', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-26 16:01:32.886491+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3a9d4426-a03b-4af6-8d14-de9a5d5fced6', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-26 16:03:50.858046+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'aae9d7df-af4c-4aae-beca-885f9964dcd7', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-26 16:28:03.350152+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ced02543-129a-4493-8ac5-3e7538719ed0', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-26 16:29:04.847782+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f4fd181b-5a30-4a25-bc1b-6440c2cdcf07', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-26 20:31:11.224452+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e88c6a9a-ede1-484a-801f-9827fffea016', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-26 20:33:46.320877+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f5a18816-a889-44d3-86b5-98ab3ed3c2f7', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-26 21:11:53.179048+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5085decc-8218-4c20-a4c9-2eacc7c844f6', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-26 21:14:48.613901+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ed031692-cf69-4fde-b426-b0b03b99f174', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 07:32:54.018256+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '10acf96c-c073-4ae6-9029-16fd9039b817', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 07:52:15.917963+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '52511be6-b104-4c34-8c6e-dbd77392f063', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-27 07:53:45.115392+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '13cef226-d252-4454-b182-0f5adcbec93b', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 11:52:19.82933+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9d1f7e80-a797-43aa-b370-781365fe0c69', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 12:09:02.301002+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f2f1a2cc-ad07-4688-ad54-2b1edd4bcb9e', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 12:13:43.474093+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0e6b9a85-f648-440e-af0d-c931b532587c', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 12:16:54.094773+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f1003099-be03-4687-a9c7-9aad2e338950', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-27 12:17:58.816222+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e549be6d-3c73-451a-a867-ba550c747e7b', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 12:18:10.757453+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4fdd9f8b-9665-4c3d-83b4-f193f4f344be', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 12:31:07.399746+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e30c0a71-1b73-47d4-955d-b3eceab1a3d1', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 13:43:04.951049+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e611f1b2-a5f4-4e68-a437-1cd1d22880d8', '{"action":"token_refreshed","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-27 15:47:15.513309+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ce1a6129-aca1-4cbd-b782-2f2d49b2c641', '{"action":"token_revoked","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-27 15:47:15.515415+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1af8a7b2-cb21-4c88-bc46-c7174499e021', '{"action":"token_refreshed","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-27 15:47:16.211264+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '86fc7fc4-8290-4d90-b9f4-ff03cf97249e', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-27 16:07:44.69126+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd0e4e29e-b8ba-4a29-9d21-1923b7fc5112', '{"action":"user_confirmation_requested","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-06-27 16:09:33.330033+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5a6555dd-2c7e-4325-b3b5-a3bb207d55b6', '{"action":"user_signedup","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"team"}', '2025-06-27 16:10:23.257679+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e68ea73f-74a6-4c7a-8a2b-62c97e246c50', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 16:10:35.564198+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b78845eb-9271-4bf3-ad04-d536aabe26b6', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 16:48:57.677683+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5c640bdb-d91a-4a4b-948c-762e592b6033', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 16:53:10.152161+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f52eca8c-6c15-4c67-beef-aba009e4dce0', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 16:58:33.353721+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bf218a47-e50b-4108-9115-fb81f5b12363', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 17:03:20.149915+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '42e0363b-b265-4ae8-887c-ecde9a6649f4', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 17:07:09.575283+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '20d321a6-aa1c-42cf-a9a5-83e1433635b5', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 17:11:32.537264+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '69d7c3c9-0cce-44eb-aa3c-ceabf5f57ed5', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 17:18:10.999358+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f5847091-e0c8-45fa-afc8-7f272bfd30aa', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 17:25:19.405607+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1397a9dd-a19a-4c29-a856-37941c743b37', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 17:28:17.475738+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0a16bc7a-793d-45bf-968a-f8c8648d6e31', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-27 17:29:42.570664+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '84b55aa5-a24e-4764-85a8-08eac39a9594', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 17:30:14.516519+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '33c6f032-f6a8-4660-a7df-9822f5321d16', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 17:48:49.055727+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f5d01d9e-62ad-4192-b5bb-264344eb2191', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-28 09:01:07.413198+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ef9dbee7-dbfc-4960-a092-085b94f47a4e', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-28 09:08:34.800819+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '25219b8c-82aa-473f-8ebe-ff12e12e5f17', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-28 12:54:50.541213+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '53720035-1374-4db4-8cfd-45033a1aac75', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-28 12:59:44.508666+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8ad2ef60-6ad3-4281-9985-d03bce6fe510', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-29 12:22:20.106622+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '58d6508a-6ddc-4d1f-9410-db0cf89f602f', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-29 12:25:16.155472+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7a9e5ee3-4b5c-4ba4-bf9e-4335b8806e42', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-29 12:26:30.168846+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd1180f70-cdb8-4ab2-ba61-2853f10c92d2', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-29 12:30:11.796138+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a59832dc-8f6b-47fe-b4fd-e85e7dc9bf6a', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-29 14:08:53.905345+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '85da9db3-39ec-4e1c-9065-df84dc30bc4f', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-29 14:12:34.031388+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '798bfa33-56bc-474f-be38-d314554b5fb8', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-29 14:23:38.73967+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd8415632-9a5e-4d7c-b6ab-edacd093de30', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-29 14:25:45.441828+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '289dddac-dd9b-40fc-a7b7-3d0d65950be7', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-29 15:14:02.749708+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '214b1c4c-a100-42fd-a6dc-b2e9cd146e1f', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-29 15:25:46.581886+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '10c50e5a-3040-4b33-952f-b165067c9b91', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-29 15:31:45.081738+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '84fa1e24-9651-46e1-b895-9ae68b608302', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-29 15:41:20.488315+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9f6a7b8c-b5b6-4ad8-8841-2d5afea38beb', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-30 09:46:29.211624+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3b2fa4f5-04e0-47c9-b8e7-ea60d0f91d28', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-30 09:54:28.201456+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9c63c8fb-47b4-419c-8a79-7f356e16325b', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-30 09:56:20.907036+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '85508550-abd2-45ff-9e32-798a9495bbec', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-30 09:57:53.429609+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b0911fea-9ac5-4c40-a70e-19a54fca6b33', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-30 10:03:46.689453+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '49069a5c-90ec-4516-b9cd-e3d84b583fec', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-30 10:20:33.594141+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5306c529-199f-4675-8da5-752a5cd17d9b', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-30 13:16:49.634085+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a8294e2f-68e7-4fc7-ab95-691ec1b87553', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-30 13:45:16.201098+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1ff5dc14-3a05-49ef-8a35-2c62c652684a', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-30 14:04:23.537064+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '99d7871d-8b52-42dc-ac85-1af66b24a6eb', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-30 15:00:00.670286+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '026ab9c6-6f29-4f2e-a123-4f00aa520ed9', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-30 15:58:03.235943+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f6d0227f-870b-4397-9285-d2e17da2fb5d', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-30 15:58:54.748733+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '125c5fd8-2bf3-4913-88f0-2f3f10533a97', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-30 18:59:29.512564+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd55c1613-cc3b-4aa8-962c-579f0320701e', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-30 19:04:50.739832+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ea3e58bf-5fa6-4b25-98ee-8aebf802d7ac', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-30 19:08:56.90874+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '69cb74f9-9530-499f-93bc-6e328dd9fb53', '{"action":"token_refreshed","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-30 20:11:23.882396+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'caa7cd5a-92f5-41e2-832e-e60970e41e54', '{"action":"token_revoked","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-30 20:11:23.885715+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'be836e14-1f87-41de-a9d7-09f3680721a0', '{"action":"token_refreshed","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-01 09:03:37.836284+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6f6fa996-22f1-4d01-9b08-0cecb053fb4e', '{"action":"token_revoked","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-01 09:03:37.856268+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1bbb90f2-e165-46e6-af2f-99cfe9924101', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-01 09:12:06.242278+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5ced7bd0-7e48-4bd7-ae29-609180a051ac', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-01 09:35:07.798261+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3202bfb2-3d02-40a0-9aef-76acd6ca47e2', '{"action":"token_refreshed","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-01 12:38:14.856213+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '88f17c62-9945-4a20-9586-8b7394c90e72', '{"action":"token_revoked","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-01 12:38:14.859271+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '10c73d76-cef7-4769-be69-8621a45eb4c7', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-01 12:40:41.268523+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '906ec3ce-8abb-4311-b02a-a4680c04405e', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-01 16:01:57.069587+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1471cea8-cb4a-4cb2-8d7a-7e4b2ce68739', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-01 16:32:18.258866+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '47485969-7324-492f-b23d-16c3c6b75a6b', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-01 16:40:42.62284+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bff49bfe-4ef0-476c-bc70-05b43fec3031', '{"action":"token_refreshed","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-01 19:57:30.818337+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a9b872d2-350f-4bd0-86fc-c6b8d9bb880d', '{"action":"token_revoked","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-01 19:57:30.824428+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a8f287ff-d71c-4084-87c2-c3300af5dec3', '{"action":"token_refreshed","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-02 10:33:25.239039+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9e798a9a-3ae0-4ee6-9275-979e0a88fae0', '{"action":"token_revoked","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-02 10:33:25.262802+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a797ae4d-81ae-4156-9c28-6c34afd3a216', '{"action":"token_refreshed","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-03 08:05:54.546566+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'eff0b44b-ebfd-4d46-98c5-2bd1fb1787e6', '{"action":"token_revoked","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-03 08:05:54.55591+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7cf21d65-7ca8-4ef0-b370-68565abd5d38', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-03 08:06:07.976923+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ee55fa64-0f72-4c1c-9722-334f93c805e0', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-03 15:26:10.62031+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '001b3de7-988b-4699-8049-f97b5f59c8be', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-03 15:26:58.086163+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b0251c53-e694-41e5-9923-10d624c0e593', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-03 15:27:08.894645+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ccf5c474-a642-4f24-84da-e2b6169e9a6e', '{"action":"token_refreshed","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-03 18:11:01.939397+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b3e5a389-5440-4fc4-b969-245d6bdfd8d5', '{"action":"token_revoked","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-03 18:11:01.942811+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2f501315-6cbf-4cde-8011-33bcbf0dccd6', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-03 18:21:26.160436+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6db4b916-7b11-4c02-abf7-e03b34b18790', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-04 07:54:30.602643+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '63422b4d-154e-4f3c-bda6-9eefe0bfc8de', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-04 07:57:03.142078+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '341e385f-c32d-4192-a4a5-db66f1582d76', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-05 10:52:56.956232+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '66bb0778-9713-4e60-852a-0ad0a69d4882', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-05 11:18:04.647364+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '658b7b85-21be-4fdd-b9c9-a0d0e13c4110', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-05 14:00:05.543619+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0df64975-8540-405d-b30a-0ba5db8cccb2', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-05 14:01:23.313366+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9c4713eb-a5d1-4f06-be88-b8b7c49fbb9d', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-06 13:46:18.24002+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a8efe46c-d2df-4183-acc6-b56c2a5f23a9', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-06 13:51:16.173048+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0ab28930-c4ad-4521-aafb-81e8dd62d517', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-06 18:09:42.330751+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd2bfae17-d075-488e-bf44-8c3a90152739', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-06 18:21:18.912178+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '38c9de6c-f866-401a-9691-d6fa4bd5ee31', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-07 10:05:16.174945+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'babf28da-abb0-48f5-9aa3-75d8e2f83e67', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-07 10:48:40.425012+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5769c2d0-5378-487d-aa7c-799d8a15d1bc', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-07 10:48:55.533443+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1fad9495-f0da-4dcc-9651-81dd5a47077f', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-07 10:49:30.548115+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'eeeb7cac-e193-4789-b642-9fded103d2e8', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-07 14:10:13.649046+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '938a754e-0f9b-44df-917e-c44a5c81a11d', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-07 14:12:44.769579+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1a4a09fe-d432-467c-8bf5-ae04a37232fd', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-09 16:41:49.943377+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '11c598fe-89d1-4406-a072-85cb5a3f7b16', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-09 16:45:52.941809+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd7ff4aa6-824d-40b5-80e2-a7a78d312a2a', '{"action":"login","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-10 17:38:57.035759+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a802252d-4806-463b-86f4-5f5522dcbd4f', '{"action":"logout","actor_id":"603f5f0f-cf02-43d1-a032-14aa486fa6f4","actor_name":"jnino","actor_username":"jninopina12@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-10 17:44:29.395448+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '94fda755-45fa-42a1-9098-425a446d1824', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-14 16:12:42.445363+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5bba26d9-e02c-4db7-83ae-ea4adf7f48c8', '{"action":"token_refreshed","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-15 17:46:45.847205+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9e1fa658-dbde-43c9-9e9a-fd782d9ac9f3', '{"action":"token_revoked","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-15 17:46:45.865448+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2c31ecdf-e150-4fe0-b836-11092ae34019', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-15 17:48:11.054039+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2005d466-bd85-48b3-ae8b-a6ff937487d4', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-15 17:48:25.85302+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b8b4a09f-f554-484d-bfcd-1d6b864d6f6e', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-15 17:54:35.387283+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ef5cb561-3e24-4f25-9489-c46b57ce8c2f', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-17 13:14:49.034933+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c20d4a67-f019-4132-b997-a75b32168f08', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-17 13:55:36.360193+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fa16f3cd-48ea-4a41-b9c5-1cb995d3b032', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-18 07:50:13.74411+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bb871c0e-314e-4d6d-b8d3-3d9df933cf03', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-18 07:55:58.177078+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '09f984b4-09d2-41a1-842f-a74828a01c5f', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-18 16:25:26.037583+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '69ba92ce-b6f8-4369-9a88-c180b0e4852d', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-18 16:28:33.197673+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '000720ef-a1c9-46e1-abe6-17fd64c0c535', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 10:48:00.17619+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7d8549e2-8086-42ea-89e6-8ea6f139eb9d', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-19 11:25:59.979712+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5978652a-e3d5-41c8-82d0-b3f1fc4eed4a', '{"action":"login","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 12:09:05.758277+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fe8a8827-de55-4652-a12b-67ae3c05503b', '{"action":"logout","actor_id":"76f5271f-04cc-4747-afbe-e9398303f4a4","actor_name":"livi","actor_username":"mindocraf@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-19 12:10:50.457347+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '06ed2551-dd0c-43a4-ac74-239058f23ef1', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-21 20:54:00.428411+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8940fdf0-ca96-4a83-8d2c-b1f6f9ff47fa', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-21 21:04:37.222813+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3a30b4a8-ee43-4d69-8d6f-b4837201711b', '{"action":"login","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-21 21:06:19.243397+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ed0d729c-d57c-4bdb-b9b9-3c9eb7d684a3', '{"action":"logout","actor_id":"a3c10914-83f7-40c3-b946-9b21c252d203","actor_name":"osca","actor_username":"mottfreak@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-21 21:11:31.78724+00', '');


--
-- TOC entry 4511 (class 0 OID 16907)
-- Dependencies: 277
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('84630111-1e87-47e6-a02f-2a3e0f14693d', '8bad478e-3eea-43ae-a441-1ff32ddb0c4e', '78ea06ec-043f-469e-a1cb-276a2efb578e', 's256', 'Zv4cQzqUReMBQeJ8h5zr9TVf5XdXBQBxEp3ZcNgLIFk', 'email', '', '', '2025-04-17 19:45:07.213061+00', '2025-04-17 19:46:38.453242+00', 'email/signup', '2025-04-17 19:46:38.4532+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('7a00220b-09c3-4c18-944c-ab1531bd75cb', '76f5271f-04cc-4747-afbe-e9398303f4a4', '6055596b-6857-424e-aaa4-e96d4de43fcf', 's256', 'D3P8Ful-Z8DjJYJ_mCqpDS1qxFEI1ETqM_z-YV8u0MI', 'email', '', '', '2025-04-19 10:19:02.436157+00', '2025-04-19 10:20:04.027848+00', 'email/signup', '2025-04-19 10:20:04.027811+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('6e6abf53-8fad-4843-a7d9-85631fbf4cd9', 'a3c10914-83f7-40c3-b946-9b21c252d203', '5a86fadb-6761-40e1-b36c-fb3ac77c6e2b', 's256', '0qUJ59t1KqZD-6yzgzDPbu53KyeDgTagAEvrdebth_s', 'email', '', '', '2025-04-19 10:57:13.006322+00', '2025-04-19 10:57:36.430901+00', 'email/signup', '2025-04-19 10:57:36.430867+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('04b8366a-8d9c-4a3b-93be-662b8f01adc6', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', '67b25a91-70df-4011-b874-90d5daf28333', 's256', 'l_jgjKdYXYcIFCyQswN-JUK2sASTn6RdRU9tsbT66EQ', 'email', '', '', '2025-06-27 16:09:33.331147+00', '2025-06-27 16:10:23.266582+00', 'email/signup', '2025-06-27 16:10:23.266545+00');


--
-- TOC entry 4502 (class 0 OID 16704)
-- Dependencies: 268
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('8bad478e-3eea-43ae-a441-1ff32ddb0c4e', '8bad478e-3eea-43ae-a441-1ff32ddb0c4e', '{"sub": "8bad478e-3eea-43ae-a441-1ff32ddb0c4e", "email": "castillokase@gmail.com", "username": "castillokase@gmail.com", "full_name": "osca", "email_verified": true, "phone_verified": false}', 'email', '2025-04-17 19:45:07.2052+00', '2025-04-17 19:45:07.205254+00', '2025-04-17 19:45:07.205254+00', 'b4b5212b-b216-4660-ab45-836bbe34ec58');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('76f5271f-04cc-4747-afbe-e9398303f4a4', '76f5271f-04cc-4747-afbe-e9398303f4a4', '{"sub": "76f5271f-04cc-4747-afbe-e9398303f4a4", "email": "mindocraf@gmail.com", "username": "vedroxgt", "full_name": "livi", "email_verified": true, "phone_verified": false}', 'email', '2025-04-19 10:19:02.424073+00', '2025-04-19 10:19:02.424122+00', '2025-04-19 10:19:02.424122+00', '5ee0ee3a-087f-485a-8e98-f7ee4f5e85ac');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('a3c10914-83f7-40c3-b946-9b21c252d203', 'a3c10914-83f7-40c3-b946-9b21c252d203', '{"sub": "a3c10914-83f7-40c3-b946-9b21c252d203", "email": "mottfreak@gmail.com", "username": "Jnin_91512", "full_name": "osca", "email_verified": true, "phone_verified": false}', 'email', '2025-04-19 10:57:13.001189+00', '2025-04-19 10:57:13.001246+00', '2025-04-19 10:57:13.001246+00', 'e053138a-64b9-43a3-b581-1aee53f631a3');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('603f5f0f-cf02-43d1-a032-14aa486fa6f4', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', '{"sub": "603f5f0f-cf02-43d1-a032-14aa486fa6f4", "email": "jninopina12@gmail.com", "username": "AdminJ", "full_name": "jnino", "email_verified": true, "phone_verified": false}', 'email', '2025-06-27 16:09:33.327295+00', '2025-06-27 16:09:33.327354+00', '2025-06-27 16:09:33.327354+00', '79c15a92-b465-4e0f-a275-dddc71bbb736');


--
-- TOC entry 4496 (class 0 OID 16512)
-- Dependencies: 259
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 4506 (class 0 OID 16794)
-- Dependencies: 272
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 4505 (class 0 OID 16782)
-- Dependencies: 271
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 4504 (class 0 OID 16769)
-- Dependencies: 270
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 4512 (class 0 OID 16957)
-- Dependencies: 278
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 4495 (class 0 OID 16501)
-- Dependencies: 258
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 4509 (class 0 OID 16836)
-- Dependencies: 275
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 4510 (class 0 OID 16854)
-- Dependencies: 276
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 4498 (class 0 OID 16527)
-- Dependencies: 261
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.schema_migrations (version) VALUES ('20171026211738');
INSERT INTO auth.schema_migrations (version) VALUES ('20171026211808');
INSERT INTO auth.schema_migrations (version) VALUES ('20171026211834');
INSERT INTO auth.schema_migrations (version) VALUES ('20180103212743');
INSERT INTO auth.schema_migrations (version) VALUES ('20180108183307');
INSERT INTO auth.schema_migrations (version) VALUES ('20180119214651');
INSERT INTO auth.schema_migrations (version) VALUES ('20180125194653');
INSERT INTO auth.schema_migrations (version) VALUES ('00');
INSERT INTO auth.schema_migrations (version) VALUES ('20210710035447');
INSERT INTO auth.schema_migrations (version) VALUES ('20210722035447');
INSERT INTO auth.schema_migrations (version) VALUES ('20210730183235');
INSERT INTO auth.schema_migrations (version) VALUES ('20210909172000');
INSERT INTO auth.schema_migrations (version) VALUES ('20210927181326');
INSERT INTO auth.schema_migrations (version) VALUES ('20211122151130');
INSERT INTO auth.schema_migrations (version) VALUES ('20211124214934');
INSERT INTO auth.schema_migrations (version) VALUES ('20211202183645');
INSERT INTO auth.schema_migrations (version) VALUES ('20220114185221');
INSERT INTO auth.schema_migrations (version) VALUES ('20220114185340');
INSERT INTO auth.schema_migrations (version) VALUES ('20220224000811');
INSERT INTO auth.schema_migrations (version) VALUES ('20220323170000');
INSERT INTO auth.schema_migrations (version) VALUES ('20220429102000');
INSERT INTO auth.schema_migrations (version) VALUES ('20220531120530');
INSERT INTO auth.schema_migrations (version) VALUES ('20220614074223');
INSERT INTO auth.schema_migrations (version) VALUES ('20220811173540');
INSERT INTO auth.schema_migrations (version) VALUES ('20221003041349');
INSERT INTO auth.schema_migrations (version) VALUES ('20221003041400');
INSERT INTO auth.schema_migrations (version) VALUES ('20221011041400');
INSERT INTO auth.schema_migrations (version) VALUES ('20221020193600');
INSERT INTO auth.schema_migrations (version) VALUES ('20221021073300');
INSERT INTO auth.schema_migrations (version) VALUES ('20221021082433');
INSERT INTO auth.schema_migrations (version) VALUES ('20221027105023');
INSERT INTO auth.schema_migrations (version) VALUES ('20221114143122');
INSERT INTO auth.schema_migrations (version) VALUES ('20221114143410');
INSERT INTO auth.schema_migrations (version) VALUES ('20221125140132');
INSERT INTO auth.schema_migrations (version) VALUES ('20221208132122');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195500');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195800');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195900');
INSERT INTO auth.schema_migrations (version) VALUES ('20230116124310');
INSERT INTO auth.schema_migrations (version) VALUES ('20230116124412');
INSERT INTO auth.schema_migrations (version) VALUES ('20230131181311');
INSERT INTO auth.schema_migrations (version) VALUES ('20230322519590');
INSERT INTO auth.schema_migrations (version) VALUES ('20230402418590');
INSERT INTO auth.schema_migrations (version) VALUES ('20230411005111');
INSERT INTO auth.schema_migrations (version) VALUES ('20230508135423');
INSERT INTO auth.schema_migrations (version) VALUES ('20230523124323');
INSERT INTO auth.schema_migrations (version) VALUES ('20230818113222');
INSERT INTO auth.schema_migrations (version) VALUES ('20230914180801');
INSERT INTO auth.schema_migrations (version) VALUES ('20231027141322');
INSERT INTO auth.schema_migrations (version) VALUES ('20231114161723');
INSERT INTO auth.schema_migrations (version) VALUES ('20231117164230');
INSERT INTO auth.schema_migrations (version) VALUES ('20240115144230');
INSERT INTO auth.schema_migrations (version) VALUES ('20240214120130');
INSERT INTO auth.schema_migrations (version) VALUES ('20240306115329');
INSERT INTO auth.schema_migrations (version) VALUES ('20240314092811');
INSERT INTO auth.schema_migrations (version) VALUES ('20240427152123');
INSERT INTO auth.schema_migrations (version) VALUES ('20240612123726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240729123726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240802193726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240806073726');
INSERT INTO auth.schema_migrations (version) VALUES ('20241009103726');


--
-- TOC entry 4503 (class 0 OID 16734)
-- Dependencies: 269
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 4508 (class 0 OID 16821)
-- Dependencies: 274
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 4507 (class 0 OID 16812)
-- Dependencies: 273
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 4493 (class 0 OID 16489)
-- Dependencies: 256
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '8bad478e-3eea-43ae-a441-1ff32ddb0c4e', 'authenticated', 'authenticated', 'castillokase@gmail.com', '$2a$10$VGUq53HaKGTqFsO32O7uKu2H0yXOZMgJDqt8rZkIuIssZE.i0SBGC', '2025-04-17 19:46:38.445047+00', NULL, '', '2025-04-17 19:45:07.217817+00', '', NULL, '', '', NULL, '2025-04-17 19:46:55.843868+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "8bad478e-3eea-43ae-a441-1ff32ddb0c4e", "email": "castillokase@gmail.com", "username": "castillokase@gmail.com", "full_name": "osca", "email_verified": true, "phone_verified": false}', NULL, '2025-04-17 19:45:07.184479+00', '2025-04-17 19:46:55.852178+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '76f5271f-04cc-4747-afbe-e9398303f4a4', 'authenticated', 'authenticated', 'mindocraf@gmail.com', '$2a$10$HTcXfxTpu7Ky1/2XTlfTXegoL3SEKCL5KnXGReVzFVnRWSobt696G', '2025-04-19 10:20:04.018012+00', NULL, '', '2025-04-19 10:19:02.448634+00', '', NULL, '', '', NULL, '2025-07-19 12:09:05.77059+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "76f5271f-04cc-4747-afbe-e9398303f4a4", "email": "mindocraf@gmail.com", "username": "vedroxgt", "full_name": "livi", "email_verified": true, "phone_verified": false}', NULL, '2025-04-19 10:19:02.392133+00', '2025-07-19 12:09:05.784885+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', 'a3c10914-83f7-40c3-b946-9b21c252d203', 'authenticated', 'authenticated', 'mottfreak@gmail.com', '$2a$10$IQsN5EbZnNDjYAHJTfI53.NnVeLMNoJQ91hMcKHSfCkjI1Q52s0ra', '2025-04-19 10:57:36.425488+00', NULL, '', '2025-04-19 10:57:13.008296+00', '', NULL, '', '', NULL, '2025-07-21 21:06:19.251307+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "a3c10914-83f7-40c3-b946-9b21c252d203", "email": "mottfreak@gmail.com", "username": "Jnin_91512", "full_name": "osca", "email_verified": true, "phone_verified": false}', NULL, '2025-04-19 10:57:12.987025+00', '2025-07-21 21:06:19.26382+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', 'authenticated', 'authenticated', 'jninopina12@gmail.com', '$2a$10$cr/XYQTQEALQm4pYBNcsEOFtk8287VAIN8zIbKRMlx3.Ee9xmVo/u', '2025-06-27 16:10:23.260187+00', NULL, '', '2025-06-27 16:09:33.338731+00', '', NULL, '', '', NULL, '2025-07-10 17:38:57.060384+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "603f5f0f-cf02-43d1-a032-14aa486fa6f4", "email": "jninopina12@gmail.com", "username": "AdminJ", "full_name": "jnino", "email_verified": true, "phone_verified": false}', NULL, '2025-06-27 16:09:33.314122+00', '2025-07-10 17:38:57.090772+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- TOC entry 4539 (class 0 OID 115702)
-- Dependencies: 309
-- Data for Name: affiliate_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.affiliate_tokens (id, store_id, store_domain, affiliate_url, cookies, created_at) VALUES ('775e47dc-e6bd-40a3-81f7-58fde827555c', 'be03e95e-857e-486d-9bc8-26e5e28ac4e8', 'aliexpress.com', 'https://s.click.aliexpress.com/deep_link.htm?aff_short_key=xxxx', '[]', '2025-07-11 18:26:28.483938+00');
INSERT INTO public.affiliate_tokens (id, store_id, store_domain, affiliate_url, cookies, created_at) VALUES ('e9034af2-9902-41d6-b177-9dca27fdcce8', '617989cd-d451-4cda-993a-4643b919bd3a', 'amazon.es', '  https://www.amazon.es/?&linkCode=ll2&tag=cuponomics-21&language=es_ES&ref_=as_li_ss_tl', '[]', '2025-07-11 18:26:28.483938+00');


--
-- TOC entry 4547 (class 0 OID 129408)
-- Dependencies: 317
-- Data for Name: banner_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4546 (class 0 OID 129348)
-- Dependencies: 316
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4545 (class 0 OID 129300)
-- Dependencies: 315
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4523 (class 0 OID 17225)
-- Dependencies: 289
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories (id, name, slug, description, parent_id, created_at) VALUES ('ac96335b-eda0-4e84-8ad3-d81be8405bc9', 'Moda', 'moda', 'Ropa, calzado y accesorios', NULL, '2025-07-17 15:44:56.825088+00');
INSERT INTO public.categories (id, name, slug, description, parent_id, created_at) VALUES ('998c3519-f3e7-48fa-81de-d0c0ceecb2bb', 'Tecnología', 'tecnologia', 'Electrónica, gadgets y computadoras', NULL, '2025-07-17 15:44:56.825088+00');
INSERT INTO public.categories (id, name, slug, description, parent_id, created_at) VALUES ('a155a163-9b21-4513-a6a8-caf36bb9d41f', 'Hogar', 'hogar', 'Muebles, decoración y electrodomésticos', NULL, '2025-07-17 15:44:56.825088+00');
INSERT INTO public.categories (id, name, slug, description, parent_id, created_at) VALUES ('a935f5a1-07f9-48e2-86ad-e0a3e4afb53c', 'Belleza', 'belleza', 'Cosméticos y cuidado personal', NULL, '2025-07-17 15:44:56.825088+00');
INSERT INTO public.categories (id, name, slug, description, parent_id, created_at) VALUES ('5a231767-b537-4cd7-abdd-b212b7c0211b', 'Deportes', 'deportes', 'Artículos deportivos y fitness', NULL, '2025-07-17 15:44:56.825088+00');


--
-- TOC entry 4522 (class 0 OID 17210)
-- Dependencies: 288
-- Data for Name: coupon_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4518 (class 0 OID 17126)
-- Dependencies: 284
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.coupons (id, store_id, title, description, code, discount_value, discount_type, start_date, expiry_date, terms_conditions, coupon_type, is_verified, is_active, created_at, updated_at, coupon_url, coupon_category) VALUES ('4ea93bf4-a9c3-4c36-a379-61f6947b2d97', '617989cd-d451-4cda-993a-4643b919bd3a', 'Envio gratis depsues de 20 euros', NULL, 'Cuponnomicsprove10', 20, 'free_shipping', '2025-04-19 00:00:00+00', '2025-04-30 00:00:00+00', NULL, 'free_shipping', false, true, '2025-04-26 16:02:26.998698+00', '2025-05-11 11:29:44.205934+00', NULL, NULL);
INSERT INTO public.coupons (id, store_id, title, description, code, discount_value, discount_type, start_date, expiry_date, terms_conditions, coupon_type, is_verified, is_active, created_at, updated_at, coupon_url, coupon_category) VALUES ('87adaa56-7acf-4937-9cee-46c70ff649bc', '6af6b221-7c0c-4560-a25f-718428b5119b', 'rere', '', 'ddsd', 10, 'percentage', NULL, '2025-07-25 18:32:00+00', NULL, 'code', false, true, '2025-06-30 14:34:29.621475+00', '2025-06-30 14:34:29.621475+00', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL);
INSERT INTO public.coupons (id, store_id, title, description, code, discount_value, discount_type, start_date, expiry_date, terms_conditions, coupon_type, is_verified, is_active, created_at, updated_at, coupon_url, coupon_category) VALUES ('839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', '6af6b221-7c0c-4560-a25f-718428b5119b', 'sa', '', '', 23, 'percentage', NULL, '2025-07-25 15:11:00+00', NULL, 'deal', false, true, '2025-07-05 11:07:01.165489+00', '2025-07-05 11:07:01.165489+00', 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7', NULL);
INSERT INTO public.coupons (id, store_id, title, description, code, discount_value, discount_type, start_date, expiry_date, terms_conditions, coupon_type, is_verified, is_active, created_at, updated_at, coupon_url, coupon_category) VALUES ('0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', '617989cd-d451-4cda-993a-4643b919bd3a', 'Ofertas de vrano', 's', NULL, NULL, 'free_shipping', '2025-04-28 00:00:00+00', '2025-08-14 00:00:00+00', NULL, 'deal', false, true, '2025-05-24 16:55:24.659616+00', '2025-07-19 10:49:22.052587+00', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', NULL);
INSERT INTO public.coupons (id, store_id, title, description, code, discount_value, discount_type, start_date, expiry_date, terms_conditions, coupon_type, is_verified, is_active, created_at, updated_at, coupon_url, coupon_category) VALUES ('f62417ae-b4f8-4cdf-97a4-ce90a8cc6e63', 'be03e95e-857e-486d-9bc8-26e5e28ac4e8', '87%', '', '182542', 87, 'percentage', NULL, '2025-07-30 11:09:00+00', NULL, 'code', false, true, '2025-07-19 11:08:21.161992+00', '2025-07-19 11:08:21.161992+00', 'https://www.amazon.es', NULL);
INSERT INTO public.coupons (id, store_id, title, description, code, discount_value, discount_type, start_date, expiry_date, terms_conditions, coupon_type, is_verified, is_active, created_at, updated_at, coupon_url, coupon_category) VALUES ('d993e569-a295-4515-aa89-1b353b5bc050', 'be03e95e-857e-486d-9bc8-26e5e28ac4e8', 'de', '', '', 5, 'fixed', NULL, '2025-07-31 13:10:00+00', NULL, 'deal', false, true, '2025-07-19 12:09:54.991458+00', '2025-07-19 12:09:54.991458+00', 'https://www.amazon.es', 'Salud');


--
-- TOC entry 4527 (class 0 OID 18576)
-- Dependencies: 297
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4538 (class 0 OID 110105)
-- Dependencies: 308
-- Data for Name: page_views; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4534 (class 0 OID 97430)
-- Dependencies: 304
-- Data for Name: payment_reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4528 (class 0 OID 67738)
-- Dependencies: 298
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (id, store_id, name, description, price, sale_price, image_url, product_url, category, tags, is_new, is_featured, stock_quantity, created_at, updated_at, start_date, end_date, status) VALUES ('eed3b7f9-f491-43c6-8045-afcd3ec939f5', '617989cd-d451-4cda-993a-4643b919bd3a', 'oscar', 'hhhhhhhjjjjjjj', 30.00, 10.00, 'https://tkndbcwyojivwfasbemv.supabase.co/storage/v1/object/public/products/store_617989cd-d451-4cda-993a-4643b919bd3a/2e710ffe-1a67-4ed2-9724-509402159ec2.png', 'https://www.youtube.com/watch?v=iK7eHDMJUZ4&list=PLjze7Ix_AWP2hpgR--RddqHXksxkjOAG_', 'Alimentos', '{ju}', true, false, 8, '2025-06-01 15:48:05.377417+00', '2025-06-01 15:48:05.377417+00', '2025-06-18 22:00:00+00', '2025-06-29 22:00:00+00', 'active');


--
-- TOC entry 4515 (class 0 OID 17071)
-- Dependencies: 281
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.profiles (id, username, full_name, avatar_url, email, role, created_at, updated_at) VALUES ('8bad478e-3eea-43ae-a441-1ff32ddb0c4e', NULL, NULL, NULL, 'castillokase@gmail.com', 'merchant', '2025-04-17 19:46:56.699603+00', '2025-04-19 10:27:18.528446+00');
INSERT INTO public.profiles (id, username, full_name, avatar_url, email, role, created_at, updated_at) VALUES ('a3c10914-83f7-40c3-b946-9b21c252d203', 'Jnin_91512', 'osca', NULL, 'mottfreak@gmail.com', 'admin', '2025-04-19 10:57:12.98666+00', '2025-04-19 10:58:45.767622+00');
INSERT INTO public.profiles (id, username, full_name, avatar_url, email, role, created_at, updated_at) VALUES ('76f5271f-04cc-4747-afbe-e9398303f4a4', 'vedroxgt', 'livi', NULL, 'mindocraf@gmail.com', 'merchant', '2025-04-19 10:19:02.389673+00', '2025-04-19 11:05:37.169973+00');
INSERT INTO public.profiles (id, username, full_name, avatar_url, email, role, created_at, updated_at) VALUES ('603f5f0f-cf02-43d1-a032-14aa486fa6f4', 'AdminJ', 'jnino', NULL, 'jninopina12@gmail.com', 'merchant', '2025-06-27 16:09:33.313791+00', '2025-06-27 16:12:59.528272+00');


--
-- TOC entry 4521 (class 0 OID 17190)
-- Dependencies: 287
-- Data for Name: rating_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4520 (class 0 OID 17168)
-- Dependencies: 286
-- Data for Name: rating_votes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4519 (class 0 OID 17145)
-- Dependencies: 285
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4537 (class 0 OID 97552)
-- Dependencies: 307
-- Data for Name: script_pings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4516 (class 0 OID 17091)
-- Dependencies: 282
-- Data for Name: store_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.store_applications (id, user_id, store_name, description, website, logo_url, category, contact_email, contact_phone, address, status, admin_notes, created_at, updated_at, ecommerce_platform, is_exclusive_brand, commission, accepted_terms, additional_info, business_type, contact_name, store_description) VALUES ('dfaa819c-cbf6-4fe5-9f59-bb563d02e3d4', '76f5271f-04cc-4747-afbe-e9398303f4a4', 'Aliexpress', '', 'https://es.aliexpress.com/', 'https://tkndbcwyojivwfasbemv.supabase.co/storage/v1/object/public/public/stores/53125969-b0d4-4030-bc84-4f0a5fe23366.png', 'moda', 'Mindocraf@gmail.com', '*', 's', 'approved', 'Solicitud aprobada', '2025-05-24 08:13:37.385183+00', '2025-05-24 16:53:30.587332+00', NULL, NULL, 7.50, NULL, NULL, NULL, NULL, NULL);


--
-- TOC entry 4517 (class 0 OID 17108)
-- Dependencies: 283
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.stores (id, user_id, owner_id, slug, description, website, logo_url, category, contact_email, contact_phone, address, is_active, created_at, updated_at, name, store_application_id, ecommerce_platform, tracking_script_id, script_last_ping, script_status, card_image_url, country, commission_rate) VALUES ('be03e95e-857e-486d-9bc8-26e5e28ac4e8', '76f5271f-04cc-4747-afbe-e9398303f4a4', '76f5271f-04cc-4747-afbe-e9398303f4a4', 'aliexpress', '', 'https://es.aliexpress.com/', 'https://tkndbcwyojivwfasbemv.supabase.co/storage/v1/object/public/stores/84a63799-d556-4b7a-864f-e296476a0182.webp', 'moda', 'Mindocraf@gmail.com', '*', 's', true, '2025-05-24 16:53:30.587332+00', '2025-06-24 15:27:38.308089+00', 'Aliexpress', 'dfaa819c-cbf6-4fe5-9f59-bb563d02e3d4', NULL, '2757a9be-23f0-4518-b028-9ddec0702c41', NULL, 'inactive', NULL, NULL, 7.50);
INSERT INTO public.stores (id, user_id, owner_id, slug, description, website, logo_url, category, contact_email, contact_phone, address, is_active, created_at, updated_at, name, store_application_id, ecommerce_platform, tracking_script_id, script_last_ping, script_status, card_image_url, country, commission_rate) VALUES ('6af6b221-7c0c-4560-a25f-718428b5119b', NULL, '603f5f0f-cf02-43d1-a032-14aa486fa6f4', NULL, '', 'https://www.youtube.com/', '', 'Libros y Educación', NULL, NULL, NULL, true, '2025-06-27 17:40:09.110186+00', '2025-06-27 17:40:09.110186+00', 'prueba2', NULL, 'prestashop', '3a90eb9c-243c-4c9c-9f07-c008270f242c', NULL, 'inactive', NULL, NULL, 7.50);
INSERT INTO public.stores (id, user_id, owner_id, slug, description, website, logo_url, category, contact_email, contact_phone, address, is_active, created_at, updated_at, name, store_application_id, ecommerce_platform, tracking_script_id, script_last_ping, script_status, card_image_url, country, commission_rate) VALUES ('d5115851-dd01-4c19-a09f-c108ccda9633', NULL, '603f5f0f-cf02-43d1-a032-14aa486fa6f4', NULL, '', 'https://cuponomics-tracker.myshopify.com/', '', 'Automóviles', NULL, NULL, NULL, true, '2025-06-30 14:08:24.159094+00', '2025-06-30 14:08:24.159094+00', 'test tracking system shopify ', NULL, 'shopify', 'd2c53115-2db1-4dd7-9f02-700e21864aa7', NULL, 'inactive', NULL, NULL, 7.50);
INSERT INTO public.stores (id, user_id, owner_id, slug, description, website, logo_url, category, contact_email, contact_phone, address, is_active, created_at, updated_at, name, store_application_id, ecommerce_platform, tracking_script_id, script_last_ping, script_status, card_image_url, country, commission_rate) VALUES ('b27cdfea-389b-42b0-bb0c-96499fb39ee5', NULL, '603f5f0f-cf02-43d1-a032-14aa486fa6f4', NULL, '', 'https://www.youtube.com/', 'https://tkndbcwyojivwfasbemv.supabase.co/storage/v1/object/public/stores/c1f88e50-789f-44e4-9516-0848918b0249.png', 'Tecnología', NULL, NULL, NULL, true, '2025-07-06 13:47:13.585471+00', '2025-07-06 13:47:13.585471+00', 'george', NULL, 'shopify', '150d59ee-6ca4-4bba-8af6-17de13c2782e', NULL, 'inactive', NULL, NULL, 7.50);
INSERT INTO public.stores (id, user_id, owner_id, slug, description, website, logo_url, category, contact_email, contact_phone, address, is_active, created_at, updated_at, name, store_application_id, ecommerce_platform, tracking_script_id, script_last_ping, script_status, card_image_url, country, commission_rate) VALUES ('64e912ff-c69a-4d38-8c25-4e259fad4a70', NULL, '603f5f0f-cf02-43d1-a032-14aa486fa6f4', NULL, '', 'https://www.youtube.com/', '', 'Tecnología', NULL, NULL, NULL, true, '2025-07-06 18:10:50.023968+00', '2025-07-06 18:10:50.023968+00', 'Testing webhooks', NULL, 'shopify', '22a947bc-22be-4bf2-bc0a-a4a791c07b0f', NULL, 'inactive', NULL, NULL, 7.50);
INSERT INTO public.stores (id, user_id, owner_id, slug, description, website, logo_url, category, contact_email, contact_phone, address, is_active, created_at, updated_at, name, store_application_id, ecommerce_platform, tracking_script_id, script_last_ping, script_status, card_image_url, country, commission_rate) VALUES ('617989cd-d451-4cda-993a-4643b919bd3a', '76f5271f-04cc-4747-afbe-e9398303f4a4', '76f5271f-04cc-4747-afbe-e9398303f4a4', 'Amazon', 'Tienda ofcial de Amazon españa', 'amazon.es', 'https://tkndbcwyojivwfasbemv.supabase.co/storage/v1/object/public/stores/7fa3af45-5343-4f8f-8c87-849b92be70cc.webp', '', NULL, NULL, NULL, true, '2025-04-26 15:59:47.826833+00', '2025-07-12 14:58:34.654011+00', 'Amazon', NULL, NULL, '162be5ef-e0bb-449d-b796-9a4b4348fa12', NULL, 'inactive', NULL, NULL, 7.50);


--
-- TOC entry 4536 (class 0 OID 97508)
-- Dependencies: 306
-- Data for Name: system_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4531 (class 0 OID 92292)
-- Dependencies: 301
-- Data for Name: tracking_clicks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (8, '2025-06-25 20:10:08.474+00', '2025-06-25 20:09:33.079701+00', NULL, 'session_1750882208474_ax3fy87bg', 'cuonomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/?utm_source=cuonomics&utm_medium=coupon&utm_campaign=coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97&utm_content=Cuponnomicsprove10&utm_term=Amazon&ref=cuonomics&coupon_id=4ea93bf4-a9c3-4c36-a379-61f6947b2d97&store_id=617989cd-d451-4cda-993a-4643b919bd3a', 'https://www.amazon.es/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97&utm_content=Cuponnomicsprove10&utm_term=Amazon&ref=cuponomics&coupon_id=4ea93bf4-a9c3-4c36-a379-61f6947b2d97&store_id=617989cd-d451-4cda-993a-4643b919bd3a', 'https://www.amazon.es/?utm_source=cuonomics&utm_medium=coupon&utm_campaign=coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97&utm_content=Cuponnomicsprove10&utm_term=Amazon&ref=cuonomics&coupon_id=4ea93bf4-a9c3-4c36-a379-61f6947b2d97&store_id=617989cd-d451-4cda-993a-4643b919bd3a', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-25T20:10:08.474Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (9, '2025-06-25 20:10:27.487+00', '2025-06-25 20:09:52.178953+00', NULL, 'session_1750882208474_ax3fy87bg', 'cuonomics', 'coupon', 'coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, 'Amazon', NULL, 'Amazon', NULL, '0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, NULL, NULL, NULL, 'https://www.amazon.es/?utm_source=cuonomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuonomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', 'https://www.amazon.es/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuponomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', 'https://www.amazon.es/?utm_source=cuonomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuonomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-25T20:10:27.487Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (10, '2025-06-25 20:38:45.37+00', '2025-06-25 20:38:09.915928+00', NULL, 'session_1750882208474_ax3fy87bg', 'cuonomics', 'coupon', 'coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, 'Amazon', NULL, 'Amazon', NULL, '0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, NULL, NULL, NULL, 'https://www.amazon.es/?utm_source=cuonomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuonomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', 'https://www.amazon.es/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuponomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', 'https://www.amazon.es/?utm_source=cuonomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuonomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-25T20:38:45.370Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (11, '2025-06-26 07:07:36.963+00', '2025-06-26 07:07:01.324263+00', NULL, 'session_1750921656963_hw9uuz9sn', 'cuonomics', 'coupon', 'coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, 'Amazon', NULL, 'Amazon', NULL, '0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, NULL, NULL, NULL, 'https://www.amazon.es/?utm_source=cuonomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuonomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', 'https://www.amazon.es/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuponomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', 'https://www.amazon.es/?utm_source=cuonomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuonomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-26T07:07:36.963Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (12, '2025-06-26 07:15:31.28+00', '2025-06-26 07:14:55.423808+00', NULL, 'session_1750922131280_jhfy3xzoq', 'cuonomics', 'coupon', 'coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, 'Amazon', NULL, 'Amazon', NULL, '0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, NULL, NULL, NULL, 'https://www.amazon.es/?utm_source=cuonomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuonomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', 'https://www.amazon.es/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuponomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', 'https://www.amazon.es/?utm_source=cuonomics&utm_medium=coupon&utm_campaign=coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_content=coupon-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&utm_term=Amazon&ref=cuonomics&coupon_id=0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408&store_id=617989cd-d451-4cda-993a-4643b919bd3a', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-26T07:15:31.280Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (13, '2025-06-26 15:59:24.58+00', '2025-06-26 15:58:47.433044+00', NULL, 'session_1750953564580_pjzxqjybz', 'cuponomics', 'coupon', 'coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'Amazon', NULL, 'Amazon', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', '0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, 'free_shipping', 0.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-26T15:59:24.580Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (14, '2025-06-26 16:06:49.958+00', '2025-06-26 16:06:12.69734+00', NULL, 'session_1750953564580_pjzxqjybz', 'cuponomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://kzmixwxh6gdndqc2znea.lite.vusercontent.net/', 'desktop', '2025-06-26T16:06:49.958Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (15, '2025-06-26 16:06:54.924+00', '2025-06-26 16:06:18.144409+00', NULL, 'session_1750953564580_pjzxqjybz', 'cuponomics', 'coupon', 'coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'Amazon', NULL, 'Amazon', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', '0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, 'free_shipping', 0.00, NULL, 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://kzmixwxh6gdndqc2znea.lite.vusercontent.net/', 'desktop', '2025-06-26T16:06:54.924Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (16, '2025-06-26 16:23:48.591+00', '2025-06-26 16:23:11.392214+00', NULL, 'session_1750955028590_l5kel66gr', 'cuponomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-26T16:23:48.591Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (17, '2025-06-26 16:23:54.188+00', '2025-06-26 16:23:16.919705+00', NULL, 'session_1750955028590_l5kel66gr', 'cuponomics', 'coupon', 'coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'Amazon', NULL, 'Amazon', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', '0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, 'free_shipping', 0.00, NULL, 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-26T16:23:54.188Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (18, '2025-06-26 20:31:13+00', '2025-06-26 20:30:37.135996+00', NULL, 'session_1750969872999_e6ednzv4r', 'cuponomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-26T20:31:13.000Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (19, '2025-06-26 21:12:10.125+00', '2025-06-26 21:11:34.043269+00', NULL, 'session_1750972330125_4vbd5cd8g', 'cuponomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-26T21:12:10.125Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (20, '2025-06-27 11:51:38.349+00', '2025-06-27 11:51:02.47643+00', NULL, 'session_1751025098349_d1bip52yr', 'cuponomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-27T11:51:38.349Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (21, '2025-06-27 13:45:19.871+00', '2025-06-27 13:44:41.549714+00', '76f5271f-04cc-4747-afbe-e9398303f4a4', 'session_1751031919870_b4x6bjhmw', 'cuponomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'http://localhost:3000/', 'desktop', '2025-06-27T13:45:19.871Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (22, '2025-06-28 20:40:36.584+00', '2025-06-28 20:39:57.805947+00', NULL, 'session_1751143236583_a3nsb0k2w', 'cuponomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-28T20:40:36.584Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (23, '2025-06-29 11:39:59.873+00', '2025-06-29 11:39:19.498372+00', NULL, 'session_1751197199873_xiwo29c3p', 'cuponomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'https://v0.dev/', 'desktop', '2025-06-29T11:39:59.873Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (24, '2025-06-30 09:45:08.703+00', '2025-06-30 09:44:27.114253+00', NULL, 'session_1751276708703_7wr8l7wve', 'cuponomics', 'coupon', 'coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'Amazon', NULL, 'Amazon', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', '0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, 'free_shipping', 0.00, NULL, 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-06-30T09:45:08.703Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (25, '2025-06-30 14:35:53.025+00', '2025-06-30 14:35:11.401993+00', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', 'session_1751294153024_14lv1qawq', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_user_id=603f5f0f-cf02-43d1-a032-14aa486fa6f4&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-06-30T14:35:53.025Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (26, '2025-06-30 14:39:00.006+00', '2025-06-30 14:38:18.319901+00', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', 'session_1751294153024_14lv1qawq', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_user_id=603f5f0f-cf02-43d1-a032-14aa486fa6f4&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-06-30T14:39:00.006Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (27, '2025-06-30 15:00:50.234+00', '2025-06-30 15:00:08.533562+00', NULL, 'session_1751294153024_14lv1qawq', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-06-30T15:00:50.234Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (28, '2025-06-30 15:50:35.818+00', '2025-06-30 15:49:54.175848+00', NULL, 'session_1751298635818_jqdbh1ek2', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-06-30T15:50:35.818Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (29, '2025-06-30 15:50:51.628+00', '2025-06-30 15:50:09.949167+00', NULL, 'session_1751298635818_jqdbh1ek2', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-06-30T15:50:51.628Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (30, '2025-06-30 20:27:02.931+00', '2025-06-30 20:26:21.232608+00', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', 'session_1751315222930_n8ia6cppb', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_user_id=603f5f0f-cf02-43d1-a032-14aa486fa6f4&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-06-30T20:27:02.931Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (31, '2025-06-30 20:34:25.438+00', '2025-06-30 20:33:43.541971+00', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', 'session_1751315222930_n8ia6cppb', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_user_id=603f5f0f-cf02-43d1-a032-14aa486fa6f4&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-06-30T20:34:25.438Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (32, '2025-07-01 09:28:09.321+00', '2025-07-01 09:27:27.82606+00', NULL, 'session_1751362089321_6d7bvsq1h', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-07-01T09:28:09.321Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (33, '2025-07-01 09:28:21.318+00', '2025-07-01 09:27:39.456675+00', NULL, 'session_1751362089321_6d7bvsq1h', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-07-01T09:28:21.318Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (34, '2025-07-01 16:33:20.544+00', '2025-07-01 16:32:38.188736+00', NULL, 'session_1751387600543_rpya5iudb', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-07-01T16:33:20.544Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (35, '2025-07-01 16:33:33.926+00', '2025-07-01 16:32:51.444812+00', NULL, 'session_1751387600543_rpya5iudb', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-07-01T16:33:33.926Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (36, '2025-07-03 18:26:35.806+00', '2025-07-03 18:25:50.58636+00', NULL, 'session_1751567195806_g04e4mti0', 'cuponomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-07-03T18:26:35.806Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (37, '2025-07-05 10:37:45.011+00', '2025-07-05 10:36:58.540179+00', NULL, 'session_1751711865011_fuk6kd9m3', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-07-05T10:37:45.011Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (38, '2025-07-05 10:42:34.224+00', '2025-07-05 10:41:47.945587+00', NULL, 'session_1751711865011_fuk6kd9m3', 'cuponomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-07-05T10:42:34.224Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (39, '2025-07-05 11:08:32.332+00', '2025-07-05 11:07:45.708551+00', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', 'session_1751711865011_fuk6kd9m3', 'cuponomics', 'coupon', 'coupon_839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', 'offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', 'prueba2', NULL, 'prueba2', 'offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', '839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', NULL, 'percentage', 23.00, NULL, 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7', 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7&utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_coupon_id=839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_user_id=603f5f0f-cf02-43d1-a032-14aa486fa6f4&cp_discount_type=percentage&cp_discount_value=23', 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-07-05T11:08:32.332Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (40, '2025-07-08 13:14:48.585+00', '2025-07-08 13:13:58.272922+00', NULL, 'session_1751980488585_8ex4t37y1', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-07-08T13:14:48.585Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (41, '2025-07-09 16:00:40.081+00', '2025-07-09 15:59:47.79406+00', NULL, 'session_1752076840080_m1tdn8wkd', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'http://localhost:3000/buscar-ofertas', 'desktop', '2025-07-09T16:00:40.081Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (42, '2025-07-09 16:02:55.834+00', '2025-07-09 16:02:03.744645+00', NULL, 'session_1752076840080_m1tdn8wkd', 'cuponomics', 'coupon', 'coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'Amazon', NULL, 'Amazon', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', '0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, 'free_shipping', 0.00, NULL, 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'http://localhost:3000/buscar-ofertas', 'desktop', '2025-07-09T16:02:55.834Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (43, '2025-07-09 16:03:00.496+00', '2025-07-09 16:02:08.187125+00', NULL, 'session_1752076840080_m1tdn8wkd', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'http://localhost:3000/buscar-ofertas', 'desktop', '2025-07-09T16:03:00.496Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (44, '2025-07-09 16:03:11.949+00', '2025-07-09 16:02:19.608624+00', NULL, 'session_1752076840080_m1tdn8wkd', 'cuponomics', 'coupon', 'coupon_4ea93bf4-a9c3-4c36-a379-61f6947b2d97', 'Cuponnomicsprove10', 'Amazon', NULL, 'Amazon', 'Cuponnomicsprove10', '4ea93bf4-a9c3-4c36-a379-61f6947b2d97', NULL, 'free_shipping', 20.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', 'http://localhost:3000/buscar-ofertas', 'desktop', '2025-07-09T16:03:11.949Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (45, '2025-07-10 17:46:45.109+00', '2025-07-10 17:45:51.327137+00', NULL, 'session_1752169605109_ks3h9uyyo', 'cuponomics', 'coupon', 'coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'Amazon', NULL, 'Amazon', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', '0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, 'free_shipping', 0.00, NULL, 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-07-10T17:46:45.109Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (46, '2025-07-10 17:46:49.791+00', '2025-07-10 17:45:55.728687+00', NULL, 'session_1752169605109_ks3h9uyyo', 'cuponomics', 'coupon', 'coupon_839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', 'offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', 'prueba2', NULL, 'prueba2', 'offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', '839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', NULL, 'percentage', 23.00, NULL, 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7', 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7&utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_coupon_id=839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_discount_type=percentage&cp_discount_value=23', 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0', '', 'desktop', '2025-07-10T17:46:49.791Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (47, '2025-07-14 09:12:04.318+00', '2025-07-14 09:11:07.053996+00', NULL, 'session_1752484324317_by0i73sg0', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '', 'desktop', '2025-07-14T09:12:04.318Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (48, '2025-07-18 16:31:36.285+00', '2025-07-18 16:30:33.788563+00', NULL, 'session_1752856296284_v8utyeoos', 'cuponomics', 'coupon', 'coupon_839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', 'offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', 'prueba2', NULL, 'prueba2', 'offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', '839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', NULL, 'percentage', 23.00, NULL, 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7', 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7&utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_coupon_id=839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_discount_type=percentage&cp_discount_value=23', 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '', 'desktop', '2025-07-18T16:31:36.285Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (49, '2025-07-18 16:32:07.44+00', '2025-07-18 16:31:04.357573+00', NULL, 'session_1752856296284_v8utyeoos', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '', 'desktop', '2025-07-18T16:32:07.440Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (50, '2025-07-21 16:36:13.79+00', '2025-07-21 16:35:07.200857+00', NULL, 'session_1753115773790_zy45vrqw6', 'cuponomics', 'coupon', 'coupon_d993e569-a295-4515-aa89-1b353b5bc050', 'offer-d993e569-a295-4515-aa89-1b353b5bc050', 'Aliexpress', NULL, 'Aliexpress', 'offer-d993e569-a295-4515-aa89-1b353b5bc050', 'd993e569-a295-4515-aa89-1b353b5bc050', 'Salud', 'fixed', 5.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/buscar-ofertas-alternativa', 'desktop', '2025-07-21T16:36:13.790Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (51, '2025-07-21 17:41:43.589+00', '2025-07-21 17:40:37.259255+00', NULL, 'session_1753115773790_zy45vrqw6', 'cuponomics', 'coupon', 'coupon_d993e569-a295-4515-aa89-1b353b5bc050', 'offer-d993e569-a295-4515-aa89-1b353b5bc050', 'Aliexpress', NULL, 'Aliexpress', 'offer-d993e569-a295-4515-aa89-1b353b5bc050', 'd993e569-a295-4515-aa89-1b353b5bc050', 'Salud', 'fixed', 5.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/buscar-ofertas-alternativa', 'desktop', '2025-07-21T17:41:43.589Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (52, '2025-07-21 17:41:47.89+00', '2025-07-21 17:40:41.084043+00', NULL, 'session_1753115773790_zy45vrqw6', 'cuponomics', 'coupon', 'coupon_f62417ae-b4f8-4cdf-97a4-ce90a8cc6e63', '182542', 'Aliexpress', NULL, 'Aliexpress', '182542', 'f62417ae-b4f8-4cdf-97a4-ce90a8cc6e63', NULL, 'percentage', 87.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/buscar-ofertas-alternativa', 'desktop', '2025-07-21T17:41:47.890Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (53, '2025-07-21 17:41:53.854+00', '2025-07-21 17:40:47.157415+00', NULL, 'session_1753115773790_zy45vrqw6', 'cuponomics', 'coupon', 'coupon_839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', 'offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', 'prueba2', NULL, 'prueba2', 'offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', '839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', NULL, 'percentage', 23.00, NULL, 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7', 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7&utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_coupon_id=839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_discount_type=percentage&cp_discount_value=23', 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/buscar-ofertas-alternativa', 'desktop', '2025-07-21T17:41:53.854Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (54, '2025-07-21 17:42:03.348+00', '2025-07-21 17:40:56.538972+00', NULL, 'session_1753115773790_zy45vrqw6', 'cuponomics', 'coupon', 'coupon_0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', 'Amazon', NULL, 'Amazon', 'offer-0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', '0aeb1e80-b5fb-4b69-bb5d-d2b8d6951408', NULL, 'free_shipping', 0.00, NULL, 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', 'https://www.youtube.com/watch?v=Rql6xWv2fX0&list=RDMMvPNQelV9ALc&index=25', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/buscar-ofertas-alternativa', 'desktop', '2025-07-21T17:42:03.348Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (55, '2025-07-21 20:03:10.329+00', '2025-07-21 20:02:03.893132+00', NULL, 'session_1753128190329_ig1vfgiug', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'http://localhost:3000/buscar-ofertas', 'desktop', '2025-07-21T20:03:10.329Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (56, '2025-07-23 10:57:52.226+00', '2025-07-23 10:56:43.432584+00', NULL, 'session_1753268272226_8nktlj1pq', 'cuponomics', 'coupon', 'coupon_f62417ae-b4f8-4cdf-97a4-ce90a8cc6e63', '182542', 'Aliexpress', NULL, 'Aliexpress', '182542', 'f62417ae-b4f8-4cdf-97a4-ce90a8cc6e63', NULL, 'percentage', 87.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '', 'desktop', '2025-07-23T10:57:52.226Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (57, '2025-07-23 10:58:07.633+00', '2025-07-23 10:56:58.793772+00', NULL, 'session_1753268272226_8nktlj1pq', 'cuponomics', 'coupon', 'coupon_839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', 'offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', 'prueba2', NULL, 'prueba2', 'offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', '839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0', NULL, 'percentage', 23.00, NULL, 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7', 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7&utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=offer-839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_coupon_id=839ed73c-3e0e-48fb-80dd-d7c6cf38dbe0&cp_discount_type=percentage&cp_discount_value=23', 'https://www.youtube.com/watch?v=eCeYbZb2Ltw&list=RDzaf3fsY5bFE&index=7', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '', 'desktop', '2025-07-23T10:58:07.633Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (58, '2025-07-23 10:58:23.201+00', '2025-07-23 10:57:14.322574+00', NULL, 'session_1753268272226_8nktlj1pq', 'cuponomics', 'coupon', 'coupon_87adaa56-7acf-4937-9cee-46c70ff649bc', 'ddsd', 'prueba2', NULL, 'prueba2', 'ddsd', '87adaa56-7acf-4937-9cee-46c70ff649bc', NULL, 'percentage', 10.00, NULL, 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/?utm_source=cuponomics&utm_medium=coupon&utm_campaign=prueba2-coupons&utm_content=coupon-ddsd&cp_store_id=6af6b221-7c0c-4560-a25f-718428b5119b&cp_store_name=prueba2&cp_coupon_code=ddsd&cp_coupon_id=87adaa56-7acf-4937-9cee-46c70ff649bc&cp_discount_type=percentage&cp_discount_value=10#6f12e5360d0d3b7ee760abf2e45b64e8', 'https://cuponomics-tracker.myshopify.com/#6f12e5360d0d3b7ee760abf2e45b64e8', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '', 'desktop', '2025-07-23T10:58:23.201Z');
INSERT INTO public.tracking_clicks (id, created_at, updated_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, store_id, store_name, coupon_code, coupon_id, category, discount_type, discount_value, affiliate_id, original_url, tracked_url, store_url, ip_address, user_agent, referrer, device_type, clicked_at) VALUES (59, '2025-07-23 12:44:03.071+00', '2025-07-23 12:42:53.929234+00', NULL, 'session_1753274643070_g4vk9le9l', 'cuponomics', 'coupon', 'coupon_f62417ae-b4f8-4cdf-97a4-ce90a8cc6e63', '182542', 'Aliexpress', NULL, 'Aliexpress', '182542', 'f62417ae-b4f8-4cdf-97a4-ce90a8cc6e63', NULL, 'percentage', 87.00, NULL, 'https://www.amazon.es/', 'https://www.amazon.es/', 'https://www.amazon.es/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '', 'desktop', '2025-07-23T12:44:03.071Z');


--
-- TOC entry 4532 (class 0 OID 96058)
-- Dependencies: 302
-- Data for Name: tracking_conversions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4533 (class 0 OID 96133)
-- Dependencies: 303
-- Data for Name: tracking_pixels; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tracking_pixels (id, owner_id, store_id, pixel_name, pixel_id, commission_rate, currency, track_all_pages, checkout_pages, track_purchases, track_leads, track_signups, allowed_domains, webhook_url, is_active, is_test_mode, total_conversions, total_revenue, last_conversion_at, created_at, updated_at, auto_detect_conversions, checkout_patterns, is_verified, platform, store_url, track_add_to_cart, track_page_views, last_activity_at, total_commission) VALUES ('fcd30bc8-5df7-4376-9e8e-a91ff9a431f3', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', 'b27cdfea-389b-42b0-bb0c-96499fb39ee5', 'Pixel para george', 'px_b27cdfea-389b-42b0-bb0c-96499fb39ee5_1751809681605', 5.00, 'EUR', false, '{/checkout/success,/order-received,/thank-you}', true, false, false, NULL, NULL, true, false, 0, 0.00, NULL, '2025-07-06 13:47:13.69153+00', '2025-07-06 13:47:13.69153+00', true, '{/checkout/thank_you,/orders/}', false, 'shopify', 'https://www.youtube.com/', false, true, NULL, 0.00);
INSERT INTO public.tracking_pixels (id, owner_id, store_id, pixel_name, pixel_id, commission_rate, currency, track_all_pages, checkout_pages, track_purchases, track_leads, track_signups, allowed_domains, webhook_url, is_active, is_test_mode, total_conversions, total_revenue, last_conversion_at, created_at, updated_at, auto_detect_conversions, checkout_patterns, is_verified, platform, store_url, track_add_to_cart, track_page_views, last_activity_at, total_commission) VALUES ('4a648dc3-7517-4934-9790-43d2223fbf51', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', '64e912ff-c69a-4d38-8c25-4e259fad4a70', 'Pixel para Testing webhooks', 'px_64e912ff-c69a-4d38-8c25-4e259fad4a70_1751825499158', 5.00, 'EUR', false, '{/checkout/success,/order-received,/thank-you}', true, false, false, NULL, NULL, true, false, 0, 0.00, NULL, '2025-07-06 18:10:50.123077+00', '2025-07-06 18:10:50.123077+00', true, '{/checkout/thank_you,/orders/}', false, 'shopify', 'https://www.youtube.com/', false, true, NULL, 0.00);


--
-- TOC entry 4529 (class 0 OID 91156)
-- Dependencies: 299
-- Data for Name: utm_tracking_exceptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('5cd42956-43bb-484d-901b-a20afde5ebcd', NULL, 'Amazon', 'amazon.com', 'Programa de afiliados Amazon Associates', true, '2025-06-24 18:09:57.11988+00', '2025-06-24 18:09:57.11988+00', NULL, NULL, 'Amazon Associates', NULL, NULL, 1, 'Usar affiliate_id específico');
INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('0ecf8733-0080-42c8-ab83-376721bd0323', NULL, 'AliExpress', 'aliexpress.com', 'Programa de afiliados AliExpress', true, '2025-06-24 18:09:57.11988+00', '2025-06-24 18:09:57.11988+00', NULL, NULL, 'AliExpress Partners', NULL, NULL, 1, 'Usar tracking_id específico');
INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('a8bd620b-061d-49fb-aa95-e01a9d9a75b1', NULL, 'eBay', 'ebay.com', 'Programa de afiliados eBay Partner Network', true, '2025-06-24 18:09:57.11988+00', '2025-06-24 18:09:57.11988+00', NULL, NULL, 'eBay Partner Network', NULL, NULL, 1, 'Usar campid específico');
INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('468649ca-ed97-4cbd-9e2a-a5512764d4f8', NULL, 'Booking.com', 'booking.com', 'Programa de afiliados Booking.com', true, '2025-06-24 18:09:57.11988+00', '2025-06-24 18:09:57.11988+00', NULL, NULL, 'Booking.com Affiliate', NULL, NULL, 1, 'Usar aid específico');
INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('d0051b87-5b46-437d-abd9-c6f4615ed671', NULL, 'Zara', 'zara.com', 'Sistema de tracking interno', true, '2025-06-24 18:09:57.11988+00', '2025-06-24 18:09:57.11988+00', NULL, NULL, 'Inditex Affiliate', NULL, NULL, 2, 'UTM puede interferir con su sistema');
INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('ae0d373b-d183-43be-885f-8957d7aab461', NULL, 'H&M', 'hm.com', 'Programa de afiliados H&M', true, '2025-06-24 18:09:57.11988+00', '2025-06-24 18:09:57.11988+00', NULL, NULL, 'H&M Affiliate', NULL, NULL, 2, 'Usar parámetros específicos');
INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('aa803817-526b-4533-a58d-f577c90a51d4', NULL, 'Apple', 'apple.com', 'Programa de afiliados Apple', true, '2025-06-24 18:09:57.11988+00', '2025-06-24 18:09:57.11988+00', NULL, NULL, 'Apple Affiliate', NULL, NULL, 1, 'Usar at específico');
INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('2828004e-8ab4-46a9-9654-96d9610e469a', NULL, 'Best Buy', 'bestbuy.com', 'Programa de afiliados Best Buy', true, '2025-06-24 18:09:57.11988+00', '2025-06-24 18:09:57.11988+00', NULL, NULL, 'Best Buy Affiliate', NULL, NULL, 2, 'Usar parámetros específicos');
INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('83ce28cb-44c4-458b-ac43-a8e9779afcb3', NULL, 'Expedia', 'expedia.com', 'Programa de afiliados Expedia', true, '2025-06-24 18:09:57.11988+00', '2025-06-24 18:09:57.11988+00', NULL, NULL, 'Expedia Affiliate', NULL, NULL, 1, 'Usar TPID específico');
INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('f3fa3e37-d6e3-4cbd-83dc-135f40e4f008', NULL, 'Airbnb', 'airbnb.com', 'Programa de afiliados Airbnb', true, '2025-06-24 18:09:57.11988+00', '2025-06-24 18:09:57.11988+00', NULL, NULL, 'Airbnb Affiliate', NULL, NULL, 1, 'Usar c específico');
INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('617989cd-d451-4cda-993a-4643b919bd3a', '617989cd-d451-4cda-993a-4643b919bd3a', 'Amazon', 'www.amazon.es', 'Programa de afiliados Amazon Associates', true, '2025-06-24 18:09:57.11988+00', '2025-06-24 18:09:57.11988+00', '76f5271f-04cc-4747-afbe-e9398303f4a4', NULL, 'Amazon Associates', NULL, NULL, 1, 'Usar affiliate_id específico');
INSERT INTO public.utm_tracking_exceptions (id, store_id, store_name, domain, reason, is_active, created_at, updated_at, owner_id, store_slug, affiliate_program, affiliate_id, custom_tracking_params, priority, notes) VALUES ('d0bcadf3-6d78-4510-a7f5-8591b24adb53', NULL, 'Todas las tiendas del propietario principal', 'owner-exception', 'Tiendas del propietario principal ya tienen tokens de afiliado configurados', true, '2025-06-24 18:37:17.902393+00', '2025-06-24 18:37:17.902393+00', '76f5271f-04cc-4747-afbe-e9398303f4a4', NULL, 'Tokens propios preconfigurados', NULL, NULL, 0, 'Excepción automática para todas las tiendas del owner principal');


--
-- TOC entry 4540 (class 0 OID 121364)
-- Dependencies: 310
-- Data for Name: messages_2025_07_18; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 4541 (class 0 OID 123603)
-- Dependencies: 311
-- Data for Name: messages_2025_07_19; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 4542 (class 0 OID 123614)
-- Dependencies: 312
-- Data for Name: messages_2025_07_20; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 4543 (class 0 OID 124789)
-- Dependencies: 313
-- Data for Name: messages_2025_07_21; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 4544 (class 0 OID 127006)
-- Dependencies: 314
-- Data for Name: messages_2025_07_22; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 4548 (class 0 OID 129526)
-- Dependencies: 318
-- Data for Name: messages_2025_07_23; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 4549 (class 0 OID 129537)
-- Dependencies: 319
-- Data for Name: messages_2025_07_24; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 4524 (class 0 OID 17257)
-- Dependencies: 290
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116024918, '2025-04-17 19:53:51');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116045059, '2025-04-17 19:53:51');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116050929, '2025-04-17 19:53:51');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116051442, '2025-04-17 19:53:51');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116212300, '2025-04-17 19:53:51');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116213355, '2025-04-17 19:53:51');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116213934, '2025-04-17 19:53:52');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116214523, '2025-04-17 19:53:52');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211122062447, '2025-04-17 19:53:52');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211124070109, '2025-04-17 19:53:52');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211202204204, '2025-04-17 19:53:52');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211202204605, '2025-04-17 19:53:52');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211210212804, '2025-04-17 19:53:53');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211228014915, '2025-04-17 19:53:53');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220107221237, '2025-04-17 19:53:53');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220228202821, '2025-04-17 19:53:53');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220312004840, '2025-04-17 19:53:53');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220603231003, '2025-04-17 19:53:53');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220603232444, '2025-04-17 19:53:54');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220615214548, '2025-04-17 19:53:54');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220712093339, '2025-04-17 19:53:54');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220908172859, '2025-04-17 19:53:54');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220916233421, '2025-04-17 19:53:54');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230119133233, '2025-04-17 19:53:54');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230128025114, '2025-04-17 19:53:54');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230128025212, '2025-04-17 19:53:55');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230227211149, '2025-04-17 19:53:55');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230228184745, '2025-04-17 19:53:55');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230308225145, '2025-04-17 19:53:55');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230328144023, '2025-04-17 19:53:55');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231018144023, '2025-04-17 19:53:55');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144023, '2025-04-17 19:53:55');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144024, '2025-04-17 19:53:56');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144025, '2025-04-17 19:53:56');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240108234812, '2025-04-17 19:53:56');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240109165339, '2025-04-17 19:53:56');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240227174441, '2025-04-17 19:53:56');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240311171622, '2025-04-17 19:53:56');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240321100241, '2025-04-17 19:53:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240401105812, '2025-04-17 19:53:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240418121054, '2025-04-17 19:53:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240523004032, '2025-04-17 19:53:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240618124746, '2025-04-17 19:53:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240801235015, '2025-04-17 19:53:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240805133720, '2025-04-17 19:53:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240827160934, '2025-04-17 19:53:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240919163303, '2025-04-17 19:53:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240919163305, '2025-04-17 19:53:59');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241019105805, '2025-04-17 19:53:59');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241030150047, '2025-04-17 19:53:59');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241108114728, '2025-04-17 19:53:59');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241121104152, '2025-04-17 19:54:00');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241130184212, '2025-04-17 19:54:00');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241220035512, '2025-04-17 19:54:00');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241220123912, '2025-04-17 19:54:00');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241224161212, '2025-04-17 19:54:00');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250107150512, '2025-04-17 19:54:00');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250110162412, '2025-04-17 19:54:00');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250123174212, '2025-04-17 19:54:01');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250128220012, '2025-04-17 19:54:01');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250506224012, '2025-05-22 18:34:48');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250523164012, '2025-06-01 09:49:22');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250714121412, '2025-07-18 16:25:27');


--
-- TOC entry 4526 (class 0 OID 17279)
-- Dependencies: 293
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 4499 (class 0 OID 16540)
-- Dependencies: 262
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) VALUES ('public', 'public', NULL, '2025-05-19 18:20:46.118941+00', '2025-05-19 18:20:46.118941+00', true, false, NULL, NULL, NULL);
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) VALUES ('products', 'products', NULL, '2025-05-19 18:20:46.118941+00', '2025-05-19 18:20:46.118941+00', true, false, NULL, NULL, NULL);
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) VALUES ('stores', 'stores', NULL, '2025-05-19 18:20:46.118941+00', '2025-05-19 18:20:46.118941+00', true, false, NULL, NULL, NULL);
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) VALUES ('profiles', 'profiles', NULL, '2025-05-19 18:20:46.118941+00', '2025-05-19 18:20:46.118941+00', true, false, NULL, NULL, NULL);
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) VALUES ('store-cards', 'store-cards', NULL, '2025-07-05 11:14:16.691023+00', '2025-07-05 11:14:16.691023+00', true, false, NULL, NULL, NULL);
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) VALUES ('banners', 'banners', NULL, '2025-07-21 21:01:18.990881+00', '2025-07-21 21:01:18.990881+00', true, false, NULL, NULL, NULL);


--
-- TOC entry 4501 (class 0 OID 16582)
-- Dependencies: 264
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (0, 'create-migrations-table', 'e18db593bcde2aca2a408c4d1100f6abba2195df', '2025-04-17 19:30:08.898627');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (1, 'initialmigration', '6ab16121fbaa08bbd11b712d05f358f9b555d777', '2025-04-17 19:30:08.928349');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (2, 'storage-schema', '5c7968fd083fcea04050c1b7f6253c9771b99011', '2025-04-17 19:30:08.933337');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (3, 'pathtoken-column', '2cb1b0004b817b29d5b0a971af16bafeede4b70d', '2025-04-17 19:30:08.962271');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (4, 'add-migrations-rls', '427c5b63fe1c5937495d9c635c263ee7a5905058', '2025-04-17 19:30:08.9867');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (5, 'add-size-functions', '79e081a1455b63666c1294a440f8ad4b1e6a7f84', '2025-04-17 19:30:08.990441');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (6, 'change-column-name-in-get-size', 'f93f62afdf6613ee5e7e815b30d02dc990201044', '2025-04-17 19:30:08.994679');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (7, 'add-rls-to-buckets', 'e7e7f86adbc51049f341dfe8d30256c1abca17aa', '2025-04-17 19:30:08.998808');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (8, 'add-public-to-buckets', 'fd670db39ed65f9d08b01db09d6202503ca2bab3', '2025-04-17 19:30:09.002474');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (9, 'fix-search-function', '3a0af29f42e35a4d101c259ed955b67e1bee6825', '2025-04-17 19:30:09.006793');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (10, 'search-files-search-function', '68dc14822daad0ffac3746a502234f486182ef6e', '2025-04-17 19:30:09.011791');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (11, 'add-trigger-to-auto-update-updated_at-column', '7425bdb14366d1739fa8a18c83100636d74dcaa2', '2025-04-17 19:30:09.018746');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (12, 'add-automatic-avif-detection-flag', '8e92e1266eb29518b6a4c5313ab8f29dd0d08df9', '2025-04-17 19:30:09.024442');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (13, 'add-bucket-custom-limits', 'cce962054138135cd9a8c4bcd531598684b25e7d', '2025-04-17 19:30:09.028396');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (14, 'use-bytes-for-max-size', '941c41b346f9802b411f06f30e972ad4744dad27', '2025-04-17 19:30:09.036585');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (15, 'add-can-insert-object-function', '934146bc38ead475f4ef4b555c524ee5d66799e5', '2025-04-17 19:30:09.068467');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (16, 'add-version', '76debf38d3fd07dcfc747ca49096457d95b1221b', '2025-04-17 19:30:09.079033');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (17, 'drop-owner-foreign-key', 'f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101', '2025-04-17 19:30:09.083795');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (18, 'add_owner_id_column_deprecate_owner', 'e7a511b379110b08e2f214be852c35414749fe66', '2025-04-17 19:30:09.093037');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (19, 'alter-default-value-objects-id', '02e5e22a78626187e00d173dc45f58fa66a4f043', '2025-04-17 19:30:09.09941');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (20, 'list-objects-with-delimiter', 'cd694ae708e51ba82bf012bba00caf4f3b6393b7', '2025-04-17 19:30:09.11081');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (21, 's3-multipart-uploads', '8c804d4a566c40cd1e4cc5b3725a664a9303657f', '2025-04-17 19:30:09.120501');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (22, 's3-multipart-uploads-big-ints', '9737dc258d2397953c9953d9b86920b8be0cdb73', '2025-04-17 19:30:09.153136');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (23, 'optimize-search-function', '9d7e604cddc4b56a5422dc68c9313f4a1b6f132c', '2025-04-17 19:30:09.177046');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (24, 'operation-function', '8312e37c2bf9e76bbe841aa5fda889206d2bf8aa', '2025-04-17 19:30:09.182176');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (25, 'custom-metadata', 'd974c6057c3db1c1f847afa0e291e6165693b990', '2025-04-17 19:30:09.186532');


--
-- TOC entry 4500 (class 0 OID 16555)
-- Dependencies: 263
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('59fdf024-b1cf-44d6-83d0-4a8059b4219b', 'products', 'store_617989cd-d451-4cda-993a-4643b919bd3a/3e9875d6-1556-4b22-a622-d5a8d2d0ab80.png', '76f5271f-04cc-4747-afbe-e9398303f4a4', '2025-05-24 18:17:26.569913+00', '2025-05-24 18:17:26.569913+00', '2025-05-24 18:17:26.569913+00', '{"eTag": "\"80df34db44f958258d3d4e39dc8cdb25\"", "size": 8721, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-05-24T18:17:27.000Z", "contentLength": 8721, "httpStatusCode": 200}', '8768c8ec-33b0-443c-9df6-7138dba939f8', '76f5271f-04cc-4747-afbe-e9398303f4a4', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('3f5b230f-17ff-4f00-98d7-ec728b5c0117', 'products', 'store_be03e95e-857e-486d-9bc8-26e5e28ac4e8/1770b9f3-0917-4029-945d-e354c87cdb52.png', '76f5271f-04cc-4747-afbe-e9398303f4a4', '2025-06-01 09:55:20.520218+00', '2025-06-01 09:55:20.520218+00', '2025-06-01 09:55:20.520218+00', '{"eTag": "\"a9798dbec1b035eadc92d79d1e326cb7\"", "size": 9042, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-06-01T09:55:21.000Z", "contentLength": 9042, "httpStatusCode": 200}', 'a25b015f-7833-4d9d-9b2c-511bbc6a4590', '76f5271f-04cc-4747-afbe-e9398303f4a4', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('9e5ce4a7-83cd-4a51-a4bd-65a295b3c276', 'products', 'store_617989cd-d451-4cda-993a-4643b919bd3a/7919f997-db5b-4efc-8986-4263b144fb33.png', '76f5271f-04cc-4747-afbe-e9398303f4a4', '2025-06-01 15:35:31.357417+00', '2025-06-01 15:35:31.357417+00', '2025-06-01 15:35:31.357417+00', '{"eTag": "\"a9798dbec1b035eadc92d79d1e326cb7\"", "size": 9042, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-06-01T15:35:32.000Z", "contentLength": 9042, "httpStatusCode": 200}', '8423c3b5-f122-406b-8c5b-39f272e0af3a', '76f5271f-04cc-4747-afbe-e9398303f4a4', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('bb34a13f-3569-4d53-840d-740d7e9d0d08', 'products', 'store_617989cd-d451-4cda-993a-4643b919bd3a/2e710ffe-1a67-4ed2-9724-509402159ec2.png', '76f5271f-04cc-4747-afbe-e9398303f4a4', '2025-06-01 15:47:47.356649+00', '2025-06-01 15:47:47.356649+00', '2025-06-01 15:47:47.356649+00', '{"eTag": "\"80df34db44f958258d3d4e39dc8cdb25\"", "size": 8721, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-06-01T15:47:48.000Z", "contentLength": 8721, "httpStatusCode": 200}', '29400b7f-54a3-45fb-bcb7-00992908fdcd', '76f5271f-04cc-4747-afbe-e9398303f4a4', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('06487ed5-6216-4894-b63d-641c0eb82b41', 'stores', '7fa3af45-5343-4f8f-8c87-849b92be70cc.webp', '76f5271f-04cc-4747-afbe-e9398303f4a4', '2025-06-22 11:37:03.361722+00', '2025-06-22 11:37:03.361722+00', '2025-06-22 11:37:03.361722+00', '{"eTag": "\"94d206f6ec1175b57115d81371bcd99a\"", "size": 6908, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-06-22T11:37:04.000Z", "contentLength": 6908, "httpStatusCode": 200}', 'c8e5c562-90c3-4d37-bf12-a400b9f4120c', '76f5271f-04cc-4747-afbe-e9398303f4a4', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('c59757b8-641b-4b45-8d22-52044c400bf1', 'stores', '84a63799-d556-4b7a-864f-e296476a0182.webp', '76f5271f-04cc-4747-afbe-e9398303f4a4', '2025-06-24 15:27:32.540415+00', '2025-06-24 15:27:32.540415+00', '2025-06-24 15:27:32.540415+00', '{"eTag": "\"8c9f5132e4cea4104b665863eec4db44\"", "size": 9216, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-06-24T15:27:33.000Z", "contentLength": 9216, "httpStatusCode": 200}', 'becbad9c-0f07-4684-9459-94b77c1de088', '76f5271f-04cc-4747-afbe-e9398303f4a4', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('901aba06-163f-453a-a799-05283dfe726a', 'stores', '843e6f29-91ea-495a-8b6a-1a55a668b122.png', '76f5271f-04cc-4747-afbe-e9398303f4a4', '2025-06-27 17:22:21.849957+00', '2025-06-27 17:22:21.849957+00', '2025-06-27 17:22:21.849957+00', '{"eTag": "\"451745ad2eb64e8211dca9823a17a38b\"", "size": 5815, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-06-27T17:22:22.000Z", "contentLength": 5815, "httpStatusCode": 200}', 'd3207d28-d13f-4494-9e6d-f3b225b3d3ad', '76f5271f-04cc-4747-afbe-e9398303f4a4', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('cbfccff9-61f8-4acc-9de3-4d0e4c661d3b', 'stores', '6f974e12-a1ca-41c6-bf80-e36b81ec66d7.png', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', '2025-06-29 15:37:57.688205+00', '2025-06-29 15:37:57.688205+00', '2025-06-29 15:37:57.688205+00', '{"eTag": "\"d2d971786aa427c771fd2eea2e3e9c59\"", "size": 30373, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-06-29T15:37:58.000Z", "contentLength": 30373, "httpStatusCode": 200}', '7e1103ec-06c1-4dbb-9984-4863e64a47a6', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('8f4f1e5e-8e87-4d2d-bd18-03d2b2249cb2', 'public', '.emptyFolderPlaceholder', NULL, '2025-07-05 10:52:26.739854+00', '2025-07-05 10:52:26.739854+00', '2025-07-05 10:52:26.739854+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-07-05T10:52:27.000Z", "contentLength": 0, "httpStatusCode": 200}', '346fdfd9-aa76-42ec-804b-33d3b9de77bf', NULL, '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('92772380-906b-4806-a713-2d76a9c510d3', 'stores', 'c1f88e50-789f-44e4-9516-0848918b0249.png', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', '2025-07-06 13:47:08.393135+00', '2025-07-06 13:47:08.393135+00', '2025-07-06 13:47:08.393135+00', '{"eTag": "\"a9798dbec1b035eadc92d79d1e326cb7\"", "size": 9042, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-07-06T13:47:09.000Z", "contentLength": 9042, "httpStatusCode": 200}', '565fa502-95cf-41d6-a163-8db6d598377d', '603f5f0f-cf02-43d1-a032-14aa486fa6f4', '{}');


--
-- TOC entry 4513 (class 0 OID 17014)
-- Dependencies: 279
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- TOC entry 4514 (class 0 OID 17028)
-- Dependencies: 280
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- TOC entry 4550 (class 0 OID 135115)
-- Dependencies: 321
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--



--
-- TOC entry 4551 (class 0 OID 135122)
-- Dependencies: 322
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--



--
-- TOC entry 3702 (class 0 OID 16650)
-- Dependencies: 265
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- TOC entry 4711 (class 0 OID 0)
-- Dependencies: 257
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 189, true);


--
-- TOC entry 4712 (class 0 OID 0)
-- Dependencies: 305
-- Name: invoice_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_sequence', 1, false);


--
-- TOC entry 4713 (class 0 OID 0)
-- Dependencies: 300
-- Name: tracking_clicks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tracking_clicks_id_seq', 59, true);


--
-- TOC entry 4714 (class 0 OID 0)
-- Dependencies: 292
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- TOC entry 3977 (class 2606 OID 16807)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 3935 (class 2606 OID 16525)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 3999 (class 2606 OID 16913)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 3956 (class 2606 OID 16931)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 3958 (class 2606 OID 16941)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 3933 (class 2606 OID 16518)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 3979 (class 2606 OID 16800)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 3975 (class 2606 OID 16788)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 3967 (class 2606 OID 16981)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 3969 (class 2606 OID 16775)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 4003 (class 2606 OID 16966)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3927 (class 2606 OID 16508)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3930 (class 2606 OID 16717)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 3988 (class 2606 OID 16847)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 3990 (class 2606 OID 16845)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 3995 (class 2606 OID 16861)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 3938 (class 2606 OID 16531)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3962 (class 2606 OID 16738)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3985 (class 2606 OID 16828)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 3981 (class 2606 OID 16819)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 3920 (class 2606 OID 16901)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 3922 (class 2606 OID 16495)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4132 (class 2606 OID 115710)
-- Name: affiliate_tokens affiliate_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliate_tokens
    ADD CONSTRAINT affiliate_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4149 (class 2606 OID 129416)
-- Name: banner_stats banner_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banner_stats
    ADD CONSTRAINT banner_stats_pkey PRIMARY KEY (id);


--
-- TOC entry 4147 (class 2606 OID 129359)
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- TOC entry 4145 (class 2606 OID 129307)
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- TOC entry 4051 (class 2606 OID 17235)
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- TOC entry 4053 (class 2606 OID 17233)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4055 (class 2606 OID 17237)
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- TOC entry 4049 (class 2606 OID 17219)
-- Name: coupon_stats coupon_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_stats
    ADD CONSTRAINT coupon_stats_pkey PRIMARY KEY (id);


--
-- TOC entry 4031 (class 2606 OID 17139)
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- TOC entry 4066 (class 2606 OID 18585)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4130 (class 2606 OID 110113)
-- Name: page_views page_views_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_pkey PRIMARY KEY (id);


--
-- TOC entry 4119 (class 2606 OID 97446)
-- Name: payment_reminders payment_reminders_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_reminders
    ADD CONSTRAINT payment_reminders_invoice_number_key UNIQUE (invoice_number);


--
-- TOC entry 4121 (class 2606 OID 97444)
-- Name: payment_reminders payment_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_reminders
    ADD CONSTRAINT payment_reminders_pkey PRIMARY KEY (id);


--
-- TOC entry 4071 (class 2606 OID 67752)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4013 (class 2606 OID 17085)
-- Name: profiles profiles_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_key UNIQUE (email);


--
-- TOC entry 4015 (class 2606 OID 17081)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 4017 (class 2606 OID 17083)
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- TOC entry 4047 (class 2606 OID 17199)
-- Name: rating_comments rating_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating_comments
    ADD CONSTRAINT rating_comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4043 (class 2606 OID 17177)
-- Name: rating_votes rating_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating_votes
    ADD CONSTRAINT rating_votes_pkey PRIMARY KEY (id);


--
-- TOC entry 4045 (class 2606 OID 17179)
-- Name: rating_votes rating_votes_rating_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating_votes
    ADD CONSTRAINT rating_votes_rating_id_user_id_key UNIQUE (rating_id, user_id);


--
-- TOC entry 4039 (class 2606 OID 17155)
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- TOC entry 4041 (class 2606 OID 17157)
-- Name: ratings ratings_user_id_coupon_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_coupon_id_key UNIQUE (user_id, coupon_id);


--
-- TOC entry 4128 (class 2606 OID 97561)
-- Name: script_pings script_pings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script_pings
    ADD CONSTRAINT script_pings_pkey PRIMARY KEY (id);


--
-- TOC entry 4020 (class 2606 OID 17102)
-- Name: store_applications store_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_applications
    ADD CONSTRAINT store_applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4027 (class 2606 OID 17118)
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- TOC entry 4029 (class 2606 OID 17120)
-- Name: stores stores_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_slug_key UNIQUE (slug);


--
-- TOC entry 4123 (class 2606 OID 97516)
-- Name: system_logs system_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4090 (class 2606 OID 92303)
-- Name: tracking_clicks tracking_clicks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_clicks
    ADD CONSTRAINT tracking_clicks_pkey PRIMARY KEY (id);


--
-- TOC entry 4101 (class 2606 OID 96076)
-- Name: tracking_conversions tracking_conversions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_conversions
    ADD CONSTRAINT tracking_conversions_pkey PRIMARY KEY (id);


--
-- TOC entry 4109 (class 2606 OID 96155)
-- Name: tracking_pixels tracking_pixels_pixel_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_pixels
    ADD CONSTRAINT tracking_pixels_pixel_id_key UNIQUE (pixel_id);


--
-- TOC entry 4111 (class 2606 OID 96153)
-- Name: tracking_pixels tracking_pixels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_pixels
    ADD CONSTRAINT tracking_pixels_pkey PRIMARY KEY (id);


--
-- TOC entry 4103 (class 2606 OID 96078)
-- Name: tracking_conversions unique_order_per_store; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_conversions
    ADD CONSTRAINT unique_order_per_store UNIQUE (store_id, order_id);


--
-- TOC entry 4113 (class 2606 OID 96157)
-- Name: tracking_pixels unique_pixel_per_store; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_pixels
    ADD CONSTRAINT unique_pixel_per_store UNIQUE (store_id, pixel_name);


--
-- TOC entry 4081 (class 2606 OID 91166)
-- Name: utm_tracking_exceptions utm_tracking_exceptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utm_tracking_exceptions
    ADD CONSTRAINT utm_tracking_exceptions_pkey PRIMARY KEY (id);


--
-- TOC entry 4063 (class 2606 OID 17432)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4135 (class 2606 OID 121372)
-- Name: messages_2025_07_18 messages_2025_07_18_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_07_18
    ADD CONSTRAINT messages_2025_07_18_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4137 (class 2606 OID 123611)
-- Name: messages_2025_07_19 messages_2025_07_19_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_07_19
    ADD CONSTRAINT messages_2025_07_19_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4139 (class 2606 OID 123622)
-- Name: messages_2025_07_20 messages_2025_07_20_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_07_20
    ADD CONSTRAINT messages_2025_07_20_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4141 (class 2606 OID 124797)
-- Name: messages_2025_07_21 messages_2025_07_21_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_07_21
    ADD CONSTRAINT messages_2025_07_21_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4143 (class 2606 OID 127014)
-- Name: messages_2025_07_22 messages_2025_07_22_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_07_22
    ADD CONSTRAINT messages_2025_07_22_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4151 (class 2606 OID 129534)
-- Name: messages_2025_07_23 messages_2025_07_23_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_07_23
    ADD CONSTRAINT messages_2025_07_23_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4153 (class 2606 OID 129545)
-- Name: messages_2025_07_24 messages_2025_07_24_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_07_24
    ADD CONSTRAINT messages_2025_07_24_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4060 (class 2606 OID 17287)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 4057 (class 2606 OID 17261)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3941 (class 2606 OID 16548)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 3948 (class 2606 OID 16589)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 3950 (class 2606 OID 16587)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3946 (class 2606 OID 16565)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 4011 (class 2606 OID 17037)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4009 (class 2606 OID 17022)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 4155 (class 2606 OID 135121)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4157 (class 2606 OID 135128)
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- TOC entry 3936 (class 1259 OID 16526)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 3910 (class 1259 OID 16727)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3911 (class 1259 OID 16729)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3912 (class 1259 OID 16730)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3965 (class 1259 OID 16809)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 3997 (class 1259 OID 16917)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 3954 (class 1259 OID 16897)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 4715 (class 0 OID 0)
-- Dependencies: 3954
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 3959 (class 1259 OID 16724)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 4000 (class 1259 OID 16914)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 4001 (class 1259 OID 16915)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 3973 (class 1259 OID 16920)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 3970 (class 1259 OID 16781)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 3971 (class 1259 OID 16926)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 4004 (class 1259 OID 16973)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 4005 (class 1259 OID 16972)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 4006 (class 1259 OID 16974)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 3913 (class 1259 OID 16731)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3914 (class 1259 OID 16728)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3923 (class 1259 OID 16509)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 3924 (class 1259 OID 16510)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 3925 (class 1259 OID 16723)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 3928 (class 1259 OID 16811)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 3931 (class 1259 OID 16916)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 3991 (class 1259 OID 16853)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 3992 (class 1259 OID 16918)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 3993 (class 1259 OID 16868)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 3996 (class 1259 OID 16867)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 3960 (class 1259 OID 16919)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 3963 (class 1259 OID 16810)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 3983 (class 1259 OID 16835)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 3986 (class 1259 OID 16834)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 3982 (class 1259 OID 16820)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 3972 (class 1259 OID 16979)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 3964 (class 1259 OID 16808)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 3915 (class 1259 OID 16888)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 4716 (class 0 OID 0)
-- Dependencies: 3915
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 3916 (class 1259 OID 16725)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 3917 (class 1259 OID 16499)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 3918 (class 1259 OID 16943)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 4133 (class 1259 OID 115716)
-- Name: idx_affiliate_tokens_domain; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_affiliate_tokens_domain ON public.affiliate_tokens USING btree (store_domain);


--
-- TOC entry 4032 (class 1259 OID 92408)
-- Name: idx_coupons_coupon_url; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupons_coupon_url ON public.coupons USING btree (coupon_url) WHERE (coupon_url IS NOT NULL);


--
-- TOC entry 4033 (class 1259 OID 17248)
-- Name: idx_coupons_expiry_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupons_expiry_date ON public.coupons USING btree (expiry_date);


--
-- TOC entry 4034 (class 1259 OID 17249)
-- Name: idx_coupons_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupons_is_active ON public.coupons USING btree (is_active);


--
-- TOC entry 4035 (class 1259 OID 17243)
-- Name: idx_coupons_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupons_store_id ON public.coupons USING btree (store_id);


--
-- TOC entry 4064 (class 1259 OID 18591)
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- TOC entry 4114 (class 1259 OID 97455)
-- Name: idx_payment_reminders_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_reminders_created_at ON public.payment_reminders USING btree (created_at);


--
-- TOC entry 4115 (class 1259 OID 97454)
-- Name: idx_payment_reminders_due_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_reminders_due_date ON public.payment_reminders USING btree (due_date);


--
-- TOC entry 4116 (class 1259 OID 97452)
-- Name: idx_payment_reminders_merchant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_reminders_merchant_id ON public.payment_reminders USING btree (merchant_id);


--
-- TOC entry 4117 (class 1259 OID 97453)
-- Name: idx_payment_reminders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_reminders_status ON public.payment_reminders USING btree (status);


--
-- TOC entry 4036 (class 1259 OID 17244)
-- Name: idx_ratings_coupon_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ratings_coupon_id ON public.ratings USING btree (coupon_id);


--
-- TOC entry 4037 (class 1259 OID 17245)
-- Name: idx_ratings_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ratings_user_id ON public.ratings USING btree (user_id);


--
-- TOC entry 4124 (class 1259 OID 97567)
-- Name: idx_script_pings_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_script_pings_store_id ON public.script_pings USING btree (store_id);


--
-- TOC entry 4125 (class 1259 OID 97569)
-- Name: idx_script_pings_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_script_pings_timestamp ON public.script_pings USING btree (ping_timestamp);


--
-- TOC entry 4126 (class 1259 OID 97568)
-- Name: idx_script_pings_tracking_script_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_script_pings_tracking_script_id ON public.script_pings USING btree (tracking_script_id);


--
-- TOC entry 4018 (class 1259 OID 17246)
-- Name: idx_store_applications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_store_applications_user_id ON public.store_applications USING btree (user_id);


--
-- TOC entry 4021 (class 1259 OID 17247)
-- Name: idx_stores_owner_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stores_owner_id ON public.stores USING btree (user_id);


--
-- TOC entry 4022 (class 1259 OID 97529)
-- Name: idx_stores_script_last_ping; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stores_script_last_ping ON public.stores USING btree (script_last_ping);


--
-- TOC entry 4023 (class 1259 OID 97528)
-- Name: idx_stores_script_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stores_script_status ON public.stores USING btree (script_status);


--
-- TOC entry 4024 (class 1259 OID 58749)
-- Name: idx_stores_store_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stores_store_application_id ON public.stores USING btree (store_application_id);


--
-- TOC entry 4025 (class 1259 OID 97530)
-- Name: idx_stores_tracking_script_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stores_tracking_script_id ON public.stores USING btree (tracking_script_id);


--
-- TOC entry 4082 (class 1259 OID 94846)
-- Name: idx_tracking_clicks_coupon_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_clicks_coupon_id ON public.tracking_clicks USING btree (coupon_id);


--
-- TOC entry 4083 (class 1259 OID 92314)
-- Name: idx_tracking_clicks_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_clicks_created_at ON public.tracking_clicks USING btree (created_at);


--
-- TOC entry 4084 (class 1259 OID 92315)
-- Name: idx_tracking_clicks_session_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_clicks_session_id ON public.tracking_clicks USING btree (session_id);


--
-- TOC entry 4085 (class 1259 OID 94860)
-- Name: idx_tracking_clicks_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_clicks_store_id ON public.tracking_clicks USING btree (store_id);


--
-- TOC entry 4086 (class 1259 OID 92309)
-- Name: idx_tracking_clicks_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_clicks_user_id ON public.tracking_clicks USING btree (user_id);


--
-- TOC entry 4087 (class 1259 OID 92313)
-- Name: idx_tracking_clicks_utm_campaign; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_clicks_utm_campaign ON public.tracking_clicks USING btree (utm_campaign);


--
-- TOC entry 4088 (class 1259 OID 92312)
-- Name: idx_tracking_clicks_utm_source; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_clicks_utm_source ON public.tracking_clicks USING btree (utm_source);


--
-- TOC entry 4091 (class 1259 OID 96101)
-- Name: idx_tracking_conversions_click_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_conversions_click_id ON public.tracking_conversions USING btree (click_id);


--
-- TOC entry 4092 (class 1259 OID 96102)
-- Name: idx_tracking_conversions_converted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_conversions_converted_at ON public.tracking_conversions USING btree (converted_at);


--
-- TOC entry 4093 (class 1259 OID 96104)
-- Name: idx_tracking_conversions_coupon_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_conversions_coupon_id ON public.tracking_conversions USING btree (coupon_id);


--
-- TOC entry 4094 (class 1259 OID 96105)
-- Name: idx_tracking_conversions_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_conversions_order_id ON public.tracking_conversions USING btree (order_id);


--
-- TOC entry 4095 (class 1259 OID 96099)
-- Name: idx_tracking_conversions_owner_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_conversions_owner_id ON public.tracking_conversions USING btree (owner_id);


--
-- TOC entry 4096 (class 1259 OID 96103)
-- Name: idx_tracking_conversions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_conversions_status ON public.tracking_conversions USING btree (status);


--
-- TOC entry 4097 (class 1259 OID 96100)
-- Name: idx_tracking_conversions_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_conversions_store_id ON public.tracking_conversions USING btree (store_id);


--
-- TOC entry 4098 (class 1259 OID 96107)
-- Name: idx_tracking_conversions_utm_campaign; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_conversions_utm_campaign ON public.tracking_conversions USING btree (utm_campaign);


--
-- TOC entry 4099 (class 1259 OID 96106)
-- Name: idx_tracking_conversions_utm_source; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_conversions_utm_source ON public.tracking_conversions USING btree (utm_source);


--
-- TOC entry 4104 (class 1259 OID 96171)
-- Name: idx_tracking_pixels_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_pixels_active ON public.tracking_pixels USING btree (is_active);


--
-- TOC entry 4105 (class 1259 OID 96168)
-- Name: idx_tracking_pixels_owner_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_pixels_owner_id ON public.tracking_pixels USING btree (owner_id);


--
-- TOC entry 4106 (class 1259 OID 96170)
-- Name: idx_tracking_pixels_pixel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_pixels_pixel_id ON public.tracking_pixels USING btree (pixel_id);


--
-- TOC entry 4107 (class 1259 OID 96169)
-- Name: idx_tracking_pixels_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tracking_pixels_store_id ON public.tracking_pixels USING btree (store_id);


--
-- TOC entry 4074 (class 1259 OID 91174)
-- Name: idx_utm_exceptions_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utm_exceptions_active ON public.utm_tracking_exceptions USING btree (is_active);


--
-- TOC entry 4075 (class 1259 OID 91173)
-- Name: idx_utm_exceptions_domain; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utm_exceptions_domain ON public.utm_tracking_exceptions USING btree (domain);


--
-- TOC entry 4076 (class 1259 OID 93568)
-- Name: idx_utm_exceptions_owner_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utm_exceptions_owner_id ON public.utm_tracking_exceptions USING btree (owner_id);


--
-- TOC entry 4077 (class 1259 OID 93570)
-- Name: idx_utm_exceptions_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utm_exceptions_priority ON public.utm_tracking_exceptions USING btree (priority);


--
-- TOC entry 4078 (class 1259 OID 91172)
-- Name: idx_utm_exceptions_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utm_exceptions_store_id ON public.utm_tracking_exceptions USING btree (store_id);


--
-- TOC entry 4079 (class 1259 OID 93569)
-- Name: idx_utm_exceptions_store_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utm_exceptions_store_slug ON public.utm_tracking_exceptions USING btree (store_slug);


--
-- TOC entry 4067 (class 1259 OID 67760)
-- Name: products_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_category_idx ON public.products USING btree (category);


--
-- TOC entry 4068 (class 1259 OID 67761)
-- Name: products_is_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_is_featured_idx ON public.products USING btree (is_featured);


--
-- TOC entry 4069 (class 1259 OID 67762)
-- Name: products_is_new_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_is_new_idx ON public.products USING btree (is_new);


--
-- TOC entry 4072 (class 1259 OID 67759)
-- Name: products_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_status_idx ON public.products USING btree (status);


--
-- TOC entry 4073 (class 1259 OID 67758)
-- Name: products_store_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_store_id_idx ON public.products USING btree (store_id);


--
-- TOC entry 4058 (class 1259 OID 17433)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 4061 (class 1259 OID 17336)
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- TOC entry 3939 (class 1259 OID 16554)
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 3942 (class 1259 OID 16576)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 4007 (class 1259 OID 17048)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 3943 (class 1259 OID 17013)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 3944 (class 1259 OID 16577)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 4158 (class 0 OID 0)
-- Name: messages_2025_07_18_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_07_18_pkey;


--
-- TOC entry 4159 (class 0 OID 0)
-- Name: messages_2025_07_19_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_07_19_pkey;


--
-- TOC entry 4160 (class 0 OID 0)
-- Name: messages_2025_07_20_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_07_20_pkey;


--
-- TOC entry 4161 (class 0 OID 0)
-- Name: messages_2025_07_21_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_07_21_pkey;


--
-- TOC entry 4162 (class 0 OID 0)
-- Name: messages_2025_07_22_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_07_22_pkey;


--
-- TOC entry 4163 (class 0 OID 0)
-- Name: messages_2025_07_23_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_07_23_pkey;


--
-- TOC entry 4164 (class 0 OID 0)
-- Name: messages_2025_07_24_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_07_24_pkey;


--
-- TOC entry 4209 (class 2620 OID 18559)
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- TOC entry 4224 (class 2620 OID 97460)
-- Name: payment_reminders generate_invoice_number_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER generate_invoice_number_trigger BEFORE INSERT ON public.payment_reminders FOR EACH ROW EXECUTE FUNCTION public.generate_invoice_number();


--
-- TOC entry 4225 (class 2620 OID 97457)
-- Name: payment_reminders payment_reminders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER payment_reminders_updated_at BEFORE UPDATE ON public.payment_reminders FOR EACH ROW EXECUTE FUNCTION public.update_payment_reminders_updated_at();


--
-- TOC entry 4215 (class 2620 OID 122479)
-- Name: coupons trg_deactivate_expired_coupons; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_deactivate_expired_coupons BEFORE INSERT OR UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.deactivate_expired_coupons();


--
-- TOC entry 4212 (class 2620 OID 58839)
-- Name: store_applications trigger_auto_create_store_on_approval; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_auto_create_store_on_approval AFTER UPDATE OF status ON public.store_applications FOR EACH ROW EXECUTE FUNCTION public.auto_create_store_on_approval();


--
-- TOC entry 4222 (class 2620 OID 96176)
-- Name: tracking_pixels trigger_auto_generate_pixel_id; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_auto_generate_pixel_id BEFORE INSERT ON public.tracking_pixels FOR EACH ROW EXECUTE FUNCTION public.auto_generate_pixel_id();


--
-- TOC entry 4220 (class 2620 OID 92318)
-- Name: tracking_clicks trigger_set_device_type; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_set_device_type BEFORE INSERT OR UPDATE ON public.tracking_clicks FOR EACH ROW EXECUTE FUNCTION public.set_device_type();


--
-- TOC entry 4221 (class 2620 OID 96109)
-- Name: tracking_conversions trigger_update_tracking_conversions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_tracking_conversions_updated_at BEFORE UPDATE ON public.tracking_conversions FOR EACH ROW EXECUTE FUNCTION public.update_tracking_conversions_updated_at();


--
-- TOC entry 4223 (class 2620 OID 96173)
-- Name: tracking_pixels trigger_update_tracking_pixels_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_tracking_pixels_updated_at BEFORE UPDATE ON public.tracking_pixels FOR EACH ROW EXECUTE FUNCTION public.update_tracking_pixels_updated_at();


--
-- TOC entry 4216 (class 2620 OID 17254)
-- Name: coupons update_coupons_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4211 (class 2620 OID 17251)
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4218 (class 2620 OID 17256)
-- Name: rating_comments update_rating_comments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_rating_comments_updated_at BEFORE UPDATE ON public.rating_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4217 (class 2620 OID 17255)
-- Name: ratings update_ratings_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4213 (class 2620 OID 17252)
-- Name: store_applications update_store_applications_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_store_applications_updated_at BEFORE UPDATE ON public.store_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4214 (class 2620 OID 17253)
-- Name: stores update_stores_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4219 (class 2620 OID 17292)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 4210 (class 2620 OID 17001)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 4167 (class 2606 OID 16711)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4171 (class 2606 OID 16801)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4170 (class 2606 OID 16789)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 4169 (class 2606 OID 16776)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4176 (class 2606 OID 16967)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4165 (class 2606 OID 16744)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4173 (class 2606 OID 16848)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4174 (class 2606 OID 16921)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 4175 (class 2606 OID 16862)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4168 (class 2606 OID 16739)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4172 (class 2606 OID 16829)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4206 (class 2606 OID 115711)
-- Name: affiliate_tokens affiliate_tokens_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliate_tokens
    ADD CONSTRAINT affiliate_tokens_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 4208 (class 2606 OID 129417)
-- Name: banner_stats banner_stats_banner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banner_stats
    ADD CONSTRAINT banner_stats_banner_id_fkey FOREIGN KEY (banner_id) REFERENCES public.banners(id) ON DELETE CASCADE;


--
-- TOC entry 4207 (class 2606 OID 129360)
-- Name: banners banners_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id);


--
-- TOC entry 4192 (class 2606 OID 17238)
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id);


--
-- TOC entry 4191 (class 2606 OID 17220)
-- Name: coupon_stats coupon_stats_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_stats
    ADD CONSTRAINT coupon_stats_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id);


--
-- TOC entry 4184 (class 2606 OID 17140)
-- Name: coupons coupons_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id);


--
-- TOC entry 4193 (class 2606 OID 18586)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- TOC entry 4204 (class 2606 OID 97447)
-- Name: payment_reminders payment_reminders_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_reminders
    ADD CONSTRAINT payment_reminders_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4194 (class 2606 OID 67753)
-- Name: products products_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 4180 (class 2606 OID 17086)
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);


--
-- TOC entry 4189 (class 2606 OID 17200)
-- Name: rating_comments rating_comments_rating_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating_comments
    ADD CONSTRAINT rating_comments_rating_id_fkey FOREIGN KEY (rating_id) REFERENCES public.ratings(id);


--
-- TOC entry 4190 (class 2606 OID 17205)
-- Name: rating_comments rating_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating_comments
    ADD CONSTRAINT rating_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- TOC entry 4187 (class 2606 OID 17180)
-- Name: rating_votes rating_votes_rating_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating_votes
    ADD CONSTRAINT rating_votes_rating_id_fkey FOREIGN KEY (rating_id) REFERENCES public.ratings(id);


--
-- TOC entry 4188 (class 2606 OID 17185)
-- Name: rating_votes rating_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating_votes
    ADD CONSTRAINT rating_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- TOC entry 4185 (class 2606 OID 17163)
-- Name: ratings ratings_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id);


--
-- TOC entry 4186 (class 2606 OID 17158)
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- TOC entry 4205 (class 2606 OID 97562)
-- Name: script_pings script_pings_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script_pings
    ADD CONSTRAINT script_pings_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 4181 (class 2606 OID 17103)
-- Name: store_applications store_applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_applications
    ADD CONSTRAINT store_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- TOC entry 4182 (class 2606 OID 58744)
-- Name: stores stores_store_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_store_application_id_fkey FOREIGN KEY (store_application_id) REFERENCES public.store_applications(id);


--
-- TOC entry 4183 (class 2606 OID 19762)
-- Name: stores stores_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- TOC entry 4197 (class 2606 OID 92304)
-- Name: tracking_clicks tracking_clicks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_clicks
    ADD CONSTRAINT tracking_clicks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- TOC entry 4198 (class 2606 OID 96089)
-- Name: tracking_conversions tracking_conversions_click_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_conversions
    ADD CONSTRAINT tracking_conversions_click_id_fkey FOREIGN KEY (click_id) REFERENCES public.tracking_clicks(id) ON DELETE SET NULL;


--
-- TOC entry 4199 (class 2606 OID 96094)
-- Name: tracking_conversions tracking_conversions_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_conversions
    ADD CONSTRAINT tracking_conversions_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON DELETE SET NULL;


--
-- TOC entry 4200 (class 2606 OID 96079)
-- Name: tracking_conversions tracking_conversions_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_conversions
    ADD CONSTRAINT tracking_conversions_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- TOC entry 4201 (class 2606 OID 96084)
-- Name: tracking_conversions tracking_conversions_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_conversions
    ADD CONSTRAINT tracking_conversions_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 4202 (class 2606 OID 96158)
-- Name: tracking_pixels tracking_pixels_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_pixels
    ADD CONSTRAINT tracking_pixels_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- TOC entry 4203 (class 2606 OID 96163)
-- Name: tracking_pixels tracking_pixels_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_pixels
    ADD CONSTRAINT tracking_pixels_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 4195 (class 2606 OID 93563)
-- Name: utm_tracking_exceptions utm_tracking_exceptions_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utm_tracking_exceptions
    ADD CONSTRAINT utm_tracking_exceptions_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- TOC entry 4196 (class 2606 OID 91167)
-- Name: utm_tracking_exceptions utm_tracking_exceptions_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utm_tracking_exceptions
    ADD CONSTRAINT utm_tracking_exceptions_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 4166 (class 2606 OID 16566)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4177 (class 2606 OID 17023)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4178 (class 2606 OID 17043)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4179 (class 2606 OID 17038)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 4374 (class 0 OID 16519)
-- Dependencies: 260
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4388 (class 0 OID 16907)
-- Dependencies: 277
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4379 (class 0 OID 16704)
-- Dependencies: 268
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4373 (class 0 OID 16512)
-- Dependencies: 259
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4383 (class 0 OID 16794)
-- Dependencies: 272
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4382 (class 0 OID 16782)
-- Dependencies: 271
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4381 (class 0 OID 16769)
-- Dependencies: 270
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4389 (class 0 OID 16957)
-- Dependencies: 278
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4372 (class 0 OID 16501)
-- Dependencies: 258
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4386 (class 0 OID 16836)
-- Dependencies: 275
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4387 (class 0 OID 16854)
-- Dependencies: 276
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4375 (class 0 OID 16527)
-- Dependencies: 261
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4380 (class 0 OID 16734)
-- Dependencies: 269
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4385 (class 0 OID 16821)
-- Dependencies: 274
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4384 (class 0 OID 16812)
-- Dependencies: 273
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4371 (class 0 OID 16489)
-- Dependencies: 256
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4421 (class 3256 OID 18573)
-- Name: coupons Administradores pueden actualizar cualquier cupón; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Administradores pueden actualizar cualquier cupón" ON public.coupons FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4409 (class 3256 OID 18562)
-- Name: profiles Administradores pueden actualizar cualquier perfil; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Administradores pueden actualizar cualquier perfil" ON public.profiles FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.profiles profiles_1
  WHERE ((profiles_1.id = auth.uid()) AND (profiles_1.role = 'admin'::text)))));


--
-- TOC entry 4430 (class 3256 OID 27544)
-- Name: store_applications Administradores pueden actualizar cualquier solicitud; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Administradores pueden actualizar cualquier solicitud" ON public.store_applications FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4414 (class 3256 OID 18567)
-- Name: stores Administradores pueden actualizar cualquier tienda; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Administradores pueden actualizar cualquier tienda" ON public.stores FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4424 (class 3256 OID 18575)
-- Name: coupons Administradores pueden eliminar cualquier cupón; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Administradores pueden eliminar cualquier cupón" ON public.coupons FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4427 (class 3256 OID 18594)
-- Name: notifications Administradores pueden ver todas las notificaciones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Administradores pueden ver todas las notificaciones" ON public.notifications FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4429 (class 3256 OID 27543)
-- Name: store_applications Administradores pueden ver todas las solicitudes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Administradores pueden ver todas las solicitudes" ON public.store_applications FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4412 (class 3256 OID 18565)
-- Name: stores Administradores pueden ver todas las tiendas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Administradores pueden ver todas las tiendas" ON public.stores FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4418 (class 3256 OID 18570)
-- Name: coupons Administradores pueden ver todos los cupones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Administradores pueden ver todos los cupones" ON public.coupons FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4448 (class 3256 OID 67768)
-- Name: products Admins can do everything with products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can do everything with products" ON public.products TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4449 (class 3256 OID 91175)
-- Name: utm_tracking_exceptions Admins can manage UTM exceptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage UTM exceptions" ON public.utm_tracking_exceptions USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4474 (class 3256 OID 96290)
-- Name: tracking_conversions Admins can manage all conversions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all conversions" ON public.tracking_conversions TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4478 (class 3256 OID 97483)
-- Name: payment_reminders Admins can manage all payment reminders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all payment reminders" ON public.payment_reminders USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4461 (class 3256 OID 96181)
-- Name: tracking_pixels Admins can manage all pixels; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all pixels" ON public.tracking_pixels USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4489 (class 3256 OID 97620)
-- Name: store_applications Admins can update applications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update applications" ON public.store_applications FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4488 (class 3256 OID 97619)
-- Name: store_applications Admins can view all applications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all applications" ON public.store_applications FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4482 (class 3256 OID 97571)
-- Name: script_pings Admins can view all script pings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all script pings" ON public.script_pings USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4453 (class 3256 OID 92321)
-- Name: tracking_clicks Allow admins full access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admins full access" ON public.tracking_clicks USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- TOC entry 4454 (class 3256 OID 92362)
-- Name: tracking_clicks Allow all insertions from API; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow all insertions from API" ON public.tracking_clicks FOR INSERT WITH CHECK (true);


--
-- TOC entry 4451 (class 3256 OID 92319)
-- Name: tracking_clicks Allow anonymous inserts for tracking; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow anonymous inserts for tracking" ON public.tracking_clicks FOR INSERT WITH CHECK (true);


--
-- TOC entry 4452 (class 3256 OID 92320)
-- Name: tracking_clicks Allow authenticated users to read their own data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated users to read their own data" ON public.tracking_clicks FOR SELECT USING (((auth.uid() = user_id) OR (auth.uid() IS NOT NULL)));


--
-- TOC entry 4476 (class 3256 OID 96292)
-- Name: tracking_conversions Allow conversion tracking inserts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow conversion tracking inserts" ON public.tracking_conversions FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- TOC entry 4483 (class 3256 OID 97572)
-- Name: script_pings Allow script ping insertion; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow script ping insertion" ON public.script_pings FOR INSERT WITH CHECK (true);


--
-- TOC entry 4485 (class 3256 OID 97595)
-- Name: stores Allow script status updates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow script status updates" ON public.stores FOR UPDATE USING (true) WITH CHECK (true);


--
-- TOC entry 4486 (class 3256 OID 97617)
-- Name: store_applications Any authenticated user can create store applications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Any authenticated user can create store applications" ON public.store_applications FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4420 (class 3256 OID 18572)
-- Name: coupons Comerciantes pueden actualizar sus cupones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Comerciantes pueden actualizar sus cupones" ON public.coupons FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = coupons.store_id) AND (stores.user_id = auth.uid())))));


--
-- TOC entry 4423 (class 3256 OID 18574)
-- Name: coupons Comerciantes pueden eliminar sus cupones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Comerciantes pueden eliminar sus cupones" ON public.coupons FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = coupons.store_id) AND (stores.user_id = auth.uid())))));


--
-- TOC entry 4419 (class 3256 OID 18571)
-- Name: coupons Comerciantes pueden insertar cupones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Comerciantes pueden insertar cupones" ON public.coupons FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = coupons.store_id) AND (stores.user_id = auth.uid())))));


--
-- TOC entry 4417 (class 3256 OID 18569)
-- Name: coupons Comerciantes pueden ver sus cupones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Comerciantes pueden ver sus cupones" ON public.coupons FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = coupons.store_id) AND (stores.user_id = auth.uid())))));


--
-- TOC entry 4450 (class 3256 OID 91176)
-- Name: utm_tracking_exceptions Everyone can read UTM exceptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Everyone can read UTM exceptions" ON public.utm_tracking_exceptions FOR SELECT USING ((is_active = true));


--
-- TOC entry 4463 (class 3256 OID 96259)
-- Name: stores Merchants can create multiple stores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can create multiple stores" ON public.stores FOR INSERT TO authenticated WITH CHECK (((auth.uid() = owner_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role = 'merchant'::text) OR (profiles.role = 'admin'::text)))))));


--
-- TOC entry 4473 (class 3256 OID 96269)
-- Name: coupons Merchants can delete own coupons; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can delete own coupons" ON public.coupons FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = coupons.store_id) AND (stores.owner_id = auth.uid())))));


--
-- TOC entry 4469 (class 3256 OID 96265)
-- Name: products Merchants can delete own products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can delete own products" ON public.products FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = products.store_id) AND (stores.owner_id = auth.uid())))));


--
-- TOC entry 4465 (class 3256 OID 96261)
-- Name: stores Merchants can delete their own stores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can delete their own stores" ON public.stores FOR DELETE TO authenticated USING ((auth.uid() = owner_id));


--
-- TOC entry 4471 (class 3256 OID 96267)
-- Name: coupons Merchants can insert coupons; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can insert coupons" ON public.coupons FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = coupons.store_id) AND (stores.owner_id = auth.uid())))));


--
-- TOC entry 4467 (class 3256 OID 96263)
-- Name: products Merchants can insert products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = products.store_id) AND (stores.owner_id = auth.uid())))));


--
-- TOC entry 4477 (class 3256 OID 96293)
-- Name: tracking_conversions Merchants can update own conversion status; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can update own conversion status" ON public.tracking_conversions FOR UPDATE TO authenticated USING (((owner_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = tracking_conversions.store_id) AND (stores.owner_id = auth.uid())))))) WITH CHECK (((owner_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = tracking_conversions.store_id) AND (stores.owner_id = auth.uid()))))));


--
-- TOC entry 4472 (class 3256 OID 96268)
-- Name: coupons Merchants can update own coupons; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can update own coupons" ON public.coupons FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = coupons.store_id) AND (stores.owner_id = auth.uid())))));


--
-- TOC entry 4468 (class 3256 OID 96264)
-- Name: products Merchants can update own products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can update own products" ON public.products FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = products.store_id) AND (stores.owner_id = auth.uid())))));


--
-- TOC entry 4484 (class 3256 OID 97594)
-- Name: stores Merchants can update own stores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can update own stores" ON public.stores FOR UPDATE USING ((owner_id = auth.uid())) WITH CHECK ((owner_id = auth.uid()));


--
-- TOC entry 4464 (class 3256 OID 96260)
-- Name: stores Merchants can update their own stores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can update their own stores" ON public.stores FOR UPDATE TO authenticated USING ((auth.uid() = owner_id)) WITH CHECK ((auth.uid() = owner_id));


--
-- TOC entry 4470 (class 3256 OID 96266)
-- Name: coupons Merchants can view own coupons; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can view own coupons" ON public.coupons FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = coupons.store_id) AND (stores.owner_id = auth.uid())))));


--
-- TOC entry 4466 (class 3256 OID 96262)
-- Name: products Merchants can view own products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can view own products" ON public.products FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = products.store_id) AND (stores.owner_id = auth.uid())))));


--
-- TOC entry 4481 (class 3256 OID 97570)
-- Name: script_pings Merchants can view own script pings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can view own script pings" ON public.script_pings FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = script_pings.store_id) AND (stores.owner_id = auth.uid())))));


--
-- TOC entry 4475 (class 3256 OID 96291)
-- Name: tracking_conversions Merchants can view own store conversions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can view own store conversions" ON public.tracking_conversions FOR SELECT TO authenticated USING (((owner_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.stores
  WHERE ((stores.id = tracking_conversions.store_id) AND (stores.owner_id = auth.uid()))))));


--
-- TOC entry 4422 (class 3256 OID 97482)
-- Name: payment_reminders Merchants can view their own payment reminders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can view their own payment reminders" ON public.payment_reminders FOR SELECT USING ((auth.uid() = merchant_id));


--
-- TOC entry 4462 (class 3256 OID 96258)
-- Name: stores Merchants can view their own stores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Merchants can view their own stores" ON public.stores FOR SELECT TO authenticated USING (((auth.uid() = owner_id) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))));


--
-- TOC entry 4413 (class 3256 OID 18566)
-- Name: stores Propietarios pueden actualizar sus tiendas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Propietarios pueden actualizar sus tiendas" ON public.stores FOR UPDATE USING ((user_id = auth.uid()));


--
-- TOC entry 4411 (class 3256 OID 18564)
-- Name: stores Propietarios pueden ver sus tiendas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Propietarios pueden ver sus tiendas" ON public.stores FOR SELECT USING ((user_id = auth.uid()));


--
-- TOC entry 4447 (class 3256 OID 67763)
-- Name: products Public can view active products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view active products" ON public.products FOR SELECT TO authenticated, anon USING (((status)::text = 'active'::text));


--
-- TOC entry 4479 (class 3256 OID 97484)
-- Name: payment_reminders System can insert payment reminders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can insert payment reminders" ON public.payment_reminders FOR INSERT WITH CHECK (true);


--
-- TOC entry 4480 (class 3256 OID 97485)
-- Name: payment_reminders System can update payment reminders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can update payment reminders" ON public.payment_reminders FOR UPDATE USING (true);


--
-- TOC entry 4415 (class 3256 OID 18568)
-- Name: coupons Todos pueden ver cupones activos; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Todos pueden ver cupones activos" ON public.coupons FOR SELECT USING ((is_active = true));


--
-- TOC entry 4410 (class 3256 OID 18563)
-- Name: stores Todos pueden ver tiendas activas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Todos pueden ver tiendas activas" ON public.stores FOR SELECT USING ((is_active = true));


--
-- TOC entry 4458 (class 3256 OID 96178)
-- Name: tracking_pixels Users can create own pixels; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create own pixels" ON public.tracking_pixels FOR INSERT WITH CHECK ((auth.uid() = owner_id));


--
-- TOC entry 4460 (class 3256 OID 96180)
-- Name: tracking_pixels Users can delete own pixels; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own pixels" ON public.tracking_pixels FOR DELETE USING ((auth.uid() = owner_id));


--
-- TOC entry 4459 (class 3256 OID 96179)
-- Name: tracking_pixels Users can update own pixels; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own pixels" ON public.tracking_pixels FOR UPDATE USING ((auth.uid() = owner_id));


--
-- TOC entry 4487 (class 3256 OID 97618)
-- Name: store_applications Users can view own applications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own applications" ON public.store_applications FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- TOC entry 4457 (class 3256 OID 96177)
-- Name: tracking_pixels Users can view own pixels; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own pixels" ON public.tracking_pixels FOR SELECT USING ((auth.uid() = owner_id));


--
-- TOC entry 4408 (class 3256 OID 18561)
-- Name: profiles Usuarios pueden actualizar su propio perfil; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- TOC entry 4426 (class 3256 OID 18593)
-- Name: notifications Usuarios pueden actualizar sus propias notificaciones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios pueden actualizar sus propias notificaciones" ON public.notifications FOR UPDATE USING ((user_id = auth.uid()));


--
-- TOC entry 4428 (class 3256 OID 27541)
-- Name: store_applications Usuarios pueden crear solicitudes de tienda; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios pueden crear solicitudes de tienda" ON public.store_applications FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4407 (class 3256 OID 18560)
-- Name: profiles Usuarios pueden ver perfiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios pueden ver perfiles" ON public.profiles FOR SELECT USING (true);


--
-- TOC entry 4425 (class 3256 OID 18592)
-- Name: notifications Usuarios pueden ver sus propias notificaciones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios pueden ver sus propias notificaciones" ON public.notifications FOR SELECT USING ((user_id = auth.uid()));


--
-- TOC entry 4416 (class 3256 OID 27542)
-- Name: store_applications Usuarios pueden ver sus propias solicitudes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios pueden ver sus propias solicitudes" ON public.store_applications FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4397 (class 0 OID 17210)
-- Dependencies: 288
-- Name: coupon_stats; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.coupon_stats ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4395 (class 0 OID 17126)
-- Dependencies: 284
-- Name: coupons; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4399 (class 0 OID 18576)
-- Dependencies: 297
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4405 (class 0 OID 97430)
-- Dependencies: 304
-- Name: payment_reminders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4400 (class 0 OID 67738)
-- Dependencies: 298
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4392 (class 0 OID 17071)
-- Dependencies: 281
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4396 (class 0 OID 17145)
-- Dependencies: 285
-- Name: ratings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4406 (class 0 OID 97552)
-- Dependencies: 307
-- Name: script_pings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.script_pings ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4393 (class 0 OID 17091)
-- Dependencies: 282
-- Name: store_applications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.store_applications ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4394 (class 0 OID 17108)
-- Dependencies: 283
-- Name: stores; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4402 (class 0 OID 92292)
-- Dependencies: 301
-- Name: tracking_clicks; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tracking_clicks ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4455 (class 3256 OID 92386)
-- Name: tracking_clicks tracking_clicks_public_insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tracking_clicks_public_insert ON public.tracking_clicks FOR INSERT WITH CHECK (true);


--
-- TOC entry 4456 (class 3256 OID 92387)
-- Name: tracking_clicks tracking_clicks_public_select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tracking_clicks_public_select ON public.tracking_clicks FOR SELECT USING (true);


--
-- TOC entry 4403 (class 0 OID 96058)
-- Dependencies: 302
-- Name: tracking_conversions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tracking_conversions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4404 (class 0 OID 96133)
-- Dependencies: 303
-- Name: tracking_pixels; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tracking_pixels ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4401 (class 0 OID 91156)
-- Dependencies: 299
-- Name: utm_tracking_exceptions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.utm_tracking_exceptions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4398 (class 0 OID 17418)
-- Dependencies: 296
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4434 (class 3256 OID 53076)
-- Name: objects Authenticated Users Can Delete Own Files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Delete Own Files" ON storage.objects FOR DELETE USING (((bucket_id = 'public'::text) AND (auth.uid() = owner)));


--
-- TOC entry 4438 (class 3256 OID 53080)
-- Name: objects Authenticated Users Can Delete Own Products; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Delete Own Products" ON storage.objects FOR DELETE USING (((bucket_id = 'products'::text) AND (auth.uid() = owner)));


--
-- TOC entry 4446 (class 3256 OID 53088)
-- Name: objects Authenticated Users Can Delete Own Profiles; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Delete Own Profiles" ON storage.objects FOR DELETE USING (((bucket_id = 'profiles'::text) AND (auth.uid() = owner)));


--
-- TOC entry 4442 (class 3256 OID 53084)
-- Name: objects Authenticated Users Can Delete Own Stores; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Delete Own Stores" ON storage.objects FOR DELETE USING (((bucket_id = 'stores'::text) AND (auth.uid() = owner)));


--
-- TOC entry 4433 (class 3256 OID 53075)
-- Name: objects Authenticated Users Can Update Own Files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Update Own Files" ON storage.objects FOR UPDATE USING (((bucket_id = 'public'::text) AND (auth.uid() = owner)));


--
-- TOC entry 4437 (class 3256 OID 53079)
-- Name: objects Authenticated Users Can Update Own Products; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Update Own Products" ON storage.objects FOR UPDATE USING (((bucket_id = 'products'::text) AND (auth.uid() = owner)));


--
-- TOC entry 4445 (class 3256 OID 53087)
-- Name: objects Authenticated Users Can Update Own Profiles; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Update Own Profiles" ON storage.objects FOR UPDATE USING (((bucket_id = 'profiles'::text) AND (auth.uid() = owner)));


--
-- TOC entry 4441 (class 3256 OID 53083)
-- Name: objects Authenticated Users Can Update Own Stores; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Update Own Stores" ON storage.objects FOR UPDATE USING (((bucket_id = 'stores'::text) AND (auth.uid() = owner)));


--
-- TOC entry 4432 (class 3256 OID 53074)
-- Name: objects Authenticated Users Can Upload; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Upload" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'public'::text) AND (auth.role() = 'authenticated'::text)));


--
-- TOC entry 4436 (class 3256 OID 53078)
-- Name: objects Authenticated Users Can Upload Products; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Upload Products" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'products'::text) AND (auth.role() = 'authenticated'::text)));


--
-- TOC entry 4444 (class 3256 OID 53086)
-- Name: objects Authenticated Users Can Upload Profiles; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Upload Profiles" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'profiles'::text) AND (auth.role() = 'authenticated'::text)));


--
-- TOC entry 4440 (class 3256 OID 53082)
-- Name: objects Authenticated Users Can Upload Stores; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Users Can Upload Stores" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'stores'::text) AND (auth.role() = 'authenticated'::text)));


--
-- TOC entry 4431 (class 3256 OID 53073)
-- Name: objects Public Access; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ((bucket_id = 'public'::text));


--
-- TOC entry 4435 (class 3256 OID 53077)
-- Name: objects Public Read Products; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public Read Products" ON storage.objects FOR SELECT USING ((bucket_id = 'products'::text));


--
-- TOC entry 4443 (class 3256 OID 53085)
-- Name: objects Public Read Profiles; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public Read Profiles" ON storage.objects FOR SELECT USING ((bucket_id = 'profiles'::text));


--
-- TOC entry 4439 (class 3256 OID 53081)
-- Name: objects Public Read Stores; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public Read Stores" ON storage.objects FOR SELECT USING ((bucket_id = 'stores'::text));


--
-- TOC entry 4376 (class 0 OID 16540)
-- Dependencies: 262
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4378 (class 0 OID 16582)
-- Dependencies: 264
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4377 (class 0 OID 16555)
-- Dependencies: 263
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4390 (class 0 OID 17014)
-- Dependencies: 279
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4391 (class 0 OID 17028)
-- Dependencies: 280
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4559 (class 0 OID 0)
-- Dependencies: 4557
-- Name: DATABASE postgres; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON DATABASE postgres TO dashboard_user;


--
-- TOC entry 4561 (class 0 OID 0)
-- Dependencies: 21
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT ALL ON SCHEMA auth TO postgres;


--
-- TOC entry 4562 (class 0 OID 0)
-- Dependencies: 18
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- TOC entry 4564 (class 0 OID 0)
-- Dependencies: 13
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 4565 (class 0 OID 0)
-- Dependencies: 32
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- TOC entry 4566 (class 0 OID 0)
-- Dependencies: 19
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT ALL ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- TOC entry 4567 (class 0 OID 0)
-- Dependencies: 26
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;


--
-- TOC entry 4569 (class 0 OID 0)
-- Dependencies: 387
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- TOC entry 4570 (class 0 OID 0)
-- Dependencies: 467
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- TOC entry 4572 (class 0 OID 0)
-- Dependencies: 386
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- TOC entry 4574 (class 0 OID 0)
-- Dependencies: 385
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- TOC entry 4576 (class 0 OID 0)
-- Dependencies: 451
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- TOC entry 4578 (class 0 OID 0)
-- Dependencies: 459
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4580 (class 0 OID 0)
-- Dependencies: 457
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- TOC entry 4581 (class 0 OID 0)
-- Dependencies: 456
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4582 (class 0 OID 0)
-- Dependencies: 411
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4584 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4585 (class 0 OID 0)
-- Dependencies: 365
-- Name: FUNCTION add_store_utm_exception(p_store_id uuid, p_reason text, p_affiliate_program text, p_affiliate_id text, p_priority integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.add_store_utm_exception(p_store_id uuid, p_reason text, p_affiliate_program text, p_affiliate_id text, p_priority integer) TO anon;
GRANT ALL ON FUNCTION public.add_store_utm_exception(p_store_id uuid, p_reason text, p_affiliate_program text, p_affiliate_id text, p_priority integer) TO authenticated;
GRANT ALL ON FUNCTION public.add_store_utm_exception(p_store_id uuid, p_reason text, p_affiliate_program text, p_affiliate_id text, p_priority integer) TO service_role;


--
-- TOC entry 4586 (class 0 OID 0)
-- Dependencies: 412
-- Name: FUNCTION auto_create_store_on_approval(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.auto_create_store_on_approval() TO anon;
GRANT ALL ON FUNCTION public.auto_create_store_on_approval() TO authenticated;
GRANT ALL ON FUNCTION public.auto_create_store_on_approval() TO service_role;


--
-- TOC entry 4587 (class 0 OID 0)
-- Dependencies: 399
-- Name: FUNCTION auto_generate_pixel_id(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.auto_generate_pixel_id() TO anon;
GRANT ALL ON FUNCTION public.auto_generate_pixel_id() TO authenticated;
GRANT ALL ON FUNCTION public.auto_generate_pixel_id() TO service_role;


--
-- TOC entry 4588 (class 0 OID 0)
-- Dependencies: 325
-- Name: FUNCTION deactivate_expired_coupons(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.deactivate_expired_coupons() TO anon;
GRANT ALL ON FUNCTION public.deactivate_expired_coupons() TO authenticated;
GRANT ALL ON FUNCTION public.deactivate_expired_coupons() TO service_role;


--
-- TOC entry 4589 (class 0 OID 0)
-- Dependencies: 326
-- Name: FUNCTION detect_device_type(user_agent_string text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.detect_device_type(user_agent_string text) TO anon;
GRANT ALL ON FUNCTION public.detect_device_type(user_agent_string text) TO authenticated;
GRANT ALL ON FUNCTION public.detect_device_type(user_agent_string text) TO service_role;


--
-- TOC entry 4590 (class 0 OID 0)
-- Dependencies: 329
-- Name: FUNCTION generate_invoice_number(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_invoice_number() TO anon;
GRANT ALL ON FUNCTION public.generate_invoice_number() TO authenticated;
GRANT ALL ON FUNCTION public.generate_invoice_number() TO service_role;


--
-- TOC entry 4591 (class 0 OID 0)
-- Dependencies: 394
-- Name: FUNCTION generate_monthly_payment_reminders(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_monthly_payment_reminders() TO anon;
GRANT ALL ON FUNCTION public.generate_monthly_payment_reminders() TO authenticated;
GRANT ALL ON FUNCTION public.generate_monthly_payment_reminders() TO service_role;


--
-- TOC entry 4592 (class 0 OID 0)
-- Dependencies: 398
-- Name: FUNCTION generate_pixel_id(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_pixel_id() TO anon;
GRANT ALL ON FUNCTION public.generate_pixel_id() TO authenticated;
GRANT ALL ON FUNCTION public.generate_pixel_id() TO service_role;


--
-- TOC entry 4593 (class 0 OID 0)
-- Dependencies: 324
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- TOC entry 4594 (class 0 OID 0)
-- Dependencies: 395
-- Name: FUNCTION send_pending_payment_reminders(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.send_pending_payment_reminders() TO anon;
GRANT ALL ON FUNCTION public.send_pending_payment_reminders() TO authenticated;
GRANT ALL ON FUNCTION public.send_pending_payment_reminders() TO service_role;


--
-- TOC entry 4595 (class 0 OID 0)
-- Dependencies: 327
-- Name: FUNCTION set_device_type(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_device_type() TO anon;
GRANT ALL ON FUNCTION public.set_device_type() TO authenticated;
GRANT ALL ON FUNCTION public.set_device_type() TO service_role;


--
-- TOC entry 4596 (class 0 OID 0)
-- Dependencies: 366
-- Name: FUNCTION should_exclude_utm_tracking(p_store_id uuid, p_domain text, p_owner_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.should_exclude_utm_tracking(p_store_id uuid, p_domain text, p_owner_id uuid) TO anon;
GRANT ALL ON FUNCTION public.should_exclude_utm_tracking(p_store_id uuid, p_domain text, p_owner_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.should_exclude_utm_tracking(p_store_id uuid, p_domain text, p_owner_id uuid) TO service_role;


--
-- TOC entry 4597 (class 0 OID 0)
-- Dependencies: 323
-- Name: FUNCTION update_payment_reminders_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_payment_reminders_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_payment_reminders_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_payment_reminders_updated_at() TO service_role;


--
-- TOC entry 4598 (class 0 OID 0)
-- Dependencies: 388
-- Name: FUNCTION update_tracking_conversions_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_tracking_conversions_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_tracking_conversions_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_tracking_conversions_updated_at() TO service_role;


--
-- TOC entry 4599 (class 0 OID 0)
-- Dependencies: 397
-- Name: FUNCTION update_tracking_pixels_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_tracking_pixels_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_tracking_pixels_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_tracking_pixels_updated_at() TO service_role;


--
-- TOC entry 4600 (class 0 OID 0)
-- Dependencies: 478
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- TOC entry 4601 (class 0 OID 0)
-- Dependencies: 416
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 4602 (class 0 OID 0)
-- Dependencies: 482
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- TOC entry 4603 (class 0 OID 0)
-- Dependencies: 486
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- TOC entry 4604 (class 0 OID 0)
-- Dependencies: 480
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- TOC entry 4605 (class 0 OID 0)
-- Dependencies: 485
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- TOC entry 4606 (class 0 OID 0)
-- Dependencies: 487
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- TOC entry 4607 (class 0 OID 0)
-- Dependencies: 417
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 4608 (class 0 OID 0)
-- Dependencies: 479
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- TOC entry 4609 (class 0 OID 0)
-- Dependencies: 483
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- TOC entry 4610 (class 0 OID 0)
-- Dependencies: 484
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- TOC entry 4611 (class 0 OID 0)
-- Dependencies: 481
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- TOC entry 4612 (class 0 OID 0)
-- Dependencies: 488
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- TOC entry 4614 (class 0 OID 0)
-- Dependencies: 260
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- TOC entry 4616 (class 0 OID 0)
-- Dependencies: 277
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO dashboard_user;


--
-- TOC entry 4619 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO dashboard_user;


--
-- TOC entry 4621 (class 0 OID 0)
-- Dependencies: 259
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- TOC entry 4623 (class 0 OID 0)
-- Dependencies: 272
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- TOC entry 4625 (class 0 OID 0)
-- Dependencies: 271
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- TOC entry 4627 (class 0 OID 0)
-- Dependencies: 270
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO dashboard_user;


--
-- TOC entry 4628 (class 0 OID 0)
-- Dependencies: 278
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- TOC entry 4630 (class 0 OID 0)
-- Dependencies: 258
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- TOC entry 4632 (class 0 OID 0)
-- Dependencies: 257
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- TOC entry 4634 (class 0 OID 0)
-- Dependencies: 275
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO dashboard_user;


--
-- TOC entry 4636 (class 0 OID 0)
-- Dependencies: 276
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- TOC entry 4638 (class 0 OID 0)
-- Dependencies: 261
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.schema_migrations TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.schema_migrations TO postgres;
GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- TOC entry 4641 (class 0 OID 0)
-- Dependencies: 269
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO dashboard_user;


--
-- TOC entry 4643 (class 0 OID 0)
-- Dependencies: 274
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO dashboard_user;


--
-- TOC entry 4646 (class 0 OID 0)
-- Dependencies: 273
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO dashboard_user;


--
-- TOC entry 4649 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- TOC entry 4650 (class 0 OID 0)
-- Dependencies: 309
-- Name: TABLE affiliate_tokens; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.affiliate_tokens TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.affiliate_tokens TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.affiliate_tokens TO service_role;


--
-- TOC entry 4651 (class 0 OID 0)
-- Dependencies: 317
-- Name: TABLE banner_stats; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.banner_stats TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.banner_stats TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.banner_stats TO service_role;


--
-- TOC entry 4652 (class 0 OID 0)
-- Dependencies: 316
-- Name: TABLE banners; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.banners TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.banners TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.banners TO service_role;


--
-- TOC entry 4653 (class 0 OID 0)
-- Dependencies: 315
-- Name: TABLE brands; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.brands TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.brands TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.brands TO service_role;


--
-- TOC entry 4654 (class 0 OID 0)
-- Dependencies: 289
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO service_role;


--
-- TOC entry 4655 (class 0 OID 0)
-- Dependencies: 288
-- Name: TABLE coupon_stats; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.coupon_stats TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.coupon_stats TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.coupon_stats TO service_role;


--
-- TOC entry 4657 (class 0 OID 0)
-- Dependencies: 284
-- Name: TABLE coupons; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.coupons TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.coupons TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.coupons TO service_role;


--
-- TOC entry 4658 (class 0 OID 0)
-- Dependencies: 305
-- Name: SEQUENCE invoice_sequence; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.invoice_sequence TO anon;
GRANT ALL ON SEQUENCE public.invoice_sequence TO authenticated;
GRANT ALL ON SEQUENCE public.invoice_sequence TO service_role;


--
-- TOC entry 4659 (class 0 OID 0)
-- Dependencies: 297
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.notifications TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.notifications TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.notifications TO service_role;


--
-- TOC entry 4660 (class 0 OID 0)
-- Dependencies: 308
-- Name: TABLE page_views; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.page_views TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.page_views TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.page_views TO service_role;


--
-- TOC entry 4661 (class 0 OID 0)
-- Dependencies: 304
-- Name: TABLE payment_reminders; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.payment_reminders TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.payment_reminders TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.payment_reminders TO service_role;


--
-- TOC entry 4662 (class 0 OID 0)
-- Dependencies: 298
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.products TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.products TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.products TO service_role;


--
-- TOC entry 4663 (class 0 OID 0)
-- Dependencies: 281
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.profiles TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.profiles TO service_role;


--
-- TOC entry 4664 (class 0 OID 0)
-- Dependencies: 287
-- Name: TABLE rating_comments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.rating_comments TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.rating_comments TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.rating_comments TO service_role;


--
-- TOC entry 4665 (class 0 OID 0)
-- Dependencies: 286
-- Name: TABLE rating_votes; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.rating_votes TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.rating_votes TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.rating_votes TO service_role;


--
-- TOC entry 4666 (class 0 OID 0)
-- Dependencies: 285
-- Name: TABLE ratings; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.ratings TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.ratings TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.ratings TO service_role;


--
-- TOC entry 4667 (class 0 OID 0)
-- Dependencies: 307
-- Name: TABLE script_pings; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.script_pings TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.script_pings TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.script_pings TO service_role;


--
-- TOC entry 4668 (class 0 OID 0)
-- Dependencies: 282
-- Name: TABLE store_applications; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.store_applications TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.store_applications TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.store_applications TO service_role;


--
-- TOC entry 4674 (class 0 OID 0)
-- Dependencies: 283
-- Name: TABLE stores; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.stores TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.stores TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.stores TO service_role;


--
-- TOC entry 4675 (class 0 OID 0)
-- Dependencies: 306
-- Name: TABLE system_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.system_logs TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.system_logs TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.system_logs TO service_role;


--
-- TOC entry 4676 (class 0 OID 0)
-- Dependencies: 301
-- Name: TABLE tracking_clicks; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tracking_clicks TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tracking_clicks TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tracking_clicks TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tracking_clicks TO PUBLIC;


--
-- TOC entry 4678 (class 0 OID 0)
-- Dependencies: 300
-- Name: SEQUENCE tracking_clicks_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tracking_clicks_id_seq TO anon;
GRANT ALL ON SEQUENCE public.tracking_clicks_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.tracking_clicks_id_seq TO service_role;


--
-- TOC entry 4685 (class 0 OID 0)
-- Dependencies: 302
-- Name: TABLE tracking_conversions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tracking_conversions TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tracking_conversions TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tracking_conversions TO service_role;


--
-- TOC entry 4691 (class 0 OID 0)
-- Dependencies: 303
-- Name: TABLE tracking_pixels; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tracking_pixels TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tracking_pixels TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.tracking_pixels TO service_role;


--
-- TOC entry 4692 (class 0 OID 0)
-- Dependencies: 299
-- Name: TABLE utm_tracking_exceptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.utm_tracking_exceptions TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.utm_tracking_exceptions TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.utm_tracking_exceptions TO service_role;


--
-- TOC entry 4693 (class 0 OID 0)
-- Dependencies: 296
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- TOC entry 4694 (class 0 OID 0)
-- Dependencies: 310
-- Name: TABLE messages_2025_07_18; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_18 TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_18 TO dashboard_user;


--
-- TOC entry 4695 (class 0 OID 0)
-- Dependencies: 311
-- Name: TABLE messages_2025_07_19; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_19 TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_19 TO dashboard_user;


--
-- TOC entry 4696 (class 0 OID 0)
-- Dependencies: 312
-- Name: TABLE messages_2025_07_20; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_20 TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_20 TO dashboard_user;


--
-- TOC entry 4697 (class 0 OID 0)
-- Dependencies: 313
-- Name: TABLE messages_2025_07_21; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_21 TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_21 TO dashboard_user;


--
-- TOC entry 4698 (class 0 OID 0)
-- Dependencies: 314
-- Name: TABLE messages_2025_07_22; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_22 TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_22 TO dashboard_user;


--
-- TOC entry 4699 (class 0 OID 0)
-- Dependencies: 318
-- Name: TABLE messages_2025_07_23; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_23 TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_23 TO dashboard_user;


--
-- TOC entry 4700 (class 0 OID 0)
-- Dependencies: 319
-- Name: TABLE messages_2025_07_24; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_24 TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages_2025_07_24 TO dashboard_user;


--
-- TOC entry 4701 (class 0 OID 0)
-- Dependencies: 290
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- TOC entry 4702 (class 0 OID 0)
-- Dependencies: 293
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- TOC entry 4703 (class 0 OID 0)
-- Dependencies: 292
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- TOC entry 4705 (class 0 OID 0)
-- Dependencies: 262
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO postgres;


--
-- TOC entry 4706 (class 0 OID 0)
-- Dependencies: 264
-- Name: TABLE migrations; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO postgres;


--
-- TOC entry 4708 (class 0 OID 0)
-- Dependencies: 263
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO postgres;


--
-- TOC entry 4709 (class 0 OID 0)
-- Dependencies: 279
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- TOC entry 4710 (class 0 OID 0)
-- Dependencies: 280
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- TOC entry 2517 (class 826 OID 16597)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2518 (class 826 OID 16598)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2516 (class 826 OID 16596)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dashboard_user;


--
-- TOC entry 2527 (class 826 OID 16671)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2526 (class 826 OID 16670)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- TOC entry 2525 (class 826 OID 16669)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2530 (class 826 OID 16631)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2529 (class 826 OID 16630)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2528 (class 826 OID 16629)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- TOC entry 2509 (class 826 OID 16484)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2510 (class 826 OID 16485)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2508 (class 826 OID 16483)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2512 (class 826 OID 16487)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2507 (class 826 OID 16482)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- TOC entry 2511 (class 826 OID 16486)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- TOC entry 2520 (class 826 OID 16601)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2521 (class 826 OID 16602)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2519 (class 826 OID 16600)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dashboard_user;


--
-- TOC entry 2515 (class 826 OID 16539)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2514 (class 826 OID 16538)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2513 (class 826 OID 16537)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


-- Completed on 2025-07-25 14:38:48

--
-- PostgreSQL database dump complete
--

