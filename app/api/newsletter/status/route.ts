import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Verificar si las tablas existen
    const tables = [
      "newsletter_subscribers",
      "newsletter_campaigns", 
      "newsletter_campaign_recipients",
      "newsletter_templates",
      "newsletter_events",
      "newsletter_segments"
    ]
    
    const tableStatus: Record<string, { exists: boolean; error: string | null; count: number }> = {}
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("count", { count: "exact", head: true })
          .limit(1)
        
        tableStatus[table] = {
          exists: !error,
          error: error?.message || null,
          count: data?.length || 0
        }
      } catch (err) {
        tableStatus[table] = {
          exists: false,
          error: err instanceof Error ? err.message : "Unknown error",
          count: 0
        }
      }
    }
    
    // Obtener estadísticas básicas
    let totalSubscribers = 0
    let activeSubscribers = 0
    let verifiedSubscribers = 0
    
    try {
      const { count: total } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
      
      const { count: active } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)
      
      const { count: verified } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", true)
      
      totalSubscribers = total || 0
      activeSubscribers = active || 0
      verifiedSubscribers = verified || 0
    } catch (error) {
      console.error("Error getting subscriber stats:", error)
    }
    
    return NextResponse.json({
      success: true,
      status: "operational",
      tables: tableStatus,
      stats: {
        totalSubscribers,
        activeSubscribers,
        verifiedSubscribers
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("Error checking newsletter status:", error)
    
    return NextResponse.json({
      success: false,
      status: "error",
      message: "Error checking newsletter system status",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 