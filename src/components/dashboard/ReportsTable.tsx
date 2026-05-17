'use client'

import type { DashboardAudit } from '@/lib/dashboard-audits'
import { formatAuditDateTime, getWebsiteName } from '@/lib/dashboard-audits'
import {
  appBorder,
  appDivide,
  label,
} from '@/design-system'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
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
    <section className="space-y-0">
      <div className={`border-b pb-4 ${appBorder}`}>
        <label className="relative block max-w-md">
          <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
          <Input
            type="search"
            variant="underline"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by website name or URL…"
            className="pl-8"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className={`border-b py-12 text-center text-sm text-app-muted ${appBorder}`}>
          No reports match your search.
        </p>
      ) : (
        <>
          <ul className={`divide-y md:hidden ${appDivide}`}>
            {filtered.map((audit) => (
              <li key={audit.id} className="space-y-3 py-4">
                <p className="text-sm font-medium text-app-foreground">{getWebsiteName(audit)}</p>
                <p className="text-xs text-app-muted">{formatAuditDateTime(audit.created_at)}</p>
                <p className="truncate text-xs text-app-muted">{audit.url}</p>
                <ReportActions auditId={audit.id} websiteName={getWebsiteName(audit)} />
              </li>
            ))}
          </ul>

          <div className={`hidden overflow-x-auto border-b md:block ${appBorder}`}>
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className={`border-b ${appBorder}`}>
                  <th className={`py-3 pr-4 font-medium ${label}`}>Website name</th>
                  <th className={`py-3 pr-4 font-medium ${label}`}>Generated</th>
                  <th className={`py-3 text-right font-medium ${label}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${appDivide}`}>
                {filtered.map((audit) => (
                  <tr key={audit.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="py-4 pr-4">
                      <p className="font-medium text-app-foreground">{getWebsiteName(audit)}</p>
                      <p className="mt-0.5 max-w-md truncate text-xs text-app-muted">{audit.url}</p>
                    </td>
                    <td className="py-4 pr-4 text-app-muted">
                      {formatAuditDateTime(audit.created_at)}
                    </td>
                    <td className="py-4 text-right">
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
