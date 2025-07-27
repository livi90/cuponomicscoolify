const fs = require('fs')
const path = require('path')

function generateSummary(comparisonReportPath) {
  console.log('📊 Generando resumen ejecutivo...')
  
  if (!fs.existsSync(comparisonReportPath)) {
    throw new Error(`No se encontró el reporte de comparación en: ${comparisonReportPath}`)
  }
  
  const comparison = JSON.parse(fs.readFileSync(comparisonReportPath, 'utf8'))
  
  const summary = {
    timestamp: new Date().toISOString(),
    cloudReportDate: comparison.cloudReport,
    selfHostedReportDate: comparison.selfHostedReport,
    criticalIssues: [],
    importantIssues: [],
    minorIssues: [],
    recommendations: [],
    statistics: {
      totalMissing: 0,
      totalExtra: 0,
      totalDifferent: 0
    }
  }
  
  // Analizar diferencias por categoría
  Object.entries(comparison.differences).forEach(([category, diff]) => {
    const missing = diff.missing.length
    const extra = diff.extra.length
    const different = diff.different.length
    
    summary.statistics.totalMissing += missing
    summary.statistics.totalExtra += extra
    summary.statistics.totalDifferent += different
    
    // Clasificar por importancia
    if (['tables', 'functions', 'triggers', 'policies'].includes(category)) {
      if (missing > 0) {
        summary.criticalIssues.push({
          category,
          type: 'missing',
          count: missing,
          items: diff.missing.map(item => getItemName(item, category))
        })
      }
      if (different > 0) {
        summary.criticalIssues.push({
          category,
          type: 'different',
          count: different,
          items: diff.different.map(item => getItemName(item, category))
        })
      }
    } else if (['indexes', 'sequences', 'extensions'].includes(category)) {
      if (missing > 0) {
        summary.importantIssues.push({
          category,
          type: 'missing',
          count: missing,
          items: diff.missing.map(item => getItemName(item, category))
        })
      }
      if (different > 0) {
        summary.importantIssues.push({
          category,
          type: 'different',
          count: different,
          items: diff.different.map(item => getItemName(item, category))
        })
      }
    } else {
      if (missing > 0 || different > 0) {
        summary.minorIssues.push({
          category,
          type: 'missing',
          count: missing + different,
          items: [
            ...diff.missing.map(item => getItemName(item, category)),
            ...diff.different.map(item => getItemName(item, category))
          ]
        })
      }
    }
    
    // Elementos extra (menos críticos)
    if (extra > 0) {
      summary.minorIssues.push({
        category,
        type: 'extra',
        count: extra,
        items: diff.extra.map(item => getItemName(item, category))
      })
    }
  })
  
  // Generar recomendaciones
  generateRecommendations(summary, comparison.differences)
  
  // Guardar resumen
  const summaryPath = path.join(__dirname, 'executive-summary.json')
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
  
  // Generar reporte en texto
  const textReport = generateTextReport(summary)
  const textPath = path.join(__dirname, 'executive-summary.txt')
  fs.writeFileSync(textPath, textReport)
  
  console.log('✅ Resumen ejecutivo generado!')
  console.log(`📄 JSON: ${summaryPath}`)
  console.log(`📝 Texto: ${textPath}`)
  
  return summary
}

function getItemName(item, category) {
  switch (category) {
    case 'tables':
      return `${item.table_schema}.${item.table_name}`
    case 'functions':
      return `${item.function_schema}.${item.function_name}`
    case 'triggers':
      return `${item.table_schema}.${item.table_name}.${item.trigger_name}`
    case 'policies':
      return `${item.schema_name}.${item.table_name}.${item.policy_name}`
    case 'indexes':
      return `${item.schema_name}.${item.table_name}.${item.index_name}`
    case 'sequences':
      return `${item.sequence_schema}.${item.sequence_name}`
    case 'views':
      return `${item.view_schema}.${item.view_name}`
    case 'extensions':
      return item.extension_name
    case 'roles':
      return item.role_name
    case 'storage':
      return item.name || item.bucket
    default:
      return JSON.stringify(item).substring(0, 50) + '...'
  }
}

