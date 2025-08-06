"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ExtensionBannerProps {
  onClose?: () => void
  className?: string
  storageKey?: string
}

export function ExtensionBanner({ 
  onClose, 
  className = "",
  storageKey = "cuponomics-extension-banner-dismissed"
}: ExtensionBannerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Verificar si el banner ya fue cerrado anteriormente
    const dismissed = localStorage.getItem(storageKey)
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [storageKey])

  const handleClose = () => {
    setIsVisible(false)
    // Guardar en localStorage que el usuario cerró el banner
    localStorage.setItem(storageKey, Date.now().toString())
    onClose?.()
  }

  const handleInstallExtension = () => {
    // Aquí puedes agregar la lógica para abrir la página de la extensión
    // Por ahora usamos un placeholder
    window.open('https://chrome.google.com/webstore/detail/cuponomics/extension-id', '_blank')
    
    // Opcional: cerrar el banner después de hacer clic en instalar
    handleClose()
  }

  if (!isVisible) return null

  return (
    <section className={`w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8 relative shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <button
        className="absolute top-3 right-3 text-blue-600 hover:text-blue-800 text-xl font-bold bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm"
        aria-label="Cerrar banner de extensión"
        onClick={handleClose}
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-center justify-center gap-4">
        {/* Icono de extensión */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        
        {/* Contenido del mensaje */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            🚀 Obtén acceso a todas nuestras ofertas
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Instala nuestra extensión para tu navegador y descubre cupones automáticamente mientras navegas
          </p>
        </div>
        
        {/* Botón de acción */}
        <div className="flex-shrink-0">
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            onClick={handleInstallExtension}
          >
            Instalar Extensión
          </Button>
        </div>
      </div>
      
      {/* Indicador de "Nuevo" */}
      <div className="absolute -top-2 -left-2">
        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          NUEVO
        </span>
      </div>
    </section>
  )
} 