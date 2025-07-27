const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuración - Reemplaza con tus credenciales de Supabase Self-Hosted
const SELF_HOSTED_URL = process.env.SELF_HOSTED_URL || 'TU_SUPABASE_SELF_HOSTED_URL'
const SELF_HOSTED_SERVICE_ROLE_KEY = process.env.SELF_HOSTED_SERVICE_ROLE_KEY || 'TU_SELF_HOSTED_SERVICE_ROLE_KEY'

const selfHostedSupabase = createClient(SELF_HOSTED_URL, SELF_HOSTED_SERVICE_ROLE_KEY)

async function compareDatabases(cloudReportPath) {
  console.log('🔍 Iniciando comparación de bases de datos...')
  
  // Cargar reporte de Cloud
  if (!fs.existsSync(cloudReportPath)) {
    throw new Error(`No se encontró el reporte de Cloud en: ${cloudReportPath}`)
  }
  
  const cloudReport = JSON.parse(fs.readFileSync(cloudReportPath, 'utf8'))
  console.log(`📄 Reporte de Cloud cargado desde: ${cloudReportPath}`)
  console.log(`📅 Fecha del reporte: ${cloudReport.timestamp}`)
  
  // Generar reporte de Self-Hosted
  console.log('🖥️ Generando reporte de Self-Hosted...')
  const selfHostedReport = await generateSelfHostedReport()
  
  // Comparar y generar diferencias
  const comparison = {
    timestamp: new Date().toISOString(),
    cloudReport: cloudReport.timestamp,
    selfHostedReport: selfHostedReport.timestamp,
    differences: {
      tables: compareTables(cloudReport.database.tables, selfHostedReport.database.tables),
      functions: compareFunctions(cloudReport.database.functions, selfHostedReport.database.functions),
      triggers: compareTriggers(cloudReport.database.triggers, selfHostedReport.database.triggers),
      policies: comparePolicies(cloudReport.database.policies, selfHostedReport.database.policies),
      indexes: compareIndexes(cloudReport.database.indexes, selfHostedReport.database.indexes),
      sequences: compareSequences(cloudReport.database.sequences, selfHostedReport.database.sequences),
      views: compareViews(cloudReport.database.views, selfHostedReport.database.views),
      extensions: compareExtensions(cloudReport.database.extensions, selfHostedReport.database.extensions),
      roles: compareRoles(cloudReport.database.roles, selfHostedReport.database.roles),
      storage: compareStorage(cloudReport.storage, selfHostedReport.storage),
      data: compareData(cloudReport.data, selfHostedReport.data)
    },
    summary: {
      missingInSelfHosted: {},
      extraInSelfHosted: {},
      differentInSelfHosted: {}
    }
  }
  
  // Generar resumen
  Object.keys(comparison.differences).forEach(category => {
    const diff = comparison.differences[category]
    comparison.summary.missingInSelfHosted[category] = diff.missing.length
    comparison.summary.extraInSelfHosted[category] = diff.extra.length
    comparison.summary.differentInSelfHosted[category] = diff.different.length
  })
  
  // Guardar comparación
  const comparisonPath = path.join(__dirname, 'database-comparison-report.json')
  fs.writeFileSync(comparisonPath, JSON.stringify(comparison, null, 2))
  
  // Mostrar resumen
  console.log('\n📊 RESUMEN DE COMPARACIÓN:')
  console.log('=' * 50)
  
  Object.keys(comparison.summary.missingInSelfHosted).forEach(category => {
    const missing = comparison.summary.missingInSelfHosted[category]
    const extra = comparison.summary.extraInSelfHosted[category]
    const different = comparison.summary.differentInSelfHosted[category]
    
    if (missing > 0 || extra > 0 || different > 0) {
      console.log(`\n${category.toUpperCase()}:`)
      if (missing > 0) console.log(`  ❌ Faltan en Self-Hosted: ${missing}`)
      if (extra > 0) console.log(`  ➕ Extra en Self-Hosted: ${extra}`)
      if (different > 0) console.log(`  🔄 Diferentes: ${different}`)
    } else {
      console.log(`\n✅ ${category.toUpperCase()}: Sin diferencias`)
    }
  })
  
  console.log(`\n📄 Reporte de comparación guardado en: ${comparisonPath}`)
  
  return comparison
}

