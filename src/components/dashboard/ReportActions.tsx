'use client'

import { actionGhost, linkAccent } from '@/design-system'
import { Download, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ReportActions({
  auditId,
  websiteName,
}: {
  auditId: string
  websiteName: string
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete the report for ${websiteName}? This cannot be undone.`)) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/audits/${auditId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Delete failed')
      router.refresh()
    } catch {
      alert('Could not delete this report. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  function handleDownload() {
    window.open(`/dashboard/reports/${auditId}?print=1`, '_blank', 'noopener,noreferrer')
  }

  return (
    <span className="flex flex-wrap items-center gap-3 sm:gap-4">
      <button
        type="button"
        onClick={handleDownload}
        className={`${actionGhost} text-app-muted hover:border-app-border-strong hover:text-app-foreground`}
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Download</span>
      </button>
      <Link href={`/dashboard/reports/${auditId}`} className={`${actionGhost} ${linkAccent}`}>
        <Eye className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">View</span>
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className={`${actionGhost} text-red-400/80 hover:border-red-400/30 hover:text-red-300 disabled:opacity-50`}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{deleting ? 'Deleting…' : 'Delete'}</span>
      </button>
    </span>
  )
}
