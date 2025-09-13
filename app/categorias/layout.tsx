import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Categorías - Cuponomics",
  description: "Explora nuestras categorías de productos con los mejores precios y ofertas",
}

export default function CategoriasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
