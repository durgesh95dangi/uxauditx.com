'use client'

import {
  appBorder,
  sectionDescription,
  sectionTitle,
} from '@/design-system'
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
      <Button type="button" onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Audit
      </Button>
    )
  }

  const Wrapper = 'div' as const

  return (
    <section className={`border-t pt-6 ${appBorder}`}>
      <Wrapper className="mb-4 flex items-start justify-between gap-4">
        <Wrapper>
          <h2 className={sectionTitle}>Run new audit</h2>
          <p className={`mt-1 ${sectionDescription}`}>
            Start another CRO report from your dashboard.
          </p>
        </Wrapper>
        {!isSubmitting && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 text-app-muted transition-colors hover:text-app-foreground"
            aria-label="Close new audit form"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </Wrapper>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <Input
          type="url"
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://yourwebsite.com"
          disabled={isSubmitting}
        />

        {isSubmitting && (
          <p className="flex items-center gap-2 text-sm text-app-muted">
            <Loader2 className="h-4 w-4 animate-spin text-app-accent" />
            {STEPS[stepIndex]}
          </p>
        )}

        {error && <p className="text-sm text-red-400/90">{error}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Generating report...' : 'Generate audit'}
        </Button>
      </form>
    </section>
  )
}
