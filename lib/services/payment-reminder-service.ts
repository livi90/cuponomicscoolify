import { createClient } from "@/lib/supabase/client"
import { conversionAnalyticsService } from "./conversion-analytics-service"

export interface PaymentReminder {
  id: string
  merchant_id: string
  commission_amount: number
  period_start: string
  period_end: string
  due_date: string
  status: "pending" | "sent" | "paid" | "overdue" | "cancelled"
  reminder_count: number
  last_reminder_sent?: string
  payment_method: "paypal" | "stripe" | "bank_transfer"
  merchant_email: string
  merchant_name?: string
  invoice_number: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface PaymentReminderStats {
  total_pending: number
  total_overdue: number
  total_amount_pending: number
  total_amount_overdue: number
  reminders_sent_today: number
  upcoming_due_dates: PaymentReminder[]
}

export class PaymentReminderService {
  private supabase = createClient()

  // Generate monthly payment reminders for all merchants
  async generateMonthlyReminders(): Promise<{ success: boolean; created: number; errors: string[] }> {
    try {
      const errors: string[] = []
      let created = 0

      // Get all merchants with stores
      const { data: merchants } = await this.supabase
        .from("profiles")
        .select(`
          id,
          email,
          full_name,
          stores!inner(id)
        `)
        .eq("role", "merchant")

      if (!merchants) {
        return { success: false, created: 0, errors: ["No merchants found"] }
      }

      const currentDate = new Date()
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
      const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15) // Due on 15th of current month

      for (const merchant of merchants) {
        try {
          // Check if reminder already exists for this period
          const { data: existingReminder } = await this.supabase
            .from("payment_reminders")
            .select("id")
            .eq("merchant_id", merchant.id)
            .eq("period_start", lastMonth.toISOString().split("T")[0])
            .eq("period_end", lastMonthEnd.toISOString().split("T")[0])
            .single()

          if (existingReminder) {
            continue // Skip if reminder already exists
          }

          // Get commission data for last month
          const analytics = await conversionAnalyticsService.getMerchantConversions(merchant.id, {
            start: lastMonth.toISOString().split("T")[0],
            end: lastMonthEnd.toISOString().split("T")[0],
          })

          if (analytics.overview.total_commission > 0) {
            // Create payment reminder
            const { error } = await this.supabase.from("payment_reminders").insert({
              merchant_id: merchant.id,
              commission_amount: analytics.overview.total_commission,
              period_start: lastMonth.toISOString().split("T")[0],
              period_end: lastMonthEnd.toISOString().split("T")[0],
              due_date: dueDate.toISOString().split("T")[0],
              merchant_email: merchant.email,
              merchant_name: merchant.full_name,
              status: "pending",
            })

            if (error) {
              errors.push(`Error creating reminder for ${merchant.email}: ${error.message}`)
            } else {
              created++
            }
          }
        } catch (error) {
          errors.push(`Error processing merchant ${merchant.email}: ${error}`)
        }
      }

      return { success: true, created, errors }
    } catch (error) {
      console.error("Error generating monthly reminders:", error)
      return { success: false, created: 0, errors: [error instanceof Error ? error.message : "Unknown error"] }
    }
  }

