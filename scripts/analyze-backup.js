const fs = require('fs')
const path = require('path')

function analyzeBackup() {
  console.log('🔍 Analizando backup de Supabase Cloud...')
  
  const backupPath = path.join(__dirname, 'violet-garden-backup.sql')
  
  if (!fs.existsSync(backupPath)) {
    console.error('❌ No se encontró el archivo de backup')
    console.log('Por favor, ejecuta primero:')
    console.log('node scripts/copy-backup.js')
    process.exit(1)
  }
  
  const backupContent = fs.readFileSync(backupPath, 'utf8')
  
  // Extraer información del backup
  const backupAnalysis = {
    tables: extractTables(backupContent),
    functions: extractFunctions(backupContent),
    triggers: extractTriggers(backupContent),
    policies: extractPolicies(backupContent),
    indexes: extractIndexes(backupContent),
    sequences: extractSequences(backupContent),
    views: extractViews(backupContent),
    extensions: extractExtensions(backupContent),
    data: extractData(backupContent)
  }
  
  // Analizar esquema actual
  const currentSchema = analyzeCurrentSchema()
  
  // Comparar y generar reporte
  const comparison = compareSchemas(backupAnalysis, currentSchema)
  
  // Guardar reporte
  const reportPath = path.join(__dirname, 'backup-analysis-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(comparison, null, 2))
  
  // Generar resumen ejecutivo
  const summary = generateSummary(comparison)
  const summaryPath = path.join(__dirname, 'backup-analysis-summary.txt')
  fs.writeFileSync(summaryPath, summary)
  
  console.log('✅ Análisis completado!')
  console.log(`📄 Reporte detallado: ${reportPath}`)
  console.log(`📝 Resumen: ${summaryPath}`)
  
  return comparison
}

function extractTables(content) {
  const tables = []
  const tableRegex = /CREATE TABLE (?:IF NOT EXISTS )?([^(]+)\(([\s\S]*?)\);/gi
  let match
  
  while ((match = tableRegex.exec(content)) !== null) {
    const tableName = match[1].trim().replace(/"/g, '')
    const tableDefinition = match[2]
    
    // Extraer columnas
    const columns = extractColumns(tableDefinition)
    
    tables.push({
      name: tableName,
      definition: tableDefinition,
      columns: columns
    })
  }
  
  return tables
}

function extractColumns(tableDefinition) {
  const columns = []
  const lines = tableDefinition.split('\n')
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith('--') && !trimmedLine.startsWith('PRIMARY KEY') && !trimmedLine.startsWith('FOREIGN KEY') && !trimmedLine.startsWith('UNIQUE') && !trimmedLine.startsWith('CHECK')) {
      const columnMatch = trimmedLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s+([^,\s]+)/)
      if (columnMatch) {
        columns.push({
          name: columnMatch[1],
          type: columnMatch[2]
        })
      }
    }
  }
  
  return columns
}

