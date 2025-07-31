"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useUTMTracking } from "@/hooks/use-utm-tracking"
import { useLocale } from "@/components/locale-provider"
import { Mail, Loader2, CheckCircle } from "lucide-react"

interface NewsletterFormProps {
  source?: string
  className?: string
  title?: string
  description?: string
  buttonText?: string
  placeholder?: string
}

export function NewsletterForm({
  source = "general",
  className = "",
  title = "¡No te pierdas ninguna oferta!",
  description = "Suscríbete a nuestro boletín y recibe las mejores ofertas directamente en tu correo.",
  buttonText = "Suscribirse",
  placeholder = "Tu correo electrónico"
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  // Función para obtener parámetros UTM de la URL actual
  const getUTMParams = () => {
    if (typeof window === 'undefined') return {}
    
    const urlParams = new URLSearchParams(window.location.search)
    return {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
    }
  }
  const { locale } = useLocale()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu correo electrónico",
        variant: "destructive",
      })
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un correo electrónico válido",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Obtener parámetros UTM
      const utmParams = getUTMParams()
      
      // Detectar país basado en el idioma
      const countryMap: Record<string, string> = {
        "es": "ES",
        "en": "US",
        "pt": "BR",
        "fr": "FR",
        "de": "DE"
      }
      const country = countryMap[locale] || "ES"

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          country,
          language: locale,
          source,
          ...utmParams
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setEmail("")
        toast({
          title: "¡Éxito!",
          description: data.message,
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Error al suscribirse al newsletter",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al suscribirse:", error)
      toast({
        title: "Error",
        description: "Error de conexión. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={`text-center ${className}`}>
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-green-700">¡Gracias por suscribirte!</h2>
        <p className="text-green-600">
          Te enviaremos las mejores ofertas directamente a tu correo.
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          variant="outline"
          className="mt-4"
        >
          Suscribir otro email
        </Button>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 mb-6">
        {description}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <div className="relative flex-grow">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 rounded-l-full sm:rounded-r-none border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            disabled={isLoading}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full sm:rounded-l-none px-6 min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </form>
      <p className="text-xs text-gray-500 mt-3">
        No spam, solo las mejores ofertas. Puedes darte de baja en cualquier momento.
      </p>
    </div>
  )
} 