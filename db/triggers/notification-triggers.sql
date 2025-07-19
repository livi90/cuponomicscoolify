-- Trigger para notificar cuando cambia el rol de un usuario
CREATE OR REPLACE FUNCTION notify_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo crear notificación si el rol ha cambiado
  IF OLD.role <> NEW.role THEN
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      data
    ) VALUES (
      NEW.id,
      'Tu rol ha sido actualizado',
      CASE 
        WHEN NEW.role = 'merchant' THEN 'Ahora tienes acceso a funcionalidades de comerciante.'
        WHEN NEW.role = 'admin' THEN 'Has sido promovido a administrador.'
        ELSE 'Tu rol ha sido actualizado a ' || NEW.role || '.'
      END,
      'role_change',
      jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para notificar cuando se aprueba o rechaza una solicitud de tienda
CREATE OR REPLACE FUNCTION notify_store_application_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo crear notificación si el estado ha cambiado
  IF OLD.status <> NEW.status AND (NEW.status = 'approved' OR NEW.status = 'rejected') THEN
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      data
    ) VALUES (
      NEW.user_id,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Tu solicitud de tienda ha sido aprobada'
        WHEN NEW.status = 'rejected' THEN 'Tu solicitud de tienda ha sido rechazada'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Tu solicitud para la tienda "' || NEW.store_name || '" ha sido aprobada. Ya puedes comenzar a crear cupones.'
        WHEN NEW.status = 'rejected' THEN 'Tu solicitud para la tienda "' || NEW.store_name || '" ha sido rechazada. Motivo: ' || COALESCE(NEW.admin_notes, 'No se proporcionó un motivo.')
      END,
      'store_application_' || NEW.status,
      jsonb_build_object('store_name', NEW.store_name, 'status', NEW.status, 'admin_notes', NEW.admin_notes)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear los triggers
DROP TRIGGER IF EXISTS trigger_role_change ON profiles;
CREATE TRIGGER trigger_role_change
  AFTER UPDATE OF role ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_role_change();

DROP TRIGGER IF EXISTS trigger_store_application_status ON store_applications;
CREATE TRIGGER trigger_store_application_status
  AFTER UPDATE OF status ON store_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_store_application_status();
