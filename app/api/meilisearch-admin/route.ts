import { NextRequest, NextResponse } from 'next/server'
import { 
  checkIndexExists, 
  getIndexInfo, 
  createIndexIfNotExists, 
  configureIndexSettings,
  getSampleDocuments 
} from '@/lib/meilisearch/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'info'
    
    switch (action) {
      case 'info':
        const indexInfo = await getIndexInfo()
        const sampleDocs = await getSampleDocuments(3)
        
        return NextResponse.json({
          success: true,
          data: {
            indexInfo,
            sampleDocuments: sampleDocs
          }
        })
        
      case 'check':
        const exists = await checkIndexExists()
        return NextResponse.json({
          success: true,
          data: { exists }
        })
        
      case 'create':
        const createResult = await createIndexIfNotExists()
        return NextResponse.json({
          success: true,
          data: createResult
        })
        
      case 'configure':
        await configureIndexSettings()
        return NextResponse.json({
          success: true,
          message: 'Índice configurado correctamente'
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Acción no válida. Usa: info, check, create, configure'
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in meilisearch-admin API:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
