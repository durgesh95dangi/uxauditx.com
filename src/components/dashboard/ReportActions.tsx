'use client'

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
    <span className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white sm:text-sm"
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Download</span>
      </button>
      <Link
        href={`/dashboard/reports/${auditId}`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0018F9] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0018F9]/90 sm:text-sm"
      >
        <Eye className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">View</span>
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50 sm:text-sm"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{deleting ? 'Deleting…' : 'Delete'}</span>
      </button>
    </span>
  )
}
