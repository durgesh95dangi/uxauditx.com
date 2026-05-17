import { supabase } from '@/lib/supabase'

export type DashboardAudit = {
  id: string
  url: string
  url_domain: string | null
  overall_score: number | null
  status: string
  created_at: string
  summary: string | null
  results: unknown[] | null
}

export function formatAuditDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getWebsiteName(audit: Pick<DashboardAudit, 'url_domain' | 'url'>) {
  return audit.url_domain || audit.url.replace(/^https?:\/\//, '').split('/')[0] || audit.url
}

export function countIssues(results: unknown[] | null) {
  return Array.isArray(results) ? results.length : 0
}

export function computeDashboardStats(audits: DashboardAudit[]) {
  const totalReports = audits.length
  const totalIssues = audits.reduce((sum, audit) => sum + countIssues(audit.results as unknown[] | null), 0)
  const criticalIssues = audits.reduce((sum, audit) => {
    const results = (audit.results as { severity?: string }[]) || []
    return sum + results.filter((r) => r.severity === 'critical').length
  }, 0)
  const avgScore =
    totalReports > 0
      ? Math.round(audits.reduce((sum, audit) => sum + (audit.overall_score || 0), 0) / totalReports)
      : null

  return { totalReports, totalIssues, criticalIssues, avgScore }
}

export async function fetchUserAudits(user: { id: string; email?: string | null }) {
  const { data } = await supabase
    .from('audits')
    .select('id, url, url_domain, overall_score, status, created_at, summary, results')
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .eq('status', 'complete')
    .order('created_at', { ascending: false })

  return (data || []) as DashboardAudit[]
}
