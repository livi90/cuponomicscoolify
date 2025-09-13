#!/bin/bash

# Script de despliegue para Cuponomics
echo "🚀 Iniciando proceso de despliegue de Cuponomics..."

# Verificar que estamos en la rama correcta
current_branch=$(git branch --show-current)
echo "📋 Rama actual: $current_branch"

# Verificar estado del repositorio
echo "🔍 Verificando estado del repositorio..."
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Archivos modificados detectados:"
    git status --short
    
    # Agregar todos los cambios
    echo "➕ Agregando cambios al staging..."
    git add .
    
    # Crear commit
    echo "💾 Creando commit..."
    git commit -m "feat: Mejoras en landing page con ofertas dinámicas y cupones reales

- ✨ Sección 'Ofertas destacadas' ahora usa API real de búsqueda de productos
- 🎯 Sección 'Cupones más utilizados' muestra cupones reales de la base de datos
- 📱 Reducido protagonismo de 'Últimas Ofertas Agregadas' para mejor UX
- 🔧 Agregado botón de llamada a la acción al estilo Shoparize
- 🐛 Solucionado error de claves duplicadas en React
- 🐳 Actualizado Dockerfile con variables de entorno necesarias
- 🎨 Mejorado diseño profesional y minimalista"
    
    echo "✅ Commit creado exitosamente"
else
    echo "ℹ️ No hay cambios para commitear"
fi

# Mostrar el último commit
echo "📄 Último commit:"
git log --oneline -1

# Preguntar si hacer push
read -p "¿Deseas hacer push al repositorio remoto? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Haciendo push al repositorio remoto..."
    git push origin $current_branch
    echo "✅ Push completado"
    
    echo ""
    echo "🎉 ¡Despliegue preparado!"
    echo "📋 Próximos pasos:"
    echo "   1. Ve a tu panel de Coolify"
    echo "   2. Inicia el redeploy de la aplicación"
    echo "   3. Verifica que todas las variables de entorno estén configuradas:"
    echo "      - NEXT_PUBLIC_SUPABASE_URL"
    echo "      - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "      - SUPABASE_SERVICE_ROLE_KEY"
    echo "      - SERPAPI_KEY"
    echo "      - NEXT_PUBLIC_MEILISEARCH_URL"
    echo "      - SERVICE_PASSWORD_MEILISEARCH"
    echo "      - GOOGLE_VERIFICATION"
    echo "      - YANDEX_VERIFICATION"
    echo "      - YAHOO_VERIFICATION"
    echo ""
    echo "🔗 URL de producción: https://cuponomics.app"
else
    echo "⏸️ Push cancelado. Puedes hacerlo manualmente con: git push origin $current_branch"
fi

echo "✨ Script completado"