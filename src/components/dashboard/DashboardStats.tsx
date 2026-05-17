import { AlertTriangle, BarChart3, FileText } from 'lucide-react'

export function DashboardStats({
  totalReports,
  totalIssues,
  avgScore,
}: {
  totalReports: number
  totalIssues: number
  avgScore: number | null
}) {
  const cards = [
    {
      label: 'Reports generated',
      value: totalReports,
      icon: FileText,
      accent: 'text-white',
    },
    {
      label: 'Issues found',
      value: totalIssues,
      icon: AlertTriangle,
      accent: 'text-amber-400',
    },
    {
      label: 'Average CRO score',
      value: avgScore ?? '—',
      icon: BarChart3,
      accent: 'text-[#4D5FFF]',
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, accent }) => (
        <article
          key={label}
          className="rounded-xl border border-white/10 bg-[#0f172a] p-5 sm:p-6"
        >
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <Icon className={`h-5 w-5 ${accent}`} />
          </span>
          <p className={`text-3xl font-bold ${accent}`}>{value}</p>
          <p className="mt-1 text-sm text-slate-400">{label}</p>
        </article>
      ))}
    </section>
  )
}
