'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function DashboardSearchBar({
  id = 'dashboard-search',
  value,
  onChange,
  placeholder = 'Search by website name or URL…',
  filteredCount,
  totalCount,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  filteredCount: number
  totalCount: number
}) {
  return (
    <div className="max-w-md">
      <label htmlFor={id} className="sr-only">
        Search reports
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-app-muted"
          aria-hidden
        />
        <Input
          id={id}
          type="search"
          variant="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      <p className="mt-2 text-xs text-app-muted">
        {filteredCount} of {totalCount} report{totalCount === 1 ? '' : 's'}
      </p>
    </div>
  )
}
