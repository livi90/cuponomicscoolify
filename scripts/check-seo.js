#!/usr/bin/env node

/**
 * Script para verificar la configuración SEO de Cuponomics
 * Uso: node scripts/check-seo.js
 */

const fs = require('fs')
const path = require('path')

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cuponomics.app'

async function checkSEO() {
  console.log('🔍 Verificando configuración SEO de Cuponomics...\n')

  const checks = []

  // 1. Verificar robots.txt
  try {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt')
    if (fs.existsSync(robotsPath)) {
      const robotsContent = fs.readFileSync(robotsPath, 'utf8')
      checks.push({
        name: 'robots.txt',
        status: '✅',
        details: 'Archivo encontrado y configurado'
      })
      
      // Verificar que contenga sitemap
      if (robotsContent.includes('sitemap.xml')) {
        checks.push({
          name: 'Sitemap en robots.txt',
          status: '✅',
          details: 'Referencia al sitemap encontrada'
        })
      } else {
        checks.push({
          name: 'Sitemap en robots.txt',
          status: '❌',
          details: 'Falta referencia al sitemap'
        })
      }
    } else {
      checks.push({
        name: 'robots.txt',
        status: '❌',
        details: 'Archivo no encontrado'
      })
    }
  } catch (error) {
    checks.push({
      name: 'robots.txt',
      status: '❌',
      details: `Error: ${error.message}`
    })
  }

  // 2. Verificar sitemap.ts
  try {
    const sitemapPath = path.join(process.cwd(), 'app', 'sitemap.ts')
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8')
      checks.push({
        name: 'sitemap.ts',
        status: '✅',
        details: 'Archivo encontrado'
      })
      
      // Verificar contenido importante
      if (sitemapContent.includes('MetadataRoute')) {
        checks.push({
          name: 'MetadataRoute import',
          status: '✅',
          details: 'Importación correcta'
        })
      }
      
      if (sitemapContent.includes('createClient')) {
        checks.push({
          name: 'Supabase client',
          status: '✅',
          details: 'Cliente Supabase configurado'
        })
      }
    } else {
      checks.push({
        name: 'sitemap.ts',
        status: '❌',
        details: 'Archivo no encontrado'
      })
    }
  } catch (error) {
    checks.push({
      name: 'sitemap.ts',
      status: '❌',
      details: `Error: ${error.message}`
    })
  }

  // 3. Verificar layout.tsx
  try {
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx')
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8')
      checks.push({
        name: 'layout.tsx',
        status: '✅',
        details: 'Archivo encontrado'
      })
      
      // Verificar metadatos
      if (layoutContent.includes('metadata: Metadata')) {
        checks.push({
          name: 'Metadata config',
          status: '✅',
          details: 'Configuración de metadatos encontrada'
        })
      }
      
      if (layoutContent.includes('openGraph')) {
        checks.push({
          name: 'Open Graph',
          status: '✅',
          details: 'Metadatos Open Graph configurados'
        })
      }
      
      if (layoutContent.includes('twitter')) {
        checks.push({
          name: 'Twitter Cards',
          status: '✅',
          details: 'Metadatos Twitter configurados'
        })
      }
      
      if (layoutContent.includes('application/ld+json')) {
        checks.push({
          name: 'Structured Data',
          status: '✅',
          details: 'Datos estructurados configurados'
        })
      }
    } else {
      checks.push({
        name: 'layout.tsx',
        status: '❌',
        details: 'Archivo no encontrado'
      })
    }
  } catch (error) {
    checks.push({
      name: 'layout.tsx',
      status: '❌',
      details: `Error: ${error.message}`
    })
  }

  // 4. Verificar archivos de configuración
  const configFiles = [
    { name: 'browserconfig.xml', path: 'public/browserconfig.xml' },
    { name: 'site.webmanifest', path: 'public/cuponomics favicon/site.webmanifest' }
  ]

  configFiles.forEach(file => {
    try {
      const filePath = path.join(process.cwd(), file.path)
      if (fs.existsSync(filePath)) {
        checks.push({
          name: file.name,
          status: '✅',
          details: 'Archivo encontrado'
        })
      } else {
        checks.push({
          name: file.name,
          status: '❌',
          details: 'Archivo no encontrado'
        })
      }
    } catch (error) {
      checks.push({
        name: file.name,
        status: '❌',
        details: `Error: ${error.message}`
      })
    }
  })

  // 5. Verificar next.config.mjs
  try {
    const configPath = path.join(process.cwd(), 'next.config.mjs')
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8')
      checks.push({
        name: 'next.config.mjs',
        status: '✅',
        details: 'Archivo encontrado'
      })
      
      if (configContent.includes('headers')) {
        checks.push({
          name: 'Headers config',
          status: '✅',
          details: 'Configuración de headers encontrada'
        })
      }
    } else {
      checks.push({
        name: 'next.config.mjs',
        status: '❌',
        details: 'Archivo no encontrado'
      })
    }
  } catch (error) {
    checks.push({
      name: 'next.config.mjs',
      status: '❌',
      details: `Error: ${error.message}`
    })
  }

  // Mostrar resultados
  console.log('📋 Resultados de la verificación SEO:\n')
  
  checks.forEach(check => {
    console.log(`${check.status} ${check.name}: ${check.details}`)
  })

  const passed = checks.filter(c => c.status === '✅').length
  const total = checks.length

  console.log(`\n📊 Resumen: ${passed}/${total} verificaciones pasaron`)
  
  if (passed === total) {
    console.log('🎉 ¡Todas las verificaciones SEO pasaron exitosamente!')
  } else {
    console.log('⚠️  Algunas verificaciones fallaron. Revisa los detalles arriba.')
  }

  // Recomendaciones adicionales
  console.log('\n💡 Recomendaciones adicionales para SEO:')
  console.log('1. Configura Google Search Console y verifica el sitemap')
  console.log('2. Configura Google Analytics 4')
  console.log('3. Optimiza las imágenes con formatos WebP/AVIF')
  console.log('4. Implementa lazy loading para imágenes')
  console.log('5. Configura cache headers apropiados')
  console.log('6. Monitorea Core Web Vitals')
  console.log('7. Implementa breadcrumbs estructurados')
  console.log('8. Añade datos estructurados para productos y ofertas')

  return passed === total
}

// Ejecutar verificación
checkSEO().catch(console.error) 