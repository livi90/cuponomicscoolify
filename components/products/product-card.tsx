import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/types/product"
import { TrackedButton } from "@/components/tracking/tracked-button"
import { useUTMTracking } from "@/hooks/use-utm-tracking"

interface ProductCardProps {
  product: Product
  showStoreInfo?: boolean
}

export function ProductCard({ product, showStoreInfo = true }: ProductCardProps) {
  const { generateProductLink, generateStoreLink } = useUTMTracking()

  // Calcular el porcentaje de descuento si hay precio de oferta
  const discountPercentage =
    product.sale_price && product.price > 0
      ? Math.round(((product.price - product.sale_price) / product.price) * 100)
      : null

  // Generar enlace de tracking para el producto
  const productTrackingLink = product.external_url
    ? generateProductLink(
        product.external_url,
        {
          product_id: product.id,
          store_id: product.store_id,
          store_name: product.store?.name || "Unknown Store",
          category: product.category || undefined,
          price: product.sale_price?.toString() || product.price.toString(),
        },
        product.sale_price ? "sale-products" : "regular-products",
      )
    : null

  // Generar enlace de tracking para la tienda
  const storeTrackingLink = product.store?.website
    ? generateStoreLink(
        product.store.website,
        {
          store_id: product.store_id,
          store_name: product.store?.name || "Unknown Store",
          category: product.store?.category || undefined,
        },
        "product-card-store-link",
      )
    : null

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new && <Badge className="bg-blue-500">Nuevo</Badge>}
          {discountPercentage && <Badge className="bg-red-500">-{discountPercentage}%</Badge>}
        </div>
      </div>

      <CardContent className="p-4">
        {showStoreInfo && product.store && (
          <div className="mb-2">
            <Link href={`/tiendas/${product.store.id}`} className="text-sm text-gray-500 hover:text-orange-500">
              {product.store.name}
            </Link>
          </div>
        )}

        <h3 className="font-semibold line-clamp-1">{product.name}</h3>

        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description || "Sin descripción"}</p>

        <div className="mt-2 flex items-center gap-2">
          {product.sale_price ? (
            <>
              <span className="font-bold text-orange-600">{formatCurrency(product.sale_price)}</span>
              <span className="text-sm text-gray-500 line-through">{formatCurrency(product.price)}</span>
            </>
          ) : (
            <span className="font-bold">{formatCurrency(product.price)}</span>
          )}
        </div>

        {product.category && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {product.stock_quantity > 0 ? (
            product.stock_quantity < 10 ? (
              <span className="text-amber-600">¡Quedan {product.stock_quantity}!</span>
            ) : (
              <span>En stock</span>
            )
          ) : (
            <span className="text-red-500">Agotado</span>
          )}
        </div>

        <div className="flex gap-2">
          <Link href={`/productos/${product.id}`} className="text-sm font-medium text-orange-600 hover:text-orange-800">
            Ver detalles
          </Link>
          {productTrackingLink && (
            <TrackedButton
              trackingLink={productTrackingLink}
              variant="outline"
              size="sm"
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
              showExternalIcon
              additionalData={{
                source: "product-card",
                product_name: product.name,
                page_location: "product-listing",
                has_discount: !!product.sale_price,
              }}
            >
              Comprar
            </TrackedButton>
          )}
          {storeTrackingLink && !productTrackingLink && (
            <TrackedButton
              trackingLink={storeTrackingLink}
              variant="outline"
              size="sm"
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
              showExternalIcon
              additionalData={{
                source: "product-card-store-link",
                store_name: product.store?.name,
                page_location: "product-listing",
              }}
            >
              Ir a tienda
            </TrackedButton>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
