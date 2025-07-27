const fs = require('fs')
const path = require('path')

// Ruta del archivo de backup
const backupPath = 'c:\\Users\\JORGE LUIS NIÑO\\Desktop\\supabse migration\\dump\\violet-garden-backup.sql'
const targetPath = path.join(__dirname, 'violet-garden-backup.sql')

console.log('📁 Copiando archivo de backup...')
console.log(`Desde: ${backupPath}`)
console.log(`Hacia: ${targetPath}`)

try {
  // Verificar si el archivo existe
  if (!fs.existsSync(backupPath)) {
    console.error('❌ No se encontró el archivo de backup en la ruta especificada')
    console.log('Por favor, verifica que la ruta sea correcta:')
    console.log(backupPath)
    process.exit(1)
  }

  // Copiar el archivo
  fs.copyFileSync(backupPath, targetPath)
  
  console.log('✅ Archivo copiado exitosamente!')
  console.log('Ahora puedes ejecutar el análisis con:')
  console.log('node scripts/analyze-backup.js')
  
} catch (error) {
  console.error('❌ Error copiando el archivo:', error.message)
  console.log('\nAlternativas:')
  console.log('1. Copia manualmente el archivo a la carpeta scripts/')
  console.log('2. Verifica que tienes permisos para acceder al archivo')
  console.log('3. Asegúrate de que la ruta sea correcta')
} 