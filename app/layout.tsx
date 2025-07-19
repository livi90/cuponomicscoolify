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
  title: "Cuponomics - Ahorra con las mejores ofertas",
  description:
    "Cuponomics te ayuda a ahorrar mientras compras en línea. Compara precios, encuentra cupones y ahorra dinero automáticamente en Black Friday, Cyber Monday y más eventos.",
  keywords:
    "cuponomics, ahorro, finanzas, extensión, navegador, compras online, cupones, descuentos, cashback, Black Friday, Cyber Monday, Black Week, Días Naranjas, rebajas de verano, plataforma de cupones, ahorro online",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,800&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/cuponomics favicon/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
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