function extractFunctions(content) {
  const functions = []
  const functionRegex = /CREATE OR REPLACE FUNCTION ([^(]+)\(([\s\S]*?)\)\s+RETURNS\s+([^{]+)\s+AS\s+\$\$([\s\S]*?)\$\$/gi
  let match
  
  while ((match = functionRegex.exec(content)) !== null) {
    functions.push({
      name: match[1].trim(),
      parameters: match[2].trim(),
      returnType: match[3].trim(),
      definition: match[4].trim()
    })
  }
  
  return functions
}

function extractTriggers(content) {
  const triggers = []
  const triggerRegex = /CREATE TRIGGER ([^\s]+)\s+([\s\S]*?)\s+ON\s+([^\s]+)/gi
  let match
  
  while ((match = triggerRegex.exec(content)) !== null) {
    triggers.push({
      name: match[1].trim(),
      definition: match[2].trim(),
      table: match[3].trim()
    })
  }
  
  return triggers
}

function extractPolicies(content) {
  const policies = []
  const policyRegex = /CREATE POLICY ([^"]+) ON ([^"]+)/gi
  let match
  
  while ((match = policyRegex.exec(content)) !== null) {
    policies.push({
      name: match[1].trim(),
      table: match[2].trim()
    })
  }
  
  return policies
}

function extractIndexes(content) {
  const indexes = []
  const indexRegex = /CREATE (?:UNIQUE )?INDEX (?:IF NOT EXISTS )?([^\s]+)\s+ON\s+([^\s]+)/gi
  let match
  
  while ((match = indexRegex.exec(content)) !== null) {
    indexes.push({
      name: match[1].trim(),
      table: match[2].trim()
    })
  }
  
  return indexes
}

function extractSequences(content) {
  const sequences = []
  const sequenceRegex = /CREATE SEQUENCE (?:IF NOT EXISTS )?([^\s]+)/gi
  let match
  
  while ((match = sequenceRegex.exec(content)) !== null) {
    sequences.push({
      name: match[1].trim()
    })
  }
  
  return sequences
}

function extractViews(content) {
  const views = []
  const viewRegex = /CREATE (?:OR REPLACE )?(?:TEMP )?VIEW (?:IF NOT EXISTS )?([^\s]+)/gi
  let match
  
  while ((match = viewRegex.exec(content)) !== null) {
    views.push({
      name: match[1].trim()
    })
  }
  
  return views
}

function extractExtensions(content) {
  const extensions = []
  const extensionRegex = /CREATE EXTENSION (?:IF NOT EXISTS )?([^\s;]+)/gi
  let match
  
  while ((match = extensionRegex.exec(content)) !== null) {
    extensions.push({
      name: match[1].trim()
    })
  }
  
  return extensions
}

function extractData(content) {
  const dataInserts = []
  const insertRegex = /INSERT INTO ([^\s]+)[\s\S]*?;/gi
  let match
  
  while ((match = insertRegex.exec(content)) !== null) {
    dataInserts.push({
      table: match[1].trim(),
      statement: match[0].trim()
    })
  }
  
  return dataInserts
}

function analyzeCurrentSchema() {
  const schemaPath = path.join(__dirname, '..', 'db', 'schema')
  const currentSchema = {
    tables: [],
    functions: [],
    triggers: [],
    policies: [],
    indexes: [],
    sequences: [],
    views: [],
    extensions: []
  }
  
  if (fs.existsSync(schemaPath)) {
    const files = fs.readdirSync(schemaPath)
    
    for (const file of files) {
      if (file.endsWith('.sql')) {
        const filePath = path.join(schemaPath, file)
        const content = fs.readFileSync(filePath, 'utf8')
        
        // Extraer información del archivo SQL
        currentSchema.tables.push(...extractTables(content))
        currentSchema.functions.push(...extractFunctions(content))
        currentSchema.triggers.push(...extractTriggers(content))
        currentSchema.policies.push(...extractPolicies(content))
        currentSchema.indexes.push(...extractIndexes(content))
        currentSchema.sequences.push(...extractSequences(content))
        currentSchema.views.push(...extractViews(content))
        currentSchema.extensions.push(...extractExtensions(content))
      }
    }
  }
  
  return currentSchema
}

function compareSchemas(backup, current) {
  const comparison = {
    missing: {
      tables: [],
      functions: [],
      triggers: [],
      policies: [],
      indexes: [],
      sequences: [],
      views: [],
      extensions: []
    },
    extra: {
      tables: [],
      functions: [],
      triggers: [],
      policies: [],
      indexes: [],
      sequences: [],
      views: [],
      extensions: []
    },
    different: {
      tables: [],
      functions: [],
      triggers: [],
      policies: [],
      indexes: [],
      sequences: [],
      views: [],
      extensions: []
    }
  }
  
  // Comparar tablas
  const backupTableNames = new Set(backup.tables.map(t => t.name))
  const currentTableNames = new Set(current.tables.map(t => t.name))
  
  // Faltantes en current
  backup.tables.forEach(table => {
    if (!currentTableNames.has(table.name)) {
      comparison.missing.tables.push(table)
    }
  })
  
  // Extra en current
  current.tables.forEach(table => {
    if (!backupTableNames.has(table.name)) {
      comparison.extra.tables.push(table)
    }
  })
  
  // Comparar funciones
  const backupFunctionNames = new Set(backup.functions.map(f => f.name))
  const currentFunctionNames = new Set(current.functions.map(f => f.name))
  
  backup.functions.forEach(func => {
    if (!currentFunctionNames.has(func.name)) {
      comparison.missing.functions.push(func)
    }
  })
  
  current.functions.forEach(func => {
    if (!backupFunctionNames.has(func.name)) {
      comparison.extra.functions.push(func)
    }
  })
  
  // Comparar triggers
  const backupTriggerNames = new Set(backup.triggers.map(t => t.name))
  const currentTriggerNames = new Set(current.triggers.map(t => t.name))
  
  backup.triggers.forEach(trigger => {
    if (!currentTriggerNames.has(trigger.name)) {
      comparison.missing.triggers.push(trigger)
    }
  })
  
  current.triggers.forEach(trigger => {
    if (!backupTriggerNames.has(trigger.name)) {
      comparison.extra.triggers.push(trigger)
    }
  })
  
  // Comparar políticas
  const backupPolicyNames = new Set(backup.policies.map(p => p.name))
  const currentPolicyNames = new Set(current.policies.map(p => p.name))
  
  backup.policies.forEach(policy => {
    if (!currentPolicyNames.has(policy.name)) {
      comparison.missing.policies.push(policy)
    }
  })
  
  current.policies.forEach(policy => {
    if (!backupPolicyNames.has(policy.name)) {
      comparison.extra.policies.push(policy)
    }
  })
  
  // Comparar índices
  const backupIndexNames = new Set(backup.indexes.map(i => i.name))
  const currentIndexNames = new Set(current.indexes.map(i => i.name))
  
  backup.indexes.forEach(index => {
    if (!currentIndexNames.has(index.name)) {
      comparison.missing.indexes.push(index)
    }
  })
  
  current.indexes.forEach(index => {
    if (!backupIndexNames.has(index.name)) {
      comparison.extra.indexes.push(index)
    }
  })
  
  // Comparar secuencias
  const backupSequenceNames = new Set(backup.sequences.map(s => s.name))
  const currentSequenceNames = new Set(current.sequences.map(s => s.name))
  
  backup.sequences.forEach(sequence => {
    if (!currentSequenceNames.has(sequence.name)) {
      comparison.missing.sequences.push(sequence)
    }
  })
  
  current.sequences.forEach(sequence => {
    if (!backupSequenceNames.has(sequence.name)) {
      comparison.extra.sequences.push(sequence)
    }
  })
  
  // Comparar vistas
  const backupViewNames = new Set(backup.views.map(v => v.name))
  const currentViewNames = new Set(current.views.map(v => v.name))
  
  backup.views.forEach(view => {
    if (!currentViewNames.has(view.name)) {
      comparison.missing.views.push(view)
    }
  })
  
  current.views.forEach(view => {
    if (!backupViewNames.has(view.name)) {
      comparison.extra.views.push(view)
    }
  })
  
  // Comparar extensiones
  const backupExtensionNames = new Set(backup.extensions.map(e => e.name))
  const currentExtensionNames = new Set(current.extensions.map(e => e.name))
  
  backup.extensions.forEach(extension => {
    if (!currentExtensionNames.has(extension.name)) {
      comparison.missing.extensions.push(extension)
    }
  })
  
  current.extensions.forEach(extension => {
    if (!backupExtensionNames.has(extension.name)) {
      comparison.extra.extensions.push(extension)
    }
  })
  
  return comparison
}

function generateSummary(comparison) {
  let summary = `ANÁLISIS DE BACKUP - SUPABASE CLOUD vs ESQUEMA ACTUAL
=============================================================
Fecha: ${new Date().toLocaleDateString('es-ES')}

RESUMEN DE DIFERENCIAS
=====================

🚨 ELEMENTOS FALTANTES EN EL ESQUEMA ACTUAL:
`

  // Elementos faltantes críticos
  if (comparison.missing.tables.length > 0) {
    summary += `\n📊 TABLAS FALTANTES (${comparison.missing.tables.length}):\n`
    comparison.missing.tables.forEach(table => {
      summary += `  - ${table.name}\n`
    })
  }
  
  if (comparison.missing.functions.length > 0) {
    summary += `\n⚙️ FUNCIONES FALTANTES (${comparison.missing.functions.length}):\n`
    comparison.missing.functions.forEach(func => {
      summary += `  - ${func.name}\n`
    })
  }
  
  if (comparison.missing.triggers.length > 0) {
    summary += `\n🔔 TRIGGERS FALTANTES (${comparison.missing.triggers.length}):\n`
    comparison.missing.triggers.forEach(trigger => {
      summary += `  - ${trigger.name} (tabla: ${trigger.table})\n`
    })
  }
  
  if (comparison.missing.policies.length > 0) {
    summary += `\n🔒 POLÍTICAS RLS FALTANTES (${comparison.missing.policies.length}):\n`
    comparison.missing.policies.forEach(policy => {
      summary += `  - ${policy.name} (tabla: ${policy.table})\n`
    })
  }
  
  // Elementos faltantes importantes
  if (comparison.missing.indexes.length > 0) {
    summary += `\n📈 ÍNDICES FALTANTES (${comparison.missing.indexes.length}):\n`
    comparison.missing.indexes.forEach(index => {
      summary += `  - ${index.name} (tabla: ${index.table})\n`
    })
  }
  
  if (comparison.missing.sequences.length > 0) {
    summary += `\n🔢 SECUENCIAS FALTANTES (${comparison.missing.sequences.length}):\n`
    comparison.missing.sequences.forEach(sequence => {
      summary += `  - ${sequence.name}\n`
    })
  }
  
  if (comparison.missing.views.length > 0) {
    summary += `\n👁️ VISTAS FALTANTES (${comparison.missing.views.length}):\n`
    comparison.missing.views.forEach(view => {
      summary += `  - ${view.name}\n`
    })
  }
  
  if (comparison.missing.extensions.length > 0) {
    summary += `\n🔌 EXTENSIONES FALTANTES (${comparison.missing.extensions.length}):\n`
    comparison.missing.extensions.forEach(extension => {
      summary += `  - ${extension.name}\n`
    })
  }
  
  // Elementos extra
  let hasExtra = false
  Object.entries(comparison.extra).forEach(([category, items]) => {
    if (items.length > 0) {
      if (!hasExtra) {
        summary += `\n➕ ELEMENTOS EXTRA EN EL ESQUEMA ACTUAL:\n`
        hasExtra = true
      }
      summary += `\n${category.toUpperCase()} (${items.length}):\n`
      items.forEach(item => {
        summary += `  - ${item.name}\n`
      })
    }
  })
  
  // Recomendaciones
  summary += `\n📋 RECOMENDACIONES:\n`
  summary += `================\n`
  
  const totalMissing = Object.values(comparison.missing).reduce((sum, items) => sum + items.length, 0)
  
  if (totalMissing === 0) {
    summary += `✅ ¡Excelente! Tu esquema actual está completo y actualizado.\n`
  } else {
    summary += `⚠️ Se encontraron ${totalMissing} elementos faltantes.\n`
    summary += `\nPrioridad de migración:\n`
    summary += `1. Tablas (crítico)\n`
    summary += `2. Funciones (crítico)\n`
    summary += `3. Triggers (crítico)\n`
    summary += `4. Políticas RLS (crítico)\n`
    summary += `5. Índices (importante)\n`
    summary += `6. Secuencias (importante)\n`
    summary += `7. Vistas (menor)\n`
    summary += `8. Extensiones (menor)\n`
  }
  
  return summary
}

// Ejecutar análisis
if (require.main === module) {
  analyzeBackup()
    .then(() => {
      console.log('🎉 Análisis completado exitosamente')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error durante el análisis:', error)
      process.exit(1)
    })
}

module.exports = { analyzeBackup } 