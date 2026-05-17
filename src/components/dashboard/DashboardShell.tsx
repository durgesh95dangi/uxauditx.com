'use client'

import { signOutAction } from '@/app/auth/actions'
import { cn } from '@/lib/utils'
import { FileText, LayoutDashboard, LogOut, Menu, MonitorCheck, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText, exact: false },
] as const

export function DashboardShell({
  userEmail,
  children,
}: {
  userEmail: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-[#0018F9] to-[#0018F9]/70">
            <MonitorCheck className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            UXAudit<span className="text-[#4D5FFF]">X</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-[#0018F9]/20 text-white ring-1 ring-[#0018F9]/40'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-[#4D5FFF]' : '')} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="mb-3 truncate px-1 text-xs text-slate-500">{userEmail}</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-50">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'dashboard-print-hide fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#0f172a] transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-5 rounded-md p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
        {sidebar}
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="dashboard-print-hide sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/10 bg-[#09090b]/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden">
              <span className="text-base font-bold text-white">
                UXAudit<span className="text-[#4D5FFF]">X</span>
              </span>
            </div>
          </div>
          <p className="hidden truncate text-sm text-slate-400 sm:block">{userEmail}</p>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
