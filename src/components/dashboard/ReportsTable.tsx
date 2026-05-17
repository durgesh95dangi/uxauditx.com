'use client'

import type { DashboardAudit } from '@/lib/dashboard-audits'
import { formatAuditDateTime, getWebsiteName } from '@/lib/dashboard-audits'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ReportActions } from './ReportActions'

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
    <section className="overflow-hidden rounded-lg border border-app-border bg-app-surface shadow-sm">
      {/* Search toolbar */}
      <div className="border-b border-app-border bg-app-bg/50 px-4 py-4 sm:px-6">
        <label htmlFor="reports-search" className="sr-only">
          Search reports
        </label>
        <div className="relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-app-muted" aria-hidden />
          </div>
          <input
            id="reports-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by website name or URL…"
            className="block w-full rounded-lg border border-app-border-strong bg-app-bg py-2.5 pl-10 pr-3 text-sm text-app-foreground placeholder:text-app-muted shadow-sm transition-colors focus:border-app-accent/50 focus:outline-none focus:ring-2 focus:ring-app-accent/25"
          />
        </div>
        <p className="mt-2 text-xs text-app-muted">
          {filtered.length} of {audits.length} report{audits.length === 1 ? '' : 's'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-app-muted">No reports match your search.</p>
      ) : (
        <>
          {/* Mobile: card list */}
          <ul className="divide-y divide-app-border md:hidden">
            {filtered.map((audit) => (
              <li key={audit.id} className="space-y-3 px-4 py-4 sm:px-6">
                <p className="text-sm font-medium text-app-foreground">{getWebsiteName(audit)}</p>
                <p className="text-xs text-app-muted">{formatAuditDateTime(audit.created_at)}</p>
                <p className="truncate text-xs text-app-muted">{audit.url}</p>
                <ReportActions auditId={audit.id} websiteName={getWebsiteName(audit)} />
              </li>
            ))}
          </ul>

          {/* Desktop: data table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-app-border">
              <thead className="bg-app-elevated/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-app-muted"
                  >
                    Website
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-app-muted"
                  >
                    URL
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-app-muted"
                  >
                    Generated
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-app-muted"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border bg-app-surface">
                {filtered.map((audit) => (
                  <tr key={audit.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-app-foreground">
                      {getWebsiteName(audit)}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-app-muted">
                      {audit.url}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-app-muted">
                      {formatAuditDateTime(audit.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <ReportActions auditId={audit.id} websiteName={getWebsiteName(audit)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
