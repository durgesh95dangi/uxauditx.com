'use client'

import { signOutAction } from '@/app/auth/actions'
import { cn } from '@/lib/utils'
import { FileText, LayoutDashboard, LogOut, Menu, MonitorCheck } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText, exact: false },
] as const

const SIDEBAR_COLLAPSED_KEY = 'uxauditx-sidebar-collapsed'
const SIDEBAR_COLLAPSED_W = '4.5rem'
const SIDEBAR_EXPANDED_W = '16rem'

/** Mobile + tablet: expanded sidebar overlays content. Desktop: sidebar pushes content. */
function useCompactSidebar() {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const update = () => setIsCompact(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isCompact
}

export function DashboardShell({
  userEmail,
  children,
}: {
  userEmail: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isCompact = useCompactSidebar()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    if (stored === 'true') setCollapsed(true)
    setMounted(true)
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
      return next
    })
  }

  const collapseSidebar = () => {
    setCollapsed(true)
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, 'true')
  }

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isCollapsed = mounted && collapsed
  const showLabels = !isCollapsed
  const overlayExpanded = isCompact && !isCollapsed

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W
  const mainPaddingLeft = isCollapsed
    ? SIDEBAR_COLLAPSED_W
    : overlayExpanded
      ? SIDEBAR_COLLAPSED_W
      : SIDEBAR_EXPANDED_W

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-50">
      {overlayExpanded && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={collapseSidebar}
        />
      )}

      <aside
        style={{ width: sidebarWidth }}
        className={cn(
          'dashboard-print-hide fixed inset-y-0 left-0 z-50 border-r border-white/10 bg-[#0f172a] transition-[width,box-shadow] duration-200 ease-in-out',
          overlayExpanded && 'shadow-2xl shadow-black/50'
        )}
      >
        <div className="flex h-full flex-col">
          <header
            className={cn(
              'border-b border-white/10',
              showLabels ? 'flex items-center gap-2 p-3' : 'flex flex-col items-center gap-2 p-2'
            )}
          >
            <button
              type="button"
              onClick={toggleCollapsed}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isCollapsed}
              title={isCollapsed ? 'Expand menu' : 'Collapse menu'}
            >
              <Menu className="h-4 w-4" />
            </button>

            {showLabels ? (
              <Link href="/dashboard" className="flex min-w-0 flex-1 items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-[#0018F9] to-[#0018F9]/70">
                  <MonitorCheck className="h-4 w-4 text-white" />
                </span>
                <span className="truncate text-base font-bold tracking-tight text-white">
                  UXAudit<span className="text-[#4D5FFF]">X</span>
                </span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-[#0018F9] to-[#0018F9]/70"
                title="UXAuditX Home"
              >
                <MonitorCheck className="h-4 w-4 text-white" />
              </Link>
            )}
          </header>

          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact)
              return (
                <Link
                  key={href}
                  href={href}
                  title={showLabels ? undefined : label}
                  onClick={() => overlayExpanded && collapseSidebar()}
                  className={cn(
                    'flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors',
                    showLabels ? 'gap-3 px-3' : 'justify-center px-0',
                    active
                      ? 'bg-[#0018F9]/20 text-white ring-1 ring-[#0018F9]/40'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-[#4D5FFF]' : '')} />
                  {showLabels && <span>{label}</span>}
                </Link>
              )
            })}
          </nav>

          <footer className="border-t border-white/10 p-2">
            {showLabels && (
              <p className="mb-2 truncate px-2 text-xs text-slate-500">{userEmail}</p>
            )}
            <form action={signOutAction}>
              <button
                type="submit"
                title="Sign out"
                className={cn(
                  'flex w-full items-center rounded-lg py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white',
                  showLabels ? 'gap-2 px-3' : 'justify-center px-0'
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {showLabels && <span>Sign out</span>}
              </button>
            </form>
          </footer>
        </div>
      </aside>

      <div
        style={{ paddingLeft: mounted ? mainPaddingLeft : SIDEBAR_EXPANDED_W }}
        className="flex min-h-screen flex-col transition-[padding] duration-200 ease-in-out"
      >
        <header className="dashboard-print-hide sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/10 bg-[#09090b]/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={toggleCollapsed}
              className="rounded-lg border border-white/10 p-2 text-slate-300 transition-colors hover:bg-white/5 lg:hidden"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="truncate text-base font-bold text-white lg:hidden">
              UXAudit<span className="text-[#4D5FFF]">X</span>
            </span>
          </div>
          <p className="hidden max-w-[50%] truncate text-sm text-slate-400 sm:block">{userEmail}</p>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

