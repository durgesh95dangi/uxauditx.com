import { DashboardNewAudit } from '@/components/DashboardNewAudit'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentReports } from '@/components/dashboard/RecentReports'
import {
  appBorder,
  emptyState,
  pageContainer,
  pageDescription,
  pageHeader,
  pageTitle,
  sectionTitle,
} from '@/design-system'
import { computeDashboardStats } from '@/lib/dashboard-audits'
import { getDashboardContext } from '@/lib/dashboard-user'
import { BarChart3 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { user, audits } = await getDashboardContext()
  const stats = computeDashboardStats(audits)

  return (
    <section className={pageContainer}>
      <header className={pageHeader}>
        <span>
          <h1 className={pageTitle}>Dashboard</h1>
          <p className={pageDescription}>
            Overview of your CRO audits, issues found, and recent activity.
          </p>
        </span>
        <DashboardNewAudit userEmail={user.email || ''} />
      </header>

      <div className="space-y-0 py-6">
        <DashboardStats
          totalReports={stats.totalReports}
          totalIssues={stats.totalIssues}
          avgScore={stats.avgScore}
        />

        {audits.length === 0 ? (
          <article className={`border-t ${appBorder} ${emptyState}`}>
            <BarChart3 className="mx-auto mb-4 h-10 w-10 text-app-muted" />
            <h2 className={sectionTitle}>No reports yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-app-muted">
              Run your first audit to see statistics and reports here.
            </p>
            <span className="mx-auto mt-8 block max-w-xl text-left">
              <DashboardNewAudit userEmail={user.email || ''} defaultOpen />
            </span>
          </article>
        ) : (
          <RecentReports audits={audits} />
        )}
      </div>
    </section>
  )
}
