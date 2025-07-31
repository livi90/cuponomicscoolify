import BuscarOfertasClient from "./BuscarOfertasClient"
import Script from "next/script"

export const metadata = {
  title: "Buscar Ofertas | Cuponomics",
  description: "Encuentra los mejores cupones y ofertas para ahorrar en tus compras",
}

export default async function BuscarOfertasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  
  return (
    <>
      <BuscarOfertasClient searchParams={resolvedSearchParams} />
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
