"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { TermsOfServiceModal } from "./terms-of-service-modal"
import { MerchantTermsModal } from "./merchant-terms-modal"

interface TermsCheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  type?: "general" | "merchant"
  required?: boolean
}

export function TermsCheckbox({ checked, onCheckedChange, type = "general", required = true }: TermsCheckboxProps) {
  const [error, setError] = useState(false)

  const handleCheckboxChange = (newChecked: boolean) => {
    setError(false)
    onCheckedChange(newChecked)
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (required && !checked) {
      e.preventDefault()
      setError(true)
      return false
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={checked}
          onCheckedChange={handleCheckboxChange}
          className="mt-1"
        />
        <div className="space-y-1">
          <Label htmlFor="terms" className="text-sm leading-relaxed">
            He leído y acepto los{" "}
            {type === "merchant" ? (
              <>
                <MerchantTermsModal variant="link">
                  Términos de Uso para Merchants
                </MerchantTermsModal>
              </>
            ) : (
              <>
                <TermsOfServiceModal variant="link">
                  Términos de Uso
                </TermsOfServiceModal>
              </>
            )}
            {type === "general" && (
              <>
                {" "}y la{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  Política de Privacidad
                </a>
              </>
            )}
            {required && " *"}
          </Label>
          {error && (
            <p className="text-sm text-red-600">
              Debes aceptar los términos para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 