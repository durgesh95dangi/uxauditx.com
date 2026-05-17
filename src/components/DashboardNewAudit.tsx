'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const STEPS = [
  'Understanding business context',
  'Benchmarking competitors',
  'Analyzing UX signals',
  'Generating report',
]

export function DashboardNewAudit({
  userEmail,
  defaultOpen = false,
}: {
  userEmail: string
  defaultOpen?: boolean
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setStepIndex(0)

    const interval = window.setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, STEPS.length - 1))
    }, 5000)

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          name: userEmail.split('@')[0] || 'Dashboard User',
          email: userEmail,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      router.push(`/dashboard/reports/${data.auditId}`)
      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong')
      setIsSubmitting(false)
    } finally {
      window.clearInterval(interval)
    }
  }

  if (!isOpen) {
    return (
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-11 bg-[#0018F9] px-5 text-white hover:bg-[#0018F9]/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Audit
      </Button>
    )
  }

  return (
    <section className="rounded-xl border border-white/10 bg-[#0f172a] p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Run New Audit</h2>
          <p className="mt-1 text-sm text-slate-400">Start another CRO report without leaving your dashboard.</p>
        </div>
        {!isSubmitting && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close new audit form"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="url"
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://yourwebsite.com"
          disabled={isSubmitting}
          className="h-12 border-white/10 bg-[#09090b] text-white focus-visible:ring-[#0018F9]"
        />

        {isSubmitting && (
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-[#4D5FFF]" />
            {STEPS[stepIndex]}
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 bg-[#0018F9] px-5 text-white hover:bg-[#0018F9]/90"
        >
          {isSubmitting ? 'Generating report...' : 'Generate Audit'}
        </Button>
      </form>
    </section>
  )
}