async function generateSelfHostedReport() {
  const report = {
    timestamp: new Date().toISOString(),
    database: {
      tables: [],
      functions: [],
      triggers: [],
      policies: [],
      indexes: [],
      sequences: [],
      views: [],
      extensions: [],
      roles: [],
      schemas: []
    },
    data: {
      tableCounts: {},
      sampleData: {}
    },
    storage: {
      buckets: [],
      files: []
    },
    auth: {
      users: 0,
      identities: 0
    }
  }

  try {
    // Obtener información usando las mismas funciones que en Cloud
    console.log('📋 Obteniendo esquemas...')
    const { data: schemas } = await selfHostedSupabase.rpc('get_schemas')
    report.database.schemas = schemas || []

    console.log('📊 Obteniendo tablas...')
    const { data: tables } = await selfHostedSupabase.rpc('get_tables_info')
    report.database.tables = tables || []

    console.log('⚙️ Obteniendo funciones...')
    const { data: functions } = await selfHostedSupabase.rpc('get_functions')
    report.database.functions = functions || []

    console.log('🔔 Obteniendo triggers...')
    const { data: triggers } = await selfHostedSupabase.rpc('get_triggers')
    report.database.triggers = triggers || []

    console.log('🔒 Obteniendo políticas...')
    const { data: policies } = await selfHostedSupabase.rpc('get_policies')
    report.database.policies = policies || []

    console.log('📈 Obteniendo índices...')
    const { data: indexes } = await selfHostedSupabase.rpc('get_indexes')
    report.database.indexes = indexes || []

    console.log('🔢 Obteniendo secuencias...')
    const { data: sequences } = await selfHostedSupabase.rpc('get_sequences')
    report.database.sequences = sequences || []

    console.log('👁️ Obteniendo vistas...')
    const { data: views } = await selfHostedSupabase.rpc('get_views')
    report.database.views = views || []

    console.log('🔌 Obteniendo extensiones...')
    const { data: extensions } = await selfHostedSupabase.rpc('get_extensions')
    report.database.extensions = extensions || []

    console.log('👥 Obteniendo roles...')
    const { data: roles } = await selfHostedSupabase.rpc('get_roles')
    report.database.roles = roles || []

    // Contar registros
    console.log('📊 Contando registros...')
    if (report.database.tables.length > 0) {
      for (const table of report.database.tables) {
        try {
          const { count } = await selfHostedSupabase
            .from(table.table_name)
            .select('*', { count: 'exact', head: true })
          report.data.tableCounts[table.table_name] = count || 0
        } catch (err) {
          report.data.tableCounts[table.table_name] = 'ERROR'
        }
      }
    }

    // Storage
    console.log('🗂️ Obteniendo storage...')
    const { data: buckets } = await selfHostedSupabase.storage.listBuckets()
    report.storage.buckets = buckets || []

    // Auth
    console.log('👤 Contando usuarios...')
    try {
      const { data: users } = await selfHostedSupabase.auth.admin.listUsers()
      report.auth.users = users.users?.length || 0
    } catch (err) {
      console.warn('No se pudieron contar usuarios:', err.message)
    }

  } catch (error) {
    console.error('Error generando reporte de Self-Hosted:', error)
    throw error
  }

  return report
}

function compareTables(cloudTables, selfHostedTables) {
  const cloudMap = new Map(cloudTables.map(t => [`${t.table_schema}.${t.table_name}`, t]))
  const selfHostedMap = new Map(selfHostedTables.map(t => [`${t.table_schema}.${t.table_name}`, t]))
  
  const missing = []
  const extra = []
  const different = []
  
  // Encontrar faltantes en Self-Hosted
  for (const [key, cloudTable] of cloudMap) {
    if (!selfHostedMap.has(key)) {
      missing.push(cloudTable)
    } else {
      const selfHostedTable = selfHostedMap.get(key)
      if (JSON.stringify(cloudTable) !== JSON.stringify(selfHostedTable)) {
        different.push({
          cloud: cloudTable,
          selfHosted: selfHostedTable
        })
      }
    }
  }
  
  // Encontrar extra en Self-Hosted
  for (const [key, selfHostedTable] of selfHostedMap) {
    if (!cloudMap.has(key)) {
      extra.push(selfHostedTable)
    }
  }
  
  return { missing, extra, different }
}

