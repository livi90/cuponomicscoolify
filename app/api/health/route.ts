import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Aquí puedes agregar verificaciones adicionales como:
    // - Conexión a base de datos
    // - Verificación de servicios externos
    // - Estado de la aplicación
    
    return NextResponse.json(
      { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
} 