import type { DashboardAudit } from '@/lib/dashboard-audits'
import { formatAuditDateTime, getWebsiteName } from '@/lib/dashboard-audits'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ReportActions } from './ReportActions'

export function RecentReports({ audits }: { audits: DashboardAudit[] }) {
  const recent = audits.slice(0, 5)

  if (recent.length === 0) return null

  return (
    <section className="rounded-xl border border-white/10 bg-[#0f172a]">
      <header className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="text-lg font-semibold text-white">Recent reports</h2>
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#4D5FFF] transition-colors hover:text-white"
        >
          View all reports
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <ul className="divide-y divide-white/5">
        {recent.map((audit) => (
          <li
            key={audit.id}
            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
            <span className="min-w-0">
              <p className="truncate font-medium text-white">{getWebsiteName(audit)}</p>
              <p className="mt-1 text-xs text-slate-500">{formatAuditDateTime(audit.created_at)}</p>
            </span>
            <ReportActions auditId={audit.id} websiteName={getWebsiteName(audit)} />
          </li>
        ))}
      </ul>
    </section>
  )
}
