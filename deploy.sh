#!/bin/bash

# Script de deploy para Cuponomics
# Uso: ./deploy.sh [dev|prod]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Verificar si Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
        exit 1
    fi
    
    print_message "Docker y Docker Compose están instalados"
}

# Verificar archivos de configuración
check_config() {
    if [ ! -f ".env.local" ] && [ ! -f ".env.production" ]; then
        print_warning "No se encontraron archivos de variables de entorno"
        print_message "Copiando env.example a .env.local..."
        cp env.example .env.local
        print_warning "Por favor edita .env.local con tus valores de configuración"
        read -p "¿Continuar con el deploy? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Limpiar contenedores y imágenes antiguas
cleanup() {
    print_header "Limpiando contenedores e imágenes antiguas"
    
    # Detener contenedores existentes
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Limpiar imágenes no utilizadas
    docker image prune -f
    
    print_message "Limpieza completada"
}

# Deploy de desarrollo
deploy_dev() {
    print_header "Deploy de Desarrollo"
    
    check_docker
    check_config
    cleanup
    
    print_message "Construyendo imagen de desarrollo..."
    docker-compose --profile dev build cuponomics-dev
    
    print_message "Iniciando servicios de desarrollo..."
    docker-compose --profile dev up -d cuponomics-dev
    
    print_message "Esperando que el servicio esté listo..."
    sleep 10
    
    # Verificar health check
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        print_message "✅ Deploy de desarrollo completado exitosamente!"
        print_message "🌐 Aplicación disponible en: http://localhost:3001"
    else
        print_error "❌ El servicio no está respondiendo correctamente"
        docker-compose --profile dev logs cuponomics-dev
        exit 1
    fi
}

# Deploy de producción
deploy_prod() {
    print_header "Deploy de Producción"
    
    check_docker
    check_config
    cleanup
    
    print_message "Construyendo imagen de producción..."
    docker-compose build cuponomics-app
    
    print_message "Iniciando servicios de producción..."
    docker-compose up -d cuponomics-app
    
    print_message "Esperando que el servicio esté listo..."
    sleep 15
    
    # Verificar health check
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_message "✅ Deploy de producción completado exitosamente!"
        print_message "🌐 Aplicación disponible en: http://localhost:3000"
    else
        print_error "❌ El servicio no está respondiendo correctamente"
        docker-compose logs cuponomics-app
        exit 1
    fi
}

# Mostrar logs
show_logs() {
    local service=${1:-cuponomics-app}
    print_header "Mostrando logs de $service"
    docker-compose logs -f $service
}

# Mostrar estado
show_status() {
    print_header "Estado de los servicios"
    docker-compose ps
    echo
    print_message "Health checks:"
    docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
}

# Función principal
main() {
    case "${1:-prod}" in
        "dev")
            deploy_dev
            ;;
        "prod")
            deploy_prod
            ;;
        "logs")
            show_logs $2
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            echo "Uso: $0 [comando]"
            echo ""
            echo "Comandos:"
            echo "  dev      - Deploy de desarrollo (puerto 3001)"
            echo "  prod     - Deploy de producción (puerto 3000) [default]"
            echo "  logs     - Mostrar logs de los servicios"
            echo "  status   - Mostrar estado de los servicios"
            echo "  cleanup  - Limpiar contenedores e imágenes"
            echo "  help     - Mostrar esta ayuda"
            ;;
        *)
            print_error "Comando desconocido: $1"
            echo "Usa '$0 help' para ver los comandos disponibles"
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@" 