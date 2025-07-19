export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: "monthly" | "yearly"
  features: string[]
  stripe_price_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  status: "active" | "canceled" | "past_due" | "trialing"
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan
}

export interface SubscriptionPayment {
  id: string
  user_id: string
  subscription_id: string
  stripe_invoice_id: string
  amount: number
  status: "paid" | "pending" | "failed"
  payment_date: string
  created_at: string
}

export interface SubscriptionStats {
  isActive: boolean
  currentPlan: SubscriptionPlan | null
  daysRemaining: number
  nextBillingDate: string | null
  storeLimit: number
  couponLimit: number
  cancelAtPeriodEnd: boolean
  recentPayments: SubscriptionPayment[]
}
