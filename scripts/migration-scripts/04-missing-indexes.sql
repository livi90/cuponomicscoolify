-- Script para crear índices faltantes
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
