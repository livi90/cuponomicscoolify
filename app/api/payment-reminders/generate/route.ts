import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { paymentReminderService } from "@/lib/services/payment-reminder-service"

export async function POST(request: NextRequest) {
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

    // Generate monthly reminders
    const result = await paymentReminderService.generateMonthlyReminders()

    return NextResponse.json({
      success: result.success,
      message: `Generated ${result.created} payment reminders`,
      created: result.created,
      errors: result.errors,
    })
  } catch (error) {
    console.error("Error generating payment reminders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
