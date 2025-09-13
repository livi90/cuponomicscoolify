import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestión de Índices Meilisearch - Dashboard Admin',
  description: 'Administra y configura los índices de búsqueda de la plataforma Cuponomics',
}

export default function MeilisearchIndicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-6">
      {children}
    </div>
  )
}
