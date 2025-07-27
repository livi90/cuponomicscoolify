# 🔄 Scripts de Migración - Supabase Cloud a Self-Hosted

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
```bash
psql -h tu-host-selfhosted -U postgres -d postgres -f 00-run-all-migrations.sql
```

### Opción 2: Ejecutar individualmente
```bash
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
```

## 📊 Qué se migra

### Tablas creadas:
- `affiliate_tokens` - Tokens de afiliados
- `banner_stats` - Estadísticas de banners
- `banners` - Banners publicitarios
- `brands` - Marcas
- `categories` - Categorías de productos
- `coupon_stats` - Estadísticas de cupones
- `notifications` - Notificaciones de usuarios
- `page_views` - Vistas de páginas
- `rating_comments` - Comentarios de ratings
- `rating_votes` - Votos de ratings
- `system_logs` - Logs del sistema

### Funciones creadas:
- `detect_device_type()` - Detecta tipo de dispositivo
- `generate_pixel_id()` - Genera ID de pixel
- `increment_product_view()` - Incrementa vista de producto
- `add_store_utm_exception()` - Agrega excepción UTM

### Triggers creados:
- Triggers para actualizar `updated_at` automáticamente
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
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

2. Que todas las funciones existen:
```sql
SELECT proname FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;
```

3. Que RLS está habilitado:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## 🆘 Solución de problemas

Si encuentras errores:

1. **Verifica permisos** - Asegúrate de tener permisos de administrador
2. **Revisa dependencias** - Algunos scripts dependen de otros
3. **Check logs** - Revisa los logs de PostgreSQL para errores específicos
4. **Rollback** - Si es necesario, restaura desde backup

## ✅ Completado

Una vez que todos los scripts se ejecuten exitosamente, tu base de datos Self-Hosted estará completamente sincronizada con tu base de datos Cloud.
