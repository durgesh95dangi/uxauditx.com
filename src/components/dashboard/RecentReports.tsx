import type { DashboardAudit } from '@/lib/dashboard-audits'
import { formatAuditDateTime, getWebsiteName } from '@/lib/dashboard-audits'
import {
  appBorder,
  appDivide,
  linkAccent,
  sectionTitle,
} from '@/design-system'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ReportActions } from './ReportActions'

export function RecentReports({ audits }: { audits: DashboardAudit[] }) {
  const recent = audits.slice(0, 5)

  if (recent.length === 0) return null

  return (
    <section className={`border-t ${appBorder}`}>
      <header
        className={`flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between ${appBorder}`}
      >
        <h2 className={sectionTitle}>Recent reports</h2>
        <Link href="/dashboard/reports" className={`inline-flex items-center gap-1 text-sm ${linkAccent}`}>
          View all reports
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <ul className={`divide-y ${appDivide}`}>
        {recent.map((audit) => (
          <li
            key={audit.id}
            className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="min-w-0">
              <p className="truncate text-sm font-medium text-app-foreground">
                {getWebsiteName(audit)}
              </p>
              <p className="mt-1 text-xs text-app-muted">{formatAuditDateTime(audit.created_at)}</p>
            </span>
            <ReportActions auditId={audit.id} websiteName={getWebsiteName(audit)} />
          </li>
        ))}
      </ul>
    </section>
  )
}
