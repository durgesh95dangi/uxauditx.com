import {
  appBorder,
  appDivide,
  label,
  statValue,
} from '@/design-system'

export function DashboardStats({
  totalReports,
  totalIssues,
  avgScore,
}: {
  totalReports: number
  totalIssues: number
  avgScore: number | null
}) {
  const items = [
    { label: 'Reports generated', value: totalReports, valueClass: 'text-app-foreground' },
    { label: 'Issues found', value: totalIssues, valueClass: 'text-amber-400/90' },
    { label: 'Average CRO score', value: avgScore ?? '—', valueClass: 'text-app-accent' },
  ]

  return (
    <section className={`border-y ${appBorder}`}>
      <ul className={`grid grid-cols-1 sm:grid-cols-3 sm:divide-x ${appDivide}`}>
        {items.map(({ label: itemLabel, value, valueClass }) => (
          <li
            key={itemLabel}
            className="px-0 py-5 first:sm:pl-0 last:sm:pr-0 sm:px-6 sm:py-6"
          >
            <p className={label}>{itemLabel}</p>
            <p className={`${statValue} ${valueClass}`}>{value}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
