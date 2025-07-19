"use client"

import { useState } from "react"

export function useUTMTracking() {
  const [isTracking, setIsTracking] = useState(false)
  const [trackingError, setTrackingError] = useState<string | null>(null)

  const generateCouponLink = (
    baseUrl: string,
    couponData: {
      coupon_id: string
      coupon_code: string
      store_id: string
      store_name: string
      discount_type: string
      discount_value: string
      category?: string
    },
    userId?: string,
  ) => {
    try {
      const url = new URL(baseUrl)

      // Parámetros UTM para cupones
      url.searchParams.set("utm_source", "cuonomics")
      url.searchParams.set("utm_medium", "coupon")
      url.searchParams.set("utm_campaign", `coupon_${couponData.coupon_id}`)
      url.searchParams.set("utm_content", couponData.coupon_code)
      url.searchParams.set("utm_term", couponData.store_name)

      // Parámetros adicionales
      url.searchParams.set("ref", "cuonomics")
      url.searchParams.set("coupon_id", couponData.coupon_id)
      url.searchParams.set("store_id", couponData.store_id)

      if (userId) {
        url.searchParams.set("user_id", userId)
      }

      const finalUrl = url.toString()
      console.log("Generated coupon link:", finalUrl)
      return finalUrl
    } catch (error) {
      console.error("Error generating coupon link:", error)
      return baseUrl // Fallback al URL original
    }
  }

  const generateStoreLink = (
    baseUrl: string,
    storeData: {
      store_id: string
      store_name: string
      category?: string
    },
    source = "store_page",
    userId?: string,
  ) => {
    try {
      const url = new URL(baseUrl)

      // Parámetros UTM para tiendas
      url.searchParams.set("utm_source", "cuonomics")
      url.searchParams.set("utm_medium", "store")
      url.searchParams.set("utm_campaign", `store_${storeData.store_id}`)
      url.searchParams.set("utm_content", source)
      url.searchParams.set("utm_term", storeData.store_name)

      // Parámetros adicionales
      url.searchParams.set("ref", "cuonomics")
      url.searchParams.set("store_id", storeData.store_id)

      if (userId) {
        url.searchParams.set("user_id", userId)
      }

      return url.toString()
    } catch (error) {
      console.error("Error generating store link:", error)
      return baseUrl
    }
  }

  const generateProductLink = (
    baseUrl: string,
    productData: {
      product_id: string
      product_name: string
      store_id: string
      store_name: string
      category?: string
    },
    userId?: string,
  ) => {
    try {
      const url = new URL(baseUrl)

      // Parámetros UTM para productos
      url.searchParams.set("utm_source", "cuonomics")
      url.searchParams.set("utm_medium", "product")
      url.searchParams.set("utm_campaign", `product_${productData.product_id}`)
      url.searchParams.set("utm_content", productData.product_name)
      url.searchParams.set("utm_term", productData.store_name)

      // Parámetros adicionales
      url.searchParams.set("ref", "cuonomics")
      url.searchParams.set("product_id", productData.product_id)
      url.searchParams.set("store_id", productData.store_id)

      if (userId) {
        url.searchParams.set("user_id", userId)
      }

      return url.toString()
    } catch (error) {
      console.error("Error generating product link:", error)
      return baseUrl
    }
  }

  const generateCampaignLink = (
    baseUrl: string,
    campaignData: {
      campaign_id: string
      campaign_name: string
      campaign_type: string
    },
    userId?: string,
  ) => {
    try {
      const url = new URL(baseUrl)

      // Parámetros UTM para campañas
      url.searchParams.set("utm_source", "cuonomics")
      url.searchParams.set("utm_medium", campaignData.campaign_type)
      url.searchParams.set("utm_campaign", campaignData.campaign_id)
      url.searchParams.set("utm_content", campaignData.campaign_name)

      // Parámetros adicionales
      url.searchParams.set("ref", "cuonomics")
      url.searchParams.set("campaign_id", campaignData.campaign_id)

      if (userId) {
        url.searchParams.set("user_id", userId)
      }

      return url.toString()
    } catch (error) {
      console.error("Error generating campaign link:", error)
      return baseUrl
    }
  }

  const trackClick = async (url: string, additionalData?: Record<string, any>) => {
    setIsTracking(true)
    setTrackingError(null)

    try {
      const response = await fetch("/api/tracking/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          timestamp: new Date().toISOString(),
          ...additionalData,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Click tracked successfully:", result)
      return result
    } catch (error) {
      console.error("Error tracking click:", error)
      setTrackingError(error instanceof Error ? error.message : "Unknown error")
      throw error
    } finally {
      setIsTracking(false)
    }
  }

  const handleTrackedClick = async (url: string, additionalData?: Record<string, any>, openInNewTab = true) => {
    try {
      // Track the click (non-blocking)
      trackClick(url, additionalData).catch(console.error)

      // Open the URL
      if (openInNewTab) {
        window.open(url, "_blank", "noopener,noreferrer")
      } else {
        window.location.href = url
      }
    } catch (error) {
      console.error("Error in handleTrackedClick:", error)
      // Still open the URL even if tracking fails
      if (openInNewTab) {
        window.open(url, "_blank", "noopener,noreferrer")
      } else {
        window.location.href = url
      }
    }
  }

  const trackPageView = async (pageData: {
    page_url: string
    page_title: string
    referrer?: string
    user_id?: string
  }) => {
    try {
      const response = await fetch("/api/tracking/pageview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...pageData,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error tracking page view:", error)
      throw error
    }
  }

  return {
    generateCouponLink,
    generateStoreLink,
    generateProductLink,
    generateCampaignLink,
    trackClick,
    handleTrackedClick,
    trackPageView,
    isTracking,
    trackingError,
  }
}
