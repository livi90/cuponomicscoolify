import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { paymentReminderService } from "@/lib/services/payment-reminder-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { notes } = await request.json()

    // Mark payment as paid
    const success = await paymentReminderService.markAsPaid(params.id, notes)

    if (success) {
      return NextResponse.json({ success: true, message: "Payment marked as paid" })
    } else {
      return NextResponse.json({ error: "Failed to mark payment as paid" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error marking payment as paid:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
