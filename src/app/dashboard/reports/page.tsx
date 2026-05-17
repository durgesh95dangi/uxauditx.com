import { DashboardNewAudit } from '@/components/DashboardNewAudit'
import { ReportsTable } from '@/components/dashboard/ReportsTable'
import { getDashboardContext } from '@/lib/dashboard-user'
import { BarChart3 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardReportsPage() {
  const { user, audits } = await getDashboardContext()

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <span>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Reports</h1>
          <p className="mt-1 text-sm text-slate-400 sm:text-base">
            All your generated CRO reports. Search, view, download, or delete.
          </p>
        </span>
        <DashboardNewAudit userEmail={user.email || ''} />
      </header>

      {audits.length === 0 ? (
        <article className="rounded-xl border border-white/10 bg-[#0f172a] px-6 py-16 text-center">
          <BarChart3 className="mx-auto mb-4 h-12 w-12 text-slate-600" />
          <h2 className="text-xl font-semibold text-white">No reports yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Generate an audit to build your report library.
          </p>
          <span className="mx-auto mt-8 block max-w-xl text-left">
            <DashboardNewAudit userEmail={user.email || ''} defaultOpen />
          </span>
        </article>
      ) : (
        <ReportsTable audits={audits} />
      )}
    </section>
  )
}
