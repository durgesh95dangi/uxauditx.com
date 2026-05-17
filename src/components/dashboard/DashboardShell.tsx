'use client'

import { signOutAction } from '@/app/auth/actions'
import {
  appBg,
  appBorder,
  brandAccent,
  brandMark,
  brandName,
} from '@/design-system'
import { cn } from '@/lib/utils'
import { FileText, LayoutDashboard, LogOut, Menu, MonitorCheck, X } from 'lucide-react'
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
  const menuOpen = !isCollapsed

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W
  const mainPaddingLeft = isCollapsed
    ? SIDEBAR_COLLAPSED_W
    : overlayExpanded
      ? SIDEBAR_COLLAPSED_W
      : SIDEBAR_EXPANDED_W

  const menuButton = (
    <button
      type="button"
      onClick={toggleCollapsed}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-app-muted transition-colors hover:bg-white/5 hover:text-app-foreground"
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={menuOpen}
      title={menuOpen ? 'Close menu' : 'Open menu'}
    >
      {menuOpen && isCompact ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  )

  return (
    <div className={cn('min-h-screen', appBg)}>
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
          'dashboard-print-hide fixed inset-y-0 left-0 z-50 border-r transition-[width,box-shadow] duration-200 ease-in-out',
          appBg,
          appBorder,
          overlayExpanded && 'shadow-2xl shadow-black/50'
        )}
      >
        <div className="flex h-full flex-col">
          <header
            className={cn(
              'border-b',
              appBorder,
              showLabels ? 'flex items-center gap-2 p-3' : 'flex flex-col items-center gap-2 p-2'
            )}
          >
            {showLabels ? (
              <>
                <Link href="/dashboard" className="flex min-w-0 flex-1 items-center gap-2.5">
                  <span className={brandMark}>
                    <MonitorCheck className="h-4 w-4" />
                  </span>
                  <span className={cn('truncate text-base', brandName)}>
                    UXAudit<span className={brandAccent}>X</span>
                  </span>
                </Link>
                {menuButton}
              </>
            ) : (
              <>
                <Link href="/dashboard" className={brandMark} title="UXAuditX Home">
                  <MonitorCheck className="h-4 w-4" />
                </Link>
                {menuButton}
              </>
            )}
          </header>

          <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact)
              return (
                <Link
                  key={href}
                  href={href}
                  title={showLabels ? undefined : label}
                  onClick={() => overlayExpanded && collapseSidebar()}
                  className={cn(
                    'flex items-center rounded-md py-2 text-sm font-medium transition-colors',
                    showLabels ? 'gap-3 px-3' : 'justify-center px-0',
                    active
                      ? 'bg-white/5 text-app-foreground'
                      : 'text-app-muted hover:bg-white/[0.03] hover:text-app-muted-foreground'
                  )}
                >
                  <Icon
                    className={cn('h-4 w-4 shrink-0', active ? 'text-app-accent' : 'text-app-muted')}
                  />
                  {showLabels && <span>{label}</span>}
                </Link>
              )
            })}
          </nav>

          <footer className={cn('border-t p-2', appBorder)}>
            {showLabels && (
              <p className="mb-2 truncate px-2 text-xs text-app-muted">{userEmail}</p>
            )}
            <form action={signOutAction}>
              <button
                type="submit"
                title="Sign out"
                className={cn(
                  'flex w-full items-center rounded-md py-2 text-sm text-app-muted transition-colors hover:bg-white/[0.03] hover:text-app-foreground',
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
        <header
          className={cn(
            'dashboard-print-hide sticky top-0 z-30 flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-6 lg:hidden',
            appBg,
            appBorder
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
              <span className={brandMark}>
                <MonitorCheck className="h-4 w-4" />
              </span>
              <span className={cn('truncate text-base', brandName)}>
                UXAudit<span className={brandAccent}>X</span>
              </span>
            </Link>
            {menuButton}
          </div>
          <p className="max-w-[40%] truncate text-sm text-app-muted">{userEmail}</p>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
