import { DashboardNewAudit } from '@/components/DashboardNewAudit'
import { ReportsTable } from '@/components/dashboard/ReportsTable'
import {
  emptyState,
  pageContainer,
  pageDescription,
  pageHeader,
  pageTitle,
  sectionTitle,
} from '@/design-system'
import { getDashboardContext } from '@/lib/dashboard-user'
import { BarChart3 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardReportsPage() {
  const { user, audits } = await getDashboardContext()

  return (
    <section className={pageContainer}>
      <header className={pageHeader}>
        <span>
          <h1 className={pageTitle}>Reports</h1>
          <p className={pageDescription}>
            All your generated CRO reports. Search, view, download, or delete.
          </p>
        </span>
        <DashboardNewAudit userEmail={user.email || ''} />
      </header>

      <div className="pt-6">
        {audits.length === 0 ? (
          <article className={emptyState}>
            <BarChart3 className="mx-auto mb-4 h-10 w-10 text-app-muted" />
            <h2 className={sectionTitle}>No reports yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-app-muted">
              Generate an audit to build your report library.
            </p>
            <span className="mx-auto mt-8 block max-w-xl text-left">
              <DashboardNewAudit userEmail={user.email || ''} defaultOpen />
            </span>
          </article>
        ) : (
          <ReportsTable audits={audits} />
        )}
      </div>
    </section>
  )
}
