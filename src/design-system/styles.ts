import { cn } from '@/lib/utils'

/** Page & layout */
export const appBg = 'bg-app-bg text-app-foreground'
export const appSurface = 'bg-app-surface'
export const appBorder = 'border-app-border'
export const appDivide = 'divide-app-border'

/** Typography */
export const pageTitle =
  'text-2xl font-semibold tracking-tight text-app-foreground sm:text-3xl'
export const pageDescription = 'mt-1 text-sm text-app-muted'
export const sectionTitle = 'text-sm font-semibold text-app-foreground'
export const sectionDescription = 'text-sm text-app-muted'
export const label = 'text-xs font-medium uppercase tracking-wide text-app-muted'
export const statValue = 'mt-2 text-3xl font-semibold tabular-nums tracking-tight'
export const formLabel = 'mb-2 block text-sm font-medium text-app-muted-foreground'

/** Layout blocks */
export const pageContainer = 'mx-auto max-w-6xl'
export const pageHeader = cn(
  'flex flex-col gap-4 border-b border-app-border pb-6 sm:flex-row sm:items-start sm:justify-between'
)
export const emptyState = 'py-16 text-center'

/** Auth & modals */
export const authShell = cn('flex min-h-screen items-center justify-center p-4', appBg)
export const authCard = cn(
  'relative w-full max-w-md overflow-hidden rounded-xl border border-app-border-strong bg-app-surface p-8 shadow-xl'
)
export const authCardAccent = 'absolute inset-x-0 top-0 h-px bg-gradient-to-r from-app-primary to-app-accent'
export const authTitle = 'mb-2 text-center text-2xl font-semibold tracking-tight text-app-foreground'
export const authDescription = 'mb-8 text-center text-sm text-app-muted'
export const authFooter = 'mt-8 text-center text-sm text-app-muted'
export const authMessage =
  'mt-4 rounded-lg border border-app-border-strong bg-white/5 p-3 text-center text-sm font-medium text-emerald-400'

/** Brand mark */
export const brandMark =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-app-primary text-white shadow-sm shadow-app-primary/20'
export const brandMarkLg =
  'flex h-12 w-12 items-center justify-center rounded-xl bg-app-primary text-white shadow-md shadow-app-primary/25 ring-1 ring-white/10'
export const brandName = 'font-bold tracking-tight text-app-foreground'
export const brandAccent = 'text-app-accent'

/** Links */
export const linkAccent =
  'text-app-accent transition-colors hover:text-app-foreground'
export const linkMuted =
  'inline-flex items-center gap-2 text-sm text-app-muted transition-colors hover:text-app-foreground'
export const linkInline = 'font-medium text-app-foreground underline-offset-4 hover:underline'

/** Actions (text buttons in tables) */
export const actionGhost =
  'inline-flex items-center gap-1.5 border-b border-transparent px-1 py-1 text-xs font-medium transition-colors sm:text-sm'

/** Dashboard data UI */
export const dashboardTableCard =
  'overflow-hidden rounded-lg border border-app-border bg-app-surface shadow-sm'
export const dashboardTableHead = 'bg-app-elevated/50'
export const dashboardTableTh =
  'px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-app-muted'
export const dashboardTableThRight =
  'px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-app-muted'
export const dashboardTableTd = 'px-6 py-4 text-sm'
export const dashboardSection = 'space-y-4 border-t border-app-border pt-6'

/** Dashboard backward-compat aliases */
export const dashBg = appBg
export const dashBorder = appBorder
export const dashDivide = appDivide
export const dashMuted = 'text-app-muted'
export const dashLabel = label
