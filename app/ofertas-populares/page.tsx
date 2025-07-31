import OfertasPopularesClient from "./OfertasPopularesClient"
import Script from "next/script"

export const metadata = {
  title: "Ofertas Populares | Cuponomics",
  description: "Descubre las ofertas más populares y trending del momento. Los cupones más utilizados y mejor valorados por nuestra comunidad.",
}

export default async function OfertasPopularesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  
  return (
    <>
      <OfertasPopularesClient searchParams={resolvedSearchParams} />
      {/* Script de Counter.dev */}
      <Script
        src="https://cdn.counter.dev/script.js"
        data-id="893c3e96-521c-4597-b612-f002b799687e"
        data-utcoffset="2"
        strategy="afterInteractive"
      />
    </>
  )
} 