function compareFunctions(cloudFunctions, selfHostedFunctions) {
  const cloudMap = new Map(cloudFunctions.map(f => [`${f.function_schema}.${f.function_name}`, f]))
  const selfHostedMap = new Map(selfHostedFunctions.map(f => [`${f.function_schema}.${f.function_name}`, f]))
  
  const missing = []
  const extra = []
  const different = []
  
  for (const [key, cloudFunction] of cloudMap) {
    if (!selfHostedMap.has(key)) {
      missing.push(cloudFunction)
    } else {
      const selfHostedFunction = selfHostedMap.get(key)
      if (cloudFunction.function_definition !== selfHostedFunction.function_definition) {
        different.push({
          cloud: cloudFunction,
          selfHosted: selfHostedFunction
        })
      }
    }
  }
  
  for (const [key, selfHostedFunction] of selfHostedMap) {
    if (!cloudMap.has(key)) {
      extra.push(selfHostedFunction)
    }
  }
  
  return { missing, extra, different }
}

function compareTriggers(cloudTriggers, selfHostedTriggers) {
  const cloudMap = new Map(cloudTriggers.map(t => [`${t.table_schema}.${t.table_name}.${t.trigger_name}`, t]))
  const selfHostedMap = new Map(selfHostedTriggers.map(t => [`${t.table_schema}.${t.table_name}.${t.trigger_name}`, t]))
  
  const missing = []
  const extra = []
  const different = []
  
  for (const [key, cloudTrigger] of cloudMap) {
    if (!selfHostedMap.has(key)) {
      missing.push(cloudTrigger)
    } else {
      const selfHostedTrigger = selfHostedMap.get(key)
      if (cloudTrigger.trigger_definition !== selfHostedTrigger.trigger_definition) {
        different.push({
          cloud: cloudTrigger,
          selfHosted: selfHostedTrigger
        })
      }
    }
  }
  
  for (const [key, selfHostedTrigger] of selfHostedMap) {
    if (!cloudMap.has(key)) {
      extra.push(selfHostedTrigger)
    }
  }
  
  return { missing, extra, different }
}

function comparePolicies(cloudPolicies, selfHostedPolicies) {
  const cloudMap = new Map(cloudPolicies.map(p => [`${p.schema_name}.${p.table_name}.${p.policy_name}`, p]))
  const selfHostedMap = new Map(selfHostedPolicies.map(p => [`${p.schema_name}.${p.table_name}.${p.policy_name}`, p]))
  
  const missing = []
  const extra = []
  const different = []
  
  for (const [key, cloudPolicy] of cloudMap) {
    if (!selfHostedMap.has(key)) {
      missing.push(cloudPolicy)
    } else {
      const selfHostedPolicy = selfHostedMap.get(key)
      if (cloudPolicy.policy_qual !== selfHostedPolicy.policy_qual || 
          cloudPolicy.policy_with_check !== selfHostedPolicy.policy_with_check) {
        different.push({
          cloud: cloudPolicy,
          selfHosted: selfHostedPolicy
        })
      }
    }
  }
  
  for (const [key, selfHostedPolicy] of selfHostedMap) {
    if (!cloudMap.has(key)) {
      extra.push(selfHostedPolicy)
    }
  }
  
  return { missing, extra, different }
}

function compareIndexes(cloudIndexes, selfHostedIndexes) {
  const cloudMap = new Map(cloudIndexes.map(i => [`${i.schema_name}.${i.table_name}.${i.index_name}`, i]))
  const selfHostedMap = new Map(selfHostedIndexes.map(i => [`${i.schema_name}.${i.table_name}.${i.index_name}`, i]))
  
  const missing = []
  const extra = []
  const different = []
  
  for (const [key, cloudIndex] of cloudMap) {
    if (!selfHostedMap.has(key)) {
      missing.push(cloudIndex)
    } else {
      const selfHostedIndex = selfHostedMap.get(key)
      if (cloudIndex.index_columns !== selfHostedIndex.index_columns) {
        different.push({
          cloud: cloudIndex,
          selfHosted: selfHostedIndex
        })
      }
    }
  }
  
  for (const [key, selfHostedIndex] of selfHostedMap) {
    if (!cloudMap.has(key)) {
      extra.push(selfHostedIndex)
    }
  }
  
  return { missing, extra, different }
}

