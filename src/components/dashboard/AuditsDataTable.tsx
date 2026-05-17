import type { DashboardAudit } from '@/lib/dashboard-audits'
import { formatAuditDateTime, getWebsiteName } from '@/lib/dashboard-audits'
import {
  dashboardTableCard,
  dashboardTableHead,
  dashboardTableTd,
  dashboardTableTh,
  dashboardTableThRight,
} from '@/design-system'
import { cn } from '@/lib/utils'
import { ReportActions } from './ReportActions'

export function AuditsDataTable({
  audits,
  emptyMessage = 'No reports to show.',
  className,
}: {
  audits: DashboardAudit[]
  emptyMessage?: string
  className?: string
}) {
  if (audits.length === 0) {
    return (
      <div className={cn(dashboardTableCard, className)}>
        <p className="px-6 py-12 text-center text-sm text-app-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn(dashboardTableCard, className)}>
      <ul className="divide-y divide-app-border md:hidden">
        {audits.map((audit) => (
          <li key={audit.id} className="space-y-3 px-4 py-4 sm:px-6">
            <p className="text-sm font-medium text-app-foreground">{getWebsiteName(audit)}</p>
            <p className="text-xs text-app-muted">{formatAuditDateTime(audit.created_at)}</p>
            <p className="truncate text-xs text-app-muted">{audit.url}</p>
            <ReportActions auditId={audit.id} websiteName={getWebsiteName(audit)} />
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-app-border">
          <thead className={dashboardTableHead}>
            <tr>
              <th scope="col" className={dashboardTableTh}>
                Website
              </th>
              <th scope="col" className={dashboardTableTh}>
                URL
              </th>
              <th scope="col" className={dashboardTableTh}>
                Generated
              </th>
              <th scope="col" className={dashboardTableThRight}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border bg-app-surface">
            {audits.map((audit) => (
              <tr key={audit.id} className="transition-colors hover:bg-white/[0.03]">
                <td className={cn(dashboardTableTd, 'font-medium text-app-foreground')}>
                  {getWebsiteName(audit)}
                </td>
                <td className={cn(dashboardTableTd, 'max-w-xs truncate text-app-muted')}>
                  {audit.url}
                </td>
                <td className={cn(dashboardTableTd, 'whitespace-nowrap text-app-muted')}>
                  {formatAuditDateTime(audit.created_at)}
                </td>
                <td className={cn(dashboardTableTd, 'whitespace-nowrap text-right')}>
                  <ReportActions auditId={audit.id} websiteName={getWebsiteName(audit)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
