-- Script para crear políticas RLS faltantes
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
