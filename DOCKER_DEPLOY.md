# 🚀 Guía de Deploy con Docker - Cuponomics

Esta guía te ayudará a desplegar Cuponomics usando Docker de manera rápida y segura.

## 📋 Prerrequisitos

- Docker instalado (versión 20.10+)
- Docker Compose instalado (versión 2.0+)
- Git instalado
- Al menos 2GB de RAM disponible

## 🛠️ Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd cuponomics
```

### 2. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp env.example .env.local

# Editar con tus valores
nano .env.local
```

### 3. Deploy automático
```bash
# Hacer el script ejecutable (solo la primera vez)
chmod +x deploy.sh

# Deploy de producción
./deploy.sh prod

# O deploy de desarrollo
./deploy.sh dev
```

## 🔧 Configuración Manual

### Variables de Entorno Requeridas

Edita el archivo `.env.local` con tus valores:

```bash
# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# Aplicación
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=production

# Seguridad
JWT_SECRET=tu_jwt_secret_super_seguro
```

### Comandos de Docker

```bash
# Construir imagen de producción
docker-compose build cuponomics-app

# Iniciar en producción
docker-compose up -d cuponomics-app

# Ver logs
docker-compose logs -f cuponomics-app

# Detener servicios
docker-compose down

# Reconstruir sin cache
docker-compose build --no-cache cuponomics-app
```

## 🌐 Puertos y URLs

- **Producción**: http://localhost:3000
- **Desarrollo**: http://localhost:3001
- **Health Check**: http://localhost:3000/api/health

## 📊 Monitoreo

### Health Check
```bash
# Verificar estado de la aplicación
curl http://localhost:3000/api/health

# Respuesta esperada:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### Logs en tiempo real
```bash
# Ver logs de producción
./deploy.sh logs cuponomics-app

# Ver logs de desarrollo
./deploy.sh logs cuponomics-dev
```

### Estado de servicios
```bash
# Ver estado de todos los servicios
./deploy.sh status
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3002:3000"  # Cambiar 3000 por 3002
```

#### 2. Error de permisos
```bash
# En Linux/Mac
sudo chmod +x deploy.sh

# En Windows (PowerShell como administrador)
Set-ExecutionPolicy RemoteSigned
```

#### 3. Problemas de memoria
```bash
# Aumentar memoria en Docker Desktop
# Settings > Resources > Memory > 4GB
```

#### 4. Error de build
```bash
# Limpiar cache y reconstruir
docker system prune -a
docker-compose build --no-cache
```

### Logs de Error

```bash
# Ver logs detallados
docker-compose logs cuponomics-app

# Ver logs de los últimos 100 líneas
docker-compose logs --tail=100 cuponomics-app

# Ver logs con timestamps
docker-compose logs -t cuponomics-app
```

## 🔒 Seguridad

### Configuración Recomendada

1. **Variables de entorno seguras**
   - Nunca commits archivos `.env*` al repositorio
   - Usa secrets en producción

2. **Firewall**
   ```bash
   # Solo permitir puertos necesarios
   ufw allow 3000/tcp
   ufw allow 22/tcp  # SSH
   ```

3. **SSL/TLS**
   ```bash
   # Configurar Nginx con SSL
   # Ver ejemplo en DOCKER_README.md
   ```

## 📈 Escalabilidad

### Con Nginx (Recomendado)

```nginx
# /etc/nginx/sites-available/cuponomics
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Con Docker Swarm

```bash
# Inicializar swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml cuponomics
```

## 🚀 Deploy en Producción

### 1. Servidor VPS/Cloud

```bash
# Conectar al servidor
ssh usuario@tu-servidor.com

# Clonar repositorio
git clone <tu-repositorio>
cd cuponomics

# Configurar variables de producción
cp env.example .env.production
nano .env.production

# Deploy
./deploy.sh prod
```

### 2. Con CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd cuponomics
            git pull
            ./deploy.sh prod
```

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs: `./deploy.sh logs`
2. Verifica el estado: `./deploy.sh status`
3. Consulta la documentación en `DOCKER_README.md`
4. Abre un issue en el repositorio

---

¡Tu aplicación Cuponomics está lista para producción! 🎉 