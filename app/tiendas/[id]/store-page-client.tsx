"use client"

import { TrackedButton } from "@/components/tracking/tracked-button"
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
  const { generateStoreLink } = useUTMTracking()

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

  const offersTrackingLink = generateStoreLink(
    `/buscar-ofertas?store=${store.id}`,
    {
      store_id: store.id,
      store_name: store.name,
      category: store.category || undefined,
    },
    "store-offers-view",
  )

  return (
    <div className="flex flex-col gap-2">
      {storeTrackingLink && (
        <TrackedButton
          trackingLink={storeTrackingLink}
          className="bg-orange-500 hover:bg-orange-600"
          showExternalIcon
          additionalData={{
            source: "store-page-header",
            action: "visit-store",
            store_name: store.name,
          }}
        >
          Visitar tienda
        </TrackedButton>
      )}
      <Link href={`/buscar-ofertas?store=${store.id}`}>
        <button className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-md transition-colors">
          Ver todas las ofertas
        </button>
      </Link>
    </div>
  )
}