function compareSequences(cloudSequences, selfHostedSequences) {
  const cloudMap = new Map(cloudSequences.map(s => [`${s.sequence_schema}.${s.sequence_name}`, s]))
  const selfHostedMap = new Map(selfHostedSequences.map(s => [`${s.sequence_schema}.${s.sequence_name}`, s]))
  
  const missing = []
  const extra = []
  const different = []
  
  for (const [key, cloudSequence] of cloudMap) {
    if (!selfHostedMap.has(key)) {
      missing.push(cloudSequence)
    } else {
      const selfHostedSequence = selfHostedMap.get(key)
      if (cloudSequence.start_value !== selfHostedSequence.start_value ||
          cloudSequence.increment !== selfHostedSequence.increment) {
        different.push({
          cloud: cloudSequence,
          selfHosted: selfHostedSequence
        })
      }
    }
  }
  
  for (const [key, selfHostedSequence] of selfHostedMap) {
    if (!cloudMap.has(key)) {
      extra.push(selfHostedSequence)
    }
  }
  
  return { missing, extra, different }
}

function compareViews(cloudViews, selfHostedViews) {
  const cloudMap = new Map(cloudViews.map(v => [`${v.view_schema}.${v.view_name}`, v]))
  const selfHostedMap = new Map(selfHostedViews.map(v => [`${v.view_schema}.${v.view_name}`, v]))
  
  const missing = []
  const extra = []
  const different = []
  
  for (const [key, cloudView] of cloudMap) {
    if (!selfHostedMap.has(key)) {
      missing.push(cloudView)
    } else {
      const selfHostedView = selfHostedMap.get(key)
      if (cloudView.view_definition !== selfHostedView.view_definition) {
        different.push({
          cloud: cloudView,
          selfHosted: selfHostedView
        })
      }
    }
  }
  
  for (const [key, selfHostedView] of selfHostedMap) {
    if (!cloudMap.has(key)) {
      extra.push(selfHostedView)
    }
  }
  
  return { missing, extra, different }
}

function compareExtensions(cloudExtensions, selfHostedExtensions) {
  const cloudMap = new Map(cloudExtensions.map(e => e.extension_name))
  const selfHostedMap = new Map(selfHostedExtensions.map(e => e.extension_name))
  
  const missing = cloudExtensions.filter(e => !selfHostedMap.has(e.extension_name))
  const extra = selfHostedExtensions.filter(e => !cloudMap.has(e.extension_name))
  const different = []
  
  return { missing, extra, different }
}

function compareRoles(cloudRoles, selfHostedRoles) {
  const cloudMap = new Map(cloudRoles.map(r => r.role_name))
  const selfHostedMap = new Map(selfHostedRoles.map(r => r.role_name))
  
  const missing = cloudRoles.filter(r => !selfHostedMap.has(r.role_name))
  const extra = selfHostedRoles.filter(r => !cloudMap.has(r.role_name))
  const different = []
  
  return { missing, extra, different }
}

function compareStorage(cloudStorage, selfHostedStorage) {
  const cloudBuckets = new Map(cloudStorage.buckets.map(b => [b.name, b]))
  const selfHostedBuckets = new Map(selfHostedStorage.buckets.map(b => [b.name, b]))
  
  const missing = cloudStorage.buckets.filter(b => !selfHostedBuckets.has(b.name))
  const extra = selfHostedStorage.buckets.filter(b => !cloudBuckets.has(b.name))
  const different = []
  
  return { missing, extra, different }
}

function compareData(cloudData, selfHostedData) {
  const cloudTables = Object.keys(cloudData.tableCounts)
  const selfHostedTables = Object.keys(selfHostedData.tableCounts)
  
  const missing = cloudTables.filter(t => !selfHostedData.tableCounts.hasOwnProperty(t))
  const extra = selfHostedTables.filter(t => !cloudData.tableCounts.hasOwnProperty(t))
  const different = []
  
  // Comparar conteos de registros
  for (const table of cloudTables) {
    if (selfHostedData.tableCounts.hasOwnProperty(table)) {
      const cloudCount = cloudData.tableCounts[table]
      const selfHostedCount = selfHostedData.tableCounts[table]
      
      if (cloudCount !== selfHostedCount) {
        different.push({
          table,
          cloud: cloudCount,
          selfHosted: selfHostedCount
        })
      }
    }
  }
  
  return { missing, extra, different }
}

// Ejecutar comparación
if (require.main === module) {
  const cloudReportPath = process.argv[2] || path.join(__dirname, 'database-audit-report.json')
  
  compareDatabases(cloudReportPath)
    .then(() => {
      console.log('🎉 Comparación completada exitosamente')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error durante la comparación:', error)
      process.exit(1)
    })
}

module.exports = { compareDatabases } 