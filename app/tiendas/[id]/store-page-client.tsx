"use client"

import { useUTMTracking } from "@/hooks/use-utm-tracking"
import Link from "next/link"

interface StorePageClientProps {
  store: {
    id: string
    name: string
    website?: string
    category?: string
  }
}

export function StorePageClient({ store }: StorePageClientProps) {
  const { generateStoreLink, handleTrackedClick } = useUTMTracking()

  // Generar enlaces de tracking
  const storeTrackingLink = store.website
    ? generateStoreLink(
        store.website,
        {
          store_id: store.id,
          store_name: store.name,
          category: store.category || undefined,
        },
        "store-page-visit",
      )
    : null



  return (
    <div className="flex flex-col gap-2">
      {storeTrackingLink && (
        <button
          onClick={() => handleTrackedClick(storeTrackingLink, {
            source: "store-page-header",
            action: "visit-store",
            store_name: store.name,
          })}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          Visitar tienda
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      )}
      <Link href={`/buscar-ofertas?store=${store.id}`}>
        <button className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-md transition-colors">
          Ver todas las ofertas
        </button>
      </Link>
    </div>
  )
}
