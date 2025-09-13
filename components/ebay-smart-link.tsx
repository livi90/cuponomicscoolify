'use client'

import { useEffect } from 'react'

export function EbaySmartLink() {
  useEffect(() => {
    // Script de eBay Smart Link
    const script1 = document.createElement('script')
    script1.innerHTML = 'window._epn = {campaign: 5339118953};'
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.src = 'https://epnt.ebay.com/static/epn-smart-tools.js'
    script2.async = true
    document.head.appendChild(script2)

    // Cleanup al desmontar
    return () => {
      if (script1.parentNode) {
        script1.parentNode.removeChild(script1)
      }
      if (script2.parentNode) {
        script2.parentNode.removeChild(script2)
      }
    }
  }, [])

  return null // Este componente no renderiza nada visual
}
