import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { getDashboardContext } from '@/lib/dashboard-user'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getDashboardContext()

  return <DashboardShell userEmail={user.email || ''}>{children}</DashboardShell>
}
