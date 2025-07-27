#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupAudit() {
  console.log('🔧 Configuración de Auditoría de Base de Datos')
  console.log('=' * 50)
  
  const config = {
    cloud: {},
    selfHosted: {}
  }
  
  console.log('\n📡 Configuración de Supabase Cloud:')
  config.cloud.url = await question('URL de Supabase Cloud: ')
  config.cloud.serviceRoleKey = await question('Service Role Key de Supabase Cloud: ')
  
  console.log('\n🖥️ Configuración de Supabase Self-Hosted:')
  config.selfHosted.url = await question('URL de Supabase Self-Hosted: ')
  config.selfHosted.serviceRoleKey = await question('Service Role Key de Supabase Self-Hosted: ')
  
  // Crear archivos de configuración
  const cloudEnvPath = path.join(__dirname, '.env.cloud')
  const selfHostedEnvPath = path.join(__dirname, '.env.selfhosted')
  
  const cloudEnvContent = `SUPABASE_URL=${config.cloud.url}
SUPABASE_SERVICE_ROLE_KEY=${config.cloud.serviceRoleKey}`
  
  const selfHostedEnvContent = `SELF_HOSTED_URL=${config.selfHosted.url}
SELF_HOSTED_SERVICE_ROLE_KEY=${config.selfHosted.serviceRoleKey}`
  
  fs.writeFileSync(cloudEnvPath, cloudEnvContent)
  fs.writeFileSync(selfHostedEnvPath, selfHostedEnvContent)
  
  console.log('\n✅ Archivos de configuración creados:')
  console.log(`   📄 ${cloudEnvPath}`)
  console.log(`   📄 ${selfHostedEnvPath}`)
  
  // Crear scripts de ejecución
  const auditCloudScript = `#!/bin/bash
# Script para auditar Supabase Cloud
export $(cat scripts/.env.cloud | xargs)
node scripts/audit-database.js
`
  
  const compareScript = `#!/bin/bash
# Script para comparar bases de datos
export $(cat scripts/.env.selfhosted | xargs)
node scripts/compare-databases.js scripts/database-audit-report.json
`
  
  const auditCloudPath = path.join(__dirname, 'audit-cloud.sh')
  const comparePath = path.join(__dirname, 'compare-databases.sh')
  
  fs.writeFileSync(auditCloudPath, auditCloudScript)
  fs.writeFileSync(comparePath, compareScript)
  
  // Hacer ejecutables los scripts
  fs.chmodSync(auditCloudPath, '755')
  fs.chmodSync(comparePath, '755')
  
  console.log('\n📜 Scripts de ejecución creados:')
  console.log(`   🚀 ${auditCloudPath}`)
  console.log(`   🔄 ${comparePath}`)
  
  console.log('\n📋 INSTRUCCIONES DE USO:')
  console.log('1. Primero, ejecuta las funciones SQL en Supabase Cloud:')
  console.log('   psql -h tu-host-cloud -U postgres -d postgres -f db/schema/audit-functions.sql')
  console.log('')
  console.log('2. Ejecuta las mismas funciones en Supabase Self-Hosted:')
  console.log('   psql -h tu-host-selfhosted -U postgres -d postgres -f db/schema/audit-functions.sql')
  console.log('')
  console.log('3. Genera el reporte de Cloud:')
  console.log('   ./scripts/audit-cloud.sh')
  console.log('')
  console.log('4. Compara las bases de datos:')
  console.log('   ./scripts/compare-databases.sh')
  console.log('')
  console.log('5. Revisa los reportes generados:')
  console.log('   - scripts/database-audit-report.json (reporte de Cloud)')
  console.log('   - scripts/database-comparison-report.json (comparación)')
  
  rl.close()
}

setupAudit().catch(console.error) 