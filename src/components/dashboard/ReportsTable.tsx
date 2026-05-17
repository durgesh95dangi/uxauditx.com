'use client'

import type { DashboardAudit } from '@/lib/dashboard-audits'
import { getWebsiteName } from '@/lib/dashboard-audits'
import { dashboardSection } from '@/design-system'
import { useMemo, useState } from 'react'
import { AuditsDataTable } from './AuditsDataTable'
import { DashboardSearchBar } from './DashboardSearchBar'

export function ReportsTable({ audits }: { audits: DashboardAudit[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return audits
    return audits.filter((audit) => {
      const name = getWebsiteName(audit).toLowerCase()
      const url = audit.url.toLowerCase()
      return name.includes(q) || url.includes(q)
    })
  }, [audits, query])

  if (audits.length === 0) {
    return null
  }

  return (
    <section className={dashboardSection}>
      <DashboardSearchBar
        id="reports-search"
        value={query}
        onChange={setQuery}
        filteredCount={filtered.length}
        totalCount={audits.length}
      />
      <AuditsDataTable
        audits={filtered}
        emptyMessage="No reports match your search."
      />
    </section>
  )
}
