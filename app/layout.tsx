import React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import type { Metadata } from "next"
import { LocaleProvider } from "@/components/locale-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Cuponomics - Encuentra las mejores ofertas y cupones verificados",
    template: "%s | Cuponomics"
  },
  description: "Descubre miles de cupones y descuentos verificados para tus tiendas favoritas. Ahorra dinero en tus compras online con Cuponomics. Cupones de descuento, envío gratis y ofertas exclusivas.",
  keywords: [
    "cupones",
    "descuentos",
    "ofertas",
    "ahorro",
    "compras online",
    "códigos de descuento",
    "envío gratis",
    "black friday",
    "cyber monday",
    "outlet",
    "productos en oferta",
    "tiendas online",
    "ecommerce",
    "shopping",
    "deals",
    "promociones"
  ],
  authors: [{ name: "Cuponomics Team" }],
  creator: "Cuponomics",
  publisher: "Cuponomics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cuponomics.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://cuponomics.com',
    title: 'Cuponomics - Encuentra las mejores ofertas y cupones verificados',
    description: 'Descubre miles de cupones y descuentos verificados para tus tiendas favoritas. Ahorra dinero en tus compras online.',
    siteName: 'Cuponomics',
    images: [
      {
        url: '/images/Cuponomics-logo.png',
        width: 1200,
        height: 630,
        alt: 'Cuponomics - Ofertas y Cupones',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cuponomics - Encuentra las mejores ofertas y cupones verificados',
    description: 'Descubre miles de cupones y descuentos verificados para tus tiendas favoritas.',
    images: ['/images/Cuponomics-logo.png'],
    creator: '@cuponomics',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  category: 'shopping',
  classification: 'Business',
  other: {
    'msapplication-TileColor': '#f97316',
    'theme-color': '#f97316',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/cuponomics favicon/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cuponomics" />
        <meta name="application-name" content="Cuponomics" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect para mejorar performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://supabase.co" />
        
        {/* DNS prefetch para recursos externos */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//supabase.co" />
        
        {/* Structured Data para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Cuponomics",
              "url": "https://cuponomics.com",
              "description": "Encuentra las mejores ofertas y cupones verificados para tus tiendas favoritas",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://cuponomics.com/buscar-ofertas?search={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://twitter.com/cuponomics",
                "https://facebook.com/cuponomics"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <LocaleProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
            <SonnerToaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "white",
                  border: "1px solid #e5e7eb",
                  color: "#374151",
                },
              }}
            />
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
