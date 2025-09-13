'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HybridSearchBarProps {
  className?: string
  placeholder?: string
  onSearch: (query: string) => void
  onClear?: () => void
  autoFocus?: boolean
  disabled?: boolean
  isLoading?: boolean
}

export function HybridSearchBar({
  className = "",
  placeholder = "Buscar productos...",
  onSearch,
  onClear,
  autoFocus = false,
  disabled = false,
  isLoading = false
}: HybridSearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || disabled || isLoading) return

    onSearch(query.trim())
  }

  const handleClear = () => {
    setQuery('')
    if (onClear) {
      onClear()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e as any)
    } else if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <Input
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="pl-12 pr-24 h-14 text-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl shadow-sm"
              autoFocus={autoFocus}
              disabled={disabled}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-9 w-9 p-0 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="submit"
                disabled={!query.trim() || disabled || isLoading}
                className="h-9 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Buscando...</span>
                  </div>
                ) : (
                  'Buscar'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
