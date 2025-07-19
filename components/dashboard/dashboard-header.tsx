"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Home, Search, ShoppingBag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardNav } from "./dashboard-nav"
import { useState } from "react"

interface DashboardHeaderProps {
  userEmail: string
  userRole: string
}

export function DashboardHeader({ userEmail, userRole }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16">
      <div className="container flex h-16 items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav userRole={userRole} setOpen={setOpen} />
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2 h-full">
          <img
            src="/images/cuponomics-logo.png"
            alt="Cuponomics Logo"
            className="h-16"
            style={{ display: "block" }}
          />
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6 hidden md:flex">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Inicio
          </Link>
          <Link href="/buscar-ofertas" className="text-sm font-medium transition-colors hover:text-primary">
            Ofertas
          </Link>
          <Link href="/productos-en-oferta" className="text-sm font-medium transition-colors hover:text-primary">
            Productos
          </Link>
          <Link href="/calificar-cupones" className="text-sm font-medium transition-colors hover:text-primary">
            Calificar
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-4 hidden md:inline-block">{userEmail}</span>
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard">
                <User className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

interface MobileNavProps {
  userRole: string
  setOpen: (open: boolean) => void
}

function MobileNav({ userRole, setOpen }: MobileNavProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-7 py-4 border-b">
        <Link href="/" className="flex items-center h-full" onClick={() => setOpen(false)}>
          <img
            src="/images/cuponomics-logo.png"
            alt="Cuponomics Logo"
            className="h-14"
            style={{ display: "block" }}
          />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <Home className="h-4 w-4" />
            Inicio
          </Link>
          <Link
            href="/buscar-ofertas"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <Search className="h-4 w-4" />
            Buscar Ofertas
          </Link>
          <Link
            href="/productos-en-oferta"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <ShoppingBag className="h-4 w-4" />
            Productos
          </Link>
        </nav>
        <div className="mt-2 px-1">
          <DashboardNav userRole={userRole} />
        </div>
      </div>
    </div>
  )
}