function generateRecommendations(summary, differences) {
  const recommendations = []
  
  // Recomendaciones críticas
  if (summary.criticalIssues.length > 0) {
    recommendations.push({
      priority: 'CRÍTICA',
      action: 'Migrar elementos faltantes inmediatamente',
      description: 'Estos elementos son esenciales para el funcionamiento de la aplicación',
      items: summary.criticalIssues.map(issue => `${issue.category}: ${issue.count} elementos`)
    })
  }
  
  // Recomendaciones importantes
  if (summary.importantIssues.length > 0) {
    recommendations.push({
      priority: 'IMPORTANTE',
      action: 'Migrar elementos faltantes en la próxima ventana de mantenimiento',
      description: 'Estos elementos mejoran el rendimiento y la funcionalidad',
      items: summary.importantIssues.map(issue => `${issue.category}: ${issue.count} elementos`)
    })
  }
  
  // Recomendaciones de datos
  if (differences.data.missing.length > 0 || differences.data.different.length > 0) {
    recommendations.push({
      priority: 'ALTA',
      action: 'Sincronizar datos faltantes',
      description: 'Hay diferencias en los volúmenes de datos entre las bases de datos',
      items: [
        `Tablas faltantes: ${differences.data.missing.length}`,
        `Tablas con diferencias: ${differences.data.different.length}`
      ]
    })
  }
  
  // Recomendaciones de storage
  if (differences.storage.missing.length > 0) {
    recommendations.push({
      priority: 'MEDIA',
      action: 'Migrar buckets de storage faltantes',
      description: 'Algunos buckets de almacenamiento no están en Self-Hosted',
      items: differences.storage.missing.map(item => item.name || item.bucket)
    })
  }
  
  // Recomendaciones generales
  if (summary.statistics.totalMissing === 0 && summary.statistics.totalDifferent === 0) {
    recommendations.push({
      priority: 'INFORMATIVA',
      action: 'Migración exitosa',
      description: '¡Felicitaciones! La migración se completó correctamente',
      items: ['Todas las estructuras están sincronizadas']
    })
  }
  
  summary.recommendations = recommendations
}

function generateTextReport(summary) {
  let report = `RESUMEN EJECUTIVO - AUDITORÍA DE MIGRACIÓN
==================================================
Fecha: ${new Date().toLocaleDateString('es-ES')}
Reporte Cloud: ${new Date(summary.cloudReport).toLocaleDateString('es-ES')}
Reporte Self-Hosted: ${new Date(summary.selfHostedReport).toLocaleDateString('es-ES')}

ESTADÍSTICAS GENERALES
=====================
Elementos faltantes en Self-Hosted: ${summary.statistics.totalMissing}
Elementos extra en Self-Hosted: ${summary.statistics.totalExtra}
Elementos diferentes: ${summary.statistics.totalDifferent}

`

  // Problemas críticos
  if (summary.criticalIssues.length > 0) {
    report += `🚨 PROBLEMAS CRÍTICOS
==================
Estos elementos deben migrarse INMEDIATAMENTE:

`
    summary.criticalIssues.forEach(issue => {
      report += `${issue.category.toUpperCase()} (${issue.type}): ${issue.count} elementos\n`
      issue.items.slice(0, 5).forEach(item => {
        report += `  - ${item}\n`
      })
      if (issue.items.length > 5) {
        report += `  ... y ${issue.items.length - 5} más\n`
      }
      report += '\n'
    })
  }
  
  // Problemas importantes
  if (summary.importantIssues.length > 0) {
    report += `⚠️ PROBLEMAS IMPORTANTES
=======================
Estos elementos deben migrarse en la próxima ventana de mantenimiento:

`
    summary.importantIssues.forEach(issue => {
      report += `${issue.category.toUpperCase()} (${issue.type}): ${issue.count} elementos\n`
      issue.items.slice(0, 3).forEach(item => {
        report += `  - ${item}\n`
      })
      if (issue.items.length > 3) {
        report += `  ... y ${issue.items.length - 3} más\n`
      }
      report += '\n'
    })
  }
  
  // Problemas menores
  if (summary.minorIssues.length > 0) {
    report += `ℹ️ PROBLEMAS MENORES
==================
Estos elementos pueden revisarse más tarde:

`
    summary.minorIssues.forEach(issue => {
      report += `${issue.category.toUpperCase()} (${issue.type}): ${issue.count} elementos\n`
    })
    report += '\n'
  }
  
  // Recomendaciones
  if (summary.recommendations.length > 0) {
    report += `📋 RECOMENDACIONES
==================

`
    summary.recommendations.forEach(rec => {
      report += `Prioridad: ${rec.priority}\n`
      report += `Acción: ${rec.action}\n`
      report += `Descripción: ${rec.description}\n`
      if (rec.items.length > 0) {
        report += `Elementos:\n`
        rec.items.forEach(item => {
          report += `  - ${item}\n`
        })
      }
      report += '\n'
    })
  }
  
  // Resumen final
  if (summary.statistics.totalMissing === 0 && summary.statistics.totalDifferent === 0) {
    report += `✅ CONCLUSIÓN
============
¡Migración exitosa! Todas las estructuras están correctamente sincronizadas.
`
  } else {
    report += `❌ CONCLUSIÓN
============
La migración requiere atención. Hay ${summary.statistics.totalMissing} elementos faltantes y ${summary.statistics.totalDifferent} elementos diferentes que deben resolverse.
`
  }
  
  return report
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const comparisonPath = process.argv[2] || path.join(__dirname, 'database-comparison-report.json')
  
  generateSummary(comparisonPath)
    .then(() => {
      console.log('🎉 Resumen ejecutivo completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error generando resumen:', error)
      process.exit(1)
    })
}

module.exports = { generateSummary } 