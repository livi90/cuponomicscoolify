import type { Store } from "./store"

export interface Product {
  id: string
  store_id: string
  name: string
  description?: string
  price: number
  sale_price?: number
  image_url?: string
  product_url?: string // Nuevo campo para el link del producto
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
  product_url?: string // Nuevo campo para el link del producto
  category?: string
  tags?: string[]
  is_new: boolean
  is_featured: boolean
  stock_quantity: number
  start_date?: string | Date
  end_date?: string | Date
  status: "active" | "inactive" | "draft"
}
