# 🐳 Dockerización de Cuponomics

Este proyecto incluye configuración completa de Docker para facilitar el desarrollo y despliegue de la aplicación Cuponomics.

## 📁 Archivos de Docker

- `Dockerfile` - Configuración para producción
- `Dockerfile.dev` - Configuración para desarrollo
- `docker-compose.yml` - Orquestación de servicios
- `.dockerignore` - Archivos excluidos del build

## 🚀 Comandos Rápidos

### Desarrollo Local
```bash
# Construir y ejecutar en modo desarrollo
docker-compose --profile dev up cuponomics-dev

# O construir manualmente
docker build -f Dockerfile.dev -t cuponomics-dev .
docker run -p 3001:3000 -v $(pwd):/app cuponomics-dev
```

### Producción
```bash
# Construir y ejecutar en modo producción
docker-compose up cuponomics-app

# O construir manualmente
docker build -t cuponomics-prod .
docker run -p 3000:3000 cuponomics-prod
```

### Comandos Útiles
```bash
# Ver logs
docker-compose logs -f cuponomics-app

# Detener servicios
docker-compose down

# Reconstruir imagen
docker-compose build --no-cache

# Ejecutar en background
docker-compose up -d
```

## 🔧 Configuración

### Variables de Entorno
Si necesitas configurar variables de entorno, crea un archivo `.env` y descomenta las líneas correspondientes en `docker-compose.yml`:

```bash
# .env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
# ... otras variables
```

### Puertos
- **Desarrollo**: http://localhost:3001
- **Producción**: http://localhost:3000

## 🏗️ Estructura del Dockerfile

### Producción (Dockerfile)
1. **Multi-stage build** para optimizar tamaño
2. **Stage deps**: Instala dependencias de producción
3. **Stage builder**: Construye la aplicación
4. **Stage runner**: Imagen final optimizada

### Desarrollo (Dockerfile.dev)
- Incluye todas las dependencias (dev + prod)
- Hot reload habilitado
- Volúmenes montados para desarrollo

## 🔍 Troubleshooting

### Problemas Comunes

1. **Error de permisos en Windows**
   ```bash
   # En PowerShell como administrador
   Set-ExecutionPolicy RemoteSigned
   ```

2. **Puerto ya en uso**
   ```bash
   # Cambiar puerto en docker-compose.yml
   ports:
     - "3002:3000"  # Cambiar 3000 por 3002
   ```

3. **Problemas de memoria**
   ```bash
   # Aumentar memoria disponible para Docker
   # En Docker Desktop: Settings > Resources > Memory
   ```

4. **Cache de Docker corrupto**
   ```bash
   docker system prune -a
   docker volume prune
   ```

### Logs y Debugging
```bash
# Ver logs en tiempo real
docker-compose logs -f

# Entrar al contenedor
docker-compose exec cuponomics-app sh

# Ver uso de recursos
docker stats
```

## 🚀 Despliegue

### En Servidor de Producción
```bash
# 1. Clonar repositorio
git clone <tu-repo>
cd cuponomics

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con valores de producción

# 3. Construir y ejecutar
docker-compose up -d cuponomics-app

# 4. Verificar estado
docker-compose ps
```

### Con Nginx (Recomendado)
```yaml
# nginx.conf
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoreo

### Health Check
```bash
# Verificar estado de la aplicación
curl http://localhost:3000/api/health

# O usar Docker health check
docker inspect --format='{{.State.Health.Status}}' cuponomics-app
```

### Métricas
```bash
# Ver uso de recursos
docker stats cuponomics-app

# Ver logs de acceso
docker-compose logs cuponomics-app | grep "GET\|POST"
```

## 🔒 Seguridad

### Buenas Prácticas
1. ✅ Usar usuario no-root en contenedor
2. ✅ Escanear imágenes con `docker scan`
3. ✅ Mantener imágenes actualizadas
4. ✅ Usar secrets para variables sensibles
5. ✅ Limitar recursos del contenedor

### Escaneo de Vulnerabilidades
```bash
# Escanear imagen
docker scan cuponomics-prod

# Actualizar dependencias
npm audit fix
```

## 📚 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

¿Necesitas ayuda con algo específico? ¡No dudes en preguntar! 🚀 