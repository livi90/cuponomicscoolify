import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { meilisearchClient } from '@/lib/meilisearch/client'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y permisos de administrador
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar que el usuario sea administrador
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const indexName = formData.get('indexName') as string
    const mappingStr = formData.get('mapping') as string

    if (!file || !indexName) {
      return NextResponse.json(
        { error: 'Archivo CSV e índice son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el archivo sea CSV
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      return NextResponse.json(
        { error: 'El archivo debe ser un CSV válido' },
        { status: 400 }
      )
    }

    // Verificar que el índice existe
    try {
      const index = meilisearchClient.index(indexName)
      await index.fetchInfo()
    } catch (error) {
      return NextResponse.json(
        { error: 'El índice especificado no existe' },
        { status: 404 }
      )
    }

    // Leer el archivo CSV
    const csvText = await file.text()
    const lines = csvText.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'El CSV debe tener al menos encabezados y una fila de datos' },
        { status: 400 }
      )
    }

    // Parsear encabezados
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    
    // Parsear mapeo de columnas
    let mapping: Record<string, string> = {}
    try {
      mapping = JSON.parse(mappingStr || '{}')
    } catch (error) {
      // Si no hay mapeo, usar los encabezados originales
      headers.forEach(header => {
        mapping[header] = header
      })
    }

    // Parsear datos
    const documents = []
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Parsear CSV considerando comillas
      const values = parseCSVLine(line)
      
      if (values.length === headers.length) {
        const doc: Record<string, any> = {}
        
        headers.forEach((header, index) => {
          const targetField = mapping[header] || header
          let value = values[index]?.trim().replace(/"/g, '') || ''
          
          // Convertir tipos de datos básicos
          if (value === 'true' || value === 'false') {
            value = value === 'true'
          } else if (!isNaN(Number(value)) && value !== '') {
            value = Number(value)
          }
          
          doc[targetField] = value
        })
        
        documents.push(doc)
      }
    }

    if (documents.length === 0) {
      return NextResponse.json(
        { error: 'No se pudieron parsear documentos del CSV' },
        { status: 400 }
      )
    }

    // Importar documentos al índice
    const index = meilisearchClient.index(indexName)
    const task = await index.addDocuments(documents)

    return NextResponse.json({
      success: true,
      message: `CSV importado correctamente al índice "${indexName}"`,
      importedCount: documents.length,
      taskId: task.taskUid,
      headers: headers,
      mapping: mapping,
      sampleDocument: documents[0]
    })

  } catch (error) {
    console.error('Error importando CSV:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función auxiliar para parsear líneas CSV con comillas
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  values.push(current)
  return values
}
