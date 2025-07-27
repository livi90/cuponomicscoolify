export interface Product {
  id: string
  store_id: string
  name: string
  description?: string
  price: number
  sale_price?: number
  image_url?: string
  product_url?: string
  category?: string
  tags?: string[]
  is_new?: boolean
  is_featured?: boolean
  stock_quantity?: number
  created_at: string
  updated_at: string
  start_date?: string
  end_date?: string
  status: 'active' | 'inactive' | 'draft'
  store?: {
    id: string
    name: string
    logo_url?: string
  }
}

export interface OutletProduct {
  id: string
  name: string
  description?: string
  original_price: number
  outlet_price: number
  discount_percentage: number
  image_url: string
  store_id: string
  rating?: number
  review_count?: number
  is_featured?: boolean
  is_active?: boolean
  created_at: string
  updated_at: string
  store?: {
    id: string
    name: string
    logo_url?: string
  }
}

export interface ProductFormData {
  name: string
  description?: string
  price: number
  sale_price?: number
  image_url?: string
  product_url?: string
  category?: string
  tags?: string[]
  is_new?: boolean
  is_featured?: boolean
  stock_quantity?: number
  start_date?: string
  end_date?: string
  status: 'active' | 'inactive' | 'draft'
}

export interface OutletProductFormData {
  name: string
  description?: string
  original_price: number
  outlet_price: number
  image_url: string
  is_featured?: boolean
  is_active?: boolean
}
