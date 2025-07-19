"use client"

import React, { createContext, useContext, useState } from "react"

export type LocaleContextType = {
  locale: string
  setLocale: (locale: string) => void
}

const LocaleContext = createContext<LocaleContextType>({ locale: "es", setLocale: () => {} })

export function useLocale() {
  return useContext(LocaleContext)
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<string>(typeof window !== "undefined" ? (localStorage.getItem("locale") || "es") : "es")
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = locale
      localStorage.setItem("locale", locale)
    }
  }, [locale])
  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
} 