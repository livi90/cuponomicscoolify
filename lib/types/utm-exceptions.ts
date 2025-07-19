export interface UTMException {
  id: string
  store_id?: string
  owner_id?: string
  store_name: string
  store_slug?: string
  domain: string
  reason?: string
  affiliate_program?: string
  affiliate_id?: string
  custom_tracking_params?: Record<string, any>
  priority: number
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UTMExceptionCheck {
  should_exclude: boolean
  exception_id?: string
  reason?: string
  affiliate_program?: string
  affiliate_id?: string
}

export interface StoreUTMConfig {
  store_id: string
  store_name: string
  domain?: string
  owner_id: string
  exclude_utm: boolean
  affiliate_program?: string
  affiliate_id?: string
  custom_params?: Record<string, any>
}
