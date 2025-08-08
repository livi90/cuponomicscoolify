export type UserRole = "user" | "merchant" | "admin"

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  email: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Store {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string | null
  website: string | null
  logo_url: string | null
  card_image_url: string | null
  category: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  is_active: boolean
  is_early_adopter: boolean
  created_at: string
  updated_at: string
}

export interface StoreApplication {
  id: string
  user_id: string
  store_name: string
  description: string | null
  website: string | null
  logo_url: string | null
  card_image_url: string | null
  category: string | null
  contact_email: string
  contact_phone: string | null
  address: string | null
  status: "pending" | "approved" | "rejected"
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface Coupon {
  id: string
  store_id: string
  title: string
  description: string | null
  code: string | null
  discount_value: number | null
  discount_type: "percentage" | "fixed" | "free_shipping" | "bogo" | "other" | null
  start_date: string | null
  expiry_date: string | null
  terms_conditions: string | null
  coupon_type: "code" | "deal" | "free_shipping"
  coupon_url: string | null // Nueva propiedad para URL específica del cupón
  banner_url: string | null // Nueva propiedad para banner individual del cupón
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  coupon_category?: string | null // <-- Agregado para soportar la categoría personalizada
  store?: Store
  stats?: CouponStats
  ratings?: Rating[]
  avg_rating?: number
}

export interface CouponStats {
  id: string
  coupon_id: string
  views: number
  clicks: number
  conversions: number
  last_updated: string
}

export interface Rating {
  id: string
  user_id: string
  coupon_id: string
  rating: number
  worked: boolean | null
  comment: string | null
  amount_saved: number | null
  screenshot_url: string | null
  created_at: string
  updated_at: string
  user?: Profile
  votes?: RatingVote[]
  comments?: RatingComment[]
}

export interface RatingVote {
  id: string
  rating_id: string
  user_id: string
  vote_type: "like" | "dislike"
  created_at: string
}

export interface RatingComment {
  id: string
  rating_id: string
  user_id: string
  comment: string
  created_at: string
  updated_at: string
  user?: Profile
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  created_at: string
}

export type NotificationType = "role_change" | "store_application_approved" | "store_application_rejected" | "system"

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  data?: any
  created_at: string
}

export interface Product {
  id: string
  store_id: string
  name: string
  description?: string
  price: number
  sale_price?: number
  image_url?: string
  category?: string
  tags?: string[]
  is_new: boolean
  is_featured: boolean
  stock_quantity: number
  created_at: string
  updated_at: string
  start_date?: string
  end_date?: string
  status: "active" | "inactive" | "draft"
  store?: Store
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  sale_price?: number
  image_url?: string
  category?: string
  tags?: string[]
  is_new: boolean
  is_featured: boolean
  stock_quantity: number
  start_date?: string
  end_date?: string
  status: "active" | "inactive" | "draft"
}
