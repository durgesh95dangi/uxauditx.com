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
    <section className="space-y-4">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by website name or URL…"
          className="h-11 w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-[#0018F9]/50 focus:outline-none focus:ring-2 focus:ring-[#0018F9]/30"
        />
      </label>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-[#0f172a] px-4 py-8 text-center text-sm text-slate-400">
          No reports match your search.
        </p>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {filtered.map((audit) => (
              <li
                key={audit.id}
                className="rounded-xl border border-white/10 bg-[#0f172a] p-4"
              >
                <p className="font-semibold text-white">{getWebsiteName(audit)}</p>
                <p className="mt-1 text-xs text-slate-500">{formatAuditDateTime(audit.created_at)}</p>
                <p className="mt-2 truncate text-xs text-slate-400">{audit.url}</p>
                <span className="mt-4 block">
                  <ReportActions auditId={audit.id} websiteName={getWebsiteName(audit)} />
                </span>
              </li>
            ))}
          </ul>

          <section className="hidden overflow-hidden rounded-xl border border-white/10 bg-[#0f172a] md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4 font-medium">Website name</th>
                  <th className="px-5 py-4 font-medium">Generated</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((audit) => (
                  <tr key={audit.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{getWebsiteName(audit)}</p>
                      <p className="mt-0.5 max-w-md truncate text-xs text-slate-500">{audit.url}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{formatAuditDateTime(audit.created_at)}</td>
                    <td className="px-5 py-4">
                      <span className="flex justify-end">
                        <ReportActions auditId={audit.id} websiteName={getWebsiteName(audit)} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </section>
  )
}
