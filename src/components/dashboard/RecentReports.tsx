import type { DashboardAudit } from '@/lib/dashboard-audits'
import { dashboardSection, linkAccent, sectionTitle } from '@/design-system'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { AuditsDataTable } from './AuditsDataTable'

export function RecentReports({ audits }: { audits: DashboardAudit[] }) {
  const recent = audits.slice(0, 5)

  if (recent.length === 0) return null

  return (
    <section className={dashboardSection}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className={sectionTitle}>Recent reports</h2>
        <Link href="/dashboard/reports" className={`inline-flex items-center gap-1 text-sm ${linkAccent}`}>
          View all reports
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>
      <AuditsDataTable audits={recent} />
    </section>
  )
}
