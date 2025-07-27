# 🔍 Auditoría de Base de Datos - Supabase Cloud vs Self-Hosted

Este conjunto de scripts te permite auditar completamente tu base de datos de Supabase Cloud y compararla con tu migración a Supabase Self-Hosted para identificar qué elementos faltan o son diferentes.

## 📋 Qué audita este sistema

### Base de Datos
- **Tablas**: Estructura, columnas, tipos de datos, restricciones
- **Funciones**: Funciones personalizadas, procedimientos almacenados
- **Triggers**: Triggers automáticos y manuales
- **Políticas RLS**: Políticas de Row Level Security
- **Índices**: Índices primarios, secundarios, únicos
- **Secuencias**: Secuencias de auto-incremento
- **Vistas**: Vistas materializadas y regulares
- **Extensiones**: Extensiones de PostgreSQL instaladas
- **Roles**: Roles de usuario y permisos
- **Esquemas**: Organización de esquemas

### Datos
- **Conteo de registros**: Número de filas en cada tabla
- **Diferencias de datos**: Comparación de volúmenes de datos

### Storage
- **Buckets**: Buckets de almacenamiento
- **Archivos**: Archivos almacenados en cada bucket

### Auth
- **Usuarios**: Número total de usuarios registrados
- **Identidades**: Métodos de autenticación

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install @supabase/supabase-js
```

### 2. Configurar credenciales

Ejecuta el script de configuración:

```bash
node scripts/setup-audit.js
```

Este script te pedirá:
- URL de Supabase Cloud
- Service Role Key de Supabase Cloud
- URL de Supabase Self-Hosted
- Service Role Key de Supabase Self-Hosted

### 3. Instalar funciones SQL

**En Supabase Cloud:**
```bash
psql -h tu-host-cloud -U postgres -d postgres -f db/schema/audit-functions.sql
```

**En Supabase Self-Hosted:**
```bash
psql -h tu-host-selfhosted -U postgres -d postgres -f db/schema/audit-functions.sql
```

## 📊 Uso

### Paso 1: Generar reporte de Cloud

```bash
./scripts/audit-cloud.sh
```

Esto generará `scripts/database-audit-report.json` con toda la información de tu base de datos en Cloud.

### Paso 2: Comparar con Self-Hosted

```bash
./scripts/compare-databases.sh
```

Esto generará `scripts/database-comparison-report.json` con las diferencias encontradas.

## 📄 Archivos generados

### `database-audit-report.json`
Reporte completo de Supabase Cloud que incluye:
- Estructura completa de la base de datos
- Conteos de registros
- Configuración de storage
- Información de auth

### `database-comparison-report.json`
Comparación detallada que muestra:
- Elementos faltantes en Self-Hosted
- Elementos extra en Self-Hosted
- Elementos diferentes entre ambas
- Resumen estadístico

## 🔍 Interpretación de resultados

### Elementos faltantes en Self-Hosted
Estos son elementos que existen en Cloud pero no en tu migración:
- **CRÍTICO**: Tablas, funciones, triggers, políticas RLS
- **IMPORTANTE**: Índices, secuencias, extensiones
- **MENOR**: Roles adicionales, vistas

### Elementos extra en Self-Hosted
Elementos que están en Self-Hosted pero no en Cloud:
- Pueden ser elementos de desarrollo o testing
- Verificar si son necesarios

### Elementos diferentes
Elementos que existen en ambos pero con diferencias:
- **Funciones**: Código diferente
- **Triggers**: Lógica diferente
- **Políticas**: Permisos diferentes
- **Datos**: Conteos de registros diferentes

## 🛠️ Solución de problemas comunes

### Error: "function get_schemas() does not exist"
Asegúrate de haber ejecutado las funciones SQL en ambas bases de datos.

### Error: "permission denied"
Verifica que estés usando el Service Role Key correcto con permisos de administrador.

### Error: "connection refused"
Verifica las URLs de conexión y que los servicios estén activos.

### Reporte vacío
Si el reporte está vacío, verifica:
- Permisos de las funciones SQL
- Conectividad a la base de datos
- Credenciales correctas

## 📝 Ejemplo de salida

```
🔍 Iniciando auditoría de la base de datos...
📋 Obteniendo esquemas...
📊 Obteniendo tablas...
⚙️ Obteniendo funciones...
🔔 Obteniendo triggers...
🔒 Obteniendo políticas RLS...
📈 Obteniendo índices...
🔢 Obteniendo secuencias...
👁️ Obteniendo vistas...
🔌 Obteniendo extensiones...
👥 Obteniendo roles...
📊 Contando registros en tablas...
🗂️ Obteniendo buckets de storage...
👤 Contando usuarios de auth...
✅ Auditoría completada!

📊 RESUMEN DE LA AUDITORÍA:
📋 Tablas: 15
⚙️ Funciones: 8
🔔 Triggers: 3
🔒 Políticas RLS: 12
📈 Índices: 25
🔢 Secuencias: 5
👁️ Vistas: 2
🔌 Extensiones: 4
👥 Roles: 3
🗂️ Buckets de storage: 2
👤 Usuarios de auth: 150
```

## 🔧 Scripts adicionales

### Auditoría manual
Si necesitas auditar solo una base de datos específica:

```bash
# Solo Cloud
SUPABASE_URL=tu-url SUPABASE_SERVICE_ROLE_KEY=tu-key node scripts/audit-database.js

# Solo Self-Hosted
SELF_HOSTED_URL=tu-url SELF_HOSTED_SERVICE_ROLE_KEY=tu-key node scripts/compare-databases.js
```

### Comparación con backup
Si tienes un archivo de backup específico:

```bash
node scripts/compare-databases.js ruta/al/backup.json
```

## 📞 Soporte

Si encuentras problemas:
1. Verifica que todas las funciones SQL estén instaladas
2. Confirma que las credenciales sean correctas
3. Revisa los logs de error para detalles específicos
4. Asegúrate de que ambas bases de datos estén accesibles

## 🔒 Seguridad

- Los archivos `.env.*` contienen credenciales sensibles
- No los subas a control de versiones
- Usa `.gitignore` para excluirlos
- Elimina los archivos después de usar los scripts

```bash
# Agregar al .gitignore
scripts/.env.*
scripts/*-report.json
``` 