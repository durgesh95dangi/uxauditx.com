import { AuditReport } from '@/components/AuditReport'
import { ReportPrintTrigger } from '@/components/dashboard/ReportPrintTrigger'
import { getWebsiteName } from '@/lib/dashboard-audits'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/utils/supabase/server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '../../../results/[id]/report.css'

export const dynamic = 'force-dynamic'

export default async function DashboardReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ print?: string }>
}) {
  const { id } = await params
  const { print } = await searchParams
  const ssrSupabase = await createClient()
  const {
    data: { user },
  } = await ssrSupabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const { data: audit } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .single()

  if (!audit) {
    notFound()
  }

  const title = getWebsiteName(audit)
  const shouldPrint = print === '1'

  if (audit.status !== 'complete' || !audit.results) {
    return (
      <section className="mx-auto max-w-6xl space-y-6">
        <header>
          <Link
            href="/dashboard/reports"
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to reports
          </Link>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">{title}</h1>
        </header>
        <article className="rounded-xl border border-white/10 bg-[#0f172a] p-8">
          <h2 className="text-lg font-semibold text-white">Analysis in progress</h2>
          <p className="mt-2 text-sm text-slate-400">This report is still being generated. Refresh in a moment.</p>
        </article>
      </section>
    )
  }

  return (
    <section className="-mx-4 -mt-2 sm:-mx-6 lg:-mx-8">
      <ReportPrintTrigger shouldPrint={shouldPrint} />
      <header className="dashboard-print-hide border-b border-white/10 bg-[#09090b] px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/reports"
          className="mb-2 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to reports
        </Link>
        <h1 className="text-xl font-semibold text-white sm:text-2xl">{title}</h1>
        <p className="mt-1 max-w-2xl truncate text-sm text-slate-500">{audit.url}</p>
      </header>

      <AuditReport audit={audit} isLoggedIn showAccountActions={false} dashboardMode />
    </section>
  )
}
