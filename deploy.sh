#!/bin/bash

# Script de deploy para Cuponomics
# Este script construye y despliega la aplicación con las variables de entorno correctas

set -e  # Salir si hay algún error

echo "🚀 Iniciando deploy de Cuponomics..."

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose no está instalado. Por favor instala docker-compose primero."
    exit 1
fi

echo "📋 Verificando variables de entorno..."

# Verificar si existe un archivo .env
if [ ! -f ".env" ]; then
    echo "⚠️  Advertencia: No se encontró archivo .env. Usando valores por defecto."
    echo "📝 Creando archivo .env con valores por defecto..."
    
    cat > .env << EOF
# Variables de entorno para Cuponomics
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
EOF
    echo "✅ Archivo .env creado con valores por defecto."
fi

echo "🔧 Construyendo imagen Docker..."

# Construir la imagen con las variables de entorno
docker build \
    --build-arg NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-http://localhost:54321} \
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0} \
    --build-arg SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU} \
    -t cuponomics-app .

if [ $? -eq 0 ]; then
    echo "✅ Imagen construida exitosamente."
else
    echo "❌ Error al construir la imagen Docker."
    exit 1
fi

echo "🚀 Iniciando contenedor..."

# Detener contenedores existentes
docker-compose down 2>/dev/null || true

# Iniciar con docker-compose
docker-compose -f docker-compose.prod.yml up -d

if [ $? -eq 0 ]; then
    echo "✅ Contenedor iniciado exitosamente."
    echo "🌐 La aplicación está disponible en: http://localhost:3000"
    echo "📊 Para ver los logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "🛑 Para detener: docker-compose -f docker-compose.prod.yml down"
else
    echo "❌ Error al iniciar el contenedor."
    exit 1
fi

echo "🎉 ¡Deploy completado exitosamente!" 