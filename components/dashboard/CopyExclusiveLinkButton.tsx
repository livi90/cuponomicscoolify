"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function CopyExclusiveLinkButton() {
  const [copied, setCopied] = useState(false)
  const link = typeof window !== 'undefined' ? `${window.location.origin}/brands-exclusive-register` : '/brands-exclusive-register'

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={link}
        readOnly
        className="border rounded px-2 py-1 w-full text-sm"
        id="exclusive-link"
      />
      <Button
        type="button"
        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
        onClick={handleCopy}
      >
        {copied ? "¡Copiado!" : "Copiar"}
      </Button>
    </div>
  )
} 