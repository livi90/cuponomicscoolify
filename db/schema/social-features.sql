-- =====================================================
-- SISTEMA SOCIAL DE CUPONOMICS
-- =====================================================

-- Tabla para calificaciones y reviews de cupones
CREATE TABLE IF NOT EXISTS coupon_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Referencias
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Datos de la calificación
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    worked BOOLEAN NOT NULL, -- true = funcionó, false = no funcionó
    worked_partially BOOLEAN DEFAULT false,
    
    -- Contenido
    title TEXT,
    review_text TEXT,
    pros TEXT,
    cons TEXT,
    
    -- Metadatos
    purchase_amount DECIMAL(10,2),
    savings_amount DECIMAL(10,2),
    screenshot_url TEXT,
    
    -- Estado
    is_verified BOOLEAN DEFAULT false,
    is_helpful_count INTEGER DEFAULT 0,
    is_not_helpful_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
    
    -- SEO y búsqueda
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('spanish', COALESCE(title, '')), 'A') ||
        setweight(to_tsvector('spanish', COALESCE(review_text, '')), 'B') ||
        setweight(to_tsvector('spanish', COALESCE(pros, '')), 'C') ||
        setweight(to_tsvector('spanish', COALESCE(cons, '')), 'C')
    ) STORED
);

-- Tabla para likes/dislikes de reviews
CREATE TABLE IF NOT EXISTS review_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Referencias
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    review_id UUID REFERENCES coupon_reviews(id) ON DELETE CASCADE,
    
    -- Voto
    vote_type TEXT CHECK (vote_type IN ('like', 'dislike')),
    
    -- Un usuario solo puede votar una vez por review
    UNIQUE(user_id, review_id)
);

-- Tabla para comentarios en reviews
CREATE TABLE IF NOT EXISTS review_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Referencias
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    review_id UUID REFERENCES coupon_reviews(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES review_comments(id) ON DELETE CASCADE, -- Para respuestas anidadas
    
    -- Contenido
    comment_text TEXT NOT NULL,
    
    -- Estado
    is_verified BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted'))
);

-- Tabla para perfiles de usuario con gamificación
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Referencias
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    
    -- Información del perfil
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    location TEXT,
    website TEXT,
    
    -- Gamificación
    reputation_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]',
    
    -- Estadísticas
    reviews_count INTEGER DEFAULT 0,
    helpful_reviews_count INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    
    -- Configuración
    is_public BOOLEAN DEFAULT true,
    show_email BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    
    -- SEO
    username TEXT UNIQUE,
    slug TEXT UNIQUE
);

-- Tabla para badges/logros
CREATE TABLE IF NOT EXISTS badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Información del badge
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    color TEXT DEFAULT '#FF6B35',
    
    -- Criterios
    criteria_type TEXT CHECK (criteria_type IN ('reviews', 'helpful_votes', 'days_active', 'savings', 'custom')),
    criteria_value INTEGER,
    criteria_description TEXT,
    
    -- Estado
    is_active BOOLEAN DEFAULT true,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary'))
);

-- Tabla para badges asignados a usuarios
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Referencias
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    
    -- Un usuario solo puede tener un badge una vez
    UNIQUE(user_id, badge_id)
);

-- Tabla para seguimiento entre usuarios
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Referencias
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Un usuario no puede seguirse a sí mismo
    CHECK (follower_id != following_id),
    
    -- Un usuario solo puede seguir a otro una vez
    UNIQUE(follower_id, following_id)
);

-- Tabla para favoritos de cupones
CREATE TABLE IF NOT EXISTS coupon_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Referencias
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    
    -- Un usuario solo puede favoritear un cupón una vez
    UNIQUE(user_id, coupon_id)
);

-- Tabla para feed de actividad
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Referencias
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Tipo de actividad
    activity_type TEXT CHECK (activity_type IN (
        'review_created', 'review_updated', 'review_liked', 'review_commented',
        'coupon_favorited', 'badge_earned', 'level_up', 'user_followed'
    )),
    
    -- Datos de la actividad
    target_id UUID, -- ID del objeto relacionado (review, coupon, etc.)
    target_type TEXT, -- Tipo del objeto
    metadata JSONB, -- Datos adicionales
    
    -- Estado
    is_public BOOLEAN DEFAULT true,
    is_read BOOLEAN DEFAULT false
);