  // Send payment reminders
  async sendPaymentReminders(): Promise<{ success: boolean; sent: number; errors: string[] }> {
    try {
      const errors: string[] = []
      let sent = 0

      const currentDate = new Date()
      const threeDaysFromNow = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000)

      // Get pending reminders that are due soon or overdue
      const { data: reminders } = await this.supabase
        .from("payment_reminders")
        .select("*")
        .in("status", ["pending", "overdue"])
        .lte("due_date", threeDaysFromNow.toISOString().split("T")[0])
        .order("due_date", { ascending: true })

      if (!reminders || reminders.length === 0) {
        return { success: true, sent: 0, errors: [] }
      }

      for (const reminder of reminders) {
        try {
          // Determine if overdue
          const isOverdue = new Date(reminder.due_date) < currentDate
          const newStatus = isOverdue ? "overdue" : "sent"

          // Send email reminder
          const emailSent = await this.sendReminderEmail(reminder, isOverdue)

          if (emailSent) {
            // Update reminder status
            const { error } = await this.supabase
              .from("payment_reminders")
              .update({
                status: newStatus,
                reminder_count: reminder.reminder_count + 1,
                last_reminder_sent: new Date().toISOString(),
              })
              .eq("id", reminder.id)

            if (error) {
              errors.push(`Error updating reminder ${reminder.invoice_number}: ${error.message}`)
            } else {
              sent++
            }
          } else {
            errors.push(`Failed to send email for reminder ${reminder.invoice_number}`)
          }
        } catch (error) {
          errors.push(`Error processing reminder ${reminder.invoice_number}: ${error}`)
        }
      }

      return { success: true, sent, errors }
    } catch (error) {
      console.error("Error sending payment reminders:", error)
      return { success: false, sent: 0, errors: [error instanceof Error ? error.message : "Unknown error"] }
    }
  }

  // Send individual reminder email
  private async sendReminderEmail(reminder: PaymentReminder, isOverdue: boolean): Promise<boolean> {
    try {
      // In a real implementation, you would integrate with an email service like SendGrid, Mailgun, etc.
      // For now, we'll simulate the email sending

      const emailData = {
        to: reminder.merchant_email,
        subject: isOverdue
          ? `🚨 Pago Vencido - Factura ${reminder.invoice_number} - Cuponomics`
          : `💰 Recordatorio de Pago - Factura ${reminder.invoice_number} - Cuponomics`,
        template: isOverdue ? "overdue-payment" : "payment-reminder",
        data: {
          merchant_name: reminder.merchant_name || "Estimado comerciante",
          invoice_number: reminder.invoice_number,
          commission_amount: reminder.commission_amount,
          due_date: reminder.due_date,
          period_start: reminder.period_start,
          period_end: reminder.period_end,
          payment_method: reminder.payment_method,
          is_overdue: isOverdue,
          days_overdue: isOverdue
            ? Math.floor((new Date().getTime() - new Date(reminder.due_date).getTime()) / (1000 * 60 * 60 * 24))
            : 0,
        },
      }

      // Here you would call your email service API
      console.log("Sending payment reminder email:", emailData)

      // Simulate successful email sending
      return true
    } catch (error) {
      console.error("Error sending reminder email:", error)
      return false
    }
  }

  // Get payment reminder statistics
  async getPaymentReminderStats(): Promise<PaymentReminderStats> {
    try {
      const currentDate = new Date()
      const todayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
      const nextWeek = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)

      // Get pending reminders
      const { data: pendingReminders } = await this.supabase
        .from("payment_reminders")
        .select("commission_amount")
        .eq("status", "pending")

      // Get overdue reminders
      const { data: overdueReminders } = await this.supabase
        .from("payment_reminders")
        .select("commission_amount")
        .eq("status", "overdue")

      // Get reminders sent today
      const { data: todayReminders } = await this.supabase
        .from("payment_reminders")
        .select("id")
        .gte("last_reminder_sent", todayStart.toISOString())

      // Get upcoming due dates
      const { data: upcomingReminders } = await this.supabase
        .from("payment_reminders")
        .select("*")
        .in("status", ["pending", "sent"])
        .gte("due_date", currentDate.toISOString().split("T")[0])
        .lte("due_date", nextWeek.toISOString().split("T")[0])
        .order("due_date", { ascending: true })
        .limit(10)

      const totalPendingAmount = pendingReminders?.reduce((sum, r) => sum + r.commission_amount, 0) || 0
      const totalOverdueAmount = overdueReminders?.reduce((sum, r) => sum + r.commission_amount, 0) || 0

      return {
        total_pending: pendingReminders?.length || 0,
        total_overdue: overdueReminders?.length || 0,
        total_amount_pending: Number(totalPendingAmount.toFixed(2)),
        total_amount_overdue: Number(totalOverdueAmount.toFixed(2)),
        reminders_sent_today: todayReminders?.length || 0,
        upcoming_due_dates: upcomingReminders || [],
      }
    } catch (error) {
      console.error("Error getting payment reminder stats:", error)
      return {
        total_pending: 0,
        total_overdue: 0,
        total_amount_pending: 0,
        total_amount_overdue: 0,
        reminders_sent_today: 0,
        upcoming_due_dates: [],
      }
    }
  }

  // Get merchant's payment reminders
  async getMerchantReminders(merchantId: string): Promise<PaymentReminder[]> {
    try {
      const { data: reminders } = await this.supabase
        .from("payment_reminders")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false })

      return reminders || []
    } catch (error) {
      console.error("Error getting merchant reminders:", error)
      return []
    }
  }

  // Mark payment as paid
  async markAsPaid(reminderId: string, notes?: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("payment_reminders")
        .update({
          status: "paid",
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reminderId)

      return !error
    } catch (error) {
      console.error("Error marking payment as paid:", error)
      return false
    }
  }

  // Cancel payment reminder
  async cancelReminder(reminderId: string, reason?: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("payment_reminders")
        .update({
          status: "cancelled",
          notes: reason || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reminderId)

      return !error
    } catch (error) {
      console.error("Error cancelling reminder:", error)
      return false
    }
  }
}

export const paymentReminderService = new PaymentReminderService()
