-- =====================================================
-- SCRIPT DE CORRECCIÓN PARA TABLA NOTIFICATIONS
-- =====================================================
-- Ejecutar este script en Supabase para corregir el error de la columna is_read

-- 1. Eliminar la tabla notifications si existe (versión simple)
DROP TABLE IF EXISTS public.notifications CASCADE;

-- 2. Crear la tabla notifications con la estructura completa del sistema social
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    
    -- Referencias
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Tipo de notificación
    notification_type TEXT CHECK (notification_type IN (
        'review_liked', 'review_commented', 'new_follower', 'badge_earned',
        'level_up', 'coupon_expiring', 'reply_to_comment', 'store_approved', 'store_rejected'
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

-- 3. Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- 4. Habilitar RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas RLS básicas
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. Verificar que la tabla se creó correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- =====================================================
-- FIN DEL SCRIPT DE CORRECCIÓN
-- =====================================================