-- Tabla para notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    
    -- Referencias
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Tipo de notificación
    notification_type TEXT CHECK (notification_type IN (
        'review_liked', 'review_commented', 'new_follower', 'badge_earned',
        'level_up', 'coupon_expiring', 'reply_to_comment'
    )),
    
    -- Datos de la notificación
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    metadata JSONB,
    
    -- Estado
    is_read BOOLEAN DEFAULT false,
    is_email_sent BOOLEAN DEFAULT false
);

-- Tabla para reportes de contenido
CREATE TABLE IF NOT EXISTS content_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Referencias
    reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Contenido reportado
    content_type TEXT CHECK (content_type IN ('review', 'comment', 'user')),
    content_id UUID NOT NULL,
    
    -- Razón del reporte
    reason TEXT CHECK (reason IN (
        'spam', 'inappropriate', 'fake_review', 'harassment', 'other'
    )),
    description TEXT,
    
    -- Estado
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    admin_notes TEXT,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para coupon_reviews
CREATE INDEX IF NOT EXISTS idx_coupon_reviews_user_id ON coupon_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_reviews_coupon_id ON coupon_reviews(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_reviews_store_id ON coupon_reviews(store_id);
CREATE INDEX IF NOT EXISTS idx_coupon_reviews_rating ON coupon_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_coupon_reviews_worked ON coupon_reviews(worked);
CREATE INDEX IF NOT EXISTS idx_coupon_reviews_created_at ON coupon_reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_coupon_reviews_helpful ON coupon_reviews(is_helpful_count DESC);
CREATE INDEX IF NOT EXISTS idx_coupon_reviews_search ON coupon_reviews USING GIN(search_vector);

-- Índices para review_votes
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_user_id ON review_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_type ON review_votes(vote_type);

-- Índices para review_comments
CREATE INDEX IF NOT EXISTS idx_review_comments_review_id ON review_comments(review_id);
CREATE INDEX IF NOT EXISTS idx_review_comments_user_id ON review_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_review_comments_parent_id ON review_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_review_comments_created_at ON review_comments(created_at);

-- Índices para user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_slug ON user_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_user_profiles_reputation ON user_profiles(reputation_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON user_profiles(level DESC);

-- Índices para user_follows
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);

-- Índices para coupon_favorites
CREATE INDEX IF NOT EXISTS idx_coupon_favorites_user_id ON coupon_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_favorites_coupon_id ON coupon_favorites(coupon_id);

-- Índices para activity_feed
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_type ON activity_feed(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created_at ON activity_feed(created_at DESC);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar contadores de reviews
CREATE OR REPLACE FUNCTION update_review_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Actualizar contador de reviews del usuario
        UPDATE user_profiles 
        SET reviews_count = reviews_count + 1
        WHERE user_id = NEW.user_id;
        
        -- Actualizar contador de reviews del cupón
        UPDATE coupons 
        SET reviews_count = (
            SELECT COUNT(*) FROM coupon_reviews 
            WHERE coupon_id = NEW.coupon_id AND status = 'active'
        )
        WHERE id = NEW.coupon_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Actualizar contador de reviews del usuario
        UPDATE user_profiles 
        SET reviews_count = reviews_count - 1
        WHERE user_id = OLD.user_id;
        
        -- Actualizar contador de reviews del cupón
        UPDATE coupons 
        SET reviews_count = (
            SELECT COUNT(*) FROM coupon_reviews 
            WHERE coupon_id = OLD.coupon_id AND status = 'active'
        )
        WHERE id = OLD.coupon_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contadores de reviews
CREATE TRIGGER trigger_update_review_counters
    AFTER INSERT OR DELETE ON coupon_reviews
    FOR EACH ROW EXECUTE FUNCTION update_review_counters();

-- Función para actualizar contadores de votos
CREATE OR REPLACE FUNCTION update_vote_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 'like' THEN
            UPDATE coupon_reviews 
            SET is_helpful_count = is_helpful_count + 1
            WHERE id = NEW.review_id;
        ELSE
            UPDATE coupon_reviews 
            SET is_not_helpful_count = is_not_helpful_count + 1
            WHERE id = NEW.review_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 'like' THEN
            UPDATE coupon_reviews 
            SET is_helpful_count = is_helpful_count - 1
            WHERE id = OLD.review_id;
        ELSE
            UPDATE coupon_reviews 
            SET is_not_helpful_count = is_not_helpful_count - 1
            WHERE id = OLD.review_id;
        END IF;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Remover voto anterior
        IF OLD.vote_type = 'like' THEN
            UPDATE coupon_reviews 
            SET is_helpful_count = is_helpful_count - 1
            WHERE id = OLD.review_id;
        ELSE
            UPDATE coupon_reviews 
            SET is_not_helpful_count = is_not_helpful_count - 1
            WHERE id = OLD.review_id;
        END IF;
        
        -- Agregar nuevo voto
        IF NEW.vote_type = 'like' THEN
            UPDATE coupon_reviews 
            SET is_helpful_count = is_helpful_count + 1
            WHERE id = NEW.review_id;
        ELSE
            UPDATE coupon_reviews 
            SET is_not_helpful_count = is_not_helpful_count + 1
            WHERE id = NEW.review_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contadores de votos
CREATE TRIGGER trigger_update_vote_counters
    AFTER INSERT OR UPDATE OR DELETE ON review_votes
    FOR EACH ROW EXECUTE FUNCTION update_vote_counters();

-- Función para actualizar contadores de seguidores
CREATE OR REPLACE FUNCTION update_follower_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Incrementar contador de seguidos del follower
        UPDATE user_profiles 
        SET following_count = following_count + 1
        WHERE user_id = NEW.follower_id;
        
        -- Incrementar contador de seguidores del following
        UPDATE user_profiles 
        SET followers_count = followers_count + 1
        WHERE user_id = NEW.following_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrementar contador de seguidos del follower
        UPDATE user_profiles 
        SET following_count = following_count - 1
        WHERE user_id = OLD.follower_id;
        
        -- Decrementar contador de seguidores del following
        UPDATE user_profiles 
        SET followers_count = followers_count - 1
        WHERE user_id = OLD.following_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contadores de seguidores
CREATE TRIGGER trigger_update_follower_counters
    AFTER INSERT OR DELETE ON user_follows
    FOR EACH ROW EXECUTE FUNCTION update_follower_counters();

-- Función para calcular reputación
CREATE OR REPLACE FUNCTION calculate_reputation(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_points INTEGER := 0;
    review_points INTEGER := 0;
    helpful_points INTEGER := 0;
    badge_points INTEGER := 0;
BEGIN
    -- Puntos por reviews
    SELECT COUNT(*) * 10 INTO review_points
    FROM coupon_reviews 
    WHERE user_id = user_uuid AND status = 'active';
    
    -- Puntos por reviews útiles
    SELECT COALESCE(SUM(is_helpful_count), 0) * 2 INTO helpful_points
    FROM coupon_reviews 
    WHERE user_id = user_uuid AND status = 'active';
    
    -- Puntos por badges
    SELECT COALESCE(SUM(
        CASE rarity
            WHEN 'common' THEN 10
            WHEN 'uncommon' THEN 25
            WHEN 'rare' THEN 50
            WHEN 'epic' THEN 100
            WHEN 'legendary' THEN 250
        END
    ), 0) INTO badge_points
    FROM user_badges ub
    JOIN badges b ON ub.badge_id = b.id
    WHERE ub.user_id = user_uuid;
    
    total_points := review_points + helpful_points + badge_points;
    
    RETURN total_points;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar y asignar badges
CREATE OR REPLACE FUNCTION check_and_assign_badges(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    badge_record RECORD;
    user_reviews_count INTEGER;
    user_helpful_votes INTEGER;
    user_days_active INTEGER;
    user_total_savings DECIMAL;
BEGIN
    -- Obtener estadísticas del usuario
    SELECT COUNT(*) INTO user_reviews_count
    FROM coupon_reviews 
    WHERE user_id = user_uuid AND status = 'active';
    
    SELECT COALESCE(SUM(is_helpful_count), 0) INTO user_helpful_votes
    FROM coupon_reviews 
    WHERE user_id = user_uuid AND status = 'active';
    
    SELECT EXTRACT(DAYS FROM NOW() - created_at) INTO user_days_active
    FROM user_profiles 
    WHERE user_id = user_uuid;
    
    SELECT COALESCE(SUM(savings_amount), 0) INTO user_total_savings
    FROM coupon_reviews 
    WHERE user_id = user_uuid AND status = 'active';
    
    -- Verificar cada badge
    FOR badge_record IN 
        SELECT * FROM badges WHERE is_active = true
    LOOP
        -- Verificar si el usuario ya tiene el badge
        IF NOT EXISTS (
            SELECT 1 FROM user_badges 
            WHERE user_id = user_uuid AND badge_id = badge_record.id
        ) THEN
            -- Verificar criterios según el tipo
            CASE badge_record.criteria_type
                WHEN 'reviews' THEN
                    IF user_reviews_count >= badge_record.criteria_value THEN
                        INSERT INTO user_badges (user_id, badge_id) 
                        VALUES (user_uuid, badge_record.id);
                    END IF;
                WHEN 'helpful_votes' THEN
                    IF user_helpful_votes >= badge_record.criteria_value THEN
                        INSERT INTO user_badges (user_id, badge_id) 
                        VALUES (user_uuid, badge_record.id);
                    END IF;
                WHEN 'days_active' THEN
                    IF user_days_active >= badge_record.criteria_value THEN
                        INSERT INTO user_badges (user_id, badge_id) 
                        VALUES (user_uuid, badge_record.id);
                    END IF;
                WHEN 'savings' THEN
                    IF user_total_savings >= badge_record.criteria_value THEN
                        INSERT INTO user_badges (user_id, badge_id) 
                        VALUES (user_uuid, badge_record.id);
                    END IF;
            END CASE;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POLÍTICAS RLS
-- =====================================================

-- Políticas para coupon_reviews
ALTER TABLE coupon_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all active reviews" ON coupon_reviews
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create their own reviews" ON coupon_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON coupon_reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON coupon_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para review_votes
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all votes" ON review_votes
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own votes" ON review_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON review_votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON review_votes
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public profiles" ON user_profiles
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para user_follows
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all follows" ON user_follows
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own follows" ON user_follows
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" ON user_follows
    FOR DELETE USING (auth.uid() = follower_id);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar badges por defecto
INSERT INTO badges (name, display_name, description, criteria_type, criteria_value, rarity) VALUES
('first_review', 'Primera Review', 'Publicó su primera review', 'reviews', 1, 'common'),
('reviewer_5', 'Reviewer Novato', 'Publicó 5 reviews', 'reviews', 5, 'common'),
('reviewer_25', 'Reviewer Experto', 'Publicó 25 reviews', 'reviews', 25, 'uncommon'),
('reviewer_100', 'Reviewer Maestro', 'Publicó 100 reviews', 'reviews', 100, 'rare'),
('helpful_10', 'Útil', 'Recibió 10 votos útiles', 'helpful_votes', 10, 'common'),
('helpful_50', 'Muy Útil', 'Recibió 50 votos útiles', 'helpful_votes', 50, 'uncommon'),
('helpful_100', 'Extremadamente Útil', 'Recibió 100 votos útiles', 'helpful_votes', 100, 'rare'),
('active_7', 'Activo', '7 días activo en la plataforma', 'days_active', 7, 'common'),
('active_30', 'Muy Activo', '30 días activo en la plataforma', 'days_active', 30, 'uncommon'),
('active_365', 'Veterano', '1 año activo en la plataforma', 'days_active', 365, 'epic'),
('savings_100', 'Ahorrador', 'Ahorró €100 en total', 'savings', 100, 'common'),
('savings_500', 'Gran Ahorrador', 'Ahorró €500 en total', 'savings', 500, 'uncommon'),
('savings_1000', 'Ahorrador Maestro', 'Ahorró €1000 en total', 'savings', 1000, 'rare'),
('savings_5000', 'Ahorrador Legendario', 'Ahorró €5000 en total', 'savings', 5000, 'legendary')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
