"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  // Para paginación simple (Previous/Next) - Recomendado por Meilisearch
  currentOffset?: number
  limit?: number
  hasNextPage?: boolean
  onPreviousPage?: () => void
  onNextPage?: () => void
  
  // Para paginación numerada (menos eficiente)
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  
  // Configuración general
  showPageNumbers?: boolean
  maxVisiblePages?: number
  disabled?: boolean
  className?: string
}

export function MeilisearchPagination({
  // Paginación simple
  currentOffset = 0,
  limit = 20,
  hasNextPage = false,
  onPreviousPage,
  onNextPage,
  
  // Paginación numerada
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  
  // Configuración
  showPageNumbers = false,
  maxVisiblePages = 5,
  disabled = false,
  className
}: PaginationProps) {
  
  // Calcular si estamos en la primera página para paginación simple
  const isFirstPage = currentOffset === 0
  
  // Para paginación numerada
  const getVisiblePages = () => {
    if (!showPageNumbers || !totalPages) return []
    
    const pages: (number | 'ellipsis')[] = []
    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const end = Math.min(totalPages, start + maxVisiblePages - 1)
    
    // Mostrar primera página si no está en el rango visible
    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('ellipsis')
      }
    }
    
    // Páginas visibles
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Mostrar última página si no está en el rango visible
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis')
      }
      pages.push(totalPages)
    }
    
    return pages
  }
  
  if (showPageNumbers && totalPages > 1) {
    // Paginación numerada - Menos eficiente pero más precisa
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          disabled={disabled || currentPage <= 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {getVisiblePages().map((page, index) => (
          page === 'ellipsis' ? (
            <div key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange?.(page)}
              disabled={disabled}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          )
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
          disabled={disabled || currentPage >= totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
      </div>
    )
  }
  
  // Paginación simple (Previous/Next) - Recomendado por Meilisearch
  return (
    <div className={cn("flex items-center justify-center space-x-4", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousPage}
        disabled={disabled || isFirstPage}
        className="flex items-center space-x-2"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Anterior</span>
      </Button>
      
      <div className="flex items-center text-sm text-muted-foreground">
        {currentOffset + 1} - {currentOffset + limit}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNextPage}
        disabled={disabled || !hasNextPage}
        className="flex items-center space-x-2"
      >
        <span>Siguiente</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Hook para manejar paginación simple (recomendado)
export function usePagination(initialLimit = 20) {
  const [offset, setOffset] = useState(0)
  const [limit] = useState(initialLimit)
  
  const nextPage = () => {
    setOffset(prev => prev + limit)
  }
  
  const previousPage = () => {
    setOffset(prev => Math.max(0, prev - limit))
  }
  
  const resetPagination = () => {
    setOffset(0)
  }
  
  return {
    offset,
    limit,
    nextPage,
    previousPage,
    resetPagination,
    isFirstPage: offset === 0
  }
}

// Hook para paginación numerada (menos eficiente)
export function useNumberedPagination(initialPage = 1, hitsPerPage = 20) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize] = useState(hitsPerPage)
  
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }
  
  const nextPage = (totalPages: number) => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }
  
  const previousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }
  
  const resetPagination = () => {
    setCurrentPage(1)
  }
  
  return {
    currentPage,
    pageSize,
    goToPage,
    nextPage,
    previousPage,
    resetPagination
  }
}


