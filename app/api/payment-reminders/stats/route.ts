import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { paymentReminderService } from "@/lib/services/payment-reminder-service"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get payment reminder statistics
    const stats = await paymentReminderService.getPaymentReminderStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error getting payment reminder stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
