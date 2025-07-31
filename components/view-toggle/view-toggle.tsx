"use client"

import { Button } from "@/components/ui/button"
import { Grid3X3, List } from "lucide-react"

interface ViewToggleProps {
  viewMode: 'grid' | 'list'
  onViewChange: (mode: 'grid' | 'list') => void
  className?: string
}

export function ViewToggle({ viewMode, onViewChange, className = "" }: ViewToggleProps) {
  return (
    <div className={`flex items-center gap-1 bg-gray-100 rounded-lg p-1 ${className}`}>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={`h-8 px-3 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  )
} 