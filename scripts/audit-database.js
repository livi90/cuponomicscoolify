const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuración - Reemplaza con tus credenciales de Supabase Cloud
const SUPABASE_URL = process.env.SUPABASE_URL || 'TU_SUPABASE_CLOUD_URL'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'TU_SERVICE_ROLE_KEY'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function auditDatabase() {
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

  console.log('🔍 Iniciando auditoría de la base de datos...')

  try {
    // 1. Obtener información de esquemas
    console.log('📋 Obteniendo esquemas...')
    const { data: schemas, error: schemasError } = await supabase
      .rpc('get_schemas')
    
    if (schemasError) {
      console.error('Error obteniendo esquemas:', schemasError)
    } else {
      report.database.schemas = schemas || []
    }

    // 2. Obtener todas las tablas
    console.log('📊 Obteniendo tablas...')
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_info')
    
    if (tablesError) {
      console.error('Error obteniendo tablas:', tablesError)
    } else {
      report.database.tables = tables || []
    }

    // 3. Obtener funciones
    console.log('⚙️ Obteniendo funciones...')
    const { data: functions, error: functionsError } = await supabase
      .rpc('get_functions')
    
    if (functionsError) {
      console.error('Error obteniendo funciones:', functionsError)
    } else {
      report.database.functions = functions || []
    }

    // 4. Obtener triggers
    console.log('🔔 Obteniendo triggers...')
    const { data: triggers, error: triggersError } = await supabase
      .rpc('get_triggers')
    
    if (triggersError) {
      console.error('Error obteniendo triggers:', triggersError)
    } else {
      report.database.triggers = triggers || []
    }

    // 5. Obtener políticas RLS
    console.log('🔒 Obteniendo políticas RLS...')
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies')
    
    if (policiesError) {
      console.error('Error obteniendo políticas:', policiesError)
    } else {
      report.database.policies = policies || []
    }

    // 6. Obtener índices
    console.log('📈 Obteniendo índices...')
    const { data: indexes, error: indexesError } = await supabase
      .rpc('get_indexes')
    
    if (indexesError) {
      console.error('Error obteniendo índices:', indexesError)
    } else {
      report.database.indexes = indexes || []
    }

    // 7. Obtener secuencias
    console.log('🔢 Obteniendo secuencias...')
    const { data: sequences, error: sequencesError } = await supabase
      .rpc('get_sequences')
    
    if (sequencesError) {
      console.error('Error obteniendo secuencias:', sequencesError)
    } else {
      report.database.sequences = sequences || []
    }

    // 8. Obtener vistas
    console.log('👁️ Obteniendo vistas...')
    const { data: views, error: viewsError } = await supabase
      .rpc('get_views')
    
    if (viewsError) {
      console.error('Error obteniendo vistas:', viewsError)
    } else {
      report.database.views = views || []
    }

    // 9. Obtener extensiones
    console.log('🔌 Obteniendo extensiones...')
    const { data: extensions, error: extensionsError } = await supabase
      .rpc('get_extensions')
    
    if (extensionsError) {
      console.error('Error obteniendo extensiones:', extensionsError)
    } else {
      report.database.extensions = extensions || []
    }

    // 10. Obtener roles
    console.log('👥 Obteniendo roles...')
    const { data: roles, error: rolesError } = await supabase
      .rpc('get_roles')
    
    if (rolesError) {
      console.error('Error obteniendo roles:', rolesError)
    } else {
      report.database.roles = roles || []
    }

    // 11. Contar registros en cada tabla
    console.log('📊 Contando registros en tablas...')
    if (report.database.tables.length > 0) {
      for (const table of report.database.tables) {
        try {
          const { count, error } = await supabase
            .from(table.table_name)
            .select('*', { count: 'exact', head: true })
          
          if (!error) {
            report.data.tableCounts[table.table_name] = count || 0
          }
        } catch (err) {
          console.warn(`No se pudo contar registros en ${table.table_name}:`, err.message)
          report.data.tableCounts[table.table_name] = 'ERROR'
        }
      }
    }

    // 12. Obtener buckets de storage
    console.log('🗂️ Obteniendo buckets de storage...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Error obteniendo buckets:', bucketsError)
    } else {
      report.storage.buckets = buckets || []
      
      // Obtener archivos de cada bucket
      for (const bucket of report.storage.buckets) {
        try {
          const { data: files, error: filesError } = await supabase.storage
            .from(bucket.name)
            .list()
          
          if (!filesError) {
            report.storage.files.push({
              bucket: bucket.name,
              files: files || []
            })
          }
        } catch (err) {
          console.warn(`No se pudieron obtener archivos del bucket ${bucket.name}:`, err.message)
        }
      }
    }

    // 13. Contar usuarios de auth
    console.log('👤 Contando usuarios de auth...')
    try {
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
      if (!usersError) {
        report.auth.users = users.users?.length || 0
        report.auth.identities = users.users?.reduce((acc, user) => acc + (user.identities?.length || 0), 0) || 0
      }
    } catch (err) {
      console.warn('No se pudieron contar usuarios de auth:', err.message)
    }

    // Guardar reporte
    const reportPath = path.join(__dirname, 'database-audit-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    
    console.log('✅ Auditoría completada!')
    console.log(`📄 Reporte guardado en: ${reportPath}`)
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE LA AUDITORÍA:')
    console.log(`📋 Tablas: ${report.database.tables.length}`)
    console.log(`⚙️ Funciones: ${report.database.functions.length}`)
    console.log(`🔔 Triggers: ${report.database.triggers.length}`)
    console.log(`🔒 Políticas RLS: ${report.database.policies.length}`)
    console.log(`📈 Índices: ${report.database.indexes.length}`)
    console.log(`🔢 Secuencias: ${report.database.sequences.length}`)
    console.log(`👁️ Vistas: ${report.database.views.length}`)
    console.log(`🔌 Extensiones: ${report.database.extensions.length}`)
    console.log(`👥 Roles: ${report.database.roles.length}`)
    console.log(`🗂️ Buckets de storage: ${report.storage.buckets.length}`)
    console.log(`👤 Usuarios de auth: ${report.auth.users}`)

    return report

  } catch (error) {
    console.error('❌ Error durante la auditoría:', error)
    throw error
  }
}

// Ejecutar auditoría
if (require.main === module) {
  auditDatabase()
    .then(() => {
      console.log('🎉 Proceso completado exitosamente')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error)
      process.exit(1)
    })
}

module.exports = { auditDatabase } 