import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { store_id, domain, owner_id } = body

    // Usar la función de Supabase para verificar excepciones
    const { data, error } = await supabase.rpc("should_exclude_utm_tracking", {
      p_store_id: store_id || null,
      p_domain: domain || null,
      p_owner_id: owner_id || null,
    })

    if (error) {
      console.error("Error checking UTM exclusions:", error)
      return NextResponse.json({ should_exclude: false })
    }

    // La función devuelve un array, tomar el primer resultado
    const result = data && data.length > 0 ? data[0] : { should_exclude: false }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in UTM exceptions check:", error)
    return NextResponse.json({ should_exclude: false })
  }
}
